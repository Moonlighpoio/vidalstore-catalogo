"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExternalGamesClient = void 0;
const axios_1 = __importDefault(require("axios"));
class ExternalGamesClient {
    baseUrl;
    apiKey;
    client;
    constructor(baseUrl, apiKey) {
        this.baseUrl = baseUrl;
        this.apiKey = apiKey;
        this.client = axios_1.default.create({
            baseURL: this.baseUrl,
            timeout: 10000,
        });
    }
    async fetchGames(pageSize = 20) {
        const response = await this.client.get('/', {
            params: {
                key: this.apiKey,
                page_size: pageSize,
            },
        });
        return response.data;
    }
}
exports.ExternalGamesClient = ExternalGamesClient;
//# sourceMappingURL=external-games.client.js.map