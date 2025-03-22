package org.openwes.scada.core.infrastructure.repository.impl;

import lombok.RequiredArgsConstructor;
import org.openwes.common.utils.constants.RedisConstants;
import org.openwes.scada.core.domain.entity.Dictionary;
import org.openwes.scada.core.domain.repository.DictionaryRepository;
import org.openwes.scada.core.infrastructure.persistence.mapper.DictionaryPORepository;
import org.openwes.scada.core.infrastructure.persistence.po.DictionaryPO;
import org.openwes.scada.core.infrastructure.persistence.transfer.DictionaryPOTransfer;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DictionaryRepositoryImpl implements DictionaryRepository {

    private final DictionaryPORepository dictionaryPORepository;
    private final DictionaryPOTransfer dictionaryPOTransfer;

    @Override
    @Caching(evict = {
            @CacheEvict(cacheNames = RedisConstants.DICTIONARY_CACHE, key = "#dictionary.code"),
    })
    public void save(Dictionary dictionary) {
        dictionaryPORepository.save(dictionaryPOTransfer.toPO(dictionary));
    }

    @Override
    public Dictionary findById(Long id) {
        DictionaryPO dictionaryPO = dictionaryPORepository.findById(id).orElseThrow();
        return dictionaryPOTransfer.toDO(dictionaryPO);
    }

    @Override
    @Cacheable(cacheNames = RedisConstants.DICTIONARY_CACHE, key = "#code")
    public Dictionary findByCode(String code) {
        return dictionaryPOTransfer.toDO(dictionaryPORepository.findByCode(code));
    }

    @Override
    public List<Dictionary> getAll() {
        return dictionaryPOTransfer.toDOs(dictionaryPORepository.findAll());
    }

    @Override
    @CacheEvict(cacheNames = RedisConstants.DICTIONARY_CACHE, allEntries = true)
    public void saveAll(List<Dictionary> dictionary) {
        dictionaryPORepository.saveAll(dictionaryPOTransfer.toPOs(dictionary));
    }
}
