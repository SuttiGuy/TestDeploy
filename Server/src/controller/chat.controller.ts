import { Request, Response } from "express";
import ChatModel from "../model/chat.model";

export const createChat = async (req: Request, res: Response) => {
  const { userId, businessId } = req.body;

  try {
    const chat = new ChatModel({ userId, businessId });
    await chat.save();
    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ error: 'Error creating chat' });
  }
};

export const sendMessage = async (req: Request, res: Response) => {
  const { chatId, sender, content } = req.body;

  if (!chatId || !sender || !content) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const chat = await ChatModel.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    if (chat.isClosed) {
      chat.isClosed = false;
    }

    chat.messages.push({
      sender,
      content,
      timestamp: new Date(),
    });

    await chat.save();
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ error: 'Error sending message' });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  const { chatId } = req.query;

  if (!chatId) {
    return res.status(400).json({ message: "Chat ID is required" });
  }

  try {
    const chat = await ChatModel.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    res.status(200).json(chat.messages);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving messages' });
  }
};

export const assignAdminToChat = async (req: Request, res: Response) => {
  const { chatId, adminId } = req.body;

  try {
    const adminChats = await ChatModel.find({ adminId, isClosed: false });
    if (adminChats.length < 5) {
      const chat = await ChatModel.findByIdAndUpdate(chatId, { adminId }, { new: true });
      res.status(200).json(chat);
    } else {
      res.status(400).json({ message: 'Admin already has 5 active chats' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error assigning admin to chat' });
  }
};

export const closeChat = async (req: Request, res: Response) => {
  const { chatId } = req.body;

  try {
    const chat = await ChatModel.findByIdAndUpdate(chatId, { isClosed: true }, { new: true });
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ error: 'Error closing chat' });
  }
};

export const getChats = async (req: Request, res: Response) => {
  try {
    const chats = await ChatModel.find()
      .populate({
        path: "userId",
        select: "name image", // ระบุฟิลด์ที่ต้องการดึง
        strictPopulate: false
      })
      .populate({
        path: "businessId",
        select: "businessName image", // ระบุฟิลด์ที่ต้องการดึง
        strictPopulate: false
      })
      .populate({
        path: "adminId",
        select: "name image", // ระบุฟิลด์ที่ต้องการดึง
        strictPopulate: false
      });
    res.json(chats);
  } catch (error) {
    console.error("Error fetching chats:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
