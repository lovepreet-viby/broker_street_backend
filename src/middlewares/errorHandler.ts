import { Request, Response } from "express";

// global error handler
export default function errorHandler(
  Error: { status: any; message: any },
  req: Request,
  res: Response,
  next: Function
) {
  res.status(Error?.status || 500);
  res.send({ message: Error?.message || "Internal server error" });
}
