/**
 * Publish Fallen Son 3-Part Series — Memorial Day Weekend 2026
 * Part 1: Friday May 23 — Denial & Anger (Wolverine & Avengers)
 * Part 2: Saturday May 24 — Bargaining & Depression (Hawkeye & Spider-Man)
 * Part 3: Sunday May 25 — Acceptance & Legacy (Sam Wilson, Iron Man, Arctic Farewell)
 * Run from project root: node publish-fallen-son-3parts.mjs
 */
import 'dotenv/config';
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

// Image URLs (reusing from original article)
const IMAGES = {
  featured: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/fallen-son-featured-6XVTPos4xY3UzPpUfaoqLD.png",
  wolverine: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/fallen-son-wolverine-denial-BmawXicYWQLoXfg5ejEFUU.png",
  avengers: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/fallen-son-avengers-anger2-MsB6tyiQyFebL9mN3nNkNe.png",
  hawkeye: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/fallen-son-hawkeye-bargaining-EGewNrbHcbHkbbBXU2iUXk.png",
  spiderman: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/fallen-son-spiderman-depression-LXjx7HAH4mEExJMK9J6bu4.png",
  acceptance: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/fallen-son-acceptance-74zR2XgVWd6nQv2UF9WRWu.png",
};

// Publish dates: Friday May 23, Saturday May 24, Sunday May 25 at 9:00 AM CDT (UTC-5)
const fridayMay23 = new Date('2026-05-23T14:00:00Z').getTime(); // 9am CDT
const saturdayMay24 = new Date('2026-05-24T14:00:00Z').getTime();
const sundayMay25 = new Date('2026-05-25T14:00:00Z').getTime();

