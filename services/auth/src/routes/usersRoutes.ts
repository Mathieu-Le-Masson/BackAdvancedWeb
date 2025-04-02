import express from 'express';
import * as userController from '../controllers/userController';

const router = express.Router();

router.get("/", userController.getUsers);
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);
router.get("/:id/referrals", userController.getReferrals);
router.put("/:id/deactivate", userController.deactivateUser);

export default router;