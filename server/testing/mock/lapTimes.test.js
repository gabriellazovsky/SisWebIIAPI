import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../db/conn.js", () => ({
  default: { collection: vi.fn() },
}));

import db from "../../db/conn.js";
import { getAllLapTimes } from "../../controllers/lapTimesController.js";

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

const lapTime = {
  raceId: 841,
  driverId: 1,
  lap: 1,
  position: 1,
  time: "1:38.109",
  milliseconds: 98109,
};

describe("getAllLapTimes", () => {
  it("returns 200 with paginated lap times", async () => {
    db.collection.mockReturnValue({
      find: vi.fn().mockReturnValue(mockFindChain([lapTime])),
      countDocuments: vi.fn().mockResolvedValue(1),
    });

    const res = mockRes();
    await getAllLapTimes(mockReq(), res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      data: [lapTime],
      pagination: {
        page: 1,
        limit: 50,
        total: 1,
        totalPages: 1,
      },
    });
  });

  it("filters by raceId, driverId and lap", async () => {
    const find = vi.fn().mockReturnValue(mockFindChain([lapTime]));

    db.collection.mockReturnValue({
      find,
      countDocuments: vi.fn().mockResolvedValue(1),
    });

    const res = mockRes();

    await getAllLapTimes(
      mockReq({
        query: {
          raceId: "841",
          driverId: "1",
          lap: "1",
        },
      }),
      res
    );

    expect(find).toHaveBeenCalledWith({
      raceId: 841,
      driverId: 1,
      lap: 1,
    });
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("returns 404 when no lap times found", async () => {
    db.collection.mockReturnValue({
      find: vi.fn().mockReturnValue(mockFindChain([])),
      countDocuments: vi.fn().mockResolvedValue(0),
    });

    const res = mockRes();
    await getAllLapTimes(mockReq(), res);

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
    await getAllLapTimes(mockReq(), res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});