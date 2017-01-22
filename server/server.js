import path from "path";
import http from "http";
import express from "express";
import socketIO from "socket.io";

import { generateMessage, generateLocationMessage } from "./utils/message";
import { isRealString } from "./utils/validation";
import { Users } from "./utils/users";

const publicPath = path.join(__dirname, "/../public");
const port = process.env.PORT || 3001;
let app = express();
let server = http.createServer(app);
let io = socketIO(server);
let users = new Users();

app.use(express.static(publicPath));

io.on("connection", (socket) => {
    socket.on("join", (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            return callback("Name and Room name are required.");
        }
        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);

        io.to(params.room).emit("updateUserList", users.getUserList(params.room));
        socket.emit("newMessage", generateMessage("Admin", "Welcome to the chat app"));
        socket.broadcast.to(params.room).emit("newMessage", generateMessage("Admin", `${params.name} has joined.`));
        callback();
    })

    socket.on("createMessage", (message) => {
        var user = users.getUser(socket.id);

        if (user && isRealString(message.text)) {
            io.to(user.room).emit("newMessage", generateMessage(user.name, message.text));
        }
    });

    socket.on("createLocationMessage", (coords) => {
        var user = users.getUser(socket.id);

        if (user) {
            io.to(user.room).emit("newLocationMessage", generateLocationMessage(user.name, coords.latitude, coords.longitude));
        }
    });

    socket.on("disconnect", () => {
        var user = users.removeUser(socket.id);

        if (user) {
            io.to(user.room).emit("updateUserList", users.getUserList(user.room));
            io.to(user.room).emit("newMessage", generateMessage("Admin", `${user.name} has left`));
        }
    });
});

server.listen(port, () => {
    console.log(`Server is up on port ${port}.`);
});