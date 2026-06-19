/**
 * ArtistProfile - Individual artist profile page at /artists/:slug
 * Layout: Portrait + tier badge | Full bio | Topps products | Cards in database
 */

import { useParams, Link } from "wouter";
import { ARTISTS, TIERS } from "@/data/artists";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, CreditCard, Star, Palette } from "lucide-react";
import { useMemo } from "react";

// Portrait CDN URLs for comic book auto artists
const ARTIST_PORTRAITS: Record<string, string> = {
  "adam-kubert": "/manus-storage/Adam_Kubert_607d5cb7.jpg",
  "adi-granov": "/manus-storage/Adi_Granov_83c8e824.png",
  "ariel-diaz": "/manus-storage/Ariel_Diaz_3d5b8c24.jpg",
  "arthur-adams": "/manus-storage/Arthur_Adams_eba1c546.jpg",
  "bill-sienkiewicz": "/manus-storage/Bill_Sienkiewicz_3d8019d7.jpg",
  "derrick-chew": "/manus-storage/Derrick_Chew_f8803e35.jpg",
  "e-m-gist": "/manus-storage/EM_Gist_eb42aedb.jpg",
  "ed-mcguinness": "/manus-storage/Ed_McGuinness_34d7e34c.jpg",
  "esad-ribic": "/manus-storage/Esad_Ribic_1251c1e2.jpg",
  "frank-miller": "/manus-storage/Frank_Miller_c0fd0a06.jpg",
  "greg-capullo": "/manus-storage/Greg_Capullo_1546ec44.jpg",
  "greg-horn": "/manus-storage/Greg_Horn_99abd35d.jpg",
  "inhyuk-lee": "/manus-storage/InHyuk_Lee_b420a27e.jpg",
  "jack-kirby": "/manus-storage/Jack_Kirby_031fb58d.jpg",
  "jim-cheung": "/manus-storage/Jim_Cheung_7c1030e9.jpg",
  "joshua-cassara": "/manus-storage/Joshua_Cassara_8f83fd81.jpg",
  "lucio-parrillo": "/manus-storage/Lucio_Parrillo_3bfec929.jpg",
  "marc-silvestri": "/manus-storage/Marc_Silvestri_aaa4d95e.jpg",
  "mark-bagley": "/manus-storage/Mark_Bagley_eb05c78b.jpg",
  "mark-brooks": "/manus-storage/Mark_Brooks_1f0e2187.jpg",
  "mike-mayhew": "/manus-storage/Mike_Mayhew_a5bd6816.jpg",
  "mike-mckone": "/manus-storage/Mike_McKone_151227f1.jpg",
  "mike-zeck": "/manus-storage/Mike_Zeck_f04a2656.jpg",
  "paul-pelletier": "/manus-storage/Paul_Pelletier_36b7b54f.jpg",
  "ryan-stegman": "/manus-storage/Ryan_Stegman_38906a3d.jpg",
  "scott-williams": "/manus-storage/Steve_Epting_1b6ba6d2.jpg",
  "steve-epting": "/manus-storage/Steve_Epting_1b6ba6d2.jpg",
  "steve-mcniven": "/manus-storage/Steve_McNiven_e2325a28.png",
  "whilce-portacio": "/manus-storage/Mark_Brooks_1f0e2187.jpg",
  "ryan-brown": "/manus-storage/Ryan_Stegman_38906a3d.jpg",

  // Sketch Card Artists with portraits
  "emrah-cildir": "/manus-storage/Emrah_Cildir_2eb60a98.jpg",
  "hector-barros": "/manus-storage/Hector_Barros_921672e7.jpg",
  "fabio-ramacci": "/manus-storage/Fabio_Ramacci_26d70f7f.jpg",
  "gary-shipman": "/manus-storage/Gary_Shipman_2dc4383d.jpg",
  "rich-hennemann": "/manus-storage/Rich_Hennemann_83e0c92a.jpg",
  "elvin-a-hernandez": "/manus-storage/Elvin_Hernandez_b2cf4b3c.jpg",
  "stephane-leonardi": "/manus-storage/Stephane_Leonardi_ddb33320.png",
  "matt-stewart": "/manus-storage/Matt_Stewart_3fe6bebb.jpg",
  "darrin-pepe": "/manus-storage/Darrin_Pepe_ecca3397.jpg",
  "jason-sobol": "/manus-storage/Jason_Sobol_451eb91b.jpg",
  "george-vega": "/manus-storage/George_Vega_f8726b04.jpg",
  "rustico-limosinero": "/manus-storage/Rustico_Limosinero_3a09f69c.jpg",
  "adam-fields": "/manus-storage/Adam_Fields_6c2eefdd.png",
  "bella-rachlin": "/manus-storage/Bella_Rachlin_36a5f44a.jpg",
  "chris-foreman": "/manus-storage/Chris_Foreman_7f88d709.png",
  "chris-meeks": "/manus-storage/Chris_Meeks_6a5a85a4.jpg",
  "daniel-riveron": "/manus-storage/Daniel_Riveron_26018781.jpg",
  "dove-mchargue": "/manus-storage/Dove_McHargue_94443885.jpg",
  "eddie-rhodes-iii": "/manus-storage/Eddie_Rhodes_III_97925a96.jpg",
  "eric-lehtonen": "/manus-storage/Eric_Lehtonen_2fb9f11c.jpg",
  "greg-kirkpatrick": "/manus-storage/Greg_Kirkpatrick_4c398a80.jpg",
  "jason-christner": "/manus-storage/Jason_Christner_26752b70.jpg",
  "jason-rodriguez": "/manus-storage/Jason_Rodriguez_98aad7b8.jpg",
  "jay-peteranetz": "/manus-storage/Jay_Peteranetz_7135dea3.jpg",
  "loc-nguyen": "/manus-storage/Loc_Nguyen_3a154d5d.jpg",
  "chenduz": "/manus-storage/Chenduz_d3cc74cd.jpg",
  "nick-gribbon": "/manus-storage/Nick_Gribbon_a1c1acfb.jpg",
  "peejay-catacutan": "/manus-storage/Peejay_Catacutan_93c09c7f.jpg",
  "ryan-finley": "/manus-storage/Ryan_Finley_db8737cb.jpg",
  "sherwin-santiago": "/manus-storage/Sherwin_Santiago_c3f03bc8.jpg",
};

