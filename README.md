# New Age Fitness — Website + Backend

## What's inside
- `public/index.html` — the gym website (frontend)
- `public/admin.html` — admin dashboard to view sign-ups & messages
- `server.js` — Node.js/Express backend + simple database
- `data.json` — auto-created; stores all sign-ups and messages

## Run it locally
1. Install [Node.js](https://nodejs.org) if you don't have it.
2. Open a terminal in this folder and run:
   ```
   npm install
   npm start
   ```
3. Open **http://localhost:3000** — that's your live website.
4. Open **http://localhost:3000/admin.html** and enter the admin key
   `newage2026` to see membership sign-ups and contact messages.

   ⚠️ Change the admin key before going live — edit `ADMIN_KEY` in
   `server.js`, or set it as an environment variable.

## How the "buy membership" flow works right now
When someone submits the Join form, their details are saved with
status `pending_payment`. No real money moves yet — this is meant so
your team can follow up (call / WhatsApp / UPI / card machine) to
collect payment, which is how most small gyms already operate.

## Adding real online payments
To accept actual card/UPI payments on the site, you'll need a payment
gateway account:
- **Razorpay** (India) or **Stripe** (international) are the easiest.
- Once you have API keys, the hook is already marked in `server.js`
  inside `POST /api/signup` — that's where an order gets created and
  a checkout screen shown to the customer.
- Tell me your gateway and I can wire in the actual checkout code.

## Deploying it online (so it's live 24/7)
This project runs anywhere Node.js runs. Easiest free/cheap options:
- **Render.com** — connect this folder as a Git repo, it auto-detects
  `npm start`.
- **Railway.app** — similar one-click deploy.
- Your own VPS — install Node, `npm install`, `npm start` (use `pm2`
  to keep it running).

Once deployed, your public URL replaces `localhost:3000` everywhere.
