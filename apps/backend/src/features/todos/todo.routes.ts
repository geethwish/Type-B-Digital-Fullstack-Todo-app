import { Router } from "express";
import { todoController } from "./todo.controller";
import { createTodoValidation } from "./todo.validation";
import { validate } from "../../middleware/validate";
import { asyncHandler } from "../../middleware/errorHandler";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Todos
 *   description: TODO management endpoints
 */

router.get("/", asyncHandler(todoController.getAll.bind(todoController)));
router.post(
  "/",
  createTodoValidation,
  validate,
  asyncHandler(todoController.create.bind(todoController)),
);

router.put("/:id", (req, res) => {
  res.send("Update todo");
});
router.patch("/:id/done", (req, res) => {
  res.send("Toggle todo done");
});
router.delete("/:id", (req, res) => {
  res.send("Delete todo");
});

export default router;
