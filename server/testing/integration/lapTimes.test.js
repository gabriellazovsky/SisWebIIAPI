import request from "supertest";
import app from "../../index.js";
import { describe, it, expect } from "vitest";

describe("GET /lap-times", () => {
  it("returns 200 with paginated lap times", async () => {
    const res = await request(app).get("/lap-times");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body).toHaveProperty("pagination");
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it("filters by driverId", async () => {
    const res = await request(app).get("/lap-times?driverId=1");

    expect(res.status).toBe(200);
    res.body.data.forEach((lapTime) => {
      expect(lapTime.driverId).toBe(1);
    });
  });

  it("filters by raceId", async () => {
    const res = await request(app).get("/lap-times?raceId=841");

    expect(res.status).toBe(200);
    res.body.data.forEach((lapTime) => {
      expect(lapTime.raceId).toBe(841);
    });
  });

  it("filters by lap", async () => {
    const res = await request(app).get("/lap-times?lap=1");

    expect(res.status).toBe(200);
    res.body.data.forEach((lapTime) => {
      expect(lapTime.lap).toBe(1);
    });
  });

  it("returns 404 when no lap times are found", async () => {
    const res = await request(app).get("/lap-times?driverId=999999");

    expect(res.status).toBe(404);
  });
});