package org.openwes.api.platform.controller.param.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.openwes.api.platform.api.constants.ApiCallTypeEnum;
import org.openwes.api.platform.api.constants.ProtocolType;

import java.util.Map;

@Data
@Schema(description = "更新接口参数")
public class ApiUpdateParam {

    @NotNull
    @Schema(title = "接口 ID", requiredMode = Schema.RequiredMode.REQUIRED)
    private Long id;

    @NotEmpty(message = "接口编码不能为空")
    @Schema(title = "接口编码（英文大写，用下划线分隔）", requiredMode = Schema.RequiredMode.REQUIRED)
    private String code;

    @NotEmpty(message = "接口名称不能为空")
    @Schema(title = "接口名称", requiredMode = Schema.RequiredMode.REQUIRED)
    private String name;

    @NotNull(message = "接口类型不能为空")
    @Schema(title = "接口类型", requiredMode = Schema.RequiredMode.REQUIRED)
    private ApiCallTypeEnum apiType;

    @NotNull
    private ProtocolType protocol = ProtocolType.HTTP; // Default to HTTP

    @NotEmpty(message = "协议配置不能为空")
    private Map<String, Object> protocolConfig;

    @Schema(title = "是否开启")
    private boolean enabled;

    @Schema(title = "是否同步调用")
    private boolean syncCallback;
}
