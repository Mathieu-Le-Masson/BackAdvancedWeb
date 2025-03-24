import express from "express";
import * as userController from "../controllers/userController";
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.use(authenticate);

router.get("/", userController.getUsers);
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);
router.get("/:id/referrals", userController.getReferrals);

export default router;
