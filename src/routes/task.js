import { Router } from "express";
const router = new Router();
import taskController from "../controllers/Tasks.js";
import authMiddleware from "../middlewares/auth.js";

router.get("/", authMiddleware, taskController.index);
router.get("/:id", authMiddleware, taskController.show);
router.post("/", authMiddleware, taskController.create);
router.put("/:id", authMiddleware, taskController.update);
router.delete("/:id", authMiddleware, taskController.delete);

export default router;
