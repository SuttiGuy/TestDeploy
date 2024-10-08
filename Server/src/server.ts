import express, { Request, Response } from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import packgeRouter from "./routes/package.router";
import homeStayRouter from "./routes/homestay.router";
import bookingRouter from "./routes/booking.router";
import userRouter from "./routes/user.router";
import chatRouter from "./routes/chat.router";
import payment from "./routes/payment.router";
import review from "./routes/review.router";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import ChatModel from "./model/chat.model";

dotenv.config();

// Swagger definition
const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "H2O API Project",
    version: "1.0.0",
    description: "This is a REST API application made with Express.",
    license: {
      name: "Licensed Under MIT",
      url: "https://spdx.org/licenses/MIT.html",
    },
    contact: {
      name: "H2O Project",
      url: "http://47.128.233.168:3001",
    },
  },
  externalDocs: {
    description: "Download Swagger.json",
    url: "/swagger.json",
  },
  servers: [
    {
      url: "http://47.128.233.168:3001",
      description: "Development server",
    },
  ],
  security: [
    {
      BearerAuth: [],
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "apiKey",
        name: "Authorization",
        in: "header",
        description: 'Example enter token "Bearer eyJhbGciO...."',
      },
    },
  },
};

// Swagger options
const options = {
  swaggerDefinition,
  apis: ["src/routes/*.ts"], // Adjust this if the paths to the routes change
};

// Generate Swagger specification
const swaggerSpec = swaggerJSDoc(options);

// Create Express app
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://47.128.233.168:3001",
    methods: ["GET", "POST"],
  },
});

// Middleware setup

app.use(
  cors({
    credentials: true,
    origin: "http://47.128.233.168:5174/",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// MongoDB connection

const MONGODB_URL = process.env.MONGODB_URL || "";

mongoose
  .connect(MONGODB_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB", error);
  });
if (process.env.NODE_ENV === "development") {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get("/swagger.json", (req: Request, res: Response) => {
    res.header("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
} else if (process.env.NODE_ENV !== "production") {
  app.get("/docs", (req: Request, res: Response) => {
    res.send("<h1>production</h1>");
  });
}
// Swagger setup

// Routes
app.use("/", packgeRouter);
app.use("/", homeStayRouter);
app.use("/", bookingRouter);
app.use("/help", chatRouter);
app.use("/user", userRouter);
app.use("/", payment);
app.use("/review", review);

app.get("/", (req: Request, res: Response) => {
  res.send("<h1>Welcome to H2O Project</h1>");
});

// Socket.IO setup
io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("joinChat", (chatId) => {
    socket.join(chatId);
    console.log(`Client joined chat: ${chatId}`);
  });

  socket.on("sendMessage", async ({ chatId, sender, content }) => {
    const timestamp = new Date();
    try {
      const chat = await ChatModel.findById(chatId);
      if (chat) {
        chat.messages.push({ sender, content, timestamp });
        await chat.save();
        // ส่งข้อความใหม่ไปยังห้องที่เกี่ยวข้อง
        io.to(chatId).emit("message", { sender, content, timestamp });
      }
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