// Short bios for each comic book auto artist
const ARTIST_BIOS: Record<string, { shortBio: string; fullBio: string; notableWorks: string[]; website?: string }> = {
  "frank-miller": {
    shortBio: "Legendary writer-artist who redefined Daredevil and created Sin City.",
    fullBio: "Frank Miller is one of the most influential creators in comic book history. His groundbreaking work on Daredevil in the 1980s — including the iconic 'Born Again' storyline — transformed the character and set a new standard for mature storytelling in superhero comics. Miller's noir-drenched art style and morally complex narratives earned him multiple Eisner Awards and cemented his legacy as a titan of the medium. His creator-owned Sin City and 300 series were later adapted into major Hollywood films.",
    notableWorks: ["Daredevil: Born Again", "The Dark Knight Returns", "Sin City", "Elektra: Assassin", "300"],
    website: "https://frankmillerink.com",
  },
  "jack-kirby": {
    shortBio: "The King of Comics — co-creator of the Fantastic Four, X-Men, Captain America, and hundreds more.",
    fullBio: "Jack Kirby is the undisputed King of Comics, co-creating an astonishing number of Marvel's most iconic characters alongside Stan Lee. The Fantastic Four, X-Men, Thor, Hulk, Iron Man, Black Panther, and the New Gods are just a fraction of his creative output. Kirby's dynamic, explosive art style — known as 'Kirby Krackle' — defined the visual language of superhero comics for generations. His work on the Fantastic Four directly inspired the 2025 Topps Finest set bearing their name.",
    notableWorks: ["Fantastic Four", "X-Men", "Captain America", "Thor", "New Gods", "Eternals"],
  },
  "bill-sienkiewicz": {
    shortBio: "Avant-garde painter and illustrator who revolutionized comic art with New Mutants and Elektra: Assassin.",
    fullBio: "Bill Sienkiewicz is one of the most innovative and boundary-pushing artists in comics history. His painted, mixed-media style — blending oil paint, collage, and expressionist techniques — brought a fine-art sensibility to mainstream comics that had never been seen before. His runs on New Mutants and Elektra: Assassin with Frank Miller are considered masterworks of the medium. Sienkiewicz's trading card work commands premium prices from collectors who recognize his unique artistic vision.",
    notableWorks: ["New Mutants", "Elektra: Assassin", "Moon Knight", "Daredevil: Love and War"],
  },
  "arthur-adams": {
    shortBio: "Fan-favorite artist celebrated for his ultra-detailed linework and iconic X-Men covers.",
    fullBio: "Arthur Adams, known affectionately as 'Art Adams' by fans, is one of the most beloved artists in Marvel history. His hyper-detailed, intricate linework and expressive character designs made his X-Men work in the 1980s an instant sensation. Adams has a rare ability to pack extraordinary detail into every panel while maintaining dynamic energy and storytelling clarity. His cover work is particularly prized by collectors, and his trading card appearances are consistently among the most sought-after pulls.",
    notableWorks: ["Uncanny X-Men Annual #9", "Longshot", "X-Men", "Fantastic Four"],
  },
  "jim-cheung": {
    shortBio: "Elite Marvel artist known for Young Avengers and Infinity — a master of clean, dynamic superhero art.",
    fullBio: "Jim Cheung is one of Marvel's premier artists, celebrated for his clean, precise linework and exceptional ability to convey both action and emotion. His defining run on Young Avengers introduced a generation of beloved characters to Marvel readers. Cheung's work on major events like Infinity and New Avengers showcased his ability to handle large casts and epic scale without sacrificing character detail. His trading card autographs are highly sought after by collectors who appreciate his polished, cinematic style.",
    notableWorks: ["Young Avengers", "Infinity", "New Avengers", "Avengers: The Children's Crusade"],
  },
  "adi-granov": {
    shortBio: "Photorealistic painter who defined the modern Iron Man look — his armor designs inspired the MCU films.",
    fullBio: "Adi Granov is the artist who defined the modern visual identity of Iron Man. His photorealistic painted style on Iron Man: Extremis with Warren Ellis created the sleek, high-tech armor aesthetic that directly influenced the MCU film franchise. Granov's cover work for Marvel is consistently stunning, blending technical precision with dramatic lighting that makes his pieces feel like movie posters. His trading card autographs are among the most visually distinctive in any Topps Marvel set.",
    notableWorks: ["Iron Man: Extremis", "Iron Man covers", "Invincible Iron Man"],
    website: "https://adigranov.net",
  },
  "marc-silvestri": {
    shortBio: "Co-founder of Image Comics and legendary X-Men artist — one of the most influential creators of the 1990s.",
    fullBio: "Marc Silvestri is a titan of 1990s comics, best known for his explosive, dynamic run on Uncanny X-Men and Wolverine. His bold, energetic style helped define the aesthetic of an era and made him one of the most popular artists in the industry. Silvestri went on to co-found Image Comics and create Witchblade and The Darkness through his Top Cow Productions imprint. His trading card autographs carry significant collector value, particularly among fans of the classic X-Men era.",
    notableWorks: ["Uncanny X-Men", "Wolverine", "Witchblade", "The Darkness"],
  },
  "greg-capullo": {
    shortBio: "Spawn and Batman artist — one of the most popular and recognizable styles in modern comics.",
    fullBio: "Greg Capullo is one of the most recognizable artists in modern comics, known for his bold, expressive style and incredible storytelling instincts. His decade-long run on Spawn with Todd McFarlane made him a household name, and his subsequent work on Batman with Scott Snyder — including the 'Court of Owls' and 'Death of the Family' arcs — is considered among the greatest Batman runs ever published. Capullo's dynamic, cinematic compositions make his trading card work instantly identifiable.",
    notableWorks: ["Batman (New 52)", "Spawn", "X-Force", "Dark Nights: Metal"],
  },
  "inhyuk-lee": {
    shortBio: "Korean cover artist whose hyper-detailed digital paintings are among the most collected in modern Marvel.",
    fullBio: "InHyuk Lee is one of the most in-demand cover artists working in comics today. His hyper-detailed digital paintings blend photorealistic rendering with dynamic superhero composition, creating covers that collectors immediately recognize and seek out. Lee's work has graced hundreds of Marvel titles, and his variant covers routinely command premium prices in the secondary market. His trading card autographs in Topps Marvel sets are among the most popular pulls for collectors who follow the modern cover art market.",
    notableWorks: ["Hundreds of Marvel variant covers", "Venom", "X-Men", "Avengers"],
  },
  "esad-ribic": {
    shortBio: "Painterly European master — his Thor: God of Thunder run is considered one of Marvel's greatest modern achievements.",
    fullBio: "Esad Ribić is a Croatian artist whose painterly, cinematic style has produced some of the most visually stunning Marvel comics of the modern era. His collaboration with Jason Aaron on Thor: God of Thunder is universally regarded as a masterpiece, bringing a mythic grandeur to the character that had never been achieved before. Ribić's work on Secret Wars further cemented his reputation as one of the most talented artists working in superhero comics. His trading card autographs are prized for their rarity and the prestige of his body of work.",
    notableWorks: ["Thor: God of Thunder", "Secret Wars", "Loki: Agent of Asgard", "Ultimate Comics: Thor"],
  },
  "adam-kubert": {
    shortBio: "Second-generation Marvel legend — his X-Men and Wolverine work defined the character for a generation.",
    fullBio: "Adam Kubert is part of one of comics' most celebrated artistic dynasties — the son of legendary artist Joe Kubert and brother of Andy Kubert. His dynamic, powerful style on X-Men and Wolverine in the 1990s made him one of Marvel's most popular artists. Kubert's ability to convey raw power and emotion through his linework is unmatched, and his covers are consistently among the most striking in any set he appears in. His trading card autographs carry strong collector demand from fans of the classic Marvel era.",
    notableWorks: ["X-Men", "Wolverine", "Ultimate X-Men", "Batman"],
  },
  "steve-mcniven": {
    shortBio: "Civil War and Old Man Logan artist — his clean, cinematic style defines modern Marvel storytelling.",
    fullBio: "Steve McNiven is one of Marvel's most celebrated artists, best known for his stunning work on Civil War with Mark Millar — one of the best-selling Marvel storylines of all time. His clean, detailed linework and exceptional ability to handle large ensemble casts made Civil War a visual spectacle. McNiven's subsequent work on Old Man Logan further cemented his reputation as a master of the medium. His trading card autographs are consistently among the most popular pulls in Topps Marvel sets.",
    notableWorks: ["Civil War", "Old Man Logan", "New Avengers", "Wolverine"],
  },
  "mark-brooks": {
    shortBio: "Acclaimed cover artist and interior penciler known for his elegant, detailed style across X-Men and Avengers.",
    fullBio: "Mark Brooks is one of Marvel's most versatile and accomplished artists, equally at home with interior penciling and cover work. His elegant, detailed style brings a sophisticated polish to everything he draws, from intimate character moments to large-scale action sequences. Brooks has worked extensively on X-Men, Avengers, and New Warriors titles, building a devoted following among collectors. His trading card autographs are sought after for the quality and consistency of his artistic output.",
    notableWorks: ["New Warriors", "X-Men", "Avengers", "Amazing Spider-Man"],
  },
  "lucio-parrillo": {
    shortBio: "Italian painter celebrated for his dramatic, painted covers — one of the most distinctive styles in modern comics.",
    fullBio: "Lucio Parrillo is an Italian artist whose dramatic, oil-painted style has made him one of the most distinctive cover artists working today. His rich, painterly compositions evoke classic fantasy illustration while bringing a modern sensibility to superhero and horror characters. Parrillo's work for Dynamite Entertainment on Vampirella, Red Sonja, and Conan has earned him a devoted international following. His trading card autographs are particularly prized by collectors who appreciate fine art aesthetics in their hobby.",
    notableWorks: ["Vampirella covers", "Red Sonja", "Conan", "Marvel covers"],
  },
  "ryan-stegman": {
    shortBio: "Superior Spider-Man and Venom artist — his kinetic, expressive style brings Marvel's most intense stories to life.",
    fullBio: "Ryan Stegman is one of Marvel's most energetic and expressive artists, best known for his defining work on Superior Spider-Man and Venom. His kinetic, dynamic style perfectly captures the intensity and chaos of Marvel's most visceral stories, and his character designs — particularly for Carnage and the Symbiote characters — have become definitive. Stegman's trading card autographs are popular with collectors who follow the modern Marvel era and appreciate artists who bring genuine passion to their work.",
    notableWorks: ["Superior Spider-Man", "Venom", "Scarlet Spider", "Fantastic Four"],
  },
  "ed-mcguinness": {
    shortBio: "Hulk and Superman artist known for his bold, cartoonish style that makes every character look impossibly powerful.",
    fullBio: "Ed McGuinness is one of the most recognizable artists in superhero comics, known for his bold, exaggerated style that makes every character look like they were carved from granite. His thick linework, massive muscles, and dynamic compositions give his pages an almost animated quality that readers either love immediately or grow to love over time. McGuinness's runs on Hulk, Superman, and Deadpool are fan favorites, and his trading card autographs are popular with collectors who appreciate his distinctive visual approach.",
    notableWorks: ["Hulk", "Superman", "Deadpool", "Amazing X-Men"],
  },
  "greg-horn": {
    shortBio: "Photorealistic digital painter whose Marvel covers are among the most iconic of the 2000s.",
    fullBio: "Greg Horn is a digital painter whose photorealistic, highly polished style produced some of the most striking Marvel covers of the early 2000s. His She-Hulk and Emma Frost covers became iconic images of that era, and his ability to blend photographic realism with superhero aesthetics made his work instantly recognizable on newsstands. Horn's trading card autographs are collected by fans who appreciate the painterly, gallery-quality aesthetic he brings to the hobby.",
    notableWorks: ["She-Hulk covers", "Emma Frost", "Ms. Marvel", "Marvel covers"],
  },
  "mike-zeck": {
    shortBio: "Classic Marvel artist — his Secret Wars and Kraven's Last Hunt work are among the most beloved stories in Marvel history.",
    fullBio: "Mike Zeck is a classic Marvel artist whose work in the 1980s produced some of the most beloved stories in the publisher's history. His clean, powerful style on Captain America and Secret Wars defined those characters for a generation of readers. Zeck's collaboration with J.M. DeMatteis on Kraven's Last Hunt is universally regarded as one of the greatest Spider-Man stories ever told. His trading card autographs carry strong nostalgic value for collectors who grew up with his work.",
    notableWorks: ["Secret Wars", "Kraven's Last Hunt", "Captain America", "Punisher"],
  },
  "derrick-chew": {
    shortBio: "Rising star cover artist whose vibrant, detailed style has made him one of Marvel's most popular variant cover artists.",
    fullBio: "Derrick Chew is one of Marvel's most exciting contemporary cover artists, known for his vibrant colors, intricate detail work, and ability to capture the essence of a character in a single striking image. His variant covers have become highly sought after by collectors, with some issues featuring his work commanding significant premiums in the secondary market. Chew's trading card autographs represent an opportunity to collect a signature from an artist at the height of his rising career.",
    notableWorks: ["X-Men variant covers", "Spider-Man variant covers", "Avengers variant covers"],
  },
  "joshua-cassara": {
    shortBio: "X-Men and Wolverine artist whose gritty, detailed style brings Marvel's most intense stories to life.",
    fullBio: "Joshua Cassara is a contemporary Marvel artist celebrated for his gritty, detailed style that perfectly suits the darker corners of the Marvel Universe. His work on X-Force, Wolverine, and Cable has earned him a devoted following among fans who appreciate artists who can convey both brutal action and emotional depth. Cassara's trading card autographs are popular with collectors following the current generation of Marvel talent.",
    notableWorks: ["X-Force", "Wolverine", "Cable", "Amazing Spider-Man"],
  },
  "mark-bagley": {
    shortBio: "Ultimate Spider-Man artist — his record-breaking run with Brian Michael Bendis defined a generation of Marvel readers.",
    fullBio: "Mark Bagley holds the record for the longest consecutive run by a penciler on a single Marvel title, drawing 111 consecutive issues of Ultimate Spider-Man with Brian Michael Bendis. That run introduced Miles Morales's predecessor Peter Parker to a new generation and is considered one of the greatest Spider-Man stories ever told. Bagley's clean, expressive style is perfectly suited to superhero storytelling, and his trading card autographs are among the most accessible and beloved in the hobby.",
    notableWorks: ["Ultimate Spider-Man", "Amazing Spider-Man", "New Warriors", "Trinity"],
  },
  "mike-mayhew": {
    shortBio: "Painted cover artist known for his stunning, realistic portrayals of Marvel's most iconic characters.",
    fullBio: "Mike Mayhew is a painted artist whose realistic, detailed style has produced some of Marvel's most striking covers and interior pages. His work blends photographic reference with painterly technique to create images that feel both grounded and fantastical. Mayhew has worked extensively across Marvel's catalog, and his trading card autographs are collected by fans who appreciate the fine art quality he brings to the hobby.",
    notableWorks: ["Star Wars covers", "X-Men", "Avengers", "Thor"],
  },
  "steve-epting": {
    shortBio: "Captain America: The Winter Soldier artist — his cinematic, realistic style helped define the modern Marvel aesthetic.",
    fullBio: "Steve Epting is the artist who helped define the modern era of Captain America alongside writer Ed Brubaker. His realistic, cinematic style perfectly suited the espionage-thriller tone of their run, which introduced the Winter Soldier and is considered one of the greatest Captain America stories ever told. Epting's clean, detailed linework brings a grounded, serious quality to superhero stories that collectors and readers deeply appreciate.",
    notableWorks: ["Captain America: The Winter Soldier", "Avengers", "Fantastic Four", "Velvet"],
  },
  "ariel-diaz": {
    shortBio: "Contemporary artist known for dynamic, expressive work across Marvel's superhero catalog.",
    fullBio: "Ariel Diaz is a contemporary comic book artist whose dynamic, expressive style has earned recognition across Marvel's publishing line. Known for bringing energy and personality to every page, Diaz's work demonstrates a strong command of character expression and action choreography. Her trading card autographs represent an opportunity to collect from a talented artist building an impressive body of work in the Marvel Universe.",
    notableWorks: ["Marvel variant covers", "Various Marvel titles"],
  },
  "e-m-gist": {
    shortBio: "Acclaimed painter and illustrator known for hauntingly beautiful covers across Marvel and beyond.",
    fullBio: "E.M. Gist is a painter and illustrator whose hauntingly beautiful, atmospheric style has made him one of the most distinctive cover artists working in comics today. His ability to create mood and atmosphere through color and light gives his work a quality that stands apart from typical superhero illustration. Gist's trading card autographs are collected by fans who appreciate fine art sensibility in their hobby.",
    notableWorks: ["Marvel covers", "Horror covers", "Various painted works"],
  },
  "mike-mckone": {
    shortBio: "Teen Titans and Amazing Spider-Man artist known for his clean, expressive superhero style.",
    fullBio: "Mike McKone is a veteran comic book artist whose clean, expressive style has graced some of Marvel and DC's most beloved titles. His work on Teen Titans and Amazing Spider-Man earned him a devoted following, and his ability to convey character personality through body language and facial expression makes his pages a pleasure to read. McKone's trading card autographs are popular with collectors who appreciate classic superhero art.",
    notableWorks: ["Teen Titans", "Amazing Spider-Man", "Exiles", "Avengers: The Initiative"],
  },
  "paul-pelletier": {
    shortBio: "Veteran Marvel artist known for his work on Annihilation, Guardians of the Galaxy, and Fantastic Four.",
    fullBio: "Paul Pelletier is a veteran Marvel artist whose dynamic, detailed style has served some of the publisher's most ambitious cosmic storylines. His work on Annihilation and Guardians of the Galaxy helped define the modern cosmic Marvel Universe, and his Fantastic Four run brought a classic sensibility to Marvel's First Family. Pelletier's trading card autographs are collected by fans of Marvel's cosmic era and classic superhero storytelling.",
    notableWorks: ["Annihilation", "Guardians of the Galaxy", "Fantastic Four", "War of Kings"],
  },
  "ryan-brown": {
    shortBio: "Classic TMNT and Marvel artist known for his energetic, fun style across action and adventure titles.",
    fullBio: "Ryan Brown is a veteran artist best known for his work on Teenage Mutant Ninja Turtles and various Marvel titles. His energetic, fun style brings a kinetic quality to action sequences and a warmth to character moments. Brown's trading card autographs connect collectors to a piece of comics history from an artist who helped shape beloved franchises.",
    notableWorks: ["Teenage Mutant Ninja Turtles", "Various Marvel titles"],
  },
  "scott-williams": {
    shortBio: "Master inker whose work over Jim Lee and other top pencilers defined the look of 1990s Marvel.",
    fullBio: "Scott Williams is one of the most accomplished inkers in comics history, best known for his long collaboration with Jim Lee on X-Men and WildC.A.T.S. Williams's precise, clean inking style enhances pencil art without overpowering it, and his work helped define the polished aesthetic of 1990s superhero comics. His trading card autographs are sought after by collectors who appreciate the craft of inking and the artists who perfect it.",
    notableWorks: ["X-Men (with Jim Lee)", "WildC.A.T.S.", "Batman: Hush", "Superman"],
  },
  "whilce-portacio": {
    shortBio: "X-Factor and Uncanny X-Men artist — one of the founders of Image Comics and a legend of 1990s Marvel.",
    fullBio: "Whilce Portacio is one of the most important artists of the 1990s Marvel era, known for his dynamic, energetic style on Uncanny X-Men and X-Factor. Portacio co-created Bishop, one of the most significant X-Men characters of that decade. He was also one of the founding members of Image Comics, helping to reshape the industry. His trading card autographs carry strong nostalgic value for collectors who grew up with his defining X-Men work.",
    notableWorks: ["Uncanny X-Men", "X-Factor", "Wetworks", "Bishop (co-creator)"],
  },

  // === SKETCH CARD ARTISTS ===
  "emrah-cildir": {
    shortBio: "Elite sketch card artist known for his highly detailed, photorealistic Marvel character portraits in premium Topps sets.",
    fullBio: "Emrah Cildir is an elite-tier sketch card artist celebrated for his incredibly detailed and photorealistic character portraits. He has contributed stunning 1/1 original artwork to premium Topps Marvel releases, including 2025 Topps Chrome Marvel Studios and 2026 Topps Finest Fantastic Four. With massive collector demand, his Marvel sketch cards are highly sought after worldwide.",
    notableWorks: ["2025 Topps Chrome Marvel Studios", "2025 Topps Chrome Deadpool", "2026 Topps Finest Fantastic Four"],
    website: "https://www.instagram.com/artofemrahcildir/",
  },
  "hector-barros": {
    shortBio: "Talented sketch card artist known for dynamic illustrations and highly sought-after 1/1 sketch cards in premium Topps Marvel sets.",
    fullBio: "Hector Barros is a talented sketch card artist known for his dynamic illustrations and character redesigns in Topps Marvel products. His notable work includes highly sought-after 1/1 sketch cards in premium sets like 2025 Topps Chrome Marvel Studios, 2026 Topps Finest Fantastic Four, and 2026 Topps Brooklyn Collection Marvel. With a style influenced by comic book legends and pop culture, Barros brings iconic Marvel characters to life with striking detail and vibrant energy.",
    notableWorks: ["2025 Topps Chrome Marvel Studios", "2026 Topps Finest Fantastic Four", "2026 Topps Brooklyn Collection Marvel"],
  },
  "alcione-silva": {
    shortBio: "Brazilian sketch card artist known for detailed, comic-inspired illustrations in premium Topps Marvel sets.",
    fullBio: "Alcione Silva is a talented sketch card artist from São Paulo, Brazil, known for their detailed, comic-inspired illustration style. They have contributed impressive original artwork to major Topps Marvel releases, including the 2026 Topps Finest Fantastic Four 65th Anniversary set and Topps Chrome Marvel Comics. Their highly sought-after sketch cards feature dynamic character portraits that capture the essence of iconic Marvel heroes.",
    notableWorks: ["2026 Topps Finest Fantastic Four", "2026 Topps Chrome Marvel Comics", "2025 Topps Marvel Chrome"],
    website: "https://www.instagram.com/alcione.art/",
  },
  "mirko-di-noia": {
    shortBio: "Accomplished comic artist and illustrator known for detailed pen and ink sketch cards in premium Topps Marvel sets.",
    fullBio: "Mirko Di Noia is a talented comic book artist and illustrator who has made a significant impact in the sketch card community with his work on Topps Marvel products. Known for his detailed pen and ink style, he has contributed stunning 1/1 sketch cards to premium sets like 2025 Topps Chrome Deadpool, 2025 Topps The Collector Arthouse, and the 2026 Topps Finest Fantastic Four 65th Anniversary collection.",
    notableWorks: ["2025 Topps Chrome Deadpool", "2025 Topps The Collector Arthouse", "2026 Topps Finest Fantastic Four"],
    website: "https://www.instagram.com/mirkodinoia_art/",
  },
  "gabriel-tardivo": {
    shortBio: "Elite sketch card artist known for detailed, photorealistic Marvel portraits in premium Topps sets.",
    fullBio: "Gabriel Tardivo is a highly regarded sketch card artist known for his detailed, photorealistic style and dynamic character portraits. He has contributed exceptional 1/1 original artwork to premium Topps Marvel products, including 2026 Topps Finest Fantastic Four, 2025 Topps Chrome Marvel Studios, and Topps Marvel Comic Book Heroes. His striking illustrations have made his sketch cards highly sought after by Marvel collectors.",
    notableWorks: ["2026 Topps Finest Fantastic Four", "2025 Topps Chrome Marvel Studios", "Topps Marvel Comic Book Heroes"],
    website: "https://www.instagram.com/gabriel_desenho/",
  },
  "fabio-ramacci": {
    shortBio: "Versatile comic artist who brings his dynamic illustration style to official Marvel character sketch cards for Topps.",
    fullBio: "Fabio Ramacci is a versatile comic book artist known for his work across various publishers. He has brought his dynamic illustration style to the sketch card community, creating original artwork for Topps Marvel products. His notable contributions include official character sketch cards for the 2026 Topps Finest Fantastic Four set and the Marvel Cinema series.",
    notableWorks: ["2026 Topps Finest Fantastic Four", "Topps Marvel Cinema", "2025 Topps Chrome Sapphire Edition Marvel Studios"],
    website: "https://www.instagram.com/fabioramacciart/",
  },
  "marco-carrillo": {
    shortBio: "Motion graphics artist and illustrator known for dynamic, hand-drawn sketch cards in premium Topps Marvel sets.",
    fullBio: "Marco Carrillo is a talented motion graphics artist and illustrator based in Chicago, known for his dynamic digital art and illustration work. He has become a sought-after sketch card artist for Topps Marvel products, contributing highly detailed, hand-drawn character portraits. His notable work includes 1/1 sketch cards for premium sets like 2025 Topps Chrome Marvel Studios and 2026 Topps Finest Fantastic Four.",
    notableWorks: ["2025 Topps Chrome Marvel Studios", "2026 Topps Finest Fantastic Four", "2026 Topps Chrome Marvel Comics"],
  },
  "gary-shipman": {
    shortBio: "Self-taught comic artist known for his distinctive sketch cards in premium Topps Marvel sets.",
    fullBio: "Gary Shipman is a self-taught artist and comic book illustrator who has contributed sketch cards to numerous Topps Marvel trading card sets. His notable Topps Marvel projects include the 2026 Marvel Comics Chrome, 2026 Fantastic Four 65th Topps Finest, and 2025 Topps Finest X-Men '97. Known for his distinctive style, Shipman has built a strong following in the sketch card community and regularly shares his art process through live streams.",
    notableWorks: ["2026 Marvel Comics Chrome", "2026 Topps Finest Fantastic Four", "2025 Topps Finest X-Men '97"],
    website: "https://www.garyshipmanart.com",
  },
  "rich-hennemann": {
    shortBio: "Accomplished artist and illustrator known for detailed sketch card work on premium Topps Marvel products.",
    fullBio: "Rich Hennemann is an accomplished artist and illustrator specializing in commercial illustrations, comics, and trading cards. He is highly regarded for his detailed sketch card work on premium Topps Marvel products, including 2025 Topps Chrome Marvel and 2026 Topps Marvel Finest The Fantastic Four 65th Anniversary. His impressive portfolio showcases his ability to capture iconic Marvel characters with striking precision.",
    notableWorks: ["2025 Topps Chrome Marvel", "2026 Topps Finest Fantastic Four"],
    website: "https://www.richhennemann.com",
  },
  "elvin-a-hernandez": {
    shortBio: "Extraordinary illustrator and educator known for bold lines, vibrant colors, and dynamic comic-style sketch cards in Topps Marvel sets.",
    fullBio: "Elvin A. Hernandez is an extraordinary illustrator and educator whose bold lines, vibrant colors, and imaginative storytelling make his sketch cards truly unforgettable. From dynamic superheroes to fantastical worlds, his comic-style illustrations pull you right into the heart of the action. He is highly sought after for his exceptional work on Topps Marvel products, including the Topps Chrome Marvel and Topps Finest Fantastic Four sets.",
    notableWorks: ["2025 Topps Chrome Marvel", "2026 Topps Finest Fantastic Four"],
    website: "https://www.instagram.com/eahernandez_art",
  },
  "rodel-martin": {
    shortBio: "Premier sketch card artist celebrated for highly detailed, photorealistic character portraits in premium Topps Marvel sets.",
    fullBio: "Rodel Martin is a highly sought-after sketch card artist known for his detailed, photorealistic portraits and dynamic character illustrations in Topps Marvel products. His impressive body of work includes highly coveted 1/1 sketch cards in premium sets like 2025 Topps Chrome Marvel Studios, 2025 Topps Marvel Comic Book Heroes, and 2026 Topps Finest Fantastic Four 65th Anniversary. With a background in animation and comic illustration, Martin brings a cinematic quality to his Marvel sketch cards.",
    notableWorks: ["2025 Topps Chrome Marvel Studios", "2025 Topps Marvel Comic Book Heroes", "2026 Topps Finest Fantastic Four"],
  },
  "angelo-de-capua": {
    shortBio: "Brazilian freelance illustrator and traditional artist known for detailed, hand-painted sketch cards in premium Topps Marvel sets.",
    fullBio: "Angelo De Capua is a Brazilian freelance illustrator and concept artist known for his traditional art style using pencil, gouache, acrylics, and color pencil. He is a prolific sketch card artist who has contributed highly sought-after, photorealistic 1-of-1 sketch cards to numerous Topps Marvel sets. His notable work includes contributions to premium releases like Topps Finest Fantastic Four, Topps Chrome Deadpool, and Topps Marvel Gallery Collection.",
    notableWorks: ["2026 Topps Finest Fantastic Four", "2025 Topps Chrome Deadpool", "2026 Topps Chrome Marvel Comics"],
    website: "https://www.instagram.com/angelodecapuasart/",
  },
  "leon-braojos": {
    shortBio: "Skilled freelance illustrator from Mexico known for detailed character portraits in premium Topps Marvel sketch card sets.",
    fullBio: "Leon Braojos is a talented freelance illustrator based in Mexico City who has built a strong reputation in the sketch card community. He is highly regarded for his detailed and dynamic character portraits, frequently contributing to premium Topps Marvel releases. His notable work includes stunning sketch cards for 2025 Topps Chrome Marvel Studios, 2026 Topps Finest Fantastic Four, and Topps Marvel Cinema.",
    notableWorks: ["2025 Topps Chrome Marvel Studios", "2026 Topps Finest Fantastic Four", "Topps Marvel Cinema"],
    website: "https://www.instagram.com/leonbraojos.sketchcards/",
  },
  "andy-tiu": {
    shortBio: "Digital comic colorist and sketch card artist known for detailed and vibrant 1/1 original art in Topps Marvel trading card sets.",
    fullBio: "Andy Tiu is a talented digital comic colorist, letterer, and sketch card artist known for his dynamic work on Topps Marvel trading cards. His notable contributions include original 1/1 sketch cards for premium sets like 2025 Topps Chrome Marvel Studios and 2026 Topps Finest Fantastic Four 65th Anniversary. Tiu's vibrant and detailed art style brings iconic Marvel characters to life, making his sketch cards highly sought after by collectors.",
    notableWorks: ["2025 Topps Chrome Marvel Studios", "2026 Topps Finest Fantastic Four"],
  },
  "stephane-leonardi": {
    shortBio: "Paris-based sketch card artist and illustrator known for his hybrid traditional-digital style in premium Topps Marvel sets.",
    fullBio: "Stephane Leonardi is a talented sketch card artist and illustrator based in Paris, France. Passionate about pop culture, he blends traditional mediums with digital tools to create a unique hybrid look and feel. He is an official sketch card artist for Topps, contributing highly sought-after artwork to premium Marvel sets like Topps Marvel Mint and Topps Marvel Chrome.",
    notableWorks: ["2026 Topps Finest Fantastic Four", "2025 Topps Marvel Mint", "2025 Topps Marvel Chrome"],
    website: "https://www.stephaneleonardi.com",
  },
  "benjamin-lombart": {
    shortBio: "UK-based official Topps artist known for highly detailed, realistic Marvel character portraits using colored pencils and markers.",
    fullBio: "Benjamin Lombart is a UK-based artist and official Topps sketch card illustrator known for his highly detailed, realistic portraits using colored pencils, Copic markers, and acrylic paints. He has contributed original artwork to several major Topps Marvel releases, including the 2026 Topps Finest Fantastic Four 65th Anniversary set and 2025 Topps Chrome Deadpool. His vibrant, photorealistic style brings iconic Marvel characters to life on premium trading cards.",
    notableWorks: ["2026 Topps Finest Fantastic Four", "2025 Topps Chrome Deadpool", "2026 Topps Chrome Marvel"],
    website: "https://www.instagram.com/bml_art/",
  },
  "gabe-farber": {
    shortBio: "Toronto-based freelance illustrator and sketch card artist known for photorealistic portraits in premium Topps Marvel sets.",
    fullBio: "Gabe Farber is a freelance illustrator and sketch card artist from Toronto, Canada, and a graduate of George Brown College's School of Design. He is highly regarded for his photorealistic portraiture and top-notch artwork in the trading card industry. Farber has contributed exceptional sketch cards to major Topps Marvel releases, including the 2025 Topps Chrome Marvel and 2026 Topps Finest Fantastic Four sets.",
    notableWorks: ["2025 Topps Chrome Marvel", "2026 Topps Finest Fantastic Four"],
    website: "https://gabe-farber.format.com/",
  },
  "matt-stewart": {
    shortBio: "Traditional illustrator and contracted Topps artist since 2014, known for detailed sketch cards in premium Marvel sets.",
    fullBio: "Matt Stewart is a versatile illustrator and designer based in Calgary, Alberta, who has been a contracted Topps artist since 2014. Working primarily with traditional media like markers, inks, gouache, and acrylics, he creates highly detailed sketch cards for premium trading card sets. His notable Topps Marvel work includes contributions to 2025 Topps Chrome Marvel Studios and 2026 Topps Finest Fantastic Four.",
    notableWorks: ["2025 Topps Chrome Marvel Studios", "2026 Topps Finest Fantastic Four"],
    website: "https://mattstewartillustrations.com/",
  },
  "roy-cover": {
    shortBio: "Prolific sketch card artist known for detailed, high-quality character portraits in Topps Marvel sets like Finest and Chrome.",
    fullBio: "Roy Cover is a prolific sketch card artist and illustrator known for his detailed, high-quality character portraits. He has contributed to numerous Topps Marvel trading card sets, including Topps Finest Fantastic Four, Topps Finest X-Men '97, and Topps Chrome Deadpool. His work is highly sought after by collectors for its striking realism and dynamic comic art style.",
    notableWorks: ["2026 Topps Finest Fantastic Four", "2025 Topps Finest X-Men '97", "2025 Topps Chrome Deadpool"],
    website: "https://www.instagram.com/justice4meonly/",
  },
  "darrin-pepe": {
    shortBio: "Professional illustrator and graphic designer known for bold ink shading and expressive character work in premium Topps Marvel sets.",
    fullBio: "Darrin Pepe is a professional illustrator and graphic designer who brings his extensive experience in digital and print media to the world of sketch cards. Known for his bold ink shading, gritty textures, and expressive character work, he has become a highly sought-after artist in the Topps Marvel community. His exceptional 1/1 original art can be found across premium releases like Topps Finest Fantastic Four and Topps Chrome Marvel Studios.",
    notableWorks: ["2026 Topps Finest Fantastic Four", "2025 Topps Chrome Marvel Studios", "2025 Topps Finest X-Men '97"],
    website: "https://www.instagram.com/darrinpepeart/",
  },
  "jason-sobol": {
    shortBio: "Veteran illustrator and sketch card artist known for detailed, expressive character portraits in premium Topps Marvel sets.",
    fullBio: "Jason Sobol is a Master of Fine Arts graduate from the Savannah College of Art and Design with over 20 years of illustration experience. He is a highly sought-after sketch card artist known for his detailed, expressive portraits in premium Topps Marvel products. His notable work includes highly limited 1/1 sketch cards in sets like Topps Marvel Finest and Topps Chrome Marvel.",
    notableWorks: ["2026 Topps Marvel Finest", "2025 Topps Chrome Marvel"],
    website: "https://www.jasonsobolart.com/",
  },
  "tim-shinn": {
    shortBio: "Versatile freelance illustrator known for bold inks and vibrant colors in Topps Marvel sketch card sets.",
    fullBio: "Tim Shinn is a versatile freelance illustrator and comic artist based in Richmond, Virginia. With a background in advertising and storyboarding, he brings dynamic energy and clean contours to his sketch card work. He is highly regarded for his contributions to Topps Marvel products, including the Finest Fantastic Four 65th Anniversary, Marvel Mint, and The Collector sets.",
    notableWorks: ["2026 Topps Finest Fantastic Four", "2025 Topps Marvel Mint", "2025 Topps Chrome Studios"],
    website: "https://www.instagram.com/timshinn73/",
  },
  "rebeca-louro": {
    shortBio: "Self-taught wildlife artist who brings her detailed acrylic and soft pastel style to premium Topps Marvel sketch cards.",
    fullBio: "Rebeca Louro is a self-taught wildlife and pet artist who has transitioned her talents into creating highly sought-after sketch cards for Topps. Known for her detailed acrylic and soft pastel work, she brings a unique, lifelike quality to her illustrations. Her notable contributions include stunning 1/1 sketch cards for premium Topps Marvel sets like 2026 Topps Finest Fantastic Four and 2025 Topps Chrome Marvel Studios.",
    notableWorks: ["2026 Topps Finest Fantastic Four", "2025 Topps Chrome Marvel Studios", "2025 Topps Chrome Deadpool"],
    website: "https://www.instagram.com/becalouro.art/",
  },
  "bete-rodrigues": {
    shortBio: "Brazilian illustrator and official sketch card artist known for highly detailed, traditional artwork in premium Topps Marvel sets.",
    fullBio: "Bete Rodrigues is a Brazilian illustrator, penciller, and comic colorist who has become a highly sought-after sketch card artist for Topps Marvel products. Her work is characterized by exceptional attention to detail and a traditional, manual approach. She has contributed stunning original artwork to premium releases including 2025 Topps Chrome Marvel Studios, 2025 Topps Chrome Deadpool, and 2026 Topps Finest Fantastic Four.",
    notableWorks: ["2025 Topps Chrome Marvel Studios", "2025 Topps Chrome Deadpool", "2026 Topps Finest Fantastic Four"],
  },
  "george-vega": {
    shortBio: "Accomplished illustrator and comic book artist known for detailed traditional sketch cards in premium Topps Marvel sets.",
    fullBio: "George Vega is an accomplished freelance illustrator and comic book artist known for his highly detailed, traditional pen-and-ink and color illustration style. He has created an estimated 1,500+ official sketch cards, contributing heavily to Topps Marvel trading card sets. His notable work includes premium sketch cards for Topps Chrome Marvel Studios, Marvel Cinema, and the Marvel Comic Book Heroes 1975 Golden Anniversary series.",
    notableWorks: ["Topps Chrome Marvel Studios", "Marvel Cinema", "Marvel Comic Book Heroes Golden Anniversary"],
    website: "https://www.georgevegaart.com/",
  },
  "rustico-limosinero": {
    shortBio: "Talented sketch card artist known for his hand-drawn original art in Topps Marvel sets.",
    fullBio: "Rustico Limosinero is a talented sketch card artist and graphic designer known for his hand-drawn original art. He has contributed his artistic skills to several high-profile Topps Marvel products, creating highly collectible 1/1 sketch cards. His notable work includes contributions to the 2026 Topps Marvel Finest The Fantastic Four 65th Anniversary and 2025 Topps Marvel Studios Chrome sets.",
    notableWorks: ["2026 Topps Finest Fantastic Four", "2025 Topps Marvel Studios Chrome"],
    website: "https://www.instagram.com/rusticolimosinero/",
  },
  "jojo-hilario": {
    shortBio: "Freelance artist from the Philippines known for detailed, dynamic 1/1 sketch cards in premium Topps Marvel sets.",
    fullBio: "Jojo Hilario is a freelance artist from Manila, Philippines, who has become a highly sought-after sketch card artist for Topps Marvel products. He is known for his detailed, dynamic character illustrations and has contributed original 1/1 sketch cards to premium sets like 2025 Topps Chrome Marvel Studios and 2026 Topps Finest Fantastic Four 65th Anniversary. His work often features striking foil variants, including highly collectible Silver and Gold foil sketches of iconic Marvel characters.",
    notableWorks: ["2025 Topps Chrome Marvel Studios", "2025 Topps Chrome Deadpool", "2026 Topps Finest Fantastic Four"],
  },
  "nick-sutphin": {
    shortBio: "Nebraska-based sketch card artist known for his original artwork on Topps Marvel products.",
    fullBio: "Nick Sutphin is a Nebraska-based sketch card artist known for his work on Topps trading cards. He has contributed original artwork to various Topps properties, including MLB, Star Wars, Disney, and Marvel products. His notable Marvel work includes sketch cards for the 2026 Topps Finest Fantastic Four 65th Anniversary set.",
    notableWorks: ["2026 Topps Finest Fantastic Four"],
    website: "https://www.instagram.com/nicksutphinart/",
  },
};

function nameToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[éèêë]/g, "e")
    .replace(/[áàâä]/g, "a")
    .replace(/[íìîï]/g, "i")
    .replace(/[óòôö]/g, "o")
    .replace(/[úùûü]/g, "u")
    .replace(/ć/g, "c")
    .replace(/ñ/g, "n")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function ArtistProfile() {
  const { slug } = useParams<{ slug: string }>();

  const artist = useMemo(
    () => ARTISTS.find((a) => nameToSlug(a.name) === slug),
    [slug]
  );

  const tierInfo = useMemo(
    () => artist ? TIERS.find((t) => t.name === artist.tier) : null,
    [artist]
  );

  const bio = useMemo(() => artist ? ARTIST_BIOS[nameToSlug(artist.name)] : null, [artist]);
  const portrait = useMemo(() => artist ? ARTIST_PORTRAITS[nameToSlug(artist.name)] : null, [artist]);

  // Fetch cards by this artist from the database (search by artist name)
  const { data: artistCards } = trpc.public.marvel.search.useQuery(
    { query: artist?.name ?? "", limit: 50 },
    { enabled: !!artist }
  );

  if (!artist) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Artist Not Found</h1>
          <Link href="/artists">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Artist Directory
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Hero Header */}
      <div
        className="relative py-16 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, #0a0a0f 0%, ${tierInfo?.bgColor ?? "rgba(255,215,0,0.05)"} 50%, #0a0a0f 100%)`,
          borderBottom: `1px solid ${tierInfo?.borderColor ?? "rgba(255,215,0,0.2)"}`,
        }}
      >
        {/* Subtle grid background */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(${tierInfo?.color ?? "#FFD700"} 1px, transparent 1px), linear-gradient(90deg, ${tierInfo?.color ?? "#FFD700"} 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        <div className="container max-w-5xl relative z-10">
          {/* Back link */}
          <Link href="/artists" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-8 text-sm">
            <ArrowLeft className="w-4 h-4" />
            Artist Directory
          </Link>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Portrait */}
            <div className="flex-shrink-0">
              <div
                className="w-48 h-48 rounded-2xl overflow-hidden border-2"
                style={{ borderColor: tierInfo?.borderColor ?? "rgba(255,215,0,0.4)", boxShadow: `0 0 30px ${tierInfo?.glowColor ?? "rgba(255,215,0,0.2)"}` }}
              >
                {portrait ? (
                  <img
                    src={portrait}
                    alt={artist.name}
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-white/5">
                    <Palette className="w-16 h-16 text-white/20" />
                  </div>
                )}
              </div>
            </div>

            {/* Name + Tier + Short Bio */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <Badge
                  className="text-xs font-bold px-3 py-1 border"
                  style={{
                    background: tierInfo?.bgColor,
                    borderColor: tierInfo?.borderColor,
                    color: tierInfo?.color,
                  }}
                >
                  {tierInfo?.icon} {artist.tier}
                </Badge>
                <Badge variant="outline" className="text-xs border-white/20 text-white/60">
                  {artist.category}
                </Badge>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{artist.name}</h1>

              {bio?.shortBio && (
                <p className="text-lg text-white/70 leading-relaxed max-w-2xl">{bio.shortBio}</p>
              )}

              {bio?.website && (
                <a
                  href={bio.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-4 text-sm text-white/50 hover:text-white transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  Official Website
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-5xl py-12 space-y-12">

        {/* TBA State - shown when no bio exists */}
        {!bio && (
          <section>
            <div className="bg-white/3 border border-white/10 rounded-xl p-8 text-center">
              <div className="flex flex-col items-center gap-4">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: tierInfo?.bgColor, border: `2px solid ${tierInfo?.borderColor}` }}
                >
                  <Palette className="w-8 h-8" style={{ color: tierInfo?.color }} />
                </div>
                <h2 className="text-xl font-bold text-white">Full Portfolio Coming Soon</h2>
                <p className="text-white/50 text-sm max-w-md leading-relaxed">
                  We're building out {artist.name}'s full artist profile — including their bio, notable works, and gallery of sketch cards from Topps Marvel sets. Check back soon.
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge
                    className="text-xs font-bold px-3 py-1 border"
                    style={{
                      background: tierInfo?.bgColor,
                      borderColor: tierInfo?.borderColor,
                      color: tierInfo?.color,
                    }}
                  >
                    {tierInfo?.icon} {artist.tier} Tier Artist
                  </Badge>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Full Bio */}
        {bio?.fullBio && (
          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Star className="w-5 h-5" style={{ color: tierInfo?.color }} />
              About {artist.name}
            </h2>
            <div className="bg-white/3 border border-white/10 rounded-xl p-6">
              <p className="text-white/80 leading-relaxed text-base">{bio.fullBio}</p>
            </div>
          </section>
        )}

        {/* Two-column: Notable Works + Topps Products */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Notable Works */}
          {bio?.notableWorks && bio.notableWorks.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-white mb-4">Notable Works</h2>
              <div className="bg-white/3 border border-white/10 rounded-xl p-6 space-y-2">
                {bio.notableWorks.map((work) => (
                  <div key={work} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: tierInfo?.color }} />
                    <span className="text-white/80 text-sm">{work}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Topps Products */}
          {artist.sets && artist.sets.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-white mb-4">Topps Products</h2>
              <div className="bg-white/3 border border-white/10 rounded-xl p-6 space-y-3">
                {artist.sets.map((set) => {
                  const setSlug = set
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/^-|-$/g, "");
                  return (
                    <Link
                      key={set}
                      href={`/cards/${setSlug}`}
                      className="flex items-center gap-3 group"
                    >
                      <CreditCard className="w-4 h-4 flex-shrink-0 text-white/40 group-hover:text-white/80 transition-colors" />
                      <span className="text-white/70 text-sm group-hover:text-white transition-colors">{set}</span>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}
        </div>

        {/* Cards in Database */}
        {artistCards && Array.isArray(artistCards) && artistCards.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5" style={{ color: tierInfo?.color }} />
              Cards in the NLF Database
              <span className="text-sm font-normal text-white/40 ml-2">({artistCards.length} found)</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {artistCards.slice(0, 20).map((card) => (
                <div
                  key={card.id}
                  className="group bg-white/3 border border-white/10 rounded-lg p-3"
                >
                  {card.imageUrl && (
                    <img
                      src={card.imageUrl}
                      alt={card.characterName}
                      className="w-full aspect-[2/3] object-cover rounded-md mb-2 opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                  )}
                  <p className="text-white/70 text-xs font-medium group-hover:text-white transition-colors line-clamp-2">{card.characterName}</p>
                  <p className="text-white/30 text-xs mt-0.5">#{card.cardNumber}</p>
                  {card.setName && <p className="text-white/20 text-xs mt-0.5 truncate">{card.setName}</p>}
                </div>
              ))}
            </div>
            {artistCards.length > 20 && (
              <div className="mt-4 text-center">
                <p className="text-white/40 text-sm">Showing 20 of {artistCards.length} cards</p>
              </div>
            )}
          </section>
        )}

        {/* No cards found message */}
        {artistCards && Array.isArray(artistCards) && artistCards.length === 0 && (
          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5" style={{ color: tierInfo?.color }} />
              Cards in the NLF Database
            </h2>
            <div className="bg-white/3 border border-white/10 rounded-xl p-8 text-center">
              <p className="text-white/40 text-sm">Card data for this artist will be available once their set is added to the database.</p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
