# 🚀 Cómo ejecutar el proyecto (Guía de ejecución)

## Requisitos previos

Antes de ejecutar el proyecto, asegúrese de tener instalado:

- Node.js
- npm
- MongoDB Atlas (o acceso a la base de datos configurada)
- Git

---

## 1. Clonar el repositorio

Abra una terminal y ejecute:

```bash
git clone https://github.com/gabriellazovsky/SisWebIIAPI.git
```

Después acceda al proyecto:

```bash
cd SisWebIIAPI
```

---

## 2. Configurar variables de entorno

Dentro de la carpeta `server`, cree un archivo llamado:

```text
.env
```

Con el siguiente contenido:

```env
PORT=5050
ATLAS_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/ProjectDatabase
```

⚠️ Importante: sustituya los valores por sus credenciales reales de MongoDB Atlas.

---

## 3. Instalar dependencias

### Backend

Desde la carpeta `server`:

```bash
cd server
npm install
```

---

### Frontend (opcional)

Si desea ejecutar también la interfaz cliente:

```bash
cd ../client/app
npm install
```

---

## 4. Inicializar la base de datos

Desde la carpeta `server`, ejecute:

```bash
npm run seed
```

Este script cargará automáticamente los datasets incluidos en el proyecto en MongoDB.

---

## 5. Iniciar el backend

Desde la carpeta `server`:

```bash
npm run dev
```

Si todo funciona correctamente, verá:

```text
Server is running on port: 5050
```

La API estará disponible en:

```text
http://localhost:5050
```

---

## 6. Iniciar frontend (opcional)

Si quiere probar el cliente:

```bash
cd client/app
npm run dev
```

---

# 🧪 Guía rápida de prueba

## Probar funcionamiento básico

### Drivers (JSON)

```text
http://localhost:5050/drivers
```

---

### Drivers (XML)

```text
http://localhost:5050/drivers/xml
```

---

### Standings

Driver standings:

```text
http://localhost:5050/standings/drivers
```

Constructor standings:

```text
http://localhost:5050/standings/constructors
```

---

# 🌐 APIs externas (OpenF1)

## Paso 1: Obtener sesiones disponibles

Primero consulte:

```text
http://localhost:5050/openf1/sessions
```

Esto devolverá sesiones disponibles con su `session_key`.

---

## Paso 2: Consultar endpoints OpenF1

Usando un `session_key` válido:

### Weather

```text
http://localhost:5050/openf1/weather?session_key=1142
```

### Race Control

```text
http://localhost:5050/openf1/race-control?session_key=1144
```

### Team Radio

```text
http://localhost:5050/openf1/team-radio?session_key=1144
```

---

# 🔁 Sistema fallback

Si OpenF1 no responde o no devuelve resultados:

- la API NO fallará
- se devolverán datos almacenados en MongoDB

Ejemplo:

```json
{
  "source": "database"
}
```

Esto indica que el mecanismo fallback está funcionando correctamente.

---

# 📩 Webhook opcional implementado

Se implementó un webhook simulado para recepción de eventos externos.

Endpoint:

```text
POST http://localhost:5050/webhooks/openf1
```

Payload de ejemplo:

```json
{
  "event": "race_control",
  "session_key": 9158,
  "category": "Flag",
  "message": "YELLOW FLAG",
  "lap_number": 12
}
```

---

# 📚 Documentación adicional

OpenAPI:

```text
documentation/f1-project-openapi-final.yaml
```

Modelo de datos:

```text
documentation/data-model.md
```

Diseño REST:

```text
documentation/REST-design.md
```

Schema XML:

```text
documentation/schemas/drivers.xsd
```