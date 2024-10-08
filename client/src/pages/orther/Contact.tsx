import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../AuthContext/auth.provider";
import { io, Socket } from "socket.io-client";

interface Message {
  sender: string;
  content: string;
  timestamp: string;
  _id: string;
}

interface Chat {
  _id: string;
  businessId?: {
    _id: string;
    businessName: string;
    image: string;
  };
  adminId?: {
    _id: string;
    name: string;
    image: string;
  };
  isClosed: boolean;
  messages: Message[];
}

const UserChat: React.FC = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }
  const { userInfo } = authContext;
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatId, setChatId] = useState<string>("");
  const [inputValue, setInputValue] = useState("");
  const sender = userInfo?.name || userInfo?.businessName || "User";
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const [userIsScrolling, setUserIsScrolling] = useState(false);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/help/messages?chatId=${chatId}`
      );
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
    }
  };

  const fetchChats = async () => {
    try {
      const response = await axios.get<Chat[]>(
        `http://localhost:3000/help/chats`
      );
      const filteredChats = response.data.filter((chat) => {
        return (
          chat.businessId?._id === userInfo?._id ||
          chat.adminId?._id === userInfo?._id
        );
      });
      if (filteredChats.length > 0) {
        setChatId(filteredChats[0]._id);
      } else {
        const id: { userId?: string; businessId?: string } = {};

        if (userInfo?.role === "user") {
          id.userId = userInfo._id;
        } else if (userInfo?.role === "business") {
          id.businessId = userInfo._id;
        }

        const createResponse = await axios.post(
          `http://localhost:3000/help/create`,
          id
        );
        setChatId(createResponse.data._id);
      }
    } catch (error) {
      console.error("Error fetching chat messages:", error);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    if (chatId !== "") {
      fetchMessages();
    }
  }, [chatId]);

  useEffect(() => {
    const socket: Socket = io("http://localhost:3000");
    socketRef.current = socket;
  
    console.log("Socket connected:", chatId);
  
    socket.emit("joinChat", chatId);
  
    socket.on("message", (newMessage: Message) => {
      console.log("Received new message:", newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });
  
    return () => {
      console.log("Socket disconnected");
      socket.disconnect();
    };
  }, [chatId]);
  
  useEffect(() => {
    if (!userIsScrolling && chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages, userIsScrolling]);

  const handleSendMessage = () => {
    if (inputValue.trim() === "") return;
  
    // ส่งข้อความผ่าน Socket.IO
    socketRef.current?.emit("sendMessage", {
      chatId,
      sender,
      content: inputValue,
    });
  
    // ล้างค่า input
    setInputValue("");
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        chatContainerRef.current;
      setUserIsScrolling(scrollTop + clientHeight < scrollHeight);
    }
  };

  return (
    <div className="flex flex-col h-[88vh] p-4 bg-gray-100">
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto mb-4 bg-white p-4 rounded-lg shadow-inner"
        onScroll={handleScroll}
      >
        {messages.length === 0 ? (
          <p className="text-center text-gray-500">No messages yet</p>
        ) : (
          messages.map((message) => {
            const isSender =
              message.sender === userInfo?.name ||
              message.sender === userInfo?.businessName;

            return (
              <div
                key={message._id}
                className={`flex ${
                  isSender ? "justify-end" : "justify-start"
                } mb-2`}
              >
                <div className="flex items-start space-x-2">
                  {!isSender && userInfo?.image && (
                    <img
                      src={userInfo.image}
                      alt="Profile"
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <div
                    className={`flex flex-col max-w-full ${
                      isSender ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`p-3 rounded-lg shadow-md ${
                        isSender
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-900"
                      }`}
                    >
                      <p className="break-words whitespace-pre-wrap max-w-[25ch]">
                        {message.content}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 w-20">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                  {isSender && userInfo?.image && (
                    <img
                      src={userInfo.image}
                      alt="Profile"
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
      <div className="flex items-center">
        <input
          type="text"
          className="flex-1 p-2 border border-gray-300 rounded-lg"
          placeholder="Type your message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={handleSendMessage}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default UserChat;
