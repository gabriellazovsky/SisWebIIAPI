const request = require("supertest");
const app = require("../app");

describe("Constructors API", () => {
    it("should get all constructors", async () => {
    const res = await request(app).get("/constructors");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should get a constructor by ID", async () => {
    const res = await request(app).get("/constructors/1");

    expect([200, 404]).toContain(res.statusCode);
  });

  it("should get constructor standings", async () => {
    const res = await request(app)
      .get("/constructors/1/standings");

    expect([200, 404]).toContain(res.statusCode);
  });

  it("should filter standings by season", async () => {
    const res = await request(app)
      .get("/constructors/1/standings?season=2020");

    expect([200, 404]).toContain(res.statusCode);
  });

});