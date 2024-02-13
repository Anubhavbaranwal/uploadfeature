import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json({ limit: "50kb" }));
app.use(express.urlencoded({ extended: true, limit: "50kb" }));
app.use(express.static("public"));
app.use(cookieParser());

///routing
import userRouter from "./routes/user.routes.js";
import imageRouter from "./routes/image.routes.js";

app.use("/api/user", userRouter);
app.use("/api/image", imageRouter);

export { app };
