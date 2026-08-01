# LibraryHub — React Project

A React (Vite) conversion of the LibraryHub university library portal, preserving
the original design, animations, and features:

- Home page — hero, genre grid, famous classics, story previews, featured story,
  reader reviews (with a review form), about section, an in-browser "Sage" AI
  chatbot, and a newsletter signup.
- Full Library page — search, genre filters, and sorting across the whole catalogue.
- Auth page — sign in / create account, with client-side validation and a
  password-strength meter.
- Story modal — book details plus an audio narration player powered by the
  browser's built-in Web Speech API (no external service needed).
- Booking page — borrow or purchase books (cash or points), with live stock
  counts, plus a "share your story" upload form.
- Library Profile page — a read-only university library profile (hours, gallery,
  services, map).
- User Profile page — points balance, points history, and booking history.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (typically http://localhost:5173).

To create a production build:

```bash
npm run build
npm run preview
```

## Project structure

```
src/
  main.jsx                 # React entry point
  App.jsx                  # Top-level layout + page router
  data.js                  # Book/genre/review/chatbot data (extracted 1:1 from the original)
  styles.css                # Original design system (colors, layout, animations)
  context/
    AppContext.jsx          # Global app state: auth, points, bookings, modals
  components/
    BgCanvas.jsx             # Animated starfield background
    Navbar.jsx
    PointsToast.jsx          # "+N points earned" toast
    StoryCard.jsx            # Book card used on Home + Library
    StoryModal.jsx           # Book detail modal + narration player
    BookingModal.jsx         # Reserve/purchase modal
    ChatWidget.jsx           # "Sage" AI story guide chatbot
    LpLightbox.jsx           # Library-profile photo lightbox
  pages/
    HomePage.jsx
    LibraryPage.jsx
    AuthPage.jsx
    LibProfilePage.jsx
    ProfilePage.jsx
    BookingPage.jsx
```

## Deploying to GitHub Pages

This project is pre-configured to deploy automatically via GitHub Actions.

1. **Update the base path** — open `vite.config.js` and set `base` to match
   your new repo's exact name (case-sensitive), e.g. if your repo is
   `github.com/yourname/MyRepo`, set `base: '/MyRepo/'`.
2. Push this project to a new GitHub repo:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```
3. In the repo on GitHub: **Settings → Pages → Source → GitHub Actions**.
4. Push (or re-push) to `main` — the included workflow
   (`.github/workflows/deploy.yml`) will build the project and publish it
   automatically. Check the **Actions** tab for progress.
5. Once the workflow finishes, your site will be live at
   `https://YOUR_USERNAME.github.io/YOUR_REPO/`.

## Notes

- State is in-memory only (matching the original — there's no backend and no
  localStorage), so refreshing the page resets sign-in, points, and bookings.
- The narration player uses `window.speechSynthesis`; available voices differ
  by browser/OS. Chrome, Edge, and Safari all support it well.
- A couple of image sources (library gallery + the venue map) point to
  Unsplash and Google Maps since the original page bundled local copies that
  aren't included here.
