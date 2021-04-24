const http = require('http');
const server = http.createServer();

const connectedSockets = [];

const io = require('socket.io')(server, {
  cors:{
    origin: "*",
    method: "*"
  }
});

io.on('connection', (socket)=>{
  socket.on('socketConnected', ()=>{
    socket.broadcast.emit('broadcastedSockets', connectedSockets);
  });
  socket.emit('allSockets', connectedSockets);
  connectedSockets.push(socket.id)
  socket.on('disconnect',()=>{
    let index = connectedSockets.indexOf(socket.id);
    connectedSockets.splice(index, 1);
    socket.broadcast.emit('allSocketsAfterRemoval', connectedSockets,socket.id);
  });
  console.log('new connection', socket.id);
  socket.on('broadcastNewMessage', (data)=>{
    socket.broadcast.emit('messageToAll', data);
  });
  socket.on('sendToUser', (data)=>{
    io.to(data.user).emit("newSpecificMessage", data.newMessage);
  });

  socket.on('subscribeToRoom', (room)=>{
    socket.join(room);
  });
  socket.on("messageToRoom", (data) => {
    socket.to(data.group).emit("newSpecificGroupMessage", data.newMessage);
  });
})

server.listen(3000, ()=>{
  console.log('server is listening on port 3000 ');
})