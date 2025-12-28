#!/usr/bin/env python3
"""
Generate accurate card data JSON from actual image files
"""

import json
import os
import re

def get_cards_from_directory(directory, set_name):
    """Extract card data from image filenames in a directory"""
    cards = []
    if not os.path.exists(directory):
        print(f"Warning: Directory {directory} does not exist")
        return cards
    
    files = sorted(os.listdir(directory))
    for filename in files:
        if not filename.endswith('.png'):
            continue
        
        # Parse filename: SET-NUMBER_Character_Name.png
        match = re.match(r'([A-Z]+)-(\d+)_(.+)\.png', filename)
        if match:
            set_prefix = match.group(1)
            number = int(match.group(2))
            character = match.group(3).replace('_', ' ')
            
            cards.append({
                'number': number,
                'character': character,
                'set': set_name,
                'image': f'/cards/{set_name}/{filename}'
            })
    
    return cards

# Generate card data for each set
chrome_cards = get_cards_from_directory(
    'client/public/cards/chrome',
    'chrome'
)

cbh_cards = get_cards_from_directory(
    'client/public/cards/cbh',
    'cbh'
)

mint_cards = get_cards_from_directory(
    'client/public/cards/mint',
    'mint'
)

# Write individual set JSON files
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

print(f"✅ Generated {len(chrome_cards)} Chrome cards")
print(f"✅ Generated {len(cbh_cards)} Comic Book Heroes cards")
print(f"✅ Generated {len(mint_cards)} Marvel Mint cards")
print(f"✅ Created character index with {len(character_list)} unique characters")
print(f"📊 Total cards: {len(chrome_cards) + len(cbh_cards) + len(mint_cards)}")
