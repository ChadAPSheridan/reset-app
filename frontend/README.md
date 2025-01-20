# Reset App - Frontend

## Overview
Reset is a minimalist, Kanban-style project management tool designed for small programming teams. It emphasizes regular "reset moments" for sprint planning and retrospectives, enabling teams to stay focused and ship fast.

## Features
- **Lightweight Kanban Board**: Customizable lanes and dependencies visualization.
- **Minimal Overhead**: Quick task creation and simple permissions.
- **Fresh Start Sprints**: Clear the board at the start of each sprint and re-prioritize tasks.
- **Integrated Developer Tools**: Connect with code repositories and attach inline snippets.
- **Reflection and Iteration**: Retro board for notes and progress snapshots.

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm (Node package manager)
- MariaDB (for the backend database)
- Nginx (for serving the application if you don't wish to run locally)

### Installation
1. Clone the repository:
   ```
   git clone https://github.com/yourusername/reset-app.git
   ```
2. Navigate to the frontend directory:
   ```
   cd reset-app/frontend
   ```
3. Install dependencies:
   ```
   npm install
   ```

### Configuration
1. Configure the database connection in the backend:
- Update the database configuration in [backend/src/config/database.ts](backend/src/config/database.ts) with your MariaDB credentials.
2. Configure Nginx:
- Update the Nginx configuration in [nginx/nginx.conf](nginx/nginx.conf) to point to the correct paths for your setup.

### Running the Application
To start the development server, run (in both the /backend and /frontend folders):
```
npm start 
```
The application should be available at `http://localhost:3000`.
If that port is unavailable, it will say in the console output.

### Building for Production
To create a production build, run (in both the /backend and /frontend folders):
```
npm run build
```
The build files will be generated in the `build` directory.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.