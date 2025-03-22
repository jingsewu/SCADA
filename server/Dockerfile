# Build stage (compile all JARs)
FROM gradle:8.3-jdk17 AS build
WORKDIR /app
COPY . .
RUN gradle  :server:gateway-server:bootJar \
    :server:scada-server:bootJar -x test

# Stage for gateway-server
FROM openjdk:17-jdk-slim AS gateway
COPY --from=build /app/server/gateway-server/build/libs/gateway-server*.jar /app/gateway-server.jar
CMD ["java", "-jar", "/app/gateway-server.jar"]

# Stage for wes-server
FROM openjdk:17-jdk-slim AS scada
COPY --from=build /app/server/scada-server/build/libs/scada-server*.jar /app/scada-server.jar
CMD ["java", "-jar", "/app/scada-server.jar"]
