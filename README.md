# VidalStore - Catálogo Service

Microservicio de catálogo de juegos para VidalStore.

## Arquitectura

┌─────────────────────┐
│ Angular (Front) │
└──────────┬──────────┘
│
▼
┌─────────────────────┐
│ API Gateway │ ← Valida token contra JWKS
└──────────┬──────────┘
│
▼
┌─────────────────────┐
│ BFF │ ← Autoriza por grupos
└──────────┬──────────┘
│
▼
┌─────────────────────┐
│ Catálogo Service │ ← Este repositorio
└─────────────────────┘


## Requisitos

- Node.js 18+
- npm o yarn

## Instalación

```bash
npm install
```

## Variables de entorno

Copiar `.env.example` a `.env` y ajustar valores:

```bash
cp .env.example .env
```

**Variables requeridas**:

```env
PORT=3002
NODE_ENV=development

# Cognito configuration
COGNITO_REGION=us-east-1
COGNITO_USER_POOL_ID=us-east-1_example
COGNITO_APP_CLIENT_ID=example-client-id
COGNITO_ISSUER=[https://cognito-idp.us-east-1.amazonaws.com/us-east-1_example](https://cognito-idp.us-east-1.amazonaws.com/us-east-1_example)
COGNITO_JWKS_URI=[https://cognito-idp.us-east-1.amazonaws.com/us-east-1_example/.well-known/jwks.json](https://cognito-idp.us-east-1.amazonaws.com/us-east-1_example/.well-known/jwks.json)

# Internal settings
MAX_GAMES_PER_PAGE=50
CACHE_TTL_SECONDS=300
```

## Levantar el servicio

```bash
npm run start:dev
```

El servicio estará disponible en `http://localhost:3002`

## Ejecutar seed

```bash
npm run seed
```

Esto generará:
- `data/games.json` → Juegos desde FreeToGame API

## Pruebas

```bash
# Pruebas unitarias
npm test

# Pruebas e2e
npm run test:e2e
```

## Endpoints

| Método | Ruta | Descripción | Autorización |
|--------|------|-------------|--------------|
| `GET` | `/health` | Health check | Público |
| `GET` | `/v1/catalogo` | Lista todos los juegos | Sesión válida |
| `GET` | `/v1/catalogo/:id` | Busca juego por ID | Sesión válida |
| `POST` | `/v1/catalogo` | Crea nuevo juego | `editores`, `administradores` |
| `PUT` | `/v1/catalogo/:id` | Actualiza juego | `editores`, `administradores` |
| `DELETE` | `/v1/catalogo/:id` | Elimina juego | `administradores` |

## Ejemplos de curl

### Health check

```bash
curl -i http://localhost:3002/health
```

**Respuesta esperada**:

```http
HTTP/1.1 200 OK
Content-Type: application/json

{"status":"ok","service":"vidalstore-catalogo","timestamp":"2026-09-20T13:00:00.000Z"}
```

### Catálogo sin token (401)

```bash
curl -i http://localhost:3002/v1/catalogo
```

**Respuesta esperada**:

```http
HTTP/1.1 401 Unauthorized
```

### Catálogo con token (200)

```bash
curl -i \
  http://localhost:3002/v1/catalogo \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

**Respuesta esperada**:

```http
HTTP/1.1 200 OK
Content-Type: application/json

[{"id":"game-1","name":"Game Name","description":"Description","image":"[https://](https://)..."}]
```

### Crear juego sin rol (403)

```bash
curl -i \
  -X POST http://localhost:3002/v1/catalogo \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $PLAYER_TOKEN" \
  -d '{"name":"New Game","description":"Description","image":"[https://](https://)..."}'
```

**Respuesta esperada**:

```http
HTTP/1.1 403 Forbidden
```

### Crear juego con rol editor (201)

```bash
curl -i \
  -X POST http://localhost:3002/v1/catalogo \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $EDITOR_TOKEN" \
  -d '{"name":"New Game","description":"Description","image":"[https://](https://)..."}'
```

**Respuesta esperada**:

```http
HTTP/1.1 201 Created
Content-Type: application/json

{"id":"game-2","name":"New Game","description":"Description","image":"[https://](https://)..."}
```

## Flujo de autenticación

1. **Usuario se autentica en Cognito** → Obtiene token con `cognito:groups`
2. **Frontend envía petición** → Agrega token en `Authorization: Bearer <token>`
3. **API Gateway valida token** → Verifica firma, emisor, vigencia, client_id
4. **BFF autoriza por grupo** → `403` si el rol no alcanza
5. **Microservicio entrega datos** → Retorna juegos del catálogo

## Códigos de respuesta

| Código | Significado | Cuándo se usa |
|--------|-------------|---------------|
| `200 OK` | Éxito | Lectura exitosa |
| `201 Created` | Recurso creado | POST exitoso |
| `204 No Content` | Sin contenido | DELETE exitoso |
| `401 Unauthorized` | No autenticado | Token ausente o inválido |
| `403 Forbidden` | No autorizado | Rol insuficiente |
| `404 Not Found` | No encontrado | Juego no existe |

## Seguridad

- ✅ No commitear `.env` con valores reales
- ✅ No commitear credenciales de AWS
- ✅ Los IDs de User Pool y App Client son públicos
- ✅ Validar token en Gateway, BFF y microservicio
- ✅ Autorizar por `cognito:groups` para operaciones de escritura

## Scripts disponibles

```bash
npm run build        # Compilar TypeScript
npm run start:dev    # Levantar en desarrollo
npm run start:prod   # Levantar en producción
npm test             # Ejecutar pruebas unitarias
npm run test:e2e     # Ejecutar pruebas e2e
npm run seed         # Generar datos desde FreeToGame API
npm run lint         # Ejecutar linter
```

## Licencia

Proyecto académico DUOC UC - DSY1107 - Desarrollo Cloud Native I