import express from 'express';
import {
  createUser
} from '../controllers/userController.js';
import authenticateUser  from '../middleware/authenticateUsers.js';
const router = express.Router();

router.post('/', authenticateUser, createUser);

export default router;
