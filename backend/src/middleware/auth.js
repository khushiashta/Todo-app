import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Incoming token:", token);
    console.log("Decoded:", decoded);
    
    // FIX: use decoded.userId instead of decoded.id
    const result = await pool.query("SELECT id, username FROM users WHERE id = $1", [
      decoded.userId,
    ]);

    const user = result.rows[0];
    if (!user) return res.status(401).json({ error: "Invalid user" });

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth error:", error);
    res.status(401).json({ error: "Unauthorized" });
  }
};

export default auth;













// import jwt from "jsonwebtoken";
// import User from "../models/user.js"; 

// const auth = async (req, res, next) => {
//     try {
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//         return res.status(401).json({ error: "No token provided" });
//     }

//     const token = authHeader.split(" ")[1];

//     const decoded = jwt.verify(token, process.env.JWT_SECRET); 
//     req.user = await User.findById(decoded.id).select("-password");

//     if (!req.user) return res.status(401).json({ error: "Invalid user" });

//     next();
//     } catch (error) {
//     console.error("Auth error:", error);
//     res.status(401).json({ error: "Unauthorized" });
//     }
// };

// export default auth;