const articles = [
  // ===== PART 1: DENIAL & ANGER (Friday May 23) =====
  {
    title: "Fallen Son Part 1: Denial and Anger — When Wolverine Saw the Body and the Avengers Broke",
    slug: "fallen-son-part-1-denial-anger-wolverine-avengers-captain-america",
    excerpt: "The first two stages of Marvel's greatest grief saga. Wolverine refuses to believe Cap is dead and infiltrates the Helicarrier. The Avengers channel their rage into violence. Part 1 of our Memorial Day weekend deep dive.",
    featuredImageUrl: IMAGES.wolverine,
    category: "analysis",
    tags: JSON.stringify(["Captain America", "Fallen Son", "Wolverine", "Avengers", "Memorial Day", "Marvel Comics", "Daredevil", "Iron Man", "Civil War"]),
    relatedCharacters: JSON.stringify(["Captain America", "Wolverine", "Daredevil", "Iron Man", "Spider-Man", "Luke Cage"]),
    cardMarketImpact: "Wolverine and Avengers team cards see increased demand during Memorial Day weekend as collectors connect with the emotional weight of the Fallen Son storyline.",
    isFeatured: 0,
    isPublished: 1,
    authorName: "NLF Team",
    publishedAt: fridayMay23,
    metaDescription: "Fallen Son Part 1: Wolverine infiltrates the Helicarrier to see Captain America's body. The Avengers channel grief into rage. Memorial Day weekend deep dive into Marvel's greatest loss.",
    sources: JSON.stringify([
      { title: "Fallen Son: The Death of Captain America - Wikipedia", url: "https://en.wikipedia.org/wiki/Fallen_Son:_The_Death_of_Captain_America" },
      { title: "Fallen Son Rises Above - ComicsAlliance", url: "https://comicsalliance.com/fallen-son-rises-above/" },
      { title: "Book Review: Fallen Son - Brett Milam", url: "https://brettmilam.com/2024/12/20/book-review-fallen-son-the-death-of-captain-america/" },
    ]),
    contentMarkdown: `*This is Part 1 of our 3-part Memorial Day weekend series exploring Fallen Son: The Death of Captain America — Marvel's most emotionally devastating limited series. [Read Part 2 (Saturday)](/mcu-news/fallen-son-part-2-bargaining-depression-hawkeye-spider-man) | [Read Part 3 (Sunday)](/mcu-news/fallen-son-part-3-acceptance-legacy-sam-wilson-iron-man)*

---

In the summer of 2007, the Marvel Universe fell silent. Steve Rogers — Captain America — was dead. Shot on the steps of a federal courthouse in the aftermath of the Superhero Civil War, the Sentinel of Liberty became a casualty of the very nation he swore to protect. Writer Jeph Loeb, drawing from the devastating personal loss of his seventeen-year-old son Sam to bone cancer in 2005, crafted one of the most emotionally raw limited series in Marvel history. *Fallen Son: The Death of Captain America* is not a story about punching villains. It is a story about grief — told through the five stages that Elisabeth Kubler-Ross made famous — and how even the mightiest heroes on Earth are powerless against the weight of loss.

This weekend, as we honor those who gave everything in service to something greater than themselves, we're telling the full Fallen Son story across three days. Today: Denial and Anger.

## Chapter One: Denial — Wolverine

<img src="${IMAGES.wolverine}" alt="Wolverine standing alone in the rain on a rooftop, contemplating loss" style="width:100%;border-radius:12px;margin:16px 0;" />

The first stage of grief is the refusal to accept reality. For Wolverine — a man who has survived centuries of war, betrayal, and death — the idea that Steve Rogers could simply be killed by a bullet was unacceptable. Logan had seen Cap survive the impossible. He had seen Bucky Barnes, the Winter Soldier, return from the dead. If death could be cheated once, why not again?

Wolverine tracked down the Winter Soldier in the shadows of New York, confronting him with a desperate proposition: they would infiltrate the S.H.I.E.L.D. Helicarrier together and see the body with their own eyes. Bucky refused. He already knew the truth — he just could not face it yet.

Undeterred, Logan recruited Daredevil, whose superhuman senses could detect any deception. Using enchantments provided by Doctor Strange, the unlikely pair slipped past S.H.I.E.L.D. security and into the bowels of the Helicarrier. Their first stop: the holding cell of Crossbones, the mercenary who fired the first shot. Wolverine wanted answers. He wanted Crossbones to give him an excuse — any excuse — to take revenge. But Daredevil stopped him cold. Everything Crossbones said was the truth. There was no conspiracy to unravel. No hidden villain to blame. Cap was simply gone.

After Daredevil departed, Wolverine made his way alone to where S.H.I.E.L.D. was keeping Captain America's body. There, standing guard over the coffin, he found Tony Stark and Hank Pym. Logan looked inside. Steve Rogers lay still. But the shield — that iconic vibranium disc — was missing. Wolverine's grief instantly curdled into accusation. "You're already planning a replacement," he snarled at Stark. Iron Man did not deny it. Instead, he let Wolverine leave, knowing that Logan would now carry the truth back to the others: Steve Rogers, Captain America, was dead.

Denial had crumbled. But acceptance was still a long way off.

## Chapter Two: Anger — The Avengers

<img src="${IMAGES.avengers}" alt="Heroes gathered around a table in tense silence, grief and anger visible on their faces" style="width:100%;border-radius:12px;margin:16px 0;" />

With denial shattered, rage filled the void. And it was not contained to one hero — it spread like wildfire through both Avengers teams, threatening to tear apart what little unity remained after the Civil War.

The Mighty Avengers — Tony Stark's government-sanctioned team — were dispatched to a coastal missile base under attack by Tiger Shark. The aquatic villain had stolen the "Horn of Gabriel" from Atlantis, an artifact capable of summoning sea monsters. It should have been a routine takedown. Instead, it became a display of unchecked fury. Ms. Marvel, channeling weeks of suppressed rage over Cap's death, unleashed a savagery that shocked her own teammates. She was not fighting a villain. She was fighting her own helplessness — the rage of knowing that all her power could not save the one man who mattered most.

Namor, the Sub-Mariner, arrived to calm the raging sea creatures and took Tiger Shark into custody. But his words cut deeper than any blade. He condemned the Mighty Avengers for using a petty criminal as an outlet for their grief, calling their brutality exactly what it was: displaced anger with nowhere constructive to go.

Meanwhile, across the city at Doctor Strange's Sanctum Sanctorum, the New Avengers gathered for a poker game. Luke Cage, Spider-Woman, Wolverine, Spider-Man, and the Thing sat around a table, cards in hand, pretending everything was normal. It was not. The Young Avengers — Patriot and Kate Bishop — joined them, and conversation inevitably turned to Cap's death and the Civil War that preceded it.

Tensions boiled over. Wolverine returned from the Helicarrier and confirmed what everyone feared: he had seen the body. Spider-Man snapped. He and Wolverine nearly came to blows before the Thing physically separated them, his rocky hands holding two grieving men apart. "Fighting each other won't bring him back," Ben Grimm said quietly. "It won't make the pain go away."

Spider-Man stormed out into the night. The others resumed their poker game — not because they wanted to play, but because silence was worse than pretending.

---

## Coming Tomorrow: Bargaining and Depression

*In Part 2, Hawkeye picks up Captain America's shield and must decide whether he's worthy of replacing a legend. And Spider-Man faces the crushing weight of every loss he's ever suffered — alone in a graveyard with only the Rhino and his memories for company. [Read Part 2 tomorrow](/mcu-news/fallen-son-part-2-bargaining-depression-hawkeye-spider-man).*

---

## Collector's Corner

The Fallen Son storyline puts Wolverine and the Avengers at the emotional center of Marvel's greatest loss — making cards featuring these characters in grief-related or Civil War-era sets particularly collectible this Memorial Day weekend.

**Hot Cards to Watch:**
- **Wolverine Topps Finest X-Men '97 Refractor** — Logan's role as the emotional anchor of Fallen Son drives collector interest in his premium parallels
- **Captain America Topps Chrome Marvel Base** — The flagship Cap card appreciates every Memorial Day as the character's cultural significance resonates
- **Daredevil Topps Chrome Marvel Parallel** — Matt Murdock's role alongside Wolverine in the Denial chapter makes his cards a sleeper pick
- **Iron Man Topps Marvel Mint Medallion Insert** — Tony Stark's guilt throughout Fallen Son connects to his broader Civil War arc

Track real-time price movements on **[TCGPlayer](https://www.tcgplayer.com/)** — their Marvel card marketplace shows Memorial Day weekend spikes on patriotic characters.

Browse graded Wolverine and Captain America singles on **[eBay](https://www.ebay.com/b/Marvel-Trading-Cards/183456/bn_16566768)** — sold listings from last Memorial Day show 15-25% premiums on key cards.

Check your collection's value on **[MySlabs](https://www.myslabs.com/)** — track how your graded Marvel cards perform during holiday weekends.

Explore our [Card Database](https://northlandlegendaryfinds.com/cards) for Captain America and Wolverine cards, or join our next [Whatnot stream](https://northlandlegendaryfinds.com/whatnot) for Memorial Day weekend card breaks.

*This is Part 1 of 3. [Continue to Part 2: Bargaining & Depression](/mcu-news/fallen-son-part-2-bargaining-depression-hawkeye-spider-man) — publishing Saturday, May 24.*`,
  },

  // ===== PART 2: BARGAINING & DEPRESSION (Saturday May 24) =====
  {
    title: "Fallen Son Part 2: Bargaining and Depression — Hawkeye's Choice and Spider-Man's Darkest Hour",
    slug: "fallen-son-part-2-bargaining-depression-hawkeye-spider-man",
    excerpt: "Hawkeye picks up Captain America's shield and must decide if he can replace a legend. Spider-Man faces every loss he's ever suffered alone in a graveyard. Part 2 of our Memorial Day weekend Fallen Son deep dive.",
    featuredImageUrl: IMAGES.hawkeye,
    category: "analysis",
    tags: JSON.stringify(["Captain America", "Fallen Son", "Hawkeye", "Spider-Man", "Memorial Day", "Marvel Comics", "Iron Man", "Kate Bishop", "Civil War"]),
    relatedCharacters: JSON.stringify(["Captain America", "Hawkeye", "Spider-Man", "Iron Man", "Wolverine"]),
    cardMarketImpact: "Hawkeye and Spider-Man cards connected to emotional storylines command premiums as collectors seek narrative-driven pieces with personal significance.",
    isFeatured: 0,
    isPublished: 1,
    authorName: "NLF Team",
    publishedAt: saturdayMay24,
    metaDescription: "Fallen Son Part 2: Hawkeye tries on Captain America's shield. Spider-Man breaks down at Uncle Ben's grave. The middle chapters of Marvel's greatest grief saga.",
    sources: JSON.stringify([
      { title: "Fallen Son: The Death of Captain America - Wikipedia", url: "https://en.wikipedia.org/wiki/Fallen_Son:_The_Death_of_Captain_America" },
      { title: "Fallen Son Rises Above - ComicsAlliance", url: "https://comicsalliance.com/fallen-son-rises-above/" },
      { title: "Book Review: Fallen Son - Brett Milam", url: "https://brettmilam.com/2024/12/20/book-review-fallen-son-the-death-of-captain-america/" },
    ]),
    contentMarkdown: `*This is Part 2 of our 3-part Memorial Day weekend series exploring Fallen Son: The Death of Captain America. [Read Part 1 (Friday)](/mcu-news/fallen-son-part-1-denial-anger-wolverine-avengers-captain-america) | [Read Part 3 (Sunday)](/mcu-news/fallen-son-part-3-acceptance-legacy-sam-wilson-iron-man)*

---

Yesterday, we watched Wolverine shatter his own denial by seeing Captain America's body on the Helicarrier. We watched the Avengers channel their grief into violence — and nearly destroy each other in the process. Today, the story moves into darker territory: the desperate bargains we make with fate, and the crushing depression that follows when those bargains fail.

## Chapter Three: Bargaining — Hawkeye

<img src="${IMAGES.hawkeye}" alt="Hawkeye holding Captain America's shield with a conflicted expression" style="width:100%;border-radius:12px;margin:16px 0;" />

Bargaining is the stage where we try to negotiate with fate. What if things had been different? What if someone else could take their place? For Clint Barton — Hawkeye — the bargain was literal: could he become the new Captain America?

Barton had been dead himself. Killed during the Scarlet Witch's breakdown, he had been resurrected by the reality-altering events of House of M. He understood death and return in a way few others could. Now, standing in the ruins of the old Avengers Mansion, he summoned Tony Stark for a confrontation.

Stark was cautious. He brought Barton to the Helicarrier and ran every test to confirm his identity — fingerprints, retinal scans, DNA. When the results came back positive, Tony revealed his hand. He produced Captain America's real shield — the original vibranium disc that had been missing from the coffin — and offered Barton the chance to wield it.

On the Helicarrier deck, under gray skies, Clint Barton threw the shield for the first time. It sang through the air, ricocheting off surfaces with the same precision Steve Rogers had made legendary. Unlike others who had tried and failed, Barton proved he could handle it. Stark's offer crystallized: become the new Captain America. Restore the symbol to the people of the United States. Give them hope again.

They went on patrol together — Iron Man and the man who might become the next Cap. In the streets below, they discovered Kate Bishop and Patriot battling the villain Firebrand. When Stark moved to arrest the young heroes for violating the Superhuman Registration Act, Kate Bishop fired an EMP arrow that shut down his armor completely.

As Patriot and Hawkeye fled into the sewers, they found themselves face-to-face with Clint Barton — wearing Captain America's uniform, carrying Captain America's shield. Kate Bishop stared at him with a mixture of awe and disgust. She told him that she had taken the Hawkeye name to honor him, not to replace him. She would never disgrace his memory by pretending to be something she was not.

The words hit like a punch. Barton let the Young Avengers escape. Then he walked back to Stark, handed over the shield, and stripped off the uniform. He finally understood. Tony's desperate search for a replacement Captain America was not about the American people. It was about Tony Stark's guilt — his need to believe that the symbol could survive even if the man was gone.

Barton refused the mantle. He walked away into the rain, leaving Iron Man standing alone with a shield that no one wanted to carry.

## Chapter Four: Depression — Spider-Man

<img src="${IMAGES.spiderman}" alt="Spider-Man sitting alone on a rooftop at sunset, mask off, looking at the horizon with melancholy" style="width:100%;border-radius:12px;margin:16px 0;" />

Depression is the stage where hope dies. Where the weight of loss becomes so heavy that even getting out of bed feels impossible. For Peter Parker — Spider-Man — it was not just about Captain America. It was about everyone.

Peter knelt before Uncle Ben's grave in a quiet Queens cemetery, the autumn leaves falling around him like the pages of a life story written in loss. He spoke to the headstone the way he always did — as if Ben could still hear him. "You told me there would be days that would test me," Peter whispered. "I don't know if I can take it anymore."

The list was too long. Uncle Ben. His parents. Harry Osborn. Gwen Stacy. Her father, Captain Stacy. And now Steve Rogers — the man who had been everything Peter aspired to be. A hero who never wavered. A man who always knew the right thing to do. Gone.

His spider-sense flared. The Rhino — massive, armored, unstoppable — was in the cemetery. Peter's grief twisted into paranoid rage. He attacked without thinking, without asking questions. But Rhino was not there to fight. He was visiting his mother's grave. In the chaos of Spider-Man's assault, Rhino accidentally destroyed his own mother's headstone. The realization of what he had done sent the villain into a genuine, grief-fueled rampage.

Through the haze of pain, a memory surfaced: years ago, Spider-Man had faced the Hulk alone and was nearly overwhelmed — until Captain America appeared. Cap had stood between Peter and certain defeat, shield raised, jaw set, utterly fearless. Cap had saved him.

But Cap was not coming this time. No one was coming.

Peter Parker willed himself to his feet. Broken, exhausted, barely standing — he rose. And he prevailed the same way Captain America had always prevailed: through sheer, stubborn refusal to stay down. Through the belief that giving up was never an option, no matter how much it hurt.

Wolverine emerged from the shadows, having watched the entire confrontation. He offered a grudging nod of respect. Spider-Man swung to the Brooklyn Bridge — the place where Gwen Stacy died. Logan followed.

"You don't understand," Peter said, his voice cracking. "You can't understand what this feels like."

Wolverine was quiet for a long moment. Then he spoke. "It's like having a cannonball shot through your stomach. It leaves a hole. And that hole has a tendency to reopen — again and again. But each time it reopens, it heals back a little faster."

"Does the pain ever go away?"

"No. You never get over it. You just learn to live with it. And life gets better... someday."

---

## Coming Tomorrow: Acceptance and the Arctic Farewell

*In the final chapter, Sam Wilson delivers the eulogy that makes an entire cemetery stand. Tony Stark breaks down at the podium. And in the Arctic silence, Captain America is returned to the ice — with Namor standing eternal guard. Plus: Jeph Loeb's personal story behind the series, and what these cards mean for collectors. [Read Part 3 tomorrow](/mcu-news/fallen-son-part-3-acceptance-legacy-sam-wilson-iron-man).*

---

## Collector's Corner

Hawkeye's moment with the shield and Spider-Man's graveyard breakdown are two of the most iconic scenes in Marvel Comics history — and the cards that capture these characters in their most vulnerable moments are increasingly sought after.

**Hot Cards to Watch:**
- **Hawkeye Topps Chrome Marvel Refractor** — Clint's connection to the Captain America legacy makes his cards a crossover collectible between Avengers and Cap sets
- **Spider-Man Topps Marvel Mint Medallion Insert** — Spidey's graveyard scene is one of the most emotionally powerful in Marvel history, driving premium prices
- **Kate Bishop Topps Finest Marvel Parallel** — The Young Avenger who told Clint the truth; her cards appreciate as the character gains MCU prominence
- **Captain America Shield Topps Chrome Marvel Insert** — Any card featuring the shield as a central element connects to Fallen Son's core theme

Find the best deals on **[Card Ladder](https://www.cardladder.com/)** — their price tracking shows Hawkeye cards trending upward since the Disney+ series renewed interest.

Browse complete Fallen Son-era sets on **[COMC](https://www.comc.com/)** — Check Out My Cards has deep inventory of 2007-era Marvel singles.

Check population reports on **[PSA](https://www.psacard.com/)** — see how many high-grade copies exist of key Spider-Man and Hawkeye cards.

Explore our [Card Database](https://northlandlegendaryfinds.com/cards) for Hawkeye and Spider-Man cards, or browse our [Characters section](https://northlandlegendaryfinds.com/characters) for detailed pages on every hero in Fallen Son.

*This is Part 2 of 3. [Continue to Part 3: Acceptance & Legacy](/mcu-news/fallen-son-part-3-acceptance-legacy-sam-wilson-iron-man) — publishing Sunday, May 25.*`,
  },

  // ===== PART 3: ACCEPTANCE & LEGACY (Sunday May 25) =====
  {
    title: "Fallen Son Part 3: Acceptance and Legacy — Sam Wilson's Eulogy, the Arctic Farewell, and What It All Means",
    slug: "fallen-son-part-3-acceptance-legacy-sam-wilson-iron-man",
    excerpt: "The final chapter. Sam Wilson delivers the eulogy that makes an entire cemetery stand. Tony Stark breaks at the podium. Captain America returns to the ice. Plus: Jeph Loeb's personal story and what these cards mean for collectors.",
    featuredImageUrl: IMAGES.acceptance,
    category: "analysis",
    tags: JSON.stringify(["Captain America", "Fallen Son", "Sam Wilson", "Iron Man", "Memorial Day", "Marvel Comics", "Falcon", "Jeph Loeb", "Namor", "Civil War"]),
    relatedCharacters: JSON.stringify(["Captain America", "Falcon", "Iron Man", "Namor", "Wolverine", "Spider-Man"]),
    cardMarketImpact: "Sam Wilson and Captain America legacy cards peak during Memorial Day weekend. First printings of Fallen Son #5 in CGC 9.8 are the most valuable of the set, and Sam Wilson cards appreciate as his role as Cap's successor gains cultural weight.",
    isFeatured: 0,
    isPublished: 1,
    authorName: "NLF Team",
    publishedAt: sundayMay25,
    metaDescription: "Fallen Son Part 3: Sam Wilson's eulogy at Captain America's funeral. Tony Stark's Arctic farewell. Jeph Loeb's personal grief. The legacy of Marvel's greatest loss — and what it means for collectors.",
    sources: JSON.stringify([
      { title: "Fallen Son: The Death of Captain America - Wikipedia", url: "https://en.wikipedia.org/wiki/Fallen_Son:_The_Death_of_Captain_America" },
      { title: "Fallen Son Rises Above - ComicsAlliance", url: "https://comicsalliance.com/fallen-son-rises-above/" },
      { title: "Book Review: Fallen Son - Brett Milam", url: "https://brettmilam.com/2024/12/20/book-review-fallen-son-the-death-of-captain-america/" },
    ]),
    contentMarkdown: `*This is Part 3 of our 3-part Memorial Day weekend series exploring Fallen Son: The Death of Captain America. [Read Part 1 (Friday)](/mcu-news/fallen-son-part-1-denial-anger-wolverine-avengers-captain-america) | [Read Part 2 (Saturday)](/mcu-news/fallen-son-part-2-bargaining-depression-hawkeye-spider-man)*

---

We've walked through denial with Wolverine. We've felt the rage of the Avengers. We've watched Hawkeye bargain with fate and Spider-Man sink into the darkest depression. Now comes the hardest part: acceptance. Not being okay with loss — but acknowledging it, honoring it, and choosing to move forward.

## Chapter Five: Acceptance — Sam Wilson and Iron Man

<img src="${IMAGES.acceptance}" alt="A military funeral at Arlington National Cemetery with flag-draped casket and mourners" style="width:100%;border-radius:12px;margin:16px 0;" />

The final stage is not about being okay with loss. It is about acknowledging reality and choosing to move forward. For the Marvel Universe, acceptance came in the form of a funeral — and a farewell.

Captain America was given a state funeral with full military honors, a ceremony typically reserved for presidents of the United States. Arlington National Cemetery was filled to capacity. Thousands stood in silence under gray skies. Millions more watched on television screens across the world. The front rows held the people who knew Steve Rogers best: Tony Stark, Sam Wilson, Hank Pym, Janet Van Dyne, Ben Grimm, and dozens of heroes both old and new.

Tony Stark was given the first opportunity to speak. He walked to the podium, looked out at the sea of faces, and opened his mouth. Nothing came. The man who always had an answer — the futurist, the genius, the architect of the Superhuman Registration Act — could not form a single sentence. His voice broke on five words: "It wasn't supposed to be this way..."

He stepped back. And Sam Wilson — the Falcon, Steve Rogers' closest friend and partner — rose to take his place.

Sam's eulogy was not a speech. It was a testament. He began by recounting the names Captain America had been called over the decades: the Star-Spangled Avenger, the Sentinel of Liberty, the Living Legend. But he reminded the crowd that beneath the shield and the uniform, it was always Steve Rogers who mattered. Not the super-soldier serum. Not the vibranium shield. The man.

He spoke of how soldiers in World War II were inspired to charge into battle simply by seeing Cap running beside them. How a generation of heroes — from the Avengers to the X-Men to the Fantastic Four — had looked to Steve Rogers as their moral compass. How even villains respected him, because Captain America never fought for power or glory. He fought because it was right.

Sam asked everyone who had been inspired by Captain America to stand. One by one, then in waves, the entire cemetery rose to its feet. Heroes in costume. Veterans in dress uniforms. Children holding small American flags. By the time Sam finished, every single person was standing.

At Doctor Strange's Sanctum Sanctorum, the New Avengers watched the funeral on television. They could not attend — the Registration Act made them fugitives. Luke Cage stared at the screen in silence. Spider-Man said quietly, "It would have been worth the risk."

Sam Wilson concluded with a challenge: "This should not be a day of mourning. It should be a day of celebration — of everything Steve Rogers stood for, and everything he would want us to become."

## The Arctic Farewell

Three days after the public funeral, a small S.H.I.E.L.D. transport landed in the Arctic. Tony Stark, Janet Van Dyne, and Hank Pym stepped out into the frozen silence, carrying a casket. The body buried at Arlington was a decoy — placed there to give the public closure. Steve Rogers' real body was here, in the place where he had been preserved in ice for decades before being revived.

Tony Stark stood alone before the casket as it was lowered toward the frozen sea. He spoke quietly — not to the crowd, not to history, but to his friend. He talked about the early days of the Avengers. About arguments and laughter and missions that seemed impossible until Steve made them possible. About the Civil War, and the terrible choices they had both made. Despite everything — despite the Registration Act, despite the fighting, despite the betrayal — Tony still loved him. He always had.

As the casket began to sink into the Arctic waters, Namor appeared from beneath the waves. The King of Atlantis, who had fought beside Captain America in World War II, made a solemn vow: as long as he ruled the oceans, Steve Rogers would rest in peace. No one would disturb him. No one would exploit his legacy.

Janet Van Dyne asked the question that hung over all of them: "Does this mean we have to accept that the old era is finally over? That a new one is beginning?"

The casket disappeared into the dark water. Tony Stark did not answer. Some questions do not have answers. Some grief does not have an ending. But life — stubborn, relentless, beautiful life — goes on.

## The Legacy of Fallen Son

Jeph Loeb poured his own grief into every page of this series. The loss of his son Sam in 2005 — after a three-year battle with bone cancer at just seventeen years old — gave Fallen Son an authenticity that readers felt immediately. This was not manufactured drama. This was a father who understood that grief is not linear, not clean, and not something you ever truly finish.

Each issue was illustrated by a different artist, giving each stage of grief its own visual identity: Leinil Yu's shadowy noir for Denial, Ed McGuinness's explosive energy for Anger, John Romita Jr.'s classic heroism for Bargaining, David Finch's dark intensity for Depression, and John Cassaday's quiet dignity for Acceptance.

The series remains one of Marvel's most powerful explorations of what it means to be human in a world of gods and monsters. It reminds us that even the strongest among us are vulnerable to loss — and that the measure of a hero is not how they fight, but how they grieve, how they heal, and how they choose to honor those who came before.

## What This Means for Collectors

The *Fallen Son* limited series has become one of the most sought-after Captain America storylines in the secondary market, particularly as Memorial Day and patriotic collecting seasons drive renewed interest. First printings of all five issues in high grade (CGC 9.8) command premium prices, with Issue #5 (the funeral issue illustrated by John Cassaday) being the most valuable of the set.

For trading card collectors, Captain America memorial and tribute cards have seen steady appreciation. The emotional weight of this storyline makes any card depicting Steve Rogers' legacy particularly resonant with collectors who connect to the narrative.

Browse our [Card Database](https://northlandlegendaryfinds.com/cards) to find Captain America tribute cards, or explore the [Characters section](https://northlandlegendaryfinds.com/characters) for detailed pages on every hero featured in Fallen Son.

---

## Collector's Corner

This Memorial Day weekend, honor Captain America's legacy by collecting the cards that tell his story. Sam Wilson's evolution from Falcon to Captain America makes his cards some of the most undervalued in the hobby.

**Hot Cards to Watch:**
- **Sam Wilson / Falcon Topps Chrome Marvel Parallel** — Sam's eulogy cemented him as Cap's true successor; his cards are criminally undervalued relative to his narrative importance
- **Captain America Topps Brooklyn Collection Marvel** — The ultra-premium set features stunning Cap artwork that captures the weight of his legacy
- **Iron Man Topps Chrome Marvel Refractor** — Tony's guilt and grief throughout Fallen Son adds emotional depth to his already iconic cards
- **Namor Topps Finest Marvel Base** — The Sub-Mariner's vow to guard Cap's body forever makes his cards a deep-cut collector's pick

Find Memorial Day deals on **[Beckett](https://www.beckett.com/)** — their marketplace and price guides help you identify undervalued Captain America cards before the holiday spike.

Watch live card breaks this weekend on **[Whatnot](https://northlandlegendaryfinds.com/whatnot)** — we're featuring Captain America and Avengers cards all Memorial Day weekend with free giveaways every stream.

Track your Captain America collection on **[MySlabs](https://www.myslabs.com/)** — see how your graded cards perform during patriotic holiday weekends.

Explore our [Card Database](https://northlandlegendaryfinds.com/cards) for the full Captain America collection, or check out our [repack boxes](https://northlandlegendaryfinds.com/shop) for a chance to pull Cap cards at a fraction of singles prices.

*Fallen Son: The Death of Captain America was published by Marvel Comics from June to August 2007. All five issues are available in collected trade paperback format. This Memorial Day, we remember — both in the real world and in the pages of the stories that move us.*

---

*Read the complete series: [Part 1: Denial & Anger](/mcu-news/fallen-son-part-1-denial-anger-wolverine-avengers-captain-america) | [Part 2: Bargaining & Depression](/mcu-news/fallen-son-part-2-bargaining-depression-hawkeye-spider-man) | Part 3: Acceptance & Legacy (you are here)*`,
  },
];

