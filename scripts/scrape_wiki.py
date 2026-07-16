#!/usr/bin/env python3
"""Scrapes Clash of Critters wiki for Tatari evolution lines. Writes data/evolutions.json"""

from __future__ import annotations

import json
import re
import time
import urllib.parse
import urllib.request
from pathlib import Path

API = "https://clashofcritters.wiki.gg/api.php"
OUT = Path(__file__).resolve().parent.parent / "data" / "evolutions.json"
UA = "ClashOfCrittersEvolutionPlanner/1.0 (local scraper)"


def api(params: dict) -> dict:
    params = {**params, "format": "json"}
    qs = urllib.parse.urlencode(params)
    req = urllib.request.Request(f"{API}?{qs}", headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60) as resp:
        return json.loads(resp.read().decode("utf-8"))


def list_infobox_pages() -> list[str]:
    titles: list[str] = []
    offset = 0
    while True:
        data = api(
            {
                "action": "query",
                "list": "search",
                "srsearch": 'insource:"Infobox critter"',
                "srnamespace": "0",
                "srlimit": "50",
                "sroffset": str(offset),
            }
        )
        for hit in data.get("query", {}).get("search", []):
            titles.append(hit["title"])
        cont = data.get("continue", {})
        if "sroffset" not in cont:
            break
        offset = cont["sroffset"]
        time.sleep(0.2)
    return list(dict.fromkeys(titles))


def fetch_wikitext(title: str) -> str:
    data = api(
        {
            "action": "parse",
            "page": title,
            "prop": "wikitext",
            "formatversion": "2",
        }
    )
    return data.get("parse", {}).get("wikitext") or ""


def extract_infobox(wikitext: str) -> str | None:
    start = wikitext.find("{{Infobox critter")
    if start < 0:
        return None
    i = start
    depth = 0
    while i < len(wikitext):
        if wikitext.startswith("{{", i):
            depth += 1
            i += 2
            continue
        if wikitext.startswith("}}", i):
            depth -= 1
            i += 2
            if depth == 0:
                return wikitext[start:i]
            continue
        i += 1
    return None


def parse_infobox_fields(box: str) -> dict[str, str]:
    fields: dict[str, str] = {}
    for m in re.finditer(r"^\|\s*([^=|\n]+?)\s*=\s*(.*)$", box, re.M):
        key = m.group(1).strip()
        if key == "Feeding Upgrade List":
            continue
        fields[key] = m.group(2).strip()
    return fields


def parse_stages(fields: dict[str, str]) -> list[str]:
    stages = []
    for n in range(1, 5):
        raw = (fields.get(f"Stage {n}") or "").strip()
        # Wiki often writes "|Stage 3=|Feeding Upgrade List=..." on one line
        if "|" in raw:
            raw = raw.split("|", 1)[0].strip()
        if not raw or "{{" in raw or "Feedrow" in raw:
            continue
        if not re.match(r"^[A-Za-z][\w' -]*$", raw):
            continue
        stages.append(raw)
    return stages


def star_phrase_to_level(count: int, unit: str) -> int:
    """Map wiki phrases like '6 bronze stars' / '6 silver moons' to star level."""
    u = re.sub(r"\s+", " ", (unit or "").strip().lower())
    # Absolute numeric "stars" with no tier
    if u in ("", "star", "stars"):
        return count
    # Visual tiers ( Tatari page ranges are 6 levels wide )
    table = [
        (r"bronze\s+stars?", 0),
        (r"silver\s+stars?", 6),
        (r"gold\s+stars?", 12),
        (r"silver\s+(?:crescent\s+)?moons?", 18),
        (r"gold\s+(?:crescent\s+)?moons?", 24),
        (r"iridescent\s+(?:crescent\s+)?moons?", 30),
        (r"gold\s+suns?", 36),
        (r"iridescent\s+suns?", 42),
        (r"red\s+suns?", 48),
        (r"blue\s+crowns?", 54),
        (r"gold\s+crowns?", 60),
        (r"iridescent\s+crowns?", 66),
    ]
    for pattern, base in table:
        if re.fullmatch(pattern, u):
            return base + count
    return count


def extract_stars_required(wikitext: str, evolves_to: str | None) -> int | None:
    if not evolves_to:
        return None
    escaped = re.escape(evolves_to)
    unit = r"((?:bronze|silver|gold|iridescent|red|blue)\s+(?:crescent\s+)?(?:stars?|moons?|suns?|crowns?)|stars?)"
    patterns = [
        rf"(?:evolves\s+)?into\s*\[\[{escaped}[^\]]*\]\]\s*at\s+(\d+)\s*{unit}",
        rf"evolution trial (?:unlocks|begins) once[^.]*?(?:reaches\s+)?(\d+)\s*{unit}",
        # Fallback when wiki rename lags behind infobox stage names
        rf"evolves into\s*\[\[[^\]]+\]\]\s*at\s+(\d+)\s*{unit}",
    ]
    for p in patterns:
        m = re.search(p, wikitext, re.I)
        if m:
            return star_phrase_to_level(int(m.group(1)), m.group(2))
    return None


