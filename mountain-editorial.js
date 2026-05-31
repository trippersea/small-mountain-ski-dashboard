/* ─────────────────────────────────────────────────────────────────────────────
 *  mountain-editorial-humanized-50.js
 *  Editorial copy for ski-report pages, keyed by exact resort.id values.
 *
 *  Built from the mountain-editorial.js schema:
 *    hook, lede, body, crowdTake, alternatives, lastUpdated
 *
 *  Voice rules applied:
 *    - Human, specific, opinionated
 *    - No generic resort marketing
 *    - Stats are used as context, not repeated as filler
 *    - Alternatives are intentional internal links, not random nearby resorts
 * ───────────────────────────────────────────────────────────────────────── */

const MOUNTAIN_EDITORIAL = {

  // Vermont
  'killington-resort': {
    hook: "Vermont's biggest mountain is still the default answer, which is exactly the problem on a Saturday.",

    lede: "Killington earns the Beast of the East name. It has the scale, the season length, the lift network, and the trail count to make almost any Vermont trip work. It is also the mountain everyone thinks of first, which means the best Killington days usually require either timing, patience, or a willingness to ski away from the obvious base areas.",

    body: [
      "The mountain's real strength is flexibility. Early season laps, late spring bumps, long cruiser days, storm days, park laps, family weekends, and advanced terrain can all happen here without leaving the same resort. That is rare in the East. Killington gives you choices when other mountains are still waiting for coverage or have already started winding down.",

      "The tradeoff is that Killington can feel like a city on snow. K-1, Snowshed, Ramshead, and the access road can all become part of the experience on peak weekends. The smart day here is not just picking Killington. It is picking where to start, when to move, and when to leave the headline terrain alone."
    ],

    crowdTake: "Ski Killington midweek and it feels like the mountain people brag about. Ski it on a holiday Saturday and the better move may be Pico, which shares the same storm track without making the whole day revolve around lines and parking.",

    alternatives: [
      { id: 'pico-mountain-at-killington', take: "The locals' play. Same neighborhood, same storms, less machinery around the ski day." },
      { id: 'sugarbush', take: "A bigger Vermont feel than people expect, with less of the Killington traffic mindset." }
    ],

    lastUpdated: "2026-05-31"
  },
  'pico-mountain-at-killington': {
    hook: "Same Killington storm zone, quieter lifts, and a much better chance of remembering why you came.",

    lede: "Pico works because it is not trying to be Killington. It sits right there in the same orbit, close enough that the comparison is unavoidable, but the day feels completely different. You get real vertical, real fall-line skiing, and a lodge rhythm that feels more like Vermont before every weekend became a logistics exercise.",

    body: [
      "The mountain is easy to understand in a good way. You go up, you ski down, and most of the best runs fall naturally back into the same basic rhythm. That makes Pico especially good for confident intermediates and advanced skiers who do not need six peaks to have a good day.",

      "The limitation is scale. If you need endless terrain, a huge village scene, or a full destination weekend, Pico will feel smaller by lunch. But for a clean ski day, especially when Killington is getting hammered by demand, smaller is the feature."
    ],

    crowdTake: "When Killington looks like the obvious call, check Pico before you commit. If the snow is similar and your group can live without the biggest trail map, Pico is often the better actual ski day.",

    alternatives: [
      { id: 'killington-resort', take: "The full-size version next door when you need terrain volume, lifts, and late-season coverage." },
      { id: 'okemo-mountain-resort', take: "A more polished intermediate day if the group wants grooming and infrastructure over local feel." }
    ],

    lastUpdated: "2026-05-31"
  },
  'stowe-mountain-resort': {
    hook: "The classic Vermont trip, beautiful, expensive, and still worth understanding before you book it.",

    lede: "Stowe has the look, the town, the mountain, and the reputation. When the snow is good and Mount Mansfield is open wall to wall, it can feel like the East Coast version of a real destination ski trip. It is also one of the easiest places in New England to confuse a great mountain with an easy day.",

    body: [
      "The terrain has more bite than the brochure suggests. Stowe can be friendly on the right trails, but the upper mountain, the Front Four reputation, and the Mansfield weather all keep it honest. It is not just a pretty Vermont village with lifts attached.",

      "The friction is cost and crowd. Between the Epic Pass pull, the town's popularity, and the limited road setup, peak weekends can feel tight before you even clip in. Stowe is best when you treat it like a premium experience that needs timing, not a casual default."
    ],

    crowdTake: "If you want Stowe for the full trip, go for it. If you mainly want northern Vermont snow and old-school skiing, Smugglers' Notch gives you the better skier's argument on the other side of the notch.",

    alternatives: [
      { id: 'smugglers-notch-resort', take: "Less polished, slower, and often more interesting for skiers who care more about the hill than the scene." },
      { id: 'sugarbush', take: "Another big Vermont trip with strong terrain and a little less luxury pressure." }
    ],

    lastUpdated: "2026-05-31"
  },
  'smugglers-notch-resort': {
    hook: "Smuggs is what happens when a real ski mountain refuses to become too smooth.",

    lede: "Smugglers' Notch is not the efficient choice, and that is part of the appeal. The lifts are slower, the layout takes a little patience, and the whole place feels like it belongs to families and skiers who already know why they are there. It is the Stowe alternative for people who do not need Stowe's polish.",

    body: [
      "The mountain has a split personality in the best way. There is enough family terrain to make a trip work, but the upper mountain can still challenge strong skiers, especially when natural snow fills in. It feels more local and less packaged than many resorts with similar name recognition.",

      "You do give something up. Lift speed matters on cold days, and mixed groups can spend time sorting out where everyone belongs. But if your goal is a more human Vermont ski day, Smuggs has a better story than most resorts trying to sell authenticity."
    ],

    crowdTake: "Smuggs is the move when Stowe feels too expensive, too crowded, or too choreographed. Just make sure your group is ready for a slower mountain rhythm.",

    alternatives: [
      { id: 'stowe-mountain-resort', take: "The polished version across the notch when lift speed, lodging, and restaurants matter." },
      { id: 'jay-peak', take: "A better storm-chaser option when northern Vermont is getting buried." }
    ],

    lastUpdated: "2026-05-31"
  },
  'jay-peak': {
    hook: "Jay is the East Coast powder gamble that actually has enough upside to justify the drive.",

    lede: "Jay Peak is not convenient for most people, which is one of the reasons it still works. It sits far enough north that the weather can feel like its own country, and when the storm track lines up, Jay can make the rest of the East feel like it is playing for second place.",

    body: [
      "The mountain is at its best when you are chasing snow, trees, and a little bit of weirdness. The glades are the point. So is the fact that the resort can feel remote, cold, and fully committed to winter when lower-elevation places are dealing with mixed precipitation.",

      "The risk is that Jay is a long way to go for an average day. Wind, lift holds, visibility, and the simple fact that not every storm delivers can change the value fast. This is a mountain to pick when the pattern supports it, not just because the name sounds snowy."
    ],

    crowdTake: "If Jay is in the bullseye, go. If the forecast is just okay, Smuggs or Stowe may give you a more practical northern Vermont day with less driving risk.",

    alternatives: [
      { id: 'smugglers-notch-resort', take: "Still northern, still character-filled, but a little less all-or-nothing than Jay." },
      { id: 'stowe-mountain-resort', take: "A more polished backup when the group wants restaurants, lodging, and a classic Vermont trip." }
    ],

    lastUpdated: "2026-05-31"
  },
  'sugarbush': {
    hook: "Sugarbush is the Vermont big mountain people sometimes remember too late.",

    lede: "Sugarbush has a way of sitting just outside the loudest Vermont conversations, which is good news for the people who ski it. It has enough terrain to feel like a real trip, enough variety to keep strong skiers engaged, and enough valley character to feel less manufactured than the biggest name-brand weekends.",

    body: [
      "The appeal is range. Lincoln Peak gives you the resort center, Mount Ellen gives you breathing room, and the Mad River Valley gives the trip a skier's geography instead of a single base-area bubble. It is not the simplest mountain, but that helps it reward people who explore.",

      "Sugarbush is not crowd-proof, and it is not as instantly legible as Okemo or Killington. That is fine. This is the mountain for someone who wants Vermont scale without feeling like the entire state followed them to the same lift maze."
    ],

    crowdTake: "When Killington and Stowe feel too obvious, Sugarbush should be in the conversation. If the group is advanced and the snow is good, Mad River Glen is the sharper nearby play.",

    alternatives: [
      { id: 'mad-river-glen', take: "The purist version of the same valley, less forgiving and more memorable when conditions are right." },
      { id: 'stowe-mountain-resort', take: "A better fit when the group wants a more polished destination experience." }
    ],

    lastUpdated: "2026-05-31"
  },
  'mad-river-glen': {
    hook: "Mad River Glen is not for everyone, which is why it still matters.",

    lede: "Mad River Glen should not be written like a normal resort. It is a skier's mountain with a strong point of view, old lifts, natural snow dependence, and a culture that does not bend itself around convenience. On the right day, that makes it special. On the wrong day, it can feel like you were warned and went anyway.",

    body: [
      "The best Mad River days are about texture, not amenities. You come for narrow lines, bumps, trees, fall-line skiing, and the feeling that the mountain has not been sanded down for mass appeal. It rewards skiers who can handle variable conditions and do not need every trail groomed into predictability.",

      "The honest caveat is that snow matters more here. A thin week changes the recommendation quickly, and mixed-ability groups need to be careful. Mad River is not the easy answer. It is the right answer when the skier and the conditions match."
    ],

    crowdTake: "If the natural snow is in and your group can ski, Mad River is the memory-maker. If you need a safer, broader, more flexible day, Sugarbush is right there.",

    alternatives: [
      { id: 'sugarbush', take: "The same valley with more grooming, more lifts, and a much easier mixed-group setup." },
      { id: 'smugglers-notch-resort', take: "Another old-school Vermont choice with more family infrastructure around the edges." }
    ],

    lastUpdated: "2026-05-31"
  },
  'okemo-mountain-resort': {
    hook: "Okemo is not the soulful pick. It is the reliable one.",

    lede: "Okemo is easy to make fun of if your whole identity is steep trees and local-bar mythology. It is also easy to recommend when a family wants clean groomers, strong snowmaking, and a day that does not require constant problem solving. Okemo knows what it is, and a lot of skiers need exactly that.",

    body: [
      "The mountain is built around predictability. Intermediates can cover ground, families can separate and reconnect, and the snowmaking system gives Okemo a useful floor when natural snow is not helping southern Vermont. It is a very good place to ski fast, clean, comfortable groomers.",

      "The downside is that a polished mountain can feel a little too polished. Advanced skiers may run out of interest, and peak weekends can still be busy enough to blunt the whole reliability argument. Okemo is best when you value the smooth day more than the wild one."
    ],

    crowdTake: "Choose Okemo when the group needs dependable. Choose Magic when the snow is good and you want southern Vermont to feel less like a resort product.",

    alternatives: [
      { id: 'magic-mountain', take: "The character play nearby, especially when natural snow makes the steeper lines worth chasing." },
      { id: 'pico-mountain-at-killington', take: "A quieter fall-line alternative if you are willing to shift north toward Killington." }
    ],

    lastUpdated: "2026-05-31"
  },
  'magic-mountain': {
    hook: "Magic is southern Vermont for skiers who still like a little uncertainty in the deal.",

    lede: "Magic Mountain is the opposite of a guaranteed product. That is why people care about it. When the snow is right, Magic feels like a small mountain with a much bigger attitude, full of narrow lines, natural snow energy, and enough old-school Vermont texture to make polished resorts feel a little sterile.",

    body: [
      "This is not the place to send everyone blindly. Magic asks more from the weather and more from the skier. The best terrain needs coverage, and the experience is less about convenience than character. But when it lines up, it is one of the more satisfying southern Vermont calls.",

      "The human appeal is that Magic still feels like a mountain with a local argument, not a spreadsheet. You go because you want the day to have edges. You go because the alternative is another safe groomer loop somewhere with better parking and less soul."
    ],

    crowdTake: "If southern Vermont just got real snow, Magic should jump up your list. If the week has been warm, thin, or crowded with families who need predictability, Okemo is the cleaner move.",

    alternatives: [
      { id: 'okemo-mountain-resort', take: "The practical backup with grooming, snowmaking, and a much easier family setup." },
      { id: 'stratton-mountain', take: "A bigger southern Vermont resort day when you want services and scale instead of old-school texture." }
    ],

    lastUpdated: "2026-05-31"
  },

  // New Hampshire
  'loon-mountain': {
    hook: "Loon is the Boston skier's convenient big day, and convenience is why it gets crowded.",

    lede: "Loon makes sense before you even look at the trail map. It is close enough for a real day trip from eastern Massachusetts, big enough to feel worth the drive, and polished enough for families, groups, and pass holders. The same logic applies to thousands of other people on the same Saturday morning.",

    body: [
      "The mountain skis best when you use the whole place. If you only bounce between the most obvious pods, Loon can feel like lines and intersections. Move with some intent and it becomes a more complete New Hampshire day, with cruisers, parks, South Peak laps, and enough terrain to keep a mixed group together.",

      "The crowd problem is not a footnote. It is part of the mountain's identity because Loon is so useful. That does not make it a bad pick. It just means the recommendation should include timing, parking, and a backup plan."
    ],

    crowdTake: "Loon is best midweek or on a non-holiday day when the convenience still works but the demand backs off. If the forecast says every Boston skier is going north, Cannon is the sharper skier's alternative.",

    alternatives: [
      { id: 'cannon-mountain', take: "Less polished and less forgiving, but a better fit for skiers who want mountain over convenience." },
      { id: 'waterville-valley', take: "Another central New Hampshire option with strong cruisers and a slightly different crowd pattern." }
    ],

    lastUpdated: "2026-05-31"
  },
  'cannon-mountain': {
    hook: "Cannon is New Hampshire with the edges left on.",

    lede: "Cannon does not always make skiing easy, and that is why strong skiers respect it. It can be cold, windy, firm, and blunt. It can also deliver one of the best public-mountain ski days in the East when the snow, visibility, and wind all cooperate. Cannon is not a comfort pick. It is a conditions pick.",

    body: [
      "The mountain has a directness that many resorts have lost. The terrain feels exposed, the fall lines feel honest, and the place carries more ski history than base-area polish. On a good day, Cannon makes smoother resorts feel a little soft.",

      "The problem is that Cannon's best qualities can turn against you fast. Wind holds, hard snow, and low visibility can make the day feel more like a test than a treat. It belongs high on the list for the right skier, not every skier."
    ],

    crowdTake: "Pick Cannon when the weather is stable and the group can handle firm New Hampshire skiing. If you need a safer family day in the same White Mountains zone, Bretton Woods is the smarter call.",

    alternatives: [
      { id: 'bretton-woods', take: "The calmer White Mountains option when grooming, comfort, and group confidence matter." },
      { id: 'loon-mountain', take: "More convenient and more polished for groups that do not want Cannon's rough edges." }
    ],

    lastUpdated: "2026-05-31"
  },
  'black-mountain': {
    hook: "If a faster lift would ruin it, you are at the right mountain.",

    lede: "Black Mountain is not trying to compete with the big New Hampshire resorts, and that is exactly why it works. The lifts are slower, the footprint is smaller, and the whole place feels like it belongs to the people who already know why they came. It is not a mountain that rewards efficiency. It is one that rewards spending the day there.",

    body: [
      "The mid-mountain lodge is the thing that makes Black feel different. Champagne and fondue sounds like something that should be happening in the Alps, not on a modest New Hampshire ski hill, but that is the charm. It gives the mountain a little European apres feel without losing the local, slightly throwback character that makes Black worth protecting.",

      "The terrain is better than the stats suggest. Enough winding groomers, pitch changes, and old-school lines to keep a good skier entertained, especially without rushing. Slower lifts mean fewer laps, but they also keep the pace human, which is part of why the place still feels like a ski area instead of a machine."
    ],

    crowdTake: "Ski Black when you want the day to feel relaxed, social, and a little different. If the priority is maximum vertical or high-speed lift laps, go somewhere else. If the priority is a mountain with a pulse, stay for the fondue.",

    alternatives: [
      { id: 'cranmore-mountain-resort', take: "More polished, more convenient to North Conway, and better when the group wants faster lifts and a cleaner family-resort setup." },
      { id: 'bretton-woods', take: "The safer White Mountains choice when grooming, comfort, and lift infrastructure matter more than old-school character." }
    ],

    lastUpdated: "2026-05-31"
  },
  'wildcat-mountain': {
    hook: "Wildcat is the view, the fall line, and the weather gamble all at once.",

    lede: "Wildcat has one of the best settings in Eastern skiing. Looking across at Mount Washington never gets old, and the mountain still has an old-school feel that makes a run feel longer than the trail count suggests. The catch is that Wildcat lives in real weather, and real weather gets a vote.",

    body: [
      "On the right day, Wildcat is simple in the best sense. Long runs, good pitch, a classic New Hampshire feel, and scenery that makes other mountains look like they were built in a parking lot. It is not overly complicated, and it does not need to be.",

      "The same exposure that gives Wildcat its drama can also make it difficult. Wind, cold, lift issues, or scraped-off surfaces can change the recommendation quickly. This is a mountain where the forecast matters more than the brand name."
    ],

    crowdTake: "When Wildcat is calm and covered, go. When the wind is questionable or the group needs comfort, Bretton Woods is the safer Mount Washington Valley decision.",

    alternatives: [
      { id: 'bretton-woods', take: "More sheltered, more polished, and easier for families or mixed abilities." },
      { id: 'cranmore-mountain-resort', take: "A North Conway-friendly backup when convenience beats terrain ambition." }
    ],

    lastUpdated: "2026-05-31"
  },
  'bretton-woods': {
    hook: "Bretton Woods is the White Mountains choice when the day needs to work.",

    lede: "Bretton Woods will not win every argument with the hardest-core skier in the room. It does win a lot of actual family ski days. The mountain is comfortable, scenic, well suited to intermediates, and generally less punishing than the more exposed, sharper-edged neighbors.",

    body: [
      "The value here is margin. When Cannon is too firm, Wildcat is too windy, or the group has a wide range of abilities, Bretton Woods can turn a questionable forecast into a good day. It is the kind of mountain that protects the trip.",

      "That also means expert skiers may want more bite. Bretton Woods can feel gentle if you are looking for steep challenge all day. But not every recommendation should chase difficulty. Sometimes the smartest mountain is the one that keeps everyone skiing."
    ],

    crowdTake: "Use Bretton Woods as the safe White Mountains call. If the snow is good, the wind is down, and the group wants a harder mountain, Cannon or Wildcat becomes more interesting.",

    alternatives: [
      { id: 'cannon-mountain', take: "The tougher state-owned option when challenge matters more than comfort." },
      { id: 'wildcat-mountain', take: "The scenic, more old-school alternative when Mount Washington weather is cooperating." }
    ],

    lastUpdated: "2026-05-31"
  },
  'mount-sunapee': {
    hook: "On Epic and an hour from Boston, which is the entire pitch and the entire problem.",

    lede: "Mount Sunapee is one of those mountains that makes a lot of sense on paper and still works in real life, as long as you know what kind of day you are signing up for. It is close enough to Boston to be a realistic day trip, it is on Epic, and it has the kind of terrain that works for families, intermediates, and mixed-ability groups. That same convenience is also the problem. On a winter weekend, you are not the only person who noticed it.",

    body: [
      "The move at Sunapee is to get there early and ski with purpose. If you can get good laps in before 10:30 or so, the mountain can feel like a win before the busiest part of the day even starts. After that, the lift lines and base-area traffic tend to build, especially on Epic-heavy weekends when skiers from all over eastern Massachusetts and southern New Hampshire are making the same calculation.",

      "Sunapee is not the place you pick for solitude. It is the place you pick when the group wants a dependable family ski day, manageable terrain, and enough vertical to feel like you actually went skiing. The reward, when the weather is clear, is the view over Lake Sunapee. It gives the whole place a little more drama than the trail map suggests."
    ],

    crowdTake: "Ski Sunapee like a morning mountain. Get the early laps, enjoy the lake view, and accept that the middle of the day may be more about company than vertical. If the group is relaxed about that, Sunapee can still be a great family day.",

    alternatives: [
      { id: 'pats-peak', take: "Smaller and less dramatic, but often the easier family play when the goal is a simpler southern New Hampshire ski day." },
      { id: 'ragged-mountain-resort', take: "A better choice when the day calls for more breathing room and a more independent New Hampshire feel." }
    ],

    lastUpdated: "2026-05-31"
  },

  // Maine
  'sunday-river': {
    hook: "Sunday River is the Eastern operations machine, and sometimes that is exactly what you need.",

    lede: "Sunday River is built to keep people moving. The mountain spreads across multiple peaks, leans hard on snowmaking, and gives skiers a lot of ways to build a day. It may not have the remote mystique of Sugarloaf, but it is one of the better Eastern resorts when the goal is getting a lot of skiing done.",

    body: [
      "The strength is consistency. Early season, lean snow years, busy weekends, and mixed-ability trips are all situations where Sunday River makes sense. You can chase the better pod, shift with the sun, and avoid spending the whole day stuck in one base-area bottleneck.",

      "The tradeoff is that the experience can feel engineered. Sunday River is very good at being a resort, but not always soulful. If you want Maine skiing to feel bigger, colder, and more committed, Sugarloaf or Saddleback may be the better story."
    ],

    crowdTake: "Pick Sunday River when reliability and lift logistics matter. If the weather is good and you want the more memorable Maine mountain, look harder at Sugarloaf.",

    alternatives: [
      { id: 'sugarloaf', take: "The bigger, more remote Maine commitment when the upper mountain is in play." },
      { id: 'saddleback-inc', take: "A less corporate Rangeley alternative with real terrain and a stronger local feel." }
    ],

    lastUpdated: "2026-05-31"
  },
  'sugarloaf': {
    hook: "Sugarloaf is the Maine mountain you earn by driving farther.",

    lede: "Sugarloaf feels different because it is different. It is remote, cold, big by Eastern standards, and capable of delivering a kind of ski day that does not feel interchangeable with the southern New England weekend circuit. When the upper mountain is open and the weather cooperates, the drive starts to make sense very quickly.",

    body: [
      "The mountain's ceiling is the point. Snowfields, long descents, real exposure, and a one-mountain community make Sugarloaf feel like a proper destination, not just a large regional resort. It rewards skiers who want to settle in and ski the whole mountain over a few days.",

      "The risk is that Sugarloaf asks for commitment before it promises the payoff. Wind, cold, and upper-mountain closures can reduce the magic. For a casual one-day trip, that is a lot to ask. For the right weekend, it is exactly why people love it."
    ],

    crowdTake: "Go to Sugarloaf when the forecast supports the drive. If you want the same Maine soul with a smaller, less corporate feel, Saddleback is the first alternative to check.",

    alternatives: [
      { id: 'saddleback-inc', take: "The Rangeley-area counterpoint, smaller in profile but big enough to be a real trip." },
      { id: 'sunday-river', take: "The more operationally predictable Maine choice when lift logistics and snowmaking matter." }
    ],

    lastUpdated: "2026-05-31"
  },
  'saddleback-inc': {
    hook: "Saddleback is the Maine mountain people are almost afraid to overpraise.",

    lede: "Saddleback has the rare feeling of a comeback story that still skis like a real mountain. It is big enough to deserve a trip, remote enough to feel separate from the usual weekend treadmill, and personal enough that the mountain does not disappear behind the resort machinery.",

    body: [
      "The terrain has a clean, satisfying feel. There is room for families, but the mountain's appeal grows as the snow improves and the upper-mountain lines come alive. It feels less like a checklist resort and more like a place skiers want to protect.",

      "The limitation is the same thing that creates the charm. Saddleback is not the most convenient Maine choice, and it does not have Sunday River's operational depth or Sugarloaf's name recognition. But for skiers who want a more human version of a Maine destination, that is a fair trade."
    ],

    crowdTake: "Saddleback is the choice when you want Maine to feel personal. If you need more terrain volume, more services, or a bigger trip structure, Sugarloaf is the safer companion pick.",

    alternatives: [
      { id: 'sugarloaf', take: "The bigger Rangeley-area anchor when scale and upper-mountain terrain are the priority." },
      { id: 'sunday-river', take: "The better logistics play when the group needs reliability over character." }
    ],

    lastUpdated: "2026-05-31"
  },

  // Massachusetts
  'wachusett-mountain-ski-area': {
    hook: "Wachusett is not a fantasy ski trip. It is a useful ski day, and that matters.",

    lede: "Wachusett should be judged by what it is trying to do. It gets people from eastern and central Massachusetts onto snow without turning the day into a highway project. For families, night skiers, after-work laps, and beginners graduating into real runs, that usefulness is the whole point.",

    body: [
      "The mountain is compact, efficient, and heavily dependent on snowmaking, which is exactly what a central Massachusetts hill needs to be. You are not going there for wilderness or destination energy. You are going because two hours of skiing beats zero hours of skiing.",

      "The crowd issue is real because the mountain serves a huge population. Peak sessions can feel compressed fast. Wachusett is best when you use the clock carefully, nights, off-peak windows, school-day mornings, and short sessions instead of pretending it is a northern New England weekend."
    ],

    crowdTake: "Wachusett is the smart choice when proximity is the whole point. If you want a small-mountain day with more Berkshire character, Bousquet changes the feel without becoming a major trip.",

    alternatives: [
      { id: 'bousquet-ski-area', take: "A more personal Berkshire hill when you want local character instead of pure convenience." },
      { id: 'pats-peak', take: "A New Hampshire step-up that still works well for families and night skiing." }
    ],

    lastUpdated: "2026-05-31"
  },
  'berkshire-east': {
    hook: "Western Mass has one mountain that actually looks intimidating from the parking lot.",

    lede: "Berkshire East feels like a mountain you have to earn a little. The drive into Charlemont is part of the experience, winding through one of the prettier corners of western Massachusetts before the ski area suddenly appears against the hill. Walk toward the base and Upper Competition and Competition stare right back at you, a broad steep-looking front face that gives the mountain more presence than most Massachusetts ski areas.",

    body: [
      "It is a real welcome mat, not in the soft sense, but in the way it tells you this place has more bite than the state line might suggest. The trail layout has enough character to keep stronger skiers honest, the pitches are legitimate, and the groomers ski longer than the vertical reads on paper.",

      "Berkshire East can absolutely get crowded on weekends, especially when the snow is good or families are packing the lodge. The trick is treating it like a real ski day, not a backup plan. Go early, or better yet catch it on a quieter day when the front face is open and you can actually lap the good stuff."
    ],

    crowdTake: "Berkshire East rewards the skier who comes ready to use the mountain. Weekend mornings before the lodge fills, or a midweek day when the front face is open, is when the place skis at its best.",

    alternatives: [
      { id: 'bousquet-ski-area', take: "Smaller, more personal, and better when the goal is a softer Berkshire family day with local-mountain feel." },
      { id: 'jiminy-peak', take: "The bigger Berkshire resort choice when lodging, night skiing, and more developed infrastructure matter." }
    ],

    lastUpdated: "2026-05-31"
  },
  'bousquet-ski-area': {
    hook: "Bousquet is the kind of small mountain that explains why small mountains matter.",

    lede: "Bousquet is not trying to compete with Vermont. It should not have to. This is where people learn, race, lap after school, ski under the lights, and build the habits that turn them into lifelong skiers. For WhereToSkiNext, that makes it more than a listing. It is part of the site's origin story.",

    body: [
      "The hill has a Berkshire feel that is hard to manufacture. It is small enough to know quickly, but big enough to give beginners and families a real progression. The value is not just vertical. It is the low-friction, local-mountain rhythm that keeps people connected to skiing.",

      "You have to frame it honestly. Bousquet is not a powder chase, a destination weekend, or a place to entertain experts all day. It is a mountain for the right job: learning, quick laps, family time, and local ski culture."
    ],

    crowdTake: "Choose Bousquet when the goal is getting on snow without turning it into a production. If the group wants more lifts, lodging, and a bigger Berkshire resort feel, Jiminy is the easy upgrade.",

    alternatives: [
      { id: 'jiminy-peak', take: "The larger Berkshire resort option with more services and broader family appeal." },
      { id: 'wachusett-mountain-ski-area', take: "The more convenient central Massachusetts choice when drive time matters most." }
    ],

    lastUpdated: "2026-05-31"
  },

  // New York
  'whiteface-mountain-resort': {
    hook: "Whiteface has the biggest Eastern vertical story, but the mountain has to be in the mood.",

    lede: "Whiteface is serious. The vertical is real, the Olympic history is real, and the upper mountain can make the East feel bigger than it usually does. It is also exposed, condition-sensitive, and capable of giving you a very different day than the trail map promised.",

    body: [
      "The best Whiteface days feel like a reward for paying attention. Clear weather, good coverage, and an open upper mountain turn the place into one of the most memorable ski days in the Northeast. Long runs actually feel long here, and the mountain has a sense of scale most Eastern resorts cannot fake.",

      "The hard part is that Whiteface can be firm, windy, or partially diminished when the weather does not cooperate. It is not the safest blind pick for a casual group. It is a high-ceiling pick that needs a forecast check."
    ],

    crowdTake: "When Whiteface is fully on, it is worth the drive. When the weather looks questionable or the group needs a more forgiving day, Gore is usually the smarter Adirondack answer.",

    alternatives: [
      { id: 'gore-mountain', take: "A more forgiving Adirondack mountain with variety and less exposure risk." },
      { id: 'belleayre', take: "A Catskills fallback when the goal is a manageable New York ski day rather than Olympic scale." }
    ],

    lastUpdated: "2026-05-31"
  },
  'gore-mountain': {
    hook: "Gore is New York's better normal-skier answer more often than people admit.",

    lede: "Gore does not have Whiteface's Olympic drama, and that may be why it is easier to recommend. It is large, varied, and interesting without making the whole day hinge on one exposed upper mountain. For many skiers, Gore is the Adirondack mountain that actually fits the trip better.",

    body: [
      "The mountain rewards exploration. Different pods, long traversing connections, and a less obvious layout can make Gore feel bigger and more varied than the first run suggests. It is not always simple, but it gives skiers room to build a day around conditions.",

      "The tradeoff is that Gore can feel spread out and less instantly satisfying if your group wants a compact, polished resort experience. It is a skier's map more than a village vacation. That is a feature for the right audience."
    ],

    crowdTake: "Choose Gore when you want Adirondack variety without betting everything on Whiteface's weather. If the sky is clear and the upper mountain is skiing well, Whiteface has the higher ceiling.",

    alternatives: [
      { id: 'whiteface-mountain-resort', take: "The bigger, more dramatic Adirondack day when conditions line up." },
      { id: 'belleayre', take: "The easier Catskills option when travel time and crowd control matter more than Adirondack scale." }
    ],

    lastUpdated: "2026-05-31"
  },
  'belleayre': {
    hook: "Belleayre is often the Catskills choice for people who want to ski, not posture.",

    lede: "Belleayre has a quieter kind of usefulness. It does not have Hunter's reputation or Windham's resort polish, but it often gives families and intermediates the better actual day. The mountain feels approachable, well sized, and less committed to being a scene.",

    body: [
      "The best case for Belleayre is balance. It has enough terrain for a real day, enough snowmaking to matter, and enough separation from the louder Catskills choices to make it feel saner on many weekends. It is especially easy to recommend when the group wants less stress.",

      "The ceiling is not the same as the more aggressive mountains. Advanced skiers may want more challenge, and people looking for a big resort weekend may find Belleayre modest. But for a smart New York day trip, modest can be the right answer."
    ],

    crowdTake: "Belleayre is the Catskills call when Hunter feels like too much hassle. If your group wants the bigger-name energy and steeper reputation, Hunter is still the obvious contrast.",

    alternatives: [
      { id: 'hunter-mountain', take: "The louder, steeper, more crowded Catskills name-brand option." },
      { id: 'windham-mountain', take: "A more polished Catskills alternative when the trip needs a resort feel." }
    ],

    lastUpdated: "2026-05-31"
  },
  'hunter-mountain': {
    hook: "Hunter is convenient, intense, and crowded enough that the warning belongs in the recommendation.",

    lede: "Hunter is one of those mountains that people either understand or complain about. It is close enough to pull huge demand from the New York market, steep enough to matter, and busy enough that the mountain can feel like a pressure cooker on the wrong weekend. That does not make it bad. It makes it specific.",

    body: [
      "The reason Hunter stays relevant is that it has real pitch and real access. For stronger skiers in the Catskills orbit, that combination is hard to ignore. It can deliver a satisfying day when the snow is good and you get ahead of the crowd.",

      "The problem is that everyone else knows it too. Parking, lines, scraped-off trails, and peak-weekend behavior can become part of the terrain. Hunter is best recommended with a timing strategy, not as a casual default."
    ],

    crowdTake: "Hunter works when you go early, avoid peak dates, and know why you chose it. If you want a calmer Catskills day, Belleayre is the smarter recommendation for most families and intermediates.",

    alternatives: [
      { id: 'belleayre', take: "The quieter Catskills choice when crowd management matters more than reputation." },
      { id: 'windham-mountain', take: "A more polished nearby option for groups that want a resort feel." }
    ],

    lastUpdated: "2026-05-31"
  },

  // Pennsylvania
  'camelback-mountain-resort': {
    hook: "Camelback is the Poconos convenience machine, which is both the value and the problem.",

    lede: "Camelback makes winter easy to package. Skiing, tubing, lodging, waterpark energy, and a simple Poconos location all work for families who want one place to solve the weekend. It is not the purest skier's mountain in the region, but it is one of the easiest for normal families to understand.",

    body: [
      "The mountain is best for convenience-driven trips. Beginners, intermediates, and families can make a weekend work without asking too many questions. For a lot of people, that is exactly what a Mid-Atlantic ski resort needs to do.",

      "The downside is demand. Camelback can feel crowded quickly because the value proposition is so obvious. If the goal is actual skiing more than resort packaging, nearby alternatives may give stronger skiers a better day."
    ],

    crowdTake: "Pick Camelback when the group wants a packaged Poconos weekend. If the skiers in the group care more about vertical feel and trail time, Blue Mountain is the better first comparison.",

    alternatives: [
      { id: 'blue-mountain-ski-area', take: "The stronger-skier Poconos alternative with a better mountain-first argument." },
      { id: 'jack-frost', take: "A quieter Poconos option when the group wants less resort energy." }
    ],

    lastUpdated: "2026-05-31"
  },
  'blue-mountain-ski-area': {
    hook: "Blue Mountain is the Poconos pick when the skiing matters more than the packaging.",

    lede: "Blue Mountain has a better skier's case than much of the surrounding region. It is still a Poconos mountain, so nobody should pretend it is Vermont, but the vertical feel, trail layout, and stronger-skiing reputation give it a clearer purpose than the resort-first choices nearby.",

    body: [
      "The best Blue Mountain days are about getting laps, not building a vacation bubble. Strong intermediates and advanced skiers can find more interest here than they might expect from the region, especially when the snow surface is cooperating.",

      "The limitation is that Blue does not solve every family need the way Camelback tries to. If the group wants lodging, tubing, waterpark distractions, and a neatly packaged weekend, Blue may feel too mountain-first. For some skiers, that is the point."
    ],

    crowdTake: "Blue Mountain is the Poconos choice when you are prioritizing the hill. If the trip needs to entertain non-skiers or younger kids, Camelback is the easier recommendation.",

    alternatives: [
      { id: 'camelback-mountain-resort', take: "The better resort-package option for families and mixed-interest groups." },
      { id: 'bear-creek-mountain-resort', take: "A smaller Pennsylvania alternative when convenience and a softer family day matter." }
    ],

    lastUpdated: "2026-05-31"
  },
  'seven-springs': {
    hook: "Seven Springs is western Pennsylvania's winter weekend hub more than a pure skier's mountain.",

    lede: "Seven Springs matters because it gathers the region. It has the lodging, the social energy, the events, and enough skiing to anchor a weekend. If you judge it only by terrain, you miss why people go. If you judge it only by the weekend scene, you miss why skiers sometimes want a quieter alternative.",

    body: [
      "The resort works best for groups. Families, casual skiers, friends, and people who want the whole winter weekend can find the value quickly. It is not just about the runs. It is about having enough around the skiing to make the trip feel complete.",

      "The tradeoff is that serious skiers may want less noise and more hill. Crowds, conditions, and social-weekend energy can make Seven Springs feel busy in every sense. That is when the local alternatives start to matter."
    ],

    crowdTake: "Use Seven Springs when the weekend needs a base camp. If you want the quieter, more skier-focused Laurel Highlands call, Laurel Mountain is the better counterweight.",

    alternatives: [
      { id: 'laurel-mountain', take: "The quieter, sharper local alternative when the skiing matters more than the scene." },
      { id: 'snowshoe-mountain', take: "A bigger Mid-Atlantic destination step when you are willing to drive farther." }
    ],

    lastUpdated: "2026-05-31"
  },

  // West Virginia
  'snowshoe-mountain': {
    hook: "Snowshoe is the Mid-Atlantic mountain that feels most like a real trip.",

    lede: "Snowshoe works because it sits apart from the easier drive-to hills. The village-on-top setup, elevation, and remote feel make it the rare Mid-Atlantic resort that can feel like a destination instead of a compromise. You do not casually stop by Snowshoe. You commit to it.",

    body: [
      "The elevation is the key to the story. In a region where winter can be fragile, Snowshoe often has the best chance of feeling like winter when lower mountains are fighting rain, warmth, or thin coverage. That makes it more than just the biggest name in the area.",

      "The catch is access. Snowshoe can be a long, twisting drive, and once you are there, you are there. It is best for people who want a full weekend and are willing to trade convenience for a better snow bet."
    ],

    crowdTake: "If you are driving far enough to make a weekend out of it, Snowshoe is the Mid-Atlantic anchor. If you need an easier Virginia-style trip, Wintergreen is the practical alternative.",

    alternatives: [
      { id: 'wintergreen-resort', take: "An easier Virginia option when the drive matters more than destination scale." },
      { id: 'seven-springs', take: "A western Pennsylvania weekend hub with more social-resort energy." }
    ],

    lastUpdated: "2026-05-31"
  },

  // North Carolina
  'beech-mountain': {
    hook: "Beech is a Southern elevation play, and you need the weather on your side.",

    lede: "Beech Mountain has a real hook: height. In the Southeast, elevation is not a detail, it is the business model. When cold air settles in and the snowmaking window opens, Beech can feel like a legitimate winter escape for skiers who do not have a Vermont option down the road.",

    body: [
      "The mountain is best approached with realistic expectations. You are skiing Southern Appalachia, not chasing western powder. The value is the chance to get on snow, make turns, bring a family, and feel winter at a place where the weather window matters more than the brand promise.",

      "The downside is volatility. Warm spells, crowds, and surface changes can shift the experience quickly. Beech is a smart recommendation when cold weather is locked in, not a blind pick for any random weekend."
    ],

    crowdTake: "Go to Beech when the forecast is cold and the mountain has been able to build snow. If you want the more broadly practical nearby call, Sugar Mountain belongs in the same search.",

    alternatives: [
      { id: 'sugar-mountain', take: "The nearby mainstream alternative with a broader practical appeal." },
      { id: 'wintergreen-resort', take: "A Virginia option when the trip is more about convenience than elevation." }
    ],

    lastUpdated: "2026-05-31"
  },

  // Michigan
  'mt-bohemia': {
    hook: "Mount Bohemia is the Midwest mountain that refuses to behave like the Midwest.",

    lede: "Bohemia is not a normal recommendation. It is ungroomed, advanced-focused, remote, and honest about who should be there. That is exactly why it has a cult following. In a region known for groomed laps and family hills, Bohemia feels like somebody smuggled in a different sport.",

    body: [
      "The point is not comfort. It is trees, powder when the lake-effect machine cooperates, natural snow texture, and the thrill of skiing something that does not feel processed. Strong skiers who are bored by the usual Midwest hill should have Bohemia on the list.",

      "The warning is just as important as the praise. This is not where you send beginners, cautious intermediates, or mixed groups hoping everyone will find a gentle lane. Bohemia is special because it is narrow in purpose."
    ],

    crowdTake: "Bohemia is the move when the group can ski and the snow is there. If you want a Midwest destination that works for more people, Lutsen is the more forgiving alternative.",

    alternatives: [
      { id: 'lutsen-mountains', take: "A bigger mainstream Midwest destination that does not require everyone to be an expert." },
      { id: 'nubs-nob', take: "A skier-respected Michigan alternative focused more on surface quality and classic hill feel." }
    ],

    lastUpdated: "2026-05-31"
  },
  'boyne-mountain': {
    hook: "Boyne Mountain is the Midwest family resort machine, and it is good at that job.",

    lede: "Boyne Mountain is not trying to be a secret skier's hill. It is a full winter resort built for families, groups, lodging, activities, and a clean weekend structure. That makes it easy to recommend when the trip has more moving parts than just who wants the steepest run.",

    body: [
      "The value is convenience and breadth. Mixed abilities can make it work, non-ski pieces are easier to handle, and the resort has enough going on that the ski day does not have to carry the whole trip. For many Midwest families, that is the point.",

      "The tradeoff is that pure skiers may prefer a hill with less resort machinery around it. Boyne Mountain can feel more like a winter weekend product than a local ski culture day. That is when Nubs Nob enters the conversation."
    ],

    crowdTake: "Choose Boyne Mountain when the whole group needs a resort. Choose Nubs Nob when the skiers in the car care more about the hill than the extras.",

    alternatives: [
      { id: 'nubs-nob', take: "The skier's northern Michigan alternative with less flash and a stronger hill-first feel." },
      { id: 'boyne-highlands', take: "Another Boyne-area resort choice when lodging and trip structure matter." }
    ],

    lastUpdated: "2026-05-31"
  },
  'nubs-nob': {
    hook: "Nubs Nob is the northern Michigan hill skiers recommend quietly and confidently.",

    lede: "Nubs Nob does not need to win the resort arms race. Its appeal is simpler: good grooming, a strong local reputation, and a mountain-first feel that makes skiers trust it. In a region with plenty of family resort energy, Nubs feels like the place people pick when they care about turns.",

    body: [
      "The mountain works because it respects the ski day. You do not need a huge village or a complicated setup when the surface is good and the hill skis cleanly. For Midwest skiers who value quality over spectacle, that matters.",

      "The limitation is that Nubs is not the full-package answer for every group. If lodging, pools, restaurants, and non-ski activities drive the trip, Boyne Mountain may fit better. Nubs is for the skier's vote in the car."
    ],

    crowdTake: "Pick Nubs when you want the best-feeling ski day in northern Michigan. Pick Boyne when the trip has to satisfy more than the skiers.",

    alternatives: [
      { id: 'boyne-mountain', take: "The fuller resort setup for families and mixed-interest groups." },
      { id: 'boyne-highlands', take: "Another northern Michigan resort option with more lodging and destination structure." }
    ],

    lastUpdated: "2026-05-31"
  },

  // Minnesota
  'lutsen-mountains': {
    hook: "Lutsen is the Midwest trip that feels bigger because the setting does half the work.",

    lede: "Lutsen Mountains has something most Midwest areas cannot fake: a sense of place. The Lake Superior backdrop, multiple mountain pods, and longer-trip feel make it more than just another regional hill. It is one of the few Midwest ski destinations that can feel like an actual getaway.",

    body: [
      "The terrain is varied enough to justify the drive for a broad range of skiers. You can bring families, intermediates, and stronger skiers without making the whole trip feel compromised. The scenery also matters. It gives the mountain a memory beyond the vertical stats.",

      "Lutsen is still a Midwest mountain, and conditions need to be respected. But as a complete regional destination, it has a stronger case than most. It is the answer when the group wants more than a local lap day."
    ],

    crowdTake: "Use Lutsen when you want the Midwest to feel like a trip. If the group is advanced and wants something stranger and more demanding, Bohemia is the wild-card alternative.",

    alternatives: [
      { id: 'mt-bohemia', take: "The advanced, ungroomed outlier when the skiers want a challenge more than a resort." },
      { id: 'granite-peak-wi', take: "A more mainstream Midwest anchor when Wisconsin access makes more sense." }
    ],

    lastUpdated: "2026-05-31"
  },

  // Wisconsin
  'granite-peak-wi': {
    hook: "Granite Peak is the Wisconsin anchor for skiers who want the biggest mainstream day in the state.",

    lede: "Granite Peak has the name recognition in Wisconsin for a reason. It gives regional skiers a larger, more developed option without asking them to turn the trip into Colorado math. For families and intermediates, it is one of the cleanest in-state answers.",

    body: [
      "The mountain's value is that it feels more complete than the local-hill category. You can build a real day, bring a group, and avoid the sense that you are only skiing because nothing bigger is nearby. That matters in the Midwest.",

      "The ceiling is still regional. If someone is expecting western scale or Northern Vermont texture, this is the wrong comparison. Granite Peak is best when measured against what it is actually solving: a better Midwest ski day within reach."
    ],

    crowdTake: "Granite Peak is the practical Wisconsin choice. If the group wants the Midwest trip to feel more scenic and destination-driven, Lutsen is the stronger upgrade.",

    alternatives: [
      { id: 'lutsen-mountains', take: "The more destination-feeling Midwest option with Lake Superior scenery." },
      { id: 'nubs-nob', take: "A Michigan skier's hill when the trip can shift east." }
    ],

    lastUpdated: "2026-05-31"
  },

  // Colorado
  'vail': {
    hook: "Vail is enormous and impressive, but size does not magically remove friction.",

    lede: "Vail is one of the few ski resorts where the scale really is the story. The back bowls, the village, the lift network, and the sheer acreage all make it feel like a global ski brand because it is one. The smarter take is that Vail can be both great and too much at the same time.",

    body: [
      "The mountain rewards skiers who move with a plan. If you chase the obvious routes at the obvious times, Vail can feel crowded and expensive before it feels special. If you use the terrain network well, it can deliver the kind of long, varied day that smaller resorts simply cannot match.",

      "The cost, crowd, and logistics belong in the recommendation. Vail is not the mountain to pick just because someone has heard of it. It is the mountain to pick when the group wants the full mega-resort experience and understands the trade."
    ],

    crowdTake: "Vail is best when you can ski off-peak, move early, and use the whole mountain. If the group wants a calmer, more polished nearby experience, Beaver Creek is the better alternative.",

    alternatives: [
      { id: 'beaver-creek', take: "The more controlled, polished neighbor when comfort matters more than spectacle." },
      { id: 'breckenridge', take: "Another Epic giant with more town energy and a different Summit County feel." }
    ],

    lastUpdated: "2026-05-31"
  },
  'breckenridge': {
    hook: "Breckenridge is the Colorado default, which is useful until it becomes too obvious.",

    lede: "Breckenridge works for a lot of people. The town is real, the terrain is broad, the high-alpine story is strong, and the name recognition makes planning easier. It is also one of the easiest Colorado resorts to choose without thinking hard enough about crowds, altitude, and what kind of skiing your group actually wants.",

    body: [
      "The strength is range. Beginners, intermediates, advanced skiers, park riders, and people who care about the town can all make a case. Few resorts solve that many group problems at once, which is why Breck stays so popular.",

      "The downside is that popularity follows you everywhere. Lift lines, busy base areas, and altitude fatigue can all shape the trip. Breckenridge is best when the group wants Colorado energy and can handle the scale of the scene."
    ],

    crowdTake: "Breck is the easy Colorado group pick. If the skiers in the group want a sharper, simpler, more mountain-first day nearby, Arapahoe Basin is the better contrast.",

    alternatives: [
      { id: 'arapahoe-basin', take: "The high, exposed, skier-first counterpoint without the full town-resort machine." },
      { id: 'vail', take: "The bigger Epic destination when acreage and resort scale matter most." }
    ],

    lastUpdated: "2026-05-31"
  },
  'arapahoe-basin': {
    hook: "A-Basin is the Summit County antidote to overbuilt ski trips.",

    lede: "Arapahoe Basin has a clear personality. It is high, exposed, simple, and more interested in skiing than pampering. That makes it one of the best Colorado recommendations for people who want the mountain to be the main event and do not need the trip wrapped in a village.",

    body: [
      "The terrain has real bite, especially when the upper mountain and steeper zones are skiing well. A-Basin also has a season-length identity that matters, with spring and late-season days that feel like their own culture rather than the end of winter.",

      "The warning is that A-Basin is not trying to solve every group problem. Beginners, luxury seekers, and people who want town energy may be happier elsewhere. This is a skier's choice, and that is exactly the appeal."
    ],

    crowdTake: "A-Basin is the move when the skiers are driving the decision. If the group needs lodging, nightlife, and a broader progression ladder, Breckenridge is the easier fit.",

    alternatives: [
      { id: 'loveland-ski-area', take: "Another high-elevation, no-village option with a practical Front Range feel." },
      { id: 'breckenridge', take: "The full town-and-resort alternative when the group needs more than skiing." }
    ],

    lastUpdated: "2026-05-31"
  },
  'loveland-ski-area': {
    hook: "Loveland is the Front Range pressure release valve that still feels like skiing first.",

    lede: "Loveland does not need a village to make its case. It is close to Denver, high enough to matter, and direct in a way that many Colorado resorts are not. You go to Loveland because you want to ski, not because you want to enter a resort economy.",

    body: [
      "The mountain is especially useful when you want altitude, snow, and access without the destination-resort layer. It can be cold and exposed, but that is part of the deal. Loveland feels like a working skier's mountain near the top of the pass.",

      "The limitation is group fit. If someone wants lodging, restaurants, lessons in a polished base village, or a vacation feel, Loveland may feel too bare. Its strength is that it does not pretend otherwise."
    ],

    crowdTake: "Loveland is a smart Front Range call when you want to avoid resort sprawl. If you want a similar skier-first feel with more name recognition, A-Basin is the natural comparison.",

    alternatives: [
      { id: 'arapahoe-basin', take: "The more famous high-alpine counterpart with a stronger expert and spring-skiing identity." },
      { id: 'winter-park-resort', take: "A broader Front Range resort when the group needs more terrain variety and services." }
    ],

    lastUpdated: "2026-05-31"
  },
  'steamboat-resort': {
    hook: "Steamboat is Colorado comfort with enough tree skiing to keep the skiers honest.",

    lede: "Steamboat has a softer landing than many big western resorts. The town feels warm, the mountain has a friendly rhythm, and the tree-skiing reputation gives stronger skiers something to chase when the snow is good. It is a destination that does not need to intimidate people to impress them.",

    body: [
      "The best Steamboat trips are about flow. Families, intermediates, and advanced skiers can all find their lane without turning the vacation into a test piece. When the snow comes in light and soft, the trees become the whole argument.",

      "The tradeoff is that Steamboat is not the sharpest expert mountain in Colorado. If your group wants steep, dramatic terrain above all else, other places have more bite. Steamboat wins when the full trip matters."
    ],

    crowdTake: "Choose Steamboat when you want a complete Colorado trip that most of the group will actually enjoy. If access from Denver matters more, Winter Park is the practical alternative.",

    alternatives: [
      { id: 'winter-park-resort', take: "The more Front Range-accessible option with strong trees and broad terrain." },
      { id: 'vail', take: "The bigger mega-resort choice when acreage and resort scale are the priority." }
    ],

    lastUpdated: "2026-05-31"
  },
  'telluride': {
    hook: "Telluride is the Colorado dream trip that earns the extra effort.",

    lede: "Telluride feels like a place before it feels like a product. The town, the box canyon, the terrain, and the sense of being far from the usual I-70 rush all work together. It is not the easiest Colorado ski trip, but ease is not the reason people remember it.",

    body: [
      "The mountain has a rare mix of beauty, challenge, and vacation rhythm. Strong skiers can find serious terrain, intermediates can still have a full trip, and the town gives the whole experience a reason to exist beyond the lift map.",

      "The limitation is access and cost. Telluride asks more of the planner than many Colorado resorts. That can be a problem for a quick trip, but for a bigger ski vacation, the distance is part of the filter that helps preserve the feel."
    ],

    crowdTake: "Telluride is the pick when you want the trip to feel special, not just efficient. If you want another Colorado mountain-town alternative with a rougher edge, Crested Butte belongs in the same conversation.",

    alternatives: [
      { id: 'crested-butte', take: "The more offbeat expert-town alternative with less polish and plenty of bite." },
      { id: 'steamboat-resort', take: "A warmer, easier destination fit for mixed groups and families." }
    ],

    lastUpdated: "2026-05-31"
  },

  // Utah
  'park-city-mountain': {
    hook: "Park City is the easy Utah giant, but easy is not the same thing as pure.",

    lede: "Park City Mountain is almost too convenient. The town is right there, the terrain is huge, the airport access is simple by western standards, and the resort can absorb a wide range of skiers. That is why it works. It is also why it can feel like the least surprising Utah choice.",

    body: [
      "The strength is group logistics. Families, mixed abilities, casual vacationers, and people who care about restaurants as much as snow can all make Park City work. The mountain is big enough that most skiers will not run out of options quickly.",

      "The tradeoff is that Park City does not always deliver the deep Utah feeling people imagine when they hear about the Cottonwoods. If the trip is about snow-first skiing, Alta and Snowbird make a stronger case."
    ],

    crowdTake: "Use Park City when convenience and group fit drive the decision. If the skiers are chasing the classic Utah snow argument, look to Alta or Snowbird instead.",

    alternatives: [
      { id: 'deer-valley-resort', take: "The polished, service-first Park City alternative when grooming and comfort matter." },
      { id: 'alta-ski-area', take: "The snow-first skier's alternative in Little Cottonwood Canyon." }
    ],

    lastUpdated: "2026-05-31"
  },
  'alta-ski-area': {
    hook: "Alta is the Utah answer when skiing is the whole point.",

    lede: "Alta does not need to be everything to everyone. It is skier-only, snow-focused, and rooted in a tradition that still feels distinct from the mega-resort world. If someone wants the cleanest version of the Utah snow story, Alta is usually where the conversation starts.",

    body: [
      "The appeal is not just snowfall. It is how directly the mountain points you toward skiing. The terrain, the culture, and the lack of extra resort theater all reinforce the same message. Come here to ski, and bring people who understand that.",

      "The limitation is built into the identity. Snowboarders are out, luxury seekers may prefer Deer Valley, and timid skiers can find the mountain intimidating when conditions are firm or visibility drops. Alta is excellent, but not universal."
    ],

    crowdTake: "Alta is the right call when the skiers are aligned and the snow is the priority. If the group wants steeper terrain, tram energy, and snowboard access, Snowbird is the obvious companion.",

    alternatives: [
      { id: 'snowbird', take: "The steeper, more intense neighbor with snowboard access and a bigger-mountain feel." },
      { id: 'park-city-mountain', take: "The easier group-vacation alternative when town, access, and mixed abilities matter." }
    ],

    lastUpdated: "2026-05-31"
  },
  'snowbird': {
    hook: "Snowbird is Utah turned up, steep, snowy, efficient, and not especially gentle.",

    lede: "Snowbird has a reputation because the mountain backs it up. It is big, steep, snowy, and built for skiers and riders who want terrain with consequences. It can be one of the best days in the country. It can also be a lot for people who thought Utah skiing meant easy powder laps and pretty scenery.",

    body: [
      "The mountain's strength is intensity. The tram, the bowls, the steeps, and the Little Cottonwood snow machine all make Snowbird feel serious fast. Advanced skiers and riders can build a full trip around the place without needing much else.",

      "The warning is that Snowbird can overwhelm the wrong group. Weather, visibility, traverses, steepness, and crowd pressure in the canyon all matter. This is not the gentle Utah recommendation. It is the big one."
    ],

    crowdTake: "Choose Snowbird when the group wants challenge and can handle the mountain. If the same snow zone sounds appealing but you want a more classic skier-only feel, Alta is the cleaner alternative.",

    alternatives: [
      { id: 'alta-ski-area', take: "The classic skier-only neighbor with a slightly softer cultural feel." },
      { id: 'park-city-mountain', take: "The easier vacation option when the group needs town, breadth, and less intimidation." }
    ],

    lastUpdated: "2026-05-31"
  },

  // Wyoming
  'jackson-hole-mountain-resort': {
    hook: "Jackson Hole earns the expert reputation, but not every skier needs that kind of day.",

    lede: "Jackson Hole is one of the few resorts where the mythology still feels connected to the mountain. The tram, the steeps, the Tetons, and the town all create a big, serious ski trip. But Jackson should be recommended honestly, because its best qualities are exactly what can make it wrong for cautious skiers.",

    body: [
      "For strong skiers, the draw is obvious. Jackson has terrain that feels consequential, a western setting that does not need embellishment, and enough challenge to make a trip feel earned. It is not just a famous name on a map.",

      "For mixed groups, the story is more complicated. There is intermediate skiing, but the mountain's identity leans advanced, and the cost of the trip raises the stakes. You do not want to discover on day one that half the group is intimidated."
    ],

    crowdTake: "Jackson is the pick when the skiers want the real thing and know what that means. If you want Teton snow with a mellower personality, Grand Targhee is the better other recommendation.",

    alternatives: [
      { id: 'grand-targhee-resort', take: "Snowy, quieter, and less intimidating on the other side of the Tetons." },
      { id: 'snowbird', take: "Another serious western option when steep terrain is the priority." }
    ],

    lastUpdated: "2026-05-31"
  },

  // California
  'palisades-tahoe': {
    hook: "Palisades is the Tahoe legend, but Tahoe legends still have traffic, storms, and timing problems.",

    lede: "Palisades Tahoe has the terrain and history to justify its reputation. When the snow is good and the mountain is open, it can feel like one of the most exciting ski areas in the country. It is also a place where weather, access, and crowds can become part of the day very quickly.",

    body: [
      "The mountain shines for strong skiers who like variety, exposure, bowls, and a sense of ski culture that predates the latest branding exercise. It has a high ceiling in a storm cycle and a spring identity that can be just as compelling.",

      "The challenge is friction. Sierra storms can be huge, roads can be messy, lifts can be affected by wind, and weekends can be crowded. Palisades is not a plug-and-play recommendation. It is a mountain to time well."
    ],

    crowdTake: "Palisades is worth it when the mountain is open and the timing works. If you want a smaller, more direct Donner Summit alternative, Sugar Bowl is the cleaner other call.",

    alternatives: [
      { id: 'sugar-bowl-resort', take: "A smaller Tahoe-area skier's mountain with less scene and strong terrain." },
      { id: 'mammoth-mountain', take: "The California giant to compare when spring skiing and long-season reliability matter." }
    ],

    lastUpdated: "2026-05-31"
  },
  'mammoth-mountain': {
    hook: "Mammoth is California's long-season giant, huge, windy, and often worth the trouble.",

    lede: "Mammoth has a scale and season-length story that few California resorts can match. It can be snowy, sunny, windy, sprawling, and brilliant, sometimes in the same trip. The mountain is not always simple, but when it is good, it feels like its own western ski universe.",

    body: [
      "The spring case is especially strong. Mammoth can keep skiing meaningful long after many resorts have shifted into memory mode, and the high-elevation terrain gives it a different calendar than the average ski area. That makes it valuable for people who want winter to last.",

      "The mountain can also feel awkward. Wind closures, long traverses, spread-out base areas, and storm-day logistics can complicate the experience. Mammoth is best when you give it time instead of trying to force a perfect single day."
    ],

    crowdTake: "Mammoth is the California pick when season length and scale matter. If you want Tahoe culture and easier Bay Area gravity, Palisades is the more direct comparison.",

    alternatives: [
      { id: 'palisades-tahoe', take: "The Tahoe expert-culture alternative with a different access pattern and village feel." },
      { id: 'kirkwood-mountain', take: "A snowier, more focused Sierra option when you care less about the full Mammoth scene." }
    ],

    lastUpdated: "2026-05-31"
  },
  'heavenly-mountain-resort': {
    hook: "Heavenly is the postcard trip, but the best views do not always mean the best skiing.",

    lede: "Heavenly has one of the strongest visual arguments in American skiing. Lake Tahoe views, town energy, casinos, lodging, and cross-border novelty all make it easy to sell. The honest skier's take is that the experience can be more complicated than the postcard suggests.",

    body: [
      "The mountain is huge and scenic, and for mixed groups that matters. People can ski, eat, wander, and build a trip around South Lake Tahoe instead of asking the skiing to do everything. That is a real advantage.",

      "The downside is that Heavenly can feel disjointed. Traverses, wind exposure, base-area choices, and crowd patterns can make the skiing less straightforward than the trail count implies. If the goal is pure Tahoe terrain, Kirkwood often makes a cleaner argument."
    ],

    crowdTake: "Choose Heavenly when the lake, town, and full trip matter. Choose Kirkwood when the skiers in the group want snow and terrain without the South Lake distractions.",

    alternatives: [
      { id: 'kirkwood-mountain', take: "The skier's Tahoe alternative, more remote and more focused on terrain." },
      { id: 'palisades-tahoe', take: "The larger Tahoe legend when expert terrain and ski culture drive the trip." }
    ],

    lastUpdated: "2026-05-31"
  },
  'kirkwood-mountain': {
    hook: "Kirkwood is Tahoe with fewer distractions and a lot more bite.",

    lede: "Kirkwood does not have Heavenly's lakefront theater or Palisades' big-name village energy. That is the appeal. It feels more remote, more weather-driven, and more focused on the skiing. When the snow is good, Kirkwood can make the rest of Tahoe feel a little too busy with itself.",

    body: [
      "The mountain is best for skiers who want terrain, snow, and a simpler sense of purpose. It has a rugged Sierra feel and enough challenge to keep advanced skiers interested without wrapping the day in a major resort scene.",

      "The tradeoff is convenience. Kirkwood is farther out, services are more limited, and storm access can be a real factor. It is not the easiest Tahoe answer. It is the answer when the skiers get the final vote."
    ],

    crowdTake: "Kirkwood is the Tahoe pick when snow and terrain matter more than nightlife. If the group wants lake views, lodging, and a broader vacation setup, Heavenly is the better other recommendation.",

    alternatives: [
      { id: 'heavenly-mountain-resort', take: "The lake-view, full-trip alternative for mixed groups and South Lake convenience." },
      { id: 'palisades-tahoe', take: "The bigger Tahoe expert-culture option with more name recognition and more scene." }
    ],

    lastUpdated: "2026-05-31"
  },

  // Oregon
  'mt-bachelor': {
    hook: "Bachelor is Oregon's big clean slate, huge, volcanic, and best when the weather lets it open up.",

    lede: "Mt. Bachelor has a different feel from the classic resort mountain. It is broad, high, volcanic, and tied closely to the Bend trip around it. When visibility is good and the lifts are spinning, the scale feels freeing. When the weather closes in, the mountain can get confusing fast.",

    body: [
      "The appeal is space. Bachelor gives skiers room to roam, and the Bend base makes the trip work even when the ski day is not perfect. It is one of the better western choices for people who want a full outdoor-town vacation without defaulting to Colorado or Utah.",

      "The tradeoff is exposure and layout. Storms, wind, and flat light can blunt the mountain's best qualities. Bachelor is best when you can give it a few days and let the weather sort itself out."
    ],

    crowdTake: "Choose Bachelor when you want scale, Bend, and a western trip that feels different from the usual list. If Portland access and Mt. Hood storm skiing matter more, Meadows is the other call.",

    alternatives: [
      { id: 'mt-hood-meadows', take: "The Portland-side storm-day alternative with a more classic Mt. Hood feel." },
      { id: 'timberline-lodge', take: "The historic Mt. Hood option when scenery, spring skiing, and lodge character matter." }
    ],

    lastUpdated: "2026-05-31"
  },
  'mt-hood-meadows': {
    hook: "Meadows is Portland's serious ski day, which means timing matters.",

    lede: "Mt. Hood Meadows is the Oregon mountain a lot of Portland skiers are really talking about when they say they are going skiing. It has the terrain, the storm energy, and the access to make it the region's workhorse. It also has enough demand that the day can get crowded fast.",

    body: [
      "The mountain is at its best when the storm cycle and visibility cooperate. There is more variety than casual visitors may realize, and the place can feel much bigger than a simple day-trip hill. It is a legitimate mountain with a metro-area crowd problem, not a small local area that got popular.",

      "The downside is the same as the value. Portland access brings Portland demand. Roads, parking, weather, and weekend timing all belong in the recommendation. Meadows is a great call when you plan around the rush."
    ],

    crowdTake: "Meadows is the move for a real Mt. Hood ski day from Portland. If you want a larger destination trip with Bend attached, Bachelor is the better other recommendation.",

    alternatives: [
      { id: 'mt-bachelor', take: "The bigger Oregon destination with Bend as the trip anchor." },
      { id: 'timberline-lodge', take: "The historic, scenic Mt. Hood alternative with a different pace and spring appeal." }
    ],

    lastUpdated: "2026-05-31"
  },

  // Washington
  'crystal-mountain-wa': {
    hook: "Crystal is Seattle's big-mountain answer, and everyone else knows it too.",

    lede: "Crystal Mountain has the terrain, views, and scale to be the clear heavyweight near Seattle. On a good day, with Rainier out and the upper mountain skiing well, the place can feel like the Pacific Northwest at full volume. The problem is that the same logic occurs to a lot of people at once.",

    body: [
      "The mountain rewards skiers who want more than a quick lap hill. Bowls, steeps, groomers, and a real alpine feel give Crystal a high ceiling by regional standards. It is not just convenient. It is legitimately strong.",

      "The friction is access and crowd pressure. Weekend traffic, parking systems, storm roads, and lift demand can all shape the day before the skiing does. Crystal needs the same kind of planning as any major metro-access mountain."
    ],

    crowdTake: "Crystal is the pick when terrain and weather justify the effort. If pass fit, night skiing, or a different Seattle-side drive matters, Stevens Pass is the first alternative to check.",

    alternatives: [
      { id: 'stevens-pass', take: "A different Seattle-area rhythm with night skiing and a separate pass logic." },
      { id: 'mt-baker-ski-area', take: "The snow-culture alternative when snowfall and a wilder mountain feel matter more than convenience." }
    ],

    lastUpdated: "2026-05-31"
  },

  // Alaska
  'alyeska-resort': {
    hook: "Alyeska is not a normal comparison. That is the whole reason to include it.",

    lede: "Alyeska gives the database a page that feels bigger than the usual ski-trip calculator. Alaska changes the conversation. The mountain has dramatic scenery, coastal weather, steep terrain, and a sense of distance that makes even major western resorts feel familiar by comparison.",

    body: [
      "The appeal is not convenience. It is the experience of skiing somewhere that feels different from the Lower 48 routine. For strong skiers and travelers who want the trip itself to be memorable, Alyeska has a story almost no other U.S. resort can copy.",

      "The warning is that this is not a casual recommendation. Weather, visibility, travel cost, and timing all matter. Alyeska belongs in the editorial set because it expands the site's authority, not because it is the most practical answer for most readers."
    ],

    crowdTake: "Recommend Alyeska when the reader is thinking trip-of-a-lifetime, not quick ski weekend. For a more practical big-terrain Pacific Northwest comparison, Crystal Mountain is the closest normal-world alternative.",

    alternatives: [
      { id: 'crystal-mountain-wa', take: "A serious Pacific Northwest mountain without the Alaska travel commitment." },
      { id: 'jackson-hole-mountain-resort', take: "Another dramatic expert-leaning trip when destination terrain is the priority." }
    ],

    lastUpdated: "2026-05-31"
  }

};

