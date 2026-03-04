import { Router } from "express";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Todos
 *   description: TODO management endpoints
 */

router.get("/", (req, res) => {
  res.send("Get all todos");
});
router.post("/", (req, res) => {
  res.send("Create todo");
});
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
