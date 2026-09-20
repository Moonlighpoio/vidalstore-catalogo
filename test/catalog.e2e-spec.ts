import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { CatalogService } from '../src/catalog/catalog.service';

describe('Catalog API (e2e)', () => {
  let app: INestApplication;
  let service: CatalogService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
    
    service = moduleFixture.get<CatalogService>(CatalogService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/catalogo (GET)', () => {
    it('debería retornar todos los juegos', () => {
      return request(app.getHttpServer())
        .get('/catalogo')
        .set('Authorization', 'Bearer fake-token')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  describe('/catalogo/:id (GET)', () => {
    it('debería retornar un juego por ID', async () => {
      const games = service.findAll();
      const firstGame = games[0];

      return request(app.getHttpServer())
        .get(`/catalogo/${firstGame.id}`)
        .set('Authorization', 'Bearer fake-token')
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(firstGame.id);
        });
    });

    it('debería retornar 404 si el juego no existe', () => {
      return request(app.getHttpServer())
        .get('/catalogo/no-existe')
        .set('Authorization', 'Bearer fake-token')
        .expect(404);
    });
  });

  describe('/catalogo (POST)', () => {
    it('debería crear un nuevo juego', () => {
      return request(app.getHttpServer())
        .post('/catalogo')
        .send({
          nombre: 'Juego e2e',
          descripcion: 'Descripción e2e',
        })
        .set('Authorization', 'Bearer fake-token')
        .expect(201)
        .expect((res) => {
          expect(res.body.nombre).toBe('Juego e2e');
        });
    });

    it('debería retornar 400 si faltan campos requeridos', () => {
      return request(app.getHttpServer())
        .post('/catalogo')
        .send({
          descripcion: 'Sin nombre',
        })
        .set('Authorization', 'Bearer fake-token')
        .expect(400);
    });

    it('debería retornar 401 si no hay token', () => {
      return request(app.getHttpServer())
        .post('/catalogo')
        .send({
          nombre: 'Juego sin token',
          descripcion: 'Descripción',
        })
        .expect(401);
    });
  });

  describe('/catalogo/:id (PUT)', () => {
    it('debería actualizar un juego existente', async () => {
      const games = service.findAll();
      const firstGame = games[0];

      return request(app.getHttpServer())
        .put(`/catalogo/${firstGame.id}`)
        .send({
          nombre: 'Juego actualizado e2e',
        })
        .set('Authorization', 'Bearer fake-token')
        .expect(200)
        .expect((res) => {
          expect(res.body.nombre).toBe('Juego actualizado e2e');
        });
    });

    it('debería retornar 404 si el juego no existe', () => {
      return request(app.getHttpServer())
        .put('/catalogo/no-existe')
        .send({
          nombre: 'Juego actualizado',
        })
        .set('Authorization', 'Bearer fake-token')
        .expect(404);
    });
  });
});