# Stage 1: Build the application using Maven and Temurin JDK 17
FROM maven:3.9-eclipse-temurin-17-alpine AS build
WORKDIR /app

# Copy the pom.xml file to download dependencies first (caching layer)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy the source code and build the application package (skipping tests for speed)
COPY src ./src
RUN mvn clean package -DskipTests -B

# Stage 2: Lightweight runtime using Temurin JRE 17
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy the built JAR file from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose the port the Spring Boot app listens on (default 8080)
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]

