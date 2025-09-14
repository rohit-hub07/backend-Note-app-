import express from "express";
import {
  createNoteController,
  deleteNoteController,
  getAllNotesController,
  getNoteById,
  updateNoteController,
} from "../controllers/notes.controller.js";
import { isAuthenticated } from "../middlewares/isAuthnticated.middleware.js";

const noteRouter = express.Router();

noteRouter.post("/", isAuthenticated, createNoteController);
noteRouter.get("/", isAuthenticated, getAllNotesController);
noteRouter.get("/:id", getNoteById);
noteRouter.put("/:id", updateNoteController);
noteRouter.delete("/:id", deleteNoteController);

export default noteRouter;
