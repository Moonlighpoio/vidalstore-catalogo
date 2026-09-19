import 'dotenv/config';
import axios from 'axios';
import { writeFile } from 'node:fs/promises';

interface FreeToGame {
  id: number;
  title: string;
  thumbnail?: string;
  short_description?: string;
}

interface Game {
  id: string;
  nombre: string;
  descripcion: string;
  imagen: string | null;
}

async function main() {
  const apiUrl = process.env.EXTERNAL_GAMES_API_URL;

  if (!apiUrl) {
    throw new Error('EXTERNAL_GAMES_API_URL no está configurada');
  }

  console.log('Conectando a:', apiUrl);

  const response = await axios.get<FreeToGame[]>(apiUrl, {
    timeout: 15000,
  });

  console.log('Status:', response.status);
  console.log('Juegos recibidos:', response.data.length);

  const games: Game[] = response.data.map((game) => ({
    id: `ftg-${game.id}`,
    nombre: game.title,
    descripcion: game.short_description ?? 'Descripción no disponible',
    imagen: game.thumbnail ?? null,
  }));

  await writeFile(
    'data/games.json',
    JSON.stringify(games, null, 2),
    'utf-8',
  );

  console.log(`✅ Se generaron ${games.length} juegos en data/games.json`);
}

main().catch((error) => {
  console.error('❌ Error ejecutando seed:', error.message);
  process.exit(1);
});