import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signUp = async (req, res) => {
  try {
    const { email, password } = req.body;

    const hashed = bcrypt.hashSync(password, 10);

    const user = new User({
      email,
      password: hashed,
    });

    await user.save();

    res.status(201).json({ message: "User created" });
  } catch (err) {
    res.status(500).json(err);
  }
};

export const signIn = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) return res.status(404).json({ message: "user not found" });

    const valid = bcrypt.compareSync(req.body.password, user.password);

    if (!valid) return res.status(401).json({ message: "wrong password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({
      _id: user._id,
      email: user.email,
      accessToken: token,
      isUser: true,
    });
  } catch (err) {
    res.status(500).json(err);
  }
};
