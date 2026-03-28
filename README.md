# Playlister

A full-stack playlist app with an **Express** API and **MongoDB** for users, playlists, and songs. Playback uses the **YouTube** iframe API for streaming-style listening. Sign-in is **session-based** (bcrypt-hashed passwords, JWT cookies).

The client is **React** (Create React App) and **Material UI**, with playlist editing, a song catalog, YouTube-backed playback, and a **transaction processing system** (TPS) for undo/redo on playlist actions.

---

## Features

- **Playlists** — Create, open, rename, copy, and delete playlists; persist state to the API.
- **Player** — YouTube-driven playback with queue behavior and controls tied to the active playlist.
- **Edit & undo** — Song add/remove/reorder and metadata edits with **undo/redo** via a custom TPS (**jstps**).
- **Auth** — Register, login, logout, and guest login; protected routes and user-owned playlists.
- **Catalog** — Search and browse songs from the server-backed catalog.
- **Layout** — Polished UI with MUI components and a consistent app shell.

---

## Tech stack

| Area | Technologies |
|------|----------------|
| Frontend | React 17, Create React App, Material UI, Emotion, React Router v5, Axios, jstps |
| Backend | Node.js, Express, Mongoose, bcryptjs, jsonwebtoken, cookie-parser, CORS |
| Data | MongoDB |

---

## Project structure

```
client/     React SPA
server/     REST API
```

The API and client are separate packages; build the client for static hosting (e.g. **Vercel**) and run the API on a Node host (e.g. **Render**) with `DB_CONNECT` and CORS configured for your frontend origin.

---

## Note

This project is for learning and portfolio use and is not affiliated with YouTube or Spotify.
