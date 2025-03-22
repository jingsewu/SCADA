package org.openwes.scada.core.infrastructure.persistence.transfer;

import org.mapstruct.Mapper;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;
import org.openwes.scada.core.domain.entity.Dictionary;
import org.openwes.scada.core.infrastructure.persistence.po.DictionaryPO;

import java.util.List;

import static org.mapstruct.NullValueCheckStrategy.ALWAYS;
import static org.mapstruct.NullValueMappingStrategy.RETURN_NULL;

@Mapper(componentModel = "spring",
        nullValueCheckStrategy = ALWAYS,
        nullValueMappingStrategy = RETURN_NULL,
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface DictionaryPOTransfer {
    DictionaryPO toPO(Dictionary dictionary);

    List<DictionaryPO> toPOs(List<Dictionary> dictionary);

    Dictionary toDO(DictionaryPO id);

    List<Dictionary> toDOs(List<DictionaryPO> dictionaryPOS);
}
