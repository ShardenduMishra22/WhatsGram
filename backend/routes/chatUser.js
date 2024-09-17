import { getCurrentChatters,getUsersBySeach } from "../routeController/chatController.js";
import IsLoggedIn from "../middleware/isLoggedIn.js"
import express from "express";

const router = express.Router();

router.get("/search",IsLoggedIn,getUsersBySeach);
router.get("/currentChatters",IsLoggedIn,getCurrentChatters);

export default router;