package org.openwes.api.platform.configuration;

import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioServerSocketChannel;
import io.netty.handler.codec.LineBasedFrameDecoder;
import io.netty.handler.codec.string.StringDecoder;
import io.netty.handler.codec.string.StringEncoder;
import io.netty.util.CharsetUtil;
import lombok.RequiredArgsConstructor;
import org.openwes.api.platform.api.IRequestApi;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class TcpServerConfig {

    @Value("${tcp.port:8085}")
    private int port;

    private final IRequestApi requestApi;

    @Bean
    public ApplicationRunner nettyServer() {
        return args -> {
            EventLoopGroup bossGroup = new NioEventLoopGroup();
            EventLoopGroup workerGroup = new NioEventLoopGroup();

            try {
                ServerBootstrap b = new ServerBootstrap();
                b.group(bossGroup, workerGroup)
                        .channel(NioServerSocketChannel.class)
                        .childHandler(new ChannelInitializer<SocketChannel>() {
                            @Override
                            protected void initChannel(SocketChannel ch) {
                                ch.pipeline()
                                        .addLast(new LineBasedFrameDecoder(1024))
                                        .addLast(new StringDecoder(CharsetUtil.UTF_8))
                                        .addLast(new StringEncoder(CharsetUtil.UTF_8))
                                        .addLast(new TcpMessageHandler(requestApi));
                            }
                        });

                b.bind(port).sync().channel().closeFuture().sync();
            } finally {
                bossGroup.shutdownGracefully();
                workerGroup.shutdownGracefully();
            }
        };
    }
}
