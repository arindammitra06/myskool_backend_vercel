import { Request, Response } from "express";
import { prisma } from "../../../../../../shared/db-client";

export class ChatController {

public async createOrGetRoom(req: Request, res: Response) {
  try {
    console.log("createOrGetRoom called with body:", req.body);
    const chatTitle = req.body.chatTitle || "Chat Room";
    const senderId = Number(req.body.senderId);
    const recipientIds: number[] = req.body.recipientIds;

    const allUserIds = [senderId, ...recipientIds].sort();

    // Find existing room with same participants
    const rooms = await prisma.chatRoom.findMany({
      where: {
        participants: {
          every: {
            userId: { in: allUserIds },
          },
        },
      },
      include: { participants: true },
    });

    const exactRoom = rooms.find(
      r => r.participants.length === allUserIds.length
    );

    if (exactRoom) {
      return res.json({ status: true, data: exactRoom });
    }

    // Create new room
    const room = await prisma.chatRoom.create({
      data: {
        name: chatTitle,
        participants: {
          create: allUserIds.map(userId => ({ userId })),
        },
      },
      include: {
        participants: {
          include: {
            user: { select: { id: true, displayName: true, thumbnailUrl: true  } },
          },
        },
      },
    });

    return res.json({ status: true, data: room });
  } catch {
    return res.json({ status: false, message: "Failed to create chat room" });
  }
}

  // 1️⃣ Get all chat rooms for current user
  public async getMyChatRooms(req: Request, res: Response) {
    try {
      const userId = Number(req.params.userId); // assumes auth middleware
      console.log("getMyChatRooms called with userId:", userId);
      const rooms = await prisma.chatRoom.findMany({
        where: {
          participants: {
            some: { userId },
          },
        },
        include: {
          participants: {
            include: {
              user: {
                select: { id: true, displayName: true, thumbnailUrl: true },
              },
            },
          },
          messages: {
            orderBy: { createdAt: "desc" },
            take: 1, // last message preview
          },
        },
        orderBy: { createdAt: "desc" },
      });

      return res.json({ status: true, data: rooms });
    } catch (error) {
      return res.json({ status: false, message: "Failed to fetch chats" });
    }
  }

  // 2️⃣ Get messages of a room
  public async getRoomMessages(req: Request, res: Response) {
    try {
      const roomId = Number(req.params.roomId);

      const messages = await prisma.message.findMany({
        where: { roomId },
        include: {
          sender: { select: { id: true, displayName: true , thumbnailUrl: true} },
        },
        orderBy: { createdAt: "asc" },
      });
      console.log(messages)
      return res.json({ status: true, data: messages });
    } catch (error) {
      return res.json({ status: false, message: "Failed to fetch messages" });
    }
  }

  // 3️⃣ Send message
  public async sendMessage(req: Request, res: Response) {
    try {
      const userId = Number(req.params.userId);
      const roomId = Number(req.params.roomId);
      const { content } = req.body;
    
      const message = await prisma.message.create({
        data: {
          content,
          senderId: userId,
          roomId,
        },
        include: {
          sender: { select: { id: true, displayName: true , thumbnailUrl: true} },
        },
      });

      return res.json({ status: true, data: message });
    } catch (error) {
      return res.json({ status: false, message: "Failed to send message" });
    }
  }
}
