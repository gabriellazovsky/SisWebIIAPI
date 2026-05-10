<a id="readme-top"></a>
 
<br />
<div align="center">
  <a href="https://github.com/othneildrew/Best-README-Template">
    <img src="images/formula1.jpeg" alt="Logo" width="200" height="120">
  </a>

  <h3 align="center">Formula 1 Paddock Insights API</h3>

  <p align="center">
    Una API RESTful desarrollada con Node.js y MongoDB para entusiastas y analistas de Formula 1.
    <br />
    <br />
  </p>
</div>

## Sobre el Proyecto

Este proyecto ha sido desarrollado para la asignatura **Sistemas Web II**. Se trata de una API REST centrada en el **Campeonato Mundial de Fórmula 1**. El sistema gestiona datos de tres recursos relacionados (Pilotos, Constructores y Resultados) e integra datos en tiempo real de proveedores externos.



### Tema Escogido

***Formula 1 World Championship (1950 - 2026)***

  > https://www.kaggle.com/datasets/rohanrao/formula-1-world-championship-1950-2020?select=driver_standings.csv.

### Equipo

- **Alejandra O’Shea**
- **Marta Sanchez**
- **Pilar Bourg**
- **Ignacio Lorén**
- **Gabriel Lazovsky**
- **Javier Rozalén**
- **Javier de Quadros**

<p align="right">(<a href="#readme-top">volver arriba</a>)</p>

### Tecnologías Utilizadas

* [![Node][Node.js]][Node-url]
* [![Express][Express.js]][Express-url]
* [![MongoDB][MongoDB]][MongoDB-url]

<p align="right">(<a href="#readme-top">volver arriba</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[Node.js]: https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white
[Node-url]: https://nodejs.org/
[Express.js]: https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB
[Express-url]: https://expressjs.com/
[MongoDB]: https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white
[MongoDB-url]: https://www.mongodb.com/
[Swagger]: https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white
[Swagger-url]: https://swagger.io/

---

## Instalación

### 1. Clonar el repositorio

```bash
git clone <REPOSITORY_URL>
```

---

### 2. Instalar dependencias

#### Backend

```bash
cd server
npm install
```

#### Frontend

```bash
cd client/app
npm install
```

---

## Variables de entorno

Crear un archivo `.env` dentro de `server/routes/` o `server/` dependiendo de la configuración del proyecto.

Ejemplo:

```env
PORT=5050
ATLAS_URI=mongodb+srv://USER:PASSWORD@cluster.mongodb.net/ProjectDatabase
```

---

## Inicialización de MongoDB

Para cargar los datasets:

```bash
npm run seed
```

Este script importa automáticamente los datasets JSON/CSV a MongoDB.

---

## Ejecución del servidor

```bash
npm run dev
```

Servidor disponible en:

```text
http://localhost:5050
```

---

# Funcionalidades principales

- API RESTful completa
- CRUD sobre múltiples colecciones
- Integración con APIs externas
- Consumo de datos XML y JSON
- Respuestas XML con schemas XSD
- Webhook simulado para OpenF1
- Sistema fallback usando MongoDB
- Paginación y filtros
- OpenAPI/Swagger

---

# APIs externas utilizadas

## OpenF1 API (JSON)

Utilizada para:
- Weather
- Race Control
- Team Radio

https://openf1.org/

---

## Formula1 XML Feed

Consumido para integrar noticias oficiales de Fórmula 1 en formato XML.

https://www.formula1.com/en/latest/all.xml

---

# XML y XSD

La API incluye endpoints XML y sus schemas asociados.

Ejemplo:

```text
GET /api/drivers/xml
```

Schema asociado:

```text
documentation/schemas/drivers.xsd
```

---

# Webhook

Se implementó un webhook simulado para recepción de eventos OpenF1.

Endpoint:

```text
POST /api/webhooks/openf1
```

Ejemplo:

```json
{
  "event": "race_control",
  "session_key": 9158,
  "category": "Flag",
  "message": "YELLOW FLAG",
  "lap_number": 12
}
```

Los eventos recibidos se almacenan en MongoDB.

---

# Paginación y filtros

La API implementa paginación y filtros para colecciones grandes.

Ejemplos:

```text
/api/results?page=1&limit=20

/api/results?driverId=1

/api/lap-times?raceId=1&driverId=1
```

---

# Tolerancia a fallos

La aplicación implementa un sistema de fallback:

- Si OpenF1 falla → MongoDB devuelve últimos datos almacenados
- Si el XML externo falla → se utilizan datos persistidos localmente

Esto evita que la API deje de funcionar completamente.

---

# OpenAPI

El proyecto incluye documentación OpenAPI:

```text
documentation/f1-project-openapi-final.yaml
```

---

# Modelo de datos

La documentación del modelo de datos está disponible en:

```text
documentation/data-model.md
```

---

# Diseño REST

La documentación REST se encuentra en:

```text
documentation/REST-design.md
```

---

# Estructura del proyecto

```text
server/
  controllers/
  routes/
  services/
  db/
  scripts/

client/app/

documentation/
  schemas/
  data-model.md
  REST-design.md
  f1-project-openapi-final.yaml
```