def extract_trials(wikitext: str) -> list[str]:
    m = re.search(
        r"==\s*Evolution Trials?\s*==([\s\S]*?)(?=\n==[^=]|$)",
        wikitext,
        re.I,
    )
    if not m:
        return []
    bullets = []
    for line in m.group(1).splitlines():
        bm = re.match(r"^\*\s*(.+)$", line)
        if not bm:
            continue
        text = bm.group(1)
        text = re.sub(r"\[\[([^\]|]+)\|([^\]]+)\]\]", r"\2", text)
        text = re.sub(r"\[\[([^\]]+)\]\]", r"\1", text)
        text = re.sub(r"'{2,}", "", text)
        text = re.sub(r"<[^>]+>", "", text).strip()
        if text:
            bullets.append(text)
    return bullets


def image_url(filename: str | None) -> str | None:
    if not filename:
        return None
    name = re.sub(r"^File:", "", filename, flags=re.I).strip().replace(" ", "_")
    # Direct /images/ path works better in browsers than Special:FilePath (403/hotlink).
    return f"https://clashofcritters.wiki.gg/images/{name}"


def main() -> None:
    print("Discovering Infobox pages…")
    titles = list_infobox_pages()
    print(f"Found {len(titles)} pages")

    by_title: dict[str, dict] = {}
    for i, title in enumerate(titles, 1):
        if i % 20 == 0 or i == 1:
            print(f"  [{i}/{len(titles)}] {title}")
        try:
            wikitext = fetch_wikitext(title)
            box = extract_infobox(wikitext)
            if not box:
                continue
            fields = parse_infobox_fields(box)
            stages = parse_stages(fields)
            if not stages:
                continue
            name = (fields.get("Name") or title).strip()
            stage_index = next(
                (idx for idx, s in enumerate(stages) if s.lower() == name.lower()),
                0,
            )
            next_name = (
                stages[stage_index + 1] if stage_index < len(stages) - 1 else None
            )
            by_title[name] = {
                "name": name,
                "type": (fields.get("Type") or "").strip() or None,
                "rarity": (fields.get("Rarity") or "").strip() or None,
                "role": (fields.get("Role") or "").strip() or None,
                "image": (fields.get("image") or f"{name}.png").strip(),
                "stages": stages,
                "stageIndex": stage_index,
                "evolvesTo": next_name,
                "starsRequired": extract_stars_required(wikitext, next_name),
                "trials": extract_trials(wikitext) if next_name else [],
                "wikiTitle": title,
            }
        except Exception as err:  # noqa: BLE001
            print(f"  skip {title}: {err}")
        time.sleep(0.15)

    line_map: dict[str, dict] = {}
    for entry in by_title.values():
        line_id = entry["stages"][0]
        if line_id not in line_map:
            line_map[line_id] = {
                "id": line_id,
                "type": entry["type"],
                "role": entry["role"],
                "stageNames": list(entry["stages"]),
                "entries": [],
            }
        line = line_map[line_id]
        line["entries"].append(entry)
        if not line["type"] and entry["type"]:
            line["type"] = entry["type"]
        if not line["role"] and entry["role"]:
            line["role"] = entry["role"]
        if len(entry["stages"]) > len(line["stageNames"]):
            line["stageNames"] = list(entry["stages"])

    lines = []
    for line in line_map.values():
        stage_names = line["stageNames"]
        stages_out = []
        for idx, stage_name in enumerate(stage_names):
            entry = next(
                (
                    e
                    for e in line["entries"]
                    if e["name"].lower() == stage_name.lower()
                ),
                by_title.get(stage_name),
            )
            nxt = stage_names[idx + 1] if idx < len(stage_names) - 1 else None
            from_entry = entry or {}
            img = from_entry.get("image") or f"{stage_name}.png"
            wiki_title = from_entry.get("wikiTitle") or stage_name
            stages_out.append(
                {
                    "name": stage_name,
                    "rarity": from_entry.get("rarity"),
                    "image": img,
                    "imageUrl": image_url(img),
                    "wiki": f"https://clashofcritters.wiki.gg/wiki/{urllib.parse.quote(wiki_title.replace(' ', '_'))}",
                    "evolvesTo": nxt,
                    "starsRequired": from_entry.get("starsRequired") if nxt else None,
                    "trials": from_entry.get("trials") or [] if nxt else [],
                }
            )
        base = next(
            (e for e in line["entries"] if e["stageIndex"] == 0),
            line["entries"][0] if line["entries"] else None,
        )
        lines.append(
            {
                "id": line["id"],
                "type": line["type"] or (base or {}).get("type"),
                "role": line["role"] or (base or {}).get("role"),
                "rarity": stages_out[0]["rarity"] if stages_out else None,
                "stages": stages_out,
            }
        )

    lines.sort(key=lambda x: x["id"])
    payload = {
        "updatedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "source": "https://clashofcritters.wiki.gg",
        "lineCount": len(lines),
        "lines": lines,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Wrote {len(lines)} lines -> {OUT}")


if __name__ == "__main__":
    main()
