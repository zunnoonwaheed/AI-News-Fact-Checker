import { Router, type IRouter } from "express";
import healthRouter from "./health";
import factcheckRouter from "./factcheck";

const router: IRouter = Router();

router.use(healthRouter);
router.use(factcheckRouter);

export default router;
