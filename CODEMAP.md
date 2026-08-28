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
| 844 | AND WHICH TRADE THE GROUND ITSELF FIELDS | `WA_GROUND_CLASSES`, `classesForWorld`, `CLASS_ORDER`, `CLASS_ORDER_EAST`, `GEAR` |
| 914 | THE ARSENAL OF THE SENGOKU — and the sword is not the point of it | — |
| 928 | THE POOR MAN'S ARSENAL — and it is the farm shed | — |
| 945 | BAMBOO, AND WHY — the correction | `gearOf`, `PILUM`, `aimZoneFor`, `rangedDamage`, `pilumDamage`, `BOWS` |
| 1158 | THE YUMI — and why the samurai spent five hundred years on it | — |
| 1175 | THE GUNS — and the trade-off IS the history | — |
| 1218 | THE REST OF THE POWDER — and the honest note about rifles | `bowOf` |
| 1251 | WHAT THE SHOP ACTUALLY STOCKS | `gearWorldOf`, `gearStockedHere`, `isGun` |
| 1273 | IT IS NOT A BOW. STOP CALLING IT A BOW. | `rangedWords`, `rangedShelfName` |
| 1303 | YOU CANNOT SIMPLY BUY THIS | `rankTier`, `gearGate`, `gearBuyable`, `rangedCooldown` |
| 1357 | THE WEATHER — which exists in this game only because the gun does | `WET_CHANCE`, `rollWeather`, `isWet`, `misfireChance`, `FOE_NAMES`, `FOE_TITLES`, `ARCHETYPES`, `ARCH_ORDER_WEST` … +3 more |
| 1490 | TWO WORLDS, ONE GAME | — |
| 1502 | THE SEVEN SENGOKU CAREERS | — |
| 1511 | THE ROLE IS THE RANK — nobody chooses out of the whole list | `WORLDS`, `WORLD_IDS`, `worldOfArch`, `regionsForWorld`, `regionAny`, `worldOfRegion`, `playerWorld`, `SOCIAL` … +1 more |
| 1648 | THE EASTERN LADDER — nobody in Luoyang was ever a patrician | `SOCIAL_EAST` |
| 1757 | WA · and the ladder here is measured in RICE | `socialSetFor`, `socialSetForSel`, `socialRung`, `playerRung` |
| 1808 | THE OTHER LEDGER'S SELLER — who you go to for it depends entirely on | `SECRET_SELLERS`, `ELITE_MEN`, `ELITE_WOMEN`, `PLOT_TARGETS`, `OFFICES`, `KEY_PROVINCES`, `keyCount`, `GEN_NAMES` … +2 more |
| 1895 | MARRIAGE — take a wife once powerful (or, as an elite, by dynastic duty) | `BRIDE` |
| 1923 | AND EVERYWHERE ELSE ON EARTH | `BRIDE_ETHS`, `BRIDE_ETHS_BY_WORLD`, `WA_PORTS`, `brideEthsHere`, `homeBrideEth` |
| 1996 | THE CULTURES — what a people actually BELIEVED, as numbers | `CULTURES` |
| 2132 | THE EASTERN PEOPLES — four more rows in the same tables | — |
| 2222 | WA · and it is thirteen hundred years from everything else in this game | `CULTURE_IDS`, `cultureById`, `ARCH_CULTURE`, `ARCH_RANK`, `archRank`, `RANK_LOCK`, `RANK_COL`, `rankLockNote` … +5 more |
| 2373 | TRIBAL RANK — a chieftain's wife did not dress like a herdsman's | `isTribal`, `tribalRank`, `tribalTier`, `tribalCloth`, `coverageBand`, `localCulture` |
| 2454 | THE MORES — what each people's LAW actually did about it | `MORES` |
| 2595 | WA · what a household may and may not do, in this century | `moresOf` |
| 2632 | RIGGING THE BOUT — the fee gets you in the room, the man costs extra | `RIG_FEE`, `RIG_BUILDS`, `rigBuild`, `rigManPrice`, `rigSuspicion`, `rigPurseMul`, `drawRigCandidate` |
| 2755 | THE COIN IN YOUR HAND — and it is not a denarius everywhere | `CURRENCY` |
| 2817 | SENGOKU JAPAN · and it has THREE moneys at once, which is the point | `CURRENCY_OF`, `CURRENCY_REGION`, `currencyHere`, `coinWord`, `coinShortStr`, `drawCoinIcon`, `_COINIMG`, `coinIconURI` … +1 more |
| 2988 | THE MOS — WHAT ROME ACTUALLY OBJECTED TO, AND WHY | `ACTS`, `ACT_BY_ID` |
| 3051 | THE EASTERN BEDCHAMBER — a different question entirely | `EAST_ACTS` |
| 3166 | WA · and the household is a chapter of the war | — |
| 3218 | THE EASTERN MATCH — nobody in Luoyang negotiates a Roman dowry | `MATCH_EAST`, `matchEast`, `matchEastForPlayer`, `eastDowryLine`, `buildEastMatchCard`, `eastActSet`, `eastActById`, `eastAxisValue` … +4 more |
| 3482 | HOW FAR ROME'S OPINION ACTUALLY REACHES | — |
| 3507 | WHERE MEN ACTUALLY FOUGHT — and it was NOT an amphitheatre everywhere | `VENUES` |
| 3605 | WA — and there is no arena anywhere in it | `VENUE_OF`, `VENUE_REGION`, `venueHere`, `venueName`, `venueIsShow`, `REPUTATION_REACH`, `reputationReach`, `reachBand` … +9 more |
| 3843 | RESOLVING AN ACT — does anyone find out, and what does it cost | `actWitnessChance`, `resolveAct`, `actHerView`, `osImpurumTick`, `localMores`, `legalExposure`, `exposureSplit`, `fashionOffence` |
| 3965 | THE EYE, DECIDED ONCE, FOR EVERY FACE IN THE GAME | `INK_EYE_CULTURES`, `inkEyes`, `inkEyesOver` |
| 4004 | HAIR — ONE SYSTEM, DRAWN THE SAME EVERYWHERE. | `HAIR_F`, `HAIR_M`, `BEARD_M`, `HAIR_M_BY_ETH`, `BEARD_BY_ETH`, `HAIR_COL_M`, `HAIR_F_BY_ETH`, `OUTFITS_M` … +9 more |
| 4506 | SMALL-SCALE HAIR — one routine, every sprite that is not a portrait | `drawHairSmall`, `hairStyleFallback`, `beardFallback`, `outfitFallback`, `hairStyleName`, `beardName`, `fixTraitsForSex`, `ensureQuirks` … +2 more |
| 4625 | BLOODLINE — every spouse carries LOOKS, SMARTS and TRAITS. Children | `BUILDS`, `LOOK_STAGES`, `lookStage` |
| 4642 | THE SAME LADDER, ON THE WALL. The shadow-play reads the very stage the | `SHADOW_STAGES`, `shadowStage`, `BODY_PARTS`, `BODY_PARTS_M`, `SECRET_PART`, `secretUnlocked`, `secretAllowed`, `partsFor` … +4 more |
| 4752 | DIRECT SPOUSE DESCRIPTIONS  (Settings → Direct spouse descriptions) | `BLUNT_WORDS`, `BLUNT_PLURAL`, `bluntWord`, `bluntDowry`, `bluntBrief`, `bodyTierLine`, `rollBody`, `makeImpossibleBody` |
| 4837 | YOUR OWN BLOOD — rolled at the enrolment table like anyone else's. | `rollPlayerBody`, `bodyAvg`, `ensurePlayerBody`, `selfSubject`, `syncPlayerLooks` |
| 4891 | THE HOUSE YOU WERE BORN INTO — a father, a mother, brothers and | `FATHERS`, `MOTHERS`, `SIB_ROLES_M`, `SIB_ROLES_F`, `NAMES_M`, `NAMES_F`, `makeFamily`, `kinAge` … +1 more |
| 5026 | THE FAMILY PORTRAIT GALLERY — every name in your house gets a drawn | `KIN_SKINS`, `KIN_HAIRS`, `kinHash`, `kinLook`, `kinInherit`, `drawKinPortrait` |
| 5299 | THE IMPERIAL COURT — the people who actually decide whether a purple-born | `PRAETORIAN_PREFECTS`, `COURT_FIGURES`, `makeCourt`, `COURT_LEVERS`, `courtBonus`, `courtCultivateCost`, `purpleRisk`, `opinionsOfYou` |
| 5395 | LOOKS ARE POLITICS. For a prince, a princess, an Augusta or a powerful | `beautyPower`, `BEAUTY_GIFTS`, `toleranceScore`, `loyaltyScore` |
| 5461 | PROVINCIAL MANAGEMENT — a title is not a trophy, it is a job. Every | `PROV_GOVS`, `provOf`, `heldProvinces`, `provUnrestAvg`, `TAX_NAMES`, `provIncome`, `provUpkeep`, `provDailyTick` |
| 5515 | PUBLIC COMPLAINTS — the price of governing. Petitions come up from the | `COMPLAINT_KINDS`, `rollComplaint`, `pendingComplaints`, `complaintPressure` |
| 5552 | CALL-OUTS — somebody in the crowd says something about you, out loud, | `CALLOUT_LINES_F`, `CALLOUT_LINES_M` |
| 5573 | AND THE STREET DOES NOT SHOUT THE SAME THING EITHER | `CALLOUT_CULTURE`, `calloutLines`, `calloutDue` |
| 5659 | PUBLIC EYES — where the eyes actually go. A walking figure, an eye on | `GAZE_BASE_F`, `GAZE_BASE_M` |
| 5666 | WHERE THEY ACTUALLY LOOK, AND IT IS NOT THE SAME PLACE | `GAZE_CULTURE`, `GAZE_VOICE`, `gazeVoice`, `gazeBase`, `gazeWeights`, `WIFE_TRAITS`, `WIFE_FLAWS` |
| 5889 | QUIRKS — THE MIDDLE TIER | `WIFE_QUIRKS` |
| 5963 | THE OUTER TIERS. Three bands was still too flat — everything good was | `WIFE_BOONS`, `WIFE_BANES`, `boonById`, `baneById`, `hasBoon`, `hasBane`, `rollBoons`, `rollBanes` … +11 more |
| 6059 | THE CHIPS. These used to be three words of coloured text in a row, | `CHIP_TIERS`, `traitChip` |
| 6107 | A TRAIT THAT BELONGS TO THE OTHER SEX IS NOT YOURS | `traitsForSex`, `traitsHtml`, `traitsDetailHtml`, `hasFlaw`, `rollFlaws`, `TIERS`, `spouseTierName`, `slapLabel` … +13 more |
| 6462 | THE BODY MAP — a matchmaker's chart, bought once for 200d. Every region | `heatColor`, `bmCache`, `bmResetCache`, `bmOnce` |
| 6484 | THE SHAKE — and it is HER OWN MEASUREMENTS doing it | `SHIMMY`, `shimmyOf`, `SHIMMY_TIER`, `shimmyStart`, `shimmyTick`, `shimmyLive`, `shimmyEnv`, `shimmyHip` … +5 more |
| 6587 | SLAP PHYSICS — one damped spring, shared by every figure that can take one | `SLAPJ`, `slapKick`, `slapJigTick`, `slapJig`, `slapLive` |
| 6621 | THE CHART FIGURE — built FOR the chart, not borrowed from the villa | `chartLandmarks`, `drawChartFig`, `drawBodyMap` |
| 6885 | THE REAL FIGURE, if you asked for it. | `rgbTriple`, `shade2`, `lit2`, `rgbA`, `drawMapReadout`, `drawMapScale`, `drawWalkFigure`, `drawEyeGlyph` … +12 more |
| 7765 | COURTSHIP — YOU HAVE TO TALK. | `COURT_RANKS` |
| 7795 | WHERE YOU STAND, ON WHATEVER LADDER YOU ARE ON | `socialRankIndex`, `wealthRungs`, `effectiveRank`, `courtAccess`, `COURT_PROMPTS`, `COURT_BOASTS`, `MEDIUM_CENSOR`, `COURT_RESULT` … +22 more |
| 8489 | THE LEGACY HOUSE — a dynastic seat you plant in a province of your | `LEGACY_INFO` |
| 8511 | AND YOU CANNOT SEAT YOUR NAME IN AEGYPTUS FROM KYŌTO | `LEGACY_EAST`, `LEGACY_WA`, `legacySet`, `legacyLevels`, `legacyWord`, `legacyInfo`, `LEGACY_LEVELS`, `legacyScore` … +4 more |
| 8644 | GAME STATE / SAVE | `SAVE_KEY`, `SLOT_KEY`, `NSLOTS`, `saveSlot`, `slotKey`, `setSlot`, `slotInfo`, `G` … +1 more |
| 8755 | THE GLADIATRIX — a woman fights in DEFIANCE of the Emperor's ban. The | `GLADIATRIX_EVENTS`, `gladiatrixStageFrom`, `gladiatrixAfterWin`, `gladiatrixBriefBlock`, `checkFamilyMan`, `elevateWife`, `migrate`, `saveGame` … +2 more |
| 8850 | MATURE-CONTENT GATE | `ADULT_KEY`, `ADULT`, `setAdult`, `SETTINGS_KEY`, `SETTINGS`, `saveSettings`, `DIFF`, `diffMul` … +9 more |
| 8897 | UI: stat bar + toast | `refreshStatbar`, `MOUNTS`, `toastT`, `toast` |
| 8934 | PIXEL SPRITE: gladiator (drawn procedurally, faces +x by default) | `SKIN` |
| 8939 | WHOSE FACES ARE IN THE ROOM | `SKIN_BY_CULT`, `skinHere`, `pickSkin`, `skinAt`, `shade`, `mixHex` |
| 9001 | THE YEARS, WRITTEN ON THE FACE. One number in, four things out — and every | `ageMarks`, `greyHair`, `agedSkin`, `paletteFor`, `drawGladiator`, `drawBeast` |
| 9120 | THE SASHIMONO — the flag on a man's back | `drawSashimono`, `drawGladBody`, `drawStuck`, `drawSlashFx`, `drawLeg`, `drawTorso` |
| 9272 | THE EAST AND THE SENGOKU, ON THE BODY | `drawHead` |
| 9370 | THE EYES, AND THEY ARE NOT THE SAME EYES EVERYWHERE | `drawHelmet2` |
| 9489 | THE SENGOKU HEAD — and none of it is a Roman galea | `drawShield2`, `drawArm2` |
| 9683 | YOU DO NOT WIND UP A MATCHLOCK | `drawGunArms`, `drawThrowArm`, `drawWeapon2` |
| 9818 | THE FIVE BAMBOO PIECES — and not one of them is a bamboo sword, | — |
| 10059 | ARENA RENDERING | `makeFighter`, `FT`, `makeArenaFoe`, `NAVAL_NAMES`, `BEASTS`, `pickBeast`, `makeBeast` |
| 10156 | NEMESIS — a named rival who rises with you, taunts, meddles, and finally | `NEM_FIRST`, `NEM_EPITHET`, `NEM_TAUNTS`, `nemFull`, `makeNemesis`, `nemesisAfterWin`, `drawNemesisPortrait`, `nemesisBriefBlock` … +10 more |
| 10471 | THE SIDEARM — 抜刀, and it is why the daishō exists | `hasSidearm`, `sidearmName`, `drawnWeaponName`, `rangedReady`, `switchWeapon`, `autoDrawBlade`, `playerRanged`, `beginRangedCharge` … +5 more |
| 10652 | THE BLAST — the only area weapon in the game, and it is ceramic | `blastAt`, `updateBurns` |
| 10706 | THE RAIN — which has been a number nobody could see | `initRain`, `updateRain`, `drawRain`, `drawWetNotice`, `gunSmoke`, `updateGunSmoke`, `drawGunSmoke`, `throwPilum` … +8 more |
| 10984 | WHAT A MATCHLOCK LOOKS LIKE, and it is not a musket | `drawHeldGun`, `drawHeldBomb`, `drawHeldBow`, `drawArrow`, `aiUpdate`, `beastHop`, `beastLunge`, `beastBite` … +14 more |
| 11604 | ARENA DRAW | `drawVillaBg`, `drawDeadTree`, `drawPitBg` |
| 11727 | THE THEATRES OF THE EMPIRE | `ARENA_THEATRES` |
| 11806 | THE EASTERN GROUNDS — and NOT ONE OF THEM IS AN AMPHITHEATRE | — |
| 11877 | THE SIX GROUNDS OF THE SENGOKU — and every house has its own | `waHouseHere`, `THEATRE_OF`, `theatreOf`, `THEATRE_FOES`, `theatreFoeName`, `crowdIsHostile`, `drawTheatreSkyline`, `drawArena` |
| 12253 | WHAT IS ACTUALLY STANDING BEHIND THE FIGHTERS | `drawShadow`, `drawCrowd`, `drawEmperorBox`, `drawVerdict`, `pixelText` |
| 12822 | AUDIO (tiny WebAudio blips, guarded) | `AC`, `noiseBuf` |
| 12827 | THE SOUND ENGINE | `MASTER`, `audioBus`, `revSend`, `blip`, `hiss`, `tone`, `noise`, `sfx` |
| 13154 | INPUT  (exact scheme required) | `held`, `edge`, `setEdge`, `consume`, `resetInputEdges`, `touchPref`, `touchCapable`, `coarsePointer` … +5 more |
| 13274 | MAIN LOOP | `state`, `last`, `loop`, `menuStars`, `drawMenuBg` |
| 13348 | ARMY BATTLE — army-vs-army (a different battle type, no 1v1) | `BT`, `armyBattle`, `updateBattle`, `drawBattleSoldier`, `drawBattleHorse`, `drawBattleHost`, `drawBattle`, `finishBattle` |
| 13507 | THE CIRCUS MAXIMUS — chariot racing, an entirely separate game. | `FACTIONS`, `RACER_NAMES`, `RACE_LAPS`, `LANE_Y`, `RC`, `startRace`, `aiRace`, `updateRace` … +5 more |
| 13673 | THE DAUGHTER'S PATH — THE COURTS. An heiress may refuse the sand and | `CASE_TYPES`, `ARGUMENTS`, `PATRONS`, `RIVAL_ADVOCATES`, `LANDMARKS` |
| 13718 | THE REGALIA — the visible instruments of power. Julia Domna, empress in | `REGALIA`, `hasRegalia`, `powerScore`, `CASE`, `caseDifficulty`, `startCase`, `renderCase`, `playArgument` … +5 more |
| 13987 | THE DOMINUS CONSOLE — cheats. Coin, glory, provinces, the purple. | `openCheats`, `openCircus` |
| 14209 | THE FAMILY PORTRAIT — the whole house, painted in one gold frame | — |
| 14214 | HIS FACE, ONCE, FOR EVERYONE WHO DRAWS HIM | `drawManFace`, `drawHusbandFig`, `drawKidFig`, `openPortrait` |
| 14546 | THE BEDCHAMBER — an implied scene: she runs, the toga flies, the door | `BC`, `startBedScene`, `updateWifeHappy`, `drawWifeHappy`, `updateBed`, `drawShadowMale`, `drawShadowWalkerF`, `drawShadowFigure` |
| 14726 | EXHAUSTION AND OVER-EXTENSION — the thing that actually broke Rome. | `CORE_PROVINCES`, `isCore`, `provReach`, `supplyCapacity`, `supplyLoad`, `overExtension`, `exhaustion`, `addExhaustion` … +3 more |
| 14811 | THE TITLES OF ROME — every honour the game can give you, in one | `TITLES`, `TITLE_BY_ID`, `titleName`, `titleIsMasculineOnHer`, `earnedTitles`, `titleSlots`, `equippedTitles`, `BOON_LABEL` … +4 more |
| 14998 | THE CONFERRING — a rank-8 honour is not a silent unlock. The Senate | `TITLE_RITES`, `titleRiteDue`, `maybeTitleRite`, `openTitleRite` |
| 15079 | THE INSCRIPTION — what goes on the stone. A Roman's tomb listed every | `fullTitulature`, `inscriptionHTML`, `inheritTitulature`, `drawTitleEmblem` |
| 15220 | THE HERBARIUS — a real Roman apothecary. Every plant here is one a | `HERBS`, `HERB_BY_ID`, `herbCount`, `herbAdd`, `herbUse` |
| 15257 | ILLNESS — Rome was a sickly place and the physicians knew it. Somebody | `ILLNESSES`, `rollIllness`, `illnessBite`, `curesIll`, `BIRTH_HERBS`, `birthHerbsReady`, `birthRisk`, `birthPrepLine` … +1 more |
| 15397 | AGEING — every ninth day the years take their cut. Under thirty a body | `upkeepScore`, `ageOneBody`, `ageBodies`, `partName`, `figureScore`, `selfStage`, `stageIndex`, `spouseFigureScore` … +1 more |
| 15514 | THE PROMISE YOU MADE | `promiseDaysLeft`, `promiseBroken`, `checkPromise`, `checkPromiseKept`, `conceiveChance`, `wifePregMonth`, `selfPregMonth`, `villaConceive` … +6 more |
| 15859 | THE THEATRE AROUND THE SHADOW PLAY. The pool scene got a room dimmed to | `drawShadowTheatre` |
| 15889 | MEDIUM — the exact opposite problem. The figures are now REAL BODIES in | — |
| 15946 | AND NOT EVERY COUNTRY IS DOING THE SAME THING — the pose lore | `POSE_LORE`, `poseLore`, `poseName` |
| 16082 | THE ROOM SHE IS ACTUALLY IN | `HALL_PLAN`, `hallPlan`, `drawHall`, `drawShadowPlay` |
| 16329 | MEDIUM CENSORING. The whole scene used to be one flat silhouette colour, | — |
| 16392 | THE POSABLE CONCEPT MODEL | `drawStagePlate`, `drawTheaterEthnic`, `drawPoolPlace` |
| 17858 | THE SHALLOWS. Two silhouettes at the waterline — and they were the same two | `waterMetrics`, `drawWaterCouple` |
| 18066 | THE DOMUS — walk your own villa. A/D stroll · SPACE act · W invite. | `DM`, `openDomus`, `domusExit` |
| 18084 | THE HALL LIGHT — one key light, and every figure in the room answers to it | `HALL_LIGHT`, `_LITB`, `litBufs`, `_litEdge`, `LIT_ON`, `litFigure`, `litWife`, `litHusband` … +1 more |
| 18234 | THE BEND. She is TEMPTING, and every so often there is something on the | `drawSteamVeil`, `drawUndressedFig`, `playerLook`, `drawDomusPlayer`, `tryPoolInvite`, `tryWardrobe`, `updateDomus`, `updateDomusScene` |
| 19113 | TEMPTING — THE LOW SHELF | `TEMPT_NEED` |
| 19134 | THE DROP — her side of the same room | `DROP_PROPS`, `DROP_NEED`, `DROP_LOOKS`, `dropDue`, `startDrop`, `updateDrop` |
| 19324 | HE DID NOT LOOK UP | `openIgnoredCard` |
| 19366 | HIS OWN IDEA | `beckonHusband` |
| 19391 | AN ACTUAL HAND | `drawSlapArm`, `husbandMoveDue`, `startHusbandMove`, `updateHusbandMove`, `drawHusbandMove` |
| 19502 | THE JIGGLE, AND THE ELBOW — drawn, not nudged | `drawElbowOver` |
| 19547 | REACTION FACES | `figHeadBox`, `REACT_FACES`, `reactKindFor`, `drawReactFace`, `drawSlapAfter`, `startRefusal`, `updateRefusal`, `drawRefusal` |
| 19703 | THE RISE  —  🏛 PRIAPIC, and what a woman does about it | `RISE_STAGES`, `RISE_LINES`, `drawTunicBump`, `riseDue`, `startRise`, `RISE_NEED`, `updateRise`, `drawRise` |
| 19904 | THE ARDOR — his half of it, and the only half you drive yourself | `ARDOR_LINES`, `ARDOR_HOLD`, `ardorLen`, `ardorNeed`, `ardorDrain`, `ardorReady`, `ardorAvailableNow`, `tryArdor` … +5 more |
| 20168 | THE MARKER — a hand-drawn prompt over your own head, not an emoji. | `ardorBlockedWhy`, `drawArdorIcon`, `drawDrop`, `temptDue`, `TEMPT_PROPS`, `startTempt`, `updateTempt` |
| 20486 | THE VILLA'S OWN WOOHOO — fifteen seconds, in the room you are standing in | `VILLALOVE_LEN` |
| 20502 | 2 · CAUGHT | `CAUGHT_LINES`, `rollWalkIn`, `fireWalkIn`, `startVillaLove`, `villaLoveFinish`, `updateVillaLove` |
| 20621 | HIM, IN FOUR STAGES | — |
| 20632 | THE SLAP | — |
| 20642 | WHAT THIS PEOPLE THINKS OF A HAND ON HER, AND WHERE | `HAND_ON_HER`, `handOnHer`, `slapExposure`, `slapVerdict`, `doSlap` |
| 20817 | WHO IS IN THE ROOM | `BABY_YEARS`, `kidsPresent`, `villaClear`, `privacyTier` |
| 20855 | WHAT MONEY ACTUALLY BUYS YOU | `houseWealth`, `DISCRETION`, `discretionTier`, `watchersRaw`, `watchersPresent`, `watchersAbsorbed`, `houseIsWatching`, `privacyNeeded` … +4 more |
| 20971 | THE ROMANTIC ONE | `romanticVerdict`, `startRomantic` |
| 21031 | AND THE ROMANTIC ONE GETS THE SAME REWORK — with its own character | `updateRomantic` |
| 21101 | HER SPRITE FOR THIS ONE | `drawRomanticFem`, `drawRomantic` |
| 21307 | THE SWING | `STRIKES`, `romanticSwing` |
| 21338 | THE SLAP, REBUILT — the four beats an animator would actually give it | `SLAP_T`, `SLAP_ANG`, `SLAP_PIV`, `slapAng`, `slapArmVis`, `slapHand`, `hallShake`, `kickShake` … +11 more |
| 21977 | THE LONGHOUSE IN THE CLEARING | `hallProvince`, `hallStyle`, `drawForestShell` |
| 22127 | FOUR MORE HALLS — because only two of the seven were ever drawn | `drawCourtyardShell`, `drawGerShell`, `drawShoinShell`, `drawPillaredShell`, `drawDomus` |
| 22363 | THE HOUSE | — |
| 22976 | META SCREENS WIRING | `openSlots`, `refreshAdultBtn`, `prevHelp`, `settingsFrom`, `openSettings`, `closeSettings`, `buildSettings` |
| 23083 | THE WOOHOO GUIDE | `woohooFrom`, `openWoohooGuide`, `closeWoohooGuide`, `WOOHOO_GUIDE`, `buildWoohooGuide`, `refreshSettings`, `openStats`, `buildStats` … +1 more |
| 23211 | THE ROLL AT THE ENROLMENT TABLE — before the oath you roll for the body | `IMPOSSIBLE_CHANCE`, `rollHiddenPotential`, `rollCreation`, `rollBanner`, `STAT_COL`, `drawCardPortrait`, `drawBrideCut`, `drawBridePortrait` |
| 24141 | AND THEN HER PEOPLE'S ACTUAL CUT GOES OVER THE TOP OF IT | `openCreate` |
| 24466 | AND THE OATH BUTTON IS SET FROM THE TRUTH, ONCE, AT THE END | — |
| 24519 | WHERE YOU ACTUALLY WAKE UP | — |
| 24569 | THE SILK ROAD — the eastern game's own economy, and its own history | `SILK_LEGS`, `silkLeg`, `silkOpen`, `SILK_STAKE_CAP`, `silkStake`, `silkOdds`, `silkRun` |
| 24677 | THE MARKET — 楽市楽座, AND WHY IT WAS A WEAPON | `COIN_GRADES`, `MARKET_RULES`, `MARKET_OF`, `marketHere`, `ensurePurse`, `purseFace`, `purseHere`, `erizeniQuote` … +1 more |
| 24814 | THE NANBAN TRADE — silver out, silk in, and one ship a year | `NANBAN_GOODS`, `NANBAN_PORTS`, `nanbanHere`, `kurofuneIn`, `kurofuneDays`, `pancadaMul`, `nanbanBuy`, `nanbanSell` |
| 24894 | THE FIVE TRADITIONS — 五箇伝, AND A BLADE IS NOT A BLADE | `GOKADEN`, `gokaden`, `BLADED_WA`, `bladeSchoolOf`, `bladeIsSchooled`, `TAMESHI`, `tameshiDone`, `ensureBlade` … +1 more |
| 24967 | THE SWORDSMITH — pick a tradition, then prove the blade | `openSmith` |
| 25075 | THE POWDER SUPPLY — and it is a foreign policy problem | `POWDER_SRC`, `powderSourcesHere`, `POWDER_MAX`, `powderHave`, `buyPowder` |
| 25128 | THE PORT — how a man with no name and no land gets rich | `VENTURES`, `ventureOpen`, `ventureStake`, `ventureOdds`, `runVenture` |
| 25192 | THE STANDARDS — what you may and may not do here, said plainly | `standardsHere`, `openStandards` |
| 25255 | YOUR OWN HOUSE — a name, a crest, a colour, and a banner over it | `MON_CHOICES`, `CLAN_COLS`, `waHouseName`, `canFoundHouse`, `foundHouse`, `openFoundHouse`, `openMarket`, `openSilk` |
| 25707 | THE HUB IS NOT THE SAME HUB | `HUB_EAST`, `HUB_WA`, `HUB_WEST_LABEL`, `applyHub`, `enterMap`, `regionUnlocked`, `imperialAvailable`, `travelCost` … +15 more |
| 26301 | THE BARBER AND THE CLOTHIER — you had eight cuts, five beards, seven | `outfitAllowed`, `outfitLockNote`, `barberCost`, `clothierCost`, `buildBarberCard`, `buildLegacyCard`, `buildSuccessionCard`, `succession` |
| 26566 | THE SON'S PATH — THE LEGIONS. An heir may refuse the sand and take a | — |
| 26571 | THE ARMY IN DEPTH — a legion is not a number. It is cohorts of specific | `UNIT_TYPES`, `unitCount`, `armySize`, `armyUpkeep`, `armyPowerDetail`, `supplyState`, `FORTRESSES`, `MIL_RANKS` … +14 more |
| 26892 | THE FAMILY TREE, IN FOUR REGISTERS | `TREE_TAB`, `treeTabs`, `openTree` |
| 27295 | ⚭ THE NOBLE TREE — WHO YOU ARE RELATED TO BY CONTRACT | `nobleHouses`, `treeNoble` |
| 27462 | 🏛 THE GOVERNOR'S TREE — WHAT YOU ADMINISTER | `treeGovernor`, `openTitles`, `herbBack`, `openHerbs` |
| 27658 | PROVINCIAL MANAGEMENT — tax, garrison, grain, governors and unrest, | `openProvinces` |
| 27784 | THE NIGHT THEY COME FOR THE PURPLE — when RISK TO THE PURPLE runs hot | `coupDue`, `maybeCoup`, `openCoup` |
| 27896 | CALL-OUTS — Rome says what it thinks of you, out loud, in the street. | `maybeCallout` |
| 27901 | SHE ASKS FIRST | `FESTIVALS`, `festivalToday`, `anWord`, `spouseExcuse`, `SPOUSE_ASKS`, `quirkAside`, `spouseAskDue`, `maybeSpouseAsk` |
| 28077 | THE CHILDREN, ONCE THEY ARE PEOPLE | `kidAgeYears`, `kidBand`, `livingKids` |
| 28096 | HOW BIG A CHILD IS DRAWN | `kidDrawScale`, `grownLook`, `drawChildFigure`, `kidsOfBand`, `kidName`, `kidHe`, `kidHim`, `kidSon` … +1 more |
| 28176 | THE SUITOR HALL — marrying off a grown child | `SUITOR_HOUSES`, `SUITOR_STYLE`, `suitorRank`, `makeSuitorFor`, `suitorForecast` |
| 28273 | WHAT THE DISTRICT CALLS THEM | `ARD_TITLES`, `KID_TITLES`, `pickTitle`, `bedTitle`, `myBedTitle` |
| 28322 | THE ESCORT — he takes her to the room, and HOW he does it is the whole | `ESCORT_POSES`, `escortPoseFor`, `escortPose`, `coupleLooks`, `drawCarriedFem`, `ESCORT_WIFE_DX`, `maybeArmSwat`, `drawArmSwat` … +2 more |
| 28571 | THE HOUSE GROWS WITH THE ESTATE | — |
| 28584 | THE HOUSE IS NOT A DOMUS EVERYWHERE | `HOUSE_SETS`, `houseSetId`, `houseSet`, `HOUSE_TIERS`, `houseTier`, `hasRoom`, `SECTION_X` |
| 28738 | THE SECTIONS THEMSELVES | `drawCulina`, `drawTriclinium`, `drawPeristyle`, `drawLararium`, `drawHouseSections`, `DOMUS_UPPER`, `STAIR_X0`, `STAIR_X1` … +21 more |
| 29207 | THE ONE LOOK | `peekKey`, `peekUsed`, `markPeeked`, `PEEK_ROOM`, `PEEK_STAGE` |
| 29242 | THEY ARE NOT IN THE SAME STATE AS EACH OTHER | `HEAT_HIM`, `HEAT_HER` |
| 29258 | AND WHAT THEY WERE ACTUALLY DOING | `PEEK_ACTS`, `PEEK_ACT_MAP`, `peekActWeight`, `peekAct`, `peekHeat`, `PEEK_REACT`, `peekReactFor`, `startPeek` … +18 more |
| 29988 | GRAVITAS  —  THE FACE YOU WEAR OUTSIDE THE DOOR | `gravitasRaw`, `gravitas`, `setGravitas`, `GRAVITAS_TIERS`, `gravitasTier`, `gravitasHit`, `gravitasTick` |
| 30088 | THE MARRIAGE LEDGER  —  standing, favours, feuds, and grandchildren | `inlawStanding`, `setStanding`, `standingLabel`, `FEUD_LINES`, `feudsList`, `feudOn`, `addFeud`, `feudHeat` … +3 more |
| 30174 | 11 · WHAT THE IN-LAWS ARE ACTUALLY LIKE | `INLAW_TRAIT_FX`, `INLAW_FLAW_FX`, `inlawTraitsOf`, `inlawFlawsOf`, `favourSurcharge`, `inlawTick` |
| 30277 | TEACHING THEM THE FACE | `kidDecorum`, `setDecorum`, `DECORUM_TIERS`, `decorumTier`, `DECORUM_DRILL`, `teachableKids`, `teachDecorum`, `KID_BLURTS` … +3 more |
| 30401 | 1 · THE MORNING AFTER   ·   4 · THE ANNIVERSARY | `MORNING_WARM`, `MORNING_COOL`, `morningDue`, `morningCard`, `annivYears`, `annivDue`, `annivCard` |
| 30510 | WHO IS IN WHICH ROOM | `HOUSE_ROOMS`, `roomsOccupiedToday`, `roomOccupant`, `placeMenuUp` |
| 30551 | THE DOOR — AND IT IS NOT THE SAME DOOR IN EVERY HOUSE | `DOOR_PLAN`, `doorPlan`, `drawDoorLamp`, `drawHallExit`, `drawDoor`, `houseGuestBusy`, `suitorsAvailable`, `makeCheatSuitor` … +3 more |
| 31153 | 14 · HAGGLING THE DOWRY | `haggleLeverage`, `HAGGLE_POSTURES`, `openHaggle`, `openWeddingChoice`, `buildSuitorCard` |
| 31288 | THE FACE, AND TEACHING IT — the villa's own card for both | `buildGravitasCard` |
| 31339 | TAKING THE KING'S SALT | `inParthia`, `buildParthiaCard` |
| 31382 | THE LAW OF THIS PLACE — the card that tells you what you are living under | — |
| 31390 | THE CHOICE — and it prints the price BEFORE you take it | `buildEastActCard`, `buildActCard`, `buildMoresCard`, `buildDiscretionCard` |
| 31572 | 13 · GOING TO SEE YOUR DAUGHTER | `visitableKids`, `VISIT_SCENES`, `buildVisitCard`, `buildFeudCard`, `buildKidHousesCard`, `FAMILY_EVENTS`, `familyDue`, `maybeFamily` … +6 more |
| 32126 | THE GROOM'S PLATE — the same painted alcove her portrait gets, and HIS | `drawGroomPortrait`, `briadeImg`, `marriageEffectsText`, `LOVE_CAP`, `bedLen`, `loveLeft`, `spendLove`, `vigilReady` … +2 more |
| 32218 | JEALOUSY — she notices. Neglect, other women, and a wandering | `jealousyLevel`, `jealousyLabel`, `addJealousy`, `easeJealousy`, `jealousyEffects`, `jealousyBlocksBed` |
| 32262 | THE TABULA — a wax-tablet note home, ancient texting. Her reply is | `NOTE_PRESETS`, `NOTE_WORDS`, `noteSentiment`, `noteBaseTier`, `NOTE_REPLIES`, `NOTE_AFTERGLOW`, `NOTE_APOLOGY_SOFT`, `NOTE_QUESTION` … +46 more |
| 33686 | PROVINCE TERRITORIES — every playable region as an actual shape on the | `PROV_SHAPES`, `PROV_SEAMS`, `lonlat` |
| 33735 | THE EASTERN WORLD, c. 200 A.D. | `MAP_EAST_PROJ`, `lonlatE`, `eastXY`, `REGIONS_EAST`, `REGION_EAST_BY_ID` |
| 33826 | THE THIRD SHEET — WA, AND THE CROSSING THAT COST THIRTEEN CENTURIES | — |
| 33848 | THE PROJECTION — and why this sheet is turned on its side | `MAP_WA_PROJ`, `lonlatW`, `waXY`, `REGIONS_WA`, `REGION_WA_BY_ID` |
| 33966 | THE CLANS — 1543-1590, AND WHY THE MAP IS A PATCHWORK | `CLANS_WA`, `CLAN_OF_WA`, `clanOf`, `clanIdOf`, `clanHolds` |
| 34052 | THE MON — the crest, drawn rather than lettered | `drawMon`, `WA_REFUSAL`, `regionBlocked`, `refuseBlocked` |
| 34214 | THE CROSSING — and what it costs is not money | `CROSS_PORTS`, `canAttemptCrossing`, `crossingBlockReason`, `CROSSING_LOG`, `CROSSING_ARRIVAL`, `beginCrossing`, `openCrossing`, `openCrossingLog` |
| 34351 | THE EASTERN SHEET — drawn from real coastlines, like the western one | `drawMapCanvasEast` |
| 34587 | THE WA SHEET — Honshū, Kyūshū, Shikoku, from real coastlines | — |
| 34604 | THE COASTLINE — traced, not blocked out | `WA_HONSHU`, `WA_KYUSHU`, `WA_SHIKOKU`, `WA_EZO` |
| 34681 | AND THE ISLANDS, which are not decoration in this century | `WA_ISLES` |
| 34710 | THE PATCHWORK — territory by colour, and a border where houses meet | `_waTerrBuf`, `waTerritory`, `WA_CREST_AT`, `drawWaCrests` |
| 34840 | WHERE THE LABELS GO — six seats inside two degrees | `WA_PIN_POS`, `layoutWaPins`, `drawWaLeaders`, `drawMapCanvasWa`, `agePlateWa` |
| 35119 | THE PLATE — what makes a map look like a MAP of its own century | `agePlate`, `coastHatch`, `drawMapLegend`, `drawCompass`, `drawScaleBar`, `drawMapCanvas`, `briefCtx`, `tierName` … +1 more |
| 35900 | THE LANISTA'S CELLS — pay the fee, then pick your man | `openRigPick`, `shopTab` |
| 35983 | THE RANGED RACK, DRAWN — every one of these was an emoji | `drawRangedIcon`, `drawGearIcon`, `gearIconImg`, `openShop` |
| 36770 | THE LUDUS — drilled skills, real wounds, and a body that wears out. | `SKILLS`, `skillLvl`, `skillCost`, `WOUNDS`, `makeWound`, `woundMul` |
| 36793 | SCARS — THE ARENA'S PRICE, AND IT IS PAID ON THE SKIN. A wound that closes | `scarZoneOf`, `addScar`, `scarName`, `scarList`, `scarCount`, `drawScarsOn`, `trainScreen` |
| 36896 | BOOT | — |
| 36903 | PIXEL LOGO — "SAND ⛑ STEEL" on riveted crimson planks + favicon | `LOGO_F`, `LOGO_HELM`, `drawLogoHelm`, `drawLogo` |
