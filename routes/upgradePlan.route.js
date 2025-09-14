import express from "express";
import { upgradeTenant } from "../controllers/upgradePlan.controller.js";
import { isAuthenticated } from "../middlewares/isAuthnticated.middleware.js";

const upgradeRouter = express.Router();

upgradeRouter.post("/:tenantId/upgrade", isAuthenticated, upgradeTenant);

export default upgradeRouter;
