package org.openwes.scada.core.infrastructure.plc.model;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class OPCUAConfig extends PLCConfig {
    private String endpointUrl = "opcua.tcp://localhost:4840";
    private String securityPolicy = "None";
    private Identity identity = new Identity();

    public OPCUAConfig() {
        setProtocol("opcua");
    }

    @Data
    public static class Identity {
        private IdentityType type = IdentityType.ANONYMOUS;
        private String username;
        private String password;
        private String certPath;
        private String keyPath;
    }

    public enum IdentityType {
        ANONYMOUS, USERNAME, CERTIFICATE
    }
}
