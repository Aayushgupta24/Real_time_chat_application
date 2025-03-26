import { useState, useEffect, useRef } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import '../styles/ChatWindow.css';

function ChatWindow({ currentUser, selectedUser }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (!selectedUser?._id) return; // Add this check
        setMessages([]); 
        scrollToBottom();
    }, [selectedUser?._id]); // Update dependency

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const message = {
            _id: Date.now(),
            content: newMessage,
            sender: currentUser._id,
            receiver: selectedUser._id,
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, message]);
        setNewMessage('');
        scrollToBottom();
    };

    return (
        <div className="chat-window">
            {selectedUser ? (
                <>
                    <div className="chat-header">
                        <img 
                            src={`https://via.placeholder.com/40`} 
                            alt={selectedUser.username} 
                            className="profile-image"
                        />
                        <span className="username">{selectedUser.username}</span>
                    </div>
                    
                    <div className="messages-container">
                        {messages.map(message => (
                            <div 
                                key={message._id}
                                className={`message ${message.sender === currentUser._id ? 'sent' : 'received'}`}
                            >
                                <div className="message-content">
                                    {message.content}
                                    <span className="timestamp">
                                        {new Date(message.timestamp).toLocaleTimeString()}
                                    </span>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSubmit} className="message-input-form">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="message-input"
                        />
                        <button type="submit" className="send-button">
                            <FaPaperPlane />
                        </button>
                    </form>
                </>
            ) : (
                <div className="no-chat-selected">
                    <h2>Please select a user to start chatting</h2>
                </div>
            )}
        </div>
    );
}

export default ChatWindow;
