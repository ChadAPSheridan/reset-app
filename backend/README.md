# Reset Backend Documentation

## Overview
Reset is a minimalist Kanban-style project management tool designed for small programming teams. This backend service is built using Express.js and TypeScript, providing a RESTful API for task management.

## Features
- **Task Management**: Create, read, update, and delete tasks.
- **User Integration**: Link tasks to specific users.
- **Database Support**: Utilizes MariaDB with Sequelize ORM for data management.

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- MariaDB (already set up)

### Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   cd reset-app/backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure your database connection in the `src/config/config.json` file (create this file if it doesn't exist).

### Running the Application
To start the server, run:
```
npm start
```
The server will be available at `http://localhost:3000`.

### API Endpoints
- **POST /tasks**: Create a new task.
- **GET /tasks**: Retrieve all tasks.
- **PUT /tasks/:id**: Update a task by ID.
- **DELETE /tasks/:id**: Delete a task by ID.

### Testing
To run tests, use:
```
npm test
```

## Folder Structure
- `src/controllers`: Contains the task controller for handling requests.
- `src/models`: Defines the task model using Sequelize.
- `src/routes`: Sets up API routes for task operations.
- `src/services`: Contains business logic related to tasks.
- `src/app.ts`: Initializes the Express application.
- `src/server.ts`: Entry point for the backend server.

## License
This project is licensed under the MIT License. See the LICENSE file for details.