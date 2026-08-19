# Dharti Mitr AI

A full-stack, mobile-first agricultural assistant based on the supplied Dharti Mitr AI specification.

## Stack
- Frontend: React + TypeScript + Vite + Tailwind CSS
- Backend: Node.js + Express + TypeScript
- Database/Auth: Supabase PostgreSQL + Auth
- Demo services: weather, market, schemes, crop diagnosis, AI chat
- Browser APIs: Speech Recognition + Speech Synthesis + Geolocation

## Important authentication note
The requested "username/mobile + password with no OTP/email verification" is implemented using Supabase email/password authentication internally. The UI asks for a mobile number/username, but Supabase's standard password auth needs an email-style identity unless you build a custom auth provider. For a production deployment, either:
1. use Supabase phone auth with OTP, or
2. create a custom username/mobile authentication service.

This starter keeps the demo easy to run and does not require email confirmation when configured appropriately in Supabase.

## 1. Install
```bash
cd frontend && npm install
cd ../backend && npm install
```

## 2. Configure
Copy:
- `frontend/.env.example` -> `frontend/.env`
- `backend/.env.example` -> `backend/.env`

Set your Supabase URL and anon key in both.

## 3. Database
Open Supabase SQL Editor and run:
`supabase/schema.sql`

Then create/configure your Supabase project.

## 4. Run
Terminal 1:
```bash
cd backend
npm run dev
```

Terminal 2:
```bash
cd frontend
npm run dev
```

Open the Vite URL shown in the terminal.

## 5. Production API integrations
The backend has clean service boundaries for:
- AI provider
- weather API
- mandi/market API
- image/crop disease model
- government scheme data
- maps/nearby shops

Demo data is clearly marked so it is not falsely presented as live data.
