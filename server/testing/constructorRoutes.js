const request = require("supertest");
const app = require("../app");

const Constructor = require("../../models/Constructor");
const ConstructorResult = require("../../models/ConstructorResult");
const ConstructorStanding = require("../../models/ConstructorStanding");

jest.mock("../../models/Constructor");
jest.mock("../../models/ConstructorResult");
jest.mock("../../models/ConstructorStanding");

describe("GET /constructors", () => {
    it("should return all constructors", async () => {
      Constructor.find.mockResolvedValue([
        { constructorId: 1, name: "Mercedes", nationality: "German" }
      ]);

      const res = await request(app).get("/constructors");

      expect(res.statusCode).toBe(200);
      expect(res.body[0].name).toBe("Mercedes");
    });
});

describe("GET /constructors/:id", () => {
    it("should return constructor by id", async () => {
      Constructor.findById.mockResolvedValue({
        constructorId: 1,
        name: "Ferrari"
      });

      const res = await request(app).get("/constructors/1");

      expect(res.statusCode).toBe(200);
      expect(res.body.name).toBe("Ferrari");
    });
});

describe("GET /constructors/:id/results", () => {
    it("should return constructor results", async () => {
      ConstructorResult.find.mockResolvedValue([
        { constructorId: 1, raceId: 10, points: 25 }
      ]);

      const res = await request(app).get("/constructors/1/results");

      expect(res.statusCode).toBe(200);
      expect(res.body[0].points).toBe(25);
    });
});

describe("GET /constructors/:id/standings", () => {
    it("should return constructor standings", async () => {
      ConstructorStanding.find.mockResolvedValue([
        { constructorId: 1, raceId: 10, position: 1, points: 25 }
      ]);

      const res = await request(app).get("/constructors/1/standings");

      expect(res.statusCode).toBe(200);
      expect(res.body[0].position).toBe(1);
    });
});