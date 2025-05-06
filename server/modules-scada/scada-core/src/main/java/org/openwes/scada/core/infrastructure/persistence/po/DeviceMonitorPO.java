package org.openwes.scada.core.infrastructure.persistence.po;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.GenericGenerator;
import org.openwes.common.utils.base.UpdateUserPO;
import org.openwes.common.utils.id.IdGenerator;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(
        name = "m_device_monitor",
        indexes = {
                @Index(unique = true, name = "uk_device_id", columnList = "deviceIp")
        }
)
public class DeviceMonitorPO extends UpdateUserPO {

    @Id
    @GeneratedValue(generator = "databaseIdGenerator")
    @GenericGenerator(name = "databaseIdGenerator", type = IdGenerator.class)
    private Long id;

    private String deviceIp;

    private String deviceName;

    private String deviceType;

    private String remark;

    private boolean online;

    private long lastPingTime;
}
