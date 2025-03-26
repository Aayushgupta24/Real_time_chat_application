import React, { useState, useEffect } from 'react';
import UserList from './UserList';
import ChatWindow from './ChatWindow';
import '../styles/ChatLayout.css';
import axios from 'axios';

function ChatLayout() {
    const [selectedUser, setSelectedUser] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [onlineUsers] = useState(new Set()); // This will be updated with socket.io later

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/auth/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCurrentUser(response.data);
            } catch (error) {
                console.error('Failed to fetch current user:', error);
            }
        };

        fetchCurrentUser();
    }, []);

    const handleUserSelect = (user) => {
        setSelectedUser(user);
    };

    if (!currentUser) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="chat-layout">
            <div className="sidebar">
                <div className="current-user-info">
                    <img 
                        src={`https://via.placeholder.com/40`} 
                        alt="Profile" 
                        className="profile-image"
                    />
                    <span>{currentUser.username}</span>
                </div>
                <UserList 
                    onSelectUser={handleUserSelect}
                    selectedUserId={selectedUser?._id}
                    onlineUsers={onlineUsers}
                />
            </div>
            <div className="chat-area">
                {selectedUser ? (
                    <ChatWindow
                        currentUser={currentUser}
                        selectedUser={selectedUser}
                    />
                ) : (
                    <div className="no-chat-selected">
                        <h2>Select a user to start chatting</h2>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ChatLayout;



