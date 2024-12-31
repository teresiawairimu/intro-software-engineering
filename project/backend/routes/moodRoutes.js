import express from 'express';
import {
  createMood,
  retrieveMood
} from '../controllers/moodController.js';
import authenticateUser  from '../middleware/authenticateUsers.js';
const router = express.Router();

router.post('/', authenticateUser, createMood);
router.get('/', authenticateUser, retrieveMood);

export default router;