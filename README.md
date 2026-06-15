# Travellore

Travellore is a Letterboxd-inspired travel profile studio. Users log the places
they have traveled to, rate each stamp, tag the trip style, and build a
signature traveler profile from the first place onward.

## MVP Surface

- Add traveled places with country, region, visit date, rating, pace, styles,
  highlight, and memory.
- Generate a traveler signature from the origin stamp and dominant style mix.
- Show profile stats for stamps, countries, regions, average rating, and origin.
- Render a passport shelf of travel cards.
- Sketch the wider ecosystem layers: origin stamp, diary taste, lists, and
  taste-matched people.
- Persist the current prototype in browser storage for local iteration.

## Product Direction

The current build is a local-first prototype. For a hosted multi-user platform,
the travel entries, profiles, lists, follows, comments, and taste matches should
move behind server routes with durable storage. The Sites starter already
includes Cloudflare-compatible wiring, and `.openai/hosting.json` is ready for
D1 and R2 bindings when the data model becomes authoritative.

## Local Commands

```bash
npm install
npm run dev
npm run build
```

On Windows PowerShell, use `npm.cmd` if the `npm.ps1` shim is blocked:

```bash
npm.cmd install
npm.cmd run dev
npm.cmd run build
```
