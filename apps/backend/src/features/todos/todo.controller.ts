import { CreateTodoDto, ITodoService } from "./todo.types";
import { sendCreated, sendSuccess } from "../../utils/apiResponse";
import { Request, Response } from "express";
import { todoService } from "./todo.service";

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
}

export const todoController = new TodoController(todoService);
