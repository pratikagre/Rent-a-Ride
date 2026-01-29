import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/**
 * ======================
 * SIGN UP
 * ======================
 */
export const signUp = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // username is REQUIRED in schema → auto-generate
    const user = new User({
      username: email.split("@")[0], // ✅ FIX
      email,
      password: hashedPassword,
      isUser: true,
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: "User created successfully",
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({
      success: false,
      message: "Signup failed",
    });
  }
};

/**
 * ======================
 * SIGN IN
 * ======================
 */
export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isPasswordCorrect = bcrypt.compareSync(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    const accessToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      success: true,
      _id: user._id,
      username: user.username,
      email: user.email,
      isUser: user.isUser,
      isAdmin: user.isAdmin,
      isVendor: user.isVendor,
      accessToken,
    });
  } catch (err) {
    console.error("Signin error:", err);
    res.status(500).json({
      success: false,
      message: "Signin failed",
    });
  }
};

/**
 * ======================
 * REFRESH TOKEN (DUMMY – to avoid crash)
 * ======================
 */
export const refreshToken = async (req, res) => {
  res.status(200).json({ message: "refresh token ok" });
};
