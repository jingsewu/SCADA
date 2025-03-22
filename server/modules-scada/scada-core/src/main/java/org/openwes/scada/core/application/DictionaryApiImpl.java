package org.openwes.scada.core.application;

import lombok.RequiredArgsConstructor;
import org.openwes.scada.api.IDictionaryApi;
import org.openwes.scada.api.dto.DictionaryDTO;
import org.openwes.scada.core.domain.repository.DictionaryRepository;
import org.openwes.scada.core.domain.transfer.DictionaryTransfer;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

@Validated
@Service
@RequiredArgsConstructor
public class DictionaryApiImpl implements IDictionaryApi {

    private final DictionaryRepository dictionaryRepository;
    private final DictionaryTransfer dictionaryTransfer;

    @Override
    public void save(DictionaryDTO dictionaryDTO) {
        dictionaryRepository.save(dictionaryTransfer.toDO(dictionaryDTO));
    }

    @Override
    public void update(DictionaryDTO dictionaryDTO) {
        dictionaryRepository.save(dictionaryTransfer.toDO(dictionaryDTO));
    }

    @Override
    public DictionaryDTO getByCode(String code) {
        return dictionaryTransfer.toDTO(dictionaryRepository.findByCode(code));
    }
}
