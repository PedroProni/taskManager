import dotenv from "dotenv";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import homeRoutes from "./src/routes/home.js";
import userRoutes from "./src/routes/user.js";
import taskRoutes from "./src/routes/task.js";
import authMiddleware from "./src/middlewares/auth.js";
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
    this.app.use(express.static(path.resolve(__dirname, "public")));

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
  }

  views() {
    this.app.set("views", path.resolve(__dirname, "src", "views"));
    this.app.set("view engine", "ejs");
  }

  routes() {
    // Public routes that bypass auth
    this.app.get('/login', (req, res, next) => {
      if (req.headers.authorization) {
        return res.redirect('/');
      }
      next();
    }, userRoutes);
    this.app.post('/login', userRoutes);
    this.app.get('/register', userRoutes);
    this.app.post('/register', userRoutes);
    
    // Auth middleware for all other routes
    this.app.use(authMiddleware);
    
    // Protected routes
    this.app.use('/', homeRoutes);
    this.app.use('/tasks', taskRoutes);
  }
}

export default new App().app;
