import { Router } from "express";
import { chatControllerInstance } from "../controllers/index.js";
const ChatRouter = Router();

ChatRouter.get("/rooms/:userId", chatControllerInstance.getMyChatRooms);
ChatRouter.get("/rooms/:roomId/messages", chatControllerInstance.getRoomMessages);
ChatRouter.post("/rooms/:roomId/:userId/messages", chatControllerInstance.sendMessage);
ChatRouter.post("/rooms", chatControllerInstance.createOrGetRoom);
export default ChatRouter;
