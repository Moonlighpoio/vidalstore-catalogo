import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateGameDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  nombre: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(600)
  descripcion?: string;

  @IsOptional()
  @IsString()
  @Matches(/^https?:\/\/.+/, {
    message: 'imagen debe ser una URL valida',
  })
  imagen?: string | null;
}