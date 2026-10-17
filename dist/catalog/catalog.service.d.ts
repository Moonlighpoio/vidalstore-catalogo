import type { Game } from './entities/game.entity';
import type { CreateGameDto } from './dto/create-game.dto';
import type { UpdateGameDto } from './dto/update-game.dto';
import { RabbitMqPublisher } from '../mensajeria/rabbitmq.publisher';
export interface CreateGameInput extends CreateGameDto {
    editorSub: string;
}
export declare class CatalogService {
    private readonly publisher;
    private games;
    constructor(publisher: RabbitMqPublisher);
    findAll(): Game[];
    findById(id: string): Game | undefined;
    create(dto: CreateGameInput): Promise<Game>;
    update(id: string, changes: UpdateGameDto): Game;
    delete(id: string): void;
    private load;
    private persist;
}
