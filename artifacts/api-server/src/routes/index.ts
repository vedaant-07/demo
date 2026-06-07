import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import profilesRouter from "./profiles";
import interestsRouter from "./interests";
import storiesRouter from "./stories";
import statsRouter from "./stats";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(profilesRouter);
router.use(interestsRouter);
router.use(storiesRouter);
router.use(statsRouter);

export default router;
