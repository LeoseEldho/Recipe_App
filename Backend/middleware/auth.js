import jwt from "jsonwebtoken";

const verifyToken = async (req, res, next) => {
  try {
    let token = req.headers["authorization"];
    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided, please log in" });
    }
    
    token = token.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "Token format is invalid" });
    }

    const decoded = jwt.verify(token, process.env.SECRETKEY);
    req.userId = decoded;
    next();
  } catch (err) {
    console.error("JWT Verification Error:", err.message);
    return res.status(401).json({
      success: false,
      message: "Session expired or invalid token. Please login again.",
    });
  }
};

export default verifyToken;