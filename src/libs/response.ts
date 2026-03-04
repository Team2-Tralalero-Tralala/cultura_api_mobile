import { Response } from "express";

export const apiResponse = (
  res: Response,
  code: number,
  data: any = {},
  message: string | null = null,
) => {
  const status = code >= 200 && code < 300 ? "success" : "error";
  return res.status(code).json({
    status,
    code,
    data,
    message,
  });
};
