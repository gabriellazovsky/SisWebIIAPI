# Base de datos

## Database

El proyecto utiliza MongoDB como base de datos principal.

La información se organiza en múltiples colecciones relacionadas entre sí mediante identificadores numéricos como:

- `driverId`
- `constructorId`
- `raceId`
- `circuitId`

Collecciones principales:

- drivers
- constructors
- races
- circuits
- results
- lap_times
- pit_stops
- qualifying

El sistema combina datos históricos de Fórmula 1 importados desde archivos CSV junto con información externa obtenida mediante la API OpenF1.

Colecciones adicionales de Openf1:

- weather
- raceControl
- teamRadio

---

# Arquitectura General de Datos

```text
Archivos CSV
      ↓
Script Seed
      ↓
Colecciones MongoDB
      ↓
API REST Express
      ↓
Respuestas JSON

API Externa OpenF1
      ↓
Colecciones adicionales y datos en tiempo rea
```
---

## coleccion drivers

```js
{
  driverId: Number,
  driverRef: String,
  number: Number,
  code: String,
  forename: String,
  surname: String,
  dob: String,
  nationality: String,
  url: String
}
```

```ejemplo
{
  driverId: 1,
  driverRef: "hamilton",
  number: 44,
  code: "HAM",
  forename: "Lewis",
  surname: "Hamilton",
  dob: "1985-01-07",
  nationality: "British"
}
```
---
## Colección driver_standings

La colección `driver_standings` almacena la clasificación del campeonato de pilotos de Fórmula 1.

Cada documento representa la posición de un piloto en la clasificación tras una carrera determinada.

### Campos

```js
{
  driverStandingsId: Number,
  raceId: Number,
  driverId: Number,
  points: Number,
 position: Number,
  positionText: Number,
  wins: Number
}
```

### Ejemplo de Documento

```js
{
  "_id": "69eb41d7b9943090fba21376",
  "driverStandingsId": 73247,
  "raceId": 1144,
  "driverId": 830,
  "points": 437,
  "position": 1,
  "positionText": 1,
  "wins": 9
}
```

### Relaciones

```text
driver_standings.raceId → races.raceId
driver_standings.driverId → drivers.driverId
```

---
## Colección races
La colección `races` almacena información histórica de las carreras de Fórmula 1.

### Campos
{
  raceId: Number,
  year: Number,
  round: Number,
  circuitId: Number,
  name: String,
  date: Date,
  time: String,
  url: String,
  fp1_date: String,
  fp1_time: String,
  fp2_date: String,
  fp2_time: String,
  fp3_date: String,
  fp3_time: String,
  quali_date: String,
  quali_time: String,
  sprint_date: String,
  sprint_time: String
}

### Ejemplo de Documento

```js
{
  "_id": "69eb4287b9943090fbab6618",
  "raceId": 3,
  "year": 2009,
  "round": 3,
  "circuitId": 17,
  "name": "Chinese Grand Prix",
  "date": "2009-04-19T00:00:00.000Z",
  "time": "07:00:00",
  "url": "http://en.wikipedia.org/wiki/2009_Chinese_Grand_Prix",
  "fp1_date": "\\N",
  "fp1_time": "\\N",
  "fp2_date": "\\N",
  "fp2_time": "\\N",
  "fp3_date": "\\N",
  "fp3_time": "\\N",
  "quali_date": "\\N",
  "quali_time": "\\N",
  "sprint_date": "\\N",
  "sprint_time": "\\N"
}
```

### Relaciones

```text
races.circuitId → circuits.circuitId
```

---
## Colección circuits

La colección `circuits` almacena información sobre los circuitos utilizados en las carreras de Fórmula 1.

### Campos

```js
{
  circuitId: Number,
  circuitRef: String,
  name: String,
  location: String,
  country: String,
  lat: Number,
  lng: Number,
  alt: Number,
  url: String
}
```

### Ejemplo de Documento

```js
{
  "_id": "69eb411bb9943090fba1212f",
  "circuitId": 3,
  "circuitRef": "bahrain",
  "name": "Bahrain International Circuit",
  "location": "Sakhir",
  "country": "Bahrain",
  "lat": 26.0325,
  "lng": 50.5106,
  "alt": 7,
  "url": "http://en.wikipedia.org/wiki/Bahrain_International_Circuit"
}
```

### Relaciones

```text
circuits.circuitId → races.circuitId
```
---
## Colección results

La colección `results` almacena los resultados de las carreras de Fórmula 1.

Cada documento representa el resultado de un piloto en una carrera concreta.

### Campos

```js
{
  resultId: Number,
  raceId: Number,
  driverId: Number,
  constructorId: Number,
  number: Number,
  grid: Number,
  position: Number,
  positionText: Number,
  positionOrder: Number,
  points: Number,
  laps: Number,
  time: String,
  milliseconds: Number,
  fastestLap: Number,
  rank: Number,
  fastestLapTime: String,
  fastestLapSpeed: Number,
  statusId: Number
}
```

### Ejemplo de Documento

```js
{
  "_id": "69eb429ab9943090fbab6a7e",
  "resultId": 3,
  "raceId": 18,
  "driverId": 3,
  "constructorId": 3,
  "number": 7,
  "grid": 7,
  "position": 3,
  "positionText": 3,
  "positionOrder": 3,
  "points": 6,
  "laps": 58,
  "time": "+8.163",
  "milliseconds": 5698779,
  "fastestLap": 41,
  "rank": 5,
  "fastestLapTime": "1:28.090",
  "fastestLapSpeed": 216.719,
  "statusId": 1
}
```

