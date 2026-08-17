import type { NextFunction, Request, Response } from "express";

type AsyncHnadlerFn<TReq extends Request = Request> = (
  req: TReq,
  res: Response,
  next: NextFunction,
) => Promise<any>;

const asyncHandler = <TReq extends Request = Request>(
  fn: AsyncHnadlerFn<TReq>,
) => {
  return (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req as TReq, res, next)).catch(next);
};

export default asyncHandler;
