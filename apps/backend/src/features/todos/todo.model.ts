import { Schema, model } from "mongoose";
import { ITodo } from "./todo.types";

const todoSchema = new Schema<ITodo>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [1, "Title must not be empty"],
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
      default: "",
    },
    done: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform: (_doc, ret: Record<string, unknown>) => {
        if (ret._id && typeof ret._id === "object") {
          ret._id = String(ret._id);
        }
        return ret;
      },
    },
  },
);

// Index for faster queries
todoSchema.index({ createdAt: -1 });
todoSchema.index({ done: 1 });

const Todo = model<ITodo>("Todo", todoSchema);

export default Todo;
