import { RegisterUser, Loginuser } from "../controllers/User.controller.js";
import { Router } from "express";

const router = Router();

router.post("/register", RegisterUser);
router.post("/Login", Loginuser);

export default router;
