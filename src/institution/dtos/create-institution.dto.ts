import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateInstitutionDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  ruc?: string;

  @IsOptional()
  @IsString()
  contact?: string;
}
