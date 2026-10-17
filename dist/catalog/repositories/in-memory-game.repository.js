"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryGameRepository = void 0;
const common_1 = require("@nestjs/common");
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
let InMemoryGameRepository = class InMemoryGameRepository {
    filePath = (0, node_path_1.resolve)(process.cwd(), 'data/games.json');
    games = this.load();
    findAll() {
        return [...this.games];
    }
    findById(id) {
        const game = this.games.find((item) => item.id === id);
        if (!game) {
            throw new common_1.NotFoundException(`Juego ${id} no encontrado`);
        }
        return game;
    }
    create(game) {
        this.games.push(game);
        this.persist();
        return game;
    }
    update(id, changes) {
        const index = this.games.findIndex((item) => item.id === id);
        if (index === -1) {
            throw new common_1.NotFoundException(`Juego ${id} no encontrado`);
        }
        this.games[index] = {
            ...this.games[index],
            ...changes,
            id,
        };
        this.persist();
        return this.games[index];
    }
    load() {
        try {
            const content = (0, node_fs_1.readFileSync)(this.filePath, 'utf-8');
            return JSON.parse(content);
        }
        catch {
            return [];
        }
    }
    persist() {
        (0, node_fs_1.writeFileSync)(this.filePath, JSON.stringify(this.games, null, 2), 'utf-8');
    }
};
exports.InMemoryGameRepository = InMemoryGameRepository;
exports.InMemoryGameRepository = InMemoryGameRepository = __decorate([
    (0, common_1.Injectable)()
], InMemoryGameRepository);
//# sourceMappingURL=in-memory-game.repository.js.map