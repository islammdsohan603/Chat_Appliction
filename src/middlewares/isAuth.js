import jwt from "jsonwebtoken";

export const isAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        message: "token is not found",
      });
    }

    const verifyToken = await jwt.verify(token, process.env.JWT_SECRET);
    req.userId = verifyToken.userId;
    next();
  } catch (error) {
    console.log("Middleware Error:", error.message || error);
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};
