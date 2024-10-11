import { IsNotEmpty } from 'class-validator';

export class CreateDurationDto {
  @IsNotEmpty()
  from: string;

  @IsNotEmpty()
  to: string;
}
