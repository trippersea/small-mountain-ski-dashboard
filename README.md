# New England Ski Decision Engine

A GitHub Pages-ready, Kayak-style ski decision engine for Northeast mountains.

## Phase 1 scope
This version expands beyond a small-mountain dashboard into a broader Northeast search-and-compare tool with pass filters for:
- Epic
- Ikon
- Indy
- Independent

The initial Northeast catalog is built from a broader North American resort dataset plus current pass-group mapping for Northeast resorts.

## What this build includes
- `Where Should I Ski Tomorrow?`
- `Where Should I Ski This Weekend?`
- Storm Chaser leaderboard
- Hidden Gem Score
- Indy Pass Optimization Tool
- Planner Score controls with presets and custom sliders
- Compare table and side-by-side compare
- Drive-radius / Storm / Pass map modes
- Search typeahead for resort names
- ZIP or city-based drive times

## Architecture fields now included
Each resort record now includes:
- `passGroup`
- `ownerGroup`
- `region`
- `baseElevation`
- `summitElevation`
- `vertical`
- `terrainBreakdown`
- `avgSnowfall`
- `snowmaking`
- `price`
- `night`
- `terrainPark`

## Free data sources used in-browser
- Open-Meteo for weather and forecast snowfall
- Zippopotam.us for ZIP lookup
- Nominatim for city/state geocoding
- OSRM for drive times
- Leaflet + OpenStreetMap for mapping

## Important note
Ticket prices are directional estimates and can vary by date, demand, age, and promotions. Confirm final pricing with the mountain.
