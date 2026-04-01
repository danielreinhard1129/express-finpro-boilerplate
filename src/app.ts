import cors from "cors";
import express, { Express } from "express";
import "reflect-metadata";
import { PORT } from "./config/env.js";
import { loggerHttp } from "./lib/logger-http.js";
import { prisma } from "./lib/prisma.js";
import {
  errorMiddleware,
  notFoundMiddleware,
} from "./middlewares/error.middleware.js";
import { ValidationMiddleware } from "./middlewares/validation.middleware.js";
import { SampleController } from "./modules/sample/sample.controller.js";
import { SampleRouter } from "./modules/sample/sample.router.js";
import { SampleService } from "./modules/sample/sample.service.js";

export class App {
  app: Express;

  constructor() {
    this.app = express();
    this.configure();
  }

  private configure() {
    this.app.use(cors());
    this.app.use(loggerHttp);
    this.app.use(express.json());
    this.registerModules();
    this.errorMiddleware();
  }

  private registerModules() {
    // services
    const sampleService = new SampleService(prisma);

    // controllers
    const sampleController = new SampleController(sampleService);

    // middlewares
    const validationMiddleware = new ValidationMiddleware();

    // routes
    const router = new SampleRouter(sampleController, validationMiddleware);

    // entry point
    this.app.use("/samples", router.getRouter());
  }

  private errorMiddleware() {
    this.app.use(errorMiddleware);
    this.app.use(notFoundMiddleware);
  }

  public start() {
    this.app.listen(PORT, () => {
      console.log(`Server running on port: ${PORT}`);
    });
  }
}
