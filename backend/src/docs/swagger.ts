import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.3",

    info: {
      title: "DineFlow AI API",
      version: "1.0.0",
      description:
        "Restaurant management and AI-powered ordering platform API.",
    },

    servers: [
      {
        url:
          process.env.API_BASE_URL ??
          "http://localhost:5000/api/v1",
        description: "Current API server",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },

      schemas: {
        Error: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            message: {
              type: "string",
              example: "Something went wrong.",
            },
          },
        },

        HealthResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            data: {
              type: "object",
            },
          },
        },
      },
    },

    security: [
      {
        bearerAuth: [],
      },
    ],
  },

  apis: [
    "./src/api/**/*.ts",
    "./src/modules/**/*.ts",
  ],
};

export const swaggerSpec =
  swaggerJSDoc(options);