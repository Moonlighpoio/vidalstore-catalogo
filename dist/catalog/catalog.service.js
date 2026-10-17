"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CatalogService = void 0;
const common_1 = require("@nestjs/common");
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const rabbitmq_publisher_1 = require("../mensajeria/rabbitmq.publisher");
const topologia_1 = require("../mensajeria/topologia");
let CatalogService = class CatalogService {
    publisher;
    games = this.load();
    constructor(publisher) {
        this.publisher = publisher;
    }
    findAll() {
        return this.games;
    }
    findById(id) {
        return this.games.find((game) => game.id === id);
    }
    async create(dto) {
        const game = {
            id: crypto.randomUUID(),
            nombre: dto.nombre,
            descripcion: dto.descripcion ?? '',
            imagen: dto.imagen ?? null,
        };
        this.games.push(game);
        this.persist();
        await this.publisher.publishEvento({
            routingKey: topologia_1.ROUTING_KEYS.juegoPublicado,
            payload: {
                juegoId: game.id,
                titulo: game.nombre,
                editorSub: dto.editorSub,
            },
        });
        return game;
    }
    update(id, changes) {
        const index = this.games.findIndex((game) => game.id === id);
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
    delete(id) {
        const index = this.games.findIndex((game) => game.id === id);
        if (index === -1) {
            throw new common_1.NotFoundException(`Juego ${id} no encontrado`);
        }
        this.games.splice(index, 1);
        this.persist();
    }
    load() {
        try {
            const filePath = (0, node_path_1.resolve)(process.cwd(), 'data/games.json');
            const content = (0, node_fs_1.readFileSync)(filePath, 'utf-8');
            return JSON.parse(content);
        }
        catch {
            return [];
        }
    }
    persist() {
        const filePath = (0, node_path_1.resolve)(process.cwd(), 'data/games.json');
        (0, node_fs_1.writeFileSync)(filePath, JSON.stringify(this.games, null, 2), 'utf-8');
    }
};
exports.CatalogService = CatalogService;
exports.CatalogService = CatalogService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [rabbitmq_publisher_1.RabbitMqPublisher])
], CatalogService);
//# sourceMappingURL=catalog.service.js.map