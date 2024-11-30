import { IsNotEmpty } from 'class-validator'

export class CreateEmailDto {
  @IsNotEmpty()
  companyId: string;
}
