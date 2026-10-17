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
var RabbitMqPublisher_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RabbitMqPublisher = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const amqplib_1 = require("amqplib");
const node_crypto_1 = require("node:crypto");
const topologia_1 = require("./topologia");
let RabbitMqPublisher = RabbitMqPublisher_1 = class RabbitMqPublisher {
    configService;
    logger = new common_1.Logger(RabbitMqPublisher_1.name);
    connection;
    channel;
    connecting;
    constructor(configService) {
        this.configService = configService;
    }
    async onModuleInit() {
        try {
            await this.getChannel();
        }
        catch (error) {
            this.logger.error(`No se pudo conectar a RabbitMQ al arrancar: ${error.message}`);
        }
    }
    async onModuleDestroy() {
        try {
            await this.channel?.close();
            await this.connection?.close();
        }
        catch {
        }
    }
    get url() {
        return this.configService.get('RABBITMQ_URL', 'amqp://localhost:5672');
    }
    async getChannel() {
        if (this.channel) {
            return this.channel;
        }
        if (!this.connecting) {
            this.connecting = this.connectChannel();
        }
        try {
            this.channel = await this.connecting;
            return this.channel;
        }
        finally {
            this.connecting = undefined;
        }
    }
    async connectChannel() {
        const connection = await (0, amqplib_1.connect)(this.url);
        connection.on('error', (error) => this.logger.error(`Error de conexión RabbitMQ: ${error.message}`));
        connection.on('close', () => {
            this.logger.warn('Conexión RabbitMQ cerrada');
            this.connection = undefined;
            this.channel = undefined;
        });
        const channel = await connection.createConfirmChannel();
        await channel.assertExchange(topologia_1.EXCHANGES.eventos, topologia_1.EXCHANGE_TYPES.eventos, {
            durable: true,
        });
        this.connection = connection;
        return channel;
    }
    async publishEvento({ routingKey, payload, eventoId, }) {
        const channel = await this.getChannel();
        const headers = {
            [topologia_1.HEADERS.eventoId]: eventoId ?? (0, node_crypto_1.randomUUID)(),
            [topologia_1.HEADERS.emitidoEn]: new Date().toISOString(),
        };
        channel.publish(topologia_1.EXCHANGES.eventos, routingKey, Buffer.from(JSON.stringify(payload)), {
            persistent: true,
            contentType: topologia_1.EVENTO_CONTENT_TYPE,
            headers,
        });
        await channel.waitForConfirms();
    }
};
exports.RabbitMqPublisher = RabbitMqPublisher;
exports.RabbitMqPublisher = RabbitMqPublisher = RabbitMqPublisher_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], RabbitMqPublisher);
//# sourceMappingURL=rabbitmq.publisher.js.map