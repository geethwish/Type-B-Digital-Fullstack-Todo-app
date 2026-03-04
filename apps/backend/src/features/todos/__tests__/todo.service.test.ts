import { TodoService } from "../todo.service";

// Mock the Mongoose model — must be before any imports that use it
jest.mock("../todo.model", () => {
  const MockTodo: any = jest.fn();
  MockTodo.find = jest.fn();
  MockTodo.findById = jest.fn();
  MockTodo.findByIdAndUpdate = jest.fn();
  MockTodo.findByIdAndDelete = jest.fn();
  return { __esModule: true, default: MockTodo };
});

import Todo from "../todo.model";

const MockTodo = Todo as jest.MockedClass<typeof Todo> & {
  find: jest.Mock;
  findById: jest.Mock;
  findByIdAndUpdate: jest.Mock;
  findByIdAndDelete: jest.Mock;
};

const makeTodo = (overrides = {}) => ({
  _id: "507f1f77bcf86cd799439011",
  title: "Test Todo",
  description: "",
  done: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

describe("TodoService", () => {
  let service: TodoService;

  beforeEach(() => {
    service = new TodoService();
  });

  // ── findAll ──────────────────────────────────────────────────
  describe("findAll", () => {
    it("returns todos sorted by createdAt desc", async () => {
      const todos = [makeTodo({ _id: "1" }), makeTodo({ _id: "2" })];
      MockTodo.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue(todos),
      });

      const result = await service.findAll();

      expect(MockTodo.find).toHaveBeenCalled();
      expect(result).toEqual(todos);
    });

    it("returns an empty array when there are no todos", async () => {
      MockTodo.find.mockReturnValue({ sort: jest.fn().mockResolvedValue([]) });
      const result = await service.findAll();
      expect(result).toEqual([]);
    });
  });

  // ── create ───────────────────────────────────────────────────
  describe("create", () => {
    it("trims the title and saves the todo", async () => {
      const saved = makeTodo({ title: "Hello" });
      const mockSave = jest.fn().mockResolvedValue(saved);
      MockTodo.mockImplementation(() => ({ save: mockSave }) as any);

      const result = await service.create({ title: "  Hello  " });

      expect(MockTodo).toHaveBeenCalledWith({
        title: "Hello",
        description: "",
        done: false,
      });
      expect(mockSave).toHaveBeenCalled();
      expect(result).toEqual(saved);
    });

    it("defaults description to empty string when not provided", async () => {
      const mockSave = jest.fn().mockResolvedValue(makeTodo());
      MockTodo.mockImplementation(() => ({ save: mockSave }) as any);

      await service.create({ title: "Test" });

      expect(MockTodo).toHaveBeenCalledWith(
        expect.objectContaining({ description: "" }),
      );
    });

    it("trims the description when provided", async () => {
      const mockSave = jest.fn().mockResolvedValue(makeTodo());
      MockTodo.mockImplementation(() => ({ save: mockSave }) as any);

      await service.create({ title: "Test", description: "  detail  " });

      expect(MockTodo).toHaveBeenCalledWith(
        expect.objectContaining({ description: "detail" }),
      );
    });
  });

  // ── update ───────────────────────────────────────────────────
  describe("update", () => {
    it("calls findByIdAndUpdate and returns the updated todo", async () => {
      const updated = makeTodo({ title: "Updated" });
      MockTodo.findByIdAndUpdate.mockResolvedValue(updated);

      const result = await service.update("1", { title: "Updated" });

      expect(MockTodo.findByIdAndUpdate).toHaveBeenCalledWith(
        "1",
        { $set: { title: "Updated", description: undefined } },
        { new: true, runValidators: true },
      );
      expect(result).toEqual(updated);
    });

    it("returns null when the todo does not exist", async () => {
      MockTodo.findByIdAndUpdate.mockResolvedValue(null);
      const result = await service.update("nonexistent", { title: "X" });
      expect(result).toBeNull();
    });
  });

  // ── toggleDone ───────────────────────────────────────────────
  describe("toggleDone", () => {
    it("flips done from false to true and saves", async () => {
      const mockSave = jest.fn().mockResolvedValue(makeTodo({ done: true }));
      const todo = { ...makeTodo(), done: false, save: mockSave };
      MockTodo.findById.mockResolvedValue(todo);

      const result = await service.toggleDone("1");

      expect(todo.done).toBe(true);
      expect(mockSave).toHaveBeenCalled();
      expect(result).toEqual(expect.objectContaining({ done: true }));
    });

    it("flips done from true to false and saves", async () => {
      const mockSave = jest.fn().mockResolvedValue(makeTodo({ done: false }));
      const todo = { ...makeTodo(), done: true, save: mockSave };
      MockTodo.findById.mockResolvedValue(todo);

      await service.toggleDone("1");

      expect(todo.done).toBe(false);
    });

    it("returns null when the todo does not exist", async () => {
      MockTodo.findById.mockResolvedValue(null);
      const result = await service.toggleDone("nonexistent");
      expect(result).toBeNull();
    });
  });

  // ── delete ───────────────────────────────────────────────────
  describe("delete", () => {
    it("calls findByIdAndDelete and returns the deleted todo", async () => {
      const todo = makeTodo();
      MockTodo.findByIdAndDelete.mockResolvedValue(todo);

      const result = await service.delete("1");

      expect(MockTodo.findByIdAndDelete).toHaveBeenCalledWith("1");
      expect(result).toEqual(todo);
    });

    it("returns null when the todo does not exist", async () => {
      MockTodo.findByIdAndDelete.mockResolvedValue(null);
      const result = await service.delete("nonexistent");
      expect(result).toBeNull();
    });
  });
});
