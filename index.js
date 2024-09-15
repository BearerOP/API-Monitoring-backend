const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const express = require('express');
const cors = require('cors');
const User = require('./src/models/user_model');
const ApiLog = require('./src/models/api_logs_model');
const { addLogs } = require('./src/services/api_logs_service');
const { connectDB } = require('./db/dbconnection');

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS configuration
const allowedOrigins = [
  "http://localhost:5173",
  "https://up-status-11uxcarh5-bearerops-projects.vercel.app",
  "https://up-status-git-master-bearerops-projects.vercel.app",
  "https://up-status-bearerops-projects.vercel.app",
  "https://up-status-xi.vercel.app",
  "https://up-status.onrender.com"
];

const corsOptions = {
  origin: function (origin, callback) {
    console.log('Requested Origin:', origin);
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Enable CORS
app.use(cors(corsOptions));

// CORS preflight
app.options('*', cors(corsOptions));

// Routes
app.use("/root", (req, res) => {
  res.send('API Monitoring Backend');
});
app.use("/api", require("./src/routes/user_routes.js"));
app.use("/api", require("./src/routes/api_logs_routes.js"));
app.use("/public", express.static("public"));

// Health check route
app.post('/api/health-check', async (req, res) => {
  try {
    // Ensure that this endpoint is accessible and does not require additional headers or authentication
    const users = await User.find();
    for (const user of users) {
      const apiLogs = await ApiLog.find({ user_id: user._id });
      for (const apiLog of apiLogs) {
        await addLogs({ user, body: { url: apiLog.url, method: apiLog.method } }, {});
      }
    }
    res.status(200).send("Health check completed");
  } catch (error) {
    console.error("Error during health check:", error.message);
    res.status(500).send("Health check failed");
  }
});

// Error handling middleware
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

// Database connection and server start
connectDB();

const PORT = process.env.PORT || 3000; // Default to 3000 if PORT is not set
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT} on ${process.env.ENVIRONMENT}`);
});
