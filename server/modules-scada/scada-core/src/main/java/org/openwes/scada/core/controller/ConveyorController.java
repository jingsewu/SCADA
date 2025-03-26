package org.openwes.scada.core.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.openwes.scada.core.domain.entity.ConveyorModel;
import org.openwes.scada.core.domain.repository.ConveyorModelRepository;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/scada/conveyor")
@Slf4j
@RequiredArgsConstructor
@Validated
public class ConveyorController {

    private final ConveyorModelRepository conveyorModelRepository;

    @PostMapping("create")
    public void save(@RequestBody ConveyorModel conveyorModel) {
        conveyorModelRepository.save(conveyorModel);
    }

    @PutMapping("update")
    public void update(@RequestBody ConveyorModel conveyorModel) {
        conveyorModelRepository.save(conveyorModel);
    }

    @GetMapping("findAll")
    public Object findAll() {
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

}
