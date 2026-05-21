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
git clone <https://github.com/gabriellazovsky/SisWebIIAPI>
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

Utilizada para obtener información en tiempo real relacionada con Fórmula 1:

- Weather
- Race Control
- Team Radio
- Sessions

API oficial:

https://openf1.org/

---

## Formula1 XML Feed

Consumido para integrar noticias oficiales de Fórmula 1 en formato XML.

Feed oficial:

https://www.formula1.com/en/latest/all.xml

---

# 🚀 Cómo ejecutar el proyecto 

## 1. Instalar dependencias

Abra una terminal en la raíz del proyecto y ejecute:

```bash
npm install
```

---

## 2. Iniciar el servidor de desarrollo

```bash
npm run dev
```

El servidor estará disponible en:

```text
http://localhost:5050
```

---

## 3. Guía de prueba rápida

> **Nota importante:**  
> Por favor, siga el orden de los pasos.  
> Las consultas de clima requieren un parámetro numérico (`session_key`) que se obtiene primero desde el endpoint de sesiones.

---

### Paso 1: Obtener sesiones disponibles

Acceda al siguiente endpoint para visualizar las sesiones disponibles y obtener un `session_key` válido:

```text
http://localhost:5050/api/openf1/sessions
```

Este endpoint devuelve sesiones oficiales disponibles desde OpenF1.

---

### Paso 2: Consultar clima usando un session_key

Una vez seleccionado un `session_key`, puede consultar información meteorológica:

Ejemplo:

```text
http://localhost:5050/api/openf1/weather?session_key=1142
```

---

### Enlaces de prueba directos

Para facilitar la corrección del proyecto:

🌤️ Clima (sesión 1142)

```text
http://localhost:5050/api/openf1/weather?session_key=1142
```

🌧️ Clima (sesión 1144)

```text
http://localhost:5050/api/openf1/weather?session_key=1144
```

🏁 Race Control

```text
http://localhost:5050/api/openf1/race-control?session_key=1144
```

🎙️ Team Radio

```text
http://localhost:5050/api/openf1/team-radio?session_key=1144
```

---

# Sistema de tolerancia a fallos (Fallback)

La API implementa un mecanismo de fallback para evitar fallos completos cuando la API externa no está disponible.

Comportamiento:

- Si OpenF1 responde correctamente → se devuelven datos en tiempo real.
- Si OpenF1 falla o no devuelve resultados → se recuperan datos previamente almacenados en MongoDB.

Esto garantiza continuidad del servicio incluso ante fallos externos.

---

# Webhook (Opcional implementado)

Se ha implementado un webhook simulado para recepción de eventos externos relacionados con OpenF1.

Endpoint:

```text
POST /api/webhooks/openf1
```

Ejemplo de payload:

```json
{
  "event": "race_control",
  "session_key": 9158,
  "category": "Flag",
  "message": "YELLOW FLAG",
  "lap_number": 12
}
```

Los eventos recibidos se almacenan en la colección:

```text
openf1_webhook_events
```

---

# Fuentes de datos externas utilizadas por el backend

Estas APIs son consumidas automáticamente por el sistema:

- **OpenF1 API (JSON)** → clima, control de carrera, radio de equipos y sesiones
- **Formula1 XML Feed** → noticias oficiales XML

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

# Paginación y filtros

La API implementa paginación y filtros para colecciones grandes.

Ejemplos:

```text
/api/results?page=1&limit=20

/api/results?driverId=1

/api/lap-times?raceId=1&driverId=1
```

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
