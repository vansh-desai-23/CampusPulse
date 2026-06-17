# CampusPulse

**Live Application:** [https://campus-pulse-pearl.vercel.app/](https://campus-pulse-pearl.vercel.app/)

CampusPulse is a comprehensive, full-stack event and logistics management platform designed to streamline college festival operations. It provides a centralized infrastructure for students to discover and register for events, and for organizers to manage ticketing, roster approvals, and on-ground logistics. 

## System Architecture

The application follows a standard client-server architecture, decoupled into a RESTful API backend and a single-page application (SPA) frontend.

### Technology Stack

| Component | Technology | Description |
|-----------|------------|-------------|
| Frontend | React (Vite) | SPA for user interfaces, state management, and client-side routing. |
| Backend | Spring Boot (Java 17) | REST API, business logic, persistence layers, and security. |
| Database | MySQL | Relational data persistence, managed via Hibernate/JPA. |
| Security | Spring Security & JWT | Stateless, token-based authentication and endpoint authorization. |

## In-Depth Core Features

The platform implements strict Role-Based Access Control (RBAC) mapping to three distinct user archetypes:

### 1. Student Interface
- **Dynamic Event Discovery:** Students can browse upcoming college festivals, view deeply nested individual event details, and review specific organizational guidelines.
- **Stateful Registration Pipeline:** Complex registration logic handling capacity constraints and timezone-aware deadlines. Registrations transition through states (e.g., Pending, Approved, Rejected).
- **Digital Wallet & Cryptographic Ticketing:** Upon approval, students receive a secure digital ticket in their wallet. These tickets are rendered as QR codes powered by a unique token generated via cryptographic hashing on the backend, preventing ticket forgery.

### 2. Organizer Dashboard
- **Logistics & Capacity Management:** Real-time controls over event metadata, scheduling, and participant capacity limits.
- **Participant Tracking & Roster Management:** A dedicated interface to review pending registrations, selectively approve/reject participants based on capacity, and actively monitor registration counts.
- **Authenticated CSV Exports:** Organizers can download dynamically generated CSV rosters of approved participants, built securely on the server-side, for on-ground team distribution.
- **On-Ground Operations:** Mechanisms to validate student QR tickets securely during the event to ensure physical entry matches digital approval.

### 3. SuperAdmin Controls
- **Global Oversight:** Complete view of all fests, events, and the assignment of organizer roles to specific user accounts.

## Security & Technical Implementations

The application utilizes several robust backend engineering practices to ensure security, data integrity, and consistency across environments:

### Spring Security & JWT Implementation
- **Stateless Authentication:** The backend operates without HTTP sessions. Upon successful login, the `JwtUtils` component generates a signed JSON Web Token (JWT) with an expiration window and the user's encoded roles.
- **Custom Security Filter Chain:** A custom `OncePerRequestFilter` intercepts all incoming HTTP requests, extracts the Bearer token from the `Authorization` header, mathematically validates the signature against the backend secret, and populates the `SecurityContextHolder`.
- **Method-Level Security:** Endpoints are protected using `@PreAuthorize` annotations (e.g., `@PreAuthorize("hasRole('ORGANIZER')")`), ensuring horizontal and vertical privilege escalation is prevented.

### Cryptographic QR Ticketing
- **Secure Token Generation:** Ticket tokens are not simple incremental IDs. The `TicketGenerationService` creates unique, collision-resistant hashes combining the user ID, event ID, and a secure salt. This ensures tickets cannot be guessed, scraped, or forged.

### Global Timezone Standardization
- **Environment Consistency:** To solve discrepancies between frontend browser timezones, Docker container timezones, and database server timezones, the application enforces `Asia/Kolkata` globally. This is standardized across the JVM (`@PostConstruct`), JDBC configuration, and Jackson JSON serializers (`spring.jackson.time-zone`), ensuring event registration deadlines evaluate correctly regardless of the physical deployment server location.

### Cross-Origin Resource Sharing (CORS)
- **Granular CORS Configuration:** Spring Web MVC is configured to explicitly allow `GET`, `POST`, `PUT`, `DELETE`, and `OPTIONS` requests from the Vercel frontend, while securely handling preflight requests and `Authorization` headers.

## Deployment Architecture

The application is fully deployed and accessible in a production environment:

- **Frontend (Vercel):** The React application is built and served via Vercel's Edge Network for high availability and low latency.
- **Backend (Render):** The Spring Boot application runs as a containerized Web Service on Render, leveraging a multi-stage Docker build for an optimized, lightweight runtime image.
- **Database (Aiven):** A fully managed MySQL instance hosted on Aiven, secured with required SSL configurations.

## Local Development Setup

To run CampusPulse locally for development or testing, follow the steps below.

### Prerequisites
- Java 17 or higher
- Node.js (v16+)
- MySQL (v8.0+)
- Maven

### 1. Database Configuration
1. Start your local MySQL server.
2. Create a new database schema named `campus_fests`.
```sql
CREATE DATABASE campus_fests;
```

### 2. Backend Setup
1. Navigate to the backend directory:
```bash
cd backend
```
2. The application is configured to connect to `localhost:3306` by default. If your local MySQL credentials differ from `root` / `password`, override them by exporting the environment variables `DB_USERNAME` and `DB_PASSWORD`.
3. Build and run the Spring Boot application:
```bash
./mvnw clean install -DskipTests
./mvnw spring-boot:run
```
The backend will automatically initialize the database schema and seed initial data upon the first run. It will be available at `http://localhost:8080`.

### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```
2. Install the JavaScript dependencies:
```bash
npm install
```
3. Start the Vite development server:
```bash
npm run dev
```
The frontend will be accessible at `http://localhost:5173`. By default, it is configured to communicate with the local backend on port 8080.

## Environment Variables Reference

For production deployments, the following environment variables are utilized:

### Backend
- `DB_URL`: JDBC connection string (e.g., `jdbc:mysql://<host>:<port>/<db>?sslMode=REQUIRED`)
- `DB_USERNAME`: Database username
- `DB_PASSWORD`: Database password
- `JWT_SECRET`: A cryptographic secret key for signing authentication tokens
- `DDL_AUTO`: Set to `validate` or `none` to prevent schema overwrites
- `SQL_INIT_MODE`: Set to `never` to prevent data re-seeding

### Frontend
- `VITE_API_BASE_URL`: The base URL of the deployed backend REST API.
