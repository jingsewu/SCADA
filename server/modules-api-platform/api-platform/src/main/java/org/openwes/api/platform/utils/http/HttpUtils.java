package org.openwes.api.platform.utils.http;

import com.fasterxml.jackson.databind.JsonNode;
import okhttp3.*;
import org.openwes.common.utils.utils.JsonUtils;

import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSocketFactory;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.Charset;
import java.security.SecureRandom;
import java.security.cert.X509Certificate;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionException;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

public class HttpUtils {

    private static final Map<String, TokenInfo> TOKEN_CACHE = new ConcurrentHashMap<>();
    private static final ConnectionPool CONNECTION_POOL = new ConnectionPool(5, 5, TimeUnit.MINUTES);
    private static final OkHttpClient SHARED_CLIENT = createBaseClient().build();

    private static OkHttpClient.Builder createBaseClient() {
        return new OkHttpClient.Builder()
                .connectionPool(CONNECTION_POOL)
                .connectTimeout(30, TimeUnit.SECONDS)
                .readTimeout(30, TimeUnit.SECONDS)
                .writeTimeout(30, TimeUnit.SECONDS);
    }

    public static CompletableFuture<Response> executeAsync(Map<String, Object> config, Object body) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                return execute(config, body);
            } catch (Exception e) {
                throw new CompletionException(e);
            }
        });
    }

    public static Response execute(Map<String, Object> config, Object body) throws Exception {
        HttpConfig httpConfig = JsonUtils.string2Object(JsonUtils.obj2String(config), HttpConfig.class);
        OkHttpClient client = buildHttpClient(httpConfig);
        Request request = buildRequest(httpConfig, body);
        return client.newCall(request).execute();
    }

    private static OkHttpClient buildHttpClient(HttpConfig config) {
        OkHttpClient.Builder builder = SHARED_CLIENT.newBuilder();

        // Configure Timeouts
        builder.connectTimeout(config.getTimeoutMillis(), TimeUnit.MILLISECONDS)
                .readTimeout(config.getTimeoutMillis(), TimeUnit.MILLISECONDS);

        // Configure SSL
        if (config.isEnableSsl()) {
            builder.sslSocketFactory(createInsecureSslSocketFactory(), (X509TrustManager) INSECURE_TRUST_MANAGER[0])
                    .hostnameVerifier((hostname, session) -> true);
        }

        // Configure Authentication
        if (config.isEnableAuth() && config.getAuthConfig() != null) {
            builder.authenticator((route, response) -> {
                try {
                    String token = getAccessToken(config.getAuthConfig());
                    return response.request().newBuilder()
                            .header("Authorization", "Bearer " + token)
                            .build();
                } catch (Exception e) {
                    throw new RuntimeException("Authentication failed", e);
                }
            });
        }

        return builder.build();
    }

    private static Request buildRequest(HttpConfig config, Object body) throws Exception {
        Request.Builder builder = new Request.Builder()
                .url(Objects.requireNonNull(config.getUrl(), "URL must not be null"))
                .headers(Headers.of(Objects.requireNonNull(
                        config.getHeadersWithDefaults(),
                        "Headers must not be null"
                )));

        String method = config.getMethod().toUpperCase();
        if (body != null) {
            MediaType mediaType = MediaType.parse(
                    Objects.requireNonNull(config.getContentType(), "Content-Type must be specified for body requests")
            );
            String content = serializeBody(body, config, mediaType);
            builder.method(method, RequestBody.create(content, mediaType));
        } else {
            if (requiresBody(method)) {
                builder.method(method, RequestBody.create("", null));
            } else {
                builder.method(method, null);
            }
        }

        return builder.build();
    }

    private static boolean requiresBody(String method) {
        return Arrays.asList("POST", "PUT", "PATCH").contains(method.toUpperCase());
    }

    private static String serializeBody(Object body, HttpConfig config, MediaType mediaType) throws Exception {
        if (mediaType.subtype().equals("json")) {
            return JsonUtils.obj2String(body);
        } else if (mediaType.subtype().equals("x-www-form-urlencoded")) {
            return encodeFormParams((Map<String, String>) body, config.getEncoding());
        }
        throw new IllegalArgumentException("Unsupported media type: " + mediaType);
    }

    private static String encodeFormParams(Map<String, String> params, String encoding) throws Exception {
        Charset charset = Charset.forName(encoding);
        List<String> encodedParams = new ArrayList<>();
        for (Map.Entry<String, String> entry : params.entrySet()) {
            encodedParams.add(
                    URLEncoder.encode(entry.getKey(), charset.name()) + "=" +
                            URLEncoder.encode(entry.getValue(), charset.name())
            );
        }
        return String.join("&", encodedParams);
    }

    private static String getAccessToken(HttpConfig.AuthConfig authConfig) throws Exception {
        String cacheKey = authConfig.getSecretId() + authConfig.getGrantType();
        TokenInfo cachedToken = TOKEN_CACHE.get(cacheKey);

        if (cachedToken != null && cachedToken.isExpired()) {
            return cachedToken.token;
        }

        synchronized (HttpUtils.class) {
            // Double-check after synchronization
            cachedToken = TOKEN_CACHE.get(cacheKey);
            if (cachedToken != null && cachedToken.isExpired()) {
                return cachedToken.token;
            }

            Request request = buildTokenRequest(authConfig);
            try (Response response = SHARED_CLIENT.newCall(request).execute()) {
                if (!response.isSuccessful()) {
                    throw new IOException("Authentication failed. Code: " + response.code());
                }

                ResponseBody responseBody = response.body();
                if (responseBody == null) {
                    throw new IOException("Empty authentication response");
                }

                JsonNode json = JsonUtils.objectToJsonNode(responseBody.string());
                String tokenField = authConfig.getTokenName();
                String expiresInField = authConfig.getExpiresInField();

                if (!json.has(tokenField)) {
                    throw new IOException("Missing token field: " + tokenField);
                }

                String token = json.get(tokenField).asText();
                long expiresIn = json.has(expiresInField) ?
                        json.get(expiresInField).asLong() :
                        3600; // default 1 hour

                TOKEN_CACHE.put(cacheKey, new TokenInfo(token, expiresIn));
                return token;
            }
        }
    }

    private static Request buildTokenRequest(HttpConfig.AuthConfig authConfig) {
        Charset charset = Charset.forName(authConfig.getEncodingOrDefault());
        FormBody.Builder formBuilder = new FormBody.Builder(charset)
                .add("grant_type", authConfig.getGrantType());

        if ("password".equalsIgnoreCase(authConfig.getGrantType())) {
            formBuilder.add("username", authConfig.getUsername())
                    .add("password", authConfig.getPassword());
        }

        String credentials = Credentials.basic(
                authConfig.getSecretId(),
                authConfig.getSecretKey(),
                charset
        );

        return new Request.Builder()
                .url(authConfig.getAuthUrl())
                .post(formBuilder.build())
                .header("Authorization", credentials)
                .build();
    }

    private static class TokenInfo {
        final String token;
        final long expirationTime;

        TokenInfo(String token, long expiresInSeconds) {
            this.token = token;
            this.expirationTime = System.currentTimeMillis() + (expiresInSeconds * 1000);
        }

        boolean isExpired() {
            return System.currentTimeMillis() < expirationTime;
        }
    }

    // SSL Configuration (Should be disabled in production)
    private static final TrustManager[] INSECURE_TRUST_MANAGER = {new InsecureTrustManager()};
    private static SSLSocketFactory INSECURE_SSL_SOCKET_FACTORY = createInsecureSslSocketFactory();

    private static class InsecureTrustManager implements X509TrustManager {
        public void checkClientTrusted(X509Certificate[] chain, String authType) {
        }

        public void checkServerTrusted(X509Certificate[] chain, String authType) {
        }

        public X509Certificate[] getAcceptedIssuers() {
            return new X509Certificate[0];
        }
    }

    private static SSLSocketFactory createInsecureSslSocketFactory() {
        try {
            SSLContext sslContext = SSLContext.getInstance("TLS");
            sslContext.init(null, INSECURE_TRUST_MANAGER, new SecureRandom());
            return sslContext.getSocketFactory();
        } catch (Exception e) {
            throw new RuntimeException("Failed to create insecure SSL context", e);
        }
    }
}
