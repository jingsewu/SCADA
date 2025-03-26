package org.openwes.scada.core.infrastructure.websocket.service;

import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import jakarta.validation.constraints.NotNull;
import lombok.extern.slf4j.Slf4j;
import org.openwes.common.utils.utils.JsonUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;
import java.util.*;

@Service
@Slf4j
public class ScadaWebSocketService {

    private final Map<String, List<WebSocketSession>> sessionMap = Maps.newConcurrentMap();
    private final Set<WebSocketSession> replaySessions = new HashSet<>();

    public void registerSession(WebSocketSession session, String projectName) {

        if (sessionMap.get(projectName) == null) {
            sessionMap.put(projectName, Lists.newArrayList(session));
        } else {
            sessionMap.get(projectName).add(session);
        }
    }

    public void removeSession(WebSocketSession session) throws IOException {
        log.info("remove session: {}", session.getId());
        replaySessions.remove(session);

        synchronized (sessionMap) {
            sessionMap.values().stream().filter(list -> list.contains(session))
                    .forEach(list -> list.remove(session));
        }

        session.close();
    }

    public void broadcastMessage(Object message, String projectName) {
        synchronized (sessionMap) {
            if (sessionMap.get(projectName) == null) {
                return;
            }

            sessionMap.get(projectName).stream().filter(Objects::nonNull).filter(WebSocketSession::isOpen)
                    .forEach(session -> {
                        try {
                            session.sendMessage(new TextMessage(JsonUtils.obj2String(message)));
                        } catch (IOException e) {
                            log.info("Error sending message to session: {}", session.getId(), e);
                        }
                    });
        }
    }

    public void registerReplaySession(WebSocketSession session) {
        log.info("register replay session: {}", session.getId());
        replaySessions.add(session);
    }

    public void closeSession(WebSocketSession session) {
        try {
            log.info("close replay session: {}", session.getId());
            replaySessions.remove(session);
            session.close();
        } catch (IOException e) {
            log.error("Error closing session: {}", session.getId(), e);
        }
    }

    public boolean isReplaySessionExist(WebSocketSession session) {
        return replaySessions.contains(session);
    }

    public void broadcastMessage(String logMessage, @NotNull WebSocketSession session) {
        if (!session.isOpen()) {
            return;
        }
        try {
            session.sendMessage(new TextMessage(logMessage));
        } catch (IOException e) {
            log.info("Error sending message to session: {}", session.getId(), e);
        }
    }
}
