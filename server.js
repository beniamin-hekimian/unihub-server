require("dotenv").config();

const express = require("express");
const connectDB = require("./config/database");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON
app.use(express.json());

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
