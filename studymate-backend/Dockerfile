# Stage 1: Build the application using Java 25
FROM maven:3.9-eclipse-temurin-25 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
# Builds the .jar file and skips tests to speed it up
RUN mvn clean package -DskipTests 

# Stage 2: Run the application using Java 25
FROM eclipse-temurin:25-jre-alpine
WORKDIR /app
# Copy the built .jar file from the previous stage
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]