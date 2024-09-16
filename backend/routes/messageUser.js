import { sendMessage,getMessage } from '../routeController/messageController.js';
import express from 'express';
import IsLoggedIn from '../middleware/isLoggedIn.js';

const router = express.Router();

router.post("/send/:id".IsLoggedIn,sendMessage);
router.get("/:id".IsLoggedIn,getMessage);

export default router;