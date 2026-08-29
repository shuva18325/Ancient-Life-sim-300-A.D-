# SAND & STEEL — WHAT SHOULD GO IN NEXT

A working list, ordered by how much each one actually fixes. Kept next to
`CODEMAP.md` so it stays with the code rather than in a chat log.

The test for everything below is the same one the rest of this project uses:
**can a harness measure it?** "The arenas look better" is not a task. "Nine
grounds produce nine distinct pictures" is.

---

## 1 — GAPS THAT ARE VISIBLE RIGHT NOW

### 1.1 The husband's romantic scene does not exist
`startRomantic()` refuses outright when `G.wife.male` is true and says so in
a toast: *"the scene is not drawn yet."* A player who chose to be a woman
gets a locked door where everyone else gets the scene. `drawRomanticFem` is
a woman braced on a wall and `drawVillaMale` is *you* — with a husband the
scene would paint him twice. Needs its own two figures.
**Done when:** a female player gets a scene, and it is a different picture
from the male one in all nine bends.

### 1.2 The AI never holds a gun
`drawArm2` routes to the two-handed gun stance only for `f.isPlayer`. Fight
a Teppō and he swings a matchlock like a sword through the whole reload.
**Done when:** a foe with a gun shows all four beats, same as the player.

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
