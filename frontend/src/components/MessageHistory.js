import React from 'react';

function MessageHistory({ messages, currentUsername, messagesEndRef }) {
    const groupMessagesByDate = (messages) => {
        const groups = {};
        messages.forEach(msg => {
            const date = new Date(msg.timestamp).toLocaleDateString();
            if (!groups[date]) groups[date] = [];
            groups[date].push(msg);
        });
        return groups;
    };

    const messageGroups = groupMessagesByDate(messages);

    return (
        <div className="messages-container">
            {Object.entries(messageGroups).map(([date, msgs]) => (
                <div key={date} className="message-group">
                    <div className="date-divider">
                        <span>{date}</span>
                    </div>
                    {msgs.map((msg, i) => {
                        const isCurrentUser = msg.sender === currentUsername;
                        const time = new Date(msg.timestamp).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                        });
                        
                        return (
                            <div 
                                key={msg._id || i} 
                                className={`message ${isCurrentUser ? 'sent' : 'received'}`}
                            >
                                {!isCurrentUser && (
                                    <div className="message-sender">
                                        <div className="sender-avatar">
                                            {msg.sender.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="sender-name">{msg.sender}</span>
                                    </div>
                                )}
                                <div className="message-content">
                                    <div className="message-bubble">
                                        {msg.content}
                                    </div>
                                    <span className="timestamp">{time}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>
    );
}

export default MessageHistory;

