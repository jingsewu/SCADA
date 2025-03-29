package org.openwes.scada.core.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.openwes.scada.core.domain.entity.ConveyorModel;
import org.openwes.scada.core.domain.repository.ConveyorModelRepository;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("conveyor")
@Slf4j
@RequiredArgsConstructor
@Validated
@Tag(name = "SCADA Module Api")
public class ConveyorController {

    private final ConveyorModelRepository conveyorModelRepository;

    public static volatile boolean openMock = false;

    @PostMapping("create")
    public void save(@RequestBody ConveyorModel conveyorModel) {
        conveyorModelRepository.save(conveyorModel);
    }

    @PostMapping("update")
    public void update(@RequestBody ConveyorModel conveyorModel) {
        conveyorModelRepository.save(conveyorModel);
    }

    @GetMapping("findAll")
    public Object findAll() {
        if (openMock) {
            return ConveyorMockService.conveyorDatabase.values();
        }
        return conveyorModelRepository.findAll();
    }

    @GetMapping("find")
    public Object find(@RequestParam(value = "area", required = false) String area) {
        return conveyorModelRepository.findAllByArea(area);
    }

    @GetMapping("get/{id}")
    public ConveyorModel get(@PathVariable("id") Long id) {
        return conveyorModelRepository.findById(id);
    }

    @DeleteMapping("{id}")
    public void delete(@PathVariable("id") Long id) {
        conveyorModelRepository.deleteById(id);
    }

    @GetMapping("openMock")
    public void openMock() {
        openMock = true;
    }

}
