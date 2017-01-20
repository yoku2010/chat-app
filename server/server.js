import path from "path";
import http from "http";
import express from "express";
import socketIO from "socket.io";

const publicPath = path.join(__dirname, "/../public");
const port = process.env.PORT || 3001;
let app = express();
let server = http.createServer(app);
let io = socketIO(server);

io.on("connection", (socket) => {
    console.log("New User connected");
    socket.on("disconnect", () => {
        console.log("User was disconnected");
    });
});

app.use(express.static(publicPath));

server.listen(port, () => {
    console.log(`Server is up on port ${port}.`);
});