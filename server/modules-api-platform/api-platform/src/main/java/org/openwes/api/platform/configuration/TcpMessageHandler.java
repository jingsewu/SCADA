package org.openwes.api.platform.configuration;

import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.openwes.api.platform.api.IRequestApi;
import org.springframework.stereotype.Component;

@Component
@Slf4j
@RequiredArgsConstructor
public class TcpMessageHandler extends SimpleChannelInboundHandler<String> {

    private final IRequestApi requestApi;

    @Override
    protected void channelRead0(ChannelHandlerContext ctx, String msg) {

        // 1. Parse message format: "apiType|body"
        String[] parts = msg.split("\\|", 2);
        if (parts.length != 2) {
            log.warn("Received message is not format with signal: {} and the message is: {} ", "|", msg);
            ctx.writeAndFlush("Invalid message format");
            return;
        }

        String apiType = parts[0];
        String body = parts[1];

        // 2. Process request using existing logic
        Object response = requestApi.request(apiType, body);

        // 3. Send response back via TCP
        ctx.writeAndFlush(response.toString() + "\n");
    }

    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {
        log.error("Error processing message", cause);
        ctx.writeAndFlush("Error: " + cause.getMessage() + "\n");
        ctx.close();
    }
}