async function main() {
  const conn = await mysql.createConnection(DATABASE_URL);

  for (const article of articles) {
    try {
      await conn.execute(
        `INSERT INTO articles (title, slug, excerpt, contentMarkdown, featuredImageUrl, category, tags, cardMarketImpact, relatedCharacters, sources, isFeatured, isPublished, authorName, publishedAt, metaDescription)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          article.title,
          article.slug,
          article.excerpt,
          article.contentMarkdown,
          article.featuredImageUrl,
          article.category,
          article.tags,
          article.cardMarketImpact,
          article.relatedCharacters,
          article.sources,
          article.isFeatured,
          article.isPublished,
          article.authorName,
          article.publishedAt,
          article.metaDescription,
        ]
      );
      console.log(`Published: "${article.title}"`);
    } catch (err) {
      console.error(`Failed: "${article.title}" — ${err.message}`);
    }
  }

  // Verify
  const [rows] = await conn.execute(
    "SELECT id, title, slug, publishedAt FROM articles WHERE slug LIKE 'fallen-son-part-%' ORDER BY publishedAt ASC"
  );
  console.log("\n--- Fallen Son 3-Part Series ---");
  rows.forEach((r) => console.log(`  ${r.id}: ${r.title} (${new Date(Number(r.publishedAt)).toLocaleDateString()})`));

  await conn.end();
  console.log(`\nDone! ${articles.length} article(s) published.`);
}

main().catch(console.error);
