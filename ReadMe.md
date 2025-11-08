# Cloud Chat AI — MERN Full‑Stack Project

A full‑stack MERN (MongoDB, Express, React, Node.js) chat application with AI-powered responses and cloud deployment support. Designed for development, testing, and as a base for production-ready chat products that integrate an LLM provider for automated replies.

## Key features
- Real-time chat with WebSocket (Socket.IO)
- AI-driven assistant integration (e.g., OpenAI or another provider)
- User authentication (JWT)
- Persistent chat history in MongoDB
- Responsive React frontend (create-react-app or Vite)
- Dockerfile and deployment scripts for cloud providers
- Environment-based configuration for local and production

## Tech stack
- Frontend: React, React Router, Tailwind/CSS (adjustable)
- Backend: Node.js, Express, Socket.IO
- Database: MongoDB (Atlas or local)
- Authentication: JWT
- AI: OpenAI-compatible API (or pluggable provider)
- Dev tools: Prettier, ESLint, nodemon
- Optional: Docker, GitHub Actions

## Repository layout
- /client — React app
- /server — Express API, Socket.IO, integration with AI provider
- /docker — Docker compose / Dockerfiles
- /scripts — helper scripts (migrations, seed)
- README.md — this file

## Quick start (local development)

Prerequisites
- Node.js 18+
- npm or yarn
- MongoDB (local or Atlas)
- An API key for your chosen AI provider (e.g., OPENAI_API_KEY)

1. Clone
  git clone <repo-url>
  cd <repo-root>

2. Install
  - Backend:
    cd server
    npm install
  - Frontend:
    cd ../client
    npm install

3. Create environment files
  - server/.env
    PORT=5000
    MONGO_URI=<your-mongodb-uri>
    JWT_SECRET=<strong-jwt-secret>
    OPENAI_API_KEY=<your-openai-key>       # or PROVIDER_API_KEY
    AI_MODEL=gpt-4                          # optional model name
    CORS_ORIGIN=http://localhost:3000

  - client/.env
    REACT_APP_API_URL=http://localhost:5000
    REACT_APP_AI_PROVIDER=openai

  Note: Never commit secrets to git. Use a secret manager for production.

4. Run in development
  - Start backend:
    cd server
    npm run dev     # nodemon
  - Start frontend:
    cd ../client
    npm start

Open http://localhost:3000

## Scripts (examples)
- server:
  - npm run dev — start server with nodemon
  - npm start — start production server
  - npm test — run backend tests
- client:
  - npm start — start dev server
  - npm run build — build production bundle
  - npm test — run frontend tests

## API overview (examples)
- POST /api/auth/register — register new user
  - body: { name, email, password }
- POST /api/auth/login — returns JWT
  - body: { email, password }
- GET /api/users/me — protected user info (Authorization: Bearer <token>)
- GET /api/chats — list user chats
- POST /api/chats — create chat or message; triggers AI response
  - body: { chatId?, message }
- WebSocket namespace /chat — real-time message exchange and typing indicators

Example: send message and get AI reply
- Client emits socket event: send_message { chatId, text, userId }
- Server forwards message to AI provider and emits ai_response to clients

## AI integration guidelines
- Keep provider calls server-side (do not expose API key in frontend)
- Throttle or batch requests as needed to control costs
- Store prompts, responses, and metadata for auditing and improvement
- Support pluggable provider interface for swapping LLMs

## Database & data model (high-level)
- Users: { _id, name, email, passwordHash, createdAt }
- Chats: { _id, title, members, createdAt }
- Messages: { _id, chatId, senderId, text, role (user/assistant), metadata, createdAt }

## Environment & security
- Use HTTPS and set secure cookies in production
- Use strong JWT secrets and short expirations
- Sanitize and validate user input server-side
- Monitor AI usage and set rate limits and quotas

## Docker & deployment
- Provided Dockerfile (server and client) and docker-compose.yml sample
- Deploy backend to: Heroku, AWS ECS, Google Cloud Run, Azure App Service
- Deploy frontend to: Vercel, Netlify, or static host behind CDN
- Use CI (GitHub Actions) to build, test, and push images

Minimal Docker usage
- Build:
  docker-compose build
- Run:
  docker-compose up

## Testing
- Unit tests for backend routes and AI integration mock
- Frontend component tests (Jest + React Testing Library)
- End-to-end tests (Cypress) for critical flows (auth, send message)

## Contributing
- Fork, create feature branch, open PR
- Follow code style (Prettier + ESLint)
- Add tests for new functionality
- Keep changes atomic and document breaking changes

## Troubleshooting
- Common issues:
  - CORS errors — ensure CORS_ORIGIN matches frontend origin
  - Invalid API key — check provider key and usage limits
  - Socket.io connection issues — confirm matching client/server versions and correct URL

## License
This project is provided under the MIT License. See LICENSE file for details.

## Contact
Create an issue or PR in this repository for questions, feature requests, or bug reports.

Enjoy building and extending Cloud Chat AI!