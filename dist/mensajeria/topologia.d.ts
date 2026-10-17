export declare const EXCHANGES: {
    readonly eventos: "vidalstore.eventos";
    readonly comandos: "vidalstore.comandos";
    readonly dlx: "vidalstore.dlx";
};
export declare const EXCHANGE_TYPES: {
    readonly eventos: "topic";
    readonly comandos: "direct";
    readonly dlx: "direct";
};
export declare const ROUTING_KEYS: {
    readonly compraRealizada: "compra.realizada";
    readonly licenciaRevocada: "licencia.revocada";
    readonly juegoPublicado: "juego.publicado";
    readonly correoEnviar: "correo.enviar";
    readonly dlqReprocesar: "dlq.reprocesar";
};
export declare const HEADERS: {
    readonly eventoId: "x-evento-id";
    readonly emitidoEn: "x-emitido-en";
};
export declare const EVENTO_CONTENT_TYPE = "application/json";
