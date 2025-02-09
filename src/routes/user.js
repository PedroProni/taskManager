import { Router } from "express";
const router = new Router();
import userController from "../controllers/User.js";
import authMiddleware from "../middlewares/auth.js";

router.post("/register", userController.register);
router.post("/login", userController.login);
router.put("/update", authMiddleware, userController.update);
router.delete("/delete", authMiddleware, userController.delete);

export default router;
