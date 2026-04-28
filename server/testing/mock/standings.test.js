import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../db/conn.js", () => ({
  default: { collection: vi.fn() },
}));

import db from "../../db/conn.js";
import {
  getDriverStandings,
  getConstructorStandings,
} from "../../controllers/standingsController.js";

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

function mockFindChain(data) {
  return {
    sort: vi.fn().mockReturnThis(),
    skip: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    toArray: vi.fn().mockResolvedValue(data),
  };
}

beforeEach(() => vi.clearAllMocks());

const driverStanding = {
  driverStandingsId: 1,
  raceId: 18,
  driverId: 1,
  points: 10,
  position: 1,
  wins: 1,
};

const constructorStanding = {
  constructorStandingsId: 1,
  raceId: 18,
  constructorId: 1,
  points: 10,
  position: 1,
  wins: 1,
};

describe("getDriverStandings", () => {
  it("returns 200 with driver standings", async () => {
    db.collection.mockReturnValue({
      find: vi.fn().mockReturnValue(mockFindChain([driverStanding])),
      countDocuments: vi.fn().mockResolvedValue(1),
    });

    const res = mockRes();
    await getDriverStandings(mockReq(), res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      data: [driverStanding],
      pagination: {
        page: 1,
        limit: 20,
        total: 1,
        totalPages: 1,
      },
    });
  });

  it("filters by driverId and position", async () => {
    const find = vi.fn().mockReturnValue(mockFindChain([driverStanding]));

    db.collection.mockReturnValue({
      find,
      countDocuments: vi.fn().mockResolvedValue(1),
    });

    const res = mockRes();

    await getDriverStandings(
      mockReq({
        query: {
          driverId: "1",
          position: "1",
        },
      }),
      res
    );

    expect(find).toHaveBeenCalledWith({
      driverId: 1,
      position: 1,
    });
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("returns 404 when no driver standings found", async () => {
    db.collection.mockReturnValue({
      find: vi.fn().mockReturnValue(mockFindChain([])),
      countDocuments: vi.fn().mockResolvedValue(0),
    });

    const res = mockRes();
    await getDriverStandings(mockReq(), res);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe("getConstructorStandings", () => {
  it("returns 200 with constructor standings", async () => {
    db.collection.mockReturnValue({
      find: vi.fn().mockReturnValue(mockFindChain([constructorStanding])),
      countDocuments: vi.fn().mockResolvedValue(1),
    });

    const res = mockRes();
    await getConstructorStandings(mockReq(), res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      data: [constructorStanding],
      pagination: {
        page: 1,
        limit: 20,
        total: 1,
        totalPages: 1,
      },
    });
  });

  it("filters by constructorId and position", async () => {
    const find = vi.fn().mockReturnValue(mockFindChain([constructorStanding]));

    db.collection.mockReturnValue({
      find,
      countDocuments: vi.fn().mockResolvedValue(1),
    });

    const res = mockRes();

    await getConstructorStandings(
      mockReq({
        query: {
          constructorId: "1",
          position: "1",
        },
      }),
      res
    );

    expect(find).toHaveBeenCalledWith({
      constructorId: 1,
      position: 1,
    });
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("returns 404 when no constructor standings found", async () => {
    db.collection.mockReturnValue({
      find: vi.fn().mockReturnValue(mockFindChain([])),
      countDocuments: vi.fn().mockResolvedValue(0),
    });

    const res = mockRes();
    await getConstructorStandings(mockReq(), res);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});