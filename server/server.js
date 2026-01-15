const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.use("/api/books", require("./routes/bookRoutes"));
app.use("/api/members", require("./routes/memberRoutes"));
app.use("/api/transactions", require("./routes/transactionRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));

app.listen(5000, () =>
  console.log("Server running on port 5000")
);
