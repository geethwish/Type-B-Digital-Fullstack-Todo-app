import { CreateTodoDto, UpdateTodoDto, ITodoService } from "./todo.types";
import { sendCreated, sendSuccess } from "../../utils/apiResponse";
import { Request, Response } from "express";
import { AppError } from "../../middleware/errorHandler";
import { todoService } from "./todo.service";

type IdParam = { id: string };
type Req<TBody = unknown, TParams = Record<string, string>> = Request<
  TParams,
  unknown,
  TBody
>;

export class TodoController {
  constructor(private readonly service: ITodoService) {}
  /**
   * @swagger
   * /api/v1/todos:
   *   get:
   *     summary: Get all TODO items
   *     tags: [Todos]
   *     responses:
   *       200:
   *         description: List of all todos
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - properties:
   *                     data:
   *                       type: array
   *                       items:
   *                         $ref: '#/components/schemas/Todo'
   */

  async getAll(_req: Request, res: Response): Promise<void> {
    const todos = await this.service.findAll();
    sendSuccess(res, todos, "Todos retrieved successfully");
  }

  /**
   * @swagger
   * /api/v1/todos:
   *   post:
   *     summary: Create a new TODO item
   *     tags: [Todos]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateTodoDto'
   *     responses:
   *       201:
   *         description: Todo created successfully
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - properties:
   *                     data:
   *                       $ref: '#/components/schemas/Todo'
   *       400:
   *         description: Validation error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  async create(req: Req<CreateTodoDto>, res: Response): Promise<void> {
    const todo = await this.service.create(req.body);
    sendCreated(res, todo, "Todo created successfully");
  }

  /**
   * @swagger
   * /api/v1/todos/{id}:
   *   put:
   *     summary: Update a TODO item
   *     tags: [Todos]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Todo ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateTodoDto'
   *     responses:
   *       200:
   *         description: Todo updated successfully
   *       400:
   *         description: Validation error
   *       404:
   *         description: Todo not found
   */
  async update(req: Req<UpdateTodoDto, IdParam>, res: Response): Promise<void> {
    const todo = await this.service.update(req.params.id, req.body);
    if (!todo) throw new AppError("Todo not found", 404);
    sendSuccess(res, todo, "Todo updated successfully");
  }

  /**
   * @swagger
   * /api/v1/todos/{id}/done:
   *   patch:
   *     summary: Toggle the done status of a TODO item
   *     tags: [Todos]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Todo ID
   *     responses:
   *       200:
   *         description: Todo status toggled successfully
   *       404:
   *         description: Todo not found
   */
  async toggleDone(req: Req<unknown, IdParam>, res: Response): Promise<void> {
    const todo = await this.service.toggleDone(req.params.id);
    if (!todo) throw new AppError("Todo not found", 404);
    sendSuccess(res, todo, `Todo marked as ${todo.done ? "done" : "undone"}`);
  }

  /**
   * @swagger
   * /api/v1/todos/{id}:
   *   delete:
   *     summary: Delete a TODO item
   *     tags: [Todos]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Todo ID
   *     responses:
   *       200:
   *         description: Todo deleted successfully
   *       404:
   *         description: Todo not found
   */
  async delete(req: Req<unknown, IdParam>, res: Response): Promise<void> {
    const todo = await this.service.delete(req.params.id);
    if (!todo) throw new AppError("Todo not found", 404);
    sendSuccess(res, null, "Todo deleted successfully");
  }
}

export const todoController = new TodoController(todoService);
