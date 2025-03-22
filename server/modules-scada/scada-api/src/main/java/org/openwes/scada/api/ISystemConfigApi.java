package org.openwes.scada.api;


import org.openwes.scada.api.dto.SystemConfigDTO;

public interface ISystemConfigApi {

    void save(SystemConfigDTO systemConfigDTO);

    void update(SystemConfigDTO systemConfigDTO);

    SystemConfigDTO getSystemConfig();

}
