import { Request } from 'express';
import { CatalogService } from './catalog.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
interface AuthenticatedRequest extends Request {
    user?: {
        sub: string;
        'cognito:groups'?: string[];
    };
}
export declare class CatalogController {
    private readonly catalogService;
    constructor(catalogService: CatalogService);
    findAll(): import("./entities/game.entity").Game[];
    findById(id: string): import("./entities/game.entity").Game;
    create(dto: CreateGameDto, request: AuthenticatedRequest): Promise<import("./entities/game.entity").Game>;
    update(id: string, dto: UpdateGameDto): import("./entities/game.entity").Game;
    remove(id: string): {
        message: string;
    };
}
export {};
