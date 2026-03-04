import request from "supertest";
import createApp from "../../../app";

// Mock the service so no real DB calls are made
jest.mock("../todo.service", () => ({
  todoService: {
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    toggleDone: jest.fn(),
    delete: jest.fn(),
  },
}));

import { todoService } from "../todo.service";

const app = createApp();

const VALID_ID = "507f1f77bcf86cd799439011";

const mockTodo = {
  _id: VALID_ID,
  title: "Test Todo",
  description: "A description",
  done: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe("GET /api/v1/todos", () => {
  it("returns 200 with a list of todos", async () => {
    (todoService.findAll as jest.Mock).mockResolvedValue([mockTodo]);
    const res = await request(app).get("/api/v1/todos");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].title).toBe("Test Todo");
  });

  it("returns 200 with an empty array when there are no todos", async () => {
    (todoService.findAll as jest.Mock).mockResolvedValue([]);
    const res = await request(app).get("/api/v1/todos");
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([]);
  });
});

describe("POST /api/v1/todos", () => {
  it("returns 201 with the created todo", async () => {
    (todoService.create as jest.Mock).mockResolvedValue(mockTodo);
    const res = await request(app)
      .post("/api/v1/todos")
      .send({ title: "Test Todo", description: "A description" });
    expect(res.status).toBe(201);
    expect(res.body.data.title).toBe("Test Todo");
  });

  it("returns 400 when title is missing", async () => {
    const res = await request(app).post("/api/v1/todos").send({});
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("returns 400 when title exceeds 200 characters", async () => {
    const res = await request(app)
      .post("/api/v1/todos")
      .send({ title: "a".repeat(201) });
    expect(res.status).toBe(400);
  });

  it("returns 400 when description exceeds 1000 characters", async () => {
    const res = await request(app)
      .post("/api/v1/todos")
      .send({ title: "Valid", description: "x".repeat(1001) });
    expect(res.status).toBe(400);
  });
});

describe("PUT /api/v1/todos/:id", () => {
  it("returns 200 with the updated todo", async () => {
    (todoService.update as jest.Mock).mockResolvedValue({ ...mockTodo, title: "Updated" });
    const res = await request(app)
      .put(`/api/v1/todos/${VALID_ID}`)
      .send({ title: "Updated" });
    expect(res.status).toBe(200);
    expect(res.body.data.title).toBe("Updated");
  });

  it("returns 404 when the todo is not found", async () => {
    (todoService.update as jest.Mock).mockResolvedValue(null);
    const res = await request(app)
      .put(`/api/v1/todos/${VALID_ID}`)
      .send({ title: "Updated" });
    expect(res.status).toBe(404);
  });

  it("returns 400 when the updated title is empty", async () => {
    const res = await request(app)
      .put(`/api/v1/todos/${VALID_ID}`)
      .send({ title: "" });
    expect(res.status).toBe(400);
  });
});

describe("PATCH /api/v1/todos/:id/done", () => {
  it("returns 200 with the toggled todo", async () => {
    (todoService.toggleDone as jest.Mock).mockResolvedValue({ ...mockTodo, done: true });
    const res = await request(app).patch(`/api/v1/todos/${VALID_ID}/done`);
    expect(res.status).toBe(200);
    expect(res.body.data.done).toBe(true);
  });

  it("returns 404 when the todo is not found", async () => {
    (todoService.toggleDone as jest.Mock).mockResolvedValue(null);
    const res = await request(app).patch(`/api/v1/todos/${VALID_ID}/done`);
    expect(res.status).toBe(404);
  });
});

describe("DELETE /api/v1/todos/:id", () => {
  it("returns 200 when the todo is deleted", async () => {
    (todoService.delete as jest.Mock).mockResolvedValue(mockTodo);
    const res = await request(app).delete(`/api/v1/todos/${VALID_ID}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("returns 404 when the todo is not found", async () => {
    (todoService.delete as jest.Mock).mockResolvedValue(null);
    const res = await request(app).delete(`/api/v1/todos/${VALID_ID}`);
    expect(res.status).toBe(404);
  });
});

describe("404 handler", () => {
  it("returns 404 for unknown routes", async () => {
    const res = await request(app).get("/api/v1/unknown-route");
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});

describe("Health check", () => {
  it("GET /health returns 200 with status ok", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });
});

