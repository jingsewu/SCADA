package org.openwes.scada.core.domain.repository;

import org.openwes.scada.core.domain.entity.ConveyorModel;

import java.util.List;

public interface ConveyorModelRepository {

    void save(ConveyorModel conveyorModel);

    List<ConveyorModel> findAllByArea(String area);

    List<ConveyorModel> findAll();

    ConveyorModel findById(Long id);

    void deleteById(Long id);
}
