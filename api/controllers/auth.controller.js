import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

// Sign Up
export const signup = async (req, res, next) => {
  const { fullName, username, gender, email, password } = req.body;
  if (
    !fullName ||
    !username ||
    !email ||
    !password ||
    !gender ||
    fullName === "" ||
    username === "" ||
    email === "" ||
    password === "" ||
    gender === null
  ) {
    return next(errorHandler(400, "All fields are required"));
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const profilePic =
      gender === "male"
        ? `https://avatar.iran.liara.run/public/boy?username=${username}`
        : `https://avatar.iran.liara.run/public/girl?username=${username}`;

    const newUser = await User.create({
      fullName,
      username,
      email,
      password: hashedPassword,
      gender,
      profilePicture: profilePic,
      isAdmin: false,
    });

    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

// Sign In
export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email === "" || password === "") {
    return next(errorHandler(400, "All fields are required"));
  }

  try {
    const validUser = await User.findOne({ where: { email } });
    if (!validUser) {
      return next(errorHandler(404, "User not found"));
    }

    const validPassword = await bcrypt.compare(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(400, "Invalid password"));
    }

    const token = jwt.sign({ id: validUser.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const { password: pass, ...rest } = validUser.toJSON();

    res
      .status(200)
      .cookie("access_token", token, {
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        httpOnly: true, // Prevent XSS
        sameSite: "strict", // Prevent CSRF
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};

// Google Auth
export const googleAuth = async (req, res, next) => {
  const { fullName, username, email, googlePhotoUrl, gender } = req.body;

  try {
    let user = await User.findOne({ where: { email } });

    if (user) {
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      const { password, ...rest } = user.toJSON();
      res
        .status(200)
        .cookie("access_token", token, {
          maxAge: 24 * 60 * 60 * 1000, // 1 day
          httpOnly: true, // Prevent XSS
          sameSite: "strict", // Prevent CSRF
        })
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(generatedPassword, salt);

      const profilePic =
        gender === "male"
          ? `https://avatar.iran.liara.run/public/boy?username=${username}`
          : `https://avatar.iran.liara.run/public/girl?username=${username}`;

      const user = await User.create({
        fullName,
        username,
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
        gender,
        profilePic,
        isAdmin: false,
      });

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      const { password, ...rest } = user.toJSON();
      res
        .status(200)
        .cookie("access_token", token, {
          maxAge: 24 * 60 * 60 * 1000, // 1 day
          httpOnly: true, // Prevent XSS
          sameSite: "strict", // Prevent CSRF
        })
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

export const signout = (req, res, next) => {
  try {
    res
      .clearCookie("access_token")
      .status(200)
      .json("User has been signed out");
  } catch (error) {
    next(error);
  }
};
