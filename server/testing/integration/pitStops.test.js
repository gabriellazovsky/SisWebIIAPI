import request from "supertest";
import app from "../../index.mjs";
import { describe, it, expect } from "vitest";

describe("GET /pit-stops", () => {
  it("returns 200 with paginated pit stops", async () => {
    const res = await request(app).get("/pit-stops");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body).toHaveProperty("pagination");
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it("filters by driverId", async () => {
    const res = await request(app).get("/pit-stops?driverId=1");

    expect(res.status).toBe(200);
    res.body.data.forEach((pitStop) => {
      expect(pitStop.driverId).toBe(1);
    });
  });

  it("filters by raceId", async () => {
    const res = await request(app).get("/pit-stops?raceId=841");

    expect(res.status).toBe(200);
    res.body.data.forEach((pitStop) => {
      expect(pitStop.raceId).toBe(841);
    });
  });

  it("returns 404 when no pit stops are found", async () => {
    const res = await request(app).get("/pit-stops?driverId=999999");

    expect(res.status).toBe(404);
  });
});