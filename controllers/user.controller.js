import User from "../models/user.models.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Tenant from "../models/tenant.model.js";

export const registerController = async (req, res) => {
  const { username, password, tenant, role, email } = req.body;
  console.log("req.body inside of register user: ", req.body);
  try {
    if (!username || !password || !email) {
      return res.status(400).json({
        message: "Username, password, and email are required!",
        success: false,
      });
    }
    const tenantname = await Tenant.findOne({ slug: tenant });
    if (!tenantname) {
      return res.status(400).json({ error: "Invalid tenant" });
    }
    // find existing user
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists!",
        success: false,
      });
    }
    const userData = {
      username,
      password,
      email,
    };

    // Only add role and tenant if they're provided
    if (role) userData.role = role;
    if (tenant) userData.tenant = tenantname._id;

    const newUser = await User.create(userData);
    if (!newUser) {
      return res.status(500).json({
        message: "Something went wrong!",
        success: false,
      });
    }

    const token = jwt.sign(
      { id: newUser._id, tenantId: newUser.tenant, role: newUser.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 24 * 60 * 60 * 1000,
    };
    res.cookie("token", token, cookieOptions);

    res.status(201).json({
      message: "User registered successfully!",
      success: true,
      newUser: newUser,
    });
  } catch (error) {
    console.log("Error inside of the registerController: ", error.message);
    return res.status(500).json({
      message: "Something went wrong!",
      success: false,
    });
  }
};

export const loginController = async (req, res) => {
  const { email, password } = req.body;
  console.log("req.body inside of login controller: ", req.body);
  try {
    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required!",
        success: false,
      });
    }
    //check if user exists or not
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({
        message: "User doesn't exist with the provided email!",
        success: false,
      });
    }
    //compare the user password with the db stored pass
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(503).json({
        message: "Email or password is incorrect!",
        success: false,
      });
    }
    const token = jwt.sign(
      { id: user._id, tenantId: user.tenant, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 24 * 60 * 60 * 1000,
    };
    res.cookie("token", token, cookieOptions);
    res.status(200).json({
      message: "User logged In successfully!",
      success: true,
      user: user,
    });
  } catch (error) {
    console.log("Error inside of loginController: ", error.message);
    return res.status(500).json({
      message: "Something went wrong!",
      success: false,
    });
  }
};

export const logoutController = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });
    res.status(200).json({
      message: "User logged out successfully!",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong!",
      success: false,
    });
  }
};

export const checkUserController = async (req, res) => {
  try {
    const id = req.user?.id;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        message: "Please login!",
        success: false,
      });
    }

    res.status(200).json({
      message: "User fetched successfully",
      success: true,
      user: user,
    });
  } catch (error) {
    console.log("Error fetching the user: ", error.message);
    return res.status(500).json({
      message: "Error fetching the user!",
      success: false,
    });
  }
};
