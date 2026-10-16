
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./databaseconnetion');
const routes = require('./routes');
const helmet = require('helmet');

const servername = express();

// 1. Helmet security middleware
servername.use(helmet());

// 2. Parse JSON
servername.use(express.json());

// 3. CORS configuration
servername.use(cors({
  origin: [
    "http://localhost:5173",
    process.env.CLIENT_URL || "https://eclectic-fenglisu-bb779a.netlify.app"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// 4. Routes
servername.use(routes);

// 5. Serve uploaded files
servername.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT || 5000;

servername.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
