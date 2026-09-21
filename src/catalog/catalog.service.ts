import { Injectable, NotFoundException } from '@nestjs/common';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Game } from './entities/game.entity';
import type { CreateGameDto } from './dto/create-game.dto';
import type { UpdateGameDto } from './dto/update-game.dto';


@Injectable()
export class CatalogService {
  private games: Game[] = this.load();


  findAll(): Game[] {
    return this.games;
  }


  findById(id: string): Game | undefined {
    return this.games.find((game) => game.id === id);
  }


  create(dto: CreateGameDto): Game {
  const game: Game = {
    id: crypto.randomUUID(),
    nombre: dto.nombre,
    descripcion: dto.descripcion ?? '',
    imagen: dto.imagen ?? null,
  };

  this.games.push(game);
  this.persist();
  return game;
}


  update(id: string, changes: UpdateGameDto): Game {
    const index = this.games.findIndex((game) => game.id === id);
    
    if (index === -1) {
      throw new NotFoundException(`Juego ${id} no encontrado`);
    }
    
    this.games[index] = {
      ...this.games[index],
      ...changes,
      id,
    };
    
    this.persist();
    return this.games[index];
  }


  delete(id: string): void {
    const index = this.games.findIndex((game) => game.id === id);
    
    if (index === -1) {
      throw new NotFoundException(`Juego ${id} no encontrado`);
    }
    
    this.games.splice(index, 1);
    this.persist();
  }


  private load(): Game[] {
    try {
      const filePath = resolve(process.cwd(), 'data/games.json');
      const content = readFileSync(filePath, 'utf-8');
      return JSON.parse(content) as Game[];
    } catch {
      return [];
    }
  }


  private persist(): void {
    const filePath = resolve(process.cwd(), 'data/games.json');
    writeFileSync(filePath, JSON.stringify(this.games, null, 2), 'utf-8');
  }
}