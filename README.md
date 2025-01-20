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
- **Frontend**: React, TypeScript, CSS
- **Backend**: Express.js, MariaDB (with Sequelize ORM)
- **Server**: Nginx

## Project Structure
```


## Setup Instructions
1. Clone the repository.
2. Navigate to the `backend` directory and run `npm install` to install backend dependencies.
3. Navigate to the `frontend` directory and run `npm install` to install frontend dependencies.
4. Configure the database connection in the backend.
5. Start the backend server using `npm start` in the `backend` directory.
6. Start the frontend application using `npm start` in the `frontend` directory.
7. Access the application at `http://localhost:3000`. (If that port is unavailable, it will say in the console output.)

### Configuration
1. Configure the database connection in the backend:
- Update the database configuration in [backend/src/config/database.ts](backend/src/config/database.ts) with your MariaDB credentials.
2. Configure Nginx:
- Update the Nginx configuration in [nginx/nginx.conf](nginx/nginx.conf) to point to the correct paths for your setup.

## Deploying to NGINX server
To deploy your application on an Nginx web server, follow these steps:

1. Build the Frontend
First, build the frontend application to generate the production-ready files.

This will create a dist directory with the production build of your frontend.

2. Configure Nginx
Update your Nginx configuration to serve the frontend and proxy API requests to the backend.

Edit the Nginx configuration file nginx.conf:

Replace /path/to/reset-app/frontend/dist with the actual path to your frontend dist directory.

3. Start the Backend Server
Ensure your backend server is running. You can start it using:

4. Restart Nginx
Restart Nginx to apply the new configuration:

5. Access the Application
Open your web browser and navigate to http://your_domain_or_ip. Your application should be up and running.

Summary
Build the frontend.
Update Nginx configuration.
Start the backend server.
Restart Nginx.
Access the application.
This setup ensures that Nginx serves the frontend and proxies API requests to the backend.


## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License.