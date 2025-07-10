import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// create JWT
const createToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "3d" });
};

// signup controller
export const signupUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
    // check if email already exists
        const exists = await User.findOne({ email });
    if (exists) {
        return res.status(400).json({ error: "Email already registered" });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // create user
    const user = await User.create({ username, email, password: hash });

    // create token
    const token = createToken(user._id);

    res.status(201).json({ username: user.username, token });
    } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Signup failed" });
    }
};

// login controller
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
    // find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    // compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    // create token
    const token = createToken(user._id);

    res.status(200).json({ username: user.username, token });
    } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
    }
};
