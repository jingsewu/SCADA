package org.openwes.scada.core.domain.repository;


import org.openwes.scada.core.domain.entity.Dictionary;

import java.util.List;

public interface DictionaryRepository {

    void save(Dictionary dictionary);

    void saveAll(List<Dictionary> dictionary);

    Dictionary findById(Long id);

    Dictionary findByCode(String code);

    List<Dictionary> getAll();
}
