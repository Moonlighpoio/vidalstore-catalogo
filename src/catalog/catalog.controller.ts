import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { CatalogService } from './catalog.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { TokenPresenceGuard } from '../common/guards/token-presence.guard';
import { EditorGuard } from '../common/guards/editor.guard';

interface AuthenticatedRequest extends Request {
  user?: {
    sub: string;
    'cognito:groups'?: string[];
  };
}

@Controller('v1/catalogo')
@UseGuards(TokenPresenceGuard)
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get()
  findAll() {
    return this.catalogService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.catalogService.findById(id);
  }

  @Post()
  @UseGuards(EditorGuard)
  create(@Body() dto: CreateGameDto) {
    return this.catalogService.create(dto);
  }

  @Put(':id')
  @UseGuards(EditorGuard)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateGameDto,
  ) {
    return this.catalogService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(EditorGuard)
  remove(@Param('id') id: string) {
    this.catalogService.delete(id);
    return { message: 'Juego eliminado correctamente' };
  }
}