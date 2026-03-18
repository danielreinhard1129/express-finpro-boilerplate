import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/api-error.js";

export const errorMiddleware = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  req.log.error(err.message);
  const message = err.message || "Something went wrong!";
  const status = err.status || 500;
  res.status(status).send({ message });
};

export const notFoundMiddleware = (req: Request, res: Response) => {
  res.status(404).send({ message: "Route not found" });
};