### Relaciones

```text
results.raceId → races.raceId
results.driverId → drivers.driverId
results.constructorId → constructors.constructorId
```
---
## Colección lap_times

La colección `lap_times` almacena los tiempos por vuelta de los pilotos durante cada carrera.

Cada documento representa el tiempo realizado por un piloto en una vuelta concreta.

### Campos

```js
{
  raceId: Number,
  driverId: Number,
  lap: Number,
  position: Number,
  time: String,
  milliseconds: Number
}
```

### Ejemplo de Documento

```js
{
  "_id": "69eb4217b9943090fba74ef2",
  "raceId": 1,
  "driverId": 1,
  "lap": 1,
  "position": 13,
  "time": "1:49.088",
  "milliseconds": 109088
}
```

### Relaciones

```text
lap_times.raceId → races.raceId
lap_times.driverId → drivers.driverId
```
---
## Colección pit_stops

La colección `pit_stops` almacena información sobre las paradas en boxes realizadas por los pilotos durante las carreras.

Cada documento representa una parada concreta realizada por un piloto en una carrera determinada.

### Campos

```js
{
  raceId: Number,
  driverId: Number,
  stop: Number,
  lap: Number,
  time: String,
  duration: Number,
  milliseconds: Number
}
```

### Ejemplo de Documento

```js
{
  "_id": "69eb4255b9943090fbab10b5",
  "raceId": 841,
  "driverId": 1,
  "stop": 1,
  "lap": 16,
  "time": "17:28:24",
  "duration": 23.227,
  "milliseconds": 23227
}
```

### Relaciones

```text
pit_stops.raceId → races.raceId
pit_stops.driverId → drivers.driverId
```
---
## Colección qualifying

La colección `qualifying` almacena los resultados de las sesiones de clasificación de Fórmula 1.

Cada documento representa el resultado obtenido por un piloto durante la clasificación de una carrera concreta.

### Campos

```js
{
  qualifyId: Number,
  raceId: Number,
  driverId: Number,
  constructorId: Number,
  number: Number,
  position: Number,
  q1: String,
  q2: String,
  q3: String
}
```

### Ejemplo de Documento

```js
{
  "_id": "69eb4274b9943090fbab3d17",
  "qualifyId": 1,
  "raceId": 18,
  "driverId": 1,
  "constructorId": 1,
  "number": 22,
  "position": 1,
  "q1": "1:26.572",
  "q2": "1:25.187",
  "q3": "1:26.714"
}
```

### Relaciones

```text
qualifying.raceId → races.raceId
qualifying.driverId → drivers.driverId
qualifying.constructorId → constructors.constructorId
```
---
## Colección constructors

La colección `constructors` almacena información sobre los constructores o equipos de Fórmula 1.

Cada documento representa un equipo participante en el campeonato.

### Campos

```js
{
  constructorId: Number,
  constructorRef: String,
  name: String,
  nationality: String,
  url: String
}
```

### Ejemplo de Documento

```js
{
  "_id": "69eb41c1b9943090fba18a88",
  "constructorId": 1,
  "constructorRef": "mclaren",
  "name": "McLaren",
  "nationality": "British",
  "url": "http://en.wikipedia.org/wiki/McLaren"
}
```

### Relaciones

```text
constructors.constructorId → results.constructorId
constructors.constructorId → qualifying.constructorId
```
---
## Colección constructor_standings

La colección `constructor_standings` almacena la clasificación del campeonato de constructores de Fórmula 1.

Cada documento representa la posición de un constructor en la clasificación tras una carrera determinada.

### Campos

```js
{
  constructorStandingsId: Number,
  raceId: Number,
  constructorId: Number,
  points: Number,
  position: Number,
  positionText: Number,
  wins: Number
}
```

### Ejemplo de Documento

```js
{
  "_id": "69eb41abb9943090fba18a7f",
  "constructorStandingsId": 28976,
  "raceId": 1144,
  "constructorId": 1,
  "points": 666,
  "position": 1,
  "positionText": 1,
  "wins": 6
}
```

### Relaciones

```text
constructor_standings.raceId → races.raceId
constructor_standings.constructorId → constructors.constructorId
```
---
## Colección results

La colección `results` almacena los resultados finales de las carreras de Fórmula 1.

Cada documento representa el resultado obtenido por un piloto en una carrera concreta.

### Campos

```js
{
  resultId: Number,
  raceId: Number,
  driverId: Number,
  constructorId: Number,
  number: Number,
  grid: Number,
  position: Number,
  positionText: Number,
  positionOrder: Number,
  points: Number,
  laps: Number,
  time: String,
  milliseconds: Number,
  fastestLap: Number,
  rank: Number,
  fastestLapTime: String,
  fastestLapSpeed: Number,
  statusId: Number
}
```

### Ejemplo de Documento

```js
{
  "_id": "69eb42a3b9943090fbabd2ef",
  "resultId": 26745,
  "raceId": 1144,
  "driverId": 846,
  "constructorId": 1,
  "number": 4,
  "grid": 1,
  "position": 1,
  "positionText": 1,
  "positionOrder": 1,
  "points": 25,
  "laps": 58,
  "time": "1:26:33.291",
  "milliseconds": 5193291,
  "fastestLap": 52,
  "rank": 3,
  "fastestLapTime": "1:27.438",
  "fastestLapSpeed": 217.429,
  "statusId": 1
}
```

### Relaciones

```text
results.raceId → races.raceId
results.driverId → drivers.driverId
results.constructorId → constructors.constructorId
```