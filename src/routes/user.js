import { Router } from "express";
const router = new Router();
import userController from "../controllers/User.js";
import authMiddleware from "../middlewares/auth.js";

router.get("/register", userController.loadRegister);
router.post("/register", userController.register);
router.get("/login", userController.loadLogin);
router.post("/login", userController.login);
router.put("/update", authMiddleware, userController.update);
router.delete("/delete", authMiddleware, userController.delete);
router.post("/logout", userController.logout);

export default router;
