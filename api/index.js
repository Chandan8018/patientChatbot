import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRouters from "./routers/auth.router.js";
import userRouters from "./routers/user.router.js";
import messageRoutes from "./routers/message.router.js";
import sequelize from "./utils/database.js";
import path from "path";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
    return sequelize.sync();
  })
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

app.use("/api/auth", authRouters);
app.use("/api/user", userRouters);
app.use("/api/messages", messageRoutes);

app.use(express.static(path.join(__dirname, "/frontend/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
