import { Response } from "express";
import {
  sendSuccess,
  sendError,
  sendCreated,
  sendNotFound,
  sendBadRequest,
} from "../apiResponse";

const mockRes = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("apiResponse helpers", () => {
  describe("sendSuccess", () => {
    it("sends 200 with a success payload", () => {
      const res = mockRes();
      sendSuccess(res, { id: 1 }, "OK");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "OK",
        data: { id: 1 },
      });
    });

    it("uses the default message when none is provided", () => {
      const res = mockRes();
      sendSuccess(res, []);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Success" }),
      );
    });

    it("uses a custom status code", () => {
      const res = mockRes();
      sendSuccess(res, null, "Created", 201);
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe("sendError", () => {
    it("sends 500 with an error payload by default", () => {
      const res = mockRes();
      sendError(res, "Something went wrong");
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Something went wrong",
      });
    });

    it("includes errors array when provided", () => {
      const res = mockRes();
      sendError(res, "Bad request", 400, [{ field: "title" }]);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Bad request",
        errors: [{ field: "title" }],
      });
    });

    it("uses a custom status code", () => {
      const res = mockRes();
      sendError(res, "Not found", 404);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe("sendCreated", () => {
    it("sends 201 with created data", () => {
      const res = mockRes();
      sendCreated(res, { _id: "1" }, "Todo created");
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Todo created",
        data: { _id: "1" },
      });
    });

    it("uses the default message when none is provided", () => {
      const res = mockRes();
      sendCreated(res, {});
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Created successfully" }),
      );
    });
  });

  describe("sendNotFound", () => {
    it("sends 404 with the default message", () => {
      const res = mockRes();
      sendNotFound(res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: false, message: "Resource not found" }),
      );
    });

    it("sends 404 with a custom message", () => {
      const res = mockRes();
      sendNotFound(res, "Todo not found");
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Todo not found" }),
      );
    });
  });

  describe("sendBadRequest", () => {
    it("sends 400 with validation errors", () => {
      const res = mockRes();
      sendBadRequest(res, "Validation failed", [{ msg: "Required" }]);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Validation failed",
        errors: [{ msg: "Required" }],
      });
    });

    it("uses the default message when none is provided", () => {
      const res = mockRes();
      sendBadRequest(res);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Bad request" }),
      );
    });
  });
});

