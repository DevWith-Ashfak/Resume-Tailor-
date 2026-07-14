import { Router, Request, Response } from "express";
import { getResult } from "../services/analysis";

export const resultRouter = Router();

resultRouter.get("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const result = getResult(id);

  if (!result) {
    res.status(404).json({ error: "Result not found" });
    return;
  }

  res.json(result);
});
