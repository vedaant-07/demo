import { Router, type IRouter } from "express";
import { eq, and, gte, lte } from "drizzle-orm";
import { db, profilesTable } from "@workspace/db";
import {
  ListProfilesQueryParams,
  ListProfilesResponse,
  CreateProfileBody,
  GetProfileParams,
  GetProfileResponse,
  ListFeaturedProfilesResponse,
  UpdateProfileBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/profiles", async (req, res): Promise<void> => {
  const params = ListProfilesQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const { gender, religion, minAge, maxAge, city, limit = 20, offset = 0 } = params.data;

  const conditions = [];
  if (gender) conditions.push(eq(profilesTable.gender, gender));
  if (religion) conditions.push(eq(profilesTable.religion, religion));
  if (minAge) conditions.push(gte(profilesTable.age, minAge));
  if (maxAge) conditions.push(lte(profilesTable.age, maxAge));
  if (city) conditions.push(eq(profilesTable.city, city));

  const profiles = await db
    .select()
    .from(profilesTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .limit(limit)
    .offset(offset)
    .orderBy(profilesTable.createdAt);

  res.json(ListProfilesResponse.parse(profiles.map(p => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
  }))));
});

router.post("/profiles", async (req, res): Promise<void> => {
  const parsed = CreateProfileBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [profile] = await db.insert(profilesTable).values(parsed.data).returning();

  res.status(201).json(GetProfileResponse.parse({
    ...profile,
    createdAt: profile.createdAt.toISOString(),
  }));
});

router.get("/profiles/featured", async (_req, res): Promise<void> => {
  const profiles = await db
    .select()
    .from(profilesTable)
    .where(eq(profilesTable.featured, true))
    .limit(10)
    .orderBy(profilesTable.createdAt);

  res.json(ListFeaturedProfilesResponse.parse(profiles.map(p => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
  }))));
});

router.get("/profiles/:id", async (req, res): Promise<void> => {
  const params = GetProfileParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [profile] = await db
    .select()
    .from(profilesTable)
    .where(eq(profilesTable.id, params.data.id));

  if (!profile) {
    res.status(404).json({ error: "Profile not found" });
    return;
  }

  res.json(GetProfileResponse.parse({
    ...profile,
    createdAt: profile.createdAt.toISOString(),
  }));
});

router.patch("/profiles/:id", async (req, res): Promise<void> => {
  const params = GetProfileParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateProfileBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [updated] = await db
    .update(profilesTable)
    .set(parsed.data)
    .where(eq(profilesTable.id, params.data.id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Profile not found" });
    return;
  }

  res.json(GetProfileResponse.parse({
    ...updated,
    createdAt: updated.createdAt.toISOString(),
  }));
});

export default router;
