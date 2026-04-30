# StudyMate

## Summary

StudyMate is a full-stack web application designed to facilitate user communication through a dedicated chat interface. The project is structured as a monorepo containing an Angular-based frontend and a Java Spring Boot backend. The entire application ecosystem is containerized to ensure consistent development and deployment environments.

## Goal

The primary objective of StudyMate is to provide a reliable, containerized chat application that manages messages and interactions seamlessly between the client interface and the server architecture.

## Tech Stack

* **Frontend**: Angular, TypeScript, and Tailwind CSS.
* **Backend**: Java, Spring Boot, and Maven.
* **Database**: MySQL (for persistent chat and user data storage).
* **DevOps & Tools**: Docker, Docker Compose, and Git (Version Control).

## Features

* **Chat System**: Core functionality is driven by a structured chat architecture, utilizing dedicated controllers, services, and repositories to handle chat message data.
* **Containerized Environments**: Independent Dockerfiles are configured for both the frontend and backend services, orchestrated together via a root docker-compose configuration.
* **Modern UI**: The frontend utilizes Angular with Tailwind CSS for responsive, utility-first styling.

## Project Structure

The repository is organized into two primary directories:

* **frontend**: Contains the Angular workspace, including application routing, chat models, and chat services.
* **studymate-backend**: Contains the Maven-managed Spring Boot application following a standard MVC architecture.

## Getting Started

### Prerequisites

* Docker and Docker Compose
* Node.js and npm (for local frontend development)
* Java Development Kit (JDK) (for local backend development)
* Git (to clone and manage the repository)
* MySQL Server (if running the database locally outside of Docker)

### Running the Application (Docker)

Because the project is fully containerized, you can launch the entire stack using Docker Compose by navigating to the root directory of the project and executing the standard docker-compose build and up commands.

### Local Development

**Frontend**
Navigate to the frontend directory, install the dependencies using npm, and start the development server.

**Backend**
Navigate to the studymate-backend directory and run the application using the Maven wrapper.

## Future Scope

* **Authentication & Authorization**: Implement JWT-based user authentication to secure chat endpoints and manage user identities.
* **Persistent Database Integration**: Connect the backend repository to the MySQL database for permanent message and user data storage.
* **Real-time WebSockets**: Upgrade the standard REST implementation to WebSockets (e.g., using STOMP) for true, low-latency, real-time bidirectional communication.
* **Enhanced UI/UX**: Expand the Angular frontend to include user profiles, chat rooms, and typing indicators.
