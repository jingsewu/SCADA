package org.openwe.api.platform.utils.tcp;

import io.netty.bootstrap.ServerBootstrap;
import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;
import io.netty.channel.*;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.pool.FixedChannelPool;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioServerSocketChannel;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.openwes.api.platform.utils.tcp.TcpUtils;

import java.lang.reflect.Field;
import java.net.InetSocketAddress;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeoutException;

import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

public class TcpUtilsTest {

    private EventLoopGroup serverGroup;
    private Channel serverChannel;
    private int port;

    @BeforeEach
    void setUp() throws Exception {
        // Start an embedded TCP server on a random port
        serverGroup = new NioEventLoopGroup();
        ServerBootstrap serverBootstrap = new ServerBootstrap()
                .group(serverGroup)
                .channel(NioServerSocketChannel.class)
                .childHandler(new ChannelInitializer<SocketChannel>() {
                    @Override
                    protected void initChannel(SocketChannel ch) {
                        ch.pipeline().addLast(new EchoServerHandler());
                    }
                });
        ChannelFuture serverFuture = serverBootstrap.bind(0).sync();
        serverChannel = serverFuture.channel();
        port = ((InetSocketAddress) serverChannel.localAddress()).getPort();
    }

    @AfterEach
    void tearDown() throws Exception {
        // Stop the server and clean up
        serverChannel.close().sync();
        serverGroup.shutdownGracefully().sync();
        clearTcpUtilsPoolMap();
    }

    @AfterAll
    static void shutdownEventLoopGroup() throws Exception {
        // Shut down the static event loop group in TcpUtils
        Field eventLoopGroupField = TcpUtils.class.getDeclaredField("eventLoopGroup");
        eventLoopGroupField.setAccessible(true);
        EventLoopGroup eventLoopGroup = (EventLoopGroup) eventLoopGroupField.get(null);
        eventLoopGroup.shutdownGracefully().sync();
    }

    private void clearTcpUtilsPoolMap() throws Exception {
        // Clear the channel pool map between tests
        Field poolMapField = TcpUtils.class.getDeclaredField("poolMap");
        poolMapField.setAccessible(true);
        Map<InetSocketAddress, FixedChannelPool> poolMap =
                (Map<InetSocketAddress, FixedChannelPool>) poolMapField.get(null);
        poolMap.clear();
    }


    @Test
    void testExecute_SuccessfulResponse() throws Exception {
        port = 8085;
        Map<String, Object> apiConfig = createTestConfig();
        String payload = "CONVEYOR_LOG_REPORT|true";
        byte[] response = (byte[]) TcpUtils.execute(apiConfig, payload);
        assertArrayEquals(payload.getBytes(), response);
    }

    @Test
    void testExecute_ConnectionFailed() {
        Map<String, Object> apiConfig = new HashMap<>();
        apiConfig.put("host", "localhost");
        apiConfig.put("port", 12345); // Unused port
        apiConfig.put("maxConnections", 1);
        apiConfig.put("maxPendingAcquires", 10);
        apiConfig.put("timeoutMillis", 1000);

        String payload = "test";
        assertThrows(Exception.class, () -> TcpUtils.execute(apiConfig, payload));
    }

    @Test
    void testExecute_Timeout() throws Exception {
        // Start a server that accepts but doesn't respond
        EventLoopGroup noResponseGroup = new NioEventLoopGroup();
        ServerBootstrap noResponseBootstrap = new ServerBootstrap()
                .group(noResponseGroup)
                .channel(NioServerSocketChannel.class)
                .childHandler(new ChannelInitializer<SocketChannel>() {
                    @Override
                    protected void initChannel(SocketChannel ch) {
                        // No handlers; do nothing
                    }
                });
        ChannelFuture noResponseFuture = noResponseBootstrap.bind(0).sync();
        int noResponsePort = ((InetSocketAddress) noResponseFuture.channel().localAddress()).getPort();

        Map<String, Object> apiConfig = createTestConfig();
        apiConfig.put("port", noResponsePort);
        apiConfig.put("timeoutMillis", 100); // Short timeout

        String payload = "test";
        assertThrows(TimeoutException.class, () -> TcpUtils.execute(apiConfig, payload));

        noResponseFuture.channel().close().sync();
        noResponseGroup.shutdownGracefully().sync();
    }

    private Map<String, Object> createTestConfig() {
        Map<String, Object> apiConfig = new HashMap<>();
        apiConfig.put("host", "localhost");
        apiConfig.put("port", port);
        apiConfig.put("maxConnections", 1);
        apiConfig.put("maxPendingAcquires", 10);
        apiConfig.put("timeoutMillis", 5000);
        return apiConfig;
    }

    private static class EchoServerHandler extends SimpleChannelInboundHandler<ByteBuf> {
        @Override
        protected void channelRead0(ChannelHandlerContext ctx, ByteBuf msg) {
            // Echo the received data back to the client
            ctx.writeAndFlush(msg.retain());
        }

        @Override
        public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {
            cause.printStackTrace();
            ctx.close();
        }
    }
}
