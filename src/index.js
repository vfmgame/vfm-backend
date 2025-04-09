const loaders = require("./loaders");
const express = require("express");
const http = require("http");
const SocketService = require("./services/SocketService");
const { Server } = require("socket.io");
const app = express();


async function startServer() {
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST", "PUT"]
    }
  })
  await loaders(app);
    
  const onConnection = (socket) => {
    SocketService(io, socket);
  }
  
  io.on("connection", onConnection);

  module.exports.io = io;
  
  const port = process.env.PORT || 4000

  server.listen(port, err => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(`Your server is ready ! at PORT ${port}`)
  });
}



startServer();