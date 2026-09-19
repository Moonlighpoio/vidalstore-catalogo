import { Injectable, NotFoundException } from '@nestjs/common';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { Game } from '../entities/game.entity';

@Injectable()
export class InMemoryGameRepository {
  private readonly filePath = resolve(process.cwd(), 'data/games.json');
  private games: Game[] = this.load();

  findAll(): Game[] {
    return [...this.games];
  }

  findById(id: string): Game {
    const game = this.games.find((item) => item.id === id);
    if (!game) {
      throw new NotFoundException(`Juego ${id} no encontrado`);
    }
    return game;
  }

  create(game: Game): Game {
    this.games.push(game);
    this.persist();
    return game;
  }

  update(id: string, changes: Partial<Game>): Game {
    const index = this.games.findIndex((item) => item.id === id);
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

  private load(): Game[] {
    try {
      const content = readFileSync(this.filePath, 'utf-8');
      return JSON.parse(content) as Game[];
    } catch {
      return [];
    }
  }

  private persist(): void {
    writeFileSync(
      this.filePath,
      JSON.stringify(this.games, null, 2),
      'utf-8',
    );
  }
}