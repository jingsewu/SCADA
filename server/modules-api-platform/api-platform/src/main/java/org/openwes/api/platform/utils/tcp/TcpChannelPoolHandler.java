package org.openwes.api.platform.utils.tcp;

import io.netty.buffer.Unpooled;
import io.netty.channel.Channel;
import io.netty.channel.ChannelPipeline;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.channel.pool.ChannelPoolHandler;
import io.netty.handler.codec.DelimiterBasedFrameDecoder;
import io.netty.handler.codec.string.StringDecoder;
import io.netty.handler.codec.string.StringEncoder;
import io.netty.handler.ssl.SslContext;
import io.netty.handler.ssl.SslContextBuilder;
import io.netty.handler.ssl.util.InsecureTrustManagerFactory;

import javax.net.ssl.SSLException;
import java.nio.charset.StandardCharsets;

public class TcpChannelPoolHandler implements ChannelPoolHandler {

    private final TcpConfig tcpConfig;
    private final SslContext sslContext;

    public TcpChannelPoolHandler(TcpConfig tcpConfig) throws SSLException {
        this.tcpConfig = tcpConfig;
        this.sslContext = createSslContext(tcpConfig);
    }

    @Override
    public void channelCreated(Channel ch) {
        // Initialize channel pipeline
        ChannelPipeline pipeline = ch.pipeline();

        // SSL/TLS
        if (tcpConfig.sslConfig() != null && tcpConfig.sslConfig().enabled()) {
            pipeline.addLast(sslContext.newHandler(ch.alloc()));
        }

        // Frame handling
        String delimiter = tcpConfig.delimiter();
        pipeline.addLast(new DelimiterBasedFrameDecoder(
                8192,
                Unpooled.wrappedBuffer(delimiter.getBytes())
        ));

        // Codecs
        pipeline.addLast(new StringDecoder(StandardCharsets.UTF_8));
        pipeline.addLast(new StringEncoder(StandardCharsets.UTF_8));
    }

    @Override
    public void channelAcquired(Channel ch) {
        // Called when a channel is acquired from the pool
        // Reset any state if needed
    }

    @Override
    public void channelReleased(Channel ch) {
        // Called when a channel is released back to the pool
        // Clean up any residual data
        ch.pipeline().context(SimpleChannelInboundHandler.class).disconnect();
    }

    private SslContext createSslContext(TcpConfig config) throws SSLException {
        if (config.sslConfig() == null || !config.sslConfig().enabled()) return null;
        return SslContextBuilder.forClient()
                .trustManager(InsecureTrustManagerFactory.INSTANCE) // Replace with real certs
                .build();
    }
}
