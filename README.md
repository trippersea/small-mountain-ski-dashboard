# Small Mountain Dashboard

A static, GitHub Pages-ready ski resort dashboard built for small-mountain exploration.

## Files

- `index.html` — main page
- `styles.css` — layout and visual styling
- `resorts.js` — resort data and dashboard logic

## Quick Start

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

## How to Add Resorts

Open `resorts.js` and add another object inside the `RESORTS` array.

Each resort should follow this shape:

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

## Webcam Notes

Some resorts do not allow direct embedding of webcam streams or images.

If a webcam image does not load:
- use a direct static JPG/PNG image URL if available
- or keep the image as a placeholder and rely on the official site link

## GitHub Pages Tip

If you later want a cleaner project structure, you can keep `index.html` in the root and move data/assets into folders like:

- `assets/`
- `data/`
- `images/`

Then update file references accordingly.
