import jwt from "jsonwebtoken";

export const isAuth = async (req, res, next) => {
  try {
    let token = req.cookies.token;
    if (!token) {
      return res.status(400).json({
        message: "token is not found",
      });
    }

    let varifyToken = await jwt.verify(token, process.env.JWT_SECRET);

    console.log(varifyToken);

    req.userId = varifyToken.userId;
    next();
  } catch (error) {
    console.log("Middleware Error", error);
    return res.status(500).json({
      message: "Server Error",
    });
  }
};
