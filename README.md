# Naturgy - Sistema de Gestión de Rechazos

Sistema moderno y eficiente para gestionar rechazos de servicios en Naturgy, con interfaz intuitiva y capacidad para automatización con HappyRobot AI.

## 🎨 Características

- **Dashboard Intuitivo**: Visualiza en tiempo real las comunicaciones en curso y procesos pendientes de acción
- **Gestión de Casos**: Sistema completo de seguimiento con información detallada de cada rechazo
- **Línea de Tiempo**: Historial completo de eventos por caso (emails, llamadas, documentos)
- **Importación CSV**: Carga masiva de casos mediante archivos CSV
- **Búsqueda y Filtrado**: Localiza casos rápidamente por código, nombre, estado o proceso
- **Diseño Responsive**: Funciona perfectamente en dispositivos móviles, tablets y escritorio
- **Branding Naturgy**: Colores corporativos e identidad visual de Naturgy

## 🚀 Inicio Rápido

### Requisitos Previos

- Docker y Docker Compose instalados
- O bien: Node.js 20+ y npm

### Opción 1: Con Docker (Recomendado)

```bash
# Clonar o navegar al directorio del proyecto
cd naturgy-rejections

# Construir y ejecutar con Docker Compose
docker-compose up --build

# La aplicación estará disponible en http://localhost:3000
```

### Opción 2: Desarrollo Local

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# La aplicación estará disponible en http://localhost:3000
```

## 📊 Uso del Sistema

### 1. Cargar Casos desde CSV

El sistema acepta archivos CSV con las siguientes columnas:

| Columna | Descripción |
|---------|-------------|
| DNI/CIF | Identificación del cliente |
| Nombre y apellidos | Nombre completo del cliente |
| CUPS | Código Universal de Punto de Suministro |
| Contrato NC | Número de contrato |
| Linea de negocio | Línea de negocio asociada |
| Código SC | **Identificador único del caso (Primary Key)** |
| Dirección completa | Dirección del punto de suministro |
| Codigo postal | Código postal |
| Municipio | Municipio |
| Provincia | Provincia |
| CCAA | Comunidad Autónoma |
| Distribuidora | Distribuidora eléctrica |
| Grupo distribuidora | Grupo de la distribuidora |
| Email contacto Naturgy | Email de contacto |
| Teléfono contacto Naturgy | Teléfono de contacto |
| Proceso | Tipo de proceso |
| Potencia actual | Potencia contratada actual |
| Potencia solicitada | Potencia solicitada |
| Status | Estado del caso (ver estados válidos abajo) |
| Email thread ID | ID del hilo de email (opcional) |
| Fecha primer Contacto por Email | Fecha del primer contacto |

**Estados Válidos:**
- `In progress` - Caso en proceso de gestión
- `Revisar gestor` - Requiere revisión del gestor
- `Cancelar SC` - Pendiente de cancelación

### 2. Visualizar Dashboard

El dashboard muestra dos métricas principales:

- **Comunicaciones En Curso** (naranja): Casos con estado "In progress"
- **Procesos Pendientes de Acción** (azul): Casos con estado "Revisar gestor" o "Cancelar SC"

### 3. Gestionar Casos

- **Buscar**: Usa el campo de búsqueda para filtrar por código, nombre, CUPS o proceso
- **Filtrar por Estado**: Selecciona un estado específico del dropdown
- **Ordenar**: Haz clic en los encabezados de columna para ordenar
- **Ver Detalles**: Haz clic en cualquier fila para expandir y ver la información completa

### 4. Línea de Tiempo

Cada caso tiene una línea de tiempo que registra eventos:

- 📧 **Email Enviado**: Correo saliente a cliente/distribuidora
- 📞 **Llamada Iniciada**: Contacto telefónico realizado
- 📎 **Email Recibido (con adjunto)**: Respuesta recibida con documentación
- 📨 **Email Recibido (sin adjunto)**: Respuesta recibida sin documentación

## 🎨 Colores Corporativos Naturgy

El sistema utiliza la paleta oficial de Naturgy:

- **Naranja Principal**: `#e57200`
- **Azul Principal**: `#004571`
- **Azul Claro**: `#7FBBE3`
- **Gris**: `#333333`

## 🔧 Tecnologías Utilizadas

- **Framework**: Next.js 14 con App Router
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS 4
- **Iconos**: Lucide React
- **Parsing CSV**: PapaParse
- **Almacenamiento**: localStorage (para datos de casos)
- **Containerización**: Docker + Docker Compose

## 📁 Estructura del Proyecto

