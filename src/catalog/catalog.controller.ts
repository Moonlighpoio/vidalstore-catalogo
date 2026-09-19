import { Controller, Get } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { Game } from './entities/game.entity';

@Controller('catalogo')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get()
  findAll(): Game[] {
    return this.catalogService.findAll();
  }
}