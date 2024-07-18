import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";

export const updateUser = async (req, res, next) => {
  console.log(req.user.id, req.params.userId);
  if (req.user.id != req.params.userId) {
    return next(errorHandler(403, "You are not allowed to update this user"));
  }

  const updateData = {};
  if (req.body.password) {
    if (req.body.password.length < 6) {
      return next(errorHandler(400, "Password must be at least 6 characters"));
    }
    const salt = await bcrypt.genSalt(10);
    updateData.password = await bcrypt.hash(req.body.password, salt);
  }
  if (req.body.username) {
    if (req.body.username.length < 6 || req.body.username.length > 20) {
      return next(
        errorHandler(400, "Username must be between 6 and 20 characters")
      );
    }
    if (req.body.username.includes(" ")) {
      return next(errorHandler(400, "Username cannot contain spaces"));
    }
    if (req.body.username !== req.body.username.toLowerCase()) {
      return next(errorHandler(400, "Username must be lowercase"));
    }
    updateData.username = req.body.username;
  }
  if (req.body.fullName) updateData.fullName = req.body.fullName;
  if (req.body.email) updateData.email = req.body.email;
  if (req.body.profilePicture)
    updateData.profilePicture = req.body.profilePicture;
  if (req.body.gender) updateData.gender = req.body.gender;

  try {
    const updatedUser = await User.findByPk(req.params.userId);
    if (!updatedUser) {
      return next(errorHandler(404, "User not found"));
    }
    await updatedUser.update(updateData);
    const { password, ...rest } = updatedUser.toJSON();
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id != req.params.userId) {
    return next(errorHandler(403, "You are not allowed to delete this user"));
  }
  try {
    const user = await User.findByPk(req.params.userId);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }
    await user.destroy();
    res.status(200).json("User has been deleted");
  } catch (error) {
    next(error);
  }
};