```
naturgy-rejections/
├── app/
│   ├── layout.tsx          # Layout con header y footer Naturgy
│   ├── page.tsx            # Página principal
│   ├── globals.css         # Estilos globales y colores Naturgy
│   └── api/
│       └── upload/
│           └── route.ts    # API endpoint para carga CSV
├── components/
│   ├── Dashboard.tsx       # Tarjetas de estadísticas
│   ├── CSVUpload.tsx       # Componente de carga CSV drag & drop
│   ├── CaseList.tsx        # Tabla de casos con filtros
│   ├── CaseRow.tsx         # Fila expandible de caso
│   ├── CaseDetail.tsx      # Vista detallada de caso
│   └── Timeline.tsx        # Línea de tiempo de eventos
├── lib/
│   ├── CasesContext.tsx    # Context de React para estado global
│   └── csvParser.ts        # Utilidad para parsear CSV
├── types/
│   └── case.ts            # Definiciones TypeScript
├── public/
│   └── naturgy-logo.png   # Logo de Naturgy
├── Dockerfile             # Configuración Docker
├── docker-compose.yml     # Orquestación Docker
└── package.json           # Dependencias del proyecto
```

## 🔄 Integración con HappyRobot (Futuro)

El sistema está preparado para integración futura con HappyRobot AI para automatización de comunicaciones. Consulta el archivo `HAPPYROBOT_INTEGRATION_GUIDE.md` en la raíz del proyecto para más detalles.

### Variables de Entorno (cuando integres HappyRobot)

Crea un archivo `.env.local` con:

```bash
HAPPYROBOT_WEBHOOK_URL=https://hooks.happyrobot.ai/webhook/xxxxx
HAPPYROBOT_X_API_KEY=your_workflow_api_key
HAPPYROBOT_API_KEY=hr_api_xxxxxxxxxxxxx
HAPPYROBOT_ORG_ID=org_xxxxxxxxxxxxx
HAPPYROBOT_ORG_SLUG=your_org_slug
HAPPYROBOT_WORKFLOW_ID=your_workflow_id
APP_URL=https://your-app-url.com
```

## 🔒 Persistencia de Datos

Los datos de casos se almacenan en `localStorage` del navegador. Esto significa:

- ✅ Los datos persisten entre sesiones del navegador
- ✅ No requiere backend o base de datos para funcionar
- ⚠️ Los datos son locales al navegador (no compartidos entre dispositivos)
- ⚠️ Limpiar caché del navegador eliminará los datos

Para un entorno de producción multi-usuario, se recomienda implementar un backend con PostgreSQL (ver guía de HappyRobot).

## 🛠️ Comandos Disponibles

```bash
# Desarrollo
npm run dev          # Ejecuta servidor de desarrollo

# Producción
npm run build        # Construye para producción
npm start           # Ejecuta build de producción

# Docker
docker-compose up --build    # Construye y ejecuta con Docker
docker-compose down          # Detiene los contenedores

# Linting
npm run lint        # Ejecuta ESLint
```

## 📝 Ejemplo de CSV

```csv
DNI/CIF,Nombre y apellidos,CUPS,Contrato NC,Linea de negocio,Código SC,Dirección completa,Codigo postal,Municipio,Provincia,CCAA,Distribuidora,Grupo distribuidora,Email contacto Naturgy,Teléfono contacto Naturgy,Proceso,Potencia actual,Potencia solicitada,Status,Email thread ID,Fecha primer Contacto por Email
12345678A,Juan Pérez García,ES0021000000000001AB,NC123456,Electricidad,SC-2024-001,Calle Mayor 123,28001,Madrid,Madrid,Madrid,UFD,Unión Fenosa,juan.perez@email.com,600123456,Cambio de potencia,3.3 kW,5.75 kW,In progress,thread_001,2024-01-15
```

## 🐛 Solución de Problemas

### El CSV no se carga

- Verifica que el archivo tenga extensión `.csv`
- Asegúrate de que incluye todas las columnas requeridas
- Verifica que el campo `Código SC` sea único para cada fila

### Los datos desaparecen

- Verifica que no estés en modo incógnito
- Comprueba que no se haya limpiado la caché del navegador
- Los datos son locales al navegador específico

### Error al ejecutar con Docker

```bash
# Si hay problemas con permisos
sudo docker-compose up --build

# Si el puerto 3000 está en uso
# Edita docker-compose.yml y cambia "3000:3000" por "3001:3000"
```

## 📄 Licencia

© 2024 Naturgy. Todos los derechos reservados.

---

Para más información o soporte, contacta con el equipo de desarrollo de Naturgy.
