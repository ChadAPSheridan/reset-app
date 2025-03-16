# Reset

## Overview
Reset is a minimalist, Kanban-style project management tool designed for small programming teams. It emphasizes regular "reset moments" for sprint planning and retrospectives, enabling teams to stay focused and ship fast.

## Features
- **Lightweight Kanban Board**: Customizable lanes and dependencies visualization.
- **Minimal Overhead**: Quick task creation and simple permissions.
- **Fresh Start Sprints**: Clear the board at the start of each sprint and re-prioritize tasks.


## Planned
- **Integrated Developer Tools**: Connect with code repositories and attach inline snippets.
- **Reflection and Iteration**: Retro board for notes and progress snapshots.


## Tech Stack
- **Frontend**: Next.js, React, TypeScript, CSS
- **Backend**: Express.js, MariaDB (with Sequelize ORM)
- **Server**: Nginx

## Setup Instructions
1. Clone the repository.
2. cd into reset-app
3. run npm install
4. Navigate to the `init` directory and run `node index.js`
5. Follow the prompts to configure the database and install dependencies.
6. Launch the dev environment from the root of the app with `npm run dev`


## Deploying to NGINX server (outdated, yymv)
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

#
## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License.