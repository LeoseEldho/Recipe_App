import express from 'express';
import { userRegister, userLogin, getUser } from '../Controller/UserController.js';

const router = express.Router();

router.post("/register", userRegister);
router.post("/login", userLogin);
router.post("/userdata", getUser);

export default router;