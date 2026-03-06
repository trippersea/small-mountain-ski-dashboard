# Small Mountain Ski Dashboard

A GitHub Pages-ready ski resort dashboard with:
- zip-code and city drive-time lookup
- primary top navigation for Search, Resorts, and Pass Value Calculator
- live comparison tables and map
- trail map links for each mountain

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
