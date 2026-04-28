import request from "supertest";
import app from "../../index";
import { describe, it, expect } from "vitest";

describe("GET /drivers", () => {
  it("returns 200 with a list of drivers", async () => {
    const res = await request(app).get("/drivers");

    console.log(res.body[2]);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("filters by nationality", async () => {
    const res = await request(app).get("/drivers?nationality=British");

    expect(res.status).toBe(200);
    res.body.forEach((d) => expect(d.nationality).toBe("British"));
  });

  it("returns 404 for a nationality that doesn't exist", async () => {
    const res = await request(app).get("/drivers?nationality=Martian");

    expect(res.status).toBe(404);
  });
});

describe("GET /drivers/:driverId", () => {
  it("returns 200 with driver data for a valid ID", async () => {
    const res = await request(app).get("/drivers/1");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("driverId");
    expect(res.body).toHaveProperty("forename");
  });

  it("returns 404 for a non-existent driver", async () => {
    const res = await request(app).get("/drivers/999999");

    expect(res.status).toBe(404);
  });
});

describe("GET /drivers/:driverId/results", () => {
  it("returns 200 with paginated results", async () => {
    const res = await request(app).get("/drivers/1/results");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body).toHaveProperty("pagination");
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

describe("GET /drivers/:driverId/standings", () => {
  it("returns 200 with standings array", async () => {
    const res = await request(app).get("/drivers/1/standings");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe("GET /drivers/:driverId/qualifying", () => {
  it("returns 200 with qualifying array", async () => {
    const res = await request(app).get("/drivers/1/qualifying");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe("GET /drivers/:driverId/lap-times", () => {
  it("returns 200 with paginated lap times", async () => {
    const res = await request(app).get("/drivers/1/lap-times");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body).toHaveProperty("pagination");
  });
});

describe("GET /drivers/:driverId/pit-stops", () => {
  it("returns 200 with paginated pit stops", async () => {
    const res = await request(app).get("/drivers/1/pit-stops");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body).toHaveProperty("pagination");
  });
});
