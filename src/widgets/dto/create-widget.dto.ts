import { IsNotEmpty } from 'class-validator';

export class CreateWidgetDto {
  @IsNotEmpty()
  companyId: string;
}
