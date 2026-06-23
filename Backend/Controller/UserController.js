import User from "../Model/UserModel.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const userRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill out all fields",
      });
    }

    const isExist = await User.findOne({ email: email.toLowerCase() });
    if (isExist) {
      return res.status(409).json({ success: false, message: "Email already exists" });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(password, salt);
    
    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashPassword,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully!",
      data: { name: newUser.name, email: newUser.email },
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ success: false, message: "Server error during registration" });
  }
};

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required!" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ success: false, message: "User not registered. Sign up first." });
    }

    const compare = await bcryptjs.compare(password, user.password);
    if (!compare) {
      return res.status(401).json({ success: false, message: "Incorrect password!" });
    }

    const token = jwt.sign({ email: user.email, id: user._id }, process.env.SECRETKEY, {
      expiresIn: "30 days",
    });

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      data: {
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
        },
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: "Server error during login" });
  }
};

export const getUser = async (req, res) => {
  try {
    res.status(200).json({ success: true, message: "User data method placeholder" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};