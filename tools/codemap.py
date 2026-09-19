#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Regenerate CODEMAP.md from index.html.

index.html is one file on purpose — no build step, no dependencies, no external
assets — so the way to navigate it is an index, not a directory tree. This walks
the section banners (/* ===== TITLE ===== */) and the top-level definitions under
each one and writes the table out.

    python3 tools/codemap.py
"""
import io, re, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC  = os.path.join(ROOT, 'index.html')
OUT  = os.path.join(ROOT, 'CODEMAP.md')

HEAD = """# CODE MAP — SAND & STEEL

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

"""

def main():
    src = io.open(SRC, encoding='utf-8').read().split('\n')
    secs = []
    for i, l in enumerate(src):
        if re.match(r'^\s*/\* ={20,}\s*$', l):
            for j in range(i + 1, min(i + 4, len(src))):
                t = src[j].strip()
                if t and not t.startswith('---'):
                    secs.append((i + 1, t))
                    break
    defs = []
    for i, l in enumerate(src):
        m = re.match(r'^(?:function|const|let)\s+([A-Za-z_$][\w$]*)', l)
        if m:
            defs.append((i + 1, m.group(1)))

    def sec_of(ln):
        lo = None
        for n, t in secs:
            if n <= ln:
                lo = (n, t)
            else:
                break
        return lo

    buckets = {}
    for ln, name in defs:
        k = sec_of(ln) or (0, 'PROLOGUE')
        buckets.setdefault(k, []).append(name)

    out = [HEAD, '| line | section | what it defines |\n|---:|---|---|\n']
    for key in secs:
        names = buckets.get(key, [])
        shown = ', '.join('`%s`' % x for x in names[:8])
        if len(names) > 8:
            shown += ' … +%d more' % (len(names) - 8)
        out.append('| %d | %s | %s |\n' % (key[0], key[1].replace('|', '\\|'), shown or '—'))
    io.open(OUT, 'w', encoding='utf-8').write(''.join(out))
    print('CODEMAP.md — %d sections, %d definitions' % (len(secs), len(defs)))

if __name__ == '__main__':
    main()
