import { Router } from "express";
import { ChatController } from "../controllers/general/chat.controller";

const ChatRouter = Router();
const controller = new ChatController();

ChatRouter.get("/rooms/:userId", controller.getMyChatRooms);
ChatRouter.get("/rooms/:roomId/messages", controller.getRoomMessages);
ChatRouter.post("/rooms/:roomId/:userId/messages", controller.sendMessage);
ChatRouter.post("/rooms", controller.createOrGetRoom);
export default ChatRouter;
