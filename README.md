# API Monitoring Backend

This project provides the backend services for API monitoring, including periodic health checks using GitHub Actions cron jobs. The backend is built with Node.js, Express, and MongoDB, and includes various other libraries for tasks such as authentication, logging, and database management.

## Features

- **API Monitoring**: Regularly logs and monitors the health of registered APIs.
- **Periodic Health Checks**: Automatically triggers health checks using GitHub Actions to ensure API uptime.
- **User Authentication**: Supports user authentication and security.
- **Database**: Uses MongoDB for storing user and API log data.
- **Email Notifications**: Sends email notifications for critical errors using Nodemailer.

## Technologies

- **Node.js**
- **Express.js**
- **MongoDB with Mongoose**
- **GitHub Actions (for cron jobs)**
- **Firebase (for notifications)**
- **Axios (for making HTTP requests)**

## Setup

### 1. Install Dependencies

Ensure you have [Node.js](https://nodejs.org/) and [MongoDB](https://www.mongodb.com/) installed. Run the following command to install all dependencies:

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root of your project with the following environment variables:

```bash
PORT=3000
MONGODB_URI=<your_mongodb_uri>
JWT_SECRET=<your_jwt_secret>
EMAIL_USER=<your_email_user>
EMAIL_PASS=<your_email_password>
ENVIRONMENT=production # Or 'development'
```

### 3. Run the Application

To start the backend server, use the following command:

```bash
npm start
```

By default, the server will run on `http://localhost:3000`.

### 4. Set Up GitHub Actions for Cron Jobs

The project uses GitHub Actions to run a cron job every 5 minutes. This cron job will make an HTTP request to the health check endpoint to monitor the API's uptime.

1. **Create a GitHub Workflow**: Add a new workflow file in `.github/workflows/health-check.yml`:

   ```yaml
   name: Periodic Health Check

   on:
     schedule:
       - cron: '*/5 * * * *' # Runs every 5 minutes
     workflow_dispatch: # Allows manual triggering from the GitHub Actions UI

   jobs:
     health-check:
       runs-on: ubuntu-latest

       steps:
         - name: Make HTTP Request
           run: |
             curl -X POST https://your-app-name.domain.com/api/health-check
   ```

2. **Commit and Push**: Commit the workflow file and push it to your GitHub repository:

   ```bash
   git add .github/workflows/health-check.yml
   git commit -m "Add periodic health check cron job"
   git push origin main
   ```

3. **View Actions**: Go to the **Actions** tab in your GitHub repository to view the scheduled cron job's execution logs.

### 5. Folder Structure

The project structure is as follows:

```bash
├── .github
│   └── workflows
│       └── health-check.yml        # GitHub Actions workflow file for cron jobs
├── public                      # Public assets
├── src
│   ├── models                  # Mongoose models for User and ApiLog
│   ├── routes                  # API routes for users and logs
│   ├── services                # Services for handling API logs
│   └── controllers             # Controller logic for handling routes
├── db
│   └── dbconnection.js         # MongoDB connection logic
├── .env                        # Environment variables
├── package.json                # Dependencies and project metadata
└── index.js                    # Main application entry point
```

### 6. License

For any issues or inquiries, please visit the [GitHub Issues](https://github.com/BearerOP/API-Monitoring-backend/issues) page.
