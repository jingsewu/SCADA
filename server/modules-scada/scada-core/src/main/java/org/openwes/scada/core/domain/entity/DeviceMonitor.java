package org.openwes.scada.core.domain.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;
import org.openwes.common.utils.base.UpdateUserDTO;

@EqualsAndHashCode(callSuper = true)
@Data
public class DeviceMonitor extends UpdateUserDTO {

    private Long id;

    private String deviceIp;

    private String deviceName;

    private String deviceType;

    private String remark;

    private boolean online;

    private long lastPingTime;

    public void ping(boolean status) {
        this.online = status;
        this.lastPingTime = System.currentTimeMillis();
    }
}
