import { IsNotEmpty, IsString } from "class-validator";

export class CreateSampleDTO {
  @IsNotEmpty()
  @IsString()
  name!: string;
}
