# DMA Technologies — Inauguration & Pooja

Invitation microsite for the inauguration of the new DMA Technologies office (19 October 2026).
It is a static site with no build step, so it can be hosted on GitHub Pages as-is.

## Run locally
Double-click `index.html`, or serve the folder:

```bash
python -m http.server 8000   # then open http://localhost:8000
```

Add `?nogate` to the URL to skip the opening doors (useful for screenshots).

## Edit the content
All event details are in **`js/config.js`**: date, time, venue, phone, programme and music.

- **Time**: `startTime: "10:00"` and `timeLabel: "10:00 AM"`. The countdown and calendar invites use this time (IST).
- **Programme**: `programme` holds sample ceremonies. Replace them with the real order of events and times.
- **Music**: `assets/audio/theme.mp3` starts when the doors open and loops. It's a 3½-minute excerpt of
  "Temple Rhythms – Tabla, Flute & Sitar". Only publish music you have the rights to. If the track's license requires
  a credit, fill in `musicCredit` and it will appear in the footer.

## Publish on GitHub Pages
```bash
git init
git add .
git commit -m "Inauguration site"
git branch -M main
git remote add origin https://github.com/<org-or-user>/<repo>.git
git push -u origin main
```
Then in GitHub open **Settings → Pages → Build and deployment**, choose **Deploy from a branch**, then **main / (root)**, and save.
The site goes live at `https://<org-or-user>.github.io/<repo>/` within a minute or two.

## Structure
```
index.html          page markup
css/style.css       styles (palette taken from the printed invitation)
js/config.js        event details: edit this file
js/music.js         background music engine
js/main.js          gate, countdown, garland, petals, calendar, lightbox
assets/img/         logo, invitation card, lotus and diya artwork cut from the card
```
`DMA_INAUGURATION.png` and `src/` are the original source files and are not used by the site.
