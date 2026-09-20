import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateGameDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsOptional()
  @IsString()
  imagen?: string | null;
}