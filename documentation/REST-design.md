# REST Interface Design — Formula 1 API

## Base URL

```
http://localhost:5050
```

---

## Content Negotiation

The `/circuits` and `/drivers` endpoints support both JSON and XML via the `Accept` header.
All other endpoints respond in JSON.

| Accept Header | Response Format |
|---|---|
| `application/json` (default) | JSON |
| `application/xml` | XML (circuits and drivers only) |

XML schema: `documentation/schemas/circuit.xsd`

**Examples:**
```
GET /circuits
Accept: application/xml

GET /drivers
Accept: application/xml

GET /drivers/1
Accept: application/xml
```

---

## Pagination

Endpoints that return large collections include a `pagination` object:

```json
{
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 25840,
    "totalPages": 1292
  }
}
```

---

## Error Responses

```json
{ "status": 404, "message": "Resource not found" }
```

| Code | Meaning |
|---|---|
| 400 | Bad request / invalid parameters |
| 404 | Resource not found |
| 500 | Internal server error |

---

## Resources

---

### Drivers

| Method | Path | Description |
|---|---|---|
| GET | `/drivers` | List all drivers |
| POST | `/drivers` | Create a new driver |
| GET | `/drivers/:driverId` | Get a driver by ID (accepts numeric or string) |
| PUT | `/drivers/:driverId` | Update a driver |
| DELETE | `/drivers/:driverId` | Delete a driver |
| GET | `/drivers/:driverId/results` | Race results for a driver (paginated) |
| GET | `/drivers/:driverId/standings` | Championship standings for a driver |
| GET | `/drivers/:driverId/qualifying` | Qualifying results for a driver |
| GET | `/drivers/:driverId/lap-times` | Lap times for a driver (paginated, filterable by raceId) |
| GET | `/drivers/:driverId/pit-stops` | Pit stops for a driver (paginated, filterable by raceId) |

**Filter parameters for GET /drivers:**
- `nationality` — exact match (e.g. `?nationality=British`)

**Filter parameters for GET /drivers/:id/results:**
- `page` (default: 1), `limit` (default: 20)

**Filter parameters for GET /drivers/:id/lap-times:**
- `raceId`, `page` (default: 1), `limit` (default: 50, max: 200)

**Filter parameters for GET /drivers/:id/pit-stops:**
- `raceId`, `page` (default: 1), `limit` (default: 20)

**Required fields for POST:**
`driverRef`, `forename`, `surname`, `nationality`

**Example request body (POST /drivers):**
```json
{
  "driverRef": "hamilton",
  "number": 44,
  "code": "HAM",
  "forename": "Lewis",
  "surname": "Hamilton",
  "dob": "1985-01-07",
  "nationality": "British",
  "url": "https://en.wikipedia.org/wiki/Lewis_Hamilton"
}
```

---

### Constructors

| Method | Path | Description |
|---|---|---|
| GET | `/constructors` | List all constructors |
| POST | `/constructors` | Create a new constructor |
| GET | `/constructors/:constructorId` | Get a constructor by ID |
| PUT | `/constructors/:constructorId` | Update a constructor |
| DELETE | `/constructors/:constructorId` | Delete a constructor |
| GET | `/constructors/:constructorId/results` | Race results for a constructor |
| GET | `/constructors/:constructorId/standings` | Championship standings for a constructor |

**Filter parameters for GET /constructors:**
- `nationality` — exact match
- `constructorRef` — exact match
- `name` — partial match (case-insensitive)

**Required fields for POST:**
`constructorRef`, `name`, `nationality`

**Example request body (POST /constructors):**
```json
{
  "constructorRef": "mclaren",
  "name": "McLaren",
  "nationality": "British",
  "url": "https://en.wikipedia.org/wiki/McLaren"
}
```

---

### Circuits *(XML supported)*

| Method | Path | Description |
|---|---|---|
| GET | `/circuits` | List all circuits |
| POST | `/circuits` | Create a new circuit |
| GET | `/circuits/:circuitId` | Get a circuit by ID |
| PUT | `/circuits/:circuitId` | Update a circuit |
| DELETE | `/circuits/:circuitId` | Delete a circuit |
| GET | `/circuits/:circuitId/races` | All races held at this circuit |

**Filter parameters for GET /circuits:**
- `country` — exact match (e.g. `?country=Italy`)
- `location` — exact match
- `circuitRef` — exact match
- `name` — partial match (case-insensitive)

**Required fields for POST:**
`circuitRef`, `name`, `location`, `country`, `lat`, `lng`

**Example JSON response (GET /circuits/3):**
```json
{
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

**Example XML response (GET /circuits/3 with Accept: application/xml):**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<circuit>
  <id>69eb411bb9943090fba1212f</id>
  <circuitId>3</circuitId>
  <circuitRef>bahrain</circuitRef>
  <name>Bahrain International Circuit</name>
  <location>Sakhir</location>
  <country>Bahrain</country>
  <lat>26.0325</lat>
  <lng>50.5106</lng>
  <alt>7</alt>
  <url>http://en.wikipedia.org/wiki/Bahrain_International_Circuit</url>
</circuit>
```

---

### Races

