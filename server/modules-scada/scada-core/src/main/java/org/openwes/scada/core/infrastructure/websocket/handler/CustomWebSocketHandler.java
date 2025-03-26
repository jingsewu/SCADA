package org.openwes.scada.core.infrastructure.websocket.handler;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.openwes.scada.core.infrastructure.websocket.service.ScadaWebSocketService;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

@RequiredArgsConstructor
@Slf4j
@Component
public class CustomWebSocketHandler extends TextWebSocketHandler {

    private final ScadaWebSocketService webSocketService;

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        webSocketService.registerSession(session, "");
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        webSocketService.removeSession(session);
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) {
        // Handle incoming messages from the client if needed
    }

}
