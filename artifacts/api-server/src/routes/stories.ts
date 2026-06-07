import { Router, type IRouter } from "express";
import { db, storiesTable } from "@workspace/db";
import {
  ListStoriesResponse,
  CreateStoryBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/stories", async (_req, res): Promise<void> => {
  const stories = await db
    .select()
    .from(storiesTable)
    .orderBy(storiesTable.marriageYear);

  res.json(ListStoriesResponse.parse(stories.map(s => ({
    ...s,
    createdAt: s.createdAt.toISOString(),
  }))));
});

router.post("/stories", async (req, res): Promise<void> => {
  const parsed = CreateStoryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [story] = await db.insert(storiesTable).values(parsed.data).returning();

  res.status(201).json({
    ...story,
    createdAt: story.createdAt.toISOString(),
  });
});

export default router;
