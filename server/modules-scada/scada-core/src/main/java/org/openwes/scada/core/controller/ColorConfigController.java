package org.openwes.scada.core.controller;

import lombok.RequiredArgsConstructor;
import org.openwes.scada.core.domain.entity.ColorConfig;
import org.openwes.scada.core.domain.repository.ColorConfigRepository;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/color-config")
@RequiredArgsConstructor
public class ColorConfigController {

    private final ColorConfigRepository colorConfigRepository;

    @PostMapping("createOrUpdate")
    public void createOrUpdate(@RequestBody ColorConfig config) {
        colorConfigRepository.save(config);
    }

    @PostMapping("/delete/{id}")
    public void delete(@PathVariable("id") Long id) {
        colorConfigRepository.delete(id);
    }
}
