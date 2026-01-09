const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db.js");

const authRoutes = require("./routes/auth.routes.js");
const bookRoutes = require("./routes/book.routes.js");
const userRoutes = require("./routes/user.routes.js");
const issueRoutes = require("./routes/issue.routes.js");
// const dashboardRoutes = require("./routes/dashboard.routes.js");



dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/users", userRoutes);
app.use("/api/issue", issueRoutes);
// app.use("/api/dashboard", dashboardRoutes);

app.listen(5000, () => console.log("Server running on 5000"));
