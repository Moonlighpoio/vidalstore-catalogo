import { Injectable } from '@nestjs/common';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Game } from './entities/game.entity';

@Injectable()
export class CatalogService {
  private games: Game[] = this.load();

  findAll(): Game[] {
    return this.games;
  }

  findById(id: string): Game | undefined {
    return this.games.find((game) => game.id === id);
  }

  create(game: Game): Game {
    this.games.push(game);
    this.persist();
    return game;
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