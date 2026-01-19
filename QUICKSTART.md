# 🚀 Guía de Inicio Rápido - Naturgy Rechazos

## Opción 1: Inicio Inmediato con Docker

```bash
# 1. Navegar al directorio del proyecto
cd naturgy-rejections

# 2. Construir y ejecutar
docker-compose up --build

# 3. Abrir en el navegador
# http://localhost:3000
```

## Opción 2: Desarrollo Local

```bash
# 1. Instalar dependencias
npm install

# 2. Ejecutar servidor de desarrollo
npm run dev

# 3. Abrir en el navegador
# http://localhost:3000
```

## 📝 Primeros Pasos

### 1. Cargar Datos de Prueba

En la interfaz:
1. Descarga el archivo de ejemplo: `/public/sample-data.csv`
2. Arrastra el archivo CSV a la zona de carga
3. Los casos se cargarán automáticamente

### 2. Explorar el Dashboard

- **Naranja**: Comunicaciones en curso (status: "In progress")
- **Azul**: Casos pendientes de acción

### 3. Gestionar Casos

- **Buscar**: Escribe en el campo de búsqueda
- **Filtrar**: Selecciona un estado del dropdown
- **Ver Detalles**: Haz clic en cualquier fila
- **Ordenar**: Haz clic en los encabezados de columna

## 📊 Formato del CSV

Tu CSV debe tener estas columnas (en orden):

```
DNI/CIF, Nombre y apellidos, CUPS, Contrato NC, Linea de negocio, 
Código SC, Dirección completa, Codigo postal, Municipio, Provincia, 
CCAA, Distribuidora, Grupo distribuidora, Email contacto Naturgy, 
Teléfono contacto Naturgy, Proceso, Potencia actual, Potencia solicitada, 
Status, Email thread ID, Fecha primer Contacto por Email
```

**Estados válidos:**
- `In progress`
- `Revisar gestor`
- `Cancelar SC`

## 🔧 Comandos Útiles

```bash
# Desarrollo
npm run dev              # Servidor de desarrollo

# Producción
npm run build            # Construir para producción
npm start                # Ejecutar build de producción

# Docker
docker-compose up        # Ejecutar en Docker
docker-compose down      # Detener Docker

# Docker (modo desarrollo con hot reload)
docker-compose -f docker-compose.dev.yml up
```

## ❓ Problemas Comunes

### Error: "Puerto 3000 en uso"

```bash
# Opción 1: Detener el proceso en el puerto 3000
lsof -ti:3000 | xargs kill -9

# Opción 2: Usar otro puerto
# Edita docker-compose.yml: "3001:3000"
```

### El CSV no se carga

- ✅ Verifica que sea un archivo `.csv`
- ✅ Comprueba que el campo "Código SC" sea único
- ✅ Asegúrate de que "Status" tenga un valor válido

### Los datos desaparecen

- ⚠️ Los datos se guardan en localStorage del navegador
- ⚠️ No uses modo incógnito
- ⚠️ Los datos son locales (no se comparten entre navegadores/dispositivos)

## 🎨 Personalización

### Cambiar colores

Edita `/app/globals.css`:

```css
:root {
  --naturgy-orange: #e57200;  /* Tu color naranja */
  --naturgy-blue: #004571;    /* Tu color azul */
}
```

## 📞 Soporte

Para más información, consulta el `README.md` completo o contacta al equipo de desarrollo.

---

**¡Listo para usar!** 🎉
