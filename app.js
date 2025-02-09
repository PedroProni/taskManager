import dotenv from "dotenv";
import express from "express";
import userRoutes from "./src/routes/user.js";
import taskRoutes from "./src/routes/task.js";
import "./src/database";

dotenv.config();

class App {
  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  routes() {
    this.app.use("/", userRoutes);
    this.app.use("/tasks", taskRoutes);
  }
}

export default new App().app;
