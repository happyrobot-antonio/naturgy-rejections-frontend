# 🚀 Deployment en Producción - Frontend

## ⚠️ IMPORTANTE: Variables de Entorno

Next.js embebe las variables `NEXT_PUBLIC_*` en **build time**, no en runtime. Esto significa que debes configurarlas **ANTES** de construir la imagen Docker.

## 📋 Paso a Paso

### 1️⃣ Crear archivo `.env` en producción

```bash
# En tu servidor de producción
cd naturgy-rejections

# Crear .env con la URL de tu backend
cat > .env << EOF
NEXT_PUBLIC_API_URL=https://api.tu-dominio.com/api
EOF
```

**Ejemplos según tu setup:**

```bash
# Con dominio propio
NEXT_PUBLIC_API_URL=https://api.naturgy.tuempresa.com/api

# Con IP y puerto
NEXT_PUBLIC_API_URL=http://123.456.789.0:4000/api

# Mismo servidor, puerto diferente
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

### 2️⃣ Build y Deploy con Docker Compose

```bash
# Opción 1: Con .env file (RECOMENDADO)
docker compose up --build -d

# Opción 2: Pasar variable directamente
NEXT_PUBLIC_API_URL=https://api.tu-dominio.com/api docker compose up --build -d

# Opción 3: Export variable y luego build
export NEXT_PUBLIC_API_URL=https://api.tu-dominio.com/api
docker compose up --build -d
```

### 3️⃣ Verificar que funciona

```bash
# Ver logs
docker logs naturgy-rejections-prod

# Verificar que responde
curl http://localhost:3000

# En el navegador, abrir DevTools > Network
# Verificar que las llamadas van a tu dominio y NO a localhost:4000
```

## 🔧 Para Development

```bash
# Development usa hot-reload y localhost
docker compose -f docker-compose.dev.yml up -d
```

## 🔄 Actualizar en Producción

```bash
# Pull latest changes
git pull

# Rebuild con la variable de entorno
NEXT_PUBLIC_API_URL=https://api.tu-dominio.com/api docker compose up --build -d

# O si tienes .env configurado
docker compose up --build -d
```

## 🐛 Troubleshooting

### Frontend sigue usando localhost:4000

**Causa**: El build se hizo sin la variable de entorno.

**Solución**:
1. Verificar que `.env` existe y tiene `NEXT_PUBLIC_API_URL`
2. Rebuild forzando sin cache:
```bash
docker compose down
docker compose build --no-cache
docker compose up -d
```

### Error: Cannot connect to backend

**Causa**: URL del backend incorrecta o backend no accesible.

**Verificar**:
```bash
# Desde el servidor, verificar que el backend responde
curl https://api.tu-dominio.com/api/cases/stats

# Debe devolver JSON con estadísticas
```

### CORS Error en el navegador

**Causa**: Backend no tiene configurado el origen del frontend.

**Solución**: En el backend `.env`:
```bash
CORS_ORIGIN=https://tu-dominio-frontend.com
```

## 📝 Variables de Entorno

### Frontend (`.env`)
| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | URL del backend API | `https://api.domain.com/api` |

⚠️ **IMPORTANTE**: 
- Debe incluir el protocolo (`http://` o `https://`)
- Debe terminar en `/api`
- NO debe tener trailing slash después de `/api`

### Ejemplos válidos ✅
```bash
NEXT_PUBLIC_API_URL=https://api.naturgy.com/api
NEXT_PUBLIC_API_URL=http://192.168.1.100:4000/api
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

### Ejemplos inválidos ❌
```bash
NEXT_PUBLIC_API_URL=api.naturgy.com/api          # Falta protocolo
NEXT_PUBLIC_API_URL=https://api.naturgy.com      # Falta /api
NEXT_PUBLIC_API_URL=https://api.naturgy.com/api/ # Trailing slash
```

## 🔗 Links Útiles

- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Docker Compose](https://docs.docker.com/compose/)
- [Deployment Guide](../DEPLOYMENT.md)
