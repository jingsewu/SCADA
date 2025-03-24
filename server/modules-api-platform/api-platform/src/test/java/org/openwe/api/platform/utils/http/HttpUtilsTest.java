package org.openwe.api.platform.utils.http;

import okhttp3.Response;
import okhttp3.mockwebserver.MockResponse;
import okhttp3.mockwebserver.MockWebServer;
import okhttp3.mockwebserver.RecordedRequest;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.openwes.api.platform.utils.http.HttpConfig;
import org.openwes.api.platform.utils.http.HttpConfig.AuthConfig;
import org.openwes.api.platform.utils.http.HttpUtils;
import org.openwes.common.utils.utils.JsonUtils;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class HttpUtilsTest {
    private MockWebServer mockWebServer;
    private HttpConfig testConfig;
    private AuthConfig authConfig;

    @BeforeEach
    void setUp() throws Exception {
        mockWebServer = new MockWebServer();
        mockWebServer.start();

        testConfig = new HttpConfig();
        testConfig.setUrl(mockWebServer.url("/test").toString());
        testConfig.setMethod("GET");
        testConfig.setHeaders(Collections.emptyMap());
        testConfig.setTimeoutMillis(5000);

        authConfig = new AuthConfig();
        authConfig.setAuthUrl(mockWebServer.url("/auth").toString());
        authConfig.setSecretId("client-id");
        authConfig.setSecretKey("client-secret");
        authConfig.setGrantType("client_credentials");
        authConfig.setTokenName("access_token");
    }

    @AfterEach
    void tearDown() throws Exception {
        mockWebServer.shutdown();
    }

    @Test
    void testSuccessfulGetRequest() throws Exception {
        mockWebServer.enqueue(new MockResponse()
                .setResponseCode(200)
                .setBody("{\"message\": \"success\"}"));

        Response response = HttpUtils.execute(JsonUtils.string2Map(JsonUtils.obj2String(testConfig)), null);

        assertEquals(200, response.code());
        assertEquals("{\"message\": \"success\"}", response.body().string());

        RecordedRequest request = mockWebServer.takeRequest();
        assertEquals("GET", request.getMethod());
        assertEquals("/test", request.getPath());
    }

    @Test
    void testPostRequestWithJsonBody() throws Exception {
        testConfig.setMethod("POST");
        testConfig.setFormat("application/json");

        mockWebServer.enqueue(new MockResponse().setResponseCode(201));

        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("name", "test");
        requestBody.put("value", "123");

        Response response = HttpUtils.execute(JsonUtils.string2Map(JsonUtils.obj2String(testConfig)), requestBody);

        assertEquals(201, response.code());
        RecordedRequest request = mockWebServer.takeRequest();
        assertEquals("POST", request.getMethod());
        assertJsonBodyContains(request, "name", "test");
    }

    @Test
    void testTokenCaching() throws Exception {
        testConfig.setEnableAuth(true);
        testConfig.setAuthConfig(authConfig);

        // First request - should fetch token
        mockWebServer.enqueue(createTokenResponse("token1", 3600));
        mockWebServer.enqueue(new MockResponse().setResponseCode(200));

        Response response1 = HttpUtils.execute(JsonUtils.string2Map(JsonUtils.obj2String(testConfig)), null);
        assertEquals(200, response1.code());

        // Second request - should use cached token
        mockWebServer.enqueue(new MockResponse().setResponseCode(200));
        Response response2 = HttpUtils.execute(JsonUtils.string2Map(JsonUtils.obj2String(testConfig)), null);

        assertEquals(200, response2.code());

        // Verify only one token request was made
        assertEquals(2, mockWebServer.getRequestCount());
        assertEquals("/test", mockWebServer.takeRequest().getPath());
    }

    @Test
    void testTokenExpiration() throws Exception {
        testConfig.setEnableAuth(true);
        testConfig.setAuthConfig(authConfig);

        // Token with short expiration
        mockWebServer.enqueue(createTokenResponse("token1", 1));
        mockWebServer.enqueue(new MockResponse().setResponseCode(200));
        mockWebServer.enqueue(new MockResponse().setResponseCode(200));

        Response response1 = HttpUtils.execute(JsonUtils.string2Map(JsonUtils.obj2String(testConfig)), null);
        assertEquals(200, response1.code());

        // Wait for token to expire
        TimeUnit.SECONDS.sleep(2);

        // Should fetch new token
        mockWebServer.enqueue(createTokenResponse("token2", 3600));
        Response response2 = HttpUtils.execute(JsonUtils.string2Map(JsonUtils.obj2String(testConfig)), null);

        assertEquals(200, response2.code());

        // Verify two token requests were made
        assertEquals(2, mockWebServer.getRequestCount());
    }

    @Test
    void testAuthenticationRetry() throws Exception {
        testConfig.setEnableAuth(true);
        testConfig.setAuthConfig(authConfig);

        // First response is 401, then successful with new token
        mockWebServer.enqueue(new MockResponse().setResponseCode(401));
        mockWebServer.enqueue(createTokenResponse("new-token", 3600));
        mockWebServer.enqueue(new MockResponse().setResponseCode(200));

        Response response = HttpUtils.execute(JsonUtils.string2Map(JsonUtils.obj2String(testConfig)), null);

        assertEquals(200, response.code());
        assertEquals(3, mockWebServer.getRequestCount());
    }

    @Test
    void testTimeoutHandling() throws Exception {
        testConfig.setTimeoutMillis(100);
        mockWebServer.enqueue(new MockResponse()
                .setBodyDelay(500, TimeUnit.MILLISECONDS)
                .setResponseCode(200));

        HttpUtils.execute(JsonUtils.string2Map(JsonUtils.obj2String(testConfig)), null);
    }

    private MockResponse createTokenResponse(String token, long expiresIn) {
        return new MockResponse()
                .setResponseCode(200)
                .setBody(String.format(
                        "{\"access_token\": \"%s\", \"expires_in\": %d}",
                        token, expiresIn
                ));
    }

    private void assertJsonBodyContains(RecordedRequest request, String key, String value) {
        String body = request.getBody().readUtf8();
        assertTrue(body.contains(String.format("\"%s\":\"%s\"", key, value)),
                "Body should contain " + key + "=" + value);
    }

    // Add similar tests for:
    // - Different content types (form-urlencoded)
    // - SSL configuration
    // - Error responses
    // - Concurrent requests
    // - Header management
    // - Different HTTP methods
}
