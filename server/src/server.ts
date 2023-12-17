import express from "express";
import cors from "cors";
import http from "http";
import { Server, type Socket } from "socket.io";

const app = express();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server);

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}`);
});
