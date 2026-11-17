# dinner-picker: Secrets and Setup

No API keys live in this repo. The app reads them from `config.js`, which is gitignored.

## Secrets inventory

| Key in config.js | Purpose | How to get it |
|---|---|---|
| `FIREBASE_API_KEY` | Firebase project `dinner-picker-4be13` | Firebase Console > Project settings > General > Web API key |
| `GOOGLE_PLACES_API_KEY` | Places text search | Google Cloud Console > APIs & Services > Credentials |

## Setup

1. `cp config.example.js config.js`
2. Paste your key(s) into `config.js`.
3. In Google Cloud Console > Credentials, restrict each key:
   - **Application restrictions:** Websites > your site URL(s) (plus `http://localhost:*` for testing)
   - **API restrictions:** only the APIs listed above
   - Add a billing budget alert on the project
4. Serve the folder (for example the VS Code Live Server extension or `npx serve .`).

> **GitHub Pages note:** because `config.js` is not committed, a Pages deploy from the branch will load without maps. To publish with a key, either commit a **referrer-restricted** key in `config.js` on purpose (browser Maps keys are visible to visitors anyway) or copy the `pages.yml` workflow pattern from the brightservices repo, which generates `config.js` from a repo secret.

> **Firebase note:** a Firebase web key identifies the project but is not what protects your data. Your **Realtime Database security rules** are. Make sure they are not left open (`".read": true, ".write": true`), or delete the project if it is no longer used.

## Rotation log

Keys previously committed to this repo are in git history and should be treated as public.

| Date | Secret | Action |
|---|---|---|
| 2026-11-16 | Firebase web key (`AIza...pi-U`) | Removed from code. Delete or restrict in Google Cloud Console, and lock or delete the Firebase project. |
| 2026-11-16 | Places key (`AIza...3DPc`) | Removed from code. **Delete in Google Cloud Console.** |
| 2026-11-16 | Older key in history (`AIza...Ujyc`) | Not in current code. **Delete in Google Cloud Console.** |
