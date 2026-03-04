import { Router } from "express";
import { todoController } from "./todo.controller";
import { createTodoValidation, updateTodoValidation } from "./todo.validation";
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

router.put(
  "/:id",
  updateTodoValidation,
  validate,
  asyncHandler(todoController.update.bind(todoController)),
);
router.patch(
  "/:id/done",
  asyncHandler(todoController.toggleDone.bind(todoController)),
);
router.delete("/:id", asyncHandler(todoController.delete.bind(todoController)));

export default router;
