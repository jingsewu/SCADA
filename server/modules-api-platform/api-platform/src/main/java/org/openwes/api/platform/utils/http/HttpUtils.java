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
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

public class HttpUtils {

    private static final Map<String, String> TOKEN_CACHE = new ConcurrentHashMap<>();
    private static final OkHttpClient DEFAULT_CLIENT = new OkHttpClient();

    public static CompletableFuture<Response> executeAsync(Map<String, Object> config, Object body) {

        return CompletableFuture.supplyAsync(() -> {
            try {
                return execute(config, body);
            } catch (Exception e) {
                throw new RuntimeException(e);
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
        OkHttpClient.Builder builder = DEFAULT_CLIENT.newBuilder()
                .connectTimeout(config.getTimeoutMillis(), TimeUnit.MILLISECONDS)
                .readTimeout(config.getTimeoutMillis(), TimeUnit.MILLISECONDS);

        // Configure SSL
        if (config.isEnableSsl()) {
            builder.sslSocketFactory(createInsecureSslSocketFactory())
                    .hostnameVerifier((hostname, session) -> true);
        }

        // Configure authentication
        if (config.isEnableAuth() && config.getAuthConfig() != null) {
            builder.authenticator((route, response) -> {
                String token = null;
                try {
                    token = getAccessToken(config.getAuthConfig());
                } catch (Exception e) {
                    throw new RuntimeException(e);
                }
                return response.request().newBuilder()
                        .header("Authorization", "Bearer " + token)
                        .build();
            });
        }

        return builder.build();
    }

    private static Request buildRequest(HttpConfig config, Object body) throws Exception {
        Request.Builder builder = new Request.Builder()
                .url(config.getUrl())
                .headers(Headers.of(config.getHeadersWithDefaults()));

        // Set request body
        if (body != null) {
            MediaType mediaType = MediaType.parse(config.getContentType());
            String content = serializeBody(body, config);
            builder.method(config.getMethod(), RequestBody.create(content, mediaType));
        }

        return builder.build();
    }

    private static String serializeBody(Object body, HttpConfig config) throws Exception {
        Charset charset = Charset.forName(config.getEncoding());
        return JsonUtils.obj2String(body);
    }

    // Modified getAccessToken method
    private static String getAccessToken(HttpConfig.AuthConfig authConfig) throws Exception {
        String cacheKey = authConfig.getSecretId() + authConfig.getGrantType();
        if (TOKEN_CACHE.containsKey(cacheKey)) {
            return TOKEN_CACHE.get(cacheKey);
        }

        synchronized (HttpUtils.class) {
            OkHttpClient client = new OkHttpClient();
            Charset charset = Charset.forName(authConfig.getEncodingOrDefault());

            // Build form parameters
            List<String> params = new ArrayList<>();
            params.add("grant_type=" + URLEncoder.encode(authConfig.getGrantType(), charset));

            if ("password".equalsIgnoreCase(authConfig.getGrantType())) {
                params.add("username=" + URLEncoder.encode(authConfig.getUsername(), charset));
                params.add("password=" + URLEncoder.encode(authConfig.getPassword(), charset));
            }

            // Build form body
            RequestBody formBody = RequestBody.create(
                    String.join("&", params),
                    MediaType.parse("application/x-www-form-urlencoded; charset=" + charset.name())
            );

            // Create Basic Auth header
            String credentials = authConfig.getSecretId() + ":" + authConfig.getSecretKey();
            String base64Credentials = Base64.getEncoder().encodeToString(
                    credentials.getBytes(charset)
            );

            Request request = new Request.Builder()
                    .url(authConfig.getAuthUrl())
                    .post(formBody)
                    .header("Authorization", "Basic " + base64Credentials)
                    .build();

            try (Response response = client.newCall(request).execute()) {
                if (!response.isSuccessful()) {
                    throw new IOException("Authentication failed. Code: " + response.code());
                }

                String responseBody = response.body().string();
                JsonNode json = JsonUtils.objectToJsonNode(responseBody);

                if (!json.has(authConfig.getTokenName())) {
                    throw new IOException("Token field missing in response: " + authConfig.getTokenName());
                }

                String token = json.get(authConfig.getTokenName()).asText();
                TOKEN_CACHE.put(cacheKey, token);
                return token;
            }
        }
    }

    // SSL Bypass for testing (remove in production)
    private static final TrustManager[] INSECURE_TRUST_MANAGER = new TrustManager[]{
            new X509TrustManager() {
                public void checkClientTrusted(X509Certificate[] chain, String authType) {
                }

                public void checkServerTrusted(X509Certificate[] chain, String authType) {
                }

                public X509Certificate[] getAcceptedIssuers() {
                    return new X509Certificate[]{};
                }
            }
    };

    private static SSLSocketFactory createInsecureSslSocketFactory() {
        try {
            SSLContext sslContext = SSLContext.getInstance("SSL");
            sslContext.init(null, INSECURE_TRUST_MANAGER, new SecureRandom());
            return sslContext.getSocketFactory();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
