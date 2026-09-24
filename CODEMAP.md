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
| 735 | SAND & STEEL — Gladiators of 200 A.D. | `cv`, `ctx`, `tcv`, `tctx`, `TS`, `W`, `GROUND`, `WALL_L` … +12 more |
| 780 | DATA — real historical content from c.200 A.D. | `REGIONS`, `REGION_BY_ID`, `NON_ROMAN`, `ROMAN_REGIONS`, `REGION_TITLES`, `CLASSES` |
| 910 | AND WHICH TRADE THE GROUND ITSELF FIELDS | `WA_GROUND_CLASSES`, `classesForWorld`, `CLASS_ORDER`, `CLASS_ORDER_EAST`, `GEAR` |
| 981 | THE ARSENAL OF THE SENGOKU — and the sword is not the point of it | — |
| 995 | THE POOR MAN'S ARSENAL — and it is the farm shed | — |
| 1012 | BAMBOO, AND WHY — the correction | `gearOf`, `PILUM`, `aimZoneFor`, `rangedDamage`, `pilumDamage`, `BOWS` |
| 1287 | THE YUMI — and why the samurai spent five hundred years on it | — |
| 1304 | THE GUNS — and the trade-off IS the history | — |
| 1347 | THE REST OF THE POWDER — and the honest note about rifles | `bowOf` |
| 1380 | WHAT THE SHOP ACTUALLY STOCKS | `gearWorldOf`, `gearStockedHere`, `isGun` |
| 1408 | IT IS NOT A BOW. STOP CALLING IT A BOW. | `rangedWords`, `rangedShelfName` |
| 1438 | YOU CANNOT SIMPLY BUY THIS | `rankTier` |
| 1467 | THE ARMATURA — a gladiator IS his kit | `ARMATURA`, `myArmatura` |
| 1543 | AND WHO GETS TO IGNORE IT | `OFFTYPE_PURSE`, `canChooseOwnKit`, `offTypeWhy`, `armaturaOn`, `inArmatura`, `gearGate`, `gearBuyable`, `rangedCooldown` |
| 1615 | THE WEATHER — which exists in this game only because the gun does | `WET_CHANCE`, `rollWeather`, `isWet`, `misfireChance`, `FOE_NAMES`, `FOE_TITLES`, `ARCHETYPES`, `ARCH_ORDER_WEST` … +4 more |
| 1754 | TWO WORLDS, ONE GAME | — |
| 1766 | THE SEVEN SENGOKU CAREERS | — |
| 1775 | THE ROLE IS THE RANK — nobody chooses out of the whole list | `WORLDS` |
| 1949 | AND A FOURTH, WHICH IS NOT A REAL PLACE | `WORLD_IDS`, `worldOfArch`, `regionsForWorld`, `regionAny`, `worldOfRegion`, `playerWorld`, `SOCIAL`, `SOCIAL_ORDER` |
| 2022 | THE EASTERN LADDER — nobody in Luoyang was ever a patrician | `SOCIAL_EAST` |
| 2131 | WA · and the ladder here is measured in RICE | — |
| 2160 | THE RKRAI LADDER — five notches, cut in the post | `socialSetFor`, `socialSetForSel`, `socialRung`, `playerRung` |
| 2208 | THE OTHER LEDGER'S SELLER — who you go to for it depends entirely on | `SECRET_SELLERS`, `ELITE_MEN`, `ELITE_WOMEN`, `PLOT_TARGETS`, `OFFICES`, `KEY_PROVINCES`, `keyCount`, `GEN_NAMES` … +2 more |
| 2295 | MARRIAGE — take a wife once powerful (or, as an elite, by dynastic duty) | `BRIDE` |
| 2323 | AND EVERYWHERE ELSE ON EARTH | `BRIDE_ETHS`, `BRIDE_ETHS_BY_WORLD`, `WA_PORTS`, `brideEthsHere`, `homeBrideEth` |
| 2406 | THE CULTURES — what a people actually BELIEVED, as numbers | `CULTURES` |
| 2450 | THE RKRAI — INVENTED. The only culture in this table that is not | — |
| 2573 | THE EASTERN PEOPLES — four more rows in the same tables | — |
| 2663 | WA · and it is thirteen hundred years from everything else in this game | `CULTURE_IDS`, `cultureById`, `ARCH_CULTURE`, `ARCH_RANK`, `archRank`, `RANK_LOCK`, `RANK_COL`, `rankLockNote` … +5 more |
| 2826 | TRIBAL RANK — a chieftain's wife did not dress like a herdsman's | `isTribal`, `tribalRank`, `tribalTier`, `tribalCloth`, `coverageBand`, `localCulture` |
| 2910 | THE MORES — what each people's LAW actually did about it | `MORES` |
| 3051 | WA · what a household may and may not do, in this century | `moresOf` |
| 3088 | RIGGING THE BOUT — the fee gets you in the room, the man costs extra | `RIG_FEE`, `RIG_BUILDS`, `rigBuild`, `rigManPrice`, `rigSuspicion`, `rigPurseMul`, `drawRigCandidate` |
| 3211 | THE COIN IN YOUR HAND — and it is not a denarius everywhere | `CURRENCY` |
| 3282 | SENGOKU JAPAN · and it has THREE moneys at once, which is the point | `CURRENCY_OF`, `CURRENCY_REGION`, `currencyHere`, `coinWord`, `coinShortStr`, `drawCoinIcon`, `_COINIMG`, `coinIconURI` … +1 more |
| 3454 | THE MOS — WHAT ROME ACTUALLY OBJECTED TO, AND WHY | `ACTS`, `ACT_BY_ID` |
| 3517 | THE EASTERN BEDCHAMBER — a different question entirely | `EAST_ACTS` |
| 3632 | WA · and the household is a chapter of the war | — |
| 3684 | THE EASTERN MATCH — nobody in Luoyang negotiates a Roman dowry | `MATCH_EAST`, `matchEast`, `matchEastForPlayer`, `eastDowryLine`, `buildEastMatchCard` |
| 3811 | AND THE RKRAI SHORE, WHICH JUDGES A HOUSE ON ITS STORE | `eastActSet`, `eastActById`, `eastAxisValue`, `eastAxisBand`, `resolveEastAct`, `TABOO`, `TABOO_VOICE` |
| 3989 | HOW FAR ROME'S OPINION ACTUALLY REACHES | — |
| 4014 | WHERE MEN ACTUALLY FOUGHT — and it was NOT an amphitheatre everywhere | `VENUES` |
| 4112 | WA — and there is no arena anywhere in it | `VENUE_OF` |
| 4183 | THE RKRAI GROUNDS | `RK_VENUES`, `VENUE_REGION`, `venueHere`, `venueName`, `venueIsShow`, `REPUTATION_REACH`, `reputationReach`, `reachBand` … +9 more |
| 4392 | RESOLVING AN ACT — does anyone find out, and what does it cost | `actWitnessChance`, `resolveAct`, `actHerView`, `osImpurumTick`, `localMores`, `legalExposure`, `exposureSplit`, `fashionOffence` |
| 4514 | THE EYE, DECIDED ONCE, FOR EVERY FACE IN THE GAME | `INK_EYE_CULTURES`, `inkEyes`, `inkEyesOver` |
| 4598 | HAIR — ONE SYSTEM, DRAWN THE SAME EVERYWHERE. | `HAIR_F`, `HAIR_M`, `BEARD_M`, `HAIR_M_BY_ETH`, `BEARD_BY_ETH`, `HAIR_COL_M`, `HAIR_F_BY_ETH`, `OUTFITS_M` … +6 more |
| 5064 | THE HOUSE KILT — the men's side of the ulvik, and the same argument. | — |
| 5206 | AND THE ONE THE COAST MEASURES AT THE SEATING. | `drawBeardM`, `hexRGB`, `rgbA0` |
| 5340 | SMALL-SCALE HAIR — one routine, every sprite that is not a portrait | `drawHairSmall`, `hairStyleFallback`, `beardFallback`, `outfitFallback`, `hairStyleName`, `beardName`, `fixTraitsForSex`, `ensureQuirks` … +2 more |
| 5460 | BLOODLINE — every spouse carries LOOKS, SMARTS and TRAITS. Children | `BUILDS`, `LOOK_STAGES` |
| 5476 | AND THE LADDER ITSELF IS A ROMAN LADDER | `LOOK_LADDER`, `LOOK_BLURB`, `lookLadder`, `lookStage` |
| 5556 | THE SAME LADDER, ON THE WALL. The shadow-play reads the very stage the | `SHADOW_STAGES`, `shadowStage`, `BODY_PARTS`, `BODY_PARTS_M`, `SECRET_PART`, `secretUnlocked`, `secretAllowed`, `partsFor` … +1 more |
| 5638 | AND THE RUNGS OF EACH PART, WHICH ARE ALSO A JUDGEMENT | `PART_TIERS`, `partTiersHere`, `partTier` |
| 5707 | AND THE WORDS ARE ROMAN TOO | `BODY_WORDS`, `bodyWordsHere`, `partPhrase`, `bodyBlurb` |
| 5783 | DIRECT SPOUSE DESCRIPTIONS  (Settings → Direct spouse descriptions) | `BLUNT_WORDS`, `BLUNT_PLURAL`, `bluntWord`, `bluntDowry`, `bluntBrief`, `bodyTierLine`, `rollBody`, `makeImpossibleBody` |
| 5868 | YOUR OWN BLOOD — rolled at the enrolment table like anyone else's. | `rollPlayerBody`, `bodyAvg`, `ensurePlayerBody`, `selfSubject`, `syncPlayerLooks` |
| 5922 | THE HOUSE YOU WERE BORN INTO — a father, a mother, brothers and | `FATHERS`, `MOTHERS`, `SIB_ROLES_M`, `SIB_ROLES_F`, `NAMES_M`, `NAMES_F`, `makeFamily`, `kinAge` … +1 more |
| 6057 | THE FAMILY PORTRAIT GALLERY — every name in your house gets a drawn | `KIN_SKINS`, `KIN_HAIRS`, `kinHash`, `kinLook`, `kinInherit`, `drawKinPortrait` |
| 6330 | THE IMPERIAL COURT — the people who actually decide whether a purple-born | `PRAETORIAN_PREFECTS`, `COURT_FIGURES`, `makeCourt`, `COURT_LEVERS`, `courtBonus`, `courtCultivateCost`, `purpleRisk`, `opinionsOfYou` |
| 6426 | LOOKS ARE POLITICS. For a prince, a princess, an Augusta or a powerful | `beautyPower`, `BEAUTY_GIFTS`, `toleranceScore`, `loyaltyScore` |
| 6492 | PROVINCIAL MANAGEMENT — a title is not a trophy, it is a job. Every | `PROV_GOVS`, `PROV_GOVS_EAST`, `PROV_GOVS_WA`, `PROV_GOVS_RK`, `provGovList`, `provOf`, `heldProvinces`, `provUnrestAvg` … +4 more |
| 6565 | PUBLIC COMPLAINTS — the price of governing. Petitions come up from the | `COMPLAINT_KINDS`, `rollComplaint`, `pendingComplaints`, `complaintPressure` |
| 6602 | CALL-OUTS — somebody in the crowd says something about you, out loud, | `CALLOUT_LINES_F`, `CALLOUT_LINES_M` |
| 6623 | AND THE STREET DOES NOT SHOUT THE SAME THING EITHER | `CALLOUT_CULTURE`, `calloutLines`, `calloutDue` |
| 6723 | PUBLIC EYES — where the eyes actually go. A walking figure, an eye on | `GAZE_BASE_F`, `GAZE_BASE_M` |
| 6730 | WHERE THEY ACTUALLY LOOK, AND IT IS NOT THE SAME PLACE | `GAZE_CULTURE`, `GAZE_VOICE` |
| 6867 | THE LAST OF THE ROMAN FURNITURE | `FACE_WORD`, `FACE_RULE`, `faceRule`, `highBornLabel`, `highBornNote`, `gravitasWord`, `DYE_WORD`, `dyeWord` … +8 more |
| 7082 | ✧ THE KANRUK — KAN'S TURN, AND WHY THE COAST CALLS IT GOOD NEWS | `RK_KANRUK`, `RK_KANRUK_WINDOW`, `RK_KANRUK_ADD`, `kanrukOffered`, `kanrukActive`, `kanrukLeft`, `kanrukArm`, `kanrukSpend` … +2 more |
| 7200 | QUIRKS — THE MIDDLE TIER | `WIFE_QUIRKS` |
| 7274 | THE OUTER TIERS. Three bands was still too flat — everything good was | `WIFE_BOONS`, `WIFE_BANES`, `boonById`, `baneById`, `hasBoon`, `hasBane`, `rollBoons`, `rollBanes` … +6 more |
| 7349 | THE QUIRKS WERE NAMED IN ROME AND NEVER LEFT | `QUIRK_LOCAL`, `qText`, `bondCeiling` |
| 7420 | THE KILT, WHICH DOES NOT TENT | `drawKiltLift`, `rollQuirks`, `flawById`, `flawLabel` |
| 7520 | THE CHIPS. These used to be three words of coloured text in a row, | `CHIP_TIERS`, `traitChip` |
| 7568 | A TRAIT THAT BELONGS TO THE OTHER SEX IS NOT YOURS | `traitsForSex`, `traitsHtml`, `traitsDetailHtml`, `hasFlaw`, `rollFlaws`, `TIERS`, `spouseTierName`, `SLAP_BUTTON` … +14 more |
| 7954 | THE BODY MAP — a matchmaker's chart, bought once for 200d. Every region | `heatColor`, `bmCache`, `bmResetCache`, `bmOnce` |
| 7976 | THE SHAKE — and it is HER OWN MEASUREMENTS doing it | `SHIMMY`, `shimmyOf`, `SHIMMY_TIER`, `shimmyStart`, `shimmyTick`, `shimmyLive`, `shimmyEnv`, `shimmyHip` … +5 more |
| 8079 | SLAP PHYSICS — one damped spring, shared by every figure that can take one | `SLAPJ`, `slapKick`, `slapJigTick`, `slapJig`, `slapLive` |
| 8113 | THE CHART FIGURE — built FOR the chart, not borrowed from the villa | `chartLandmarks` |
| 8163 | ◐ HIS LENGTH, DRAWN AS A THING AND NOT A SAUSAGE | `hexOf`, `sstep`, `lengthPose`, `LEN_GROW`, `LEN_INCH`, `LEN_GROW_BY`, `lenGrow`, `lenFrac` … +4 more |
| 8424 | 🗣 WHAT THE VILLAGE CALLS HIM | `VILLAGE_NAMES`, `villageMan`, `villageName`, `fmtLen` |
| 8496 | 🗣 AND WHAT IT CALLS HER — AND THE HOUSE — AND THE REST OF THE STREET | `VILLAGE_NAMES_F`, `VILLAGE_HOUSE`, `villageCult`, `villageWoman`, `villageFCtx`, `villageNameF`, `villageHouseName`, `villageStreet` … +9 more |
| 8758 | 🧍 THE REAL FIGURE | `smoothPath`, `limbPts`, `realAnchors` |
| 8814 | ☺ HIS FACE WHEN HE IS UP — AND IT IS NOT ALWAYS A SMILE | — |
| 8828 | 😋 THE FACES THAT SAY SOMETHING — hungry, smitten, hurt, and friends | `FACE_EX`, `wantEyes`, `resolveEyes`, `CHART_FACES`, `CHART_FACE_ORDER`, `CHART_FACE`, `chartFace`, `faceAsHard` … +24 more |
| 9791 | THE REAL FIGURE, if you asked for it. | — |
| 10369 | THE PART PICKER, AND THE COMPARISON | `drawPartPicker` |
| 10441 | TWO CUSHIONS, LARGER THAN THE PART ITSELF, AND A ROD | — |
| 10511 | ONE LAMP, ABOVE AND LEFT — AND IT DOES NOT FLIP | `rgbTriple`, `shade2`, `lit2`, `rgbA`, `readOn`, `drawMapReadout`, `drawMapScale`, `drawWalkFigure` … +25 more |
| 11420 | ◐ THE RISING — AND THE LEDGER KEEPS COUNT OF IT | `AROUSE_WHY`, `AROUSE_KEEP`, `arouseDayKey`, `arouseToday`, `arouseLog`, `arouseByWhy`, `arousePerDay`, `arouseStanding` … +1 more |
| 11512 | ⬔ THE CHART, TURNED — A THIRD VIEW OF THE SAME NUMBERS | `bodyRings`, `BODY3D_TILT`, `ring3D`, `densify`, `BODY3D_STEP`, `stack3D`, `drawBody3D`, `bodyMapRebuildSub` … +5 more |
| 12016 | THE CHART IS NOW SOMETHING YOU CAN PUT A FINGER ON | `createPreviewMap`, `openMirror`, `bodyMapSubject`, `statPips`, `rollBrides` |
| 12310 | COURTSHIP — YOU HAVE TO TALK. | `COURT_RANKS` |
| 12340 | WHERE YOU STAND, ON WHATEVER LADDER YOU ARE ON | `socialRankIndex`, `wealthRungs`, `effectiveRank`, `courtAccess`, `COURT_PROMPTS`, `COURT_BOASTS`, `MEDIUM_CENSOR`, `COURT_RESULT` … +22 more |
| 13034 | THE LEGACY HOUSE — a dynastic seat you plant in a province of your | `LEGACY_INFO` |
| 13056 | AND YOU CANNOT SEAT YOUR NAME IN AEGYPTUS FROM KYŌTO | `LEGACY_EAST`, `LEGACY_WA`, `LEGACY_RK`, `legacySet`, `legacyAudience`, `legacyLevels`, `legacyWord`, `legacyInfo` … +6 more |
| 13211 | GAME STATE / SAVE | `SAVE_KEY`, `SLOT_KEY`, `NSLOTS`, `saveSlot`, `slotKey`, `setSlot`, `slotInfo`, `G` … +1 more |
| 13327 | THE GLADIATRIX — a woman fights in DEFIANCE of the Emperor's ban. The | `GLADIATRIX_EVENTS`, `gladiatrixStageFrom`, `gladiatrixAfterWin`, `gladiatrixBriefBlock`, `checkFamilyMan`, `elevateWife`, `migrate` |
| 13404 | AN OLD SAVE MUST NOT LOSE WHAT IT WAS ALREADY CARRYING | `saveGame`, `hasSave`, `loadGame` |
| 13454 | MATURE-CONTENT GATE | `ADULT_KEY`, `ADULT`, `setAdult`, `SETTINGS_KEY`, `BUILD_STAMP`, `SETTINGS`, `saveSettings`, `DIFF` … +1 more |
| 13482 | THE RICHER YOU GET, THE BETTER THEY SEND | `wealthHeat`, `wealthMul`, `wealthNote`, `STATS_KEY`, `STATS`, `saveStats`, `bumpStat`, `ACHIEVEMENTS` … +4 more |
| 13553 | UI: stat bar + toast | `refreshStatbar`, `MOUNTS`, `toastT`, `toast` |
| 13590 | PIXEL SPRITE: gladiator (drawn procedurally, faces +x by default) | `SKIN` |
| 13595 | WHOSE FACES ARE IN THE ROOM | `SKIN_BY_CULT`, `skinHere`, `pickSkin`, `skinAt`, `shade`, `mixHex` |
| 13660 | THE YEARS, WRITTEN ON THE FACE. One number in, four things out — and every | `ageMarks`, `greyHair`, `agedSkin`, `paletteFor` |
| 13691 | THE SWING YOU CAN SEE — arcs, impact, and weight | — |
| 13715 | THE AIR IN THE PLACE, AND THE THING YOU ARE SEEING IT OVER | `drawGroundHaze`, `drawArenaForeground`, `weaponTipLen`, `pushSwingTrail`, `updateSwingTrails`, `drawSwingTrails` |
| 13862 | AND THE HIT ITSELF | `impactBurst`, `updateImpacts`, `drawImpacts`, `swingSfx`, `drawGladiator`, `drawBeast` |
| 14015 | THE SASHIMONO — the flag on a man's back | `drawSashimono`, `drawGladBody`, `drawStuck`, `drawSlashFx`, `drawLeg`, `drawTorso` |
| 14167 | THE EAST AND THE SENGOKU, ON THE BODY | `drawHead` |
| 14265 | THE EYES, AND THEY ARE NOT THE SAME EYES EVERYWHERE | `drawHelmet2` |
| 14384 | THE SENGOKU HEAD — and none of it is a Roman galea | `drawShield2`, `drawArm2` |
| 14596 | YOU DO NOT WIND UP A MATCHLOCK | `drawGunArms`, `drawThrowArm`, `drawWeapon2` |
| 14732 | THE FIVE BAMBOO PIECES — and not one of them is a bamboo sword, | — |
| 15048 | ARENA RENDERING | `makeFighter`, `FT`, `makeArenaFoe` |
| 15124 | AND THE MAN OPPOSITE ACTUALLY CARRIES ONE | `FOE_GUN`, `armFoeRanged`, `foeGunAI`, `NAVAL_NAMES`, `BEASTS`, `pickBeast`, `makeBeast` |
| 15211 | NEMESIS — a named rival who rises with you, taunts, meddles, and finally | `NEM_FIRST`, `NEM_EPITHET`, `NEM_TAUNTS`, `nemFull`, `makeNemesis`, `nemesisAfterWin`, `drawNemesisPortrait`, `nemesisBriefBlock` … +10 more |
| 15555 | THE SIDEARM — 抜刀, and it is why the daishō exists | `hasSidearm`, `sidearmName`, `drawnWeaponName`, `rangedReady`, `switchWeapon`, `autoDrawBlade`, `playerRanged`, `beginRangedCharge` … +5 more |
| 15736 | THE BLAST — the only area weapon in the game, and it is ceramic | `blastAt`, `updateBurns` |
| 15790 | THE RAIN — which has been a number nobody could see | `initRain`, `updateRain`, `drawRain`, `drawWetNotice`, `gunSmoke`, `updateGunSmoke`, `drawGunSmoke`, `throwPilum` … +8 more |
| 16082 | WHAT A MATCHLOCK LOOKS LIKE, and it is not a musket | `drawHeldGun`, `drawHeldBomb`, `drawHeldBow`, `drawArrow`, `aiUpdate`, `beastHop`, `beastLunge`, `beastBite` … +14 more |
| 16811 | ARENA DRAW | `drawVillaBg`, `drawDeadTree`, `drawPitBg` |
| 16934 | THE THEATRES OF THE EMPIRE | `ARENA_THEATRES` |
| 17013 | THE EASTERN GROUNDS — and NOT ONE OF THEM IS AN AMPHITHEATRE | — |
| 17084 | THE SIX GROUNDS OF THE SENGOKU — and every house has its own | — |
| 17094 | THE RKRAI SHORE — four grounds, and not one of them is a show. | `waHouseHere`, `THEATRE_OF`, `theatreOf`, `THEATRE_FOES`, `theatreFoeName`, `crowdIsHostile`, `drawTheatreSkyline`, `drawArena` |
| 17592 | WHAT IS ACTUALLY STANDING BEHIND THE FIGHTERS | `drawShadow`, `drawCrowd`, `drawEmperorBox`, `drawVerdict`, `pixelText` |
| 18270 | AUDIO (tiny WebAudio blips, guarded) | `AC`, `noiseBuf` |
| 18275 | THE SOUND ENGINE | `MASTER`, `audioBus`, `revSend`, `blip`, `hiss`, `tone`, `noise`, `sfx` |
| 18660 | INPUT  (exact scheme required) | `held`, `edge`, `setEdge`, `consume`, `resetInputEdges`, `touchPref`, `touchCapable`, `coarsePointer` … +8 more |
| 18897 | MAIN LOOP | `state`, `last`, `loop`, `menuStars`, `drawMenuBg` |
| 18972 | ARMY BATTLE — army-vs-army (a different battle type, no 1v1) | `BT`, `armyBattle`, `updateBattle`, `drawBattleSoldier`, `drawBattleHorse`, `drawBattleHost`, `drawBattle`, `finishBattle` |
| 19134 | THE CIRCUS MAXIMUS — chariot racing, an entirely separate game. | `FACTIONS`, `RACER_NAMES`, `RACE_LAPS`, `LANE_Y`, `RC`, `startRace`, `aiRace`, `updateRace` … +5 more |
| 19300 | THE DAUGHTER'S PATH — THE COURTS. An heiress may refuse the sand and | `CASE_TYPES`, `ARGUMENTS`, `PATRONS`, `RIVAL_ADVOCATES`, `LANDMARKS` |
| 19345 | THE REGALIA — the visible instruments of power. Julia Domna, empress in | `REGALIA`, `hasRegalia`, `powerScore`, `CASE`, `caseDifficulty`, `startCase`, `renderCase`, `playArgument` … +5 more |
| 19614 | THE DOMINUS CONSOLE — cheats. Coin, glory, provinces, the purple. | `openCheats`, `openCircus` |
| 19916 | THE FAMILY PORTRAIT — the whole house, painted in one gold frame | — |
| 19921 | HIS FACE, ONCE, FOR EVERYONE WHO DRAWS HIM | `drawManFace`, `drawHusbandFig`, `drawKidFig`, `openPortrait` |
| 20274 | THE BEDCHAMBER — an implied scene: she runs, the toga flies, the door | `BC`, `KANVEK_ONLY`, `startBedScene`, `updateWifeHappy`, `drawWifeHappy`, `rkFinOn`, `rkFinAt`, `startRkFin` … +7 more |
| 20548 | EXHAUSTION AND OVER-EXTENSION — the thing that actually broke Rome. | `CORE_PROVINCES`, `isCore`, `provReach`, `supplyCapacity`, `supplyLoad`, `overExtension`, `exhaustion`, `addExhaustion` … +3 more |
| 20633 | THE TITLES OF ROME — every honour the game can give you, in one | `TITLES`, `TITLE_BY_ID`, `titleName`, `titleIsMasculineOnHer`, `earnedTitles`, `titleSlots`, `equippedTitles`, `BOON_LABEL` … +4 more |
| 20820 | THE CONFERRING — a rank-8 honour is not a silent unlock. The Senate | `TITLE_RITES`, `titleRiteDue`, `maybeTitleRite`, `openTitleRite` |
| 20901 | THE INSCRIPTION — what goes on the stone. A Roman's tomb listed every | `fullTitulature`, `inscriptionHTML`, `inheritTitulature`, `drawTitleEmblem` |
| 21042 | THE HERBARIUS — a real Roman apothecary. Every plant here is one a | `HERBS`, `HERB_BY_ID`, `herbCount`, `herbAdd`, `herbUse` |
| 21079 | ILLNESS — Rome was a sickly place and the physicians knew it. Somebody | `ILLNESSES`, `rollIllness`, `illnessBite`, `curesIll`, `BIRTH_HERBS`, `birthHerbsReady`, `birthRisk`, `birthPrepLine` … +1 more |
| 21219 | AGEING — every ninth day the years take their cut. Under thirty a body | `upkeepScore`, `ageOneBody`, `ageBodies`, `partName`, `figureScore`, `selfStage`, `stageIndex`, `spouseFigureScore` … +1 more |
| 21342 | THE PROMISE YOU MADE | `promiseDaysLeft`, `promiseBroken`, `checkPromise`, `checkPromiseKept`, `conceiveChance`, `wifePregMonth`, `selfPregMonth`, `villaConceive` … +3 more |
| 21553 | THE DOORWAY, ON THE NEW BODIES — the prelude before the lamps go down | `BED_FIG_K`, `SIL_CV`, `drawSilhouette`, `silHer`, `silHim`, `silWalkHer`, `silDoorway`, `drawPreludeRunner` … +3 more |
| 21801 | THE THEATRE AROUND THE SHADOW PLAY. The pool scene got a room dimmed to | `rkFinDrops`, `drawRkFin`, `drawShadowTheatre` |
| 21962 | MEDIUM — the exact opposite problem. The figures are now REAL BODIES in | — |
| 22020 | AND NOT EVERY COUNTRY IS DOING THE SAME THING — the pose lore | `POSE_LORE`, `rkPoseOrder`, `poseLore`, `poseName` |
| 22221 | THE ROOM SHE IS ACTUALLY IN | `HALL_PLAN`, `hallPlan`, `drawHall` |
| 22506 | 🛏 THE BEDCHAMBER ON THE NEW BODIES — EVERY POSITION, REBUILT | `BEDPOSE_DRAWS`, `BED_UNDRESS` |
| 22528 | ✦ THE STAGES OF IT — and a quick one that actually has some in it | `BED_INTRO`, `bedBigV`, `bedBigSlow`, `BED_STEP`, `BED_STAGES`, `bedSessionDur`, `bedIntroFor`, `bedStage` … +3 more |
| 23074 | ◆ THE BREEDING HOUSE, AND THE HUB — KAN'S SECOND PAGE, WITH A ROOF ON IT | `RK_BREED_FEE`, `RK_BREED_POSES`, `RK_BREED_NAMES`, `rkBreedOn`, `rkPoorHouse`, `rkBreedLine`, `rkBreedKids`, `rkSendKidsToBreed` |
| 23139 | ◆ THE HUB IS A PLACE FOR IT — ON THE COAST, AND NOWHERE ELSE | `RK_HUB_DOOR`, `rkHubInHouse`, `rkPlaceOk`, `sanitizeBedPlace`, `rkBuildHub`, `nearHubDoor`, `rkHubPlotHere`, `nearHubPlot` … +23 more |
| 23645 | MEDIUM CENSORING. The whole scene used to be one flat silhouette colour, | — |
| 23708 | THE POSABLE CONCEPT MODEL | `drawStagePlate`, `drawTheaterEthnic`, `drawPoolPlace` |
| 25518 | THE SHALLOWS. Two silhouettes at the waterline — and they were the same two | `waterMetrics`, `drawWaterCouple` |
| 25726 | THE DOMUS — walk your own villa. A/D stroll · SPACE act · W invite. | `DM`, `openDomus`, `domusExit` |
| 25745 | THE HALL LIGHT — one key light, and every figure in the room answers to it | `HALL_LIGHT`, `_LITB`, `litBufs`, `_litEdge`, `LIT_ON`, `litFigure`, `litWife`, `litHusband` |
| 25878 | WHAT IS ON HER FACE | `WIFE_MOOD`, `setWifeMood`, `wifeMood`, `wifeExpr`, `drawWifeFace` |
| 26047 | THE SEAT PROFILE — A CURVE, NOT A STAIRCASE | `SEAT_PEAK`, `seatWidthAt` |
| 26075 | 🍑 THE BEND, REBUILT | `BEND_OPT`, `BEND_CV`, `drawBendFig` |
| 26448 | 🧍‍♂️ HIM, IN PROFILE — AND THE TWO OF THEM TOGETHER | `vecKit`, `ik2`, `drawMateFig` |
| 26708 | 👩 HER, POSABLE — THE SAME BODY AS THE BEND, IN ANY POSITION | `femPregMonth`, `drawFemFig` |
| 27002 | ⚔ THE BODY TEMPLATE — THE WOOHOO'S FIGURES, EVERYWHERE | `NB_MAT`, `nbCol`, `nbLit`, `nbHem`, `nbTorsoPts`, `nbRow`, `nbLerp`, `NB_ARMOR` … +4 more |
| 27435 | ⚔ THE FIGHTER, ON THE NEW BODY | `NB_K`, `NB_BW`, `NB_DRAWS`, `nbOn`, `NB_TWO_HANDED`, `NB_HAIR`, `nbFighterLook`, `nbFighterPose` … +8 more |
| 27647 | ⚔ AND EVERYWHERE ELSE THE OLD RIG WAS STILL STANDING | `NB_SOLDIER_CACHE`, `nbSoldierSprite`, `drawBattleSoldierNB`, `nbCardFighter`, `drawFallenNB`, `NB_WIFE_WAVE`, `drawStandsWifeNB`, `PAIR_CV` … +5 more |
| 27867 | 👁 THE PEEK — WHAT YOU WALK IN ON, AND THE MOMENT THEY SEE YOU | `peekLinen`, `drawPeekBed`, `drawPeekLow`, `drawPeekTableau` |
| 28051 | ❦ HER FACE — ROLLED PER SCENE, THE SAME WAY HIS IS | `HER_ROLL`, `herFaceWeights`, `herFace`, `reactExpr`, `pairHimLook`, `drawWifeFig` |
| 28139 | THE BEND. She is TEMPTING, and every so often there is something on the | — |
| 28299 | THE SIVRAK. Not a cut of the ulvik — a different object entirely. | — |
| 28348 | THE ULVIK — the indoor dress, and it is a different problem from a | `drawSteamVeil`, `drawUndressedFig`, `playerLook`, `drawDomusPlayer`, `tryPoolInvite`, `tryWardrobe`, `updateDomus` |
| 29194 | THE WALK, OUT LOUD | `wifeWalkSound`, `WALK_QUIP`, `updateDomusScene` |
| 29281 | TEMPTING — THE LOW SHELF | `TEMPT_NEED` |
| 29302 | THE DROP — her side of the same room | `DROP_PROPS`, `DROP_NEED`, `DROP_LOOKS` |
| 29345 | ONE ANSWER TO "IS THE HALL BUSY?" | `HALL_BEATS`, `hallBusy`, `HALL_BEAT_NAMES`, `hallBusyWhy`, `dropDue`, `startDrop`, `updateDrop` |
| 29549 | HE DID NOT LOOK UP | `openIgnoredCard` |
| 29591 | HIS OWN IDEA | `beckonHusband` |
| 29616 | AN ACTUAL HAND | `drawSlapArm`, `husbandMoveDue`, `startHusbandMove` |
| 29674 | HIM ASKING, AND YOU ANSWERING | `updateBendAsk`, `drawBendAsk`, `updateHusbandMove`, `drawHusbandMove` |
| 29788 | THE JIGGLE, AND THE ELBOW — drawn, not nudged | `drawElbowOver` |
| 29833 | REACTION FACES | `figHeadBox`, `REACT_FACES`, `reactKindFor`, `drawReactFace`, `drawSlapAfter`, `startRefusal`, `updateRefusal`, `drawRefusal` |
| 29989 | THE RISE  —  🏛 PRIAPIC, and what a woman does about it | `RISE_STAGES`, `RISE_LINES` |
| 30019 | 🏛 GET HARD, IN THE HALL — drawn FRONT-ON, because he is. | `pxLengthUp`, `drawTunicBump`, `riseDue`, `startRise`, `RISE_NEED`, `updateRise`, `drawRise` |
| 30226 | THE ARDOR — his half of it, and the only half you drive yourself | `ARDOR_LINES`, `ARDOR_HOLD`, `ardorLen`, `ardorNeed`, `ardorDrain`, `ardorReady`, `ardorAvailableNow` |
| 30276 | THE PRESS, ON THE FLOOR OF THE HALL | — |
| 30293 | THE CURIOUS ONE — and the whole beat is that it is not aimed at you | `RK_CURIO`, `curioOn`, `curioReady`, `curioDue`, `startCurio`, `curioMenu`, `curioTake`, `curioResolve` … +1 more |
| 30494 | 🐚 THE CLAM | — |
| 30514 | 💬 SHE SAYS SOMETHING ABOUT YOU | `RK_PRAISE`, `praiseRegister`, `praiseLine`, `RK_HIS_PRAISE`, `hisPraisePool`, `praiseReady`, `praisePool`, `praiseDue` … +6 more |
| 30885 | ⌘ THE ACTION TABLET — the villa's own console | `tabletMenu`, `tabletFire`, `openTablet`, `updateTablet`, `drawTablet`, `CLAM_STRIKES`, `CLAM_SLAPS`, `RK_CLAM` … +14 more |
| 31658 | THE PRESS PAIR — two sprites built for one pose | `rkBackBones`, `drawRkBack`, `drawRkBehindHim` |
| 31920 | THE CURIOUS ONE, DRAWN | `drawCurio` |
| 31993 | WHAT THE RUNG LOOKS LIKE. Each one lands over the first stretch of | `drawRkPress`, `tryArdor`, `ardorFav`, `ardorSpots`, `updateArdor`, `ardorResolve`, `drawArdor` |
| 32410 | THE MARKER — a hand-drawn prompt over your own head, not an emoji. | `ardorBlockedWhy`, `drawArdorIcon`, `drawDrop`, `temptDue`, `TEMPT_PROPS` |
| 32654 | THE BEND, ON A COAST THAT DOES NOT PRETEND | `RK_BEND_NEED`, `RK_BEND_LINES`, `rkBendBeat`, `startTempt`, `updateTempt` |
| 32829 | THE VILLA'S OWN WOOHOO — fifteen seconds, in the room you are standing in | `VILLALOVE_LEN` |
| 32845 | 2 · CAUGHT | `CAUGHT_LINES`, `rollWalkIn`, `fireWalkIn`, `startVillaLove`, `villaLoveFinish`, `updateVillaLove` |
| 32967 | HIM, IN FOUR STAGES | — |
| 32978 | THE SLAP | — |
| 32988 | WHAT THIS PEOPLE THINKS OF A HAND ON HER, AND WHERE | `HAND_ON_HER` |
| 33113 | AND HOW SHE ACTUALLY ANSWERS | `SLAP_REPLY`, `handOnHer`, `slapReply`, `slapExposure`, `slapVerdict`, `slapCap`, `slapExpect`, `slapToday` … +3 more |
| 33274 | ✧ "COME HERE" — SHE STARTS IT, AND IT IS FOR SOMETHING | `RK_REWARD`, `RK_REWARD_PLAIN`, `rkRewardCause`, `rkRewardClaim`, `rkRewardDue`, `startRkReward`, `updateRkReward`, `drawRkReward` |
| 33459 | ◇ THE URVAAK — LETTING IT OUT, AND WHAT THE ROOM IS SUPPOSED TO DO | `RK_LETOUT`, `letoutMeasure`, `letoutTier`, `letoutWhy`, `letoutReady`, `letoutLeft`, `letoutRead`, `tryLetout` … +8 more |
| 33831 | WHO IS IN THE ROOM | `BABY_YEARS`, `kidsPresent`, `villaClear`, `privacyTier` |
| 33869 | WHAT MONEY ACTUALLY BUYS YOU | `houseWealth`, `DISCRETION`, `discretionTier`, `watchersRaw`, `watchersPresent`, `watchersAbsorbed`, `houseIsWatching`, `privacyNeeded` … +4 more |
| 33985 | THE ROMANTIC ONE | — |
| 33998 | THE ROMANTIC SLAP, IN EVERY LANGUAGE IT HAPPENS IN | `SLAP_CRACK`, `slapCrack`, `ROMANTIC_REPLY`, `romanticReply`, `romanticVerdict`, `romanticSelf` |
| 34163 | “BEND HERE.” | `askToBend`, `BEND_ASK`, `bendAskLines`, `startRomantic` |
| 34242 | AND THE ROMANTIC ONE GETS THE SAME REWORK — with its own character | `updateRomantic` |
| 34312 | HER SPRITE FOR THIS ONE | — |
| 34323 | HOW SHE BENDS, AND WHETHER SHE BENDS AT ALL | `ROMANTIC_BEND`, `romanticBend`, `BEND_WORD`, `romanticBendWord`, `drawBendBrace` |
| 34458 | AND A HUSBAND BENDS TOO | `drawRomanticFig`, `drawRomanticFem`, `drawRomanticMale`, `drawRomantic` |
| 34764 | THE SWING | `STRIKES`, `romanticSwing` |
| 34795 | THE SLAP, REBUILT — the four beats an animator would actually give it | `SLAP_T`, `SLAP_ANG`, `SLAP_PIV`, `slapAng`, `slapArmVis`, `slapHand`, `hallShake`, `kickShake` … +9 more |
| 35341 | 🍑 THE TEMPT, ON THE NEW FIGURES — THE WHOLE WAY THROUGH | `temptHimPose`, `drawTemptFigures`, `drawTempt`, `openTemptAftermath` |
| 35588 | THE LONGHOUSE IN THE CLEARING | `hallProvince`, `hallStyle`, `drawForestShell` |
| 35738 | FOUR MORE HALLS — because only two of the seven were ever drawn | `drawCourtyardShell`, `drawPlankShell` |
| 35817 | THE RKRAI PLANK HOUSE | `drawGerShell`, `drawShoinShell`, `drawPillaredShell`, `drawDomus` |
| 36085 | THE HOUSE | — |
| 36765 | META SCREENS WIRING | `openSlots`, `refreshAdultBtn`, `prevHelp`, `settingsFrom`, `openSettings`, `closeSettings`, `buildSettings` |
| 36885 | A FOURTH COAST, IF YOU ASK PROPERLY | — |
| 36919 | THE WOOHOO GUIDE | `woohooFrom`, `openWoohooGuide`, `closeWoohooGuide`, `WOOHOO_GUIDE`, `buildWoohooGuide`, `refreshSettings`, `openStats`, `buildStats` … +1 more |
| 37055 | THE ROLL AT THE ENROLMENT TABLE — before the oath you roll for the body | `IMPOSSIBLE_CHANCE`, `rollHiddenPotential`, `rollCreation`, `rollBanner`, `STAT_COL` |
| 37128 | HOW HIGH UP THE LADDER THAT RUNG IS, 0..1 | `rungFrac` |
| 37146 | AND WHETHER A WOMAN IN THIS CAREER IS DRAWN CARRYING ARMS | `womanBearsArms`, `womanArmsNote`, `drawCardPortrait` |
| 37219 | A WOMAN WHO IS NOT A FIGHTER, DRESSED BY HER RUNG AND HER PEOPLE | `drawBrideCut`, `drawBridePortrait` |
| 38791 | AND THEN HER PEOPLE'S ACTUAL CUT GOES OVER THE TOP OF IT | `openCreate` |
| 39202 | AND THE OATH BUTTON IS SET FROM THE TRUTH, ONCE, AT THE END | — |
| 39255 | WHERE YOU ACTUALLY WAKE UP | — |
| 39305 | THE SILK ROAD — the eastern game's own economy, and its own history | `SILK_LEGS`, `silkLeg`, `silkOpen`, `SILK_STAKE_CAP`, `silkStake`, `silkOdds`, `silkRun` |
| 39413 | THE MARKET — 楽市楽座, AND WHY IT WAS A WEAPON | `COIN_GRADES`, `MARKET_RULES`, `MARKET_OF`, `marketHere`, `ensurePurse`, `purseFace`, `purseHere`, `erizeniQuote` … +1 more |
| 39550 | THE NANBAN TRADE — silver out, silk in, and one ship a year | `NANBAN_GOODS`, `NANBAN_PORTS`, `nanbanHere`, `kurofuneIn`, `kurofuneDays`, `pancadaMul`, `nanbanBuy`, `nanbanSell` |
| 39630 | THE FIVE TRADITIONS — 五箇伝, AND A BLADE IS NOT A BLADE | `GOKADEN`, `gokaden`, `BLADED_WA`, `bladeSchoolOf`, `bladeIsSchooled`, `TAMESHI`, `tameshiDone`, `ensureBlade` … +1 more |
| 39703 | THE SWORDSMITH — pick a tradition, then prove the blade | `openSmith` |
| 39811 | THE POWDER SUPPLY — and it is a foreign policy problem | `POWDER_SRC`, `powderSourcesHere`, `POWDER_MAX`, `powderHave`, `buyPowder` |
| 39864 | THE PORT — how a man with no name and no land gets rich | `VENTURES`, `ventureOpen`, `ventureStake`, `ventureOdds`, `runVenture` |
| 39928 | THE STANDARDS — what you may and may not do here, said plainly | `standardsHere` |
| 39964 | THE TEN AND THE RKRAUN — one screen that holds the whole coast | — |
| 39974 | ✎ THE SELVSKAR — THE ONE SHE CUTS HERSELF | `RK_SELVSKAR`, `RK_SELV_WHY`, `RK_SELV_SUBJ`, `selvskarOn`, `selvskarWaiting`, `selvskarWhy`, `selvskarArrive`, `selvskarPoll` |
| 40079 | THE PLATE, AND IT IS NOT A PAID HAND'S | `SELV_ANIM`, `selvskarFigure`, `drawSelvskar`, `selvskarMarks` |
| 40216 | A REAL ONE, NOT A CARTOON ONE | `selvskarDome`, `selvskarBlob`, `selvskarTrail`, `selvskarSplashStart`, `selvskarSplash` |
| 40438 | THE SCREEN | `SELV_RAF`, `selvskarStopAnim`, `openSelvskar`, `RK_SELV_BACK`, `selvskarDo`, `selvskarPutAway` |
| 40562 | ⛵ THE UVRAAK — THE GOING-OVER | `RK_UVRAAK`, `RK_CROSS_SEASONS`, `RK_CROSS_WINDOW`, `rkCrossDay`, `rkCrossSeason`, `rkCrossNextSeason` |
| 40628 | THE SEVEN HOLDS | `RK_HOLDS`, `rkHoldById` |
| 40708 | 🗺 THE STRAIT PLATE — this coast's own sheet | `RK_COAST_W`, `RK_COAST_W_END`, `RK_COAST_E`, `RK_COAST_E_END`, `RK_PIN_LAB`, `drawStraitMap`, `rkStraitHit`, `rkCrossOn` … +4 more |
| 41094 | ⚖ THE LOOK-OVER — your power against theirs, itemised | `rkPowerRows`, `rkPower`, `rkHoldRows`, `rkHoldPower`, `rkHoldWaves`, `rkVerdict`, `rkLookOver` |
| 41168 | 📣 THE VOICE'S CRIERS — and which of them is lying | `RK_CRIER`, `rkCrierById`, `rkCrierNow`, `rkCrierCall`, `rkCrierResolve` |
| 41315 | TAKING ONE | `rkHoldTake`, `rkCrossSettle`, `rkCrossIncome`, `rkCrossPhase` |
| 41403 | ⚔ THE SKARVEK — the coast's other ladder | `RK_WAR_RANKS`, `rkWarScore`, `rkWarRank`, `rkWarNext`, `rkWarOn`, `rkExpectLen`, `rkExpectGap`, `rkExpectLine` … +11 more |
| 41560 | ✇ THE RAUNSKAR — the coast's likeness trade | `RK_RAUNSKAR`, `RK_ART_HANDS`, `RK_ART_FORMS`, `RK_ART_POSES`, `RK_ART_DRESS`, `RK_ART_REFUSED`, `RK_ART_FACE`, `RK_ART_FRAME` … +18 more |
| 42120 | ⛵ THE SCREEN — the plate, the look-over, and the criers | `rkCrossSel` |
| 42128 | ◈ THE SEATING — the screen the Ten do it on | `openSeating`, `openUvraak`, `openRaunskar`, `raunskarOffers`, `raunskarBench`, `raunskarHouse`, `openTheTen`, `openStandards` |
| 43281 | YOUR OWN HOUSE — a name, a crest, a colour, and a banner over it | `MON_CHOICES`, `CLAN_COLS`, `waHouseName`, `canFoundHouse`, `foundHouse`, `openFoundHouse`, `openMarket`, `openSilk` |
| 43733 | THE HUB IS NOT THE SAME HUB | `HUB_EAST`, `HUB_WA`, `HUB_WEST_LABEL`, `HUB_RK`, `applyHub`, `enterMap`, `regionUnlocked`, `imperialAvailable` … +16 more |
| 44451 | THE BARBER AND THE CLOTHIER — you had eight cuts, five beards, seven | `outfitAllowed`, `outfitLockNote`, `barberCost`, `clothierCost`, `buildBarberCard`, `buildLegacyCard`, `buildSuccessionCard`, `succession` |
| 44739 | THE SON'S PATH — THE LEGIONS. An heir may refuse the sand and take a | — |
| 44744 | THE ARMY IN DEPTH — a legion is not a number. It is cohorts of specific | `UNIT_TYPES`, `unitCount`, `armySize`, `armyUpkeep`, `armyPowerDetail`, `supplyState`, `FORTRESSES`, `MIL_RANKS` … +14 more |
| 45065 | THE FAMILY TREE, IN FOUR REGISTERS | `TREE_TAB`, `treeTabs`, `openTree` |
| 45468 | ⚭ THE NOBLE TREE — WHO YOU ARE RELATED TO BY CONTRACT | `nobleHouses`, `treeNoble` |
| 45635 | 🏛 THE GOVERNOR'S TREE — WHAT YOU ADMINISTER | `treeGovernor`, `openTitles`, `herbBack`, `openHerbs` |
| 45831 | PROVINCIAL MANAGEMENT — tax, garrison, grain, governors and unrest, | `openProvinces` |
| 45957 | THE NIGHT THEY COME FOR THE PURPLE — when RISK TO THE PURPLE runs hot | `coupDue`, `maybeCoup`, `openCoup` |
| 46069 | CALL-OUTS — Rome says what it thinks of you, out loud, in the street. | `maybeCallout` |
| 46074 | SHE ASKS FIRST | `FESTIVALS`, `festivalToday`, `anWord`, `spouseExcuse`, `SPOUSE_ASKS`, `quirkAside`, `spouseAskDue`, `maybeSpouseAsk` |
| 46250 | THE CHILDREN, ONCE THEY ARE PEOPLE | `kidAgeYears`, `kidBand`, `livingKids` |
| 46269 | HOW BIG A CHILD IS DRAWN | `kidDrawScale`, `grownLook`, `drawChildFigure`, `kidsOfBand`, `kidName`, `kidHe`, `kidHim`, `kidSon` … +1 more |
| 46349 | THE SUITOR HALL — marrying off a grown child | `SUITOR_HOUSES`, `SUITOR_STYLE`, `RK_SUITOR_STYLE`, `EAST_SUITOR_STYLE`, `WA_SUITOR_STYLE`, `suitorStyleList`, `suitorRank`, `makeSuitorFor` … +1 more |
| 46522 | WHAT THE DISTRICT CALLS THEM | `ARD_TITLES`, `KID_TITLES`, `pickTitle`, `bedTitle`, `ARD_WINDOW`, `myArdRate`, `myBedTitle` |
| 46581 | THE ESCORT — he takes her to the room, and HOW he does it is the whole | `ESCORT_POSES`, `escortPoseFor`, `escortPose`, `coupleLooks`, `drawCarriedFem`, `ESCORT_WIFE_DX`, `maybeArmSwat`, `drawArmSwat` … +2 more |
| 46830 | THE HOUSE GROWS WITH THE ESTATE | — |
| 46843 | THE HOUSE IS NOT A DOMUS EVERYWHERE | `HOUSE_SETS`, `houseSetId`, `houseSet`, `HOUSE_TIERS`, `houseTier`, `hasRoom`, `SECTION_X` |
| 47014 | THE SECTIONS THEMSELVES | `drawCulina`, `drawTriclinium`, `drawPeristyle`, `drawLararium`, `drawHouseSections`, `DOMUS_UPPER`, `STAIR_X0`, `STAIR_X1` … +21 more |
| 47482 | THE ONE LOOK | `peekKey`, `peekUsed`, `markPeeked`, `PEEK_ROOM`, `PEEK_STAGE` |
| 47517 | THEY ARE NOT IN THE SAME STATE AS EACH OTHER | `HEAT_HIM`, `HEAT_HER` |
| 47533 | AND WHAT THEY WERE ACTUALLY DOING | `PEEK_ACTS`, `PEEK_ACT_MAP`, `peekActWeight`, `peekAct`, `peekHeat`, `PEEK_REACT`, `peekReactFor`, `startPeek` … +18 more |
| 48263 | GRAVITAS  —  THE FACE YOU WEAR OUTSIDE THE DOOR | `gravitasRaw`, `gravitas`, `setGravitas`, `GRAVITAS_TIERS`, `gravitasTier`, `gravitasHit`, `gravitasTick` |
| 48363 | THE MARRIAGE LEDGER  —  standing, favours, feuds, and grandchildren | `inlawStanding`, `setStanding`, `standingLabel`, `FEUD_LINES`, `feudsList`, `feudOn`, `addFeud`, `feudHeat` … +3 more |
| 48449 | 11 · WHAT THE IN-LAWS ARE ACTUALLY LIKE | `INLAW_TRAIT_FX`, `INLAW_FLAW_FX`, `inlawTraitsOf`, `inlawFlawsOf`, `favourSurcharge`, `inlawTick` |
| 48552 | TEACHING THEM THE FACE | `kidDecorum`, `setDecorum`, `DECORUM_TIERS`, `decorumTier`, `DECORUM_DRILL`, `teachableKids`, `teachDecorum`, `KID_BLURTS` … +3 more |
| 48676 | 1 · THE MORNING AFTER   ·   4 · THE ANNIVERSARY | `MORNING_WARM`, `MORNING_COOL`, `morningDue`, `morningCard`, `annivYears`, `annivDue`, `annivCard` |
| 48785 | WHO IS IN WHICH ROOM | `HOUSE_ROOMS`, `adultCouple`, `roomsOccupiedToday`, `roomOccupant`, `placeMenuUp` |
| 48842 | THE DOOR — AND IT IS NOT THE SAME DOOR IN EVERY HOUSE | `DOOR_PLAN`, `doorPlan`, `drawDoorLamp`, `drawHallExit`, `drawDoor`, `houseGuestBusy`, `suitorsAvailable`, `makeCheatSuitor` … +3 more |
| 49565 | 14 · HAGGLING THE DOWRY | `haggleLeverage`, `HAGGLE_POSTURES`, `openHaggle`, `openWeddingChoice`, `buildSuitorCard` |
| 49700 | THE FACE, AND TEACHING IT — the villa's own card for both | `buildGravitasCard` |
| 49750 | TAKING THE KING'S SALT | `inParthia`, `buildParthiaCard` |
| 49793 | THE LAW OF THIS PLACE — the card that tells you what you are living under | — |
| 49801 | THE CHOICE — and it prints the price BEFORE you take it | `buildEastActCard`, `buildActCard`, `buildMoresCard`, `buildDiscretionCard` |
| 49983 | 13 · GOING TO SEE YOUR DAUGHTER | `visitableKids`, `VISIT_SCENES`, `buildVisitCard`, `buildFeudCard`, `buildKidHousesCard`, `FAMILY_EVENTS`, `familyDue`, `maybeFamily` … +6 more |
| 50537 | THE GROOM'S PLATE — the same painted alcove her portrait gets, and HIS | `drawGroomPortrait`, `briadeImg`, `marriageEffectsText`, `LOVE_CAP`, `bedLen`, `loveLeft`, `spendLove`, `vigilReady` … +2 more |
| 50629 | JEALOUSY — she notices. Neglect, other women, and a wandering | `jealousyLevel`, `jealousyLabel`, `addJealousy`, `easeJealousy`, `jealousyEffects`, `jealousyBlocksBed` |
| 50673 | THE TABULA — a wax-tablet note home, ancient texting. Her reply is | `NOTE_PRESETS`, `NOTE_WORDS`, `noteSentiment`, `noteBaseTier`, `NOTE_REPLIES`, `NOTE_AFTERGLOW`, `NOTE_APOLOGY_SOFT`, `NOTE_QUESTION` … +46 more |
| 52159 | PROVINCE TERRITORIES — every playable region as an actual shape on the | `PROV_SHAPES`, `PROV_SEAMS`, `lonlat` |
| 52208 | THE EASTERN WORLD, c. 200 A.D. | `MAP_EAST_PROJ`, `lonlatE`, `eastXY`, `REGIONS_EAST` |
| 52288 | TWELVE MORE, BECAUSE TWENTY-TWO WAS NOT ASIA | `REGION_EAST_BY_ID` |
| 52331 | THE RKRAI SHORE — an invented people, held to internal consistency | — |
| 52363 | THE BORDER, AND IT IS NOT AN ISLAND | `MAP_RK_PROJ`, `rkLonX`, `rkLL`, `rkXY`, `RK_LAND_CHUK`, `RK_LAND_AK`, `RK_ISLES`, `RK_PROV_SHAPES` … +6 more |
| 52501 | THE MASTERIES — the Rkrai theology, and it is a civil service | `RK_MASTERIES`, `RK_MASTERY_BY_ID` |
| 52576 | AND THE LADDER, WHICH IS WRITTEN DOWN | `RK_RANKS` |
| 52590 | AND WHO IS ACTUALLY IN CHARGE — THE RKRAUN | `RK_GOVERN`, `rkHead`, `rkHere` |
| 52632 | THE ULVIK — WHAT SHE WEARS INDOORS, AND WHY IT IS A DIFFERENT GARMENT | `RK_HOUSE` |
| 52662 | AND IT IS CUT FOR THE OFFICE, WHICH IS THE ENTIRE POINT OF IT | `RK_CUTS`, `rkCut` |
| 52722 | AND THE MEN'S SEVEN, BECAUSE A BODY IS A BODY | `RK_CUTS_M`, `rkCutM`, `rkCutMWhy`, `rkStandShow`, `rkHouseKilt` |
| 52826 | THE TAQRUN STANDING — AND THE EXACT MIRROR OF THE READING | `RK_TAQRUN`, `rkTaqrunSeated`, `rkTaqrunWhose`, `rkStandOn`, `rkStandOk`, `rkStand`, `rkTaqrunDuty`, `rkWifeExcuse` … +4 more |
| 52991 | THE PRESS — the answer to a standing, and it is its own act | `RK_PRESS`, `rkPressTier`, `rkPressOk`, `rkPressDo` |
| 53108 | AND A SEATING IS NOT ONLY A NUMBER | `RK_SEAT_COND`, `rkSeatCond`, `rkSeatConsentWho`, `rkSeatKey`, `rkSeatAsked`, `rkSeatConsent`, `RK_SEAT_ASK`, `rkSeatAskVerdict` … +4 more |
| 53280 | THE SIX LOOKS-TITLES, AND YOU NEED THE LOOKS | `RK_WIFE_TITLES`, `RK_WIFE_TITLE_BY_ID` |
| 53346 | AND THE SIX WOMEN WHO CURRENTLY HOLD THEM | `RK_TITLED_WIVES`, `RK_TITLED_BY_ID`, `makeRkTitledWife`, `rkTitledOffered`, `RK_EARNED_TITLES`, `RK_WORK_TITLES`, `RK_WORK_BY_ID`, `rkIsWorkSeat` … +11 more |
| 53619 | AND THE MEN'S SIDE OF THE REACH, WHICH IS MEASURED | `RK_TAQRUN_NEED`, `rkTaqrunClaim`, `rkTaqrunSeated` |
| 53643 | THE READING — AND ON THIS COAST, NOT LOOKING IS THE RUDE THING | `RK_READ`, `rkReadOn`, `rkHeldVerdict` |
| 53707 | THE SIVRAK — GREEN THAT CAME THROUGH THE STEELYARD AND DID NOT GO ON | `RK_SIVRAK`, `rkBestPart`, `RK_SIVRAK_FRAME`, `RK_SIVRAK_FRAME_M`, `rkSivrakFrame`, `rkSivrakFrameM`, `rkSivrakOn`, `rkSivrakBuilt` … +7 more |
| 53905 | THE FOUR PROVINCES AND THE CAPITAL, WHICH YOU CAN COME TO HOLD | `RK_PROVINCES`, `RK_PROV_BY_ID`, `rkProvHeld`, `rkProvList`, `rkProvSeatOk`, `rkProvClaim`, `rkProvTake`, `rkProvYield` … +1 more |
| 54002 | AND THE MEN'S SIX, WHICH ARE THE SAME SIX MASTERIES READ OFF A MAN | `RK_HUSB_TITLES`, `RK_HUSB_TITLE_BY_ID` |
| 54069 | TWELVE SEATS, AND SOMEBODY IS ALREADY SITTING IN EVERY ONE OF THEM | `RK_SEAT_FOLK`, `RK_SEATING_FEE`, `rkSeats`, `rkSeatSubject`, `rkMeasure`, `rkSeatTitle`, `rkSeatClaim`, `rkSeatTake` … +4 more |
| 54238 | HOW THE RKRAI MARRY THEIR CHILDREN, WHICH IS NOT HOW ANYBODY ELSE ON | `RK_COURT`, `rkAgeVerdict`, `rkMotherRead`, `rkCallerCount` |
| 54321 | THE THIRD SHEET — WA, AND THE CROSSING THAT COST THIRTEEN CENTURIES | — |
| 54343 | THE PROJECTION — and why this sheet is turned on its side | `MAP_WA_PROJ`, `lonlatW`, `waXY`, `REGIONS_WA`, `REGION_WA_BY_ID` |
| 54461 | THE CLANS — 1543-1590, AND WHY THE MAP IS A PATCHWORK | `CLANS_WA`, `CLAN_OF_WA`, `clanOf`, `clanIdOf`, `clanHolds` |
| 54547 | THE MON — the crest, drawn rather than lettered | `drawMon`, `WA_REFUSAL`, `regionBlocked`, `refuseBlocked` |
| 54709 | THE CROSSING — and what it costs is not money | `CROSS_PORTS`, `canAttemptCrossing`, `crossingBlockReason`, `CROSSING_LOG`, `CROSSING_ARRIVAL`, `beginCrossing`, `openCrossing`, `openCrossingLog` |
| 54846 | THE EASTERN SHEET — drawn from real coastlines, like the western one | `drawMapCanvasEast` |
| 55082 | THE WA SHEET — Honshū, Kyūshū, Shikoku, from real coastlines | — |
| 55099 | THE COASTLINE — traced, not blocked out | `WA_HONSHU`, `WA_KYUSHU`, `WA_SHIKOKU`, `WA_EZO` |
| 55176 | AND THE ISLANDS, which are not decoration in this century | `WA_ISLES` |
| 55205 | THE PATCHWORK — territory by colour, and a border where houses meet | `_waTerrBuf`, `waTerritory`, `WA_CREST_AT`, `drawWaCrests` |
| 55335 | WHERE THE LABELS GO — six seats inside two degrees | `WA_PIN_POS`, `layoutWaPins`, `drawWaLeaders` |
| 55399 | THE RKRAI SHORE, DRAWN | — |
| 55412 | THE RKRAI SHEET — CHUKOTKA, ALASKA, AND THE STRAIT BETWEEN THEM | `drawMapCanvasRk`, `drawMapCanvasWa`, `agePlateWa` |
| 55867 | THE PLATE — what makes a map look like a MAP of its own century | `agePlate`, `coastHatch`, `drawMapLegend`, `drawCompass`, `drawScaleBar`, `drawMapCanvas`, `briefCtx`, `tierName` … +1 more |
| 56668 | THE LANISTA'S CELLS — pay the fee, then pick your man | `openRigPick`, `shopTab` |
| 56751 | THE RANGED RACK, DRAWN — every one of these was an emoji | `drawRangedIcon`, `drawGearIcon`, `gearIconImg`, `openShop` |
| 57754 | THE LUDUS — drilled skills, real wounds, and a body that wears out. | `SKILLS`, `skillLvl`, `skillCost` |
| 57766 | THE BODY, WHICH YOU COULD NOT TRAIN | `BODYSKILLS`, `BODYSKILL_NAME`, `bodySkillNames`, `bodyLvl`, `BODYSKILL_MAX`, `bodyCost`, `bodyHpBonus`, `bodyMitBonus` … +4 more |
| 57845 | SCARS — THE ARENA'S PRICE, AND IT IS PAID ON THE SKIN. A wound that closes | `scarZoneOf`, `addScar`, `scarName`, `scarList`, `scarCount`, `drawScarsOn` |
| 57890 | AN ICON FOR EACH, DRAWN | `drawBodySkillIcon`, `trainScreen` |
| 58051 | BOOT | — |
| 58058 | PIXEL LOGO — "SAND ⛑ STEEL" on riveted crimson planks + favicon | `LOGO_F`, `LOGO_HELM`, `drawLogoHelm`, `drawLogo` |
