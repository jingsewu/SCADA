package org.openwes.api.platform.utils.tcp;

import io.netty.channel.Channel;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelInboundHandlerAdapter;
import io.netty.channel.pool.FixedChannelPool;

import java.util.concurrent.CompletableFuture;

public class ClientResponseHandler extends ChannelInboundHandlerAdapter {
    private final CompletableFuture<String> responseFuture;
    private final FixedChannelPool pool;
    private final Channel channel;
    private StringBuilder responseBuilder = new StringBuilder();

    ClientResponseHandler(CompletableFuture<String> responseFuture,
                          FixedChannelPool pool, Channel channel) {
        this.responseFuture = responseFuture;
        this.pool = pool;
        this.channel = channel;
    }

    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) {
        if (msg instanceof String) {
            responseBuilder.append((String) msg);
            // Complete future if we receive a full line
            if (((String) msg).endsWith("\n")) {
                completeResponse(responseBuilder.toString().trim(),ctx);
            }
        }
    }

    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {
        completeExceptionally(cause,ctx);
    }

    @Override
    public void channelInactive(ChannelHandlerContext ctx) {
        completeExceptionally(new IllegalStateException("Channel closed before response received"), ctx);
    }

    private void completeResponse(String response, ChannelHandlerContext ctx) {
        responseFuture.complete(response);
        cleanup(channel, pool);
        ctx.close();
    }

    private void completeExceptionally(Throwable cause, ChannelHandlerContext ctx) {
        responseFuture.completeExceptionally(cause);
        cleanup(channel, pool);
        ctx.close();
    }

    private void cleanup(Channel channel, FixedChannelPool pool) {
        channel.pipeline().remove(this);
        pool.release(channel);
    }
}
