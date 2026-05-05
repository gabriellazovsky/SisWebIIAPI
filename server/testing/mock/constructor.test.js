import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../db/conn.mjs", () => ({
  default: { collection: vi.fn() },
}));

import db from "../../db/conn.mjs";

import {
  getAllConstructors,
  createConstructor,
  getConstructorById,
  updateConstructor,
  deleteConstructor,
  getConstructorResults,
  getConstructorStandings,
} from "../../controllers/constructorController.mjs";

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

const constructor = {
  constructorId: 1,
  constructorRef: "mercedes",
  name: "Mercedes",
  nationality: "German",
};

describe("getAllConstructors", () => {
  it("returns 200 with constructors", async () => {
    db.collection.mockReturnValue({
      find: vi.fn().mockReturnValue({
        toArray: vi.fn().mockResolvedValue([constructor]),
      }),
    });

    const res = mockRes();
    await getAllConstructors(mockReq(), res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("returns 404 when empty", async () => {
    db.collection.mockReturnValue({
      find: vi.fn().mockReturnValue({
        toArray: vi.fn().mockResolvedValue([]),
      }),
    });

    const res = mockRes();
    await getAllConstructors(mockReq(), res);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe("createConstructor", () => {
  it("returns 201 on success", async () => {
    db.collection.mockReturnValue({
      insertOne: vi.fn().mockResolvedValue({ insertedId: "abc" }),
    });

    const res = mockRes();
    await createConstructor(mockReq({ body: constructor }), res);

    expect(res.status).toHaveBeenCalledWith(201);
  });
});

describe("getConstructorById", () => {
  it("returns 200 when found", async () => {
    db.collection.mockReturnValue({
      findOne: vi.fn().mockResolvedValue(constructor),
    });

    const res = mockRes();
    await getConstructorById(mockReq({ params: { constructorId: "1" } }), res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("returns 404 when not found", async () => {
    db.collection.mockReturnValue({
      findOne: vi.fn().mockResolvedValue(null),
    });

    const res = mockRes();
    await getConstructorById(mockReq({ params: { constructorId: "999" } }), res);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe("updateConstructor", () => {
  it("returns 200 when updated", async () => {
    db.collection.mockReturnValue({
      findOneAndUpdate: vi.fn().mockResolvedValue({ value: { ...constructor, name: "Ferrari" } }),
    });

    const res = mockRes();
    await updateConstructor(
      mockReq({ params: { constructorId: "1" }, body: { name: "Ferrari" } }),
      res
    );

    expect(res.status).toHaveBeenCalledWith(200);
  });
});

describe("deleteConstructor", () => {
  it("returns 204 when deleted", async () => {
    db.collection.mockReturnValue({
      deleteOne: vi.fn().mockResolvedValue({ deletedCount: 1 }),
    });

    const res = mockRes();
    await deleteConstructor(mockReq({ params: { constructorId: "1" } }), res);

    expect(res.status).toHaveBeenCalledWith(204);
  });
});