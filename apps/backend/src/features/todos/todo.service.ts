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

  async update(id: string, dto: UpdateTodoDto): Promise<ITodo | null> {
    return Todo.findByIdAndUpdate(
      id,
      {
        $set: {
          title: dto.title?.trim(),
          description: dto.description?.trim(),
        },
      },
      { new: true, runValidators: true },
    );
  }

  async toggleDone(id: string): Promise<ITodo | null> {
    const todo = await Todo.findById(id);
    if (!todo) return null;
    todo.done = !todo.done;
    return todo.save();
  }

  async delete(id: string): Promise<ITodo | null> {
    return Todo.findByIdAndDelete(id);
  }
}

export const todoService = new TodoService();
