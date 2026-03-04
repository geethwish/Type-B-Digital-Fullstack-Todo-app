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
    components: {},
  },
  apis: ["./src/features/**/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
