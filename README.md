# ARIA — AI Voice Interview Platform

A voice-first AI mock interview platform. Pick a role, talk to ARIA, get a detailed scored feedback report.

## Stack

**Frontend:** React 18 + Vite + TypeScript + TailwindCSS + Framer Motion + Three.js + Vapi  
**Backend:** Node 20 + Express + TypeScript + MongoDB + JWT auth

## Quick start

```bash
# Install all deps
npm run install:all

# Copy env files
cp server/.env.example server/.env
cp client/.env.example client/.env

# Fill in your values in both .env files, then:
npm run dev
```

## Environment variables

### Server (`server/.env`)
| Key | Description |
|-----|-------------|
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | 64-char hex secret for access tokens |
| `JWT_REFRESH_SECRET` | 64-char hex secret for refresh tokens |
| `VAPI_PRIVATE_KEY` | Vapi private key |
| `VAPI_PUBLIC_KEY` | Vapi public key |
| `OPENROUTER_KEY` | OpenRouter API key (GPT-4o-mini for feedback) |
| `CLIENT_URL` | Frontend URL (for CORS) |

### Client (`client/.env`)
| Key | Description |
|-----|-------------|
| `VITE_API_URL` | Backend API URL |
| `VITE_VAPI_PUBLIC_KEY` | Vapi public key |

## After deploy

1. Add the deployed client URL to Vapi's allowed origins.
2. Set the deployed server URL as the Vapi webhook URL in the dashboard.
3. Whitelist Render's outbound IPs in MongoDB Atlas (or use `0.0.0.0/0`).
