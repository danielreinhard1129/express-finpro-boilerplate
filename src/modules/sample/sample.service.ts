import { PrismaService } from "../prisma/prisma.service";
import { CreateSampleDTO } from "./dto/create-sample.dto";

export class SampleService {
  private prisma: PrismaService;

  constructor() {
    this.prisma = new PrismaService();
  }

  getSamples = async () => {
    return await this.prisma.sample.findMany();
  };

  createSample = async (body: CreateSampleDTO) => {
    return await this.prisma.sample.create({ data: body });
  };
}
