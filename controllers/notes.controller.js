import Note from "../models/notes.model.js";
import Tenant from "../models/tenant.model.js";

export const createNoteController = async (req, res) => {
  const { description } = req.body;
  try {
    if (!description) {
      return res.status(400).json({
        message: "All fields are required!",
        success: false,
      });
    }

    const tenant = await Tenant.findById(req.user.tenantId);
    console.log("tenant : ", tenant);

    if (!tenant) {
      return res.status(404).json({
        message: "Tenant not found!",
        success: false,
      });
    }

    // if Free plan, enforce limit
    if (tenant.plan === "Free" || tenant.plan === "free") {
      const noteCount = await Note.countDocuments({
        tenant: req.user.tenantId,
      });
      console.log("Current note count for tenant:", noteCount);
      if (noteCount >= 3) {
        return res.status(403).json({
          message: "Note limit reached. Upgrade to Pro for unlimited notes.",
          success: false,
        });
      }
    }

    const newNote = await Note.create({
      description,
      user: req.user.id,
      tenant: req.user.tenantId,
    });

    if (!newNote) {
      return res.status(500).json({
        message: "Something went wrong!",
        success: false,
      });
    }

    // Populate the tenant data for the newly created note
    await newNote.populate("tenant");

    res.status(201).json({
      message: "New Note created successfully!",
      success: true,
      newNote: newNote,
    });
  } catch (error) {
    console.log("Error inside of create note controller: ", error.message);
    return res.status(500).json({
      message: "Something went wrong!",
      success: false,
    });
  }
};

export const getAllNotesController = async (req, res) => {
  try {
    const tenantId = req.user?.tenantId;
    console.log("tenantId: ", tenantId);
    if (!tenantId) {
      return res.status(409).json({
        message: "Please login!",
        success: false,
      });
    }
    // check if the logged in user is a admin or a member
    const notes = await Note.find({ tenant: tenantId }).populate("tenant");
    
    console.log("All notes: ", notes);
    if (!notes) {
      return res.status(503).json({
        message: "Tenant not available!",
        success: false,
      });
    }
    res.status(200).json({
      message: "Notes fetched successfully!",
      success: true,
      allNotes: notes,
    });
  } catch (error) {
    console.log("Error inside of getAllNotesController: ", error.message);
    return res.status(500).json({
      message: "Something went wrong!",
      success: false,
    });
  }
};

export const getNoteById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(404).json({
        message: "Note doesn't exist!",
        success: false,
      });
    }
    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({
        message: "Note doesn't exist!",
        success: false,
      });
    }
    res.status(200).json({
      message: "Note fetched successfully!",
      success: true,
      note: note,
    });
  } catch (error) {
    console.log("Error inside of getNoteById: ", error.message);
    return res.status(500).json({
      message: "Something went wrong!",
      success: false,
    });
  }
};

export const updateNoteController = async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    if (!id) {
      return res.status(404).json({
        message: "Note doesn't exist!",
        success: false,
      });
    }
    console.log("id and description of the note: ", id, description);
    if (!description) {
      return res.status(400).json({
        message: "All fields are required!",
      });
    }
    const note = await Note.findByIdAndUpdate(id, { description: description });
    if (!note) {
      return res.status(500).json({
        message: "Something went wrong!",
        success: false,
      });
    }
    await note.save();
    res.status(200).json({
      message: "Note updated successfully",
      success: true,
      note: note,
    });
  } catch (error) {
    console.log("Error updating the note!", error.message);
    return res.status(500).json({
      message: "Error updating the notes!",
      success: false,
    });
  }
};

export const deleteNoteController = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(404).json({
        message: "Note doesn't exist!",
        success: false,
      });
    }
    const note = await Note.findByIdAndDelete(id);
    if (!note) {
      return res.status(404).json({
        message: "Note doesn't exist!",
        success: false,
      });
    }
    res.status(200).json({
      message: "Note deleted successfully!",
      success: true,
      note: note,
    });
  } catch (error) {
    console.log("Error deleting the note: ", error.message);
    return res.status(500).json({
      message: "Error deleting the note!",
      success: false,
    });
  }
};
