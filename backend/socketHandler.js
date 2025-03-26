const Message = require('./models/Message');
const User = require('./models/User');

const connectedUsers = new Map();

const socketHandler = (io) => {
    io.on('connection', async (socket) => {
        const userId = socket.handshake.auth.userId;
        
        // Update user status
        if (userId) {
            connectedUsers.set(userId, socket.id);
            await User.findByIdAndUpdate(userId, { isOnline: true });
            io.emit('userStatus', { userId, isOnline: true });
        }

        // Handle new messages
        socket.on('sendMessage', async (messageData) => {
            try {
                const { content, recipientId, channelId } = messageData;
                
                const message = new Message({
                    content,
                    sender: userId,
                    recipientId,
                    channelId
                });
                
                await message.save();

                // Emit to appropriate recipients
                if (channelId) {
                    io.emit('newMessage', message); // Broadcast to all in channel
                } else if (recipientId) {
                    const recipientSocketId = connectedUsers.get(recipientId);
                    if (recipientSocketId) {
                        io.to(recipientSocketId).emit('newMessage', message);
                    }
                    socket.emit('newMessage', message); // Send to sender
                }
            } catch (error) {
                socket.emit('error', 'Failed to send message');
            }
        });

        // Handle typing status
        socket.on('typing', (data) => {
            const { recipientId, channelId } = data;
            if (channelId) {
                socket.broadcast.emit('userTyping', { userId, channelId });
            } else if (recipientId) {
                const recipientSocketId = connectedUsers.get(recipientId);
                if (recipientSocketId) {
                    io.to(recipientSocketId).emit('userTyping', { userId });
                }
            }
        });

        // Handle disconnection
        socket.on('disconnect', async () => {
            if (userId) {
                connectedUsers.delete(userId);
                await User.findByIdAndUpdate(userId, { 
                    isOnline: false,
                    lastSeen: new Date()
                });
                io.emit('userStatus', { userId, isOnline: false });
            }
        });
    });
};

module.exports = socketHandler;