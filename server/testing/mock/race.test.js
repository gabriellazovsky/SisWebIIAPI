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