| Method | Path | Description |
|---|---|---|
| GET | `/races` | List all races |
| POST | `/races` | Create a new race |
| GET | `/races/:raceId` | Get a race by ID |
| PUT | `/races/:raceId` | Update a race |
| DELETE | `/races/:raceId` | Delete a race |
| GET | `/races/:raceId/results` | All results for a race |
| GET | `/races/:raceId/qualifying` | Qualifying results for a race |

**Filter parameters for GET /races:**
- `season` — year (e.g. `?season=2020`)
- `round` — round number
- `circuitId` — circuit ID

**Required fields for POST:**
`year`, `round`, `circuitId`, `name`, `date`

---

### Seasons

| Method | Path | Description |
|---|---|---|
| GET | `/seasons` | List all seasons |
| POST | `/seasons` | Create a new season |
| GET | `/seasons/:year` | Get a season by year |
| PUT | `/seasons/:year` | Update a season |
| DELETE | `/seasons/:year` | Delete a season |
| GET | `/seasons/:year/races` | All races in a season (sorted by round) |

**Filter parameters for GET /seasons:**
- `year` — exact match

**Required fields for POST:**
`year`, `url`

---

### Results *(paginated)*

| Method | Path | Description |
|---|---|---|
| GET | `/results` | List results (filterable, paginated) |
| GET | `/results/:resultId` | Get a result by ID |

**Filter parameters:**
- `season` — resolves to raceIds for that year
- `raceId`, `driverId`, `constructorId`, `position`
- `page` (default: 1), `limit` (default: 20, max: 100)

> `season` and `raceId` cannot be combined — `raceId` takes precedence.

---

### Standings *(paginated)*

| Method | Path | Description |
|---|---|---|
| GET | `/standings/drivers` | Driver championship standings |
| GET | `/standings/constructors` | Constructor championship standings |

**Filter parameters (both endpoints):**
- `season` — resolves to raceIds for that year
- `driverId` / `constructorId`
- `position`
- `page` (default: 1), `limit` (default: 20, max: 100)

---

### Qualifying *(paginated)*

| Method | Path | Description |
|---|---|---|
| GET | `/qualifying` | List qualifying results (filterable, paginated) |
| GET | `/qualifying/:qualifyId` | Get a qualifying result by ID |

**Filter parameters:**
- `raceId`, `driverId`, `constructorId`, `position`, `season`
- `page` (default: 1), `limit` (default: 20)

> Qualifying pagination response does not include `total` / `totalPages`.

---

### Lap Times *(large collection — always paginate)*

| Method | Path | Description |
|---|---|---|
| GET | `/lap-times` | List lap times (filterable, paginated) |

**Filter parameters:**
- `raceId`, `driverId`, `lap`
- `page` (default: 1), `limit` (default: 50, max: 200)

> This collection contains ~538,000 documents. Always filter by `raceId` and/or `driverId`.

---

### Pit Stops *(paginated)*

| Method | Path | Description |
|---|---|---|
| GET | `/pit-stops` | List pit stops (filterable, paginated) |

**Filter parameters:**
- `raceId`, `driverId`
- `page` (default: 1), `limit` (default: 20, max: 100)

---

### External API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/external/current-season` | Current season schedule from Ergast API (JSON, cached fallback) |
| GET | `/external/driver/:driverRef` | Driver info from Ergast API (JSON, cached fallback) |
| GET | `/f1-news-xml` | Latest F1 news from Formula 1 RSS feed (XML consumed, stored in DB, cached fallback) |

**Example response for GET /f1-news-xml:**
```json
{
  "source": "external_xml_api",
  "format": "xml",
  "savedToDatabase": true,
  "data": {
    "importedAt": "2026-05-09T17:00:00.000Z",
    "source": "Formula1 XML Feed",
    "data": { "..." : "..." }
  }
}
```

If the external XML feed is unavailable:
```json
{
  "source": "database_fallback",
  "format": "xml",
  "message": "External XML API unavailable. Returning cached data.",
  "data": { "..." : "..." }
}
```

---

### OpenF1 Live Data Endpoints

Real-time data from the OpenF1 API, cached in MongoDB as fallback.

| Method | Path | Description |
|---|---|---|
| GET | `/openf1/weather` | Weather data for a session |
| GET | `/openf1/race-control` | Race control messages for a session |
| GET | `/openf1/team-radio` | Team radio communications for a session |
| GET | `/openf1/sessions` | All available sessions from OpenF1 |

**Required query parameters for `/openf1/weather`, `/openf1/race-control`, `/openf1/team-radio`:**
- `session_key` — OpenF1 session identifier (e.g. `?session_key=9158`)

**Optional query parameters:**
- `driver_number` — filter by driver number (e.g. `?driver_number=44`)

**Example:**
```
GET /openf1/weather?session_key=9158
GET /openf1/team-radio?session_key=9158&driver_number=44
```

> If the OpenF1 API is unavailable, the response is served from the MongoDB cache.

---

### Webhooks

| Method | Path | Description |
|---|---|---|
| POST | `/webhooks/openf1` | Receive and store OpenF1 event notifications |

**Example request body (POST /webhooks/openf1):**
```json
{
  "event": "race-control",
  "session_key": 9158,
  "data": { "..." : "..." }
}
```

> Received events are stored in MongoDB for later retrieval via the `/openf1/*` endpoints.