package org.openwes.scada.core.infrastructure.repository.impl;

import lombok.RequiredArgsConstructor;
import org.openwes.scada.core.domain.entity.ConveyorModel;
import org.openwes.scada.core.domain.repository.ConveyorModelRepository;
import org.openwes.scada.core.infrastructure.persistence.mapper.ConveyorModelPORepository;
import org.openwes.scada.core.infrastructure.persistence.transfer.ConveyorModelPOTransfer;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ConveyorModelRepositoryImpl implements ConveyorModelRepository {

    private final ConveyorModelPORepository conveyorModelPOMapper;
    private final ConveyorModelPOTransfer conveyorModelPOTransfer;

    @Override
    @CacheEvict(value = "conveyorModel", allEntries = true)
    public void save(ConveyorModel conveyorModel) {
        conveyorModelPOMapper.save(conveyorModelPOTransfer.toPO(conveyorModel));
    }

    @Override
    public List<ConveyorModel> findAllByArea(String areaCode) {
        return conveyorModelPOTransfer.toDOs(conveyorModelPOMapper.findAllByAreaCode(areaCode));
    }

    @Cacheable("conveyorModel")
    @Override
    public List<ConveyorModel> findAll() {
        return conveyorModelPOTransfer.toDOs(conveyorModelPOMapper.findAll());
    }

    @Override
    public ConveyorModel findById(Long id) {
        return conveyorModelPOTransfer.toDO(conveyorModelPOMapper.findById(id).orElseThrow());
    }

    @Override
    @CacheEvict(value = "conveyorModel", allEntries = true)
    public void deleteById(Long id) {
        conveyorModelPOMapper.deleteById(id);
    }
}
