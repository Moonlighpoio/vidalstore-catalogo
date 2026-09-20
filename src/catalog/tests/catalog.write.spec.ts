import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CatalogController } from '../catalog.controller';
import { CatalogService } from '../catalog.service';
import { TokenPresenceGuard } from '../../common/guards/token-presence.guard';

describe('CatalogController - Write Operations', () => {
  let controller: CatalogController;
  let service: CatalogService;

  const mockGame = {
    id: 'ftg-999',
    nombre: 'Juego de prueba',
    descripcion: 'Descripción de prueba',
    imagen: 'https://example.com/game.jpg',
  };

  const mockService = {
    findAll: jest.fn(() => []),
    findById: jest.fn((id: string) => (id === 'ftg-999' ? mockGame : undefined)),
    create: jest.fn((game) => game),
    update: jest.fn((id, changes) => ({ ...mockGame, ...changes })),
  };

  const mockGuard = {
    canActivate: jest.fn(() => true),
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
    })
      .overrideGuard(TokenPresenceGuard)
      .useValue(mockGuard)
      .compile();

    controller = module.get<CatalogController>(CatalogController);
    service = module.get<CatalogService>(CatalogService);
  });

  describe('create', () => {
    it('debería crear un nuevo juego', () => {
      const createDto = {
        nombre: 'Nuevo juego',
        descripcion: 'Nueva descripción',
      };

      const result = controller.create(createDto);

      expect(result.nombre).toBe('Nuevo juego');
      expect(result.descripcion).toBe('Nueva descripción');
      expect(service.create).toHaveBeenCalledWith(
        expect.objectContaining({
          nombre: 'Nuevo juego',
          descripcion: 'Nueva descripción',
        }),
      );
    });
  });

  describe('update', () => {
    it('debería actualizar un juego existente', () => {
      const updateDto = {
        nombre: 'Juego actualizado',
      };

      const result = controller.update('ftg-999', updateDto);

      expect(result.nombre).toBe('Juego actualizado');
      expect(service.update).toHaveBeenCalledWith('ftg-999', updateDto);
    });

    it('debería lanzar NotFoundException si el juego no existe', () => {
      const updateDto = {
        nombre: 'Juego actualizado',
      };

      expect(() => controller.update('no-existe', updateDto)).toThrow(NotFoundException);
    });
  });
});