export function getMountainNarrative(mountain) {
    const temp = parseInt(mountain.temperature) || 32;
    const lowTemp = mountain.lowTemp ? parseInt(mountain.lowTemp) : temp - 5;
    const highTemp = mountain.highTemp ? parseInt(mountain.highTemp) : temp + 5;
    const wind = parseInt(mountain.windSpeed) || 0;
    const newSnow = mountain.newSnow || 0;
    const humidity = mountain.humidity || 50;
    const daysSinceSnow = mountain.daysSinceSnow || 0;

    const f = (mountain.forecast || "").toLowerCase();
    const isSunny = f.includes('sun') || f.includes('clear');
    const isSnowing = f.includes('snow') || f.includes('flurr');
    const isRaining = f.includes('rain') || f.includes('showers');
    const isCloudy = f.includes('cloud') || f.includes('overcast');

    if (newSnow > 8 && temp < 15) {
        return {
            vibe: "Blower Pow",
            story: "Cold smoke and light snow. The kind of day you bail on plans for.",
        };
    }

    if (temp < 25 && isSunny && wind < 12) {
        return {
            vibe: "Pure Gold",
            story: "Cold, sunny, and calm. Hard to beat if you like clean turns.",
        };
    }

    if (isSnowing && newSnow > 1 && newSnow < 4 && wind > 20) {
        return {
            vibe: "Wind Buff",
            story: "Windy, but soft pockets build in sheltered spots. Stay out of the open faces.",
        };
    }

    if (temp < 0) {
        return {
            vibe: "Arctic",
            story: "Brutal cold. Cover skin, warm up often, and skip the long slow lifts.",
        };
    }

    if (isRaining) {
        return {
            vibe: "Wet Kit",
            story: "Rain in the mix. Fast snow, wet gloves, not for everyone.",
        };
    }

    if (temp < 18 && wind > 35) {
        return {
            vibe: "Hold Lifts",
            story: "Big wind. Lifts can run late or stop, check the mountain before you roll.",
        };
    }

    if (temp < 20 && (mountain.wasWarmYesterday || mountain.rainedYesterday)) {
        return {
            vibe: "Bulletproof",
            story: "Yesterday softened, today refroze. Loud, firm, and grabby underfoot.",
        };
    }

    if (newSnow > 0 && newSnow < 2 && mountain.wasWarmYesterday) {
        return {
            vibe: "Sneaky Firm",
            story: "A dusting looks nice but hides hardpack underneath. Trust your edges.",
        };
    }

    if (newSnow > 10 && temp >= 30) {
        return {
            vibe: "Heavy Snow",
            story: "Plenty of new snow but it is dense. Legs will feel it by lunch.",
        };
    }

    if (isSnowing && newSnow < 1) {
        return {
            vibe: "Snow Globe",
            story: "Flakes in the air, not a dump. Still feels like winter.",
        };
    }

    if (daysSinceSnow > 5 && temp < 20 && mountain.altitude > 7000) {
        return {
            vibe: "Chalky",
            story: "Old snow but high and cold, so steeps stay grippy if you like it firm.",
        };
    }

    if (lowTemp < 25 && highTemp > 40 && isSunny) {
        return {
            vibe: "Spring Shift",
            story: "Firm early, softer later. Sun does the work if you time it right.",
        };
    }

    if (temp > 42 && isSunny) {
        return {
            vibe: "Corn Day",
            story: "Soft and slushy by afternoon. Early start beats sticky snow.",
        };
    }

    if (humidity > 90 && temp > 32 && isCloudy) {
        return {
            vibe: "Flat Gray",
            story: "Damp and hard to see. Trees beat wide open bowls today.",
        };
    }

    if (isSunny && temp < 30 && daysSinceSnow > 2 && wind < 15) {
        return {
            vibe: "Groomer Day",
            story: "Cord and firm snow, no fresh to chase. Fun if you want to rip arcs.",
        };
    }

    if (daysSinceSnow > 2 && highTemp > 35 && isCloudy) {
        return {
            vibe: "Rough Going",
            story: "Tracked out and a little beat up, groomers are your best bet.",
        };
    }

    if (isCloudy && !isSnowing && !isRaining) {
        return {
            vibe: "Flat Light",
            story: "Tough contrast on the snow. Relax your stance and read by feel.",
        };
    }

    return {
        vibe: "Fair Enough",
        story: `Pretty normal at ${mountain.name || 'the mountain'}. Worth a few laps if you want out.`,
    };
}
