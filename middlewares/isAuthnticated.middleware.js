import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    console.log(token);
    if (!token || token === "undefined" || token.trim() === "") {
      return res.status(403).json({
        message: "Please login!",
        success: false,
      });
    }

    //decode the jwt val
    const decodedVal = jwt.verify(token, process.env.JWT_SECRET);
    console.log(
      "decoed val inside of isAuthenticated middleware: ",
      decodedVal
    );
    req.user = decodedVal;
    console.log("req.user: ", req.user);
    next();
  } catch (error) {
    console.log("something went wrong: ", error.message);
    return res.status(401).json({
      message: "Please login!",
      success: false,
    })
  }
};
