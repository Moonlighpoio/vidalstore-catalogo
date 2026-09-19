export interface RawGame {
  id: number;
  name: string;
  background_image?: string;
  description_raw?: string;
}

export function transformGames(games: RawGame[]) {
  return games.map((game) => ({
    id: `rawg-${game.id}`,
    nombre: game.name,
    descripcion: game.description_raw ?? 'Descripción no disponible',
    imagen: game.background_image ?? null,
  }));
}