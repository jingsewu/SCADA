package org.openwes.scada.core.infrastructure.plc.model;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class ModbusConfig extends PLCConfig {
    private String host = "127.0.0.1";
    private Integer port = 502;
    private Integer slaveId = 1;

    public ModbusConfig() {
        setProtocol("modbus");
    }
}
