import { Express } from "express";
import { prisma } from "../../lib/prisma.js";
import { ValidationMiddleware } from "../../middlewares/validation.middleware.js";
import { SampleController } from "./sample.controller.js";
import { SampleRouter } from "./sample.router.js";
import { SampleService } from "./sample.service.js";

export function register(app: Express) {
  const service = new SampleService(prisma);
  const controller = new SampleController(service);
  const router = new SampleRouter(controller, new ValidationMiddleware());
  app.use("/samples", router.getRouter());
}
