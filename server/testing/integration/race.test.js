import request from "supertest";
import app from "../../index.js";
import { describe, it, expect } from "vitest";

describe("GET /races", () => {
  it("returns 200 with races", async () => {
    const res = await request(app).get("/races");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe("GET /races/:id", () => {
  it("returns 200", async () => {
    const res = await request(app).get("/races/1");

    expect(res.status).toBe(200);
  });

  it("returns 404", async () => {
    const res = await request(app).get("/races/999999");

    expect(res.status).toBe(404);
  });
});

describe("GET /races/:id/results", () => {
  it("returns 200", async () => {
    const res = await request(app).get("/races/1/results");

    expect(res.status).toBe(200);
  });
});

describe("GET /races/:raceId/qualifying", () => {
  it("returns 200 with qualifying results for a race", async () => {
    const res = await request(app).get("/races/18/qualifying");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("returns 404 when no qualifying results exist", async () => {
    const res = await request(app).get("/races/999999/qualifying");

    expect(res.status).toBe(404);
  });
});