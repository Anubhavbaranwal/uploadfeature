import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  refreshtoken: {
    type: String,
  },
});

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});
UserSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};
UserSchema.methods.generateAccessToken = function () {
  console.log(process.env.Access_Token_Secret);
  return Jwt.sign(
    {
      _id: this._id,
      username: this.username,
      email: this.email,
    },
    process.env.Access_Token_Secret,
    {
      expiresIn: process.env.Access_Token_EXPIRES_IN,
    }
  );
};
UserSchema.methods.generateRefreshToken = function () {
  return Jwt.sign(
    {
      _id: this._id,
    },
    process.env.Refresh_Token_Secret,
    {
      expiresIn: process.env.Refresh_Token_EXPIRES_IN,
    }
  );
};
export const User = mongoose.model("User", UserSchema);
