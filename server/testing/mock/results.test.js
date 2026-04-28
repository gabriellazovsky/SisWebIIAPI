import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../db/conn.js", () => ({
  default: { collection: vi.fn() },
}));

import db from "../../db/conn.js";
import {
  getAllResults,
  getResultById,
} from "../../controllers/resultsController.js";

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

const result = {
  resultId: 1,
  raceId: 18,
  driverId: 1,
  constructorId: 1,
  number: 22,
  grid: 1,
  position: 1,
  positionOrder: 1,
  points: 10,
};

describe("getAllResults", () => {
  it("returns 200 with paginated results", async () => {
    db.collection.mockReturnValue({
      find: vi.fn().mockReturnValue(mockFindChain([result])),
      countDocuments: vi.fn().mockResolvedValue(1),
    });

    const res = mockRes();
    await getAllResults(mockReq(), res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      data: [result],
      pagination: {
        page: 1,
        limit: 20,
        total: 1,
        totalPages: 1,
      },
    });
  });

  it("filters by raceId, driverId, constructorId and position", async () => {
    const find = vi.fn().mockReturnValue(mockFindChain([result]));

    db.collection.mockReturnValue({
      find,
      countDocuments: vi.fn().mockResolvedValue(1),
    });

    const res = mockRes();

    await getAllResults(
      mockReq({
        query: {
          raceId: "18",
          driverId: "1",
          constructorId: "1",
          position: "1",
        },
      }),
      res
    );

    expect(find).toHaveBeenCalledWith({
      raceId: 18,
      driverId: 1,
      constructorId: 1,
      position: 1,
    });
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("returns 404 when no results found", async () => {
    db.collection.mockReturnValue({
      find: vi.fn().mockReturnValue(mockFindChain([])),
      countDocuments: vi.fn().mockResolvedValue(0),
    });

    const res = mockRes();
    await getAllResults(mockReq(), res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("returns 500 on database error", async () => {
    db.collection.mockReturnValue({
      find: vi.fn().mockImplementation(() => {
        throw new Error("DB error");
      }),
      countDocuments: vi.fn(),
    });

    const res = mockRes();
    await getAllResults(mockReq(), res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe("getResultById", () => {
  it("returns 200 when result exists", async () => {
    db.collection.mockReturnValue({
      findOne: vi.fn().mockResolvedValue(result),
    });

    const res = mockRes();
    await getResultById(mockReq({ params: { resultId: "1" } }), res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(result);
  });

  it("returns 404 when result does not exist", async () => {
    db.collection.mockReturnValue({
      findOne: vi.fn().mockResolvedValue(null),
    });

    const res = mockRes();
    await getResultById(mockReq({ params: { resultId: "999" } }), res);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});