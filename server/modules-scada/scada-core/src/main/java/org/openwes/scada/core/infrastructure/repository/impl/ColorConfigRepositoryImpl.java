package org.openwes.scada.core.infrastructure.repository.impl;

import lombok.RequiredArgsConstructor;
import org.openwes.scada.core.domain.entity.ColorConfig;
import org.openwes.scada.core.domain.repository.ColorConfigRepository;
import org.openwes.scada.core.infrastructure.persistence.mapper.ColorConfigPORepository;
import org.openwes.scada.core.infrastructure.persistence.transfer.ColorConfigPOTransfer;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ColorConfigRepositoryImpl implements ColorConfigRepository {

    private final ColorConfigPORepository colorConfigPORepository;
    private final ColorConfigPOTransfer colorConfigPOTransfer;

    @Override
    public void save(ColorConfig config) {
        colorConfigPORepository.save(colorConfigPOTransfer.toPO(config));
    }

    @Override
    public void delete(Long id) {
        colorConfigPORepository.deleteById(id);
    }
}
