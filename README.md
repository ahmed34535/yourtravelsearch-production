# YourTravelSearch - Professional Travel Booking Platform

Production-ready travel booking platform with live airline API integration and revenue optimization.

## Live Status
- Duffel API processing Frontier Airlines data (Las Vegas → JFK confirmed)
- Mobile-responsive React frontend with TypeScript
- Express backend with PostgreSQL database
- Revenue tracking for 8-18% commission margins

## Quick Deploy
```bash
npm install
npm run build
npm run start
```

## Environment Variables
```
DUFFEL_API_TOKEN=duffel_live_...
DATABASE_URL=postgresql://...
OPENAI_API_KEY=sk-...
```

## Architecture
- Frontend: React + TypeScript + Tailwind CSS
- Backend: Express.js + Drizzle ORM
- Database: PostgreSQL with travel booking schema
- APIs: Duffel (flights), custom hotel integration

Platform optimized from 140MB to 598K while preserving all functionality.