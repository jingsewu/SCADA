package org.openwes.scada.api.dto;

import lombok.Data;

import java.io.Serializable;

@Data
public class SystemConfigDTO implements Serializable {

    private Long id;

    private Long version;

}
