# Small Mountain Ski Dashboard

GitHub Pages-ready dashboard for comparing New England ski resorts with:
- drive times from your ZIP code or city
- searchable compare table
- resort type-ahead search
- pass value calculator
- live weather and 7-day snowfall
- interactive New England map

## Deploy
Upload `index.html`, `styles.css`, `resorts.js`, and `README.md` to the repo root and enable GitHub Pages from the `main` branch.

## Location search
- Enter a 5-digit ZIP code or a city/state.
- Click **Set location** or press **Enter**.
- ZIP lookup uses Zippopotam.us first, then falls back to Nominatim.
- Drive times use OSRM routing.

## Notes
This version hides the duplicate Best For bar and Resorts sidebar so the Compare table is the main browsing experience.
