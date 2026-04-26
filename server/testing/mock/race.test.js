import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../db/conn.js", () => ({
  default: { collection: vi.fn() },
}));

import db from "../../db/conn.js";
import {
  getAllRaces,
  createRace,
  getRaceById,
  updateRace,
  deleteRace,
  getRaceResults,
} from "../../controllers/raceController.js";

import { 
    getQualifyingByRace 
} from "../../controllers/qualifyingController.js";

function mockReq(overrides = {}) {
  return { query: {}, params: {}, body: {}, ...overrides };
}

function mockRes() {
  const res = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  res.send = vi.fn().mockReturnValue(res);
  return res;
}

beforeEach(() => vi.clearAllMocks());

const race = {
  raceId: 1,
  year: 2023,
  round: 1,
  circuitId: 1,
  name: "Bahrain GP",
};

describe("getAllRaces", () => {
  it("returns 200 with races", async () => {
    db.collection.mockReturnValue({
      find: vi.fn().mockReturnValue({
        toArray: vi.fn().mockResolvedValue([race]),
      }),
    });

    const res = mockRes();
    await getAllRaces(mockReq(), res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("returns 404 when empty", async () => {
    db.collection.mockReturnValue({
      find: vi.fn().mockReturnValue({
        toArray: vi.fn().mockResolvedValue([]),
      }),
    });

    const res = mockRes();
    await getAllRaces(mockReq(), res);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe("createRace", () => {
  it("returns 201", async () => {
    db.collection.mockReturnValue({
      insertOne: vi.fn().mockResolvedValue({ insertedId: "abc" }),
    });

    const res = mockRes();
    await createRace(mockReq({ body: race }), res);

    expect(res.status).toHaveBeenCalledWith(201);
  });
});

describe("getRaceById", () => {
  it("returns 200 when found", async () => {
    db.collection.mockReturnValue({
      findOne: vi.fn().mockResolvedValue(race),
    });

    const res = mockRes();
    await getRaceById(mockReq({ params: { raceId: "1" } }), res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("returns 404 when not found", async () => {
    db.collection.mockReturnValue({
      findOne: vi.fn().mockResolvedValue(null),
    });

    const res = mockRes();
    await getRaceById(mockReq({ params: { raceId: "999" } }), res);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe("getQualifyingByRace", () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { raceId: "18" }
    };

    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };
  });

  it("returns 200 with qualifying results", async () => {
    const mockData = [
      { qualifyId: 1, raceId: 18, driverId: 1 },
      { qualifyId: 2, raceId: 18, driverId: 2 }
    ];

    db.collection.mockReturnValue({
      find: () => ({
        toArray: async () => mockData
      })
    });

    await getQualifyingByRace(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockData);
  });

  it("returns 404 when no results found", async () => {
    db.collection.mockReturnValue({
      find: () => ({
        toArray: async () => []
      })
    });

    await getQualifyingByRace(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("returns 500 on error", async () => {
    db.collection.mockImplementation(() => {
      throw new Error("DB error");
    });

    await getQualifyingByRace(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});