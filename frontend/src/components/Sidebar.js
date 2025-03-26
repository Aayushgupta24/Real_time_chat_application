import React, { useState } from 'react';
import { FaHashtag, FaChevronDown, FaPlus, FaCircle, FaUserFriends } from 'react-icons/fa';
import '../styles/Sidebar.css';

function Sidebar({ 
    channels, 
    directMessages, 
    activeChannel, 
    onChannelSelect, 
    onDirectMessageSelect,
    currentUser,
    onlineUsers 
}) {
    const [showChannels, setShowChannels] = useState(true);
    const [showDirectMessages, setShowDirectMessages] = useState(true);

    return (
        <div className="sidebar">
            <div className="workspace-header">
                <h1 className="workspace-title">Workspace Name</h1>
                <div className="user-status">
                    <FaCircle className="status-indicator online" />
                    <span>{currentUser.username}</span>
                </div>
            </div>

            <div className="sidebar-content">
                <div className="channels-section">
                    <div className="section-header" onClick={() => setShowChannels(!showChannels)}>
                        <div className="header-title">
                            <FaChevronDown className={`chevron ${!showChannels ? 'collapsed' : ''}`} />
                            <span>Channels</span>
                        </div>
                        <button className="add-button" title="Add Channel">
                            <FaPlus />
                        </button>
                    </div>
                    
                    {showChannels && (
                        <div className="channel-list">
                            {channels.map(channel => (
                                <div
                                    key={channel._id}
                                    className={`channel-item ${activeChannel === channel._id ? 'active' : ''}`}
                                    onClick={() => onChannelSelect(channel._id)}
                                >
                                    <FaHashtag className="channel-icon" />
                                    <span className="channel-name">{channel.name}</span>
                                    {channel.unreadCount > 0 && (
                                        <span className="unread-count">{channel.unreadCount}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="dm-section">
                    <div className="section-header" onClick={() => setShowDirectMessages(!showDirectMessages)}>
                        <div className="header-title">
                            <FaChevronDown className={`chevron ${!showDirectMessages ? 'collapsed' : ''}`} />
                            <span>Direct Messages</span>
                        </div>
                        <button className="add-button" title="Start Direct Message">
                            <FaPlus />
                        </button>
                    </div>

                    {showDirectMessages && (
                        <div className="dm-list">
                            {directMessages.map(user => (
                                <div
                                    key={user._id}
                                    className={`dm-item ${activeChannel === user._id ? 'active' : ''}`}
                                    onClick={() => onDirectMessageSelect(user._id)}
                                >
                                    <div className="user-avatar">
                                        <FaUserFriends />
                                        <FaCircle className={`status-indicator ${onlineUsers.has(user._id) ? 'online' : 'offline'}`} />
                                    </div>
                                    <span className="user-name">{user.username}</span>
                                    {user.unreadCount > 0 && (
                                        <span className="unread-count">{user.unreadCount}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
