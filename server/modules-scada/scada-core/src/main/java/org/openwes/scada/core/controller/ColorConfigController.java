package org.openwes.scada.core.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.openwes.scada.core.domain.entity.ColorConfig;
import org.openwes.scada.core.domain.repository.ColorConfigRepository;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("color-config")
@RequiredArgsConstructor
@Tag(name = "SCADA Module Api")
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
