#!/usr/bin/env python3
"""
Convert Marvel trading card checklists to JSON format
"""

import json
import re

# Read Chrome checklist
chrome_cards = []
with open('data/marvel_chrome_checklist.txt', 'r') as f:
    lines = f.readlines()
    in_base = False
    for line in lines:
        line = line.strip()
        if line.startswith('BASE CHARACTERS'):
            in_base = True
            continue
        if line.startswith('INSERTS:'):
            break
        if in_base and line and not line.startswith('NOTE:'):
            match = re.match(r'(\d+) - (.+)', line)
            if match:
                card_num = int(match.group(1))
                character = match.group(2)
                chrome_cards.append({
                    'number': card_num,
                    'character': character,
                    'set': 'chrome',
                    'image': f'/cards/chrome/CHROME-{card_num:03d}_{character.replace(" ", "_")}.png'
                })

# Read Comic Book Heroes checklist
cbh_cards = []
with open('data/comic_book_heroes_checklist.txt', 'r') as f:
    lines = f.readlines()
    for line in lines:
        line = line.strip()
        match = re.match(r'(\d+) - (.+)', line)
        if match:
            card_num = int(match.group(1))
            character = match.group(2)
            cbh_cards.append({
                'number': card_num,
                'character': character,
                'set': 'cbh',
                'image': f'/cards/cbh/CBH-{card_num:03d}_{character.replace(" ", "_")}.png'
            })

# Read Marvel Mint checklist
mint_cards = []
with open('data/marvel_mint_checklist.txt', 'r') as f:
    lines = f.readlines()
    for line in lines:
        line = line.strip()
        match = re.match(r'(\d+) - (.+)', line)
        if match:
            card_num = int(match.group(1))
            character = match.group(2)
            mint_cards.append({
                'number': card_num,
                'character': character,
                'set': 'mint',
                'image': f'/cards/mint/MINT-{card_num:03d}_{character.replace(" ", "_")}.png'
            })

# Write JSON files
with open('client/public/data/chrome_cards.json', 'w') as f:
    json.dump(chrome_cards, f, indent=2)

with open('client/public/data/cbh_cards.json', 'w') as f:
    json.dump(cbh_cards, f, indent=2)

with open('client/public/data/mint_cards.json', 'w') as f:
    json.dump(mint_cards, f, indent=2)

# Create combined character index
all_characters = {}
for card in chrome_cards + cbh_cards + mint_cards:
    char_name = card['character']
    if char_name not in all_characters:
        all_characters[char_name] = {
            'name': char_name,
            'appearances': []
        }
    all_characters[char_name]['appearances'].append({
        'set': card['set'],
        'number': card['number'],
        'image': card['image']
    })

# Convert to list and sort
character_list = list(all_characters.values())
character_list.sort(key=lambda x: x['name'])

with open('client/public/data/characters.json', 'w') as f:
    json.dump(character_list, f, indent=2)

print(f"✅ Converted {len(chrome_cards)} Chrome cards")
print(f"✅ Converted {len(cbh_cards)} Comic Book Heroes cards")
print(f"✅ Converted {len(mint_cards)} Marvel Mint cards")
print(f"✅ Created character index with {len(character_list)} unique characters")
