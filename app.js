import dotenv from "dotenv";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import cors from "cors";
import session from 'express-session';
import flash from 'express-flash';
import homeRoutes from "./src/routes/home.js";
import userRoutes from "./src/routes/user.js";
import taskRoutes from "./src/routes/task.js";
import authMiddleware from "./src/middlewares/auth.js";
import messagesMiddleware from "./src/middlewares/messages.js";
import "./src/database";

dotenv.config();

class App {
  constructor() {
    this.app = express();
    this.middlewares();
    this.views();
    this.routes();
  }

  middlewares() {
    this.app.use('/assets', express.static(path.resolve(__dirname, 'public')));

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());

    this.app.use(cors({
      origin: true,
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization'],
      exposedHeaders: ['Authorization'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
    }));

    this.app.use(session({
      secret: process.env.SESSION_SECRET || 'your-secret-key',
      resave: false,
      saveUninitialized: true,
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 * 7
      }
    }));
    this.app.use(flash());
    this.app.use(messagesMiddleware);
  }

  views() {
    this.app.set("views", path.resolve(__dirname, "src", "views"));
    this.app.set("view engine", "ejs");
  }

  routes() {
    this.app.use("/", userRoutes);

    this.app.use("/", authMiddleware, homeRoutes);
    this.app.use("/tasks", authMiddleware, taskRoutes);
  }
}

export default new App().app;
