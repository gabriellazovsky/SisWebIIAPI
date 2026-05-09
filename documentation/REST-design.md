# REST Interface Design — Formula 1 API

## Base URL

```
http://localhost:5050
```

---

## Content Negotiation

All endpoints support both JSON (default) and XML responses via the `Accept` header.

| Accept Header | Response Format |
|---|---|
| `application/json` (default) | JSON |
| `application/xml` | XML |

**Example:**
```bash
# JSON (default)
GET /circuits

# XML
GET /circuits
Accept: application/xml
```

The XML schema for circuits is defined in `documentation/schemas/circuit.xsd`.

---

## Resources

The API manages the following resources, all interrelated:

- **Drivers** — F1 drivers from 1950 to 2020
- **Constructors** — F1 teams/constructors
- **Circuits** — Race circuits around the world
- **Races** — Individual race events per season
- **Seasons** — Championship seasons
- **Results** — Race results per driver per race
- **Standings** — Driver and constructor championship standings
- **Qualifying** — Qualifying session results
- **Lap Times** — Individual lap time records (~538k documents)
- **Pit Stops** — Pit stop records per race

---

## Endpoints

### Drivers

| Method | Path | Description |
|---|---|---|
| GET | `/drivers` | List all drivers (filterable, paginated) |
| POST | `/drivers` | Create a new driver |
| GET | `/drivers/:driverId` | Get a driver by ID |
| PUT | `/drivers/:driverId` | Update a driver |
| DELETE | `/drivers/:driverId` | Delete a driver |
| GET | `/drivers/:driverId/results` | Get race results for a driver |
| GET | `/drivers/:driverId/standings` | Get championship standings for a driver |
| GET | `/drivers/:driverId/qualifying` | Get qualifying results for a driver |
| GET | `/drivers/:driverId/lap-times` | Get lap times for a driver |
| GET | `/drivers/:driverId/pit-stops` | Get pit stops for a driver |

**Filter parameters for GET /drivers:**
- `driverRef`, `code`, `nationality`, `forename`, `surname`, `number`, `dob`
- `page` (default: 1), `limit` (default: 20)

---

### Constructors

| Method | Path | Description |
|---|---|---|
| GET | `/constructors` | List all constructors (filterable, paginated) |
| POST | `/constructors` | Create a new constructor |
| GET | `/constructors/:constructorId` | Get a constructor by ID |
| PUT | `/constructors/:constructorId` | Update a constructor |
| DELETE | `/constructors/:constructorId` | Delete a constructor |
| GET | `/constructors/:constructorId/results` | Get race results for a constructor |
| GET | `/constructors/:constructorId/standings` | Get standings for a constructor |

**Filter parameters for GET /constructors:**
- `name`, `nationality`, `constructorRef`
- `page` (default: 1), `limit` (default: 20)

---

### Circuits *(supports XML)*

| Method | Path | Description |
|---|---|---|
| GET | `/circuits` | List all circuits (filterable) |
| POST | `/circuits` | Create a new circuit |
| GET | `/circuits/:circuitId` | Get a circuit by ID |
| PUT | `/circuits/:circuitId` | Update a circuit |
| DELETE | `/circuits/:circuitId` | Delete a circuit |
| GET | `/circuits/:circuitId/races` | Get all races held at a circuit |

**Filter parameters for GET /circuits:**
- `country`, `location`, `circuitRef`, `name`

**XML example response for GET /circuits/:circuitId:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<circuit>
  <id>5f8d...</id>
  <circuitId>1</circuitId>
  <circuitRef>albert_park</circuitRef>
  <name>Albert Park Grand Prix Circuit</name>
  <location>Melbourne</location>
  <country>Australia</country>
  <lat>-37.8497</lat>
  <lng>144.968</lng>
  <alt>10</alt>
  <url>https://en.wikipedia.org/wiki/Melbourne_Grand_Prix_Circuit</url>
</circuit>
```

---

### Races

| Method | Path | Description |
|---|---|---|
| GET | `/races` | List all races (filterable, paginated) |
| POST | `/races` | Create a new race |
| GET | `/races/:raceId` | Get a race by ID |
| PUT | `/races/:raceId` | Update a race |
| DELETE | `/races/:raceId` | Delete a race |
| GET | `/races/:raceId/results` | Get all results for a race |
| GET | `/races/:raceId/qualifying` | Get qualifying results for a race |

**Filter parameters for GET /races:**
- `season`, `round`, `circuitId`, `name`
- `page` (default: 1), `limit` (default: 20)

---

### Seasons

| Method | Path | Description |
|---|---|---|
| GET | `/seasons` | List all seasons |
| GET | `/seasons/:year` | Get a specific season |
| GET | `/seasons/:year/races` | Get all races in a season |

---

### Results *(large collection — paginated)*

| Method | Path | Description |
|---|---|---|
| GET | `/results` | List results (filterable, paginated) |
| GET | `/results/:resultId` | Get a result by ID |

**Filter parameters:**
- `season`, `raceId`, `driverId`, `constructorId`, `position`
- `page` (default: 1), `limit` (default: 20)

---

### Standings

| Method | Path | Description |
|---|---|---|
| GET | `/standings/drivers` | Driver championship standings (filterable, paginated) |
| GET | `/standings/constructors` | Constructor championship standings (filterable, paginated) |

---

### Qualifying

| Method | Path | Description |
|---|---|---|
| GET | `/qualifying` | List qualifying results (filterable, paginated) |
| GET | `/qualifying/:qualifyId` | Get a qualifying result by ID |

---

### Lap Times *(largest collection — paginated)*

| Method | Path | Description |
|---|---|---|
| GET | `/lap-times` | List lap times (filterable, paginated) |

**Filter parameters:**
- `raceId`, `driverId`, `lap`
- `page` (default: 1), `limit` (default: 50, max: 200)

> This collection contains ~538,000 documents. Always use filters and pagination.

---

### Pit Stops

| Method | Path | Description |
|---|---|---|
| GET | `/pit-stops` | List pit stops (filterable, paginated) |

---

### External API

| Method | Path | Description |
|---|---|---|
| GET | `/external/current-season` | Fetch current season schedule from Ergast API (JSON) |
| GET | `/external/driver/:driverRef` | Fetch driver info from Ergast API (JSON) |
| GET | `/f1xml` | Fetch latest F1 news from Formula1.com RSS feed (XML consumed, stored in DB) |

The external endpoints fall back to cached database data if the external API is unavailable.

---

## Pagination

Paginated responses follow this format:

```json
{
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 538121,
    "totalPages": 26907
  }
}
```

---

## Error Responses

All errors follow a consistent format:

```json
{
  "status": 404,
  "message": "Circuit not found"
}
```

| Status | Meaning |
|---|---|
| 400 | Bad request / invalid parameters |
| 404 | Resource not found |
| 500 | Internal server error |