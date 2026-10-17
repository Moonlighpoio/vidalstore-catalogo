import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export interface PublicarEventoInput {
    routingKey: string;
    payload: Record<string, unknown>;
    eventoId?: string;
}
export declare class RabbitMqPublisher implements OnModuleInit, OnModuleDestroy {
    private readonly configService;
    private readonly logger;
    private connection?;
    private channel?;
    private connecting?;
    constructor(configService: ConfigService);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    private get url();
    private getChannel;
    private connectChannel;
    publishEvento({ routingKey, payload, eventoId, }: PublicarEventoInput): Promise<void>;
}
