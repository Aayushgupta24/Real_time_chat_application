module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);

        socket.on('sendMessage', (message) => {
            io.emit('receiveMessage', message);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });
};
