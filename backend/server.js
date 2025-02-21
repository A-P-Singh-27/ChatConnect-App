const path = require('path');
const express = require('express');
const chats = require('./data/data');
const cors = require('cors');
const app = express();
const dbconnect = require('./config/database');
const userRoutes = require('./Routes/userRoutes');
const chatRoutes = require('./Routes/chatRoutes');
const messageRoutes = require('./Routes/messageRoutes');
const cloudinary = require('./config/cloudinary');
const fileUpload = require('express-fileupload');
require('dotenv').config();
PORT = process.env.PORT || 3000;

dbconnect.connect();
cloudinary.cloudinaryConnect();

app.use(express.json())
app.use(cors());
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: '/tmp/',
    })
);


app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// ==========Deployement===================

const __dirname1 = path.resolve();
// console.log(__dirname1);

if (process.env.NODE_ENV === 'production') {

    app.use(express.static(path.join(__dirname1, '/frontend/dist')));
    app.get('*' , (req,res)=>{
        res.sendFile(path.resolve(__dirname1, 'frontend','dist','index.html'));
    });
} else {
    app.get('/', (req, res) => {
        res.send('API is running');
    })
}

// ==========Deployement===================

const server = app.listen(PORT, () => {
    console.log(`Server started at ${PORT}`);

});

const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
      origin: "https://chatconnect-app.onrender.com",
      // credentials: true,
    },
  });

io.on("connection", (socket) => {
    console.log("Connected to socket.io");

    socket.on("setup", (userData) => {
        socket.join(userData.id);
        socket.emit("connected");
    });

    socket.on("join chat", (room) => {
        socket.join(room);
        console.log('user joined room: ', room);
    });

    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.on("new message", (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;

        if (!chat.users) return console.log("chat.users not defined");

        chat.users.forEach((user) => {
            if (user._id == newMessageRecieved.sender._id) return;

            socket.in(user._id).emit("message recieved", newMessageRecieved);
        });
    });

    socket.off("setup", () => {
        console.log("user Disconnected");
        socket.leave(userData.id);

    })

});