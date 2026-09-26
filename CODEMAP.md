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
| 831 | SAND & STEEL — Gladiators of 200 A.D. | `cv`, `ctx`, `tcv`, `tctx`, `TS`, `W`, `GROUND`, `WALL_L` … +12 more |
| 876 | DATA — real historical content from c.200 A.D. | `REGIONS`, `REGION_BY_ID`, `NON_ROMAN`, `ROMAN_REGIONS`, `REGION_TITLES`, `CLASSES` |
| 1006 | AND WHICH TRADE THE GROUND ITSELF FIELDS | `WA_GROUND_CLASSES`, `classesForWorld`, `CLASS_ORDER`, `CLASS_ORDER_EAST`, `GEAR` |
| 1077 | THE ARSENAL OF THE SENGOKU — and the sword is not the point of it | — |
| 1091 | THE POOR MAN'S ARSENAL — and it is the farm shed | — |
| 1108 | BAMBOO, AND WHY — the correction | `gearOf`, `PILUM`, `aimZoneFor`, `rangedDamage`, `pilumDamage`, `BOWS` |
| 1447 | THE YUMI — and why the samurai spent five hundred years on it | — |
| 1464 | THE GUNS — and the trade-off IS the history | — |
| 1507 | THE REST OF THE POWDER — and the honest note about rifles | `bowOf` |
| 1547 | WHAT THE SHOP ACTUALLY STOCKS | `gearWorldOf`, `gearStockedHere`, `isGun` |
| 1575 | IT IS NOT A BOW. STOP CALLING IT A BOW. | `rangedWords`, `rangedShelfName` |
| 1605 | YOU CANNOT SIMPLY BUY THIS | `rankTier` |
| 1634 | THE ARMATURA — a gladiator IS his kit | `ARMATURA`, `myArmatura` |
| 1710 | AND WHO GETS TO IGNORE IT | `OFFTYPE_PURSE`, `canChooseOwnKit`, `offTypeWhy`, `armaturaOn`, `inArmatura`, `gearGate`, `gearBuyable`, `rangedCooldown` |
| 1782 | THE WEATHER — which exists in this game only because the gun does | `WET_CHANCE`, `rollWeather`, `isWet`, `misfireChance`, `FOE_NAMES`, `FOE_TITLES`, `ARCHETYPES`, `ARCH_ORDER_WEST` … +4 more |
| 1921 | TWO WORLDS, ONE GAME | — |
| 1933 | THE SEVEN SENGOKU CAREERS | — |
| 1942 | THE ROLE IS THE RANK — nobody chooses out of the whole list | `WORLDS` |
| 2116 | AND A FOURTH, WHICH IS NOT A REAL PLACE | `WORLD_IDS`, `worldOfArch`, `regionsForWorld`, `regionAny`, `worldOfRegion`, `playerWorld`, `SOCIAL`, `SOCIAL_ORDER` |
| 2189 | THE EASTERN LADDER — nobody in Luoyang was ever a patrician | `SOCIAL_EAST` |
| 2298 | WA · and the ladder here is measured in RICE | — |
| 2327 | THE RKRAI LADDER — five notches, cut in the post | `socialSetFor`, `socialSetForSel`, `socialRung`, `playerRung` |
| 2375 | THE OTHER LEDGER'S SELLER — who you go to for it depends entirely on | `SECRET_SELLERS`, `ELITE_MEN`, `ELITE_WOMEN`, `PLOT_TARGETS`, `OFFICES`, `KEY_PROVINCES`, `keyCount`, `GEN_NAMES` … +2 more |
| 2462 | MARRIAGE — take a wife once powerful (or, as an elite, by dynastic duty) | `BRIDE` |
| 2490 | AND EVERYWHERE ELSE ON EARTH | `BRIDE_ETHS`, `BRIDE_ETHS_BY_WORLD`, `WA_PORTS`, `brideEthsHere`, `homeBrideEth` |
| 2573 | THE CULTURES — what a people actually BELIEVED, as numbers | `CULTURES` |
| 2617 | THE RKRAI — INVENTED. The only culture in this table that is not | — |
| 2740 | THE EASTERN PEOPLES — four more rows in the same tables | — |
| 2830 | WA · and it is thirteen hundred years from everything else in this game | `CULTURE_IDS`, `cultureById`, `ARCH_CULTURE`, `ARCH_RANK`, `archRank`, `RANK_LOCK`, `RANK_COL`, `rankLockNote` … +5 more |
| 2993 | TRIBAL RANK — a chieftain's wife did not dress like a herdsman's | `isTribal`, `tribalRank`, `tribalTier`, `tribalCloth`, `coverageBand`, `localCulture` |
| 3077 | THE MORES — what each people's LAW actually did about it | `MORES` |
| 3218 | WA · what a household may and may not do, in this century | `moresOf` |
| 3255 | RIGGING THE BOUT — the fee gets you in the room, the man costs extra | `RIG_FEE`, `RIG_BUILDS`, `rigBuild`, `rigManPrice`, `rigSuspicion`, `rigPurseMul`, `drawRigCandidate` |
| 3378 | THE COIN IN YOUR HAND — and it is not a denarius everywhere | `CURRENCY` |
| 3449 | SENGOKU JAPAN · and it has THREE moneys at once, which is the point | `CURRENCY_OF`, `CURRENCY_REGION`, `currencyHere`, `coinWord`, `coinShortStr`, `drawCoinIcon`, `_COINIMG`, `coinIconURI` … +1 more |
| 3621 | THE MOS — WHAT ROME ACTUALLY OBJECTED TO, AND WHY | `ACTS`, `ACT_BY_ID` |
| 3684 | THE EASTERN BEDCHAMBER — a different question entirely | `EAST_ACTS` |
| 3799 | WA · and the household is a chapter of the war | — |
| 3851 | THE EASTERN MATCH — nobody in Luoyang negotiates a Roman dowry | `MATCH_EAST`, `matchEast`, `matchEastForPlayer`, `eastDowryLine`, `buildEastMatchCard` |
| 3978 | AND THE RKRAI SHORE, WHICH JUDGES A HOUSE ON ITS STORE | `eastActSet`, `eastActById`, `eastAxisValue`, `eastAxisBand`, `resolveEastAct`, `TABOO`, `TABOO_VOICE` |
| 4156 | HOW FAR ROME'S OPINION ACTUALLY REACHES | — |
| 4181 | WHERE MEN ACTUALLY FOUGHT — and it was NOT an amphitheatre everywhere | `VENUES` |
| 4279 | WA — and there is no arena anywhere in it | `VENUE_OF` |
| 4350 | THE RKRAI GROUNDS | `RK_VENUES`, `VENUE_REGION`, `venueHere`, `venueName`, `venueIsShow`, `REPUTATION_REACH`, `reputationReach`, `reachBand` … +9 more |
| 4559 | RESOLVING AN ACT — does anyone find out, and what does it cost | `actWitnessChance`, `resolveAct`, `actHerView`, `osImpurumTick`, `localMores`, `legalExposure`, `exposureSplit`, `fashionOffence` |
| 4681 | THE EYE, DECIDED ONCE, FOR EVERY FACE IN THE GAME | `INK_EYE_CULTURES`, `inkEyes`, `inkEyesOver` |
| 4765 | HAIR — ONE SYSTEM, DRAWN THE SAME EVERYWHERE. | `HAIR_F`, `HAIR_M`, `BEARD_M`, `HAIR_M_BY_ETH`, `BEARD_BY_ETH`, `HAIR_COL_M`, `HAIR_F_BY_ETH`, `OUTFITS_M` … +6 more |
| 5231 | THE HOUSE KILT — the men's side of the ulvik, and the same argument. | — |
| 5373 | AND THE ONE THE COAST MEASURES AT THE SEATING. | `drawBeardM`, `hexRGB`, `rgbA0` |
| 5507 | SMALL-SCALE HAIR — one routine, every sprite that is not a portrait | `drawHairSmall`, `hairStyleFallback`, `beardFallback`, `outfitFallback`, `hairStyleName`, `beardName`, `fixTraitsForSex`, `ensureQuirks` … +2 more |
| 5627 | BLOODLINE — every spouse carries LOOKS, SMARTS and TRAITS. Children | `BUILDS`, `LOOK_STAGES` |
| 5643 | AND THE LADDER ITSELF IS A ROMAN LADDER | `LOOK_LADDER`, `LOOK_BLURB`, `lookLadder`, `lookStage` |
| 5723 | THE SAME LADDER, ON THE WALL. The shadow-play reads the very stage the | `SHADOW_STAGES`, `shadowStage`, `BODY_PARTS`, `BODY_PARTS_M`, `SECRET_PART`, `secretUnlocked`, `secretAllowed`, `partsFor` … +1 more |
| 5805 | AND THE RUNGS OF EACH PART, WHICH ARE ALSO A JUDGEMENT | `PART_TIERS`, `partTiersHere`, `partTier` |
| 5874 | AND THE WORDS ARE ROMAN TOO | `BODY_WORDS`, `bodyWordsHere`, `partPhrase`, `bodyBlurb` |
| 5950 | DIRECT SPOUSE DESCRIPTIONS  (Settings → Direct spouse descriptions) | `BLUNT_WORDS`, `BLUNT_PLURAL`, `bluntWord`, `bluntDowry`, `bluntBrief`, `bodyTierLine`, `rollBody`, `makeImpossibleBody` |
| 6035 | YOUR OWN BLOOD — rolled at the enrolment table like anyone else's. | `rollPlayerBody`, `bodyAvg`, `ensurePlayerBody`, `selfSubject`, `syncPlayerLooks` |
| 6089 | THE HOUSE YOU WERE BORN INTO — a father, a mother, brothers and | `FATHERS`, `MOTHERS`, `SIB_ROLES_M`, `SIB_ROLES_F`, `NAMES_M`, `NAMES_F`, `makeFamily`, `kinAge` … +1 more |
| 6224 | THE FAMILY PORTRAIT GALLERY — every name in your house gets a drawn | `KIN_SKINS`, `KIN_HAIRS`, `kinHash`, `kinLook`, `kinInherit`, `drawKinPortrait` |
| 6497 | THE IMPERIAL COURT — the people who actually decide whether a purple-born | `PRAETORIAN_PREFECTS`, `COURT_FIGURES`, `makeCourt`, `COURT_LEVERS`, `courtBonus`, `courtCultivateCost`, `purpleRisk`, `opinionsOfYou` |
| 6593 | LOOKS ARE POLITICS. For a prince, a princess, an Augusta or a powerful | `beautyPower`, `BEAUTY_GIFTS`, `toleranceScore`, `loyaltyScore` |
| 6659 | PROVINCIAL MANAGEMENT — a title is not a trophy, it is a job. Every | `PROV_GOVS`, `PROV_GOVS_EAST`, `PROV_GOVS_WA`, `PROV_GOVS_RK`, `provGovList`, `provOf`, `heldProvinces`, `provUnrestAvg` … +4 more |
| 6732 | PUBLIC COMPLAINTS — the price of governing. Petitions come up from the | `COMPLAINT_KINDS`, `rollComplaint`, `pendingComplaints`, `complaintPressure` |
| 6769 | CALL-OUTS — somebody in the crowd says something about you, out loud, | `CALLOUT_LINES_F`, `CALLOUT_LINES_M` |
| 6790 | AND THE STREET DOES NOT SHOUT THE SAME THING EITHER | `CALLOUT_CULTURE`, `calloutLines`, `calloutDue` |
| 6890 | PUBLIC EYES — where the eyes actually go. A walking figure, an eye on | `GAZE_BASE_F`, `GAZE_BASE_M` |
| 6897 | WHERE THEY ACTUALLY LOOK, AND IT IS NOT THE SAME PLACE | `GAZE_CULTURE`, `GAZE_VOICE` |
| 7034 | THE LAST OF THE ROMAN FURNITURE | `FACE_WORD`, `FACE_RULE`, `faceRule`, `highBornLabel`, `highBornNote`, `gravitasWord`, `DYE_WORD`, `dyeWord` … +8 more |
| 7249 | ✧ THE KANRUK — KAN'S TURN, AND WHY THE COAST CALLS IT GOOD NEWS | `RK_KANRUK`, `RK_KANRUK_WINDOW`, `RK_KANRUK_ADD`, `kanrukOffered`, `kanrukActive`, `kanrukLeft`, `kanrukArm`, `kanrukSpend` … +2 more |
| 7403 | QUIRKS — THE MIDDLE TIER | `WIFE_QUIRKS` |
| 7477 | THE OUTER TIERS. Three bands was still too flat — everything good was | `WIFE_BOONS`, `WIFE_BANES`, `boonById`, `baneById`, `hasBoon`, `hasBane`, `rollBoons`, `rollBanes` … +6 more |
| 7552 | THE QUIRKS WERE NAMED IN ROME AND NEVER LEFT | `QUIRK_LOCAL`, `qText`, `bondCeiling` |
| 7623 | THE KILT, WHICH DOES NOT TENT | `drawKiltLift`, `rollQuirks`, `flawById`, `flawLabel` |
| 7723 | THE CHIPS. These used to be three words of coloured text in a row, | `CHIP_TIERS`, `traitChip` |
| 7771 | A TRAIT THAT BELONGS TO THE OTHER SEX IS NOT YOURS | `traitsForSex`, `traitsHtml`, `traitsDetailHtml`, `hasFlaw`, `rollFlaws`, `TIERS`, `spouseTierName`, `SLAP_BUTTON` … +14 more |
| 8159 | THE BODY MAP — a matchmaker's chart, bought once for 200d. Every region | `heatColor`, `bmCache`, `bmResetCache`, `bmOnce` |
| 8181 | THE SHAKE — and it is HER OWN MEASUREMENTS doing it | `SHIMMY`, `shimmyOf`, `SHIMMY_TIER`, `shimmyStart`, `shimmyTick`, `shimmyLive`, `shimmyEnv`, `shimmyHip` … +5 more |
| 8284 | SLAP PHYSICS — one damped spring, shared by every figure that can take one | `SLAPJ`, `slapKick`, `slapJigTick`, `slapJig`, `slapLive` |
| 8318 | THE CHART FIGURE — built FOR the chart, not borrowed from the villa | `chartLandmarks` |
| 8368 | ◐ HIS LENGTH, DRAWN AS A THING AND NOT A SAUSAGE | `hexOf`, `sstep`, `lengthPose`, `LEN_GROW`, `LEN_INCH`, `LEN_GROW_BY`, `lenGrow`, `lenFrac` … +4 more |
| 8633 | 🗣 WHAT THE VILLAGE CALLS HIM | `VILLAGE_NAMES`, `villageMan`, `villageName`, `fmtLen` |
| 8705 | 🗣 AND WHAT IT CALLS HER — AND THE HOUSE — AND THE REST OF THE STREET | `VILLAGE_NAMES_F`, `VILLAGE_HOUSE`, `villageCult`, `villageWoman`, `villageFCtx`, `villageNameF`, `villageHouseName`, `villageStreet` … +9 more |
| 8968 | 🧍 THE REAL FIGURE | `smoothPath`, `limbPts`, `realAnchors` |
| 9024 | ☺ HIS FACE WHEN HE IS UP — AND IT IS NOT ALWAYS A SMILE | — |
| 9038 | 😋 THE FACES THAT SAY SOMETHING — hungry, smitten, hurt, and friends | `FACE_EX`, `wantEyes`, `resolveEyes`, `CHART_FACES`, `CHART_FACE_ORDER`, `CHART_FACE`, `chartFace`, `faceAsHard` … +21 more |
| 9351 | 💇 THE CUT AND THE BEARD, ON THE FRONT FIGURE — "there are still old parts | `realHairFront`, `realBeardFront`, `drawRealFig`, `drawChartFig`, `drawBodyMap` |
| 10250 | THE REAL FIGURE, if you asked for it. | — |
| 10828 | THE PART PICKER, AND THE COMPARISON | `drawPartPicker` |
| 10900 | TWO CUSHIONS, LARGER THAN THE PART ITSELF, AND A ROD | — |
| 10970 | ONE LAMP, ABOVE AND LEFT — AND IT DOES NOT FLIP | `rgbTriple`, `shade2`, `lit2`, `rgbA`, `readOn`, `drawMapReadout`, `drawMapScale`, `drawWalkFigure` … +25 more |
| 11879 | ◐ THE RISING — AND THE LEDGER KEEPS COUNT OF IT | `AROUSE_WHY`, `AROUSE_KEEP`, `arouseDayKey`, `arouseToday`, `arouseLog`, `arouseByWhy`, `arousePerDay`, `arouseStanding` … +1 more |
| 11971 | ⬔ THE CHART, TURNED — A THIRD VIEW OF THE SAME NUMBERS | `bodyRings`, `BODY3D_TILT`, `ring3D`, `densify`, `BODY3D_STEP`, `stack3D`, `drawBody3D`, `bodyMapRebuildSub` … +5 more |
| 12478 | THE CHART IS NOW SOMETHING YOU CAN PUT A FINGER ON | — |
| 12704 | AND IT HAS TO WORK WITH NO LIFE BEHIND IT | `BM_STASH`, `createPreviewMap`, `bmEndPreview`, `openMirror`, `bodyMapSubject`, `statPips`, `rollBrides` |
| 12792 | COURTSHIP — YOU HAVE TO TALK. | `COURT_RANKS` |
| 12822 | WHERE YOU STAND, ON WHATEVER LADDER YOU ARE ON | `socialRankIndex`, `wealthRungs`, `effectiveRank`, `courtAccess`, `COURT_PROMPTS`, `COURT_BOASTS` |
| 13071 | 🌹 COURTSHIP, UPGRADED — "upgrade courtship" | `COURT_TEMPERS`, `COURT_GIFTS`, `COURT_GIFT_EXPECT`, `COURT_RIVAL_BEATS`, `MEDIUM_CENSOR`, `COURT_RESULT`, `CT`, `courtBodyVal` … +44 more |
| 13919 | THE LEGACY HOUSE — a dynastic seat you plant in a province of your | `LEGACY_INFO` |
| 13941 | AND YOU CANNOT SEAT YOUR NAME IN AEGYPTUS FROM KYŌTO | `LEGACY_EAST`, `LEGACY_WA`, `LEGACY_RK`, `legacySet`, `legacyAudience`, `legacyLevels`, `legacyWord`, `legacyInfo` … +6 more |
| 14096 | GAME STATE / SAVE | `SAVE_KEY`, `SLOT_KEY`, `NSLOTS`, `saveSlot`, `slotKey`, `setSlot`, `slotInfo`, `G` … +2 more |
| 14217 | THE GLADIATRIX — a woman fights in DEFIANCE of the Emperor's ban. The | `GLADIATRIX_EVENTS`, `gladiatrixStageFrom`, `gladiatrixAfterWin`, `gladiatrixBriefBlock`, `checkFamilyMan`, `elevateWife`, `migrate` |
| 14294 | AN OLD SAVE MUST NOT LOSE WHAT IT WAS ALREADY CARRYING | `saveGame`, `hasSave`, `loadGame` |
| 14344 | MATURE-CONTENT GATE | `ADULT_KEY`, `ADULT`, `setAdult`, `SETTINGS_KEY`, `BUILD_STAMP`, `SETTINGS`, `saveSettings`, `NIGHT_FACES` … +4 more |
| 14380 | THE RICHER YOU GET, THE BETTER THEY SEND | `wealthHeat`, `wealthMul`, `wealthNote`, `STATS_KEY`, `STATS`, `saveStats`, `bumpStat`, `ACHIEVEMENTS` … +4 more |
| 14451 | UI: stat bar + toast | `refreshStatbar`, `MOUNTS`, `MOUNT_WORDS`, `mountOf`, `BOAT_WORD` |
| 14501 | WHAT YOU START WITH IS WHAT THE CARD SAYS YOU START WITH | `ARCH_START_EXTRA`, `RUNG_START_EXTRA`, `startLadderOf`, `startKitFor`, `startKitExtrasHTML`, `applyStartKit`, `toastT`, `toast` |
| 14581 | PIXEL SPRITE: gladiator (drawn procedurally, faces +x by default) | `SKIN` |
| 14586 | WHOSE FACES ARE IN THE ROOM | `SKIN_BY_CULT`, `skinHere`, `pickSkin`, `skinAt`, `shade`, `mixHex` |
| 14651 | THE YEARS, WRITTEN ON THE FACE. One number in, four things out — and every | `ageMarks`, `greyHair`, `agedSkin`, `paletteFor` |
| 14682 | THE SWING YOU CAN SEE — arcs, impact, and weight | — |
| 14706 | THE AIR IN THE PLACE, AND THE THING YOU ARE SEEING IT OVER | `drawGroundHaze`, `drawArenaForeground`, `weaponTipLen`, `pushSwingTrail`, `updateSwingTrails`, `drawSwingTrails` |
| 14853 | AND THE HIT ITSELF | `impactBurst`, `updateImpacts`, `drawImpacts`, `swingSfx`, `drawGladiator`, `drawBeast` |
| 15006 | 🦁 THE BEASTS, ON BODIES OF THEIR OWN | `BST_SPEC`, `BST_BW`, `bstBuf`, `bstSpline`, `bstLimbPath`, `bstLG`, `bstRand`, `bstPose` … +10 more |
| 15432 | THE SASHIMONO — the flag on a man's back | `drawSashimono`, `drawGladBody`, `drawStuck`, `drawSlashFx`, `drawLeg`, `drawTorso` |
| 15584 | THE EAST AND THE SENGOKU, ON THE BODY | `drawHead` |
| 15682 | THE EYES, AND THEY ARE NOT THE SAME EYES EVERYWHERE | `drawHelmet2` |
| 15801 | THE SENGOKU HEAD — and none of it is a Roman galea | `drawShield2`, `drawArm2` |
| 16035 | YOU DO NOT WIND UP A MATCHLOCK | `drawGunArms`, `drawThrowArm`, `drawWeapon2` |
| 16171 | THE FIVE BAMBOO PIECES — and not one of them is a bamboo sword, | — |
| 16522 | ARENA RENDERING | `makeFighter`, `FT`, `makeArenaFoe` |
| 16598 | AND THE MAN OPPOSITE ACTUALLY CARRIES ONE | `FOE_GUN`, `armFoeRanged`, `foeGunAI`, `NAVAL_NAMES`, `BEASTS`, `pickBeast`, `makeBeast` |
| 16685 | NEMESIS — a named rival who rises with you, taunts, meddles, and finally | `NEM_FIRST`, `NEM_EPITHET`, `NEM_TAUNTS`, `nemFull`, `makeNemesis`, `nemesisAfterWin`, `drawNemesisPortrait`, `nemesisBriefBlock` … +10 more |
| 17029 | THE SIDEARM — 抜刀, and it is why the daishō exists | `hasSidearm`, `sidearmName`, `drawnWeaponName`, `rangedReady`, `switchWeapon`, `autoDrawBlade`, `playerRanged`, `beginRangedCharge` … +5 more |
| 17210 | THE BLAST — the only area weapon in the game, and it is ceramic | `blastAt`, `updateBurns` |
| 17264 | THE RAIN — which has been a number nobody could see | `initRain`, `updateRain`, `drawRain`, `drawWetNotice`, `gunSmoke`, `updateGunSmoke`, `drawGunSmoke`, `throwPilum` … +8 more |
| 17556 | WHAT A MATCHLOCK LOOKS LIKE, and it is not a musket | `drawHeldGun`, `drawHeldBomb`, `drawHeldBow`, `drawArrow`, `aiUpdate`, `beastHop`, `beastLunge`, `beastBite` … +14 more |
| 18285 | ARENA DRAW | `drawVillaBg`, `drawDeadTree`, `drawPitBg` |
| 18408 | THE THEATRES OF THE EMPIRE | `ARENA_THEATRES` |
| 18487 | THE EASTERN GROUNDS — and NOT ONE OF THEM IS AN AMPHITHEATRE | — |
| 18558 | THE SIX GROUNDS OF THE SENGOKU — and every house has its own | — |
| 18568 | THE RKRAI SHORE — four grounds, and not one of them is a show. | `waHouseHere`, `THEATRE_OF`, `theatreOf`, `THEATRE_FOES`, `theatreFoeName`, `crowdIsHostile`, `drawTheatreSkyline`, `drawArena` |
| 19066 | WHAT IS ACTUALLY STANDING BEHIND THE FIGHTERS | `drawShadow`, `drawCrowd`, `drawEmperorBox`, `drawVerdict`, `pixelText` |
| 19748 | AUDIO (tiny WebAudio blips, guarded) | `AC`, `noiseBuf` |
| 19753 | THE SOUND ENGINE | `MASTER`, `audioBus`, `revSend`, `blip`, `hiss`, `tone`, `noise`, `sfx` |
| 20142 | INPUT  (exact scheme required) | `held`, `edge`, `setEdge`, `consume`, `resetInputEdges`, `touchPref`, `touchCapable`, `coarsePointer` … +8 more |
| 20386 | MAIN LOOP | `state`, `last`, `loop`, `menuStars`, `drawMenuBg` |
| 20465 | ARMY BATTLE — army-vs-army (a different battle type, no 1v1) | `BT`, `armyBattle`, `updateBattle`, `drawBattleSoldier`, `drawBattleHorse`, `drawBattleHost`, `drawBattle`, `finishBattle` |
| 20627 | THE CIRCUS MAXIMUS — chariot racing, an entirely separate game. | `FACTIONS`, `RACER_NAMES`, `RACE_LAPS`, `LANE_Y`, `RC`, `startRace`, `aiRace`, `updateRace` … +5 more |
| 20793 | THE DAUGHTER'S PATH — THE COURTS. An heiress may refuse the sand and | `CASE_TYPES`, `ARGUMENTS`, `PATRONS`, `RIVAL_ADVOCATES`, `LANDMARKS` |
| 20838 | THE REGALIA — the visible instruments of power. Julia Domna, empress in | `REGALIA`, `hasRegalia`, `powerScore`, `CASE`, `caseDifficulty`, `startCase`, `renderCase`, `playArgument` … +5 more |
| 21107 | THE DOMINUS CONSOLE — cheats. Coin, glory, provinces, the purple. | `openCheats`, `CHEAT_TAB`, `CHEAT_TABS`, `cheatsTabify`, `openCircus` |
| 21440 | THE FAMILY PORTRAIT — the whole house, painted in one gold frame | — |
| 21445 | HIS FACE, ONCE, FOR EVERYONE WHO DRAWS HIM | `drawManFace`, `drawHusbandFig`, `drawKidFig`, `familyPortraitNew`, `openPortrait` |
| 21821 | THE BEDCHAMBER — an implied scene: she runs, the toga flies, the door | `BC`, `KANVEK_ONLY`, `startBedScene`, `updateWifeHappy`, `drawWifeHappy`, `rkFinOn`, `rkFinAt`, `startRkFin` … +7 more |
| 22099 | EXHAUSTION AND OVER-EXTENSION — the thing that actually broke Rome. | `CORE_PROVINCES`, `isCore`, `provReach`, `supplyCapacity`, `supplyLoad`, `overExtension`, `exhaustion`, `addExhaustion` … +3 more |
| 22184 | THE TITLES OF ROME — every honour the game can give you, in one | `TITLES`, `TITLE_BY_ID`, `titleName`, `titleIsMasculineOnHer`, `earnedTitles`, `titleSlots`, `equippedTitles`, `BOON_LABEL` … +4 more |
| 22371 | THE CONFERRING — a rank-8 honour is not a silent unlock. The Senate | `TITLE_RITES`, `titleRiteDue`, `maybeTitleRite`, `openTitleRite` |
| 22452 | THE INSCRIPTION — what goes on the stone. A Roman's tomb listed every | `fullTitulature`, `inscriptionHTML`, `inheritTitulature`, `drawTitleEmblem` |
| 22593 | THE HERBARIUS — a real Roman apothecary. Every plant here is one a | `HERBS`, `HERB_BY_ID`, `herbCount`, `herbAdd`, `herbUse` |
| 22630 | ILLNESS — Rome was a sickly place and the physicians knew it. Somebody | `ILLNESSES`, `rollIllness`, `illnessBite`, `curesIll`, `BIRTH_HERBS`, `birthHerbsReady`, `birthRisk`, `birthPrepLine` … +1 more |
| 22770 | AGEING — every ninth day the years take their cut. Under thirty a body | `upkeepScore`, `ageOneBody`, `ageBodies`, `partName`, `figureScore`, `selfStage`, `stageIndex`, `spouseFigureScore` … +1 more |
| 22893 | THE PROMISE YOU MADE | `promiseDaysLeft`, `promiseBroken`, `checkPromise`, `checkPromiseKept`, `conceiveChance`, `wifePregMonth`, `selfPregMonth`, `villaConceive` … +3 more |
| 23109 | THE DOORWAY, ON THE NEW BODIES — the prelude before the lamps go down | `BED_FIG_K`, `SIL_CV`, `drawSilhouette`, `silHer`, `silHim`, `silWalkHer`, `silDoorway`, `PRELUDE_STEP` … +9 more |
| 23404 | THE THEATRE AROUND THE SHADOW PLAY. The pool scene got a room dimmed to | `rkFinDrops`, `drawRkFin`, `drawShadowTheatre` |
| 23565 | MEDIUM — the exact opposite problem. The figures are now REAL BODIES in | — |
| 23623 | AND NOT EVERY COUNTRY IS DOING THE SAME THING — the pose lore | `POSE_LORE`, `rkPoseOrder`, `poseLore`, `poseName` |
| 23824 | THE ROOM SHE IS ACTUALLY IN | `HALL_PLAN`, `hallPlan` |
| 23883 | 🏛 THE BEDCHAMBER, PAINTED PROPERLY | `drawCubiculum`, `drawCubiculumFloor`, `drawLonghouseDressing`, `drawLonghouseFloor` |
| 24014 | 🏯 EVERY CULTURE'S BEDCHAMBER, PAINTED | `chCtx`, `chQuad`, `chPelt`, `CH_CACHE`, `CX`, `chLP`, `chLayer`, `chRand` … +29 more |
| 25231 | 🛏 THE BEDCHAMBER ON THE NEW BODIES — EVERY POSITION, REBUILT | `BEDPOSE_DRAWS`, `BED_UNDRESS` |
| 25253 | ✦ THE STAGES OF IT — and a quick one that actually has some in it | `BED_INTRO`, `bedBigV`, `bedBigSlow` |
| 25279 | 🔥 STAMINA — the bedroom's own stat | `STAMINA_MAX`, `KITCHEN`, `kitchenDish`, `trainTogether`, `selfStamina`, `spouseStamina`, `staminaOf`, `STAM_TIERS` … +17 more |
| 25978 | ◆ THE BREEDING HOUSE, AND THE HUB — KAN'S SECOND PAGE, WITH A ROOF ON IT | `RK_BREED_FEE`, `RK_BREED_POSES`, `RK_BREED_NAMES`, `rkBreedOn`, `rkPoorHouse`, `rkBreedLine`, `rkBreedKids`, `rkSendKidsToBreed` |
| 26043 | ◆ THE HUB IS A PLACE FOR IT — ON THE COAST, AND NOWHERE ELSE | `RK_HUB_DOOR`, `rkHubInHouse`, `rkPlaceOk`, `sanitizeBedPlace`, `rkBuildHub`, `nearHubDoor`, `rkHubPlotHere`, `nearHubPlot` … +23 more |
| 26549 | MEDIUM CENSORING. The whole scene used to be one flat silhouette colour, | — |
| 26612 | THE POSABLE CONCEPT MODEL | `drawStagePlate`, `drawTheaterEthnic`, `drawPoolPlace` |
| 28426 | THE SHALLOWS. Two silhouettes at the waterline — and they were the same two | `waterMetrics`, `drawWaterCouple` |
| 28634 | THE DOMUS — walk your own villa. A/D stroll · SPACE act · W invite. | `DM`, `openDomus`, `domusExit` |
| 28653 | THE HALL LIGHT — one key light, and every figure in the room answers to it | `HALL_LIGHT`, `_LITB`, `litBufs`, `_litEdge`, `LIT_ON`, `litFigure`, `litWife`, `litHusband` |
| 28786 | WHAT IS ON HER FACE | `WIFE_MOOD`, `SELF_MOOD`, `setSelfMood`, `selfMood`, `setWifeMood`, `wifeMood`, `wifeExpr`, `drawWifeFace` |
| 28961 | THE SEAT PROFILE — A CURVE, NOT A STAIRCASE | `SEAT_PEAK`, `seatWidthAt` |
| 28989 | 🍑 THE BEND, REBUILT | `BEND_OPT`, `BEND_CV`, `drawBendFig` |
| 29362 | 🧍‍♂️ HIM, IN PROFILE — AND THE TWO OF THEM TOGETHER | `vecKit`, `ik2`, `drawMateFig` |
| 29640 | 👩 HER, POSABLE — THE SAME BODY AS THE BEND, IN ANY POSITION | `femPregMonth`, `drawFemFig` |
| 29940 | ⚔ THE BODY TEMPLATE — THE WOOHOO'S FIGURES, EVERYWHERE | `NB_MAT`, `nbCol`, `nbLit`, `nbHem`, `nbTorsoPts`, `nbRow`, `nbLerp`, `NB_ARMOR` … +4 more |
| 30428 | ⚔ THE FIGHTER, ON THE NEW BODY | `NB_K`, `NB_BW`, `NB_DRAWS`, `nbOn`, `NB_TWO_HANDED`, `NB_HAIR`, `nbFighterLook`, `nbFighterPose` … +6 more |
| 30556 | 😬 FACES IN THE ARENA, WEAR ON THE KIT, SCARS ON THE BODY | `nbFightFaceId`, `nbHash`, `nbWearOf`, `nbWearAndScars`, `nbShieldCracks`, `drawGladiatorNB`, `nbDrawHeld` |
| 30716 | ⚔ AND EVERYWHERE ELSE THE OLD RIG WAS STILL STANDING | `NB_SOLDIER_CACHE`, `nbSoldierSprite`, `drawBattleSoldierNB`, `nbCardFighter`, `drawFallenNB`, `NB_WIFE_WAVE`, `drawStandsWifeNB`, `PAIR_CV` … +5 more |
| 30944 | 🚶 THE HALL WALKS ON THE SAME BODIES | `NB_HALL`, `NB_FACE`, `NB_DIST`, `HALL_WALK_MODES`, `nbHallOn`, `withFace`, `hallDressOf`, `hallGownKit` … +12 more |
| 31113 | 👁 THE PEEK — WHAT YOU WALK IN ON, AND THE MOMENT THEY SEE YOU | `peekLinen`, `drawPeekBed`, `drawPeekLow`, `drawPeekTableau` |
| 31349 | ❦ HER FACE — ROLLED PER SCENE, THE SAME WAY HIS IS | `HER_ROLL`, `herFaceWeights`, `herFace`, `reactExpr`, `pairHimLook`, `drawWifeFig` |
| 31438 | THE BEND. She is TEMPTING, and every so often there is something on the | — |
| 31598 | THE SIVRAK. Not a cut of the ulvik — a different object entirely. | — |
| 31647 | THE ULVIK — the indoor dress, and it is a different problem from a | `drawSteamVeil`, `drawBareFig`, `drawUndressedFig`, `playerLook`, `drawDomusPlayer` |
| 32284 | 🗣 THE NAMES, NEAR HER — AND THEIR LITTLE PICTURES | `TITLE_EMOJI`, `TITLE_EMOJI_HOUSE`, `titleEmojiKind`, `drawTitleEmoji` |
| 32672 | 🖼 AND THE SAME PICTURES OFF THE CANVAS — on the village board, the street, | `TITLE_EMOJI_LIVE`, `titleEmojiTag`, `titleEmojiPaint`, `titleEmojiTick`, `titleEmojiMount`, `titleByName`, `toastTitle` |
| 32718 | 🖋 THE OUTLINE — every picture is laid down on a dark one-pixel rim, the | `TEMOJI_W`, `TEMOJI_RAW`, `titleEmojiOutlined` |
| 32736 | ✨ THE TITLES MOVE TOO — each name's letters move the way its picture | `TITLE_TEXT_FX`, `titleTextFxOf`, `mixRGB`, `titleFxExtra`, `pixelTextFx`, `titleNameHTML`, `titleNameEl`, `nameRun` … +8 more |
| 33139 | THE WALK, OUT LOUD | `wifeWalkSound`, `WALK_QUIP`, `updateDomusScene` |
| 33227 | TEMPTING — THE LOW SHELF | `TEMPT_NEED` |
| 33248 | THE DROP — her side of the same room | `DROP_PROPS`, `DROP_NEED`, `DROP_LOOKS` |
| 33291 | ONE ANSWER TO "IS THE HALL BUSY?" | `HALL_BEATS`, `hallBusy`, `HALL_BEAT_NAMES`, `hallBusyWhy` |
| 33350 | 👀 GREEDY — WHERE THE EYES GO | `GAZE_COOL`, `gazeKindsOf`, `gazeReady`, `gazeDue`, `startGaze`, `GAZE_LINES`, `gazeTarget`, `updateGaze` … +14 more |
| 33730 | HE DID NOT LOOK UP | `openIgnoredCard` |
| 33772 | HIS OWN IDEA | `beckonHusband` |
| 33797 | AN ACTUAL HAND | `drawSlapArm`, `husbandMoveDue`, `startHusbandMove` |
| 33855 | HIM ASKING, AND YOU ANSWERING | `updateBendAsk`, `drawBendAsk`, `updateHusbandMove`, `drawHusbandMoveNB`, `drawHusbandMove` |
| 34008 | THE JIGGLE, AND THE ELBOW — drawn, not nudged | `drawElbowOver` |
| 34053 | REACTION FACES | `figHeadBox`, `REACT_FACES`, `reactKindFor`, `drawReactFace`, `drawSlapAfter`, `startRefusal`, `updateRefusal`, `drawRefusal` |
| 34217 | THE RISE  —  🏛 PRIAPIC, and what a woman does about it | `RISE_STAGES`, `RISE_LINES` |
| 34247 | 🏛 GET HARD, IN THE HALL — drawn FRONT-ON, because he is. | `pxLengthUp`, `drawTunicBump`, `riseDue`, `startRise`, `RISE_NEED`, `updateRise`, `drawRise` |
| 34456 | THE ARDOR — his half of it, and the only half you drive yourself | `ARDOR_LINES`, `ARDOR_HOLD`, `ardorLen`, `ardorNeed`, `ardorDrain`, `ardorReady`, `ardorAvailableNow` |
| 34506 | THE PRESS, ON THE FLOOR OF THE HALL | — |
| 34523 | THE CURIOUS ONE — and the whole beat is that it is not aimed at you | `RK_CURIO`, `curioOn`, `curioReady`, `curioDue`, `startCurio`, `curioMenu`, `curioTake`, `curioResolve` … +1 more |
| 34724 | 🐚 THE CLAM | — |
| 34744 | 💬 SHE SAYS SOMETHING ABOUT YOU | `RK_PRAISE`, `praiseRegister`, `praiseLine`, `RK_HIS_PRAISE`, `hisPraisePool`, `praiseReady`, `praisePool`, `praiseDue` … +6 more |
| 35115 | ⌘ THE ACTION TABLET — the villa's own console | `TABLET_FACES`, `TABLET_FACE_NAMES`, `tabletFaceName`, `TABLET_FACE_LINES`, `FACE_PREV`, `renderFacePreview`, `drawFacePreview`, `tabletFaceApply` … +3 more |
| 35258 | ⌘ THE TABLET, ON TABS — "the command table in the villa is packed and I | `TABLET_TABS`, `tabletTabs`, `tabletMove`, `tabletFireSel`, `_tabSig`, `syncTabletPanel`, `updateTablet`, `drawTabletFaces` … +18 more |
| 36095 | THE PRESS PAIR — two sprites built for one pose | `rkBackBones`, `drawRkBack`, `drawRkBehindHim` |
| 36357 | THE CURIOUS ONE, DRAWN | `drawCurio` |
| 36430 | WHAT THE RUNG LOOKS LIKE. Each one lands over the first stretch of | `drawRkPress`, `tryArdor`, `ardorFav`, `ardorSpots`, `updateArdor`, `ardorResolve`, `drawArdor` |
| 36847 | THE MARKER — a hand-drawn prompt over your own head, not an emoji. | `ardorBlockedWhy`, `drawArdorIcon`, `drawDrop`, `temptDue`, `TEMPT_PROPS` |
| 37126 | THE BEND, ON A COAST THAT DOES NOT PRETEND | `RK_BEND_NEED`, `RK_BEND_LINES`, `rkBendBeat`, `startTempt`, `updateTempt` |
| 37302 | THE VILLA'S OWN WOOHOO — fifteen seconds, in the room you are standing in | `VILLALOVE_LEN` |
| 37318 | 🔺 THE ESCALATORS — AND IT HAPPENS IN THE HALL | `ESC_IDS`, `ESC_NAME`, `ESC_LINES`, `ESC_DONE`, `escTraitsOf`, `escWhoMale`, `escSay`, `escAfterSlap` … +9 more |
| 37595 | 2 · CAUGHT | `CAUGHT_LINES`, `rollWalkIn`, `fireWalkIn`, `startVillaLove`, `villaLoveFinish`, `updateVillaLove` |
| 37717 | HIM, IN FOUR STAGES | — |
| 37728 | THE SLAP | — |
| 37738 | WHAT THIS PEOPLE THINKS OF A HAND ON HER, AND WHERE | `HAND_ON_HER` |
| 37863 | AND HOW SHE ACTUALLY ANSWERS | `SLAP_REPLY`, `handOnHer`, `slapReply`, `slapExposure`, `slapVerdict`, `slapCap`, `slapExpect`, `slapToday` … +3 more |
| 38024 | ✧ "COME HERE" — SHE STARTS IT, AND IT IS FOR SOMETHING | `RK_REWARD`, `RK_REWARD_PLAIN`, `rkRewardCause`, `rkRewardClaim`, `rkRewardDue`, `startRkReward`, `updateRkReward`, `drawRkReward` |
| 38209 | ◇ THE URVAAK — LETTING IT OUT, AND WHAT THE ROOM IS SUPPOSED TO DO | `RK_LETOUT`, `letoutMeasure`, `letoutTier`, `letoutWhy`, `letoutReady`, `letoutLeft`, `letoutRead`, `tryLetout` … +8 more |
| 38581 | WHO IS IN THE ROOM | `BABY_YEARS`, `kidsPresent`, `villaClear`, `privacyTier` |
| 38619 | WHAT MONEY ACTUALLY BUYS YOU | `houseWealth`, `DISCRETION`, `discretionTier`, `watchersRaw`, `watchersPresent`, `watchersAbsorbed`, `houseIsWatching`, `privacyNeeded` … +4 more |
| 38735 | THE ROMANTIC ONE | — |
| 38748 | THE ROMANTIC SLAP, IN EVERY LANGUAGE IT HAPPENS IN | `SLAP_CRACK`, `slapCrack`, `ROMANTIC_REPLY`, `romanticReply`, `romanticVerdict`, `romanticSelf` |
| 38913 | “BEND HERE.” | `askToBend`, `BEND_ASK`, `bendAskLines`, `startRomantic` |
| 38992 | AND THE ROMANTIC ONE GETS THE SAME REWORK — with its own character | `updateRomantic` |
| 39063 | HER SPRITE FOR THIS ONE | — |
| 39074 | HOW SHE BENDS, AND WHETHER SHE BENDS AT ALL | `ROMANTIC_BEND`, `romanticBend`, `BEND_WORD`, `romanticBendWord`, `drawBendBrace` |
| 39209 | AND A HUSBAND BENDS TOO | `drawRomanticFig`, `drawRomanticFem`, `drawRomanticMale`, `drawRomantic` |
| 39515 | THE SWING | `STRIKES`, `romanticSwing` |
| 39546 | THE SLAP, REBUILT — the four beats an animator would actually give it | `SLAP_T`, `SLAP_ANG`, `SLAP_PIV`, `slapAng`, `slapArmVis`, `slapHand`, `hallShake`, `kickShake` … +9 more |
| 40097 | 🍑 THE TEMPT, ON THE NEW FIGURES — THE WHOLE WAY THROUGH | — |
| 40110 | 🧊 HOW HE HOLDS OUT — and it is not a bar, it is a man | `RESIST_STYLES`, `RESIST_ORDER`, `resistMan`, `resistStyleOf`, `resistTells`, `temptHimPose`, `drawTemptFigures`, `drawTempt` … +1 more |
| 40443 | THE LONGHOUSE IN THE CLEARING | `hallProvince`, `hallStyle`, `drawForestShell` |
| 40593 | FOUR MORE HALLS — because only two of the seven were ever drawn | `drawCourtyardShell`, `drawPlankShell` |
| 40672 | THE RKRAI PLANK HOUSE | `drawGerShell`, `drawShoinShell`, `drawPillaredShell`, `drawDomus`, `drawDomusInner` |
| 40942 | THE HOUSE | — |
| 41628 | META SCREENS WIRING | `openSlots`, `refreshAdultBtn`, `prevHelp`, `settingsFrom` |
| 41683 | 🤖 THE THREE BOTS — "make 3 bots in the settings, record their | `BOT_KEY`, `BOTS`, `BOT_ORDER`, `BOT_LINES`, `BOT_VENUES`, `botLoad`, `botSaveAll`, `botTrim` … +37 more |
| 42542 | A FOURTH COAST, IF YOU ASK PROPERLY | — |
| 42577 | THE WOOHOO GUIDE | `woohooFrom`, `openWoohooGuide`, `closeWoohooGuide`, `WOOHOO_GUIDE`, `buildWoohooGuide`, `refreshSettings`, `openStats`, `buildStats` … +1 more |
| 42713 | THE ROLL AT THE ENROLMENT TABLE — before the oath you roll for the body | `IMPOSSIBLE_CHANCE`, `rollHiddenPotential`, `rollCreation`, `rollBanner`, `STAT_COL` |
| 42786 | HOW HIGH UP THE LADDER THAT RUNG IS, 0..1 | `rungFrac` |
| 42804 | AND WHETHER A WOMAN IN THIS CAREER IS DRAWN CARRYING ARMS | `womanBearsArms`, `womanArmsNote`, `drawCardPortrait` |
| 42888 | A WOMAN WHO IS NOT A FIGHTER, DRESSED BY HER RUNG AND HER PEOPLE | `drawBrideCut` |
| 43893 | 📸 THE PORTRAITS, ON THE NEW BODIES | `FRONT_GARMENTS`, `OUTFIT_GARMENT`, `PORTRAIT_GARMENT_F`, `PORTRAIT_GARMENT_M`, `portraitDressInfo`, `PORTRAIT_POSES_F`, `PORTRAIT_POSES_M`, `PORTRAIT_POSE_NAMES` … +8 more |
| 44568 | AND THEN HER PEOPLE'S ACTUAL CUT GOES OVER THE TOP OF IT | `openCreate` |
| 45007 | AND THE OATH BUTTON IS SET FROM THE TRUTH, ONCE, AT THE END | — |
| 45061 | WHERE YOU ACTUALLY WAKE UP | — |
| 45111 | THE SILK ROAD — the eastern game's own economy, and its own history | `SILK_LEGS`, `silkLeg`, `silkOpen`, `SILK_STAKE_CAP`, `silkStake`, `silkOdds`, `silkRun` |
| 45219 | THE MARKET — 楽市楽座, AND WHY IT WAS A WEAPON | `COIN_GRADES`, `MARKET_RULES`, `MARKET_OF`, `marketHere`, `ensurePurse`, `purseFace`, `purseHere`, `erizeniQuote` … +1 more |
| 45356 | THE NANBAN TRADE — silver out, silk in, and one ship a year | `NANBAN_GOODS`, `NANBAN_PORTS`, `nanbanHere`, `kurofuneIn`, `kurofuneDays`, `pancadaMul`, `nanbanBuy`, `nanbanSell` |
| 45436 | THE FIVE TRADITIONS — 五箇伝, AND A BLADE IS NOT A BLADE | `GOKADEN`, `gokaden`, `BLADED_WA`, `bladeSchoolOf`, `bladeIsSchooled`, `TAMESHI`, `tameshiDone`, `ensureBlade` … +1 more |
| 45509 | THE SWORDSMITH — pick a tradition, then prove the blade | `openSmith` |
| 45617 | THE POWDER SUPPLY — and it is a foreign policy problem | `POWDER_SRC`, `powderSourcesHere`, `POWDER_MAX`, `powderHave`, `buyPowder` |
| 45670 | THE PORT — how a man with no name and no land gets rich | `VENTURES`, `ventureOpen`, `ventureStake`, `ventureOdds`, `runVenture` |
| 45734 | THE STANDARDS — what you may and may not do here, said plainly | `standardsHere` |
| 45770 | THE TEN AND THE RKRAUN — one screen that holds the whole coast | — |
| 45780 | ✎ THE SELVSKAR — THE ONE SHE CUTS HERSELF | `RK_SELVSKAR`, `RK_SELV_WHY`, `RK_SELV_SUBJ`, `selvskarOn`, `selvskarWaiting`, `selvskarWhy`, `selvskarArrive`, `selvskarPoll` |
| 45885 | THE PLATE, AND IT IS NOT A PAID HAND'S | `SELV_ANIM`, `selvskarFigure`, `drawSelvskar`, `selvskarMarks` |
| 46023 | A REAL ONE, NOT A CARTOON ONE | `selvskarDome`, `selvskarBlob`, `selvskarTrail`, `selvskarSplashStart`, `selvskarSplash` |
| 46245 | THE SCREEN | `SELV_RAF`, `selvskarStopAnim`, `openSelvskar`, `RK_SELV_BACK`, `selvskarDo`, `selvskarPutAway` |
| 46369 | ⛵ THE UVRAAK — THE GOING-OVER | `RK_UVRAAK`, `RK_CROSS_SEASONS`, `RK_CROSS_WINDOW`, `rkCrossDay`, `rkCrossSeason`, `rkCrossNextSeason` |
| 46435 | THE SEVEN HOLDS | `RK_HOLDS`, `rkHoldById` |
| 46515 | 🗺 THE STRAIT PLATE — this coast's own sheet | `RK_COAST_W`, `RK_COAST_W_END`, `RK_COAST_E`, `RK_COAST_E_END`, `RK_PIN_LAB`, `drawStraitMap`, `rkStraitHit`, `rkCrossOn` … +4 more |
| 46901 | ⚖ THE LOOK-OVER — your power against theirs, itemised | `rkPowerRows`, `rkPower`, `rkHoldRows`, `rkHoldPower`, `rkHoldWaves`, `rkVerdict`, `rkLookOver` |
| 46975 | 📣 THE VOICE'S CRIERS — and which of them is lying | `RK_CRIER`, `rkCrierById`, `rkCrierNow`, `rkCrierCall`, `rkCrierResolve` |
| 47122 | TAKING ONE | `rkHoldTake`, `rkCrossSettle`, `rkCrossIncome`, `rkCrossPhase` |
| 47210 | ⚔ THE SKARVEK — the coast's other ladder | `RK_WAR_RANKS`, `rkWarScore`, `rkWarRank`, `rkWarNext`, `rkWarOn`, `rkExpectLen`, `rkExpectGap`, `rkExpectLine` … +11 more |
| 47367 | ✇ THE RAUNSKAR — the coast's likeness trade | `RK_RAUNSKAR`, `RK_ART_HANDS`, `RK_ART_FORMS`, `RK_ART_POSES`, `RK_ART_DRESS`, `RK_ART_REFUSED`, `RK_ART_FACE`, `RK_ART_FRAME` … +18 more |
| 47929 | ⛵ THE SCREEN — the plate, the look-over, and the criers | `rkCrossSel` |
| 47937 | ◈ THE SEATING — the screen the Ten do it on | `openSeating`, `openUvraak`, `openRaunskar`, `raunskarOffers`, `raunskarBench`, `raunskarHouse`, `openTheTen`, `openStandards` |
| 49090 | YOUR OWN HOUSE — a name, a crest, a colour, and a banner over it | `MON_CHOICES`, `CLAN_COLS`, `waHouseName`, `canFoundHouse`, `foundHouse`, `openFoundHouse`, `openMarket`, `openSilk` |
| 49542 | THE HUB IS NOT THE SAME HUB | `HUB_EAST`, `HUB_WA`, `HUB_WEST_LABEL`, `HUB_RK`, `applyHub`, `enterMap`, `regionUnlocked`, `imperialAvailable` … +16 more |
| 50261 | THE BARBER AND THE CLOTHIER — you had eight cuts, five beards, seven | `outfitAllowed`, `outfitLockNote`, `barberCost`, `clothierCost`, `buildBarberCard`, `buildLegacyCard`, `buildSuccessionCard`, `succession` |
| 50552 | THE SON'S PATH — THE LEGIONS. An heir may refuse the sand and take a | — |
| 50557 | THE ARMY IN DEPTH — a legion is not a number. It is cohorts of specific | `UNIT_TYPES`, `unitCount`, `armySize`, `armyUpkeep`, `armyPowerDetail`, `supplyState`, `FORTRESSES`, `MIL_RANKS` … +14 more |
| 50878 | THE FAMILY TREE, IN FOUR REGISTERS | `TREE_TAB`, `treeTabs`, `openTree` |
| 51281 | ⚭ THE NOBLE TREE — WHO YOU ARE RELATED TO BY CONTRACT | `nobleHouses`, `treeNoble` |
| 51448 | 🏛 THE GOVERNOR'S TREE — WHAT YOU ADMINISTER | `treeGovernor`, `openTitles`, `herbBack`, `openHerbs` |
| 51644 | PROVINCIAL MANAGEMENT — tax, garrison, grain, governors and unrest, | `openProvinces` |
| 51770 | THE NIGHT THEY COME FOR THE PURPLE — when RISK TO THE PURPLE runs hot | `coupDue`, `maybeCoup`, `openCoup` |
| 51882 | CALL-OUTS — Rome says what it thinks of you, out loud, in the street. | `maybeCallout` |
| 51887 | SHE ASKS FIRST | `FESTIVALS`, `festivalToday`, `anWord`, `spouseExcuse`, `SPOUSE_ASKS`, `quirkAside`, `spouseAskDue`, `maybeSpouseAsk` |
| 52063 | THE CHILDREN, ONCE THEY ARE PEOPLE | `kidAgeYears`, `kidBand`, `livingKids` |
| 52082 | HOW BIG A CHILD IS DRAWN | `kidDrawScale`, `grownLook`, `kidLook`, `drawKidProfile`, `drawChildFigure`, `kidsOfBand`, `kidName`, `kidHe` … +3 more |
| 52186 | THE SUITOR HALL — marrying off a grown child | `SUITOR_HOUSES`, `SUITOR_STYLE`, `RK_SUITOR_STYLE`, `EAST_SUITOR_STYLE`, `WA_SUITOR_STYLE`, `suitorStyleList`, `suitorRank`, `makeSuitorFor` … +1 more |
| 52359 | WHAT THE DISTRICT CALLS THEM | `ARD_TITLES`, `KID_TITLES`, `pickTitle`, `bedTitle`, `ARD_WINDOW`, `myArdRate`, `myBedTitle` |
| 52418 | THE ESCORT — he takes her to the room, and HOW he does it is the whole | `ESCORT_POSES`, `escortPoseFor`, `escortPose`, `coupleLooks`, `drawCarriedFem`, `ESCORT_WIFE_DX`, `maybeArmSwat`, `drawArmSwat` … +3 more |
| 52747 | THE HOUSE GROWS WITH THE ESTATE | — |
| 52760 | THE HOUSE IS NOT A DOMUS EVERYWHERE | `HOUSE_SETS`, `houseSetId`, `houseSet`, `HOUSE_TIERS`, `houseTier`, `hasRoom`, `SECTION_X` |
| 52931 | THE SECTIONS THEMSELVES | `drawCulina`, `drawTriclinium`, `drawPeristyle`, `drawLararium`, `drawHouseSections`, `DOMUS_UPPER`, `STAIR_X0`, `STAIR_X1` … +21 more |
| 53399 | THE ONE LOOK | `peekKey`, `peekUsed`, `markPeeked`, `PEEK_ROOM`, `PEEK_STAGE` |
| 53434 | THEY ARE NOT IN THE SAME STATE AS EACH OTHER | `HEAT_HIM`, `HEAT_HER` |
| 53450 | AND WHAT THEY WERE ACTUALLY DOING | `PEEK_ACTS`, `PEEK_ACT_MAP`, `peekActWeight`, `peekAct`, `peekHeat`, `PEEK_REACT`, `peekReactFor`, `startPeek` … +17 more |
| 53982 | GRAVITAS  —  THE FACE YOU WEAR OUTSIDE THE DOOR | `gravitasRaw`, `gravitas`, `setGravitas`, `GRAVITAS_TIERS`, `gravitasTier`, `gravitasHit`, `gravitasTick` |
| 54082 | THE MARRIAGE LEDGER  —  standing, favours, feuds, and grandchildren | `inlawStanding`, `setStanding`, `standingLabel`, `FEUD_LINES`, `feudsList`, `feudOn`, `addFeud`, `feudHeat` … +3 more |
| 54168 | 11 · WHAT THE IN-LAWS ARE ACTUALLY LIKE | `INLAW_TRAIT_FX`, `INLAW_FLAW_FX`, `inlawTraitsOf`, `inlawFlawsOf`, `favourSurcharge`, `inlawTick` |
| 54271 | TEACHING THEM THE FACE | `kidDecorum`, `setDecorum`, `DECORUM_TIERS`, `decorumTier`, `DECORUM_DRILL`, `teachableKids`, `teachDecorum`, `KID_BLURTS` … +3 more |
| 54395 | 1 · THE MORNING AFTER   ·   4 · THE ANNIVERSARY | `MORNING_WARM`, `MORNING_COOL`, `morningDue`, `morningCard`, `annivYears`, `annivDue`, `annivCard` |
| 54504 | WHO IS IN WHICH ROOM | `HOUSE_ROOMS`, `adultCouple`, `roomsOccupiedToday`, `roomOccupant`, `placeMenuUp` |
| 54561 | THE DOOR — AND IT IS NOT THE SAME DOOR IN EVERY HOUSE | `DOOR_PLAN`, `doorPlan`, `drawDoorLamp`, `drawHallExit`, `drawDoor`, `houseGuestBusy`, `suitorsAvailable`, `makeCheatSuitor` … +3 more |
| 55284 | 14 · HAGGLING THE DOWRY | `haggleLeverage`, `HAGGLE_POSTURES`, `openHaggle`, `openWeddingChoice`, `buildSuitorCard` |
| 55419 | THE FACE, AND TEACHING IT — the villa's own card for both | `buildGravitasCard` |
| 55469 | TAKING THE KING'S SALT | `inParthia`, `buildParthiaCard` |
| 55512 | THE LAW OF THIS PLACE — the card that tells you what you are living under | — |
| 55520 | THE CHOICE — and it prints the price BEFORE you take it | `buildEastActCard`, `buildActCard`, `buildMoresCard`, `buildDiscretionCard` |
| 55702 | 13 · GOING TO SEE YOUR DAUGHTER | `visitableKids`, `VISIT_SCENES`, `buildVisitCard`, `buildFeudCard`, `buildKidHousesCard`, `FAMILY_EVENTS`, `familyDue`, `maybeFamily` … +6 more |
| 56256 | THE GROOM'S PLATE — the same painted alcove her portrait gets, and HIS | `drawGroomPortrait`, `portraitPosePick`, `briadeImg`, `marriageEffectsText`, `LOVE_CAP`, `bedLen`, `loveLeft`, `spendLove` … +3 more |
| 56361 | JEALOUSY — she notices. Neglect, other women, and a wandering | `jealousyLevel`, `jealousyLabel`, `addJealousy`, `easeJealousy`, `jealousyEffects`, `jealousyBlocksBed` |
| 56405 | THE TABULA — a wax-tablet note home, ancient texting. Her reply is | `NOTE_PRESETS`, `NOTE_WORDS`, `noteSentiment`, `noteBaseTier`, `NOTE_REPLIES`, `NOTE_AFTERGLOW`, `NOTE_APOLOGY_SOFT`, `NOTE_QUESTION` … +46 more |
| 57920 | PROVINCE TERRITORIES — every playable region as an actual shape on the | `PROV_SHAPES`, `PROV_SEAMS`, `lonlat` |
| 57969 | THE EASTERN WORLD, c. 200 A.D. | `MAP_EAST_PROJ`, `lonlatE`, `eastXY`, `REGIONS_EAST` |
| 58049 | TWELVE MORE, BECAUSE TWENTY-TWO WAS NOT ASIA | `REGION_EAST_BY_ID` |
| 58092 | THE RKRAI SHORE — an invented people, held to internal consistency | — |
| 58124 | THE BORDER, AND IT IS NOT AN ISLAND | `MAP_RK_PROJ`, `rkLonX`, `rkLL`, `rkXY`, `RK_LAND_CHUK`, `RK_LAND_AK`, `RK_ISLES`, `RK_PROV_SHAPES` … +6 more |
| 58262 | THE MASTERIES — the Rkrai theology, and it is a civil service | `RK_MASTERIES`, `RK_MASTERY_BY_ID` |
| 58337 | AND THE LADDER, WHICH IS WRITTEN DOWN | `RK_RANKS` |
| 58351 | AND WHO IS ACTUALLY IN CHARGE — THE RKRAUN | `RK_GOVERN`, `rkHead`, `rkHere` |
| 58393 | THE ULVIK — WHAT SHE WEARS INDOORS, AND WHY IT IS A DIFFERENT GARMENT | `RK_HOUSE` |
| 58423 | AND IT IS CUT FOR THE OFFICE, WHICH IS THE ENTIRE POINT OF IT | `RK_CUTS`, `rkCut` |
| 58483 | AND THE MEN'S SEVEN, BECAUSE A BODY IS A BODY | `RK_CUTS_M`, `rkCutM`, `rkCutMWhy`, `rkStandShow`, `rkHouseKilt` |
| 58587 | THE TAQRUN STANDING — AND THE EXACT MIRROR OF THE READING | `RK_TAQRUN`, `rkTaqrunSeated`, `rkTaqrunWhose`, `rkStandOn`, `rkStandOk`, `rkStand`, `rkTaqrunDuty`, `rkWifeExcuse` … +4 more |
| 58752 | THE PRESS — the answer to a standing, and it is its own act | `RK_PRESS`, `rkPressTier`, `rkPressOk`, `rkPressDo` |
| 58869 | AND A SEATING IS NOT ONLY A NUMBER | `RK_SEAT_COND`, `rkSeatCond`, `rkSeatConsentWho`, `rkSeatKey`, `rkSeatAsked`, `rkSeatConsent`, `RK_SEAT_ASK`, `rkSeatAskVerdict` … +4 more |
| 59041 | THE SIX LOOKS-TITLES, AND YOU NEED THE LOOKS | `RK_WIFE_TITLES`, `RK_WIFE_TITLE_BY_ID` |
| 59107 | AND THE SIX WOMEN WHO CURRENTLY HOLD THEM | `RK_TITLED_WIVES`, `RK_TITLED_BY_ID`, `makeRkTitledWife`, `rkTitledOffered`, `RK_EARNED_TITLES`, `RK_WORK_TITLES`, `RK_WORK_BY_ID`, `rkIsWorkSeat` … +11 more |
| 59380 | AND THE MEN'S SIDE OF THE REACH, WHICH IS MEASURED | `RK_TAQRUN_NEED`, `rkTaqrunClaim`, `rkTaqrunSeated` |
| 59404 | THE READING — AND ON THIS COAST, NOT LOOKING IS THE RUDE THING | `RK_READ`, `rkReadOn`, `rkHeldVerdict` |
| 59468 | THE SIVRAK — GREEN THAT CAME THROUGH THE STEELYARD AND DID NOT GO ON | `RK_SIVRAK`, `rkBestPart`, `RK_SIVRAK_FRAME`, `RK_SIVRAK_FRAME_M`, `rkSivrakFrame`, `rkSivrakFrameM`, `rkSivrakOn`, `rkSivrakBuilt` … +6 more |
| 59652 | ❦ THE JUNGLE SUIT, CHOSEN — "in the Rkrai give the option to wear it." | `rkSivrakCan`, `rkSivrakToday`, `rkSivrakHas`, `rkSivrakAdd`, `rkSivrakWill`, `sivrakSelf`, `sivrakSpouse`, `sivrakLeaf` |
| 59723 | THE FOUR PROVINCES AND THE CAPITAL, WHICH YOU CAN COME TO HOLD | `RK_PROVINCES`, `RK_PROV_BY_ID`, `rkProvHeld`, `rkProvList`, `rkProvSeatOk`, `rkProvClaim`, `rkProvTake`, `rkProvYield` … +1 more |
| 59820 | AND THE MEN'S SIX, WHICH ARE THE SAME SIX MASTERIES READ OFF A MAN | `RK_HUSB_TITLES`, `RK_HUSB_TITLE_BY_ID` |
| 59887 | TWELVE SEATS, AND SOMEBODY IS ALREADY SITTING IN EVERY ONE OF THEM | `RK_SEAT_FOLK`, `RK_SEATING_FEE`, `rkSeats`, `rkSeatSubject`, `rkMeasure`, `rkSeatTitle`, `rkSeatClaim`, `rkSeatTake` … +4 more |
| 60056 | HOW THE RKRAI MARRY THEIR CHILDREN, WHICH IS NOT HOW ANYBODY ELSE ON | `RK_COURT`, `rkAgeVerdict`, `rkMotherRead`, `rkCallerCount` |
| 60139 | THE THIRD SHEET — WA, AND THE CROSSING THAT COST THIRTEEN CENTURIES | — |
| 60161 | THE PROJECTION — and why this sheet is turned on its side | `MAP_WA_PROJ`, `lonlatW`, `waXY`, `REGIONS_WA`, `REGION_WA_BY_ID` |
| 60279 | THE CLANS — 1543-1590, AND WHY THE MAP IS A PATCHWORK | `CLANS_WA`, `CLAN_OF_WA`, `clanOf`, `clanIdOf`, `clanHolds` |
| 60365 | THE MON — the crest, drawn rather than lettered | `drawMon`, `WA_REFUSAL`, `regionBlocked`, `refuseBlocked` |
| 60527 | THE CROSSING — and what it costs is not money | `CROSS_PORTS`, `canAttemptCrossing`, `crossingBlockReason`, `CROSSING_LOG`, `CROSSING_ARRIVAL`, `beginCrossing`, `openCrossing`, `openCrossingLog` |
| 60664 | THE EASTERN SHEET — drawn from real coastlines, like the western one | `drawMapCanvasEast` |
| 60900 | THE WA SHEET — Honshū, Kyūshū, Shikoku, from real coastlines | — |
| 60917 | THE COASTLINE — traced, not blocked out | `WA_HONSHU`, `WA_KYUSHU`, `WA_SHIKOKU`, `WA_EZO` |
| 60994 | AND THE ISLANDS, which are not decoration in this century | `WA_ISLES` |
| 61023 | THE PATCHWORK — territory by colour, and a border where houses meet | `_waTerrBuf`, `waTerritory`, `WA_CREST_AT`, `drawWaCrests` |
| 61153 | WHERE THE LABELS GO — six seats inside two degrees | `WA_PIN_POS`, `layoutWaPins`, `drawWaLeaders` |
| 61217 | THE RKRAI SHORE, DRAWN | — |
| 61230 | THE RKRAI SHEET — CHUKOTKA, ALASKA, AND THE STRAIT BETWEEN THEM | `drawMapCanvasRk`, `drawMapCanvasWa`, `agePlateWa` |
| 61685 | THE PLATE — what makes a map look like a MAP of its own century | `agePlate`, `coastHatch`, `drawMapLegend`, `drawCompass`, `drawScaleBar`, `drawMapCanvas`, `briefCtx`, `tierName` … +1 more |
| 62486 | THE LANISTA'S CELLS — pay the fee, then pick your man | `openRigPick`, `shopTab` |
| 62569 | THE RANGED RACK, DRAWN — every one of these was an emoji | `drawRangedIcon`, `drawGearIcon`, `gearIconImg`, `openShop` |
| 63638 | THE LUDUS — drilled skills, real wounds, and a body that wears out. | `SKILLS`, `skillLvl`, `skillCost` |
| 63650 | THE BODY, WHICH YOU COULD NOT TRAIN | `BODYSKILLS`, `BODYSKILL_NAME`, `bodySkillNames`, `bodyLvl`, `BODYSKILL_MAX`, `bodyCost`, `bodyHpBonus`, `bodyMitBonus` … +4 more |
| 63729 | SCARS — THE ARENA'S PRICE, AND IT IS PAID ON THE SKIN. A wound that closes | `scarZoneOf`, `addScar`, `scarName`, `scarList`, `scarCount`, `drawScarsOn` |
| 63774 | AN ICON FOR EACH, DRAWN | `drawBodySkillIcon`, `staminaCost`, `trainScreen` |
| 63961 | BOOT | — |
| 63968 | PIXEL LOGO — "SAND ⛑ STEEL" on riveted crimson planks + favicon | `LOGO_F`, `LOGO_HELM`, `drawLogoHelm`, `drawLogo` |
