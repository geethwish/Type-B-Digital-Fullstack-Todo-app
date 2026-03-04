import Todo from "./todo.model";
import {
  ITodo,
  ITodoService,
  CreateTodoDto,
  UpdateTodoDto,
} from "./todo.types";

export class TodoService implements ITodoService {
  async findAll(): Promise<ITodo[]> {
    return Todo.find().sort({ createdAt: -1 });
  }

  async create(dto: CreateTodoDto): Promise<ITodo> {
    const todo = new Todo({
      title: dto.title.trim(),
      description: dto.description?.trim() ?? "",
      done: false,
    });
    return todo.save();
  }
}

export const todoService = new TodoService();
