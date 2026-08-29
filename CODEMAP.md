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
| 862 | AND WHICH TRADE THE GROUND ITSELF FIELDS | `WA_GROUND_CLASSES`, `classesForWorld`, `CLASS_ORDER`, `CLASS_ORDER_EAST`, `GEAR` |
| 933 | THE ARSENAL OF THE SENGOKU — and the sword is not the point of it | — |
| 947 | THE POOR MAN'S ARSENAL — and it is the farm shed | — |
| 964 | BAMBOO, AND WHY — the correction | `gearOf`, `PILUM`, `aimZoneFor`, `rangedDamage`, `pilumDamage`, `BOWS` |
| 1222 | THE YUMI — and why the samurai spent five hundred years on it | — |
| 1239 | THE GUNS — and the trade-off IS the history | — |
| 1282 | THE REST OF THE POWDER — and the honest note about rifles | `bowOf` |
| 1315 | WHAT THE SHOP ACTUALLY STOCKS | `gearWorldOf`, `gearStockedHere`, `isGun` |
| 1343 | IT IS NOT A BOW. STOP CALLING IT A BOW. | `rangedWords`, `rangedShelfName` |
| 1373 | YOU CANNOT SIMPLY BUY THIS | `rankTier` |
| 1402 | THE ARMATURA — a gladiator IS his kit | `ARMATURA`, `myArmatura` |
| 1478 | AND WHO GETS TO IGNORE IT | `OFFTYPE_PURSE`, `canChooseOwnKit`, `offTypeWhy`, `armaturaOn`, `inArmatura`, `gearGate`, `gearBuyable`, `rangedCooldown` |
| 1550 | THE WEATHER — which exists in this game only because the gun does | `WET_CHANCE`, `rollWeather`, `isWet`, `misfireChance`, `FOE_NAMES`, `FOE_TITLES`, `ARCHETYPES`, `ARCH_ORDER_WEST` … +4 more |
| 1684 | TWO WORLDS, ONE GAME | — |
| 1696 | THE SEVEN SENGOKU CAREERS | — |
| 1705 | THE ROLE IS THE RANK — nobody chooses out of the whole list | `WORLDS` |
| 1822 | AND A FOURTH, WHICH IS NOT A REAL PLACE | `WORLD_IDS`, `worldOfArch`, `regionsForWorld`, `regionAny`, `worldOfRegion`, `playerWorld`, `SOCIAL`, `SOCIAL_ORDER` |
| 1895 | THE EASTERN LADDER — nobody in Luoyang was ever a patrician | `SOCIAL_EAST` |
| 2004 | WA · and the ladder here is measured in RICE | — |
| 2033 | THE RKRAI LADDER — five notches, cut in the post | `socialSetFor`, `socialSetForSel`, `socialRung`, `playerRung` |
| 2081 | THE OTHER LEDGER'S SELLER — who you go to for it depends entirely on | `SECRET_SELLERS`, `ELITE_MEN`, `ELITE_WOMEN`, `PLOT_TARGETS`, `OFFICES`, `KEY_PROVINCES`, `keyCount`, `GEN_NAMES` … +2 more |
| 2168 | MARRIAGE — take a wife once powerful (or, as an elite, by dynastic duty) | `BRIDE` |
| 2196 | AND EVERYWHERE ELSE ON EARTH | `BRIDE_ETHS`, `BRIDE_ETHS_BY_WORLD`, `WA_PORTS`, `brideEthsHere`, `homeBrideEth` |
| 2269 | THE CULTURES — what a people actually BELIEVED, as numbers | `CULTURES` |
| 2313 | THE RKRAI — INVENTED. The only culture in this table that is not | — |
| 2432 | THE EASTERN PEOPLES — four more rows in the same tables | — |
| 2522 | WA · and it is thirteen hundred years from everything else in this game | `CULTURE_IDS`, `cultureById`, `ARCH_CULTURE`, `ARCH_RANK`, `archRank`, `RANK_LOCK`, `RANK_COL`, `rankLockNote` … +5 more |
| 2676 | TRIBAL RANK — a chieftain's wife did not dress like a herdsman's | `isTribal`, `tribalRank`, `tribalTier`, `tribalCloth`, `coverageBand`, `localCulture` |
| 2760 | THE MORES — what each people's LAW actually did about it | `MORES` |
| 2901 | WA · what a household may and may not do, in this century | `moresOf` |
| 2938 | RIGGING THE BOUT — the fee gets you in the room, the man costs extra | `RIG_FEE`, `RIG_BUILDS`, `rigBuild`, `rigManPrice`, `rigSuspicion`, `rigPurseMul`, `drawRigCandidate` |
| 3061 | THE COIN IN YOUR HAND — and it is not a denarius everywhere | `CURRENCY` |
| 3132 | SENGOKU JAPAN · and it has THREE moneys at once, which is the point | `CURRENCY_OF`, `CURRENCY_REGION`, `currencyHere`, `coinWord`, `coinShortStr`, `drawCoinIcon`, `_COINIMG`, `coinIconURI` … +1 more |
| 3304 | THE MOS — WHAT ROME ACTUALLY OBJECTED TO, AND WHY | `ACTS`, `ACT_BY_ID` |
| 3367 | THE EASTERN BEDCHAMBER — a different question entirely | `EAST_ACTS` |
| 3482 | WA · and the household is a chapter of the war | — |
| 3534 | THE EASTERN MATCH — nobody in Luoyang negotiates a Roman dowry | `MATCH_EAST`, `matchEast`, `matchEastForPlayer`, `eastDowryLine`, `buildEastMatchCard`, `eastActSet`, `eastActById`, `eastAxisValue` … +4 more |
| 3798 | HOW FAR ROME'S OPINION ACTUALLY REACHES | — |
| 3823 | WHERE MEN ACTUALLY FOUGHT — and it was NOT an amphitheatre everywhere | `VENUES` |
| 3921 | WA — and there is no arena anywhere in it | `VENUE_OF` |
| 3992 | THE RKRAI GROUNDS | `RK_VENUES`, `VENUE_REGION`, `venueHere`, `venueName`, `venueIsShow`, `REPUTATION_REACH`, `reputationReach`, `reachBand` … +9 more |
| 4196 | RESOLVING AN ACT — does anyone find out, and what does it cost | `actWitnessChance`, `resolveAct`, `actHerView`, `osImpurumTick`, `localMores`, `legalExposure`, `exposureSplit`, `fashionOffence` |
| 4318 | THE EYE, DECIDED ONCE, FOR EVERY FACE IN THE GAME | `INK_EYE_CULTURES`, `inkEyes`, `inkEyesOver` |
| 4402 | HAIR — ONE SYSTEM, DRAWN THE SAME EVERYWHERE. | `HAIR_F`, `HAIR_M`, `BEARD_M`, `HAIR_M_BY_ETH`, `BEARD_BY_ETH`, `HAIR_COL_M`, `HAIR_F_BY_ETH`, `OUTFITS_M` … +9 more |
| 4904 | SMALL-SCALE HAIR — one routine, every sprite that is not a portrait | `drawHairSmall`, `hairStyleFallback`, `beardFallback`, `outfitFallback`, `hairStyleName`, `beardName`, `fixTraitsForSex`, `ensureQuirks` … +2 more |
| 5023 | BLOODLINE — every spouse carries LOOKS, SMARTS and TRAITS. Children | `BUILDS`, `LOOK_STAGES` |
| 5039 | AND THE LADDER ITSELF IS A ROMAN LADDER | `LOOK_LADDER`, `LOOK_BLURB`, `lookLadder`, `lookStage` |
| 5119 | THE SAME LADDER, ON THE WALL. The shadow-play reads the very stage the | `SHADOW_STAGES`, `shadowStage`, `BODY_PARTS`, `BODY_PARTS_M`, `SECRET_PART`, `secretUnlocked`, `secretAllowed`, `partsFor` … +1 more |
| 5201 | AND THE RUNGS OF EACH PART, WHICH ARE ALSO A JUDGEMENT | `PART_TIERS`, `partTiersHere`, `partTier` |
| 5262 | AND THE WORDS ARE ROMAN TOO | `BODY_WORDS`, `bodyWordsHere`, `partPhrase`, `bodyBlurb` |
| 5338 | DIRECT SPOUSE DESCRIPTIONS  (Settings → Direct spouse descriptions) | `BLUNT_WORDS`, `BLUNT_PLURAL`, `bluntWord`, `bluntDowry`, `bluntBrief`, `bodyTierLine`, `rollBody`, `makeImpossibleBody` |
| 5423 | YOUR OWN BLOOD — rolled at the enrolment table like anyone else's. | `rollPlayerBody`, `bodyAvg`, `ensurePlayerBody`, `selfSubject`, `syncPlayerLooks` |
| 5477 | THE HOUSE YOU WERE BORN INTO — a father, a mother, brothers and | `FATHERS`, `MOTHERS`, `SIB_ROLES_M`, `SIB_ROLES_F`, `NAMES_M`, `NAMES_F`, `makeFamily`, `kinAge` … +1 more |
| 5612 | THE FAMILY PORTRAIT GALLERY — every name in your house gets a drawn | `KIN_SKINS`, `KIN_HAIRS`, `kinHash`, `kinLook`, `kinInherit`, `drawKinPortrait` |
| 5885 | THE IMPERIAL COURT — the people who actually decide whether a purple-born | `PRAETORIAN_PREFECTS`, `COURT_FIGURES`, `makeCourt`, `COURT_LEVERS`, `courtBonus`, `courtCultivateCost`, `purpleRisk`, `opinionsOfYou` |
| 5981 | LOOKS ARE POLITICS. For a prince, a princess, an Augusta or a powerful | `beautyPower`, `BEAUTY_GIFTS`, `toleranceScore`, `loyaltyScore` |
| 6047 | PROVINCIAL MANAGEMENT — a title is not a trophy, it is a job. Every | `PROV_GOVS`, `provOf`, `heldProvinces`, `provUnrestAvg`, `TAX_NAMES`, `provIncome`, `provUpkeep`, `provDailyTick` |
| 6101 | PUBLIC COMPLAINTS — the price of governing. Petitions come up from the | `COMPLAINT_KINDS`, `rollComplaint`, `pendingComplaints`, `complaintPressure` |
| 6138 | CALL-OUTS — somebody in the crowd says something about you, out loud, | `CALLOUT_LINES_F`, `CALLOUT_LINES_M` |
| 6159 | AND THE STREET DOES NOT SHOUT THE SAME THING EITHER | `CALLOUT_CULTURE`, `calloutLines`, `calloutDue` |
| 6259 | PUBLIC EYES — where the eyes actually go. A walking figure, an eye on | `GAZE_BASE_F`, `GAZE_BASE_M` |
| 6266 | WHERE THEY ACTUALLY LOOK, AND IT IS NOT THE SAME PLACE | `GAZE_CULTURE`, `GAZE_VOICE` |
| 6403 | THE LAST OF THE ROMAN FURNITURE | `FACE_WORD`, `FACE_RULE`, `faceRule`, `highBornLabel`, `highBornNote`, `gravitasWord`, `DYE_WORD`, `dyeWord` … +7 more |
| 6627 | QUIRKS — THE MIDDLE TIER | `WIFE_QUIRKS` |
| 6701 | THE OUTER TIERS. Three bands was still too flat — everything good was | `WIFE_BOONS`, `WIFE_BANES`, `boonById`, `baneById`, `hasBoon`, `hasBane`, `rollBoons`, `rollBanes` … +11 more |
| 6797 | THE CHIPS. These used to be three words of coloured text in a row, | `CHIP_TIERS`, `traitChip` |
| 6845 | A TRAIT THAT BELONGS TO THE OTHER SEX IS NOT YOURS | `traitsForSex`, `traitsHtml`, `traitsDetailHtml`, `hasFlaw`, `rollFlaws`, `TIERS`, `spouseTierName`, `slapLabel` … +13 more |
| 7200 | THE BODY MAP — a matchmaker's chart, bought once for 200d. Every region | `heatColor`, `bmCache`, `bmResetCache`, `bmOnce` |
| 7222 | THE SHAKE — and it is HER OWN MEASUREMENTS doing it | `SHIMMY`, `shimmyOf`, `SHIMMY_TIER`, `shimmyStart`, `shimmyTick`, `shimmyLive`, `shimmyEnv`, `shimmyHip` … +5 more |
| 7325 | SLAP PHYSICS — one damped spring, shared by every figure that can take one | `SLAPJ`, `slapKick`, `slapJigTick`, `slapJig`, `slapLive` |
| 7359 | THE CHART FIGURE — built FOR the chart, not borrowed from the villa | `chartLandmarks`, `drawChartFig`, `drawBodyMap` |
| 7623 | THE REAL FIGURE, if you asked for it. | `rgbTriple`, `shade2`, `lit2`, `rgbA`, `drawMapReadout`, `drawMapScale`, `drawWalkFigure`, `drawEyeGlyph` … +12 more |
| 8503 | COURTSHIP — YOU HAVE TO TALK. | `COURT_RANKS` |
| 8533 | WHERE YOU STAND, ON WHATEVER LADDER YOU ARE ON | `socialRankIndex`, `wealthRungs`, `effectiveRank`, `courtAccess`, `COURT_PROMPTS`, `COURT_BOASTS`, `MEDIUM_CENSOR`, `COURT_RESULT` … +22 more |
| 9227 | THE LEGACY HOUSE — a dynastic seat you plant in a province of your | `LEGACY_INFO` |
| 9249 | AND YOU CANNOT SEAT YOUR NAME IN AEGYPTUS FROM KYŌTO | `LEGACY_EAST`, `LEGACY_WA`, `legacySet`, `legacyLevels`, `legacyWord`, `legacyInfo`, `LEGACY_LEVELS`, `legacyScore` … +4 more |
| 9382 | GAME STATE / SAVE | `SAVE_KEY`, `SLOT_KEY`, `NSLOTS`, `saveSlot`, `slotKey`, `setSlot`, `slotInfo`, `G` … +1 more |
| 9498 | THE GLADIATRIX — a woman fights in DEFIANCE of the Emperor's ban. The | `GLADIATRIX_EVENTS`, `gladiatrixStageFrom`, `gladiatrixAfterWin`, `gladiatrixBriefBlock`, `checkFamilyMan`, `elevateWife`, `migrate` |
| 9574 | AN OLD SAVE MUST NOT LOSE WHAT IT WAS ALREADY CARRYING | `saveGame`, `hasSave`, `loadGame` |
| 9619 | MATURE-CONTENT GATE | `ADULT_KEY`, `ADULT`, `setAdult`, `SETTINGS_KEY`, `SETTINGS`, `saveSettings`, `DIFF`, `diffMul` |
| 9639 | THE RICHER YOU GET, THE BETTER THEY SEND | `wealthHeat`, `wealthMul`, `wealthNote`, `STATS_KEY`, `STATS`, `saveStats`, `bumpStat`, `ACHIEVEMENTS` … +4 more |
| 9710 | UI: stat bar + toast | `refreshStatbar`, `MOUNTS`, `toastT`, `toast` |
| 9747 | PIXEL SPRITE: gladiator (drawn procedurally, faces +x by default) | `SKIN` |
| 9752 | WHOSE FACES ARE IN THE ROOM | `SKIN_BY_CULT`, `skinHere`, `pickSkin`, `skinAt`, `shade`, `mixHex` |
| 9814 | THE YEARS, WRITTEN ON THE FACE. One number in, four things out — and every | `ageMarks`, `greyHair`, `agedSkin`, `paletteFor` |
| 9845 | THE SWING YOU CAN SEE — arcs, impact, and weight | — |
| 9869 | THE AIR IN THE PLACE, AND THE THING YOU ARE SEEING IT OVER | `drawGroundHaze`, `drawArenaForeground`, `weaponTipLen`, `pushSwingTrail`, `updateSwingTrails`, `drawSwingTrails` |
| 10014 | AND THE HIT ITSELF | `impactBurst`, `updateImpacts`, `drawImpacts`, `swingSfx`, `drawGladiator`, `drawBeast` |
| 10164 | THE SASHIMONO — the flag on a man's back | `drawSashimono`, `drawGladBody`, `drawStuck`, `drawSlashFx`, `drawLeg`, `drawTorso` |
| 10316 | THE EAST AND THE SENGOKU, ON THE BODY | `drawHead` |
| 10414 | THE EYES, AND THEY ARE NOT THE SAME EYES EVERYWHERE | `drawHelmet2` |
| 10533 | THE SENGOKU HEAD — and none of it is a Roman galea | `drawShield2`, `drawArm2` |
| 10728 | YOU DO NOT WIND UP A MATCHLOCK | `drawGunArms`, `drawThrowArm`, `drawWeapon2` |
| 10864 | THE FIVE BAMBOO PIECES — and not one of them is a bamboo sword, | — |
| 11105 | ARENA RENDERING | `makeFighter`, `FT`, `makeArenaFoe` |
| 11181 | AND THE MAN OPPOSITE ACTUALLY CARRIES ONE | `FOE_GUN`, `armFoeRanged`, `foeGunAI`, `NAVAL_NAMES`, `BEASTS`, `pickBeast`, `makeBeast` |
| 11268 | NEMESIS — a named rival who rises with you, taunts, meddles, and finally | `NEM_FIRST`, `NEM_EPITHET`, `NEM_TAUNTS`, `nemFull`, `makeNemesis`, `nemesisAfterWin`, `drawNemesisPortrait`, `nemesisBriefBlock` … +10 more |
| 11597 | THE SIDEARM — 抜刀, and it is why the daishō exists | `hasSidearm`, `sidearmName`, `drawnWeaponName`, `rangedReady`, `switchWeapon`, `autoDrawBlade`, `playerRanged`, `beginRangedCharge` … +5 more |
| 11778 | THE BLAST — the only area weapon in the game, and it is ceramic | `blastAt`, `updateBurns` |
| 11832 | THE RAIN — which has been a number nobody could see | `initRain`, `updateRain`, `drawRain`, `drawWetNotice`, `gunSmoke`, `updateGunSmoke`, `drawGunSmoke`, `throwPilum` … +8 more |
| 12124 | WHAT A MATCHLOCK LOOKS LIKE, and it is not a musket | `drawHeldGun`, `drawHeldBomb`, `drawHeldBow`, `drawArrow`, `aiUpdate`, `beastHop`, `beastLunge`, `beastBite` … +14 more |
| 12796 | ARENA DRAW | `drawVillaBg`, `drawDeadTree`, `drawPitBg` |
| 12919 | THE THEATRES OF THE EMPIRE | `ARENA_THEATRES` |
| 12998 | THE EASTERN GROUNDS — and NOT ONE OF THEM IS AN AMPHITHEATRE | — |
| 13069 | THE SIX GROUNDS OF THE SENGOKU — and every house has its own | `waHouseHere`, `THEATRE_OF`, `theatreOf`, `THEATRE_FOES`, `theatreFoeName`, `crowdIsHostile`, `drawTheatreSkyline`, `drawArena` |
| 13445 | WHAT IS ACTUALLY STANDING BEHIND THE FIGHTERS | `drawShadow`, `drawCrowd`, `drawEmperorBox`, `drawVerdict`, `pixelText` |
| 14018 | AUDIO (tiny WebAudio blips, guarded) | `AC`, `noiseBuf` |
| 14023 | THE SOUND ENGINE | `MASTER`, `audioBus`, `revSend`, `blip`, `hiss`, `tone`, `noise`, `sfx` |
| 14367 | INPUT  (exact scheme required) | `held`, `edge`, `setEdge`, `consume`, `resetInputEdges`, `touchPref`, `touchCapable`, `coarsePointer` … +5 more |
| 14487 | MAIN LOOP | `state`, `last`, `loop`, `menuStars`, `drawMenuBg` |
| 14562 | ARMY BATTLE — army-vs-army (a different battle type, no 1v1) | `BT`, `armyBattle`, `updateBattle`, `drawBattleSoldier`, `drawBattleHorse`, `drawBattleHost`, `drawBattle`, `finishBattle` |
| 14721 | THE CIRCUS MAXIMUS — chariot racing, an entirely separate game. | `FACTIONS`, `RACER_NAMES`, `RACE_LAPS`, `LANE_Y`, `RC`, `startRace`, `aiRace`, `updateRace` … +5 more |
| 14887 | THE DAUGHTER'S PATH — THE COURTS. An heiress may refuse the sand and | `CASE_TYPES`, `ARGUMENTS`, `PATRONS`, `RIVAL_ADVOCATES`, `LANDMARKS` |
| 14932 | THE REGALIA — the visible instruments of power. Julia Domna, empress in | `REGALIA`, `hasRegalia`, `powerScore`, `CASE`, `caseDifficulty`, `startCase`, `renderCase`, `playArgument` … +5 more |
| 15201 | THE DOMINUS CONSOLE — cheats. Coin, glory, provinces, the purple. | `openCheats`, `openCircus` |
| 15423 | THE FAMILY PORTRAIT — the whole house, painted in one gold frame | — |
| 15428 | HIS FACE, ONCE, FOR EVERYONE WHO DRAWS HIM | `drawManFace`, `drawHusbandFig`, `drawKidFig`, `openPortrait` |
| 15760 | THE BEDCHAMBER — an implied scene: she runs, the toga flies, the door | `BC`, `startBedScene`, `updateWifeHappy`, `drawWifeHappy`, `updateBed`, `drawShadowMale`, `drawShadowWalkerF`, `drawShadowFigure` |
| 15940 | EXHAUSTION AND OVER-EXTENSION — the thing that actually broke Rome. | `CORE_PROVINCES`, `isCore`, `provReach`, `supplyCapacity`, `supplyLoad`, `overExtension`, `exhaustion`, `addExhaustion` … +3 more |
| 16025 | THE TITLES OF ROME — every honour the game can give you, in one | `TITLES`, `TITLE_BY_ID`, `titleName`, `titleIsMasculineOnHer`, `earnedTitles`, `titleSlots`, `equippedTitles`, `BOON_LABEL` … +4 more |
| 16212 | THE CONFERRING — a rank-8 honour is not a silent unlock. The Senate | `TITLE_RITES`, `titleRiteDue`, `maybeTitleRite`, `openTitleRite` |
| 16293 | THE INSCRIPTION — what goes on the stone. A Roman's tomb listed every | `fullTitulature`, `inscriptionHTML`, `inheritTitulature`, `drawTitleEmblem` |
| 16434 | THE HERBARIUS — a real Roman apothecary. Every plant here is one a | `HERBS`, `HERB_BY_ID`, `herbCount`, `herbAdd`, `herbUse` |
| 16471 | ILLNESS — Rome was a sickly place and the physicians knew it. Somebody | `ILLNESSES`, `rollIllness`, `illnessBite`, `curesIll`, `BIRTH_HERBS`, `birthHerbsReady`, `birthRisk`, `birthPrepLine` … +1 more |
| 16611 | AGEING — every ninth day the years take their cut. Under thirty a body | `upkeepScore`, `ageOneBody`, `ageBodies`, `partName`, `figureScore`, `selfStage`, `stageIndex`, `spouseFigureScore` … +1 more |
| 16734 | THE PROMISE YOU MADE | `promiseDaysLeft`, `promiseBroken`, `checkPromise`, `checkPromiseKept`, `conceiveChance`, `wifePregMonth`, `selfPregMonth`, `villaConceive` … +6 more |
| 17079 | THE THEATRE AROUND THE SHADOW PLAY. The pool scene got a room dimmed to | `drawShadowTheatre` |
| 17109 | MEDIUM — the exact opposite problem. The figures are now REAL BODIES in | — |
| 17166 | AND NOT EVERY COUNTRY IS DOING THE SAME THING — the pose lore | `POSE_LORE`, `poseLore`, `poseName` |
| 17328 | THE ROOM SHE IS ACTUALLY IN | `HALL_PLAN`, `hallPlan`, `drawHall`, `drawShadowPlay` |
| 17619 | MEDIUM CENSORING. The whole scene used to be one flat silhouette colour, | — |
| 17682 | THE POSABLE CONCEPT MODEL | `drawStagePlate`, `drawTheaterEthnic`, `drawPoolPlace` |
| 19198 | THE SHALLOWS. Two silhouettes at the waterline — and they were the same two | `waterMetrics`, `drawWaterCouple` |
| 19406 | THE DOMUS — walk your own villa. A/D stroll · SPACE act · W invite. | `DM`, `openDomus`, `domusExit` |
| 19424 | THE HALL LIGHT — one key light, and every figure in the room answers to it | `HALL_LIGHT`, `_LITB`, `litBufs`, `_litEdge`, `LIT_ON`, `litFigure`, `litWife`, `litHusband` … +1 more |
| 19574 | THE BEND. She is TEMPTING, and every so often there is something on the | `drawSteamVeil`, `drawUndressedFig`, `playerLook`, `drawDomusPlayer`, `tryPoolInvite`, `tryWardrobe`, `updateDomus`, `updateDomusScene` |
| 20458 | TEMPTING — THE LOW SHELF | `TEMPT_NEED` |
| 20479 | THE DROP — her side of the same room | `DROP_PROPS`, `DROP_NEED`, `DROP_LOOKS`, `dropDue`, `startDrop`, `updateDrop` |
| 20669 | HE DID NOT LOOK UP | `openIgnoredCard` |
| 20711 | HIS OWN IDEA | `beckonHusband` |
| 20736 | AN ACTUAL HAND | `drawSlapArm`, `husbandMoveDue`, `startHusbandMove` |
| 20794 | HIM ASKING, AND YOU ANSWERING | `updateBendAsk`, `drawBendAsk`, `updateHusbandMove`, `drawHusbandMove` |
| 20908 | THE JIGGLE, AND THE ELBOW — drawn, not nudged | `drawElbowOver` |
| 20953 | REACTION FACES | `figHeadBox`, `REACT_FACES`, `reactKindFor`, `drawReactFace`, `drawSlapAfter`, `startRefusal`, `updateRefusal`, `drawRefusal` |
| 21109 | THE RISE  —  🏛 PRIAPIC, and what a woman does about it | `RISE_STAGES`, `RISE_LINES`, `drawTunicBump`, `riseDue`, `startRise`, `RISE_NEED`, `updateRise`, `drawRise` |
| 21310 | THE ARDOR — his half of it, and the only half you drive yourself | `ARDOR_LINES`, `ARDOR_HOLD`, `ardorLen`, `ardorNeed`, `ardorDrain`, `ardorReady`, `ardorAvailableNow`, `tryArdor` … +5 more |
| 21574 | THE MARKER — a hand-drawn prompt over your own head, not an emoji. | `ardorBlockedWhy`, `drawArdorIcon`, `drawDrop`, `temptDue`, `TEMPT_PROPS`, `startTempt`, `updateTempt` |
| 21892 | THE VILLA'S OWN WOOHOO — fifteen seconds, in the room you are standing in | `VILLALOVE_LEN` |
| 21908 | 2 · CAUGHT | `CAUGHT_LINES`, `rollWalkIn`, `fireWalkIn`, `startVillaLove`, `villaLoveFinish`, `updateVillaLove` |
| 22027 | HIM, IN FOUR STAGES | — |
| 22038 | THE SLAP | — |
| 22048 | WHAT THIS PEOPLE THINKS OF A HAND ON HER, AND WHERE | `HAND_ON_HER` |
| 22173 | AND HOW SHE ACTUALLY ANSWERS | `SLAP_REPLY`, `handOnHer`, `slapReply`, `slapExposure`, `slapVerdict`, `doSlap` |
| 22318 | WHO IS IN THE ROOM | `BABY_YEARS`, `kidsPresent`, `villaClear`, `privacyTier` |
| 22356 | WHAT MONEY ACTUALLY BUYS YOU | `houseWealth`, `DISCRETION`, `discretionTier`, `watchersRaw`, `watchersPresent`, `watchersAbsorbed`, `houseIsWatching`, `privacyNeeded` … +4 more |
| 22472 | THE ROMANTIC ONE | — |
| 22485 | THE ROMANTIC SLAP, IN EVERY LANGUAGE IT HAPPENS IN | `SLAP_CRACK`, `slapCrack`, `ROMANTIC_REPLY`, `romanticReply`, `romanticVerdict`, `romanticSelf` |
| 22650 | “BEND HERE.” | `askToBend`, `BEND_ASK`, `bendAskLines`, `startRomantic` |
| 22727 | AND THE ROMANTIC ONE GETS THE SAME REWORK — with its own character | `updateRomantic` |
| 22797 | HER SPRITE FOR THIS ONE | — |
| 22808 | HOW SHE BENDS, AND WHETHER SHE BENDS AT ALL | `ROMANTIC_BEND`, `romanticBend`, `BEND_WORD`, `romanticBendWord`, `drawBendBrace` |
| 22943 | AND A HUSBAND BENDS TOO | `drawRomanticFig`, `drawRomanticFem`, `drawRomanticMale`, `drawRomantic` |
| 23223 | THE SWING | `STRIKES`, `romanticSwing` |
| 23254 | THE SLAP, REBUILT — the four beats an animator would actually give it | `SLAP_T`, `SLAP_ANG`, `SLAP_PIV`, `slapAng`, `slapArmVis`, `slapHand`, `hallShake`, `kickShake` … +11 more |
| 23893 | THE LONGHOUSE IN THE CLEARING | `hallProvince`, `hallStyle`, `drawForestShell` |
| 24043 | FOUR MORE HALLS — because only two of the seven were ever drawn | `drawCourtyardShell`, `drawGerShell`, `drawShoinShell`, `drawPillaredShell`, `drawDomus` |
| 24279 | THE HOUSE | — |
| 24893 | META SCREENS WIRING | `openSlots`, `refreshAdultBtn`, `prevHelp`, `settingsFrom`, `openSettings`, `closeSettings`, `buildSettings` |
| 25000 | THE WOOHOO GUIDE | `woohooFrom`, `openWoohooGuide`, `closeWoohooGuide`, `WOOHOO_GUIDE`, `buildWoohooGuide`, `refreshSettings`, `openStats`, `buildStats` … +1 more |
| 25128 | THE ROLL AT THE ENROLMENT TABLE — before the oath you roll for the body | `IMPOSSIBLE_CHANCE`, `rollHiddenPotential`, `rollCreation`, `rollBanner`, `STAT_COL`, `drawCardPortrait`, `drawBrideCut`, `drawBridePortrait` |
| 26058 | AND THEN HER PEOPLE'S ACTUAL CUT GOES OVER THE TOP OF IT | `openCreate` |
| 26403 | AND THE OATH BUTTON IS SET FROM THE TRUTH, ONCE, AT THE END | — |
| 26456 | WHERE YOU ACTUALLY WAKE UP | — |
| 26506 | THE SILK ROAD — the eastern game's own economy, and its own history | `SILK_LEGS`, `silkLeg`, `silkOpen`, `SILK_STAKE_CAP`, `silkStake`, `silkOdds`, `silkRun` |
| 26614 | THE MARKET — 楽市楽座, AND WHY IT WAS A WEAPON | `COIN_GRADES`, `MARKET_RULES`, `MARKET_OF`, `marketHere`, `ensurePurse`, `purseFace`, `purseHere`, `erizeniQuote` … +1 more |
| 26751 | THE NANBAN TRADE — silver out, silk in, and one ship a year | `NANBAN_GOODS`, `NANBAN_PORTS`, `nanbanHere`, `kurofuneIn`, `kurofuneDays`, `pancadaMul`, `nanbanBuy`, `nanbanSell` |
| 26831 | THE FIVE TRADITIONS — 五箇伝, AND A BLADE IS NOT A BLADE | `GOKADEN`, `gokaden`, `BLADED_WA`, `bladeSchoolOf`, `bladeIsSchooled`, `TAMESHI`, `tameshiDone`, `ensureBlade` … +1 more |
| 26904 | THE SWORDSMITH — pick a tradition, then prove the blade | `openSmith` |
| 27012 | THE POWDER SUPPLY — and it is a foreign policy problem | `POWDER_SRC`, `powderSourcesHere`, `POWDER_MAX`, `powderHave`, `buyPowder` |
| 27065 | THE PORT — how a man with no name and no land gets rich | `VENTURES`, `ventureOpen`, `ventureStake`, `ventureOdds`, `runVenture` |
| 27129 | THE STANDARDS — what you may and may not do here, said plainly | `standardsHere`, `openStandards` |
| 27192 | YOUR OWN HOUSE — a name, a crest, a colour, and a banner over it | `MON_CHOICES`, `CLAN_COLS`, `waHouseName`, `canFoundHouse`, `foundHouse`, `openFoundHouse`, `openMarket`, `openSilk` |
| 27644 | THE HUB IS NOT THE SAME HUB | `HUB_EAST`, `HUB_WA`, `HUB_WEST_LABEL`, `applyHub`, `enterMap`, `regionUnlocked`, `imperialAvailable`, `travelCost` … +15 more |
| 28237 | THE BARBER AND THE CLOTHIER — you had eight cuts, five beards, seven | `outfitAllowed`, `outfitLockNote`, `barberCost`, `clothierCost`, `buildBarberCard`, `buildLegacyCard`, `buildSuccessionCard`, `succession` |
| 28520 | THE SON'S PATH — THE LEGIONS. An heir may refuse the sand and take a | — |
| 28525 | THE ARMY IN DEPTH — a legion is not a number. It is cohorts of specific | `UNIT_TYPES`, `unitCount`, `armySize`, `armyUpkeep`, `armyPowerDetail`, `supplyState`, `FORTRESSES`, `MIL_RANKS` … +14 more |
| 28846 | THE FAMILY TREE, IN FOUR REGISTERS | `TREE_TAB`, `treeTabs`, `openTree` |
| 29249 | ⚭ THE NOBLE TREE — WHO YOU ARE RELATED TO BY CONTRACT | `nobleHouses`, `treeNoble` |
| 29416 | 🏛 THE GOVERNOR'S TREE — WHAT YOU ADMINISTER | `treeGovernor`, `openTitles`, `herbBack`, `openHerbs` |
| 29612 | PROVINCIAL MANAGEMENT — tax, garrison, grain, governors and unrest, | `openProvinces` |
| 29738 | THE NIGHT THEY COME FOR THE PURPLE — when RISK TO THE PURPLE runs hot | `coupDue`, `maybeCoup`, `openCoup` |
| 29850 | CALL-OUTS — Rome says what it thinks of you, out loud, in the street. | `maybeCallout` |
| 29855 | SHE ASKS FIRST | `FESTIVALS`, `festivalToday`, `anWord`, `spouseExcuse`, `SPOUSE_ASKS`, `quirkAside`, `spouseAskDue`, `maybeSpouseAsk` |
| 30031 | THE CHILDREN, ONCE THEY ARE PEOPLE | `kidAgeYears`, `kidBand`, `livingKids` |
| 30050 | HOW BIG A CHILD IS DRAWN | `kidDrawScale`, `grownLook`, `drawChildFigure`, `kidsOfBand`, `kidName`, `kidHe`, `kidHim`, `kidSon` … +1 more |
| 30130 | THE SUITOR HALL — marrying off a grown child | `SUITOR_HOUSES`, `SUITOR_STYLE`, `suitorRank`, `makeSuitorFor`, `suitorForecast` |
| 30227 | WHAT THE DISTRICT CALLS THEM | `ARD_TITLES`, `KID_TITLES`, `pickTitle`, `bedTitle`, `myBedTitle` |
| 30276 | THE ESCORT — he takes her to the room, and HOW he does it is the whole | `ESCORT_POSES`, `escortPoseFor`, `escortPose`, `coupleLooks`, `drawCarriedFem`, `ESCORT_WIFE_DX`, `maybeArmSwat`, `drawArmSwat` … +2 more |
| 30525 | THE HOUSE GROWS WITH THE ESTATE | — |
| 30538 | THE HOUSE IS NOT A DOMUS EVERYWHERE | `HOUSE_SETS`, `houseSetId`, `houseSet`, `HOUSE_TIERS`, `houseTier`, `hasRoom`, `SECTION_X` |
| 30692 | THE SECTIONS THEMSELVES | `drawCulina`, `drawTriclinium`, `drawPeristyle`, `drawLararium`, `drawHouseSections`, `DOMUS_UPPER`, `STAIR_X0`, `STAIR_X1` … +21 more |
| 31161 | THE ONE LOOK | `peekKey`, `peekUsed`, `markPeeked`, `PEEK_ROOM`, `PEEK_STAGE` |
| 31196 | THEY ARE NOT IN THE SAME STATE AS EACH OTHER | `HEAT_HIM`, `HEAT_HER` |
| 31212 | AND WHAT THEY WERE ACTUALLY DOING | `PEEK_ACTS`, `PEEK_ACT_MAP`, `peekActWeight`, `peekAct`, `peekHeat`, `PEEK_REACT`, `peekReactFor`, `startPeek` … +18 more |
| 31942 | GRAVITAS  —  THE FACE YOU WEAR OUTSIDE THE DOOR | `gravitasRaw`, `gravitas`, `setGravitas`, `GRAVITAS_TIERS`, `gravitasTier`, `gravitasHit`, `gravitasTick` |
| 32042 | THE MARRIAGE LEDGER  —  standing, favours, feuds, and grandchildren | `inlawStanding`, `setStanding`, `standingLabel`, `FEUD_LINES`, `feudsList`, `feudOn`, `addFeud`, `feudHeat` … +3 more |
| 32128 | 11 · WHAT THE IN-LAWS ARE ACTUALLY LIKE | `INLAW_TRAIT_FX`, `INLAW_FLAW_FX`, `inlawTraitsOf`, `inlawFlawsOf`, `favourSurcharge`, `inlawTick` |
| 32231 | TEACHING THEM THE FACE | `kidDecorum`, `setDecorum`, `DECORUM_TIERS`, `decorumTier`, `DECORUM_DRILL`, `teachableKids`, `teachDecorum`, `KID_BLURTS` … +3 more |
| 32355 | 1 · THE MORNING AFTER   ·   4 · THE ANNIVERSARY | `MORNING_WARM`, `MORNING_COOL`, `morningDue`, `morningCard`, `annivYears`, `annivDue`, `annivCard` |
| 32464 | WHO IS IN WHICH ROOM | `HOUSE_ROOMS`, `roomsOccupiedToday`, `roomOccupant`, `placeMenuUp` |
| 32505 | THE DOOR — AND IT IS NOT THE SAME DOOR IN EVERY HOUSE | `DOOR_PLAN`, `doorPlan`, `drawDoorLamp`, `drawHallExit`, `drawDoor`, `houseGuestBusy`, `suitorsAvailable`, `makeCheatSuitor` … +3 more |
| 33107 | 14 · HAGGLING THE DOWRY | `haggleLeverage`, `HAGGLE_POSTURES`, `openHaggle`, `openWeddingChoice`, `buildSuitorCard` |
| 33242 | THE FACE, AND TEACHING IT — the villa's own card for both | `buildGravitasCard` |
| 33292 | TAKING THE KING'S SALT | `inParthia`, `buildParthiaCard` |
| 33335 | THE LAW OF THIS PLACE — the card that tells you what you are living under | — |
| 33343 | THE CHOICE — and it prints the price BEFORE you take it | `buildEastActCard`, `buildActCard`, `buildMoresCard`, `buildDiscretionCard` |
| 33525 | 13 · GOING TO SEE YOUR DAUGHTER | `visitableKids`, `VISIT_SCENES`, `buildVisitCard`, `buildFeudCard`, `buildKidHousesCard`, `FAMILY_EVENTS`, `familyDue`, `maybeFamily` … +6 more |
| 34079 | THE GROOM'S PLATE — the same painted alcove her portrait gets, and HIS | `drawGroomPortrait`, `briadeImg`, `marriageEffectsText`, `LOVE_CAP`, `bedLen`, `loveLeft`, `spendLove`, `vigilReady` … +2 more |
| 34171 | JEALOUSY — she notices. Neglect, other women, and a wandering | `jealousyLevel`, `jealousyLabel`, `addJealousy`, `easeJealousy`, `jealousyEffects`, `jealousyBlocksBed` |
| 34215 | THE TABULA — a wax-tablet note home, ancient texting. Her reply is | `NOTE_PRESETS`, `NOTE_WORDS`, `noteSentiment`, `noteBaseTier`, `NOTE_REPLIES`, `NOTE_AFTERGLOW`, `NOTE_APOLOGY_SOFT`, `NOTE_QUESTION` … +46 more |
| 35639 | PROVINCE TERRITORIES — every playable region as an actual shape on the | `PROV_SHAPES`, `PROV_SEAMS`, `lonlat` |
| 35688 | THE EASTERN WORLD, c. 200 A.D. | `MAP_EAST_PROJ`, `lonlatE`, `eastXY`, `REGIONS_EAST` |
| 35768 | TWELVE MORE, BECAUSE TWENTY-TWO WAS NOT ASIA | `REGION_EAST_BY_ID` |
| 35811 | THE RKRAI SHORE — an invented people, held to internal consistency | — |
| 35843 | THE BORDER, AND IT IS NOT AN ISLAND | `RK_COAST`, `RK_INLAND_FROM`, `rkIsCoast`, `RK_BEYOND`, `rkXY`, `REGIONS_RK`, `REGION_RK_BY_ID` |
| 35911 | THE MASTERIES — the Rkrai theology, and it is a civil service | `RK_MASTERIES`, `RK_MASTERY_BY_ID` |
| 35981 | AND THE LADDER, WHICH IS WRITTEN DOWN | `RK_RANKS`, `rkRankIdx`, `rkRank` |
| 36010 | THE THIRD SHEET — WA, AND THE CROSSING THAT COST THIRTEEN CENTURIES | — |
| 36032 | THE PROJECTION — and why this sheet is turned on its side | `MAP_WA_PROJ`, `lonlatW`, `waXY`, `REGIONS_WA`, `REGION_WA_BY_ID` |
| 36150 | THE CLANS — 1543-1590, AND WHY THE MAP IS A PATCHWORK | `CLANS_WA`, `CLAN_OF_WA`, `clanOf`, `clanIdOf`, `clanHolds` |
| 36236 | THE MON — the crest, drawn rather than lettered | `drawMon`, `WA_REFUSAL`, `regionBlocked`, `refuseBlocked` |
| 36398 | THE CROSSING — and what it costs is not money | `CROSS_PORTS`, `canAttemptCrossing`, `crossingBlockReason`, `CROSSING_LOG`, `CROSSING_ARRIVAL`, `beginCrossing`, `openCrossing`, `openCrossingLog` |
| 36535 | THE EASTERN SHEET — drawn from real coastlines, like the western one | `drawMapCanvasEast` |
| 36771 | THE WA SHEET — Honshū, Kyūshū, Shikoku, from real coastlines | — |
| 36788 | THE COASTLINE — traced, not blocked out | `WA_HONSHU`, `WA_KYUSHU`, `WA_SHIKOKU`, `WA_EZO` |
| 36865 | AND THE ISLANDS, which are not decoration in this century | `WA_ISLES` |
| 36894 | THE PATCHWORK — territory by colour, and a border where houses meet | `_waTerrBuf`, `waTerritory`, `WA_CREST_AT`, `drawWaCrests` |
| 37024 | WHERE THE LABELS GO — six seats inside two degrees | `WA_PIN_POS`, `layoutWaPins`, `drawWaLeaders` |
| 37088 | THE RKRAI SHORE, DRAWN | `drawMapCanvasRk`, `drawMapCanvasWa`, `agePlateWa` |
| 37442 | THE PLATE — what makes a map look like a MAP of its own century | `agePlate`, `coastHatch`, `drawMapLegend`, `drawCompass`, `drawScaleBar`, `drawMapCanvas`, `briefCtx`, `tierName` … +1 more |
| 38233 | THE LANISTA'S CELLS — pay the fee, then pick your man | `openRigPick`, `shopTab` |
| 38316 | THE RANGED RACK, DRAWN — every one of these was an emoji | `drawRangedIcon`, `drawGearIcon`, `gearIconImg`, `openShop` |
| 39275 | THE LUDUS — drilled skills, real wounds, and a body that wears out. | `SKILLS`, `skillLvl`, `skillCost` |
| 39287 | THE BODY, WHICH YOU COULD NOT TRAIN | `BODYSKILLS`, `BODYSKILL_NAME`, `bodySkillNames`, `bodyLvl`, `BODYSKILL_MAX`, `bodyCost`, `bodyHpBonus`, `bodyMitBonus` … +4 more |
| 39366 | SCARS — THE ARENA'S PRICE, AND IT IS PAID ON THE SKIN. A wound that closes | `scarZoneOf`, `addScar`, `scarName`, `scarList`, `scarCount`, `drawScarsOn` |
| 39411 | AN ICON FOR EACH, DRAWN | `drawBodySkillIcon`, `trainScreen` |
| 39572 | BOOT | — |
| 39579 | PIXEL LOGO — "SAND ⛑ STEEL" on riveted crimson planks + favicon | `LOGO_F`, `LOGO_HELM`, `drawLogoHelm`, `drawLogo` |
