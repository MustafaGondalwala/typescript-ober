import { Router } from "express";
import { UserController } from "./controllers/user.controller";

const router = Router();
const userController = new UserController();

router.post("/signup", userController.signup.bind(userController));
router.post("/login", userController.login.bind(userController));

export default router;
