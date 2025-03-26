package org.openwes.scada.core.domain.repository;

import org.openwes.scada.core.domain.entity.ColorConfig;

public interface ColorConfigRepository {
    void save(ColorConfig config);

    void delete(Long id);
}
