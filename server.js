require("dotenv").config();

const cookieParser = require("cookie-parser");
const cors = require("cors");
const express = require("express");
const connectDB = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const professorRoutes = require("./routes/professorRoutes");

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

// Test route
app.get("/", (_, res) => {
  res.send("Hello from the server! 🚀");
});

// Routes
app.use("/auth", authRoutes);
app.use("/students", studentRoutes);
app.use("/professors", professorRoutes);

async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`✅ Server is running on port: ${PORT}`);
  });
}

startServer();
