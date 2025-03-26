package org.openwes.scada.core.infrastructure.plc.model;

import lombok.Data;

import java.util.Map;

@Data
public abstract class PLCConfig {
    private String protocol; // e.g., "modbus", "opcua", "mqtt"
    private Long timeout = 60L;
    private String name;
    private Map<String, String> metadata; // Protocol-specific key-value pairs
}
