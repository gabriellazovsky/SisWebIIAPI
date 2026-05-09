# REST Interface Design

## Base URL
`http://localhost:3000/api`

## Resources & endpoints
| Method | Path | Description |
|--------|------|-------------|
| GET | /drivers | List drivers (filterable, paginated) |
| GET | /drivers/:id | Get driver by ID |
...

## Example: GET /circuits (JSON)
Request: GET /circuits?country=Italy&page=1&limit=5
Response 200:
[{ "circuitId": 14, "name": "Autodromo Nazionale di Monza", ... }]

## Example: GET /circuits (XML)
Request: GET /circuits Accept: application/xml
Response 200:
<?xml version="1.0"?><circuits><circuit>...