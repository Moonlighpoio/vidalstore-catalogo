# VidalStore — Catálogo

Microservicio de catálogo de videojuegos de la plataforma **VidalStore**. Se encarga de listar, consultar, crear, editar y eliminar los juegos a la venta, y persiste su estado en un repositorio en memoria respaldado por el archivo `data/games.json`.

VidalStore vende **licencias de uso de videojuegos digitales**: el usuario navega el catálogo, compra un juego y el backend le asocia una licencia en su biblioteca.

## Arquitectura

El catálogo es la capa de datos más profunda del flujo: nunca es llamado directamente por el navegador.

```text
Navegador (Angular)  :4200
      │  Authorization: Bearer <access token>
      ▼
API Gateway (NestJS) :8080   ← valida el JWT contra el JWKS de AWS Cognito
      │  Authorization + x-user-sub + x-user-groups
      ▼
BFF (NestJS)         :3000   ← autoriza por grupo de Cognito y enruta
      │  Authorization + x-user-sub + x-user-groups
      ▼
Catálogo (este repo) :8001   ← entrega los juegos
```

> El microservicio no configura CORS. El único origen permitido lo gestiona el API Gateway.

## Funcionalidad

- Listado paginado del catálogo de juegos (`GET /v1/catalogo`).
- Búsqueda de un juego por su ID (`GET /v1/catalogo/:id`).
- Creación, edición y eliminación de juegos con autorización por grupos.
- Seed de datos desde la API pública **FreeToGame** (`npm run seed`).
- Repositorio en memoria que persiste los cambios en `data/games.json`.
- Validación estricta de DTOs (se rechazan campos desconocidos).
- Endpoint de health check público.

## Tecnologías

- NestJS + TypeScript.
- `@nestjs/config` para variables de entorno y `class-validator` para los DTOs.
- Axios (seed y consumo de la API externa).
- Jest (pruebas unitarias y e2e) y Oxlint (linting).
- AWS Cognito: el servicio confía en los headers del BFF (no valida el JWT por sí mismo).

## Requisitos

- Node.js 18 o superior.
- npm.
- Un BFF corriendo (o un cliente HTTP que envíe los headers `x-user-sub` y `x-user-groups`).

## Instalación

```bash
git clone https://github.com/wsk4/vidalstore-catalogo.git
cd vidalstore-catalogo
npm install
```

Crea el archivo de entorno local:

```bash
cp .env.example .env
```

## Variables de entorno

| Variable | Descripción | Valor por defecto |
|---|---|---|
| `PORT` | Puerto del servicio. | `8001` |
| `NODE_ENV` | Entorno de ejecución. | `development` |
| `COGNITO_REGION` | Región del user pool (contexto). | `us-east-1` |
| `COGNITO_USER_POOL_ID` | ID del user pool (contexto). | — |
| `COGNITO_APP_CLIENT_ID` | ID del app client (contexto). | — |
| `COGNITO_ISSUER` | Issuer del user pool (contexto). | — |
| `COGNITO_JWKS_URI` | URI del well-known JWKS (contexto). | — |
| `MAX_GAMES_PER_PAGE` | Tope de juegos por página. | `50` |
| `CACHE_TTL_SECONDS` | TTL de caché en segundos. | `300` |
| `EXTERNAL_GAMES_API_URL` | URL de la API FreeToGame usada por el seed. | — |

Nunca se versiona un `.env` con valores reales ni credenciales de AWS.

## Ejecución

```bash
# desarrollo con recarga
npm run start:dev

# compilación y producción
npm run build
npm run start:prod
```

El servicio queda disponible en `http://localhost:8001`.

### Cargar datos iniciales (seed)

```bash
npm run seed
```

Descarga los juegos desde la API FreeToGame y genera `data/games.json`.

## Endpoints

| Método | Ruta | Descripción | Autorización |
|---|---|---|---|
| `GET` | `/health` | Health check. | Público |
| `GET` | `/v1/catalogo` | Lista el catálogo. | Header `x-user-sub` presente (401 si falta) |
| `GET` | `/v1/catalogo/:id` | Busca un juego por ID (404 si no existe). | Header `x-user-sub` presente |
| `POST` | `/v1/catalogo` | Crea un juego. | `editores` o `administradores` |
| `PUT` | `/v1/catalogo/:id` | Actualiza un juego. | `editores` o `administradores` |
| `DELETE` | `/v1/catalogo/:id` | Elimina un juego. | `editores` o `administradores` |

### Autenticación y autorización

El microservicio asume que ya fue autenticado por el Gateway y autorizado por el BFF:

- `TokenPresenceGuard` exige el header `x-user-sub` → `401 Unauthorized` si no viene.
- `EditorGuard` exige que el grupo `x-user-groups` contenga `editores` o `administradores` para escrituras → `403 Forbidden` si no alcanza.
- `GET /v1/catalogo` responde `401` sin `x-user-sub` y `200` con uno válido.

### Ejemplos con curl

```bash
# Health check (público)
curl -i http://localhost:8001/health

# Catálogo sin autenticación → 401
curl -i http://localhost:8001/v1/catalogo

# Catálogo con headers del BFF → 200
curl -i http://localhost:8001/v1/catalogo \
  -H "x-user-sub: user-123" \
  -H "x-user-groups: jugadores"

# Crear juego con rol de jugador → 403
curl -i -X POST http://localhost:8001/v1/catalogo \
  -H "x-user-sub: user-123" \
  -H "x-user-groups: jugadores" \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Nuevo juego"}'

# Crear juego con rol de editor → 201
curl -i -X POST http://localhost:8001/v1/catalogo \
  -H "x-user-sub: user-123" \
  -H "x-user-groups: editores" \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Nuevo juego","descripcion":"Demo","imagen":"https://..."}'
```

## Códigos de respuesta

| Código | Significado | Cuándo se usa |
|---|---|---|
| `200 OK` | Éxito | Lecturas y actualizaciones exitosas. |
| `201 Created` | Recurso creado | `POST /v1/catalogo`. |
| `401 Unauthorized` | No autenticado | Falta `x-user-sub`. |
| `403 Forbidden` | No autorizado | Rol insuficiente para escritura. |
| `404 Not Found` | No encontrado | ID de juego inexistente. |

## Pruebas

```bash
npm test          # pruebas unitarias
npm run test:watch
npm run test:cov  # con cobertura
npm run test:e2e  # pruebas e2e
npm run lint      # oxlint
```

## Scripts disponibles

```bash
npm run build        # compilar TypeScript
npm run start:dev    # desarrollo con watch
npm run start:prod   # producción
npm run seed         # seed desde FreeToGame API
npm test             # pruebas unitarias
npm run test:e2e     # pruebas e2e
npm run lint         # oxlint
npm run format       # prettier
```

## Estructura del proyecto

```text
src/
├── catalog/
│   ├── dto/                    # CreateGameDto, UpdateGameDto
│   ├── entities/               # GameEntity
│   ├── repositories/           # InMemoryGameRepository
│   ├── catalog.controller.ts
│   ├── catalog.module.ts
│   └── catalog.service.ts
├── common/
│   ├── filters/                # HttpExceptionFilter
│   └── guards/                 # TokenPresenceGuard, EditorGuard
├── data/                       # cliente de la API FreeToGame
├── health/                     # health check
├── app.module.ts
└── main.ts

data/                           # seed y data/games.json
test/                           # pruebas e2e
```

## Licencia

Proyecto académico DUOC UC — DSY1107 Desarrollo Cloud Native I.