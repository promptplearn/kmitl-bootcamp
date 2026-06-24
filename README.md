# KMITL · AI-Driven Entrepreneurship Bootcamp

One interactive site for the 28 Jun 2026 workshop. Students go:
**Learn → Idea Lab → Submit → Present & Vote**, all from their phones.
The facilitator runs the **Present Board** on the projector.

| Page | Who | What |
|---|---|---|
| `index.html` | everyone | Hub + QR to join |
| `learn.html` | students | The lean-startup lesson (11 slides, infographics) |
| `lab.html` | students | 15 product ideas + AI prompt pack + model-routing guide |
| `preview.html` | students | Paste AI-written HTML → renders live (Artifact replacement) |
| `submit.html` | students | One MVP card per team → goes to the board |
| `vote.html` | students | Live pivot/persevere vote on the team on stage |
| `board.html` | facilitator | Live gallery + tally + radar + weighted grading rubric |

No framework, no build step — plain HTML + small JS files (`db.js`, `common.js`, `viz.js`). Deploys to Vercel as-is.

## Go LIVE across phones (10 min, one time)

Without this it runs in **LOCAL mode** (single device, localStorage) — still works, just doesn't sync.

1. Create a free project at [supabase.com](https://supabase.com).
2. **SQL Editor → New query →** paste all of `supabase-schema.sql` → **Run**.
3. **Project Settings → API** → copy the **Project URL** and the **anon public** key.
4. Paste both into `config.js`, commit, push. Vercel redeploys automatically.

The header pill shows **LIVE** (green) when it's connected, **LOCAL** otherwise.
In LIVE mode, failed writes retry then surface an honest "try again" — they do **not**
silently fall back to local (a local-only vote is invisible to the room). LOCAL mode is the
deliberate single-device / podium fallback (run it that way on purpose if there's no wifi).

> RLS is open on purpose — this is a one-day classroom throwaway. Delete the Supabase project afterwards.

## On the day

- Project the **Present Board** (`/board.html`). Its QR sends students to the vote page.
- Each team presents → tap **Put on stage** → the room votes from their phones → you grade live on the rubric (with the radar + gauge).
- **Reset votes** before the next team. **Clear stage** to take everyone off.

## Demos without Artifacts (the uni AI is plain chat)

The uni portal is a multi-model LLM chat (Claude / GPT / Gemini) with **web search** and
**image generation**, but **no Artifacts** (it can't render HTML in-chat). So teams build a POC two ways:

- **Image mockup** — switch to a **Gemini Image** model (Idea Lab Prompt 5) for a product render or UI shot. Best for hardware/tangible ideas.
- **Clickable HTML** — ask Claude/GPT for a single-file HTML mockup (Prompt 6), then paste it into **`preview.html`** to render & present fullscreen. Best for software/platform ideas.

The Lab includes a **model-routing card** (which model for research vs images) and a quota tip (~1000 shared units; images cost more).
