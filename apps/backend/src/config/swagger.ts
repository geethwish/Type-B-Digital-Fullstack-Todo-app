import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "TODO App API",
      version: "1.0.0",
      description:
        "A RESTful API for managing TODO items built with Express.js and TypeScript",
      contact: {
        name: "TypeB Digital",
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}`,
        description: "Development server",
      },
    ],
    components: {
      schemas: {
        Todo: {
          type: "object",
          properties: {
            _id: { type: "string", example: "64b1234abcd5678ef9012345" },
            title: { type: "string", example: "Buy groceries" },
            description: { type: "string", example: "Milk, eggs, and bread" },
            done: { type: "boolean", example: false },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        CreateTodoDto: {
          type: "object",
          required: ["title"],
          properties: {
            title: {
              type: "string",
              minLength: 1,
              maxLength: 200,
              example: "Buy groceries",
            },
            description: {
              type: "string",
              maxLength: 1000,
              example: "Milk, eggs, and bread",
            },
          },
        },
        ApiResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Success" },
            data: {},
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Validation error" },
            errors: {
              type: "array",
              items: {},
            },
          },
        },
      },
    },
  },
  apis: ["./src/features/**/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
