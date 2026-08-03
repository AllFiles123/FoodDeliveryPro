import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "fooddelivery_secret";


export function authMiddleware(req, res, next) {

  try {

    const authHeader = req.headers.authorization;


    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authorization token required",
      });
    }


    const token = authHeader.split(" ")[1];


    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }


    const decoded = jwt.verify(
      token,
      JWT_SECRET
    );


    req.user = decoded;


    next();


  } catch (error) {

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });

  }

}
