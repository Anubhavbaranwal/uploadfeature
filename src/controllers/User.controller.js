import { User } from "../models/User.model.js";
import { asynchandling } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/APIResponse.js";

const generateAccessandRefreshToken = async (id) => {
  try {
    const users = await User.findById(id);
    console.log(process.env.Access_Token_Secret);
    console.log(users);
    const accesstoken = await users.generateAccessToken();
    const refreshtoken = await users.generateRefreshToken();
    users.refreshtoken = refreshtoken;
    await users.save({ validateBeforeSave: false });
    return { accesstoken, refreshtoken };
  } catch (error) {
    throw new ApiError(500, "Error generating token");
  }
};

const RegisterUser = asynchandling(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    throw new ApiError(400, "Please fill all fields");
  }
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new ApiError(400, "User already exists");
  }
  const user = await User.create({
    username,
    email,
    password,
  });

  const newUser = await User.findById(user._id).select(
    "-password -refreshtoken "
  );
  if (!newUser) {
    throw new ApiError(500, "Error creating user");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, newUser, "User created successfully"));
});

const Loginuser = asynchandling(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, "Please fill all fields");
  }
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid password");
  }
  const { accesstoken, refreshtoken } = await generateAccessandRefreshToken(
    user._id
  );

  const loggeinUser = await User.findById(user._id).select(
    "-password -refreshtoken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accesstoken, options)
    .cookie("refreshToken", refreshtoken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggeinUser, accesstoken, refreshtoken },
        "User logged in successfully"
      )
    );
});

export { RegisterUser, Loginuser };
