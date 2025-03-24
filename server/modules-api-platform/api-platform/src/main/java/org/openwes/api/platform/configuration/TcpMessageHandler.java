package org.openwes.api.platform.configuration;

import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;
import org.openwes.api.platform.api.IRequestApi;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class TcpMessageHandler extends SimpleChannelInboundHandler<String> {

    @Autowired
    private IRequestApi requestApi;

    @Override
    protected void channelRead0(ChannelHandlerContext ctx, String msg) {
        // 1. Parse message format: "apiType|body"
        String[] parts = msg.split("\\|", 2);
        if (parts.length != 2) {
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
        ctx.writeAndFlush("Error: " + cause.getMessage() + "\n");
        ctx.close();
    }
}
