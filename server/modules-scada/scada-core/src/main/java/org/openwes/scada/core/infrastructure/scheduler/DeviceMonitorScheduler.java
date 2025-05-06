package org.openwes.scada.core.infrastructure.scheduler;

import lombok.RequiredArgsConstructor;
import org.openwes.scada.core.domain.entity.DeviceMonitor;
import org.openwes.scada.core.domain.repository.DeviceMonitorRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.InetAddress;
import java.util.List;

@RequiredArgsConstructor
@Service
public class DeviceMonitorScheduler {

    private final DeviceMonitorRepository deviceMonitorRepository;

    @Scheduled(fixedRate = 5 * 60 * 1000)
    public void checkAndExecutePing() {
        executePing();
    }

    private void executePing() {
        List<DeviceMonitor> devices = deviceMonitorRepository.findAll();
        devices.forEach(device -> {
            boolean status = pingDevice(device.getDeviceIp());
            device.ping(status);
        });
        deviceMonitorRepository.saveAll(devices);
    }

    private boolean pingDevice(String ip) {
        try {
            return InetAddress.getByName(ip).isReachable(3000);
        } catch (IOException e) {
            return false;
        }
    }
}
