import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateRobotDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  battery: number;

  engines_status: number[];
}
