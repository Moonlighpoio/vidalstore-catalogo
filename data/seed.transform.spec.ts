import { transformGames } from './seed.transform';

describe('transformGames', () => {
  it('transforma juegos externos al formato del catálogo', () => {
    const result = transformGames([
      {
        id: 1,
        name: 'Juego de prueba',
        background_image: 'https://example.com/game.jpg',
        description_raw: 'Descripción de prueba',
      },
    ]);

    expect(result).toEqual([
      {
        id: 'rawg-1',
        nombre: 'Juego de prueba',
        descripcion: 'Descripción de prueba',
        imagen: 'https://example.com/game.jpg',
      },
    ]);
  });

  it('usa valores por defecto cuando faltan campos opcionales', () => {
    const result = transformGames([
      {
        id: 2,
        name: 'Otro juego',
      },
    ]);

    expect(result[0]).toEqual({
      id: 'rawg-2',
      nombre: 'Otro juego',
      descripcion: 'Descripción no disponible',
      imagen: null,
    });
  });
});