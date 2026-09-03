# CODE MAP — SAND & STEEL

`index.html` is one file on purpose: the whole game is a single page with no build step,
no dependencies and no external assets, so it can be opened from a `file://` URL, dropped
on a static host, or published as one artifact. That decision is why it is long. This map
is how you navigate it without scrolling.

Regenerate with `python3 tools/codemap.py` after adding sections.

## How the file is laid out

```
lines      1 –   146   the stylesheet
lines    147 –   696   the DOM: every screen, in markup, hidden until shown
lines    697 –   745   the IIFE opens; canvas handles, helpers, show() / $()
lines    746 – 11000   THE DATA     regions, gear, cultures, ladders, currencies, venues
lines  11000 – 20000   THE DRAWING  arenas, figures, halls, portraits, the map plates
lines  20000 – 31000   THE SCREENS  villa, market, court, legions, intrigue, standards
lines  31000 – 34000   THE ATLASES  the eastern sheet, the Wa sheet, travel, the map
lines  34000 – end     wiring, save/load, the loop, and the __SS test export
```

## Conventions that will bite you if you skip them

- **Every new function must be added to the `window.__SS` export block at the end.**
  The Playwright harnesses reach the game only through it; a function that is not
  exported cannot be tested.
- **Every new `G` field needs a default in `migrate(g)`.** Old saves load through it.
- **Canvases built in JS need `position:static`** in their inline style. The stylesheet
  says `canvas{position:absolute;inset:0}` for the two game canvases, and anything built
  later inherits that and flies to the top-left corner of the screen.
- **Region lookups go through `regionAny(id)`, never `REGION_BY_ID[id]`**, which holds
  only the Roman sheet. There are three atlases: `REGIONS`, `REGIONS_EAST`, `REGIONS_WA`.
- **Three worlds:** `west`, `east`, `wa`. `worldOfRegion()`, `playerWorld()`,
  `regionsForWorld()` and `classesForWorld()` are the seams.
- Section banners carry the sourcing for whatever they introduce. The history is in the
  comments on purpose — it is the reason the numbers are the numbers.

## The sections, in order

