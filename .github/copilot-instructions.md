# .github/copilot-instructions.md

This is a PERN (PostgreSQL, Express, React, Node.js) stack application for schedule management.

## Project Structure

- `server/` - Backend Node.js/Express API
- `client/` - Frontend React application

## Backend (server/)
- Express.js REST API
- PostgreSQL database
- JWT authentication
- bcryptjs for password hashing

## Frontend (client/)
- React with Vite
- React Router for navigation
- Axios for HTTP requests
- Context API for state management

## Key Features
- User authentication (register/login)
- Schedule management (CRUD operations)
- User profile management
- Responsive design

## API Endpoints
- `/api/auth` - Authentication routes
- `/api/users` - User management
- `/api/schedules` - Schedule CRUD operations

## Development Guidelines
- Use environment variables for sensitive data
- Follow RESTful API conventions
- Implement proper error handling
- Use middleware for authentication
- Maintain responsive design patterns
