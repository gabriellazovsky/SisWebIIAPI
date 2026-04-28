import request from "supertest";
import app from "../../index.js";
import { describe, it, expect } from "vitest";

describe("GET /standings/drivers", () => {
  it("returns 200 with driver standings", async () => {
    const res = await request(app).get("/standings/drivers");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body).toHaveProperty("pagination");
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it("filters driver standings by driverId", async () => {
    const res = await request(app).get("/standings/drivers?driverId=1");

    expect(res.status).toBe(200);
    res.body.data.forEach((standing) => {
      expect(standing.driverId).toBe(1);
    });
  });

  it("filters driver standings by position", async () => {
    const res = await request(app).get("/standings/drivers?position=1");

    expect(res.status).toBe(200);
    res.body.data.forEach((standing) => {
      expect(standing.position).toBe(1);
    });
  });

  it("returns 404 when no driver standings are found", async () => {
    const res = await request(app).get("/standings/drivers?driverId=999999");

    expect(res.status).toBe(404);
  });
});

describe("GET /standings/constructors", () => {
  it("returns 200 with constructor standings", async () => {
    const res = await request(app).get("/standings/constructors");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body).toHaveProperty("pagination");
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it("filters constructor standings by constructorId", async () => {
    const res = await request(app).get("/standings/constructors?constructorId=1");

    expect(res.status).toBe(200);
    res.body.data.forEach((standing) => {
      expect(standing.constructorId).toBe(1);
    });
  });

  it("filters constructor standings by position", async () => {
    const res = await request(app).get("/standings/constructors?position=1");

    expect(res.status).toBe(200);
    res.body.data.forEach((standing) => {
      expect(standing.position).toBe(1);
    });
  });

  it("returns 404 when no constructor standings are found", async () => {
    const res = await request(app).get(
      "/standings/constructors?constructorId=999999"
    );

    expect(res.status).toBe(404);
  });
});