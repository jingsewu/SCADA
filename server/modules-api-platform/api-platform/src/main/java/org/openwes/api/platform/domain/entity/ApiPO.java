package org.openwes.api.platform.domain.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.openwes.api.platform.api.constants.ApiCallTypeEnum;
import org.openwes.api.platform.api.constants.CallbackApiTypeEnum;
import org.openwes.api.platform.api.constants.ProtocolType;
import org.openwes.api.platform.utils.http.HttpUtils;
import org.openwes.api.platform.utils.tcp.TcpUtils;
import org.openwes.common.utils.base.UpdateUserPO;
import org.openwes.common.utils.constants.MarkConstant;
import org.openwes.common.utils.id.IdGenerator;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.util.Map;

@Data
@Entity
@EntityListeners(AuditingEntityListener.class)
@EqualsAndHashCode(callSuper = false)
@DynamicUpdate
@DynamicInsert
@Table(name = "a_api",
        indexes = {
                @Index(name = "uk_code", columnList = "code", unique = true),
                @Index(name = "idx_api_type", columnList = "apiType")
        })
public class ApiPO extends UpdateUserPO {

    @Id
    @GeneratedValue(generator = "databaseIdGenerator")
    @GenericGenerator(name = "databaseIdGenerator", type = IdGenerator.class)
    private Long id;

    @Column(length = 128, nullable = false)
    private String code;

    @Column(length = 128, nullable = false)
    private String name;

    @Column(length = 1024)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "varchar(20) comment 'api 类型'")
    private ApiCallTypeEnum apiType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "varchar(20) comment '协议类型'")
    private ProtocolType protocol = ProtocolType.HTTP; // Default to HTTP

    @Column(columnDefinition = "json comment '协议专用配置'")
    @JdbcTypeCode(SqlTypes.JSON)
    private Map<String, Object> protocolConfig;

    /**
     * 是否同步执行回调
     */
    private boolean syncCallback = false;

    private boolean enabled;

    public static String generateCode(CallbackApiTypeEnum callbackType, String bizType) {
        return callbackType + MarkConstant.HYPHEN_CHARACTER + bizType;
    }

    public Object execute(Object targetObj) throws Exception {
        if (this.protocol == ProtocolType.HTTP) {
            return HttpUtils.execute(this.protocolConfig, targetObj);
        } else if (this.protocol == ProtocolType.TCP) {
            return TcpUtils.execute(this.protocolConfig, targetObj);
        } else {
            throw new UnsupportedOperationException("Unsupported protocol type: " + this.protocol);
        }
    }

    public String resolveCallbackType() {
        if (this.code.contains(MarkConstant.HYPHEN_CHARACTER)) {
            return this.code.split(MarkConstant.HYPHEN_CHARACTER)[0];
        }
        return this.code;
    }
}
