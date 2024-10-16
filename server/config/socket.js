const socketIo = require('socket.io');

const setupSocket = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  let activeUsers = 0;

  io.on('connection', (socket) => {
    activeUsers++;
    io.emit('userCount', activeUsers);

    console.log('a user connected');

    socket.on('join', (userId) => {
      socket.join(userId);
    });

    socket.on('sendMessage', (msg) => {
      const { userId, isOperator } = msg;
      if (isOperator) {
        io.to(userId).emit('newMessage', msg);
      } else {
        io.to(userId).emit('newMessage', msg);
        io.emit('newMessageToOperator', msg);
      }
    });

    socket.on('operatorTyping', (userId) => {
      io.to(userId).emit('operatorTyping');
    });

    socket.on('operatorStoppedTyping', (userId) => {
      io.to(userId).emit('operatorStoppedTyping');
    });

    socket.on('disconnect', () => {
      activeUsers--;
      io.emit('userCount', activeUsers);
      console.log('user disconnected');
    });
  });
};

module.exports = setupSocket;