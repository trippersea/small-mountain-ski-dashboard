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


## Bright theme and new features
This version adds:
- a brighter ski-themed color palette
- sticky top navigation
- snow outlook cards with snowfall sparklines
- crowd-pressure estimates
- pass value calculator
- drive-time heat map colors on the map when a location is set

## Notes on data
- Weather and snowfall forecast use Open-Meteo in the browser.
- Drive times use a public OSRM routing service and may take a few seconds to populate.
- Crowd pressure and operations outlook are clearly labeled estimates, not official resort status feeds.
