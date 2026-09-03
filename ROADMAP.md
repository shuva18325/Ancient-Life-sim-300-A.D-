# SAND & STEEL — WHAT SHOULD GO IN NEXT

A working list, ordered by how much each one actually fixes. Kept next to
`CODEMAP.md` so it stays with the code rather than in a chat log.

The test for everything below is the same one the rest of this project uses:
**can a harness measure it?** "The arenas look better" is not a task. "Nine
grounds produce nine distinct pictures" is.

---

## 1 — GAPS THAT ARE VISIBLE RIGHT NOW

### ~~1.1 The husband's romantic scene does not exist~~ — DONE
`startRomantic()` refuses outright when `G.wife.male` is true and says so in
a toast: *"the scene is not drawn yet."* A player who chose to be a woman
gets a locked door where everyone else gets the scene. `drawRomanticFem` is
a woman braced on a wall and `drawVillaMale` is *you* — with a husband the
scene would paint him twice. Needs its own two figures.
**Done when:** a female player gets a scene, and it is a different picture
from the male one in all nine bends.
**Result:** `drawRomanticFig` carries both bodies through the same culture
bend. Four cultures × two bodies = eight distinct pictures, zero collisions.
**And then it still did not work in the game**, because `W` routed a woman
away from `startRomantic` entirely — a guard added back when the art did not
exist. Both directions run now: `W` and your spouse braces (his body, the
culture's bend); or he crosses on his own and ASKS — "「そこの柱に。」— the
post, not the screen" — and if you say yes, you are the one braced. The
scene carries `bender`, because drawing `G.wife` unconditionally is right
when you asked and exactly wrong when he did.

### ~~1.2 The AI never holds a gun~~ — DONE
`drawArm2` routes to the two-handed gun stance only for `f.isPlayer`. Fight
a Teppō and he swings a matchlock like a sword through the whole reload.
**Done when:** a foe with a gun shows all four beats, same as the player.
**Result:** a Teppō carries a matchlock, a Taishō the horse pistol, an Ikki
the clay bomb. He shoots at range, backs off through the reload and draws
inside a sword's length. Caught on the way: his shots were landing on
*himself*, because every projectile in the file assumed the shooter was the
player and the target was `FT.foe`.

### ~~1.6 The selection screen was broken in one world and wrong in four~~ — DONE
Three separate faults, all on the first screen a player sees.
**(a) Every Rkrai career was locked.** The nine archetypes were written
without a `rank`, so `archRank` defaulted them all to 1 and the bottom rung
of the Rkrai ladder — the rung you start on — could choose nothing. They were
also written without `loadout`, `skin`, `tunic` or `stats`, so
`drawCardPortrait` read `A.loadout.armor` off `undefined`.
**(b) Every woman in the game was a gladiatrix.** One female body existed on
that screen and it was a moulded bronze cuirass, a strophium and a helmet —
so a Han gentry daughter, a Sengoku merchant's wife and a Rkrai tally-clerk
all came off the card dressed for the arena with a sword over the shoulder.
**(c) The Rkrai kit drew as Roman.** Ten garments, three helms and ten
objects had no branch anywhere, so fifteen careers rendered as seven bare
torsos holding the same grey bar.
**Done when:** every world offers something at its own bottom rung, and each
world × sex produces as many distinct portraits as it has cards.
**Result:** 14/14 west, 6/6 east, 9/9 Wa, 15/15 Rkrai — for both sexes, up
from 7 of 15 for Rkrai men. A woman is armed only where the record arms her
(Rome's arena off the bottom rung; the onna-musha with the naginata; steppe
riders; the two Rkrai trades that fight) and is otherwise dressed by RUNG and
by PEOPLE — poor wool, decent cloth or fine cloth, in a stola, a ruqun, a
kosode, a draped sari, a coat or a parka with a wolverine ruff.

### ~~1.7 `__SS.sel` was a function~~ — DONE
The test-hook object declares `sel` twice — `get sel(){return sel;}` and, four
hundred lines later, `sel:()=>sel`. A duplicate key silently wins, so every
harness that set `S.sel.world='rk'` was writing a property onto an arrow
function and screenshotting a screen that had never changed world. Both
entries are the getter now, which is how the world-by-world card sweep found
1.6 in the first place.

### 1.3 Beasts have no swing arc
`pushSwingTrail` bails on `atkType==='elbow'` and beasts use `beastBite`,
so a lion's maul has none of the new impact language. A claw should leave a
three-line rake, not a blade ribbon.
**Done when:** a beast attack draws a trail that is visibly *not* the sword one.

### 1.4 Three grounds are skipped by the new atmosphere
`drawArenaForeground` returns early for `siege`, `pit`, `build:'none'` and
`build:'field'` — so a villa siege, the pit, the steppe hunt and a Sengoku
battlefield get no haze, no near edge, no vignette. Each needs its own: a
pit has walls very close, a field has none at all.

### 1.5 The ranged shelf just vanishes for a gladiator
Correct — no arena type carried a bow — but a shelf that silently disappears
reads as a bug. It should say why.

---

## 2 — THINGS THAT ARE STILL ROMAN IN NON-ROMAN PLACES

This has been the through-line of the whole project and it is not finished.

**A full screen sweep now runs clean.** `romsweep.cjs` walks every screen in
Luoyang and in Kai and greps the rendered text for forty Roman words. Both
worlds report clean. What it found and what was done:
the public-face meter said *"what Rome thinks you are"* (now 面子 / 世間体 /
whatever that culture calls it, with its own rule underneath); the barber
said *Rome dyed its hair constantly* (now camellia oil, gallnut, lime-water);
the clothier said *Rome had views on who was allowed to wear what* (now Han
sumptuary law, 身分, bone-rank); the cut list offered **THE ROMAN CROP** in
Kai and the clothier stocked a **toga** (both now filtered to the culture's
own pool); two purses were counted in denarii on a Japanese screen; the Han
bath-house handed you a **strigil**, which is Greco-Roman — 澡豆 bath-beans
now; and a free **gladius** was on the rack in every world, because
`gearStockedHere` exempted anything with `cost:0` and the starter sword is
free.

**The sweep now covers three worlds and eleven screens** — `romsweep.cjs`
walks Luoyang, Kai AND Leokanis through the shop, map, villa, stable, training
ground, intrigue, domus, fight brief, standards, market, the suitor floor and
the body map. All three report clean. What it caught this round:

- **The whole taboo frame on the Rkrai villa was Rome's** — Ovid, *os
  impurum*, MATRONA and the Senate, because `EAST_ACTS` had no `rkrai` row.
  It has one now, and the axis is THE TALLY: a coast that appointed somebody
  to rule on the question never grew a taboo to settle it, and audits the
  store instead.
- **The fight brief paid in denarii in every world**, banned a weapon drawn
  from the whole catalogue rather than from the local rack (a ground in Kai
  banning a Numidian javelin), and put the Parthian frontier on the Alaskan
  coast.
- **The barber and the clothier had no Rkrai shelf**, so THE ROMAN CROP and
  THE TOGA were on the rack in Leokanis.
- **Every suitor was Roman.** `makeSuitorFor` asked for `makeBride('roman')`
  every time and then stamped a gens on top, so a Han daughter was called on
  by Gaius of the Cornelii and a Rkrai one by his cousin — and all six trades
  on offer were Roman (a soldier of the legions, a charioteer of the Greens).
  There are now four pools of trades and the surname carries the house.
- **"A ROMAN GREETING"** was the slap button in fifteen cultures.
- **The heir inherited a *ludus*** in all four worlds.
- **The province governors** were one Roman list, so a Han commandery and a
  Rkrai province were both being held by "a young senator on his first
  command".
- **`SKIN_BY_CULT`, `HAIR_*_BY_ETH`, `BEARD_BY_ETH`, `OUTFIT_BY_ETH`,
  `PART_TIERS`, `TABOO`, `TABOO_VOICE`, `HOUSE_SETS`, `BRIDE`,
  `BRIDE_ETHS_BY_WORLD` and `RANK_LOCK`** had no Rkrai row and inherited
  Rome's. All filled.

### 2.1 The pool, the bath and the wardrobe are Roman everywhere
`drawShadowPlay` builds a real per-culture room for `place==='bed'` via
`drawHall`, but `pool`, `bath` and `wardrobe` still draw a marble
caldarium and a cedar cupboard in Kai and Luoyang. Japan has the **sentō**
and the **furo**; Han has its own bath-house; a **tansu** is not a cedar
armoire. Same treatment as the halls.

### 2.2 The body-part ladders are English
`BODY_PARTS` names its tiers *Plain / Fair / Pretty / Lovely / Stunning*.
The gaze weights and the phrases are localised now; the ladder itself is not.
Han has a vocabulary for this and so does the Sangam corpus.

### 2.3 Wa houses do not gate gear
Free range is right for non-gladiators, but the twenty-two houses had
identities: the Takeda are cavalry, the Saika are gunners, the Ikkō-ikki are
a peasant league with farm tools. A house should *lean* the rack even where
it does not close it.

### 2.4 One venue per ground type, twenty-two houses
Carried over and still open. The banners differ; the buildings do not. A
Takeda field and a Mōri port should not be the same six grounds recoloured.

---

## 3 — DEPTH ON WHAT ALREADY WORKS

### 3.1 A gladiatrix armatura
Female arena fighters are attested — the Halicarnassus relief shows two by
name, and Domitian's games are recorded. They fought without helmets, which
is exactly the kind of hard visual fact `ARMATURA` is built to carry.

### 3.2 The three-eyed gun's burst is invisible
`sanganju` has `burst:3` and a longer `burstCd`, and nothing on screen says
which of the three barrels is up. Three barrels is the entire reason anybody
tolerated how bad it was.

### 3.3 Weather is rain and nothing else
`WET_CHANCE` exists because the matchlock needed it. Heat should cost
stamina, wind should push arrows, and mud should shorten a hop.

### 3.4 Crowd sound per ground
One `cheer`. A dōjō is silent and disapproving, a shrine ground is packed, a
gun range is a firing party, a battlefield has nobody watching who is not
about to be in it. The visual side of this is already built — `FT._crows`
goes to zero on a field — and the audio ignores it.

### 3.5 Blood behaves the same on every surface
`t.decals` soak into sand. They should not do that on tatami, on marble, or
on water.

---

## 3B — THE RKRAI SHORE, SECOND PASS

### ~~The country was not organised~~ — DONE
Eight careers, two of which hunted, and no government at all above them.
Now fourteen careers of which **six are administration**: a tally-clerk, an
arbiter of the post, the Mastery of Love, the Mastery of the Reach, a
province-holder, and the head of state. Two still hunt. That ratio is the
argument the sheet is making.

### ~~The leader had no name~~ — DONE
**THE RKRAUN** — *Rkrai* + *ruun*, "the house of all of it". Not a king:
chosen out of the great houses by the Ten Masteries sitting together, for
nine winters, and WEIGHED OUT in public at the end of them by a clerk
forbidden to be his friend. Comes short and he is put back a rank in
daylight with a notch cut off his own post. He carries a steelyard instead
of a spear. `RK_GOVERN` holds the structure and `openTheTen()` puts it on a
screen, with the five notches, the ten Masteries and the courtship rules.

### ~~The tenth Mastery~~ — DONE
**TAQ, WHO REACHES** — the phallus, and therefore distance, which this coast
treats as one idea rather than two. Taqruna Province and its port are named
for him because it is the longest reach of the country. His Mastery runs the
long relay. The holder is measured for it, publicly, ONCE, at seating, in
front of the Ten, and never again — and it is a real gate: `rkTaqrunSeated()`
reads `G.body.secret` against `RK_TAQRUN_NEED`.

### ~~"You need the looks of the title"~~ — DONE
`RK_WIFE_TITLES` — six of the ten Masteries are seated on a woman by the
evidence of her own body, one per body part, and the requirement is a NUMBER
on the chart: Rhaunek wants BOOTY 8, Ulvanne BUST 8, Taqrun LEGS 8, Kanne
FACE 8, Harra HAIR 8, Uvrak WAIST 8. The other four are earned and the coast
is loud about which is which. Each title carries a quirk that bites:
a Mesteri Rhaunek's house runs to **six slaps a day at double bond** because
the office is public and a silent house reads as an unhappy one; a Mesteri
Ulvanne **audits the take** for +10%; a Mesteri Harra **holds every promise
you have made** and both keeping and breaking one count double; Uvrak puts by
rations against a winter nobody believed in; Kanne is **paid by other houses**
to rule on the question. The body map she is read off now carries the band.

### ~~The floor, and the three rules~~ — DONE
`RK_COURT`. **The ages match** — inside three years is a proper match, past
ten the district reads a house that could not arrange better, and Harr logs
the number and recites it forever. **The mother watches and does not speak** —
an elite tradition, she is on the bench across the floor, ◉ WATCH HER reads
her face off the caller's actual flaws and quirks, she is nearly always right,
and she is not binding. **A son is not arranged for** — five callers instead
of three, drawn the way this coast admits they are drawn, and he weighs your
suggestion against what he wants and will say no to you in front of everybody.

### ~~The world hub was the Roman hub~~ — DONE
`applyHub()` branched on `wa` and `east` and nothing else, so a Rkrai game
fell into the Roman `else` and inherited it whole: a chariot-racing
**CIRCUS** button on a coast that has never seen a horse race, **ARMOURY /
STABLE / VILLA / HERBARIUS / TITLES / INTRIGUE**, and a map legend reading
**IMPERIVM ROMANVM · ANNO CC** under a headland in 900. A new `HUB_RK` table
hides the circus, the forum, the legion button and the silk road, and labels
the rest in the coast's own words — THE RACK, THE HERD & THE RACKS, YOUR
POST, YOUR KIN, THE FOUR PROVINCES, THE HEALER, NOTCHES & RANK, THE
ARBITRATION, SEND WORD — and the map legend now reads THE RKRAI SHORE · A
COLD 900. The fight button already read the real venue name off
`venueHere()` (THE SHINGLE, THE LONG FLOOR, THE POST-YARD, THE ICE-EDGE);
only the buttons around it were Rome's.

### ~~The fourth world sat on the card next to three sourced histories~~ — DONE
Moved behind a Settings easter egg rather than removed: it is an invented
people and does not belong beside three sheets that are checked against
sources, but hiding it entirely would waste the whole thing that got built.
`SETTINGS.rkUnlocked` gates it out of the `WORLD_IDS` row in `openCreate()`;
Settings carries a quiet, unlabelled prompt — "there is a rumour of a fourth
coast, if you ask it the right way" — that only answers to the literal,
case-sensitive string `PLEASE`. Once unlocked it stays unlocked (saved to
`localStorage` with the rest of Settings) and the world card behaves exactly
as it did before this — same one disclaimer, same everything.

### ~~The six titles had no faces~~ — DONE
The table and the requirement existed and the only way a player ever saw
one was to marry at random and discover she happened to clear a number.
There are **six of these offices on the whole coast**, they are SEATED, and
the holders are known by name — so the go-between now brings them by name.
`RK_TITLED_WIVES` is the six: **Rhaunek Talik** (the seat), **Ulvanne Ruun**
(the bosom, and the storehouse audit), **Taqrun Denik** (the reach, and the
long run), **Kanne Harra** (love, with a caseload and a fee), **Harra Ruun**
(the voice, one plait per settlement) and **Uvrak Denik** (the cold, who
came out of the bad winter the same shape). Each is built through
`makeBride` like anybody else and then has exactly one number forced — the
one her office is seated on — so she cannot be holding a title she does not
carry. Which of the six you are offered is gated by your own rung.

### ~~And the graphics for them~~ — DONE
A seventh garment cut, `parka`, and it is the first on that list built for
cold rather than drape: a sealed tube of hide with no opening below the
neck, flaring hard below the waist into the wide rounded lower body the
women's cut actually has — so **it follows the figure exactly where the six
offices are read off it**, and a Mesteri Rhaunek's is visibly wider through
the seat than a Mesteri Taqrun's from across a floor. The office is dyed
into the YOKE as a device (six of them, one per Mastery), the ruff arcs over
the shoulders and frames the face, and she stands in a **plank house with
her own house-post behind her**, notches cut where they can be counted,
instead of the marble alcove and Tyrian curtain she was standing in.
Six distinct portraits of six, and the marriage card carries the office, the
number, the household quirk and her own line.

### ~~The arena was Rome's~~ — DONE
`THEATRE_OF` had **no entry for any of the seven Rkrai regions**, so
`theatreOf()` hit its `||'italia'` default and every bout on that coast was
fought inside the Colosseum. Four grounds now, matching the venues the game
already names: **THE SHINGLE** (the beach below Leokanis, boats up on racks
and the drying frames behind), **THE LONG FLOOR** (inside a plank house, the
fire trench down the middle and the light coming through the smoke-hole),
**THE POST-YARD** (four great houses' posts and the arbiter's staff planted
in the ground) and **THE ICE EDGE** (pressure ridges, black water, and no
crowd because there is nowhere out there to stand). Each has its own `build`
kind with its own structure — they were briefly borrowing the Han courtyard,
the Wa dōjō and the steppe nerge — its own skyline, its own foe names, and a
crowd standing on a bank rather than seated in a terrace with aisle
stairways cut into it, because nobody there built seating.

### ~~And the house was Rome's~~ — DONE
`CULTURES.rkrai` had no `hall` key, so `hallStyle()` returned `'atrium'` and
the house on that coast was a Roman domus with a marble catch-basin in the
middle of the floor. `drawPlankShell` now: split cedar walls lashed in
courses, rafters running out overhead, the smoke-hole that is the only
daylight in the building (and the shaft it throws down the middle), the
house-post standing inside the door, the household's working gear and its
split tally-sticks hung on the walls, raised sleeping platforms along both
sides, and the fire trench running the length of the floor.

### ~~Four quirks were named in Rome and never left~~ — DONE
A wife on the Rkrai shore was **VESTAL-STRICT** after a Roman priestly
college; an insatiable one in Luoyang "was raised on Ovid"; a Queen of
Gossip in Kai heard "Rome's news a day before Rome does" out of "every
atrium in the district". `QUIRK_LOCAL` overrides only the rows that
actually name Rome, through the single `qText` chokepoint — Ambitious and
Possessive are not Roman ideas and are left alone.

### ~~Alaska seeped into Rome~~ — DONE
`openTheTen()` had no world guard of its own — the hub button was hidden
outside the Rkrai world, but anything that reached the function another way
put THE TEN AND THE RKRAUN in front of a Roman. And the hidden button kept
its **text**, so THE RKRAUN sat in the Roman DOM waiting for anything that
made a hidden button visible again. The screen refuses outside the coast
now and the label is blanked with it. `rkleak.cjs` is the mirror of
`romsweep.cjs` — it walks Rome, Luoyang and Kai through eighteen screens
looking for fifty Rkrai words, and all three report clean.

### ~~The villa dress was the Roman gown recoloured~~ — DONE
**THE ULVIK.** The parka is for weather and it is a serious object — sealed,
hooded, ruffed, built to keep a person alive. It also, necessarily, hides the
person inside it, which on this coast is a problem nowhere else on this map
has: six of the ten Masteries are seated on the evidence of a body and a
woman holding one is supposed to be LOOKED AT. So the house has a second
garment. Short, sleeveless, tanned inner hide, belted low and wide across
the hips in **the colour of whatever Mastery the house holds**, and cut away
high at the back — a Mesteri Rhaunek is *advised* into one at her seating, in
the same breath as the rest of her duties, and `openTheTen()`'s titles tab
says so. Coverage is forced low indoors as well, because `coverRich:0.92` is
true of the parka and was hanging a palla and a veil over the ulvik.

### ~~And the bend was everybody else's bend~~ — DONE
Everywhere else the bend is a tease whose entire mechanism is the hem riding
up the back of the thigh. The ulvik is already short and already cut away, so
that animation has nothing to do. What happens here instead is structural:
she commits early rather than easing in (braced on a post you do not
deliberate), the knees stay straighter, and **the cut travels** — at rest the
hide sits across the middle of the seat, and bent over the post it has ridden
up over the crown of it, with the wide beaded belt tipping off the level and
catching light as it goes.

### ~~And so was the arousal~~ — DONE
`drawTunicBump` is built around a TUNIC: loose cloth that tents and drapes off
the point. A Rkrai man indoors is in a stiff belted hide kilt over bare legs —
there is no drape in it. `drawKiltLift` hinges the front panel at the belt and
swings it out as one piece, the belt visibly takes the strain, and the bare
thigh is what gets exposed. The tells changed too: everywhere else the last
stage is a failure of the clothing and he is embarrassed — a sweat bead, a
look away. Kan holds appetite, the Mastery of it takes a fee, and this coast
treats the subject as a matter of record, so he does not look away.

### Still open here
- The seat block in `drawWifeFig` is four axis-aligned bands built to sit
  UNDER a gown. Drawn bare under the ulvik it is legible and it is the right
  silhouette, but the top edge still reads slightly as a shelf rather than a
  curve. Rebuilding it properly means touching all sixteen cultures.
- The house SHELL is Rkrai now but the furniture inside it is not: the
  staircase, the cedar wardrobe and the kitchen alcove still draw Roman.
  Same family as 2.1.
- The bedchamber poses have a Rkrai pose (`vi===21`) and a Rkrai hall, but
  ~~the six wife-titles do not yet change what is DRAWN~~ **DONE.** There are
  seven cuts of the ulvik (`RK_CUTS`), one per office plus the one a house
  with no seat wears, and each does its work somewhere different: the Rhaunek
  cut at the back, the Ulvanne laced under, the Taqrun split to the hip, the
  Kanne banded at the throat, the Harra bare at the shoulders so the plaits
  hang clear, the Uvrak sashed rib to hip. Past the ninth mark the Rhaunek
  bend has its own beat (`rkBendBeat`).
- ~~`RK_MASTERIES` has ten entries and the map has four provinces~~ **DONE.**
  Twelve seats (`RK_HUSB_TITLES` beside `RK_WIFE_TITLES`), every one of them
  occupied by a named holder on a stated number, and taking one means beating
  that number, holding the notch and paying for the feast — in front of the
  Ten, with the loser unseated in public. Nobody holds two. The four provinces
  and the capital are held the same way (`RK_PROVINCES`): each answers to one
  Mastery, you need a seat in it, and a held province pays every day.
  STILL OPEN: the province-holders are named as a tier and are not yet people
  you can meet; the seats do not yet change hands on their own while you are
  not looking, which they should.
- The Rkraun's nine-winter term is lore, not a clock. It should be a clock.

## 4 — SMALLER, CHEAP, WORTH DOING

- **Description boxes on the remaining screens.** Carried over. Most screens
  now explain themselves; a few still assume you know.
- **`bo_hiya_te` is referenced in a harness and missing from `GEAR`.** Either
  add the fire-arrow launcher or drop the reference.
- **The Egyptian slap noise falls back to English.** `SLAP_CRACK.egyptian` is
  `CRACK / SMACK / CLAP`. There is no attested Egyptian onomatopoeia for it —
  inventing hieroglyphs would be worse than the fallback, so this stays until
  there is a real source. Noted so it is a decision and not an oversight.
- **`ROMANTIC_BEND` has no entry for a husband.** See 1.1.

---

## 5 — DELIBERATELY NOT DOING

Recorded so they do not get re-proposed.

- **Imported art assets (Canva or otherwise).** The game draws every pixel in
  code, has zero dependencies and no build step. The artifact CSP blocks
  external images outright, so anything imported has to be a base64 data URI,
  and a smooth raster in a 480×270 pixel-art canvas reads as a sticker.
- **An armatura for eastern and Wa trades.** An ashigaru is not under contract
  to a lanista. Free range is the accurate answer, not a missing feature.
- **A helmet for the retiarius.** He fights bare-headed. That is the type.
