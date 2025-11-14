import { Request, Response } from "express";
import { SampleService } from "./sample.service";

export class SampleController {
  private sampleService: SampleService;

  constructor() {
    this.sampleService = new SampleService();
  }

  getSamples = async (req: Request, res: Response) => {
    const result = await this.sampleService.getSamples();
    res.status(200).send(result);
  };

  createSample = async (req: Request, res: Response) => {
    const result = await this.sampleService.createSample(req.body);
    res.status(200).send(result);
  };
}
