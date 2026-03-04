import { Document, Types } from "mongoose";

export interface ITodo extends Document {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  done: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTodoDto {
  title: string;
  description?: string;
}

export interface UpdateTodoDto {
  title?: string;
  description?: string;
}

export interface ITodoService {
  findAll(): Promise<ITodo[]>;
  create(dto: CreateTodoDto): Promise<ITodo>;
  update(id: string, dto: UpdateTodoDto): Promise<ITodo | null>;
  toggleDone(id: string): Promise<ITodo | null>;
  delete(id: string): Promise<ITodo | null>;
}
