require("dotenv").config();

const cookieParser = require("cookie-parser");
const cors = require("cors");
const express = require("express");
const connectDB = require("./config/database");
const { requireAuth } = require("./middlewares/auth");

// Import all routes
const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const professorRoutes = require("./routes/professorRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const enrolmentRoutes = require("./routes/enrolmentRoutes");
const resultRoutes = require("./routes/resultRoutes");
const examRoutes = require("./routes/examRouter");

// create express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// Public routes
app.get("/", (_, res) => {
  res.send("Hello from the server!");
});
app.use("/auth", authRoutes);

// Apply auth middleware
app.use(requireAuth);

// Private routes
app.use("/students", studentRoutes);
app.use("/professors", professorRoutes);
app.use("/subjects", subjectRoutes);
app.use("/enrolments", enrolmentRoutes);
app.use("/results", resultRoutes);
app.use("/exams", examRoutes);

async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`✅ Server is running on port: ${PORT}`);
  });
}

startServer();
