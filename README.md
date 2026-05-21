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

***Formula 1 World Championship (1950 - 2024)***

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

## Paso 2a: Consultar endpoints OpenF1

Usando un `session_key` válido:

### Weather

```text
http://localhost:5050/openf1/weather?session_key=7772
```

### Race Control

```text
http://localhost:5050/openf1/race-control?session_key=7772
```

### Team Radio

```text
http://localhost:5050/openf1/team-radio?session_key=7772
```
## Paso 2b:  XML Feed Integration (Formula 1 News)

El proyecto también consume una fuente XML oficial de Fórmula 1 
Fuente utilizada:

https://www.formula1.com/en/latest/all.xml

Formato:

```text
XML
```
---

## Endpoint implementado

Para consumir las noticias procesadas desde el backend:

```text
http://localhost:5050/f1-news-xml
```
---

## Qué hace

Este endpoint:

- Consume el XML oficial de Formula 1
- Parsea el contenido XML
- Extrae las noticias relevantes
- Convierte la información a formato utilizable por la aplicación
- Devuelve los datos procesados desde nuestro backend

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
documentation/schemas/circuit.xsd
```
