package org.openwes.api.platform.utils.tcp;

import io.netty.bootstrap.Bootstrap;
import io.netty.channel.Channel;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.pool.FixedChannelPool;
import io.netty.channel.socket.nio.NioSocketChannel;
import io.netty.util.concurrent.Future;
import lombok.extern.slf4j.Slf4j;
import org.openwes.common.utils.utils.JsonUtils;

import javax.net.ssl.SSLException;
import java.net.InetSocketAddress;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

@Slf4j
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

        if (payload == null) {
            log.warn("payload is null");
            return null;
        }

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

        CompletableFuture<String> responseFuture = new CompletableFuture<>();

        pool.acquire().addListener((Future<Channel> future) -> {
            if (!future.isSuccess()) {
                responseFuture.completeExceptionally(future.cause());
                return;
            }

            Channel channel = future.getNow();
            channel.pipeline().addLast(new ClientResponseHandler(responseFuture, pool, channel));

            // Write payload AFTER adding handler
            String message = JsonUtils.obj2String(payload);
            String formattedMessage = message.endsWith("\n") ? message : message + "\n";
            channel.writeAndFlush(formattedMessage).addListener(writeFuture -> {
                if (!writeFuture.isSuccess()) {
                    pool.release(channel);
                    responseFuture.completeExceptionally(writeFuture.cause());
                }
            });
        });

        return responseFuture.get(tcpConfig.timeoutMillis(), TimeUnit.MILLISECONDS);
    }

}
