import { Game } from '../entities/game.entity';
export declare class InMemoryGameRepository {
    private readonly filePath;
    private games;
    findAll(): Game[];
    findById(id: string): Game;
    create(game: Game): Game;
    update(id: string, changes: Partial<Game>): Game;
    private load;
    private persist;
}
