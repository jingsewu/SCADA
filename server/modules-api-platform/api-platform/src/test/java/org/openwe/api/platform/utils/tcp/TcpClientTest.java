package org.openwe.api.platform.utils.tcp;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.Socket;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

public class TcpClientTest {
    private static final String TEST_MESSAGE = "Hello Server!";
    private static final String HOST = "localhost";
    private static final int PORT = 8085;
    private static final int TIMEOUT_SECONDS = 10;

    @Test
    public void testServerCommunication() throws IOException {
        final String TEST_MESSAGE = "Hello Server!\n";  // Note the newline
        final int TIMEOUT_MS = 5000;

        try (Socket socket = new Socket("localhost", 8085);
             PrintWriter out = new PrintWriter(socket.getOutputStream(), true);
             BufferedReader in = new BufferedReader(new InputStreamReader(socket.getInputStream()))) {

            socket.setSoTimeout(TIMEOUT_MS);

            // Send message
            out.print(TEST_MESSAGE);  // Use print() instead of println()
            out.flush();

            // Read response
            String response = in.readLine();
            Assertions.assertNotNull(response, "No response from server");
            Assertions.assertEquals("ACK: Hello Server!", response);
        }
    }
}
