import { Router } from "express";
const router = new Router();
import taskController from "../controllers/Tasks.js";

router.get("/", taskController.index);
router.get("/:id", taskController.show);
router.post("/", taskController.create);
router.put("/:id", taskController.update);
router.delete("/:id", taskController.delete);

export default router;
