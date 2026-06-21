const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// serve frontend
app.use(express.static("public"));

const users = {};

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // user joins
    socket.on("join", (username) => {
        users[socket.id] = username;

        io.emit("chat message", {
            user: "System",
            text: `${username} joined the chat`
        });
    });

    // message
   socket.on("chat message", (msg) => {
    const username = users[socket.id] || "Anonymous";

    // send user's message to everyone
    io.emit("chat message", {
        user: username,
        text: msg
    });

    // send bot reply ONLY to sender
    setTimeout(() => {
        socket.emit("chat message", {
            user: "Bot",
            text: "Reply to: " + msg
        });
    }, 1000);
});

    // typing
    socket.on("typing", () => {
        socket.broadcast.emit("typing", users[socket.id]);
    });

    // disconnect
    socket.on("disconnect", () => {
        const username = users[socket.id];

        if (username) {
            io.emit("chat message", {
                user: "System",
                text: `${username} left the chat`
            });

            delete users[socket.id];
        }
    });
});

server.listen(3000, () => {
    console.log("🚀 Server running on http://localhost:3000");
});