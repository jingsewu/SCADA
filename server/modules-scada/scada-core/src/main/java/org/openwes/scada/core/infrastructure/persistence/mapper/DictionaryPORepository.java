package org.openwes.scada.core.infrastructure.persistence.mapper;

import org.openwes.scada.core.infrastructure.persistence.po.DictionaryPO;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DictionaryPORepository extends JpaRepository<DictionaryPO, Long> {

    DictionaryPO findByCode(String code);
}

