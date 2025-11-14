import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/api-error";

export const errorMiddleware = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const message = err.message || "Something went wrong!";
  const status = err.status || 500;
  res.status(status).send({ message });
};
