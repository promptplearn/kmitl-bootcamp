# KMITL · AI-Driven Entrepreneurship Bootcamp

One interactive site for the 28 Jun 2026 workshop. Students go:
**Learn → Idea Lab → Submit → Present & Vote**, all from their phones.
The facilitator runs the **Present Board** on the projector.

| Page | Who | What |
|---|---|---|
| `index.html` | everyone | Hub + QR to join |
| `learn.html` | students | The lean-startup lesson (11 slides) |
| `lab.html` | students | 15 product ideas + Claude prompt pack |
| `submit.html` | students | One MVP card per team → goes to the board |
| `vote.html` | students | Live pivot/persevere vote on the team on stage |
| `board.html` | facilitator | Live gallery + tally + weighted grading rubric |

No framework, no build step — plain HTML + 2 tiny JS files. Deploys to Vercel as-is.

## Go LIVE across phones (10 min, one time)

Without this it runs in **LOCAL mode** (single device, localStorage) — still works, just doesn't sync.

1. Create a free project at [supabase.com](https://supabase.com).
2. **SQL Editor → New query →** paste all of `supabase-schema.sql` → **Run**.
3. **Project Settings → API** → copy the **Project URL** and the **anon public** key.
4. Paste both into `config.js`, commit, push. Vercel redeploys automatically.

The header pill shows **LIVE** (green) when it's connected, **LOCAL** otherwise.
If wifi dies mid-session it falls back to local automatically so the room keeps moving.

> RLS is open on purpose — this is a one-day classroom throwaway. Delete the Supabase project afterwards.

## On the day

- Project the **Present Board** (`/board.html`). Its QR sends students to the vote page.
- Each team presents → tap **Put on stage** → the room votes from their phones → you grade live on the rubric.
- **Reset votes** before the next team. **Clear stage** to take everyone off.

## Heads-up

Prompt 5 in the Idea Lab builds the demo as a **Claude Artifact**. If the uni's Claude
access can't do Artifacts, teams describe the screen instead — the rest of the flow is unaffected.
