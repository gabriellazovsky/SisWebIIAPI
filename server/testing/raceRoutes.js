const request = require("supertest");
const app = require("../app");

const Race = require("../../models/Race");
const Result = require("../../models/Result");

jest.mock("../../models/Race");
jest.mock("../../models/Result");

describe("GET /races", () => {
    it("should return all races", async () => {
    Race.find.mockResolvedValue([
        { raceId: 1, name: "Monaco GP", year: 2020 }
    ]);

    const res = await request(app).get("/races");

    expect(res.statusCode).toBe(200);
    expect(res.body[0].name).toBe("Monaco GP");
    });
});

describe("GET /races/:id", () => {
    it("should return race by id", async () => {
    Race.findById.mockResolvedValue({
        raceId: 1,
        name: "Monaco GP",
        year: 2020
    });

    const res = await request(app).get("/races/1");

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("Monaco GP");
    });
});

describe("GET /races/:id/results", () => {
    it("should return race results", async () => {
    Result.find.mockResolvedValue([
        { raceId: 1, driverId: 44, position: 1, points: 25 }
    ]);

    const res = await request(app).get("/races/1/results");

    expect(res.statusCode).toBe(200);
    expect(res.body[0].position).toBe(1);
    });
});