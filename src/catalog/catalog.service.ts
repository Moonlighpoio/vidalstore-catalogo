import { Injectable } from '@nestjs/common';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export interface Game {
  id: string;
  nombre: string;
  descripcion: string;
  imagen: string | null;
}

@Injectable()
export class CatalogService {
  private readonly games: Game[] = this.load();

  findAll(): Game[] {
    return this.games;
  }

  findById(id: string): Game | undefined {
    return this.games.find((game) => game.id === id);
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
}