import path from "path";
import http from "http";
import express from "express";
import socketIO from "socket.io";

import { generateMessage } from "./utils/message";

const publicPath = path.join(__dirname, "/../public");
const port = process.env.PORT || 3001;
let app = express();
let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(publicPath));

io.on("connection", (socket) => {
    console.log("New User connected");

    socket.emit("newMessage", generateMessage("Admin", "Welcom to the chat app"));

    socket.broadcast.emit("newMessage", generateMessage("Admin", "New user joined!"));

    socket.on("createMessage", (message) => {
        console.log("createMessage", message);
        io.emit("newMessage", generateMessage(message.from, message.text));
    });

    socket.on("disconnect", () => {
        console.log("User was disconnected");
    });
});

server.listen(port, () => {
    console.log(`Server is up on port ${port}.`);
});