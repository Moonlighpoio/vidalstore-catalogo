import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import type { Game } from './entities/game.entity';

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
}