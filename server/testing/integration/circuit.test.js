import request from "supertest";
import app from "../../index.mjs";
import { describe, it, expect } from "vitest";

describe("GET /circuits", () => {
  it("returns 200 with circuits list", async () => {
    const res = await request(app).get("/circuits");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe("GET /circuits/:circuitId", () => {
  it("returns 200 with circuit data", async () => {
    const res = await request(app).get("/circuits/1");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("circuitId");
    expect(res.body).toHaveProperty("name");
  });

  it("returns 404 if not found", async () => {
    const res = await request(app).get("/circuits/999999");

    expect(res.status).toBe(404);
  });
});