// ─── Methodology disclosure ───────────────────────────────────────────────────
// Appended to the bottom of every editorial article. Edit centrally here.
// The honest framing (personal-experience-vs-synthesized) is intentional and is
// a real E-E-A-T signal Google rewards. Don't replace it with marketing language.
const MOUNTAIN_EDITORIAL_METHODOLOGY = {

  // Section heading shown above the block on the page.
  heading: "How this review was put together",

  // Primary methodology copy. Three short paragraphs, kept honest on purpose.
  paragraphs: [

    "Mountain data comes from each resort's own operator materials. That covers trail counts, vertical drop, lift configurations, and ticket pricing. Pass affiliations track Epic, Ikon, and Indy Pass network listings. Historical snowfall averages combine OpenSnow archives, NOAA station data, and Open-Meteo's archive API.",

    "Editorial takes draw on ski media coverage (SKI Magazine, Powder, Storm Skiing Journal, regional outlets including NewEnglandSkiIndustry.com and Unofficial Networks), aggregator comparisons (ZRankings, PeakRankings, OnTheSnow) for cross-reference, and skier forums and trip reports for crowd-pattern signal. Live crowd outlook on the main tool is generated by WhereToSkiNext's own pressure model, which is built specifically for the question of when a mountain is likely to feel busy rather than how busy it has been historically.",

    "Where I have skied the mountain, that experience anchors the call. Where I have not, the take is synthesized from the sources above. No resort pays for ranking placement or editorial influence on WhereToSkiNext. Reviews are updated as conditions, ownership, or pass affiliations change."

  ],

  // Label used to introduce per-mountain sources, when an entry adds them via
  // its own `sources` field. Leave as is unless you want a different phrase.
  sourcesLabel: "Additional sources for this mountain",

  // Short integrity stamp shown after everything else, in small type.
  integrityStamp: "Independent review. No resort paid for placement or editorial influence."

};

// Author byline used on every editorial entry. Edit once, applies to all.
const MOUNTAIN_EDITORIAL_AUTHOR = {
  name: "Trip",
  title: "Founder, WhereToSkiNext.com",
  bio: "Grew up skiing and racing at Bousquet Mountain in the Berkshires. Now skis with my family across the Northeast and beyond."
};

if (typeof module !== 'undefined') {
  module.exports = { MOUNTAIN_EDITORIAL, MOUNTAIN_EDITORIAL_AUTHOR, MOUNTAIN_EDITORIAL_METHODOLOGY };
}
