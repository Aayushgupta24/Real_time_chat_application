import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCircle } from 'react-icons/fa';
import '../styles/UserList.css';

function UserList({ onSelectUser, selectedUserId, onlineUsers }) {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/users', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                // Filter out the current user
                const currentUserId = localStorage.getItem('userId');
                const filteredUsers = response.data.filter(user => user._id !== currentUserId);
                setUsers(filteredUsers);
            } catch (err) {
                setError('Failed to fetch users');
                console.error('Error fetching users:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (loading) return <div className="loading">Loading users...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="user-list">
            <h3>Direct Messages</h3>
            {users.map(user => (
                <div
                    key={user._id}
                    className={`user-item ${selectedUserId === user._id ? 'selected' : ''}`}
                    onClick={() => onSelectUser(user)}
                >
                    <FaCircle 
                        className={`status-indicator ${onlineUsers.has(user._id) ? 'online' : 'offline'}`} 
                    />
                    <span className="username">{user.username}</span>
                </div>
            ))}
        </div>
    );
}

export default UserList;

