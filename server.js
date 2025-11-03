require("dotenv").config();

const cookieParser = require("cookie-parser");
const cors = require("cors");
const express = require("express");
const connectDB = require("./config/database");
const authRoutes = require("./routes/auth");

// create express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

// Routes
app.use("/api/auth", authRoutes);

// Test route
app.get("/", (_, res) => {
  res.send("Hello from the server!");
});

async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`✅ Server is running on port: ${PORT}`);
  });
}

startServer();
