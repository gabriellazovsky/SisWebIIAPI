import request from "supertest";
import app from "../../index.js";
import { describe, it, expect } from "vitest";

describe("GET /qualifying", () => {
  it("returns 200 with qualifying results", async () => {
    const res = await request(app).get("/qualifying");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body).toHaveProperty("pagination");
  });

  it("filters by driverId", async () => {
    const res = await request(app).get("/qualifying?driverId=1");

    expect(res.status).toBe(200);
    res.body.data.forEach((q) => {
      expect(q.driverId).toBe(1);
    });
  });
});

describe("GET /qualifying/:qualifyId", () => {
  it("returns 200 for valid qualifyId", async () => {
    const res = await request(app).get("/qualifying/1");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("qualifyId");
  });

  it("returns 404 for invalid qualifyId", async () => {
    const res = await request(app).get("/qualifying/999999");

    expect(res.status).toBe(404);
  });
});