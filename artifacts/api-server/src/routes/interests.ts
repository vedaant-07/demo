import { Router, type IRouter } from "express";
import { db, interestsTable } from "@workspace/db";
import {
  ListInterestsResponse,
  SendInterestBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/interests", async (_req, res): Promise<void> => {
  const interests = await db
    .select()
    .from(interestsTable)
    .orderBy(interestsTable.createdAt);

  res.json(ListInterestsResponse.parse(interests.map(i => ({
    ...i,
    createdAt: i.createdAt.toISOString(),
  }))));
});

router.post("/interests", async (req, res): Promise<void> => {
  const parsed = SendInterestBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [interest] = await db
    .insert(interestsTable)
    .values(parsed.data)
    .returning();

  res.status(201).json({
    ...interest,
    createdAt: interest.createdAt.toISOString(),
  });
});

export default router;
