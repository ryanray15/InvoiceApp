# Invoice Application

A full-stack invoice management application built with Spring Boot and vanilla JavaScript.

## Tech Stack

### Backend

- Java 20
- Spring Boot 3.1.0
- Spring Data JPA
- MySQL Database
- Maven 3.9.x

### Frontend

- HTML5
- Vanilla JavaScript
- TailwindCSS
- VS Code Live Server

### Development Tools

- Visual Studio Code
- MySQL Workbench (optional)
- Git

## Project Setup Instructions

### Prerequisites

- Java 20
- MySQL (no password configuration)
- Maven
- VS Code Live Server extension (for frontend)

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Add Maven to path and run the Spring Boot application:
   ```bash
   $env:PATH += ";C:\Program Files\Apache\maven\bin"
   mvn spring-boot:run
   ```
   The backend will start on `http://localhost:8080`

### Frontend Setup

1. Open the frontend directory in VS Code
2. Right-click on `index.html` and select "Open with Live Server"
   - This will start the frontend on `http://127.0.0.1:5500` or similar port

## Time Allocation (Total: 2 hours)

The project was completed in approximately 2 hours, with time divided between:

- Initial project setup and configuration
- Backend development (Spring Boot, MySQL)
- Frontend implementation (HTML, JavaScript, TailwindCSS)
- Testing and bug fixing
- Documentation

## Features

### Completed (Core Objectives)

- Create new invoices with multiple line items
- Auto-generated invoice numbers
- Calculate total amounts automatically
- List all invoices in a table view
- Change invoice status (paid/unpaid)
- Filter invoices by status
- Persistent data storage with MySQL
- Responsive UI

### Not Completed (Advanced Objectives)

- Client Management
- Overdue Handling
- Authentication
- Invoice PDF Export
- Dark Mode (Optional)

## Development Approach

The development process followed a structured approach:

1. Started with setting up the basic project structure for both frontend and backend
2. Implemented the core data model and database connectivity
3. Created RESTful API endpoints for invoice operations
4. Developed the frontend user interface with TailwindCSS
5. Implemented frontend functionality for invoice management
6. Added features like automatic calculations and status management
7. Tested and fixed cross-origin issues and calculation bugs

## Future Improvements

If given a chance, I would do the advanced objectives.

## Known Limitations and Bugs

1. CORS Configuration: The application is currently configured to work with specific localhost ports (8080 for backend, 5500 for frontend). For production deployment, this would need to be updated.

2. Error Handling: While basic error handling is implemented, it could be more robust with:

   - More specific error messages
   - Better validation feedback
   - Proper logging mechanisms

3. Database Security: Current implementation uses root MySQL user without password (for development only). In a production environment, proper database security should be implemented.

4. No Input Validation: The application could benefit from more strict input validation, especially for:
   - Dates (ensuring due date is after issue date)
   - Numbers (preventing negative values)
   - Required fields validation
