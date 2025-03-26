# Real-Time Chat Application

## Technical Overview

A scalable real-time chat application implementing WebSocket protocol through Socket.IO, with Redis pub/sub for message broadcasting and data persistence. The application follows a microservices architecture pattern with separate frontend and backend services.

## Architecture Components

### Frontend Architecture
- **Framework**: React.js with functional components
- **State Management**: React Context API + Custom Hooks
- **Real-time Communication**: Socket.IO client
- **Key Libraries**:
  - `socket.io-client`: WebSocket client implementation
  - `react`: UI component library
  - `bcryptjs`: Client-side password hashing

### Backend Architecture
- **Runtime**: Node.js
- **API Layer**: Express.js
- **WebSocket Server**: Socket.IO
- **Data Storage**: Redis
  - Uses Redis Pub/Sub for message broadcasting
  - Implements Redis Bloom for user presence detection
  - Utilizes Redis Search for message history queries

## Implementation Details

### Authentication Flow
- JWT-based authentication
- Token refresh mechanism
- Session management through Redis
- Secure password hashing using bcrypt

### Real-time Communication
- Bidirectional WebSocket connections
- Event-based message handling
- Implemented reconnection strategy
- Room-based chat segregation

### Data Models

#### User Schema

{
  userId: string;
  username: string;
  passwordHash: string;
  lastSeen: timestamp;
  status: 'online' | 'offline';
}
```

#### Message Schema
```typescript
{
  messageId: string;
  senderId: string;
  roomId: string;
  content: string;
  timestamp: number;
  type: 'text' | 'media';
}
```

### API Endpoints

#### Authentication
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`



## Development Setup

### Prerequisites
- Node.js v14+
- Redis 6.2+ with RedisJSON and RediSearch modules
- npm or yarn

### Environment Configuration

```env
# Backend Configuration
NODE_ENV=development
PORT=5000
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret

# Frontend Configuration
REACT_APP_API_URL=http://localhost:5000
REACT_APP_WS_URL=ws://localhost:5000
```

### Development Commands

```bash
# Backend
npm run dev     # Start development server
npm run test    # Run test suite
npm run lint    # Run ESLint

# Frontend
npm start       # Start development server
npm run build   # Create production build
npm run test    # Run test suite
```



## Future Improvements
- [ ] Implement file sharing
- [ ] Add end-to-end encryption
- [ ] Implement user presence detection
- [ ] Add message reactions
- [ ] Implement message threading
