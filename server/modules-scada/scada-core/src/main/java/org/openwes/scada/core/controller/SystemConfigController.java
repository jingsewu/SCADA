package org.openwes.scada.core.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.openwes.scada.api.ISystemConfigApi;
import org.openwes.scada.api.dto.SystemConfigDTO;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("config/system/config")
@Validated
@RequiredArgsConstructor
@Tag(name = "SCADA Module Api")
public class SystemConfigController {

    private final ISystemConfigApi systemConfigApi;

    @PostMapping(value = "createOrUpdate")
    public void createOrUpdate(@RequestBody SystemConfigDTO systemConfigDTO) {
        systemConfigApi.save(systemConfigDTO);
    }

    @PostMapping(value = "getSystemConfig")
    public SystemConfigDTO getSystemConfig() {
        return systemConfigApi.getSystemConfig();
    }
}
