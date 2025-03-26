package org.openwes.scada.core.infrastructure.persistence.po;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.GenericGenerator;
import org.openwes.common.utils.id.IdGenerator;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Data
@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(
        name = "m_conveyor_log"
)
public class ConveyorLogPO {

    @Id
    @GeneratedValue(generator = "databaseIdGenerator")
    @GenericGenerator(name = "databaseIdGenerator", type = IdGenerator.class)
    private Long id;

    private String field1;
    private String field2;
    private String field3;
    private String field4;
    private String field5;
    private String field6;
    private String field7;
    private String field8;
    private String field9;
    private String field10;

    @Column(nullable = false, columnDefinition = "bigint default 0 comment 'Creation time'", updatable = false)
    @CreatedDate
    private Long createTime;
}
