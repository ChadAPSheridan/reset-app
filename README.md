# Reset

## Overview
Reset is a minimalist, Kanban-style project management tool designed for small programming teams. It emphasizes frictionless task management and encourages iterative progress through regular "reset moments" for sprint planning and retrospectives.

## Features
- **Fresh Start Sprints**: Clear the board at the start of each sprint and re-prioritize tasks.
- **Lightweight Kanban Board**: Customizable lanes and dependencies visualization.
- **Integrated Developer Tools**: Connect with code repositories and attach inline snippets.
- **Reflection and Iteration**: Retro board for team reflections and progress snapshots.
- **Minimal Overhead**: Quick task creation and simple permissions.

## Tech Stack
- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Express.js, MariaDB (with Sequelize ORM)
- **Server**: Nginx

## Project Structure
```
reset-app
├── backend          # Backend server code
│   ├── src
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
├── frontend         # Frontend application code
│   ├── src
│   ├── public
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── README.md
├── nginx            # Nginx configuration
│   └── nginx.conf
└── README.md        # Project overview
```

## Setup Instructions
1. Clone the repository.
2. Navigate to the `backend` directory and run `npm install` to install backend dependencies.
3. Navigate to the `frontend` directory and run `npm install` to install frontend dependencies.
4. Configure the database connection in the backend.
5. Start the backend server using `npm start` in the `backend` directory.
6. Start the frontend application using `npm start` in the `frontend` directory.
7. Access the application at `http://localhost:3000`.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License.