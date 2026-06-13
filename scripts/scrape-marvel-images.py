"""
Scrape Marvel.com character pages to get official character card image URLs.
Uses cdn.marvel.com which is confirmed working.
"""
import requests
from bs4 import BeautifulSoup
import json
import time

# All 100 base card characters mapped to their Marvel.com URL slug
CHARACTERS = {
    # Base - Common (#1-50)
    "Mister Fantastic": "mister-fantastic",
    "Invisible Woman": "invisible-woman",
    "Human Torch": "human-torch-johnny-storm",
    "The Thing": "thing",
    "Air-Walker": "air-walker",
    "Alicia Masters": "alicia-masters",
    "Artie Maddicks": "artie-maddicks",
    "Attuma": "attuma",
    "Awesome Android": "awesome-android",
    "Bentley-23": "bentley-23",
    "Beyonder": "beyonder",
    "Devil Dinosaur": "devil-dinosaur",
    "Diablo": "diablo",
    "Doctor Doom": "doctor-doom",
    "Dragon Man": "dragon-man",
    "Ego": "ego-the-living-planet",
    "Fallen One": "fallen-one",
    "Firelord": "firelord",
    "Flux": "flux",
    "Franklin Richards": "franklin-richards",
    "H.E.R.B.I.E.": "herbie",
    "The High Evolutionary": "high-evolutionary",
    "Immortus": "immortus",
    "Impossible Man": "impossible-man",
    "Klaw": "klaw",
    "Leech": "leech",
    "Lyja": "lyja",
    "Mad Thinker": "mad-thinker",
    "Miss Thing": "miss-thing",
    "Mobius M. Mobius": "mobius-m-mobius",
    "Molecule Man": "molecule-man",
    "Morg": "morg",
    "Over-Mind": "over-mind",
    "Power Skrull": "power-skrull",
    "Puppet Master": "puppet-master",
    "Psycho-Man": "psycho-man",
    "Rama-Tut": "rama-tut",
    "Red Ghost": "red-ghost",
    "Ronan": "ronan",
    "Sandman": "sandman",
    "She-Thing": "she-thing",
    "Spider-Man": "spider-man-peter-parker",
    "Super-Skrull": "super-skrull",
    "Terrax": "terrax",
    "Thundra": "thundra",
    "Titania": "titania",
    "Trapster": "trapster",
    "Valeria Richards": "valeria-richards",
    "Victorious": "victorious",
    "Wizard": "wizard",
    # Base - Uncommon (#51-85)
    "Black Bolt": "black-bolt",
    "Captain America": "captain-america-steve-rogers",
    "Crystal": "crystal",
    "Daredevil": "daredevil-matt-murdock",
    "Galactus": "galactus",
    "Ghost Rider": "ghost-rider-johnny-blaze",
    "Hercules": "hercules",
    "Hulk": "hulk",
    "Iron Man": "iron-man",
    "Lockjaw": "lockjaw",
    "Medusa": "medusa",
    "Mole Man": "mole-man",
    "Namor": "namor",
    "Nova": "nova-richard-rider",
    "Quicksilver": "quicksilver",
    "Scarlet Witch": "scarlet-witch",
    "Silver Surfer": "silver-surfer",
    "Spider-Woman": "spider-woman-jessica-drew",
    "Thor": "thor",
    "Triton": "triton",
    "The Watcher": "uatu-the-watcher",
    "Vision": "vision",
    "Wasp": "wasp",
    # Base - Rare (#86-100)
    "Ant-Man": "ant-man-scott-lang",
    "Black Panther": "black-panther",
    "The Bombastic Bagman": "spider-man-peter-parker",
    "Crystal": "crystal",
    "Doomasaur": "doomasaur",
    "Ghost Rider": "ghost-rider-johnny-blaze",
    "Hulk": "hulk",
    "Invisible Man": "invisible-woman",
    "Maker": "maker",
    "Malice": "malice",
    "Medusa": "medusa",
    "She-Hulk": "she-hulk",
    "Storm": "storm",
    "Thor": "thor",
    "Wolverine": "wolverine",
}

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

def get_character_image(slug):
    url = f"https://www.marvel.com/characters/{slug}"
    try:
        resp = requests.get(url, headers=HEADERS, timeout=10)
        if resp.status_code != 200:
            return None, f"HTTP {resp.status_code}"
        soup = BeautifulSoup(resp.text, 'html.parser')
        # Find character card image - look for cdn.marvel.com images
        imgs = soup.find_all('img')
        for img in imgs:
            src = img.get('src', '')
            if 'cdn.marvel.com' in src and '_com_crd_' in src:
                return src, None
        # Fallback: any cdn.marvel.com image with character-related filename
        for img in imgs:
            src = img.get('src', '')
            if 'cdn.marvel.com/content' in src and src.endswith('.webp'):
                alt = img.get('alt', '')
                return src, f"fallback (alt: {alt[:30]})"
        return None, "no image found"
    except Exception as e:
        return None, str(e)

results = {}
unique_slugs = list(set(CHARACTERS.values()))
print(f"Fetching images for {len(unique_slugs)} unique character pages...")

for slug in unique_slugs:
    img_url, note = get_character_image(slug)
    results[slug] = {'url': img_url, 'note': note}
    status = '✓' if img_url else '✗'
    print(f"  {status} {slug}: {img_url[:80] if img_url else note}")
    time.sleep(0.5)  # Be polite

# Save results
with open('/home/ubuntu/northland-legendary-finds/scripts/marvel-images.json', 'w') as f:
    json.dump(results, f, indent=2)

print(f"\nDone. {sum(1 for v in results.values() if v['url'])} of {len(results)} found.")
print("Saved to marvel-images.json")
