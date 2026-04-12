# SISCONTA API - Arquitectura del Proyecto

## Descripción General
SISCONTA es un sistema financiero NestJS con Prisma + Supabase (PostgreSQL) que proporciona simulación de créditos e inversiones.

## Módulos Implementados (04/2026)

### 1. Auth Module ✅
**Ubicación**: `src/auth/`
- **Funcionalidad**: Autenticación JWT completa
- **Endpoints**:
  - `POST /auth/register` - Registro de usuario (hashea password con bcrypt)
  - `POST /auth/login` - Login y generación de JWT token
- **Guards**: JwtAuthGuard, RolesGuard
- **Decoradores**: @Roles(), @CurrentUser()
- **Características**:
  - Token incluye: id, email, role
  - Duración: 7 días
  - Secret: `process.env.JWT_SECRET` o `'sisconta_secret_2024'`

### 2. Institution Module ✅
**Ubicación**: `src/institution/`
- **Funcionalidad**: CRUD de instituciones financieras
- **Endpoints**:
  - `POST /institution` - Crear institución (ADMIN only)
  - `GET /institution` - Obtener institución activa (público)
  - `GET /institution/:id` - Obtener institución específica (público)
  - `PATCH /institution/:id` - Actualizar institución (ADMIN only)
  - `POST /institution/:id/logo` - Subir logo con Multer (ADMIN only)
- **Almacenamiento de archivos**: `/uploads/` en la raíz del proyecto

### 3. Credit Types Module ✅
**Ubicación**: `src/credit-types/`
- **Funcionalidad**: CRUD de tipos de crédito
- **Endpoints**:
  - `POST /credit-types` - Crear tipo de crédito (ADMIN only)
  - `GET /credit-types` - Listar todos (público)
  - `GET /credit-types/:id` - Obtener con cargos incluidos (público)
  - `PATCH /credit-types/:id` - Actualizar (ADMIN only)
  - `DELETE /credit-types/:id` - Eliminar (ADMIN only)
- **Relaciones**: Incluye indirectCharges

### 4. Charges Module ✅
**Ubicación**: `src/charges/`
- **Funcionalidad**: CRUD de cargos indirectos
- **Endpoints**:
  - `POST /charges` - Crear cargo (ADMIN only)
  - `GET /charges` - Listar todos (público)
  - `GET /charges/credit-type/:creditTypeId` - Listar por tipo de crédito (público)
  - `GET /charges/:id` - Obtener cargo específico (público)
  - `PATCH /charges/:id` - Actualizar (ADMIN only)
  - `DELETE /charges/:id` - Eliminar (ADMIN only)
- **Tipos**: FIXED (monto fijo) o PERCENTAGE (porcentaje)
- **Mandatory**: Si true, aplica a todos los créditos del tipo

## Configuración Global

### CORS (main.ts)
```
origen: '*'
métodos: GET, POST, PATCH, DELETE
headers: Content-Type, Authorization
```

### ValidationPipe (main.ts)
```
whitelist: true
forbidNonWhitelisted: true
transform: true
```

## Modelos NO Modificables
- `src/investments/` - Ya completo
- `src/prisma/` - Ya completo
- `prisma/schema.prisma` - Ya definido

## Dependencias Instaladas
- @nestjs/jwt, @nestjs/passport, passport, passport-jwt
- bcrypt (hash de contraseñas)
- multer (upload de archivos)
- class-validator, class-transformer (validación DTOs)

## Variables de Entorno
```
JWT_SECRET=sisconta_secret_2024
JWT_EXPIRATION=7d
PORT=3000 (por defecto)
DATABASE_URL={URL de Supabase}
```

## Estructura de Carpetas
```
src/
├── auth/
│   ├── dtos/
│   ├── decorators/
│   ├── guards/
│   ├── strategies/
│   ├── auth.service.ts
│   ├── auth.controller.ts
│   └── auth.module.ts
├── institution/
│   ├── dtos/
│   ├── institution.service.ts
│   ├── institution.controller.ts
│   └── institution.module.ts
├── credit-types/
│   ├── dtos/
│   ├── credit-types.service.ts
│   ├── credit-types.controller.ts
│   └── credit-types.module.ts
├── charges/
│   ├── dtos/
│   ├── charges.service.ts
│   ├── charges.controller.ts
│   └── charges.module.ts
├── investments/ (NO MODIFICAR)
├── prisma/ (NO MODIFICAR)
├── app.module.ts (ACTUALIZADO)
└── main.ts (ACTUALIZADO)
```

## Próximos Pasos Sugeridos
1. Crear migraciones de Prisma
2. Configurar variables de entorno
3. Crear tests unitarios
4. Implementar swagger decorators en DTOs
