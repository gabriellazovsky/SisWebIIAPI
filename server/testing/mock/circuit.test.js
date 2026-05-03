import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../db/conn.mjs", () => ({
  default: { collection: vi.fn() },
}));

import db from "../../db/conn.mjs";
import {
  getAllCircuits,
  createCircuit,
  getCircuitById,
  updateCircuit,
  deleteCircuit,
} from "../../controllers/circuitController.mjs";

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

const circuit = {
  circuitId: 1,
  circuitRef: "monza",
  name: "Monza",
  location: "Italy",
  country: "Italy",
  lat: 45.6156,
  lng: 9.2811
};

describe("getAllCircuits", () => {
  it("returns 200 with circuits", async () => {
    db.collection.mockReturnValue({
      find: vi.fn().mockReturnValue({
        skip: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        toArray: vi.fn().mockResolvedValue([circuit]),
      }),
    });

    const res = mockRes();
    await getAllCircuits(mockReq(), res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("returns 404 when no circuits found", async () => {
    db.collection.mockReturnValue({
      find: vi.fn().mockReturnValue({
        skip: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        toArray: vi.fn().mockResolvedValue([]),
      }),
    });

    const res = mockRes();
    await getAllCircuits(mockReq(), res);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe("createCircuit", () => {
  it("returns 201 on success", async () => {
    db.collection.mockReturnValue({
      insertOne: vi.fn().mockResolvedValue({ insertedId: "abc123" }),
    });

    const res = mockRes();
    await createCircuit(mockReq({ body: circuit }), res);

    expect(res.status).toHaveBeenCalledWith(201);
  });
});

describe("getCircuitById", () => {
  it("returns 200 when circuit exists", async () => {
    db.collection.mockReturnValue({
      findOne: vi.fn().mockResolvedValue(circuit),
    });

    const res = mockRes();
    await getCircuitById(mockReq({ params: { circuitId: "1" } }), res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("returns 404 when circuit not found", async () => {
    db.collection.mockReturnValue({
      findOne: vi.fn().mockResolvedValue(null),
    });

    const res = mockRes();
    await getCircuitById(mockReq({ params: { circuitId: "999" } }), res);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe("updateCircuit", () => {
  it("returns 200 on update", async () => {
    db.collection.mockReturnValue({
      findOneAndUpdate: vi.fn().mockResolvedValue({ ...circuit, name: "Updated" }),
    });

    const res = mockRes();
    await updateCircuit(
      mockReq({ params: { circuitId: "1" }, body: { name: "Updated" } }),
      res
    );

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("returns 404 if not found", async () => {
    db.collection.mockReturnValue({
      findOneAndUpdate: vi.fn().mockResolvedValue(null),
    });

    const res = mockRes();
    await updateCircuit(mockReq({ params: { circuitId: "999" }, body: {} }), res);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe("deleteCircuit", () => {
  it("returns 204 on delete", async () => {
    db.collection.mockReturnValue({
      deleteOne: vi.fn().mockResolvedValue({ deletedCount: 1 }),
    });

    const res = mockRes();
    await deleteCircuit(mockReq({ params: { circuitId: "1" } }), res);

    expect(res.status).toHaveBeenCalledWith(204);
  });

  it("returns 404 if not found", async () => {
    db.collection.mockReturnValue({
      deleteOne: vi.fn().mockResolvedValue({ deletedCount: 0 }),
    });

    const res = mockRes();
    await deleteCircuit(mockReq({ params: { circuitId: "999" } }), res);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});