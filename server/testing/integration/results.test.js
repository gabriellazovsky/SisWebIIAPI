import request from "supertest";
import app from "../../index.mjs";
import { describe, it, expect } from "vitest";

describe("GET /results", () => {
  it("returns 200 with paginated results", async () => {
    const res = await request(app).get("/results");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body).toHaveProperty("pagination");
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it("filters by driverId", async () => {
    const res = await request(app).get("/results?driverId=1");

    expect(res.status).toBe(200);
    res.body.data.forEach((result) => {
      expect(result.driverId).toBe(1);
    });
  });

  it("filters by constructorId", async () => {
    const res = await request(app).get("/results?constructorId=1");

    expect(res.status).toBe(200);
    res.body.data.forEach((result) => {
      expect(result.constructorId).toBe(1);
    });
  });

  it("filters by raceId", async () => {
    const res = await request(app).get("/results?raceId=18");

    expect(res.status).toBe(200);
    res.body.data.forEach((result) => {
      expect(result.raceId).toBe(18);
    });
  });

  it("returns 404 when no results are found", async () => {
    const res = await request(app).get("/results?driverId=999999");

    expect(res.status).toBe(404);
  });
});

describe("GET /results/:resultId", () => {
  it("returns 200 with result data", async () => {
    const res = await request(app).get("/results/1");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("resultId");
    expect(res.body).toHaveProperty("raceId");
    expect(res.body).toHaveProperty("driverId");
  });

  it("returns 404 for invalid resultId", async () => {
    const res = await request(app).get("/results/999999");

    expect(res.status).toBe(404);
  });
});