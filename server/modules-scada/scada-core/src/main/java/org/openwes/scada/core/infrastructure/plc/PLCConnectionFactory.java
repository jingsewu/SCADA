package org.openwes.scada.core.infrastructure.plc;

import org.apache.plc4x.java.DefaultPlcDriverManager;
import org.apache.plc4x.java.api.PlcConnection;
import org.apache.plc4x.java.api.PlcDriverManager;
import org.apache.plc4x.java.api.exceptions.PlcConnectionException;
import org.openwes.scada.core.infrastructure.plc.model.ModbusConfig;
import org.openwes.scada.core.infrastructure.plc.model.OPCUAConfig;
import org.openwes.scada.core.infrastructure.plc.model.PLCConfig;
import org.springframework.stereotype.Component;

@Component
public class PLCConnectionFactory {

    private final PlcDriverManager driverManager = new DefaultPlcDriverManager();

    public PlcConnection getConnection(PLCConfig config) throws PlcConnectionException {
        switch (config.getProtocol().toLowerCase()) {
            case "modbus":
                return createModbusConnection((ModbusConfig) config);
            case "opcua":
                return createOPCUAConnection((OPCUAConfig) config);
            // Add more protocols here
            default:
                throw new IllegalArgumentException("Unsupported protocol: " + config.getProtocol());
        }
    }

    private PlcConnection createModbusConnection(ModbusConfig config) throws PlcConnectionException {
        String url = String.format(
                "modbus-tcp://%s:%d?unit-identifier=%d",
                config.getHost(), config.getPort(), config.getSlaveId()
        );
        return driverManager.getConnectionManager().getConnection(url);
    }

    private PlcConnection createOPCUAConnection(OPCUAConfig config) throws PlcConnectionException {
        String url = String.format(
                "opcua:tcp://%s?discovery=false&securityPolicy=%s&authentication=%s",
                config.getEndpointUrl(),
                config.getSecurityPolicy(),
                config.getIdentity().getType().name().toLowerCase()
        );
        return driverManager.getConnectionManager().getConnection(url);
    }
}
