const request = require("supertest");
const app = require("../app");

describe("Constructors API", () => {

  it("GET /constructors should return array", async () => {
    const res = await request(app).get("/constructors");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("GET /constructors/:id should respond", async () => {
    const res = await request(app).get("/constructors/1");

    expect([200, 404]).toContain(res.statusCode);
  });

  it("GET constructor standings", async () => {
    const res = await request(app).get("/constructors/1/standings");

    expect([200, 404]).toContain(res.statusCode);
  });

  it("GET standings with season filter", async () => {
    const res = await request(app)
      .get("/constructors/1/standings?season=2020");

    expect([200, 404]).toContain(res.statusCode);
  });

});