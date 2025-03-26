package org.openwes.scada.core.infrastructure.persistence.po;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.openwes.common.utils.base.UpdateUserPO;
import org.openwes.common.utils.id.IdGenerator;
import org.openwes.scada.core.domain.entity.ConveyorModel;
import org.openwes.scada.core.infrastructure.plc.model.PLCConfig;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(
        name = "m_conveyor_model",
        indexes = {
                @Index(unique = true, name = "uk_conveyor_code", columnList = "conveyorCode")
        }
)
public class ConveyorModelPO extends UpdateUserPO {

    @Id
    @GeneratedValue(generator = "databaseIdGenerator")
    @GenericGenerator(name = "databaseIdGenerator", type = IdGenerator.class)
    private Long id;

    private String areaCode;
    private String conveyorCode;

    @JdbcTypeCode(SqlTypes.JSON)
    private PLCConfig plcConfig;

    @JdbcTypeCode(SqlTypes.JSON)
    private List<ConveyorModel.ConveyorNode> nodes;

}
