# Suno God Mode

Static web app plus Vercel Edge functions that call [OpenRouter](https://openrouter.ai/) for AI song prompts (no Poe dependency).

## Deploy on Vercel

1. Push this folder to a GitHub repository (see below).
2. In [Vercel](https://vercel.com), import the repo.
3. Add **Environment variables** (Project → Settings → Environment Variables):
   - `OPENROUTER_API_KEY` — your OpenRouter API key (required).
   - `OPENROUTER_MODEL` — optional; if unset, the app defaults to `openai/gpt-4o-mini`. The API also sends **fallback models** so a single unavailable slug does not fail the whole request (see [model fallbacks](https://openrouter.ai/docs/guides/routing/model-fallbacks)).
   - `OPENROUTER_SITE_URL` — optional; defaults to `https://$VERCEL_URL` for the `HTTP-Referer` header OpenRouter expects.
4. Deploy. The app uses `/api/models` (live OpenRouter model catalog for the picker), `/api/generate` (concept), `/api/generate-stream` (song, streaming), and `/api/history` (optional saved generations).

### Past results (database)

- In the UI, **History** lists past generations. Each successful **Generate** is saved automatically.
- **Without a database:** entries are stored in **localStorage** in that browser only (up to 100 items).
- **With Postgres:** in the Vercel project go to **Storage**, create or connect a **Postgres** database (Neon), and **link** it to this project. Vercel sets `POSTGRES_URL`. Redeploy if needed. The `generations` table is created on first use.
- **Privacy:** the history API has no per-user auth; anyone who can open your deployed site can read or delete stored rows. For a public app, treat this as a convenience store, not private vault data.

## Local development

```bash
npm i -g vercel
vercel link
vercel env pull .env.local
# Add OPENROUTER_API_KEY to .env.local or use `vercel env add`
vercel dev
```

Open the URL shown (usually `http://localhost:3000`).

## Push to GitHub

```bash
cd suno-god-mode
git init
git add .
git commit -m "Add Suno God Mode with OpenRouter"
git branch -M main
git remote add origin https://github.com/YOUR_USER/YOUR_REPO.git
git push -u origin main
```

Then connect the repo in Vercel and set `OPENROUTER_API_KEY`.
