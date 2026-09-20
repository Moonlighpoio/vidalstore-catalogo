import { IsString, IsOptional } from 'class-validator';

export class UpdateGameDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsString()
  imagen?: string | null;
}