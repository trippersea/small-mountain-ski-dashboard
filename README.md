# Small Mountain Ski Dashboard

A GitHub Pages-ready ski resort dashboard with:
- adjustable scoring sliders
- resort rankings
- clickable SVG map
- webcam slot for each mountain
- trail map slot for each mountain

## Files
- `index.html`
- `styles.css`
- `resorts.js`

## Deploy to GitHub Pages
1. Create or open your GitHub repository.
2. Upload these files to the repo root.
3. In **Settings > Pages**, choose:
   - **Deploy from a branch**
   - Branch: `main`
   - Folder: `/ (root)`
4. Save.

## Add a webcam
In `resorts.js`, each resort has:
- `webcamImage`
- `webcamPage`

Example:
```js
webcamImage: 'https://example.com/webcam.jpg',
webcamPage: 'https://example.com/webcams/'
```

Use `webcamImage` when you have a direct image URL.
Use `webcamPage` when the resort has a webcam page but not a directly embeddable image.

## Add a trail map
In `resorts.js`, each resort has:
- `trailMapImage`
- `trailMapPage`

Example:
```js
trailMapImage: 'https://example.com/trailmap.jpg',
trailMapPage: 'https://example.com/trail-map/'
```

## Notes
Some resorts block direct image embedding for webcams or trail maps. In those cases, leave `webcamImage` or `trailMapImage` blank and just use the page link.


## 2026 refresh
This version includes:
- brighter snow-and-sky color palette
- primary top navigation and back-to-top button
- search typeahead on the resort search field
- ZIP lookup via Zippopotam.us and weather/snow outlook via Open-Meteo
- drive-time routing via OSRM
- Snow Outlook cards with simple snowfall sparklines
- price disclaimers for day-ticket and pass calculations

## Data notes
Ticket prices are directional estimates only and can change by date, demand, age band, and promotions. Confirm final pricing and pass terms directly with the resort.
