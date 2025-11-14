import { Router } from "express";
import { SampleController } from "./sample.controller";
import { validateBody } from "../../middlewares/validation.middleware";
import { CreateSampleDTO } from "./dto/create-sample.dto";

export class SampleRouter {
  private router: Router;
  private sampleController: SampleController;

  constructor() {
    this.router = Router();
    this.sampleController = new SampleController();
    this.initializedRoutes();
  }

  private initializedRoutes = () => {
    this.router.get("/", this.sampleController.getSamples);
    this.router.post(
      "/",
      validateBody(CreateSampleDTO),
      this.sampleController.createSample
    );
  };

  getRouter = () => {
    return this.router;
  };
}
