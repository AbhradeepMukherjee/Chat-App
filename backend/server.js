const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const cors = require("cors");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middlewares/errorMiddlewares");

dotenv.config();
connectDB();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT;

const server = app.listen(
    PORT,
    console.log(`Server running on PORT ${PORT}`)
);

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5173"
  }
});

io.on("connection", (socket)=>{
  console.log("connected to socket.io");
  socket.on("setup", (userData)=>{
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room)=>{
    socket.join(room);
    console.log("User: "+ socket.id +" Joined Room: "+room);
  });

  socket.on('typing', (room)=> socket.in(room).emit("typing"));
  socket.on("stop typing", (room)=> socket.in(room).emit("stop typing"));


  socket.on("new message", (newMessageReceived)=>{
    var {chat} = newMessageReceived;
    if(!chat.users) return console.log("chat.users is not defined");


    chat.users.forEach(user=>{
      if(user._id === newMessageReceived.sender._id){
        return;
      }
      socket.in(user._id).emit("message received", newMessageReceived);
    })
  });

  socket.off("setup", ()=>{
    console.log("User Disconnected");
    socket.leave(userData._id);
  })
});