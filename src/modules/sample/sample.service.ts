import { PrismaClient } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { CreateSampleDTO } from "./dto/create-sample.dto";

export class SampleService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }

  getSamples = async () => {
    return await this.prisma.sample.findMany();
  };

  createSample = async (body: CreateSampleDTO) => {
    return await this.prisma.sample.create({ data: body });
  };
}
