"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EVENTO_CONTENT_TYPE = exports.HEADERS = exports.ROUTING_KEYS = exports.EXCHANGE_TYPES = exports.EXCHANGES = void 0;
exports.EXCHANGES = {
    eventos: 'vidalstore.eventos',
    comandos: 'vidalstore.comandos',
    dlx: 'vidalstore.dlx',
};
exports.EXCHANGE_TYPES = {
    eventos: 'topic',
    comandos: 'direct',
    dlx: 'direct',
};
exports.ROUTING_KEYS = {
    compraRealizada: 'compra.realizada',
    licenciaRevocada: 'licencia.revocada',
    juegoPublicado: 'juego.publicado',
    correoEnviar: 'correo.enviar',
    dlqReprocesar: 'dlq.reprocesar',
};
exports.HEADERS = {
    eventoId: 'x-evento-id',
    emitidoEn: 'x-emitido-en',
};
exports.EVENTO_CONTENT_TYPE = 'application/json';
//# sourceMappingURL=topologia.js.map