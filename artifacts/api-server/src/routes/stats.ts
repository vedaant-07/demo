import { Router, type IRouter } from "express";
import { db, profilesTable, interestsTable, storiesTable } from "@workspace/db";
import { count } from "drizzle-orm";
import { GetStatsResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/stats", async (_req, res): Promise<void> => {
  const [profileCount] = await db.select({ count: count() }).from(profilesTable);
  const [matchCount] = await db.select({ count: count() }).from(interestsTable);
  const [storyCount] = await db.select({ count: count() }).from(storiesTable);

  const citiesResult = await db.selectDistinct({ city: profilesTable.city }).from(profilesTable);
  const citiesCovered = citiesResult.length;

  res.json(GetStatsResponse.parse({
    totalMembers: profileCount.count,
    totalMatches: matchCount.count,
    successStories: storyCount.count,
    citiesCovered,
  }));
});

export default router;
