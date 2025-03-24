package org.openwes.api.platform.utils.tcp;

import io.netty.bootstrap.Bootstrap;
import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;
import io.netty.channel.Channel;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.pool.FixedChannelPool;
import io.netty.channel.socket.nio.NioSocketChannel;
import io.netty.util.concurrent.Future;
import org.openwes.common.utils.utils.JsonUtils;

import javax.net.ssl.SSLException;
import java.net.InetSocketAddress;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

public class TcpUtils {

    private static final EventLoopGroup eventLoopGroup = new NioEventLoopGroup();
    private static final Map<InetSocketAddress, FixedChannelPool> poolMap = new ConcurrentHashMap<>();

    private static FixedChannelPool createChannelPool(InetSocketAddress address, TcpConfig tcpConfig) throws SSLException {
        Bootstrap bootstrap = new Bootstrap()
                .group(eventLoopGroup)
                .channel(NioSocketChannel.class);

        return new FixedChannelPool(bootstrap.remoteAddress(address),
                new TcpChannelPoolHandler(tcpConfig),
                tcpConfig.maxConnections(),
                tcpConfig.maxPendingAcquires()
        );
    }

    public static Object execute(Map<String, Object> apiConfig, Object payload) throws Exception {
        TcpConfig tcpConfig = JsonUtils.string2Object(JsonUtils.obj2String(apiConfig), TcpConfig.class);
        assert tcpConfig != null;
        InetSocketAddress address = new InetSocketAddress(tcpConfig.host(), tcpConfig.port());

        FixedChannelPool pool = poolMap.computeIfAbsent(address,
                addr -> {
                    try {
                        return createChannelPool(addr, tcpConfig);
                    } catch (SSLException e) {
                        throw new RuntimeException(e);
                    }
                });

        CompletableFuture<Object> responseFuture = new CompletableFuture<>();

        pool.acquire().addListener((Future<Channel> future) -> {
            if (!future.isSuccess()) {
                responseFuture.completeExceptionally(future.cause());
                return;
            }

            Channel channel = future.getNow();
            // Add handler FIRST
            channel.pipeline().addLast(new SimpleChannelInboundHandler<Object>() { // Accept any type
                @Override
                protected void channelRead0(ChannelHandlerContext ctx, Object msg) {
                    try {
                        // Handle both ByteBuf and byte[] automatically
                        byte[] result = deserializeResponse(msg);
                        responseFuture.complete(result);
                    } catch (Exception e) {
                        responseFuture.completeExceptionally(e);
                    } finally {
                        pool.release(channel);
                        ctx.pipeline().remove(this);
                    }
                }

                @Override
                public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {
                    responseFuture.completeExceptionally(cause);
                    pool.release(channel);
                    ctx.pipeline().remove(this);
                }
            });

            // Write payload AFTER adding handler
            channel.writeAndFlush(serializePayload(payload)).addListener(writeFuture -> {
                if (!writeFuture.isSuccess()) {
                    pool.release(channel);
                    responseFuture.completeExceptionally(writeFuture.cause());
                }
            });
        });

        return responseFuture.get(tcpConfig.timeoutMillis(), TimeUnit.MILLISECONDS);
    }

    public static ByteBuf serializePayload(Object payload) {
        if (payload instanceof byte[]) {
            return Unpooled.wrappedBuffer((byte[]) payload);
        }
        return Unpooled.wrappedBuffer(payload.toString().getBytes());
    }


    private static byte[] deserializeResponse(Object msg) {
        if (msg instanceof ByteBuf) {
            ByteBuf buf = (ByteBuf) msg;
            byte[] bytes = new byte[buf.readableBytes()];
            buf.readBytes(bytes);
            buf.release(); // Release Netty buffer
            return bytes;
        } else if (msg instanceof byte[]) {
            return (byte[]) msg;
        }
        throw new IllegalArgumentException("Unsupported message type: " + msg.getClass());
    }
}
