import { Controller, Get, Param, NotFoundException, Post, Body, Put } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import type { Game } from './entities/game.entity';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';

@Controller('catalogo')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get()
  findAll(): Game[] {
    return this.catalogService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string): Game {
    const game = this.catalogService.findById(id);
    
    if (!game) {
      throw new NotFoundException(`Juego ${id} no encontrado`);
    }
    
    return game;
  }

  @Post()
  create(@Body() createGameDto: CreateGameDto): Game {
    const game: Game = {
      id: `ftg-${Date.now()}`,
      nombre: createGameDto.nombre,
      descripcion: createGameDto.descripcion,
      imagen: createGameDto.imagen ?? null,
    };
    
    return this.catalogService.create(game);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateGameDto: UpdateGameDto): Game {
    return this.catalogService.update(id, updateGameDto);
  }
}