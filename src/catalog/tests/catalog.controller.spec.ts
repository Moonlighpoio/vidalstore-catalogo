import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { CatalogController } from '../catalog.controller';
import { CatalogService } from '../catalog.service';

describe('CatalogController', () => {
  let controller: CatalogController;
  let service: CatalogService;

  const mockGames = [
    {
      id: 'ftg-1',
      nombre: 'Juego de prueba 1',
      descripcion: 'Descripción de prueba',
      imagen: 'https://example.com/game1.jpg',
    },
    {
      id: 'ftg-2',
      nombre: 'Juego de prueba 2',
      descripcion: 'Otra descripción',
      imagen: null,
    },
  ];

  const mockService = {
    findAll: jest.fn(() => mockGames),
    findById: jest.fn((id: string) => {
      const game = mockGames.find((g) => g.id === id);
      return game;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatalogController],
      providers: [
        {
          provide: CatalogService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<CatalogController>(CatalogController);
    service = module.get<CatalogService>(CatalogService);
  });

  it('debería estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('debería retornar todos los juegos', () => {
      const result = controller.findAll();
      expect(result).toEqual(mockGames);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('debería retornar un juego por ID', () => {
      const result = controller.findById('ftg-1');
      expect(result).toEqual(mockGames[0]);
      expect(service.findById).toHaveBeenCalledWith('ftg-1');
    });

    it('debería lanzar NotFoundException si el juego no existe', () => {
      expect(() => controller.findById('no-existe')).toThrow(NotFoundException);
    });
  });
});