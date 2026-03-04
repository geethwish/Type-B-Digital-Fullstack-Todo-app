import { Request, Response, NextFunction } from "express";
import { validate } from "../validate";

jest.mock("express-validator", () => ({
  validationResult: jest.fn(),
}));

import { validationResult } from "express-validator";

const mockRes = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockReq = {} as Request;

describe("validate middleware", () => {
  it("calls next() when there are no validation errors", () => {
    const next = jest.fn() as NextFunction;
    (validationResult as unknown as jest.Mock).mockReturnValue({
      isEmpty: () => true,
      array: () => [],
    });

    validate(mockReq, mockRes(), next);

    expect(next).toHaveBeenCalled();
  });

  it("sends 400 and does not call next() when there are validation errors", () => {
    const next = jest.fn() as NextFunction;
    const res = mockRes();
    (validationResult as unknown as jest.Mock).mockReturnValue({
      isEmpty: () => false,
      array: () => [{ msg: "Title is required" }],
    });

    validate(mockReq, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: "Validation failed",
        errors: [{ msg: "Title is required" }],
      }),
    );
    expect(next).not.toHaveBeenCalled();
  });

  it("includes all validation errors in the response", () => {
    const next = jest.fn() as NextFunction;
    const res = mockRes();
    const errors = [
      { msg: "Title is required" },
      { msg: "Description too long" },
    ];
    (validationResult as unknown as jest.Mock).mockReturnValue({
      isEmpty: () => false,
      array: () => errors,
    });

    validate(mockReq, res, next);

    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ errors }));
  });
});
