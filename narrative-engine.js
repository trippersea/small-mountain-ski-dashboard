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
            story: "This is the good stuff. Cold, light snow and a day that makes you want to cancel your plans."
        };
    }

    if (temp < 25 && isSunny && wind < 12) {
        return {
            vibe: "Pure Gold",
            story: "Bluebird, cold, and calm. Tough to draw up a better ski day than this."
        };
    }

    if (isSnowing && newSnow > 1 && newSnow < 4 && wind > 20) {
        return {
            vibe: "Wind Buff",
            story: "A little windy, but there should be soft pockets building up around the mountain. Stick to the protected sides."
        };
    }

    if (temp < 0) {
        return {
            vibe: "Arctic Session",
            story: "Real cold out there. Cover your skin, take breaks, and do not expect a long chairlift to feel fun."
        };
    }

    if (isRaining) {
        return {
            vibe: "Gore-Tex Test",
            story: "It is a wet one. Fast snow, soggy gear, and not a day for everyone."
        };
    }

    if (temp < 18 && wind > 35) {
        return {
            vibe: "Hold the Chair",
            story: "Big wind today. Lifts could be delayed or shut down, so check the mountain before you head out."
        };
    }

    if (temp < 20 && (mountain.wasWarmYesterday || mountain.rainedYesterday)) {
        return {
            vibe: "Bulletproof",
            story: "Yesterday softened up, today it locked back up. Expect firm, loud, edge-checking conditions."
        };
    }

    if (newSnow > 0 && newSnow < 2 && mountain.wasWarmYesterday) {
        return {
            vibe: "Sneaky Firm",
            story: "That little refresh helps the look, not always the feel. There is probably some firm stuff hiding underneath."
        };
    }

    if (newSnow > 10 && temp >= 30) {
        return {
            vibe: "Leg Burner",
            story: "Plenty of new snow, but it is on the heavier side. Great coverage, just be ready to work for it."
        };
    }

    if (isSnowing && newSnow < 1) {
        return {
            vibe: "Snow Globe",
            story: "Not a powder day, but it feels like winter and that still counts for something."
        };
    }

    if (daysSinceSnow > 5 && temp < 20 && mountain.altitude > 7000) {
        return {
            vibe: "Chalky Steeps",
            story: "The fresh snow is gone, but the higher terrain should still ski really well if you like firm, grippy snow."
        };
    }

    if (lowTemp < 25 && highTemp > 40 && isSunny) {
        return {
            vibe: "The Transition",
            story: "Firm early, softer later. Give it a little time and this could turn into a very fun spring day."
        };
    }

    if (temp > 42 && isSunny) {
        return {
            vibe: "Corn & Tailgates",
            story: "Soft snow, spring vibes, and probably a better day if you start early before things get too sticky."
        };
    }

    if (humidity > 90 && temp > 32 && isCloudy) {
        return {
            vibe: "The Soup",
            story: "Low visibility and a damp feel all around. Tree-lined runs will probably be easier to ski."
        };
    }

    if (isSunny && temp < 30 && daysSinceSnow > 2 && wind < 15) {
        return {
            vibe: "Corduroy Heaven",
            story: "This is a groomer day. Clean, firm enough to trust, and really fun if you want to rip carved turns."
        };
    }

    if (daysSinceSnow > 2 && highTemp > 35 && isCloudy) {
        return {
            vibe: "Chunder Alert",
            story: "Tracked out, a little chunky, and not all that smooth. Groomers are probably the safer bet."
        };
    }

    if (isCloudy && !isSnowing && !isRaining) {
        return {
            vibe: "Flat Light",
            story: "A bit hard to read the snow today. Stay loose, stay centered, and do not expect great contrast."
        };
    }

    return {
        vibe: "Standard Issue",
        story: `A pretty normal day at ${mountain.name || 'the mountain'}. Nothing wild, just solid skiing if you are in the mood to get out.`
    };
}