import axios, { AxiosInstance } from 'axios';

export class ExternalGamesClient {
  private readonly client: AxiosInstance;

  constructor(
    private readonly baseUrl: string,
    private readonly apiKey?: string,
  ) {
    this.client = axios.create({
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