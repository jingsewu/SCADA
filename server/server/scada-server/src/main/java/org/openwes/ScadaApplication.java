package org.openwes;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication(scanBasePackages = {"org.openwes"})
@Slf4j
public class ScadaApplication {

    public static void main(String[] args) {
        SpringApplication.run(ScadaApplication.class, args);
    }

}
