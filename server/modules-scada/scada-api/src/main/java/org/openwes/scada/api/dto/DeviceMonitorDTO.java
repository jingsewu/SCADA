package org.openwes.scada.api.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;
import org.openwes.common.utils.base.UpdateUserDTO;

@EqualsAndHashCode(callSuper = true)
@Data
public class DeviceMonitorDTO extends UpdateUserDTO {

    private Long id;

    private String deviceIp;

    private String deviceName;

    private String deviceType;

    private String remark;

    private boolean online;

    private long lastPingTime;
}
