package org.openwes.api.platform.utils.tcp;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

public record TcpConfig(
        @NotBlank String host,
        @Positive int port,
        @JsonProperty("ssl") SslConfig sslConfig,
        String delimiter,
        @Positive int maxConnections,
        @Positive int maxPendingAcquires,
        @Positive long timeoutMillis
) {
    public record SslConfig(
            boolean enabled,
            String protocol,
            String truststorePath,
            String keystorePath
    ) {
    }

    // Default values for optional parameters
    public TcpConfig {
        delimiter = delimiter != null ? delimiter : "\n";
        maxConnections = maxConnections > 0 ? maxConnections : 10;
        timeoutMillis = timeoutMillis > 0 ? timeoutMillis : 10000L;
    }
}
