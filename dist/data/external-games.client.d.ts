export declare class ExternalGamesClient {
    private readonly baseUrl;
    private readonly apiKey?;
    private readonly client;
    constructor(baseUrl: string, apiKey?: string | undefined);
    fetchGames(pageSize?: number): Promise<any>;
}
