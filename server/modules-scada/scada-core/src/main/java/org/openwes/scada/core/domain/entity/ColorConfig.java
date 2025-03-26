package org.openwes.scada.core.domain.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;
import org.openwes.common.utils.base.UpdateUserDTO;

@EqualsAndHashCode(callSuper = true)
@Data
public class ColorConfig extends UpdateUserDTO {

    private Long id;

    private String deviceType;  // e.g. "分拣机"

    private String rgb;

    private int deviceStatus;

    private String description;

    private boolean legendVisible;

}
