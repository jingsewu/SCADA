package org.openwes.scada.core.infrastructure.persistence.po;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.openwes.common.utils.base.UpdateUserPO;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(
        name = "m_color_config",
        indexes = {
                @Index(unique = true, name = "uk_device_type_status", columnList = "deviceType,deviceStatus")
        }
)
public class ColorConfigPO extends UpdateUserPO {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String deviceType;  // e.g. "分拣机"

    @Column(nullable = false)
    private String rgb;

    @Column(nullable = false)
    private int deviceStatus;

    private String description;

    @Column
    private boolean legendVisible;

}
