import request from "supertest";
import app from "../../index.js";
import { describe, it, expect } from "vitest";

describe("GET /seasons", () => {
  it("returns 200 with seasons", async () => {
    const res = await request(app).get("/seasons");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("returns 404 when no seasons exist", async () => {
    const res = await request(app).get("/seasons?year=9999");

    expect(res.status).toBe(404);
  });
});

describe("GET /seasons/:year", () => {
  it("returns 200 with season data for a valid year", async () => {
    const res = await request(app).get("/seasons/2008");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("year");
    expect(res.body).toHaveProperty("url");
  });

  it("returns 404 for a non-existent season", async () => {
    const res = await request(app).get("/seasons/9999");

    expect(res.status).toBe(404);
  });
});