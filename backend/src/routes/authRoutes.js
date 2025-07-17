import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "my-secret-key";

// Signup
router.post("/signup", async (req, res) => {
    const { username, email, password } = req.body;
  
    if (!username || !email || !password)
      return res.status(400).json({ error: "All fields required" });
  
    const existing = await pool.query(
      "SELECT * FROM users WHERE username = $1 OR email = $2",
      [username, email]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: "Username or email already taken" });
    }
  
    const hashed = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3)",
      [username, email, hashed]
    );
  
    res.status(201).json({ message: "User created" });
  });
  
  

// Login with email & password
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    console.log("📥 Login Request:", { email, password });
  
    try {
      // 1. Check if user exists
      const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
      const user = result.rows[0];
  
      console.log("🔍 Found user in DB:", user);
  
      if (!user) {
        console.log("❌ No user found with that email");
        return res.status(400).json({ error: "Invalid credentials" });
      }
  
      // 2. Compare passwords
      const match = await bcrypt.compare(password, user.password);
      console.log("🔐 Password match:", match);
  
      if (!match) {
        console.log("❌ Password did not match");
        return res.status(400).json({ error: "Invalid credentials" });
      }
  
      // 3. Issue JWT
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: "4h",
      });
  
      res.json({ token, username: user.username, email: user.email });
    } catch (error) {
      console.error("🔥 Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });
  
  

export default router;















// import express from "express";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import User from "../models/user.js";

// const router = express.Router();
// const JWT_SECRET = process.env.JWT_SECRET || "my-secret-key"; 

// router.post("/signup",async (req,res) => {
//     const { username, password } =req.body;

//     try {
//         const exists = await User.findOne({username});
//         if (exists) return res.status(400).json({error: "user already exists"});

//         const hashed = await bcrypt.hash(password,10);

//         const user = await UserActivation.create({username, password: hashed});

//         res.status(201).json({message: "User Created"});

//     } catch (error) {
//         res.status(500).json({ error: "Signup failed" });
//     }
// });

// router.post("/login",async (req,res) => {
//     const { username, password } =req.body;

//     try {
//         const user = await User.findOne({username});
//         if(!user) return res.status(400).json({error: "Invalid credentials"});

//         const match = await bcrypt.compare(password, user.password);
//         if(!match) return res.status(400).json({error: "Invalid credentials"});

//         const token = jwt.sign({userId: user._id },JWT_SECRET,{expiresIn: "4h"});

//         res.json({token,username});

//     } catch (error) {
//         res.status(500).json({error: "Login failed"});
//     }
// });

// export default router;