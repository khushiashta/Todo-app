import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "my-secret-key"; 

router.post("/signup",async (req,res) => {
    const { username, password } =req.body;

    try {
        const exists = await User.findOne({username});
        if (exists) return res.status(400).json({error: "user already exists"});

        const hashed = await bcrypt.hash(password,10);

        const user = await UserActivation.create({username, password: hashed});

        res.status(201).json({message: "User Created"});

    } catch (error) {
        res.status(500).json({ error: "Signup failed" });
    }
});

router.post("/login",async (req,res) => {
    const { username, password } =req.body;

    try {
        const user = await User.findOne({username});
        if(!user) return res.status(400).json({error: "Invalid credentials"});

        const match = await bcrypt.compare(password, user.password);
        if(!match) return res.status(400).json({error: "Invalid credentials"});

        const token = jwt.sign({userId: user._id },JWT_SECRET,{expiresIn: "4h"});

        res.json({token,username});

    } catch (error) {
        res.status(500).json({error: "Login failed"});
    }
});

export default router;