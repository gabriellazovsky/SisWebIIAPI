import request from "supertest";
import app from "../../index.js";
import { describe, it, expect } from "vitest";

describe("GET /constructors", () => {
  it("returns 200 with constructors", async () => {
    const res = await request(app).get("/constructors");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe("GET /constructors/:id", () => {
  it("returns 200", async () => {
    const res = await request(app).get("/constructors/1");

    expect(res.status).toBe(200);
  });

  it("returns 404 for invalid id", async () => {
    const res = await request(app).get("/constructors/999999");

    expect(res.status).toBe(404);
  });
});

describe("GET /constructors/:id/results", () => {
  it("returns 200", async () => {
    const res = await request(app).get("/constructors/1/results");

    expect(res.status).toBe(200);
  });
});