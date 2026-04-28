import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../db/conn", () => ({
  default: { collection: vi.fn() },
}));

import db from "../../db/conn";
import {
  getAllDrivers,
  createDriver,
  getDriverById,
  updateDriver,
  deleteDriver,
  getDriverResults,
  getDriverStandings,
  getDriverQualifying,
  getDriverLapTimes,
  getDriverPitStops,
} from "../../controllers/driverController";

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

const driver = {
  driverId: 1,
  driverRef: "hamilton",
  number: 44,
  code: "HAM",
  forename: "Lewis",
  surname: "Hamilton",
  nationality: "British",
};

describe("getAllDrivers", () => {
  it("returns 200 with drivers", async () => {
    db.collection.mockReturnValue({
      find: vi.fn().mockReturnValue({
        skip: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        toArray: vi.fn().mockResolvedValue([driver]),
      }),
      countDocuments: vi.fn().mockResolvedValue(1),
    });

    const res = mockRes();
    await getAllDrivers(mockReq(), res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("returns 404 when no drivers found", async () => {
    db.collection.mockReturnValue({
      find: vi.fn().mockReturnValue({
        skip: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        toArray: vi.fn().mockResolvedValue([]),
      }),
      countDocuments: vi.fn().mockResolvedValue(0),
    });

    const res = mockRes();
    await getAllDrivers(mockReq(), res);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe("createDriver", () => {
  it("returns 201 on success", async () => {
    db.collection.mockReturnValue({
      insertOne: vi.fn().mockResolvedValue({ insertedId: "abc123" }),
    });

    const res = mockRes();
    await createDriver(mockReq({ body: driver }), res);

    expect(res.status).toHaveBeenCalledWith(201);
  });
});

describe("getDriverById", () => {
  it("returns 200 when driver exists", async () => {
    db.collection.mockReturnValue({
      findOne: vi.fn().mockResolvedValue(driver),
    });

    const res = mockRes();
    await getDriverById(mockReq({ params: { driverId: "1" } }), res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("returns 404 when driver does not exist", async () => {
    db.collection.mockReturnValue({
      findOne: vi.fn().mockResolvedValue(null),
    });

    const res = mockRes();
    await getDriverById(mockReq({ params: { driverId: "999" } }), res);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe("updateDriver", () => {
  it("returns 200 on successful update", async () => {
    db.collection.mockReturnValue({
      findOneAndUpdate: vi.fn().mockResolvedValue({ ...driver, number: 77 }),
    });

    const res = mockRes();
    await updateDriver(mockReq({ params: { driverId: "1" }, body: { number: 77 } }), res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("returns 404 when driver does not exist", async () => {
    db.collection.mockReturnValue({
      findOneAndUpdate: vi.fn().mockResolvedValue(null),
    });

    const res = mockRes();
    await updateDriver(mockReq({ params: { driverId: "999" }, body: {} }), res);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe("deleteDriver", () => {
  it("returns 204 on successful delete", async () => {
    db.collection.mockReturnValue({
      deleteOne: vi.fn().mockResolvedValue({ deletedCount: 1 }),
    });

    const res = mockRes();
    await deleteDriver(mockReq({ params: { driverId: "1" } }), res);

    expect(res.status).toHaveBeenCalledWith(204);
  });

  it("returns 404 when driver does not exist", async () => {
    db.collection.mockReturnValue({
      deleteOne: vi.fn().mockResolvedValue({ deletedCount: 0 }),
    });

    const res = mockRes();
    await deleteDriver(mockReq({ params: { driverId: "999" } }), res);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe("getDriverResults", () => {
  it("returns 200 with results", async () => {
    db.collection.mockReturnValue({
      find: vi.fn().mockReturnValue({
        sort: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        toArray: vi.fn().mockResolvedValue([{ raceId: 18, driverId: 1 }]),
      }),
      countDocuments: vi.fn().mockResolvedValue(1),
    });

    const res = mockRes();
    await getDriverResults(mockReq({ params: { driverId: "1" } }), res);

    expect(res.status).toHaveBeenCalledWith(200);
  });
});

describe("getDriverStandings", () => {
  it("returns 200 with standings", async () => {
    db.collection.mockReturnValue({
      find: vi.fn().mockReturnValue({
        toArray: vi.fn().mockResolvedValue([{ driverId: 1, points: 10 }]),
      }),
    });

    const res = mockRes();
    await getDriverStandings(mockReq({ params: { driverId: "1" } }), res);

    expect(res.status).toHaveBeenCalledWith(200);
  });
});

describe("getDriverQualifying", () => {
  it("returns 200 with qualifying results", async () => {
    db.collection.mockReturnValue({
      find: vi.fn().mockReturnValue({
        toArray: vi.fn().mockResolvedValue([{ driverId: 1, position: 1 }]),
      }),
    });

    const res = mockRes();
    await getDriverQualifying(mockReq({ params: { driverId: "1" } }), res);

    expect(res.status).toHaveBeenCalledWith(200);
  });
});

describe("getDriverLapTimes", () => {
  it("returns 200 with lap times", async () => {
    db.collection.mockReturnValue({
      find: vi.fn().mockReturnValue({
        sort: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        toArray: vi.fn().mockResolvedValue([{ driverId: 1, lap: 1 }]),
      }),
      countDocuments: vi.fn().mockResolvedValue(1),
    });

    const res = mockRes();
    await getDriverLapTimes(mockReq({ params: { driverId: "1" } }), res);

    expect(res.status).toHaveBeenCalledWith(200);
  });
});

describe("getDriverPitStops", () => {
  it("returns 200 with pit stops", async () => {
    db.collection.mockReturnValue({
      find: vi.fn().mockReturnValue({
        sort: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        toArray: vi.fn().mockResolvedValue([{ driverId: 1, stop: 1 }]),
      }),
      countDocuments: vi.fn().mockResolvedValue(1),
    });

    const res = mockRes();
    await getDriverPitStops(mockReq({ params: { driverId: "1" } }), res);

    expect(res.status).toHaveBeenCalledWith(200);
  });
});