| line | section | what it defines |
|---:|---|---|
| 703 | SAND & STEEL — Gladiators of 200 A.D. | `cv`, `ctx`, `tcv`, `tctx`, `TS`, `W`, `GROUND`, `WALL_L` … +12 more |
| 748 | DATA — real historical content from c.200 A.D. | `REGIONS`, `REGION_BY_ID`, `NON_ROMAN`, `ROMAN_REGIONS`, `REGION_TITLES`, `CLASSES` |
| 878 | AND WHICH TRADE THE GROUND ITSELF FIELDS | `WA_GROUND_CLASSES`, `classesForWorld`, `CLASS_ORDER`, `CLASS_ORDER_EAST`, `GEAR` |
| 949 | THE ARSENAL OF THE SENGOKU — and the sword is not the point of it | — |
| 963 | THE POOR MAN'S ARSENAL — and it is the farm shed | — |
| 980 | BAMBOO, AND WHY — the correction | `gearOf`, `PILUM`, `aimZoneFor`, `rangedDamage`, `pilumDamage`, `BOWS` |
| 1255 | THE YUMI — and why the samurai spent five hundred years on it | — |
| 1272 | THE GUNS — and the trade-off IS the history | — |
| 1315 | THE REST OF THE POWDER — and the honest note about rifles | `bowOf` |
| 1348 | WHAT THE SHOP ACTUALLY STOCKS | `gearWorldOf`, `gearStockedHere`, `isGun` |
| 1376 | IT IS NOT A BOW. STOP CALLING IT A BOW. | `rangedWords`, `rangedShelfName` |
| 1406 | YOU CANNOT SIMPLY BUY THIS | `rankTier` |
| 1435 | THE ARMATURA — a gladiator IS his kit | `ARMATURA`, `myArmatura` |
| 1511 | AND WHO GETS TO IGNORE IT | `OFFTYPE_PURSE`, `canChooseOwnKit`, `offTypeWhy`, `armaturaOn`, `inArmatura`, `gearGate`, `gearBuyable`, `rangedCooldown` |
| 1583 | THE WEATHER — which exists in this game only because the gun does | `WET_CHANCE`, `rollWeather`, `isWet`, `misfireChance`, `FOE_NAMES`, `FOE_TITLES`, `ARCHETYPES`, `ARCH_ORDER_WEST` … +4 more |
| 1722 | TWO WORLDS, ONE GAME | — |
| 1734 | THE SEVEN SENGOKU CAREERS | — |
| 1743 | THE ROLE IS THE RANK — nobody chooses out of the whole list | `WORLDS` |
| 1917 | AND A FOURTH, WHICH IS NOT A REAL PLACE | `WORLD_IDS`, `worldOfArch`, `regionsForWorld`, `regionAny`, `worldOfRegion`, `playerWorld`, `SOCIAL`, `SOCIAL_ORDER` |
| 1990 | THE EASTERN LADDER — nobody in Luoyang was ever a patrician | `SOCIAL_EAST` |
| 2099 | WA · and the ladder here is measured in RICE | — |
| 2128 | THE RKRAI LADDER — five notches, cut in the post | `socialSetFor`, `socialSetForSel`, `socialRung`, `playerRung` |
| 2176 | THE OTHER LEDGER'S SELLER — who you go to for it depends entirely on | `SECRET_SELLERS`, `ELITE_MEN`, `ELITE_WOMEN`, `PLOT_TARGETS`, `OFFICES`, `KEY_PROVINCES`, `keyCount`, `GEN_NAMES` … +2 more |
| 2263 | MARRIAGE — take a wife once powerful (or, as an elite, by dynastic duty) | `BRIDE` |
| 2291 | AND EVERYWHERE ELSE ON EARTH | `BRIDE_ETHS`, `BRIDE_ETHS_BY_WORLD`, `WA_PORTS`, `brideEthsHere`, `homeBrideEth` |
| 2374 | THE CULTURES — what a people actually BELIEVED, as numbers | `CULTURES` |
| 2418 | THE RKRAI — INVENTED. The only culture in this table that is not | — |
| 2541 | THE EASTERN PEOPLES — four more rows in the same tables | — |
| 2631 | WA · and it is thirteen hundred years from everything else in this game | `CULTURE_IDS`, `cultureById`, `ARCH_CULTURE`, `ARCH_RANK`, `archRank`, `RANK_LOCK`, `RANK_COL`, `rankLockNote` … +5 more |
| 2794 | TRIBAL RANK — a chieftain's wife did not dress like a herdsman's | `isTribal`, `tribalRank`, `tribalTier`, `tribalCloth`, `coverageBand`, `localCulture` |
| 2878 | THE MORES — what each people's LAW actually did about it | `MORES` |
| 3019 | WA · what a household may and may not do, in this century | `moresOf` |
| 3056 | RIGGING THE BOUT — the fee gets you in the room, the man costs extra | `RIG_FEE`, `RIG_BUILDS`, `rigBuild`, `rigManPrice`, `rigSuspicion`, `rigPurseMul`, `drawRigCandidate` |
| 3179 | THE COIN IN YOUR HAND — and it is not a denarius everywhere | `CURRENCY` |
| 3250 | SENGOKU JAPAN · and it has THREE moneys at once, which is the point | `CURRENCY_OF`, `CURRENCY_REGION`, `currencyHere`, `coinWord`, `coinShortStr`, `drawCoinIcon`, `_COINIMG`, `coinIconURI` … +1 more |
| 3422 | THE MOS — WHAT ROME ACTUALLY OBJECTED TO, AND WHY | `ACTS`, `ACT_BY_ID` |
| 3485 | THE EASTERN BEDCHAMBER — a different question entirely | `EAST_ACTS` |
| 3600 | WA · and the household is a chapter of the war | — |
| 3652 | THE EASTERN MATCH — nobody in Luoyang negotiates a Roman dowry | `MATCH_EAST`, `matchEast`, `matchEastForPlayer`, `eastDowryLine`, `buildEastMatchCard` |
| 3779 | AND THE RKRAI SHORE, WHICH JUDGES A HOUSE ON ITS STORE | `eastActSet`, `eastActById`, `eastAxisValue`, `eastAxisBand`, `resolveEastAct`, `TABOO`, `TABOO_VOICE` |
| 3957 | HOW FAR ROME'S OPINION ACTUALLY REACHES | — |
| 3982 | WHERE MEN ACTUALLY FOUGHT — and it was NOT an amphitheatre everywhere | `VENUES` |
| 4080 | WA — and there is no arena anywhere in it | `VENUE_OF` |
| 4151 | THE RKRAI GROUNDS | `RK_VENUES`, `VENUE_REGION`, `venueHere`, `venueName`, `venueIsShow`, `REPUTATION_REACH`, `reputationReach`, `reachBand` … +9 more |
| 4360 | RESOLVING AN ACT — does anyone find out, and what does it cost | `actWitnessChance`, `resolveAct`, `actHerView`, `osImpurumTick`, `localMores`, `legalExposure`, `exposureSplit`, `fashionOffence` |
| 4482 | THE EYE, DECIDED ONCE, FOR EVERY FACE IN THE GAME | `INK_EYE_CULTURES`, `inkEyes`, `inkEyesOver` |
| 4566 | HAIR — ONE SYSTEM, DRAWN THE SAME EVERYWHERE. | `HAIR_F`, `HAIR_M`, `BEARD_M`, `HAIR_M_BY_ETH`, `BEARD_BY_ETH`, `HAIR_COL_M`, `HAIR_F_BY_ETH`, `OUTFITS_M` … +9 more |
| 5082 | SMALL-SCALE HAIR — one routine, every sprite that is not a portrait | `drawHairSmall`, `hairStyleFallback`, `beardFallback`, `outfitFallback`, `hairStyleName`, `beardName`, `fixTraitsForSex`, `ensureQuirks` … +2 more |
| 5201 | BLOODLINE — every spouse carries LOOKS, SMARTS and TRAITS. Children | `BUILDS`, `LOOK_STAGES` |
| 5217 | AND THE LADDER ITSELF IS A ROMAN LADDER | `LOOK_LADDER`, `LOOK_BLURB`, `lookLadder`, `lookStage` |
| 5297 | THE SAME LADDER, ON THE WALL. The shadow-play reads the very stage the | `SHADOW_STAGES`, `shadowStage`, `BODY_PARTS`, `BODY_PARTS_M`, `SECRET_PART`, `secretUnlocked`, `secretAllowed`, `partsFor` … +1 more |
| 5379 | AND THE RUNGS OF EACH PART, WHICH ARE ALSO A JUDGEMENT | `PART_TIERS`, `partTiersHere`, `partTier` |
| 5448 | AND THE WORDS ARE ROMAN TOO | `BODY_WORDS`, `bodyWordsHere`, `partPhrase`, `bodyBlurb` |
| 5524 | DIRECT SPOUSE DESCRIPTIONS  (Settings → Direct spouse descriptions) | `BLUNT_WORDS`, `BLUNT_PLURAL`, `bluntWord`, `bluntDowry`, `bluntBrief`, `bodyTierLine`, `rollBody`, `makeImpossibleBody` |
| 5609 | YOUR OWN BLOOD — rolled at the enrolment table like anyone else's. | `rollPlayerBody`, `bodyAvg`, `ensurePlayerBody`, `selfSubject`, `syncPlayerLooks` |
| 5663 | THE HOUSE YOU WERE BORN INTO — a father, a mother, brothers and | `FATHERS`, `MOTHERS`, `SIB_ROLES_M`, `SIB_ROLES_F`, `NAMES_M`, `NAMES_F`, `makeFamily`, `kinAge` … +1 more |
| 5798 | THE FAMILY PORTRAIT GALLERY — every name in your house gets a drawn | `KIN_SKINS`, `KIN_HAIRS`, `kinHash`, `kinLook`, `kinInherit`, `drawKinPortrait` |
| 6071 | THE IMPERIAL COURT — the people who actually decide whether a purple-born | `PRAETORIAN_PREFECTS`, `COURT_FIGURES`, `makeCourt`, `COURT_LEVERS`, `courtBonus`, `courtCultivateCost`, `purpleRisk`, `opinionsOfYou` |
| 6167 | LOOKS ARE POLITICS. For a prince, a princess, an Augusta or a powerful | `beautyPower`, `BEAUTY_GIFTS`, `toleranceScore`, `loyaltyScore` |
| 6233 | PROVINCIAL MANAGEMENT — a title is not a trophy, it is a job. Every | `PROV_GOVS`, `PROV_GOVS_EAST`, `PROV_GOVS_WA`, `PROV_GOVS_RK`, `provGovList`, `provOf`, `heldProvinces`, `provUnrestAvg` … +4 more |
| 6306 | PUBLIC COMPLAINTS — the price of governing. Petitions come up from the | `COMPLAINT_KINDS`, `rollComplaint`, `pendingComplaints`, `complaintPressure` |
| 6343 | CALL-OUTS — somebody in the crowd says something about you, out loud, | `CALLOUT_LINES_F`, `CALLOUT_LINES_M` |
| 6364 | AND THE STREET DOES NOT SHOUT THE SAME THING EITHER | `CALLOUT_CULTURE`, `calloutLines`, `calloutDue` |
| 6464 | PUBLIC EYES — where the eyes actually go. A walking figure, an eye on | `GAZE_BASE_F`, `GAZE_BASE_M` |
| 6471 | WHERE THEY ACTUALLY LOOK, AND IT IS NOT THE SAME PLACE | `GAZE_CULTURE`, `GAZE_VOICE` |
| 6608 | THE LAST OF THE ROMAN FURNITURE | `FACE_WORD`, `FACE_RULE`, `faceRule`, `highBornLabel`, `highBornNote`, `gravitasWord`, `DYE_WORD`, `dyeWord` … +7 more |
| 6835 | QUIRKS — THE MIDDLE TIER | `WIFE_QUIRKS` |
| 6909 | THE OUTER TIERS. Three bands was still too flat — everything good was | `WIFE_BOONS`, `WIFE_BANES`, `boonById`, `baneById`, `hasBoon`, `hasBane`, `rollBoons`, `rollBanes` … +6 more |
| 6984 | THE QUIRKS WERE NAMED IN ROME AND NEVER LEFT | `QUIRK_LOCAL`, `qText`, `bondCeiling` |
| 7055 | THE KILT, WHICH DOES NOT TENT | `drawKiltLift`, `rollQuirks`, `flawById`, `flawLabel` |
| 7149 | THE CHIPS. These used to be three words of coloured text in a row, | `CHIP_TIERS`, `traitChip` |
| 7197 | A TRAIT THAT BELONGS TO THE OTHER SEX IS NOT YOURS | `traitsForSex`, `traitsHtml`, `traitsDetailHtml`, `hasFlaw`, `rollFlaws`, `TIERS`, `spouseTierName`, `SLAP_BUTTON` … +14 more |
| 7577 | THE BODY MAP — a matchmaker's chart, bought once for 200d. Every region | `heatColor`, `bmCache`, `bmResetCache`, `bmOnce` |
| 7599 | THE SHAKE — and it is HER OWN MEASUREMENTS doing it | `SHIMMY`, `shimmyOf`, `SHIMMY_TIER`, `shimmyStart`, `shimmyTick`, `shimmyLive`, `shimmyEnv`, `shimmyHip` … +5 more |
| 7702 | SLAP PHYSICS — one damped spring, shared by every figure that can take one | `SLAPJ`, `slapKick`, `slapJigTick`, `slapJig`, `slapLive` |
| 7736 | THE CHART FIGURE — built FOR the chart, not borrowed from the villa | `chartLandmarks`, `drawChartFig`, `drawBodyMap` |
| 8000 | THE REAL FIGURE, if you asked for it. | `rgbTriple`, `shade2`, `lit2`, `rgbA`, `drawMapReadout`, `drawMapScale`, `drawWalkFigure`, `drawEyeGlyph` … +12 more |
| 8916 | COURTSHIP — YOU HAVE TO TALK. | `COURT_RANKS` |
| 8946 | WHERE YOU STAND, ON WHATEVER LADDER YOU ARE ON | `socialRankIndex`, `wealthRungs`, `effectiveRank`, `courtAccess`, `COURT_PROMPTS`, `COURT_BOASTS`, `MEDIUM_CENSOR`, `COURT_RESULT` … +22 more |
| 9640 | THE LEGACY HOUSE — a dynastic seat you plant in a province of your | `LEGACY_INFO` |
| 9662 | AND YOU CANNOT SEAT YOUR NAME IN AEGYPTUS FROM KYŌTO | `LEGACY_EAST`, `LEGACY_WA`, `legacySet`, `legacyLevels`, `legacyWord`, `legacyInfo`, `LEGACY_LEVELS`, `legacyScore` … +4 more |
| 9795 | GAME STATE / SAVE | `SAVE_KEY`, `SLOT_KEY`, `NSLOTS`, `saveSlot`, `slotKey`, `setSlot`, `slotInfo`, `G` … +1 more |
| 9911 | THE GLADIATRIX — a woman fights in DEFIANCE of the Emperor's ban. The | `GLADIATRIX_EVENTS`, `gladiatrixStageFrom`, `gladiatrixAfterWin`, `gladiatrixBriefBlock`, `checkFamilyMan`, `elevateWife`, `migrate` |
| 9987 | AN OLD SAVE MUST NOT LOSE WHAT IT WAS ALREADY CARRYING | `saveGame`, `hasSave`, `loadGame` |
| 10032 | MATURE-CONTENT GATE | `ADULT_KEY`, `ADULT`, `setAdult`, `SETTINGS_KEY`, `SETTINGS`, `saveSettings`, `DIFF`, `diffMul` |
| 10053 | THE RICHER YOU GET, THE BETTER THEY SEND | `wealthHeat`, `wealthMul`, `wealthNote`, `STATS_KEY`, `STATS`, `saveStats`, `bumpStat`, `ACHIEVEMENTS` … +4 more |
| 10124 | UI: stat bar + toast | `refreshStatbar`, `MOUNTS`, `toastT`, `toast` |
| 10161 | PIXEL SPRITE: gladiator (drawn procedurally, faces +x by default) | `SKIN` |
| 10166 | WHOSE FACES ARE IN THE ROOM | `SKIN_BY_CULT`, `skinHere`, `pickSkin`, `skinAt`, `shade`, `mixHex` |
| 10231 | THE YEARS, WRITTEN ON THE FACE. One number in, four things out — and every | `ageMarks`, `greyHair`, `agedSkin`, `paletteFor` |
| 10262 | THE SWING YOU CAN SEE — arcs, impact, and weight | — |
| 10286 | THE AIR IN THE PLACE, AND THE THING YOU ARE SEEING IT OVER | `drawGroundHaze`, `drawArenaForeground`, `weaponTipLen`, `pushSwingTrail`, `updateSwingTrails`, `drawSwingTrails` |
| 10431 | AND THE HIT ITSELF | `impactBurst`, `updateImpacts`, `drawImpacts`, `swingSfx`, `drawGladiator`, `drawBeast` |
| 10581 | THE SASHIMONO — the flag on a man's back | `drawSashimono`, `drawGladBody`, `drawStuck`, `drawSlashFx`, `drawLeg`, `drawTorso` |
| 10733 | THE EAST AND THE SENGOKU, ON THE BODY | `drawHead` |
| 10831 | THE EYES, AND THEY ARE NOT THE SAME EYES EVERYWHERE | `drawHelmet2` |
| 10950 | THE SENGOKU HEAD — and none of it is a Roman galea | `drawShield2`, `drawArm2` |
| 11145 | YOU DO NOT WIND UP A MATCHLOCK | `drawGunArms`, `drawThrowArm`, `drawWeapon2` |
| 11281 | THE FIVE BAMBOO PIECES — and not one of them is a bamboo sword, | — |
| 11522 | ARENA RENDERING | `makeFighter`, `FT`, `makeArenaFoe` |
| 11598 | AND THE MAN OPPOSITE ACTUALLY CARRIES ONE | `FOE_GUN`, `armFoeRanged`, `foeGunAI`, `NAVAL_NAMES`, `BEASTS`, `pickBeast`, `makeBeast` |
| 11685 | NEMESIS — a named rival who rises with you, taunts, meddles, and finally | `NEM_FIRST`, `NEM_EPITHET`, `NEM_TAUNTS`, `nemFull`, `makeNemesis`, `nemesisAfterWin`, `drawNemesisPortrait`, `nemesisBriefBlock` … +10 more |
| 12014 | THE SIDEARM — 抜刀, and it is why the daishō exists | `hasSidearm`, `sidearmName`, `drawnWeaponName`, `rangedReady`, `switchWeapon`, `autoDrawBlade`, `playerRanged`, `beginRangedCharge` … +5 more |
| 12195 | THE BLAST — the only area weapon in the game, and it is ceramic | `blastAt`, `updateBurns` |
| 12249 | THE RAIN — which has been a number nobody could see | `initRain`, `updateRain`, `drawRain`, `drawWetNotice`, `gunSmoke`, `updateGunSmoke`, `drawGunSmoke`, `throwPilum` … +8 more |
| 12541 | WHAT A MATCHLOCK LOOKS LIKE, and it is not a musket | `drawHeldGun`, `drawHeldBomb`, `drawHeldBow`, `drawArrow`, `aiUpdate`, `beastHop`, `beastLunge`, `beastBite` … +14 more |
| 13230 | ARENA DRAW | `drawVillaBg`, `drawDeadTree`, `drawPitBg` |
| 13353 | THE THEATRES OF THE EMPIRE | `ARENA_THEATRES` |
| 13432 | THE EASTERN GROUNDS — and NOT ONE OF THEM IS AN AMPHITHEATRE | — |
| 13503 | THE SIX GROUNDS OF THE SENGOKU — and every house has its own | — |
| 13513 | THE RKRAI SHORE — four grounds, and not one of them is a show. | `waHouseHere`, `THEATRE_OF`, `theatreOf`, `THEATRE_FOES`, `theatreFoeName`, `crowdIsHostile`, `drawTheatreSkyline`, `drawArena` |
| 14011 | WHAT IS ACTUALLY STANDING BEHIND THE FIGHTERS | `drawShadow`, `drawCrowd`, `drawEmperorBox`, `drawVerdict`, `pixelText` |
| 14685 | AUDIO (tiny WebAudio blips, guarded) | `AC`, `noiseBuf` |
| 14690 | THE SOUND ENGINE | `MASTER`, `audioBus`, `revSend`, `blip`, `hiss`, `tone`, `noise`, `sfx` |
| 15034 | INPUT  (exact scheme required) | `held`, `edge`, `setEdge`, `consume`, `resetInputEdges`, `touchPref`, `touchCapable`, `coarsePointer` … +5 more |
| 15154 | MAIN LOOP | `state`, `last`, `loop`, `menuStars`, `drawMenuBg` |
| 15229 | ARMY BATTLE — army-vs-army (a different battle type, no 1v1) | `BT`, `armyBattle`, `updateBattle`, `drawBattleSoldier`, `drawBattleHorse`, `drawBattleHost`, `drawBattle`, `finishBattle` |
| 15388 | THE CIRCUS MAXIMUS — chariot racing, an entirely separate game. | `FACTIONS`, `RACER_NAMES`, `RACE_LAPS`, `LANE_Y`, `RC`, `startRace`, `aiRace`, `updateRace` … +5 more |
| 15554 | THE DAUGHTER'S PATH — THE COURTS. An heiress may refuse the sand and | `CASE_TYPES`, `ARGUMENTS`, `PATRONS`, `RIVAL_ADVOCATES`, `LANDMARKS` |
| 15599 | THE REGALIA — the visible instruments of power. Julia Domna, empress in | `REGALIA`, `hasRegalia`, `powerScore`, `CASE`, `caseDifficulty`, `startCase`, `renderCase`, `playArgument` … +5 more |
| 15868 | THE DOMINUS CONSOLE — cheats. Coin, glory, provinces, the purple. | `openCheats`, `openCircus` |
| 16090 | THE FAMILY PORTRAIT — the whole house, painted in one gold frame | — |
| 16095 | HIS FACE, ONCE, FOR EVERYONE WHO DRAWS HIM | `drawManFace`, `drawHusbandFig`, `drawKidFig`, `openPortrait` |
| 16427 | THE BEDCHAMBER — an implied scene: she runs, the toga flies, the door | `BC`, `startBedScene`, `updateWifeHappy`, `drawWifeHappy`, `updateBed`, `drawShadowMale`, `drawShadowWalkerF`, `drawShadowFigure` |
| 16607 | EXHAUSTION AND OVER-EXTENSION — the thing that actually broke Rome. | `CORE_PROVINCES`, `isCore`, `provReach`, `supplyCapacity`, `supplyLoad`, `overExtension`, `exhaustion`, `addExhaustion` … +3 more |
| 16692 | THE TITLES OF ROME — every honour the game can give you, in one | `TITLES`, `TITLE_BY_ID`, `titleName`, `titleIsMasculineOnHer`, `earnedTitles`, `titleSlots`, `equippedTitles`, `BOON_LABEL` … +4 more |
| 16879 | THE CONFERRING — a rank-8 honour is not a silent unlock. The Senate | `TITLE_RITES`, `titleRiteDue`, `maybeTitleRite`, `openTitleRite` |
| 16960 | THE INSCRIPTION — what goes on the stone. A Roman's tomb listed every | `fullTitulature`, `inscriptionHTML`, `inheritTitulature`, `drawTitleEmblem` |
| 17101 | THE HERBARIUS — a real Roman apothecary. Every plant here is one a | `HERBS`, `HERB_BY_ID`, `herbCount`, `herbAdd`, `herbUse` |
| 17138 | ILLNESS — Rome was a sickly place and the physicians knew it. Somebody | `ILLNESSES`, `rollIllness`, `illnessBite`, `curesIll`, `BIRTH_HERBS`, `birthHerbsReady`, `birthRisk`, `birthPrepLine` … +1 more |
| 17278 | AGEING — every ninth day the years take their cut. Under thirty a body | `upkeepScore`, `ageOneBody`, `ageBodies`, `partName`, `figureScore`, `selfStage`, `stageIndex`, `spouseFigureScore` … +1 more |
| 17401 | THE PROMISE YOU MADE | `promiseDaysLeft`, `promiseBroken`, `checkPromise`, `checkPromiseKept`, `conceiveChance`, `wifePregMonth`, `selfPregMonth`, `villaConceive` … +6 more |
| 17760 | THE THEATRE AROUND THE SHADOW PLAY. The pool scene got a room dimmed to | `drawShadowTheatre` |
| 17790 | MEDIUM — the exact opposite problem. The figures are now REAL BODIES in | — |
| 17847 | AND NOT EVERY COUNTRY IS DOING THE SAME THING — the pose lore | `POSE_LORE`, `poseLore`, `poseName` |
| 18009 | THE ROOM SHE IS ACTUALLY IN | `HALL_PLAN`, `hallPlan`, `drawHall`, `drawShadowPlay` |
| 18300 | MEDIUM CENSORING. The whole scene used to be one flat silhouette colour, | — |
| 18363 | THE POSABLE CONCEPT MODEL | `drawStagePlate`, `drawTheaterEthnic`, `drawPoolPlace` |
| 19879 | THE SHALLOWS. Two silhouettes at the waterline — and they were the same two | `waterMetrics`, `drawWaterCouple` |
| 20087 | THE DOMUS — walk your own villa. A/D stroll · SPACE act · W invite. | `DM`, `openDomus`, `domusExit` |
| 20105 | THE HALL LIGHT — one key light, and every figure in the room answers to it | `HALL_LIGHT`, `_LITB`, `litBufs`, `_litEdge`, `LIT_ON`, `litFigure`, `litWife`, `litHusband` |
| 20238 | THE SEAT PROFILE — A CURVE, NOT A STAIRCASE | `SEAT_PEAK`, `seatWidthAt`, `drawWifeFig` |
| 20301 | THE BEND. She is TEMPTING, and every so often there is something on the | — |
| 20680 | THE SIVRAK. Not a cut of the ulvik — a different object entirely. | — |
| 20729 | THE ULVIK — the indoor dress, and it is a different problem from a | `drawSteamVeil`, `drawUndressedFig`, `playerLook`, `drawDomusPlayer`, `tryPoolInvite`, `tryWardrobe`, `updateDomus`, `updateDomusScene` |
| 21540 | TEMPTING — THE LOW SHELF | `TEMPT_NEED` |
| 21561 | THE DROP — her side of the same room | `DROP_PROPS`, `DROP_NEED`, `DROP_LOOKS`, `dropDue`, `startDrop`, `updateDrop` |
| 21751 | HE DID NOT LOOK UP | `openIgnoredCard` |
| 21793 | HIS OWN IDEA | `beckonHusband` |
| 21818 | AN ACTUAL HAND | `drawSlapArm`, `husbandMoveDue`, `startHusbandMove` |
| 21876 | HIM ASKING, AND YOU ANSWERING | `updateBendAsk`, `drawBendAsk`, `updateHusbandMove`, `drawHusbandMove` |
| 21990 | THE JIGGLE, AND THE ELBOW — drawn, not nudged | `drawElbowOver` |
| 22035 | REACTION FACES | `figHeadBox`, `REACT_FACES`, `reactKindFor`, `drawReactFace`, `drawSlapAfter`, `startRefusal`, `updateRefusal`, `drawRefusal` |
| 22191 | THE RISE  —  🏛 PRIAPIC, and what a woman does about it | `RISE_STAGES`, `RISE_LINES`, `drawTunicBump`, `riseDue`, `startRise`, `RISE_NEED`, `updateRise`, `drawRise` |
| 22393 | THE ARDOR — his half of it, and the only half you drive yourself | `ARDOR_LINES`, `ARDOR_HOLD`, `ardorLen`, `ardorNeed`, `ardorDrain`, `ardorReady`, `ardorAvailableNow`, `tryArdor` … +5 more |
| 22657 | THE MARKER — a hand-drawn prompt over your own head, not an emoji. | `ardorBlockedWhy`, `drawArdorIcon`, `drawDrop`, `temptDue`, `TEMPT_PROPS` |
| 22899 | THE BEND, ON A COAST THAT DOES NOT PRETEND | `RK_BEND_NEED`, `RK_BEND_LINES`, `rkBendBeat`, `startTempt`, `updateTempt` |
| 23052 | THE VILLA'S OWN WOOHOO — fifteen seconds, in the room you are standing in | `VILLALOVE_LEN` |
| 23068 | 2 · CAUGHT | `CAUGHT_LINES`, `rollWalkIn`, `fireWalkIn`, `startVillaLove`, `villaLoveFinish`, `updateVillaLove` |
| 23187 | HIM, IN FOUR STAGES | — |
| 23198 | THE SLAP | — |
| 23208 | WHAT THIS PEOPLE THINKS OF A HAND ON HER, AND WHERE | `HAND_ON_HER` |
| 23333 | AND HOW SHE ACTUALLY ANSWERS | `SLAP_REPLY`, `handOnHer`, `slapReply`, `slapExposure`, `slapVerdict`, `slapCap`, `doSlap` |
| 23490 | WHO IS IN THE ROOM | `BABY_YEARS`, `kidsPresent`, `villaClear`, `privacyTier` |
| 23528 | WHAT MONEY ACTUALLY BUYS YOU | `houseWealth`, `DISCRETION`, `discretionTier`, `watchersRaw`, `watchersPresent`, `watchersAbsorbed`, `houseIsWatching`, `privacyNeeded` … +4 more |
| 23644 | THE ROMANTIC ONE | — |
| 23657 | THE ROMANTIC SLAP, IN EVERY LANGUAGE IT HAPPENS IN | `SLAP_CRACK`, `slapCrack`, `ROMANTIC_REPLY`, `romanticReply`, `romanticVerdict`, `romanticSelf` |
| 23822 | “BEND HERE.” | `askToBend`, `BEND_ASK`, `bendAskLines`, `startRomantic` |
| 23899 | AND THE ROMANTIC ONE GETS THE SAME REWORK — with its own character | `updateRomantic` |
| 23969 | HER SPRITE FOR THIS ONE | — |
| 23980 | HOW SHE BENDS, AND WHETHER SHE BENDS AT ALL | `ROMANTIC_BEND`, `romanticBend`, `BEND_WORD`, `romanticBendWord`, `drawBendBrace` |
| 24115 | AND A HUSBAND BENDS TOO | `drawRomanticFig`, `drawRomanticFem`, `drawRomanticMale`, `drawRomantic` |
| 24395 | THE SWING | `STRIKES`, `romanticSwing` |
| 24426 | THE SLAP, REBUILT — the four beats an animator would actually give it | `SLAP_T`, `SLAP_ANG`, `SLAP_PIV`, `slapAng`, `slapArmVis`, `slapHand`, `hallShake`, `kickShake` … +11 more |
| 25092 | THE LONGHOUSE IN THE CLEARING | `hallProvince`, `hallStyle`, `drawForestShell` |
| 25242 | FOUR MORE HALLS — because only two of the seven were ever drawn | `drawCourtyardShell`, `drawPlankShell` |
| 25321 | THE RKRAI PLANK HOUSE | `drawGerShell`, `drawShoinShell`, `drawPillaredShell`, `drawDomus` |
| 25585 | THE HOUSE | — |
| 26200 | META SCREENS WIRING | `openSlots`, `refreshAdultBtn`, `prevHelp`, `settingsFrom`, `openSettings`, `closeSettings`, `buildSettings` |
| 26306 | A FOURTH COAST, IF YOU ASK PROPERLY | — |
| 26340 | THE WOOHOO GUIDE | `woohooFrom`, `openWoohooGuide`, `closeWoohooGuide`, `WOOHOO_GUIDE`, `buildWoohooGuide`, `refreshSettings`, `openStats`, `buildStats` … +1 more |
| 26468 | THE ROLL AT THE ENROLMENT TABLE — before the oath you roll for the body | `IMPOSSIBLE_CHANCE`, `rollHiddenPotential`, `rollCreation`, `rollBanner`, `STAT_COL` |
| 26541 | HOW HIGH UP THE LADDER THAT RUNG IS, 0..1 | `rungFrac` |
| 26559 | AND WHETHER A WOMAN IN THIS CAREER IS DRAWN CARRYING ARMS | `womanBearsArms`, `womanArmsNote`, `drawCardPortrait` |
| 26630 | A WOMAN WHO IS NOT A FIGHTER, DRESSED BY HER RUNG AND HER PEOPLE | `drawBrideCut`, `drawBridePortrait` |
| 27877 | AND THEN HER PEOPLE'S ACTUAL CUT GOES OVER THE TOP OF IT | `openCreate` |
| 28233 | AND THE OATH BUTTON IS SET FROM THE TRUTH, ONCE, AT THE END | — |
| 28286 | WHERE YOU ACTUALLY WAKE UP | — |
| 28336 | THE SILK ROAD — the eastern game's own economy, and its own history | `SILK_LEGS`, `silkLeg`, `silkOpen`, `SILK_STAKE_CAP`, `silkStake`, `silkOdds`, `silkRun` |
| 28444 | THE MARKET — 楽市楽座, AND WHY IT WAS A WEAPON | `COIN_GRADES`, `MARKET_RULES`, `MARKET_OF`, `marketHere`, `ensurePurse`, `purseFace`, `purseHere`, `erizeniQuote` … +1 more |
| 28581 | THE NANBAN TRADE — silver out, silk in, and one ship a year | `NANBAN_GOODS`, `NANBAN_PORTS`, `nanbanHere`, `kurofuneIn`, `kurofuneDays`, `pancadaMul`, `nanbanBuy`, `nanbanSell` |
| 28661 | THE FIVE TRADITIONS — 五箇伝, AND A BLADE IS NOT A BLADE | `GOKADEN`, `gokaden`, `BLADED_WA`, `bladeSchoolOf`, `bladeIsSchooled`, `TAMESHI`, `tameshiDone`, `ensureBlade` … +1 more |
| 28734 | THE SWORDSMITH — pick a tradition, then prove the blade | `openSmith` |
| 28842 | THE POWDER SUPPLY — and it is a foreign policy problem | `POWDER_SRC`, `powderSourcesHere`, `POWDER_MAX`, `powderHave`, `buyPowder` |
| 28895 | THE PORT — how a man with no name and no land gets rich | `VENTURES`, `ventureOpen`, `ventureStake`, `ventureOdds`, `runVenture` |
| 28959 | THE STANDARDS — what you may and may not do here, said plainly | `standardsHere` |
| 28995 | THE TEN AND THE RKRAUN — one screen that holds the whole coast | `openTheTen`, `openStandards` |
| 29342 | YOUR OWN HOUSE — a name, a crest, a colour, and a banner over it | `MON_CHOICES`, `CLAN_COLS`, `waHouseName`, `canFoundHouse`, `foundHouse`, `openFoundHouse`, `openMarket`, `openSilk` |
| 29794 | THE HUB IS NOT THE SAME HUB | `HUB_EAST`, `HUB_WA`, `HUB_WEST_LABEL`, `HUB_RK`, `applyHub`, `enterMap`, `regionUnlocked`, `imperialAvailable` … +16 more |
| 30433 | THE BARBER AND THE CLOTHIER — you had eight cuts, five beards, seven | `outfitAllowed`, `outfitLockNote`, `barberCost`, `clothierCost`, `buildBarberCard`, `buildLegacyCard`, `buildSuccessionCard`, `succession` |
| 30721 | THE SON'S PATH — THE LEGIONS. An heir may refuse the sand and take a | — |
| 30726 | THE ARMY IN DEPTH — a legion is not a number. It is cohorts of specific | `UNIT_TYPES`, `unitCount`, `armySize`, `armyUpkeep`, `armyPowerDetail`, `supplyState`, `FORTRESSES`, `MIL_RANKS` … +14 more |
| 31047 | THE FAMILY TREE, IN FOUR REGISTERS | `TREE_TAB`, `treeTabs`, `openTree` |
| 31450 | ⚭ THE NOBLE TREE — WHO YOU ARE RELATED TO BY CONTRACT | `nobleHouses`, `treeNoble` |
| 31617 | 🏛 THE GOVERNOR'S TREE — WHAT YOU ADMINISTER | `treeGovernor`, `openTitles`, `herbBack`, `openHerbs` |
| 31813 | PROVINCIAL MANAGEMENT — tax, garrison, grain, governors and unrest, | `openProvinces` |
| 31939 | THE NIGHT THEY COME FOR THE PURPLE — when RISK TO THE PURPLE runs hot | `coupDue`, `maybeCoup`, `openCoup` |
| 32051 | CALL-OUTS — Rome says what it thinks of you, out loud, in the street. | `maybeCallout` |
| 32056 | SHE ASKS FIRST | `FESTIVALS`, `festivalToday`, `anWord`, `spouseExcuse`, `SPOUSE_ASKS`, `quirkAside`, `spouseAskDue`, `maybeSpouseAsk` |
| 32232 | THE CHILDREN, ONCE THEY ARE PEOPLE | `kidAgeYears`, `kidBand`, `livingKids` |
| 32251 | HOW BIG A CHILD IS DRAWN | `kidDrawScale`, `grownLook`, `drawChildFigure`, `kidsOfBand`, `kidName`, `kidHe`, `kidHim`, `kidSon` … +1 more |
| 32331 | THE SUITOR HALL — marrying off a grown child | `SUITOR_HOUSES`, `SUITOR_STYLE`, `RK_SUITOR_STYLE`, `EAST_SUITOR_STYLE`, `WA_SUITOR_STYLE`, `suitorStyleList`, `suitorRank`, `makeSuitorFor` … +1 more |
| 32504 | WHAT THE DISTRICT CALLS THEM | `ARD_TITLES`, `KID_TITLES`, `pickTitle`, `bedTitle`, `myBedTitle` |
| 32553 | THE ESCORT — he takes her to the room, and HOW he does it is the whole | `ESCORT_POSES`, `escortPoseFor`, `escortPose`, `coupleLooks`, `drawCarriedFem`, `ESCORT_WIFE_DX`, `maybeArmSwat`, `drawArmSwat` … +2 more |
| 32802 | THE HOUSE GROWS WITH THE ESTATE | — |
| 32815 | THE HOUSE IS NOT A DOMUS EVERYWHERE | `HOUSE_SETS`, `houseSetId`, `houseSet`, `HOUSE_TIERS`, `houseTier`, `hasRoom`, `SECTION_X` |
| 32986 | THE SECTIONS THEMSELVES | `drawCulina`, `drawTriclinium`, `drawPeristyle`, `drawLararium`, `drawHouseSections`, `DOMUS_UPPER`, `STAIR_X0`, `STAIR_X1` … +21 more |
| 33455 | THE ONE LOOK | `peekKey`, `peekUsed`, `markPeeked`, `PEEK_ROOM`, `PEEK_STAGE` |
| 33490 | THEY ARE NOT IN THE SAME STATE AS EACH OTHER | `HEAT_HIM`, `HEAT_HER` |
| 33506 | AND WHAT THEY WERE ACTUALLY DOING | `PEEK_ACTS`, `PEEK_ACT_MAP`, `peekActWeight`, `peekAct`, `peekHeat`, `PEEK_REACT`, `peekReactFor`, `startPeek` … +18 more |
| 34236 | GRAVITAS  —  THE FACE YOU WEAR OUTSIDE THE DOOR | `gravitasRaw`, `gravitas`, `setGravitas`, `GRAVITAS_TIERS`, `gravitasTier`, `gravitasHit`, `gravitasTick` |
| 34336 | THE MARRIAGE LEDGER  —  standing, favours, feuds, and grandchildren | `inlawStanding`, `setStanding`, `standingLabel`, `FEUD_LINES`, `feudsList`, `feudOn`, `addFeud`, `feudHeat` … +3 more |
| 34422 | 11 · WHAT THE IN-LAWS ARE ACTUALLY LIKE | `INLAW_TRAIT_FX`, `INLAW_FLAW_FX`, `inlawTraitsOf`, `inlawFlawsOf`, `favourSurcharge`, `inlawTick` |
| 34525 | TEACHING THEM THE FACE | `kidDecorum`, `setDecorum`, `DECORUM_TIERS`, `decorumTier`, `DECORUM_DRILL`, `teachableKids`, `teachDecorum`, `KID_BLURTS` … +3 more |
| 34649 | 1 · THE MORNING AFTER   ·   4 · THE ANNIVERSARY | `MORNING_WARM`, `MORNING_COOL`, `morningDue`, `morningCard`, `annivYears`, `annivDue`, `annivCard` |
| 34758 | WHO IS IN WHICH ROOM | `HOUSE_ROOMS`, `roomsOccupiedToday`, `roomOccupant`, `placeMenuUp` |
| 34799 | THE DOOR — AND IT IS NOT THE SAME DOOR IN EVERY HOUSE | `DOOR_PLAN`, `doorPlan`, `drawDoorLamp`, `drawHallExit`, `drawDoor`, `houseGuestBusy`, `suitorsAvailable`, `makeCheatSuitor` … +3 more |
| 35522 | 14 · HAGGLING THE DOWRY | `haggleLeverage`, `HAGGLE_POSTURES`, `openHaggle`, `openWeddingChoice`, `buildSuitorCard` |
| 35657 | THE FACE, AND TEACHING IT — the villa's own card for both | `buildGravitasCard` |
| 35707 | TAKING THE KING'S SALT | `inParthia`, `buildParthiaCard` |
| 35750 | THE LAW OF THIS PLACE — the card that tells you what you are living under | — |
| 35758 | THE CHOICE — and it prints the price BEFORE you take it | `buildEastActCard`, `buildActCard`, `buildMoresCard`, `buildDiscretionCard` |
| 35940 | 13 · GOING TO SEE YOUR DAUGHTER | `visitableKids`, `VISIT_SCENES`, `buildVisitCard`, `buildFeudCard`, `buildKidHousesCard`, `FAMILY_EVENTS`, `familyDue`, `maybeFamily` … +6 more |
| 36494 | THE GROOM'S PLATE — the same painted alcove her portrait gets, and HIS | `drawGroomPortrait`, `briadeImg`, `marriageEffectsText`, `LOVE_CAP`, `bedLen`, `loveLeft`, `spendLove`, `vigilReady` … +2 more |
| 36586 | JEALOUSY — she notices. Neglect, other women, and a wandering | `jealousyLevel`, `jealousyLabel`, `addJealousy`, `easeJealousy`, `jealousyEffects`, `jealousyBlocksBed` |
| 36630 | THE TABULA — a wax-tablet note home, ancient texting. Her reply is | `NOTE_PRESETS`, `NOTE_WORDS`, `noteSentiment`, `noteBaseTier`, `NOTE_REPLIES`, `NOTE_AFTERGLOW`, `NOTE_APOLOGY_SOFT`, `NOTE_QUESTION` … +46 more |
| 38071 | PROVINCE TERRITORIES — every playable region as an actual shape on the | `PROV_SHAPES`, `PROV_SEAMS`, `lonlat` |
| 38120 | THE EASTERN WORLD, c. 200 A.D. | `MAP_EAST_PROJ`, `lonlatE`, `eastXY`, `REGIONS_EAST` |
| 38200 | TWELVE MORE, BECAUSE TWENTY-TWO WAS NOT ASIA | `REGION_EAST_BY_ID` |
| 38243 | THE RKRAI SHORE — an invented people, held to internal consistency | — |
| 38275 | THE BORDER, AND IT IS NOT AN ISLAND | `RK_COAST`, `RK_INLAND_FROM`, `rkIsCoast`, `RK_BEYOND`, `rkXY`, `REGIONS_RK`, `REGION_RK_BY_ID` |
| 38343 | THE MASTERIES — the Rkrai theology, and it is a civil service | `RK_MASTERIES`, `RK_MASTERY_BY_ID` |
| 38418 | AND THE LADDER, WHICH IS WRITTEN DOWN | `RK_RANKS` |
| 38432 | AND WHO IS ACTUALLY IN CHARGE — THE RKRAUN | `RK_GOVERN`, `rkHead`, `rkHere` |
| 38474 | THE ULVIK — WHAT SHE WEARS INDOORS, AND WHY IT IS A DIFFERENT GARMENT | `RK_HOUSE` |
| 38504 | AND IT IS CUT FOR THE OFFICE, WHICH IS THE ENTIRE POINT OF IT | `RK_CUTS`, `rkCut`, `rkHouseDress`, `rkOfficeBand`, `rkRankIdx`, `rkRank` |
| 38578 | THE SIX LOOKS-TITLES, AND YOU NEED THE LOOKS | `RK_WIFE_TITLES`, `RK_WIFE_TITLE_BY_ID` |
| 38644 | AND THE SIX WOMEN WHO CURRENTLY HOLD THEM | `RK_TITLED_WIVES`, `RK_TITLED_BY_ID`, `makeRkTitledWife`, `rkTitledOffered`, `RK_EARNED_TITLES`, `rkTitlesFor`, `rkWifeTitle`, `rkTitleNearMiss` … +1 more |
| 38781 | AND THE MEN'S SIDE OF THE REACH, WHICH IS MEASURED | `RK_TAQRUN_NEED`, `rkTaqrunClaim`, `rkTaqrunSeated` |
| 38805 | THE READING — AND ON THIS COAST, NOT LOOKING IS THE RUDE THING | `RK_READ`, `rkReadOn`, `rkHeldVerdict` |
| 38862 | THE SIVRAK — GREEN THAT CAME THROUGH THE STEELYARD AND DID NOT GO ON | `RK_SIVRAK`, `rkBestPart`, `RK_SIVRAK_FRAME`, `rkSivrakFrame`, `rkSivrakOn`, `rkSivrakAsk`, `rkSivrakVerdict`, `rkSivrakWear` … +1 more |
| 39001 | THE FOUR PROVINCES AND THE CAPITAL, WHICH YOU CAN COME TO HOLD | `RK_PROVINCES`, `RK_PROV_BY_ID`, `rkProvHeld`, `rkProvList`, `rkProvSeatOk`, `rkProvClaim`, `rkProvTake`, `rkProvYield` … +1 more |
| 39098 | AND THE MEN'S SIX, WHICH ARE THE SAME SIX MASTERIES READ OFF A MAN | `RK_HUSB_TITLES`, `RK_HUSB_TITLE_BY_ID` |
| 39165 | TWELVE SEATS, AND SOMEBODY IS ALREADY SITTING IN EVERY ONE OF THEM | `RK_SEAT_FOLK`, `RK_SEATING_FEE`, `rkSeats`, `rkSeatSubject`, `rkMeasure`, `rkSeatTitle`, `rkSeatClaim`, `rkSeatTake` … +3 more |
| 39275 | HOW THE RKRAI MARRY THEIR CHILDREN, WHICH IS NOT HOW ANYBODY ELSE ON | `RK_COURT`, `rkAgeVerdict`, `rkMotherRead`, `rkCallerCount` |
| 39358 | THE THIRD SHEET — WA, AND THE CROSSING THAT COST THIRTEEN CENTURIES | — |
| 39380 | THE PROJECTION — and why this sheet is turned on its side | `MAP_WA_PROJ`, `lonlatW`, `waXY`, `REGIONS_WA`, `REGION_WA_BY_ID` |
| 39498 | THE CLANS — 1543-1590, AND WHY THE MAP IS A PATCHWORK | `CLANS_WA`, `CLAN_OF_WA`, `clanOf`, `clanIdOf`, `clanHolds` |
| 39584 | THE MON — the crest, drawn rather than lettered | `drawMon`, `WA_REFUSAL`, `regionBlocked`, `refuseBlocked` |
| 39746 | THE CROSSING — and what it costs is not money | `CROSS_PORTS`, `canAttemptCrossing`, `crossingBlockReason`, `CROSSING_LOG`, `CROSSING_ARRIVAL`, `beginCrossing`, `openCrossing`, `openCrossingLog` |
| 39883 | THE EASTERN SHEET — drawn from real coastlines, like the western one | `drawMapCanvasEast` |
| 40119 | THE WA SHEET — Honshū, Kyūshū, Shikoku, from real coastlines | — |
| 40136 | THE COASTLINE — traced, not blocked out | `WA_HONSHU`, `WA_KYUSHU`, `WA_SHIKOKU`, `WA_EZO` |
| 40213 | AND THE ISLANDS, which are not decoration in this century | `WA_ISLES` |
| 40242 | THE PATCHWORK — territory by colour, and a border where houses meet | `_waTerrBuf`, `waTerritory`, `WA_CREST_AT`, `drawWaCrests` |
| 40372 | WHERE THE LABELS GO — six seats inside two degrees | `WA_PIN_POS`, `layoutWaPins`, `drawWaLeaders` |
| 40436 | THE RKRAI SHORE, DRAWN | `drawMapCanvasRk`, `drawMapCanvasWa`, `agePlateWa` |
| 40790 | THE PLATE — what makes a map look like a MAP of its own century | `agePlate`, `coastHatch`, `drawMapLegend`, `drawCompass`, `drawScaleBar`, `drawMapCanvas`, `briefCtx`, `tierName` … +1 more |
| 41591 | THE LANISTA'S CELLS — pay the fee, then pick your man | `openRigPick`, `shopTab` |
| 41674 | THE RANGED RACK, DRAWN — every one of these was an emoji | `drawRangedIcon`, `drawGearIcon`, `gearIconImg`, `openShop` |
| 42677 | THE LUDUS — drilled skills, real wounds, and a body that wears out. | `SKILLS`, `skillLvl`, `skillCost` |
| 42689 | THE BODY, WHICH YOU COULD NOT TRAIN | `BODYSKILLS`, `BODYSKILL_NAME`, `bodySkillNames`, `bodyLvl`, `BODYSKILL_MAX`, `bodyCost`, `bodyHpBonus`, `bodyMitBonus` … +4 more |
| 42768 | SCARS — THE ARENA'S PRICE, AND IT IS PAID ON THE SKIN. A wound that closes | `scarZoneOf`, `addScar`, `scarName`, `scarList`, `scarCount`, `drawScarsOn` |
| 42813 | AN ICON FOR EACH, DRAWN | `drawBodySkillIcon`, `trainScreen` |
| 42974 | BOOT | — |
| 42981 | PIXEL LOGO — "SAND ⛑ STEEL" on riveted crimson planks + favicon | `LOGO_F`, `LOGO_HELM`, `drawLogoHelm`, `drawLogo` |
