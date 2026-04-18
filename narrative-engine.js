/** True for smaller hills (Northeast-style verticals) when summit and vertical are in payload. */
function isSmallHill(m) {
    const summit = m.summitFt != null ? Number(m.summitFt) : (Number(m.altitude) || 0);
    const vert = m.verticalFt != null ? Number(m.verticalFt) : 0;
    if (summit <= 0) return false;
    return summit < 4000 && (vert === 0 || vert < 2400);
}

export function getMountainNarrative(mountain) {
    const temp = parseInt(mountain.temperature) || 32;
    const lowTemp = mountain.lowTemp ? parseInt(mountain.lowTemp) : temp - 5;
    const highTemp = mountain.highTemp ? parseInt(mountain.highTemp) : temp + 5;
    const wind = parseInt(mountain.windSpeed) || 0;
    const newSnow = mountain.newSnow || 0;
    const humidity = mountain.humidity || 50;
    const daysSinceSnow = mountain.daysSinceSnow || 0;
    const small = isSmallHill(mountain);

    const f = (mountain.forecast || "").toLowerCase();
    const isSunny = f.includes('sun') || f.includes('clear');
    const isSnowing = f.includes('snow') || f.includes('flurr');
    const isRaining = f.includes('rain') || f.includes('showers');
    const isCloudy = f.includes('cloud') || f.includes('overcast');

    if (newSnow > 8 && temp < 15) {
        return {
            vibe: "Cold Smoke",
            story: small
                ? "Light dry snow and cold air. The kind of day you skip work for."
                : "Cold smoke and light snow. The kind of day you bail on plans for.",
        };
    }

    if (temp < 25 && isSunny && wind < 12) {
        return {
            vibe: "Pure Gold",
            story: small
                ? "Cold sun and barely any wind. Hard to beat on a small hill day like this."
                : "Cold, sunny, and calm. Hard to beat if you like clean turns.",
        };
    }

    if (isSnowing && newSnow > 1 && newSnow < 4 && wind > 20) {
        return {
            vibe: "Windy Shelters",
            story: small
                ? "Windy, but pockets soften in trees and lee sides. Skip wide open spots."
                : "Windy, but soft pockets build in sheltered spots. Stay off the wide open faces.",
        };
    }

    if (temp < 0) {
        return {
            vibe: "Bitter Cold",
            story: small
                ? "Rough cold. Short laps, warm breaks, and favor slow lifts if you can."
                : "Brutal cold. Cover skin, warm up often, and skip the long slow lifts.",
        };
    }

    if (isRaining) {
        return {
            vibe: "Wet Snow",
            story: "Rain in the mix. Fast snow, wet gloves, not for everyone.",
        };
    }

    if (temp < 18 && wind > 35) {
        return {
            vibe: "Lift Risk",
            story: "Big wind. Lifts can run late or stop, check the hill before you roll.",
        };
    }

    if (temp < 20 && (mountain.wasWarmYesterday || mountain.rainedYesterday)) {
        return {
            vibe: "Icy Layer",
            story: small
                ? "Yesterday softened, today refroze. Loud and grabby on the groomed lanes."
                : "Yesterday softened, today refroze. Loud, firm, and grabby underfoot.",
        };
    }

    if (newSnow > 0 && newSnow < 2 && mountain.wasWarmYesterday) {
        return {
            vibe: "Thin Cover",
            story: small
                ? "A dusting hides hardpack underneath. Trust your edges on the main runs."
                : "A dusting looks nice but hides hardpack underneath. Trust your edges.",
        };
    }

    if (newSnow > 10 && temp >= 30) {
        return {
            vibe: "Heavy Pack",
            story: "Plenty of new snow but it is dense. Legs will feel it by lunch.",
        };
    }

    if (isSnowing && newSnow < 1) {
        return {
            vibe: "Light Flakes",
            story: "Flakes in the air, not a dump. Still feels like winter.",
        };
    }

    if (daysSinceSnow > 5 && temp < 20 && !small && mountain.altitude > 7000) {
        return {
            vibe: "Firm Steeps",
            story: "No fresh snow in a while, but altitude keeps steeps grippy if you like it firm.",
        };
    }

    if (daysSinceSnow > 5 && temp < 24 && small) {
        return {
            vibe: "Firm Pack",
            story: "No fresh snow in a while. Groomers stay the safest bet for clean turns.",
        };
    }

    if (lowTemp < 25 && highTemp > 40 && isSunny) {
        return {
            vibe: "Spring Soft",
            story: small
                ? "Firm early, softer after lunch. Let the sun work before you chase soft snow."
                : "Firm early, softer later. Sun does the work if you time it right.",
        };
    }

    if (temp > 42 && isSunny) {
        return {
            vibe: "Soft Corn",
            story: small
                ? "Soft and slushy by afternoon. Early laps beat sticky snow on short vertical."
                : "Soft and slushy by afternoon. Early start beats sticky snow.",
        };
    }

    if (humidity > 90 && temp > 32 && isCloudy) {
        return {
            vibe: "Low Visibility",
            story: small
                ? "Damp and flat light. Stick to the widest groomers where you can read the surface."
                : "Damp and flat light. Trees are easier to read than wide open terrain.",
        };
    }

    if (isSunny && temp < 30 && daysSinceSnow > 2 && wind < 15) {
        return {
            vibe: "Groomer Day",
            story: small
                ? "Firm cord and no fresh to chase. Fun if you want to rip the main runs."
                : "Cord and firm snow, no fresh to chase. Fun if you want to rip arcs.",
        };
    }

    if (daysSinceSnow > 2 && highTemp > 35 && isCloudy) {
        return {
            vibe: "Rough Going",
            story: small
                ? "A little beat up out there. Groomers are your best bet for a clean ride."
                : "Tracked out and a little beat up, groomers are your best bet.",
        };
    }

    if (isCloudy && !isSnowing && !isRaining) {
        return {
            vibe: "Flat Light",
            story: small
                ? "Hard to see texture on the snow. Keep speed in check and stay loose."
                : "Tough contrast on the snow. Relax your stance and read by feel.",
        };
    }

    return {
        vibe: "Fair Enough",
        story: `Pretty normal at ${mountain.name || 'the mountain'}. Fine for a few laps if you want out.`,
    };
}
