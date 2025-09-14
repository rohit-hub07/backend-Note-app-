import express from "express";
import {
  checkUserController,
  loginController,
  logoutController,
  registerController,
} from "../controllers/user.controller.js";
import { isAuthenticated } from "../middlewares/isAuthnticated.middleware.js";

const userRouter = express.Router();

userRouter.post("/register", registerController);
userRouter.post("/login", loginController);
userRouter.get("/logout", isAuthenticated, logoutController);
userRouter.get("/profile", isAuthenticated, checkUserController);

export default userRouter;
