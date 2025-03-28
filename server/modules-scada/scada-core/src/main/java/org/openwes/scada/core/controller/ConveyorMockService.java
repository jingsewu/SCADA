package org.openwes.scada.core.controller;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.openwes.scada.core.domain.entity.ConveyorModel;
import org.openwes.scada.core.infrastructure.websocket.service.ScadaWebSocketService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ConveyorMockService {

    // Mock database storage
    public final static Map<Long, ConveyorModel> conveyorDatabase = new ConcurrentHashMap<>();
    private final Random random = new Random();

    private final ScadaWebSocketService scadaWebSocketService;

    // Initialize with some mock conveyors
    @PostConstruct
    public void initializeMockConveyors() {
        // Create 3 mock conveyors
        int conveyorCount = new Random().nextInt(1, 4);
        for (long i = 1; i <= conveyorCount; i++) {
            ConveyorModel conveyor = new ConveyorModel();
            conveyor.setId(i);
            conveyor.setAreaCode("AREA-" + i);
            conveyor.setConveyorCode("CONV-" + i);

            // Create nodes in a linear path
            int nodeCount = 20;
            List<ConveyorModel.ConveyorNode> nodes = getConveyorNodes(nodeCount, i);
            conveyor.setNodes(nodes);

            conveyorDatabase.put(i, conveyor);
        }
    }

    private static List<ConveyorModel.ConveyorNode> getConveyorNodes(int nodeCount, long i) {
        List<ConveyorModel.ConveyorNode> nodes = new ArrayList<>();
        for (int j = 1; j <= nodeCount; j++) {
            ConveyorModel.ConveyorNode node = new ConveyorModel.ConveyorNode();
            node.setNodeCode("NODE-" + j);
            node.setNextNodeCodes(j < nodeCount ? "NODE-" + (j + 1) : ""); // Last node has no next
            node.setAddress("DB" + i + ",W" + (j * 10)); // Mock PLC address
            node.setHasBox(false);
            nodes.add(node);
        }
        return nodes;
    }

    // Get all conveyors
    public List<ConveyorModel> getAllConveyors() {
        return new ArrayList<>(conveyorDatabase.values());
    }

    // Get conveyor by ID
    public Optional<ConveyorModel> getConveyorById(Long id) {
        return Optional.ofNullable(conveyorDatabase.get(id));
    }

    // Simulate box movement every 3 seconds
    @Scheduled(fixedRate = 1000)
    public void simulateConveyorMovement() {

        if (!ConveyorController.openMock) {
            return;
        }

        conveyorDatabase.values().forEach(conveyor -> {
            List<ConveyorModel.ConveyorNode> nodes = conveyor.getNodes();

            // Move from end to beginning to avoid concurrent modification
            for (int i = nodes.size() - 1; i >= 0; i--) {
                ConveyorModel.ConveyorNode node = nodes.get(i);

                if (node.isHasBox()) {
                    // Try to move to next node
                    if (!node.getNextNodeCodes().isEmpty()) {
                        Optional<ConveyorModel.ConveyorNode> nextNode = nodes.stream()
                                .filter(n -> n.getNodeCode().equals(node.getNextNodeCodes()))
                                .findFirst();

                        if (nextNode.isPresent() && !nextNode.get().isHasBox()) {
                            // Move box to next node
                            nextNode.get().setHasBox(true);
                            nextNode.get().setContainerCode(node.getContainerCode());
                            node.setHasBox(false);
                            node.setContainerCode(null);
                        }
                    }
                }
            }

            // Randomly add new boxes at the start (10% chance)
            if (random.nextInt(5) == 0 && !nodes.isEmpty() && !nodes.get(0).isHasBox()) {
                nodes.get(0).setHasBox(true);
                nodes.get(0).setContainerCode("CONT-" + System.currentTimeMillis());
            }

            if (nodes.stream().anyMatch(ConveyorModel.ConveyorNode::isHasBox)) {
                scadaWebSocketService.broadcastMessage(conveyor, "");
            }
        });
    }

    @Scheduled(fixedRate = 20000)
    public void removeLastNodeContainer() {
        if (!ConveyorController.openMock) {
            return;
        }
        conveyorDatabase.values().forEach(conveyor -> {
            removeBoxFromConveyor(conveyor.getId());
        });
    }

    // Force add a box to the first node of a conveyor
    public boolean addBoxToConveyor(Long conveyorId, String containerCode) {
        return conveyorDatabase.computeIfPresent(conveyorId, (id, conveyor) -> {
            if (!conveyor.getNodes().isEmpty() && !conveyor.getNodes().get(0).isHasBox()) {
                conveyor.getNodes().get(0).setHasBox(true);
                conveyor.getNodes().get(0).setContainerCode(containerCode);
                return conveyor;
            }
            return conveyor;
        }) != null;
    }

    // Remove box from the last node of a conveyor
    public Optional<String> removeBoxFromConveyor(Long conveyorId) {
        List<ConveyorModel.ConveyorNode> nodes = conveyorDatabase.computeIfPresent(conveyorId, (id, conveyor) -> {
            if (!conveyor.getNodes().isEmpty()) {
                ConveyorModel.ConveyorNode lastNode = conveyor.getNodes().get(conveyor.getNodes().size() - 1);
                if (lastNode.isHasBox()) {
                    String containerCode = lastNode.getContainerCode();
                    lastNode.setHasBox(false);
                    lastNode.setContainerCode(null);
                    return conveyor;
                }
            }
            return conveyor;
        }).getNodes();

        return nodes.isEmpty() ? Optional.empty() : Optional.ofNullable(nodes.get(nodes.size() - 1).getContainerCode());
    }

    // Get all nodes with boxes
    public Map<String, String> getAllBoxPositions() {
        return conveyorDatabase.values().stream()
                .flatMap(conveyor -> conveyor.getNodes().stream()
                        .filter(ConveyorModel.ConveyorNode::isHasBox)
                        .map(node -> new AbstractMap.SimpleEntry<>(
                                conveyor.getConveyorCode() + ":" + node.getNodeCode(),
                                node.getContainerCode()
                        )))
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
    }
}
