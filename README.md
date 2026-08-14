# Tirumala Restaurant QR Menu

This project converts the Excel menu into a mobile-friendly digital menu.

## Files
- `index.html` — page structure
- `style.css` — restaurant design
- `script.js` — search, categories and rendering
- `menu.json` — all menu items extracted from your Excel
- `images/` — add your logo/photos here
- `qr/` — place the final QR artwork here

## Run locally

Do NOT double-click `index.html` if your browser blocks `menu.json`.
Use VS Code + Live Server, or Python:

```bash
python -m http.server 5500
```

Then open:
http://localhost:5500

## Change restaurant details

Open `menu.json` and edit:
- `restaurant.name`
- `restaurant.tagline`
- `restaurant.phone`
- `restaurant.address`
- `restaurant.hours`

## Publish

Upload this folder to GitHub Pages, Netlify, or Vercel.
After publishing, copy the public URL and create a QR code pointing to that URL.

Important: the QR code should contain only the public menu URL, not the menu items themselves.
