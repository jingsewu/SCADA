package org.openwes.scada.core.domain.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;
import org.openwes.common.utils.base.UpdateUserDTO;

@EqualsAndHashCode(callSuper = true)
@Data
public class SystemConfig extends UpdateUserDTO {

    private Long id;

    private Long version;
}
