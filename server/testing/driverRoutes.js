const request = require("supertest");
const app = require("../app");
const Driver = require("../../models/Driver");

jest.mock("../models/Driver");

describe("GET /drivers", () => {
  it("should return all drivers", async () => {
    Driver.find.mockResolvedValue([{ name: "Lewis Hamilton" }]);

    const res = await request(app).get("/drivers");
    
    expect(res.statusCode).toBe(200);
    expect(res.body[0].name).toBe("Lewis Hamilton");
  });
});