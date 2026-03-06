# Small Mountain Ski Dashboard

A GitHub Pages-ready ski resort dashboard with:
- sticky section navigation
- weekend planner cards
- drive-time lookup from your location
- quick search and filters
- resort comparison and notes
- pass value calculator
- New England Leaflet map
- trail map slot for each mountain
- back-to-top button

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

## Add a trail map
In `resorts.js`, each resort can use:
- `trailMapImage`
- `trailMapPage`

Example:
```js
trailMapImage: 'https://example.com/trailmap.jpg',
trailMapPage: 'https://example.com/trail-map/'
```

## Notes
- Drive times use OSRM and appear after a location lookup.
- Weather uses Open-Meteo.
- User notes and favorites are stored locally in the browser.
