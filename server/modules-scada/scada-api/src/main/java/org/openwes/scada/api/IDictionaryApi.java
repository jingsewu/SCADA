package org.openwes.scada.api;

import jakarta.validation.Valid;
import org.openwes.scada.api.dto.DictionaryDTO;

public interface IDictionaryApi {

    void save(@Valid DictionaryDTO dictionaryDTO);

    void update(@Valid DictionaryDTO dictionaryDTO);

    DictionaryDTO getByCode(String code);
}
