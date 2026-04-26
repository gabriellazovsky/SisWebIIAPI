import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getAllSeasons,
  createSeason,
  getSeasonByYear,
  updateSeason,
  deleteSeason
} from "../../controllers/seasonController.js";

import db from "../../db/conn.js";

vi.mock("../../db/conn.js");

const mockReq = (data = {}) => ({
  params: data.params || {},
  query: data.query || {},
  body: data.body || {}
});

const mockRes = () => {
  const res = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  res.send = vi.fn().mockReturnValue(res);
  return res;
};

describe("Season Controller (mock)", () => {
  beforeEach(() => vi.clearAllMocks());

  describe("getAllSeasons", () => {
    it("returns 200 with seasons", async () => {
      db.collection.mockReturnValue({
        find: () => ({ toArray: () => Promise.resolve([{ year: 2020 }]) })
      });

      const res = mockRes();
      await getAllSeasons(mockReq(), res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("returns 404 when empty", async () => {
      db.collection.mockReturnValue({
        find: () => ({ toArray: () => Promise.resolve([]) })
      });

      const res = mockRes();
      await getAllSeasons(mockReq(), res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe("createSeason", () => {
    it("returns 201 on success", async () => {
      db.collection.mockReturnValue({
        insertOne: () => Promise.resolve({ insertedId: "123" })
      });

      const res = mockRes();

      await createSeason(
        mockReq({ body: { year: 2020, url: "http://en.wikipedia.org/wiki/2020_Formula_One_season" } }),
        res
      );

      expect(res.status).toHaveBeenCalledWith(201);
    });

    it("returns 400 on invalid data", async () => {
      const res = mockRes();

      await createSeason(mockReq({ body: {} }), res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe("getSeasonByYear", () => {
    it("returns 200 when found", async () => {
      db.collection.mockReturnValue({
        findOne: () => Promise.resolve({ year: 2020 })
      });

      const res = mockRes();
      await getSeasonByYear(mockReq({ params: { year: "2020" } }), res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("returns 404 when not found", async () => {
      db.collection.mockReturnValue({
        findOne: () => Promise.resolve(null)
      });

      const res = mockRes();
      await getSeasonByYear(mockReq({ params: { year: "2020" } }), res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe("updateSeason", () => {
    it("returns 200 on update", async () => {
      db.collection.mockReturnValue({
        findOneAndUpdate: () =>
          Promise.resolve({ value: { year: 2020 } })
      });

      const res = mockRes();

      await updateSeason(
        mockReq({
          params: { year: "2020" },
          body: { url: "http://en.wikipedia.org/wiki/2020_Formula_One_season" }
        }),
        res
      );

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("returns 404 if not found", async () => {
      db.collection.mockReturnValue({
        findOneAndUpdate: () => Promise.resolve({ value: null })
      });

      const res = mockRes();

      await updateSeason(
        mockReq({
          params: { year: "2020" },
          body: { url: "http://en.wikipedia.org/wiki/2020_Formula_One_season" }
        }),
        res
      );

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe("deleteSeason", () => {
    it("returns 204 on delete", async () => {
      db.collection.mockReturnValue({
        deleteOne: () => Promise.resolve({ deletedCount: 1 })
      });

      const res = mockRes();

      await deleteSeason(mockReq({ params: { year: "2020" } }), res);

      expect(res.status).toHaveBeenCalledWith(204);
    });

    it("returns 404 if not found", async () => {
      db.collection.mockReturnValue({
        deleteOne: () => Promise.resolve({ deletedCount: 0 })
      });

      const res = mockRes();

      await deleteSeason(mockReq({ params: { year: "2020" } }), res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});