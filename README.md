# Small Mountain Dashboard

A static, GitHub Pages-ready ski resort dashboard built for small-mountain exploration.

## What is included

- Searchable ski resort list
- Filters for region, pass, and night skiing
- Small Mountain Score ranking engine
- Resort detail cards with terrain and lift mix
- Map view with clickable markers
- Rankings table for the filtered resort set
- Snowfall tracker that fetches a 3-day forecast client-side from Open-Meteo

## Files

- `index.html` — main page
- `styles.css` — layout and visual styling
- `resorts.js` — resort data, map logic, ranking logic, and snowfall forecast fetch

## Publish to GitHub Pages

1. Create a new GitHub repository.
2. Upload these files to the repository root.
3. In GitHub, go to **Settings > Pages**.
4. Under **Build and deployment**, choose:
   - **Source:** Deploy from a branch
   - **Branch:** `main`
   - **Folder:** `/ (root)`
5. Save.
6. Your site will publish at a URL like:
   `https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/`

## How to edit resorts

Open `resorts.js` and add or edit objects inside the `RESORTS` array.

Each resort uses this shape:

```javascript
{
  id: 'unique-id',
  name: 'Resort Name',
  state: 'NH',
  region: 'New England',
  owner: 'Family-run',
  pass: 'Indy',
  vertical: 1200,
  trails: 35,
  lifts: 4,
  acres: 140,
  snowfall: 110,
  snowmaking: 95,
  night: true,
  longestRun: 1.8,
  lat: 43.1234,
  lon: -71.5678,
  difficulty: { beginner: 0.25, intermediate: 0.45, advanced: 0.20, expert: 0.10 },
  liftsBreakdown: [['Quad', 1], ['Double', 2], ['Surface', 1]],
  charm: 85,
  localVibe: 88,
  webcam: 'https://example.com/static-webcam-image.jpg',
  website: 'https://example.com/',
  notes: 'Short note about the resort.',
  tags: ['Night skiing', 'Indy', 'Classic doubles']
}
```

## Webcam notes

Most resorts do **not** offer easy embeddable live streams. The simplest production setup is:

- use a direct static JPG/PNG image URL if available
- or keep a placeholder image and use the official site link

## Snowfall tracker notes

The snowfall tracker is client-side only. It calls the Open-Meteo forecast API using each resort’s latitude/longitude.

That means:

- it works on GitHub Pages with no backend
- it gives you a quick snow forecast, not the resort’s official reported snow total
- you can later swap it for a different weather or snow API if you want

## Easy next upgrades

- Replace placeholders with real webcam images
- Add tabs for only Indy / only family-owned / only night skiing
- Add a homepage grid of webcams
- Add ownership color badges
- Add a resort comparison view
