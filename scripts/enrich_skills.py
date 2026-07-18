#!/usr/bin/env python3
"""Enrich data/evolutions.json with skills/aura/description from wiki pages."""
from __future__ import annotations

import json
import re
import time
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "data" / "evolutions.json"
API = "https://clashofcritters.wiki.gg/api.php"
UA = "ClashOfCrittersEvolutionPlanner/1.0 (skills enrich)"


def api(params: dict) -> dict:
    url = API + "?" + urllib.parse.urlencode({**params, "format": "json"})
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60) as res:
        return json.load(res)


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


def parse_skill_types(raw: str) -> list[str]:
    return [
        m.strip()
        for m in re.findall(r"\{\{\s*st\s*\|\s*([^}]+)\}\}", raw or "", re.I)
        if m.strip()
    ]


def extract_aura(text: str | None) -> str | None:
    if not text:
        return None
    m = re.search(r"Aura:\s*([A-Za-z]+)", text, re.I)
    return m.group(1) if m else None


def extract_skills(fields: dict[str, str]) -> tuple[list[dict], str | None]:
    name = (fields.get("Skill Name") or "").strip()
    description = (fields.get("Skill Description") or "").strip()
    types = parse_skill_types(fields.get("Skill Types") or "")
    if not name and not description:
        return [], None
    return (
        [{"name": name or None, "description": description or None, "types": types}],
        extract_aura(description),
    )


def extract_short_description(wikitext: str) -> str | None:
    m = re.search(r'Current Description:\s*"([^"]+)"', wikitext, re.I)
    return m.group(1).strip() if m else None


def wiki_title_from_url(url: str, fallback: str) -> str:
    if not url:
        return fallback
    m = re.search(r"/wiki/([^?#]+)", url)
    if not m:
        return fallback
    return urllib.parse.unquote(m.group(1).replace("_", " "))


def main() -> None:
    data = json.loads(OUT.read_text(encoding="utf-8"))
    cache: dict[str, tuple[list[dict], str | None, str | None]] = {}
    titles: list[str] = []
    for line in data.get("lines") or []:
        for stage in line.get("stages") or []:
            title = wiki_title_from_url(stage.get("wiki") or "", stage.get("name") or "")
            if title and title not in titles:
                titles.append(title)

    print(f"Enriching {len(titles)} stage pages…")
    for i, title in enumerate(titles, 1):
        if i % 20 == 0 or i == 1:
            print(f"  [{i}/{len(titles)}] {title}")
        try:
            wikitext = fetch_wikitext(title)
            box = extract_infobox(wikitext)
            if not box:
                cache[title] = ([], None, extract_short_description(wikitext))
            else:
                skills, aura = extract_skills(parse_infobox_fields(box))
                cache[title] = (skills, aura, extract_short_description(wikitext))
        except Exception as err:  # noqa: BLE001
            print(f"  skip {title}: {err}")
            cache[title] = ([], None, None)
        time.sleep(0.12)

    enriched = 0
    auras = 0
    for line in data.get("lines") or []:
        for stage in line.get("stages") or []:
            title = wiki_title_from_url(stage.get("wiki") or "", stage.get("name") or "")
            skills, aura, desc = cache.get(title, ([], None, None))
            stage["skills"] = skills
            stage["aura"] = aura
            stage["description"] = desc
            if skills:
                enriched += 1
            if aura:
                auras += 1
        line["aura"] = next(
            (s.get("aura") for s in (line.get("stages") or []) if s.get("aura")),
            None,
        )

    data["updatedAt"] = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    OUT.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Done. Stages with skills: {enriched}; auras: {auras} -> {OUT}")


if __name__ == "__main__":
    main()
