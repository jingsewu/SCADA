package org.openwes.api.platform.utils.http;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import org.apache.commons.lang3.StringUtils;

import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

@Data
public class HttpConfig {

    private String url = "";

    @Pattern(regexp = "GET|POST|PUT|PATCH|DELETE", message = "Invalid HTTP method")
    private String method = "GET";

    private String encoding = StandardCharsets.UTF_8.name();

    private String format = "JSON";

    private Map<String, String> headers = new HashMap<>();

    private boolean enableAuth;
    private AuthConfig authConfig;
    private long timeoutMillis = 10000;
    private boolean enableSsl;

    @Data
    public static class AuthConfig {

        @NotBlank
        private String authUrl;

        private String grantType = "client_credentials";

        private String username;

        private String password;

        private String secretId;

        private String secretKey;

        private String tokenName = "access_token";
        private String encodingOrDefault = StandardCharsets.UTF_8.name();
    }

    // Validation rules
    public boolean isValid() {
        if (authConfig != null) {
            return switch (authConfig.grantType) {
                case "password" -> !StringUtils.isAnyBlank(authConfig.username, authConfig.password);
                case "client_credentials" -> !StringUtils.isAnyBlank(authConfig.secretId, authConfig.secretKey);
                default -> false;
            };
        }
        return true;
    }

    // Default headers setup
    public Map<String, String> getHeadersWithDefaults() {
        Map<String, String> combined = new HashMap<>();
        combined.put("Content-Type", getContentType());
        combined.putAll(headers);
        return combined;
    }

    public String getContentType() {
        return switch (format.toUpperCase()) {
            case "XML" -> "application/xml";
            case "TEXT" -> "text/plain";
            default -> "application/json";
        };
    }
}
