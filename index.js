const cookieParser = require("cookie-parser");
const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "src/views"));
app.set("view engine", "ejs");

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
app.use("/api", require("./src/routes/user_routes.js"));
app.use("/api", require("./src/routes/api_logs_routes.js"));
app.use("/public", express.static("public"));

// Error handling middleware
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

// Database connection and server start
const { connectDB } = require("./db/dbconnection.js");
connectDB();

const PORT = process.env.port;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
