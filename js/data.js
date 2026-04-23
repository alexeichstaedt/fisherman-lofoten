// Fisherman: Lofoten — © 2026 Ikke Musikk Eichstaedt. All rights reserved.
window.GAME_DATA = {
  OW_GENDER: { ow1:'male', ow2:'female', ow3:'female', ow4:'female', ow5:'male', ow6:'female', ow7:'male', ow8:'male', ow9:'female', ow10:'male' },
  TILE_SIZE: 32,
  MAP_COLS: 32,
  MAP_ROWS: 32,
  RODS: {
    basic:   { name: 'Basic Rod',   price: 0,     timeLimit: 30, weightBonus: 0,  autoCatch: false },
    silver:  { name: 'Silver Rod',  price: 5000,  timeLimit: 30, weightBonus: 5,  autoCatch: false },
    gold:    { name: 'Gold Rod',    price: 7500,  timeLimit: 30, weightBonus: 10, autoCatch: false },
    diamond: { name: 'Diamond Rod', price: 15000, timeLimit: 30, weightBonus: 15, autoCatch: false },
    bape:    { name: 'Bape Rod',    price: 30000, timeLimit: 30, weightBonus: 25, autoCatch: false },
  },
  BOAT_PRICE: 10000,
  XP_PER_LEVEL: 1000, // base — actual threshold = level * 1000
  FISH_PRICE_PER_KG: 50,
  MAX_INVENTORY: 6,
  LOCATIONS: ['leknes','reine','kåkern','kvalvika','henningsvær'],
  FISH_BY_LOCATION: {
    leknes:       [ {name:'Atlantic Cod',minW:2,maxW:20,rarity:'common',xpMult:1}, {name:'Haddock',minW:1,maxW:5,rarity:'common',xpMult:1}, {name:'Pollock',minW:2,maxW:20,rarity:'uncommon',xpMult:1}, {name:'Mackerel',minW:1,maxW:10,rarity:'common',xpMult:1} ],
    reine:        [ {name:'Atlantic Cod',minW:2,maxW:20,rarity:'common',xpMult:1}, {name:'Pollock',minW:3,maxW:18,rarity:'uncommon',xpMult:1}, {name:'Haddock',minW:1,maxW:5,rarity:'common',xpMult:1}, {name:'Super Skrei',minW:25,maxW:50,rarity:'legendary',xpMult:1,requiresDeepOcean:true,pricePerKg:100} ],
    kåkern:       [ {name:'Sea Trout',minW:2,maxW:12,rarity:'common',xpMult:1}, {name:'Atlantic Cod',minW:2,maxW:20,rarity:'common',xpMult:1}, {name:'Haddock',minW:1,maxW:5,rarity:'common',xpMult:1}, {name:'Arctic Salmon',minW:10,maxW:30,rarity:'legendary',xpMult:1,requiresDeepOcean:true,pricePerKg:100} ],
    kvalvika:     [ {name:'Atlantic Cod',minW:2,maxW:20,rarity:'common',xpMult:1}, {name:'Pollock',minW:5,maxW:20,rarity:'uncommon',xpMult:1}, {name:'Coalfish',minW:1,maxW:15,rarity:'common',xpMult:1}, {name:'Giant Halibut',minW:150,maxW:300,rarity:'legendary',xpMult:1,requiresDeepOcean:true,pricePerKg:100}, {name:'Killer Whale',minW:3000,maxW:4000,rarity:'secret',xpMult:1,requiresDeepOcean:true,isKillerWhale:true} ],
    henningsvær: [ {name:'Mackerel',minW:1,maxW:8,rarity:'common',xpMult:1}, {name:'Pollock',minW:5,maxW:25,rarity:'uncommon',xpMult:1}, {name:'Atlantic Cod',minW:2,maxW:20,rarity:'common',xpMult:1}, {name:'Wicked Tuna',minW:200,maxW:450,rarity:'legendary',xpMult:1,requiresDeepOcean:true,pricePerKg:100} ],
    tromso:       [ {name:'Arctic Cod',minW:1,maxW:5,rarity:'common',xpMult:1}, {name:'Polar Herring',minW:1,maxW:5,rarity:'common',xpMult:1}, {name:'Arctic Char',minW:1,maxW:10,rarity:'uncommon',xpMult:1}, {name:'Greenland Shark',minW:400,maxW:600,rarity:'rare',xpMult:1,requiresDeepOcean:true}, {name:'Narwhal',minW:600,maxW:1200,rarity:'rare',xpMult:1,requiresDeepOcean:true}, {name:'Beluga Whale',minW:600,maxW:1200,rarity:'rare',xpMult:1,requiresDeepOcean:true}, {name:'Pilot Whale',minW:1000,maxW:2000,rarity:'legendary',xpMult:1,requiresDeepOcean:true}, {name:'Magical Greenland Shark',minW:600,maxW:1000,rarity:'legendary',xpMult:1,requiresDeepOcean:true,requiresNorthernLights:true,pricePerKg:100} ],
  },
  RARITY_WEIGHTS: { common:55, uncommon:22, rare:7, legendary:7 },
  TROPHY_FISH: ['Super Skrei','Arctic Salmon','Giant Halibut','Wicked Tuna','Magical Greenland Shark'],
  TOURNAMENT_RIVALS: [
    {name:'Lars',   skill:0.3, sprite:'ow2'},  // beginner:  5-28kg
    {name:'Erik',   skill:0.6, sprite:'ow5'},  // veteran:  20-52kg
    {name:'Bjørn',  skill:0.85,sprite:'ow8'},  // master:   35-72kg
  ],
  GROUND_KEYS: {
    'G':   'tile-grass',
    'GR':  'tile-grass-flowers-red',
    'GB':  'tile-grass-flowers-blue',
    'GBu': 'tile-grass-bush',
    'B':   'tile-beach',
    'BR':  'tile-beach-flowers-red',
    'BB':  'tile-beach-flowers-blue',
    'BBu': 'tile-beach-bush',
    'O':   'tile-ocean',
    'D':   'tile-deep-ocean',
    'S':   'tile-snow',
    'I':   'tile-ice',
    'SBu': 'tile-snow-bush',
    'SFB': 'tile-snow-flowers-blue',
    'SFR': 'tile-snow-flowers-red',
  },
  TROMSO_TICKET_PRICE: 8000,
  IKKE_MUSIKK_LYRICS: [
    "Jeg flyttet til norge, hvordan går det, jeg er ikke fra Florida, to poser og min t-skjorte",
    "Først, jeg er ikke norsk (ikke norsk ja)",
    "Du ser så bra du snakke på norsk så bra, jeg ikke forstår, fortell meg hvor er du fra, hvor er du fra",
    "Kan du elsk meg litt før vi ses?",
    "Jeg lander Gardermoen, i min Bape fra Shabuya",
    "Møt meg utenfor, ved siden av fjord, jeg kommer til Berger, Eg kommer te Bergen, whoa",
    "Sweden Mode, shout out all my Swedish bros",
    "Disse haterne er duff, jeg trenger frisk luft",
    "Hun fra Svalbard, hun er Sami, hjertet mitt baby du kan ta min, lager Rein Love undernordlys, evig dans i Arktis magi, Arktis Magi",
    "Spiser beats some doritos",
    "Ikke Musikk kommer inn på en låt whoa bang",
    "Helt mørk vibe ja jeg er hvit monster, du er en torsk fordi du er en flopper",
    "Helsfyr Voksecenter jeg trenger PR, forsett innvandrer, tester A2-B1",
    "Kjøper ny Bape Dress, ikke noe press men mye press ja",
    "Ikke Musikk Norge i gatene whoa",
    "Tusen takk 4 all my haters",
  ],
  CABIN_IDIOMS: [
    '"Ut på tur, aldri sur" — Out on a trip, never grumpy!',
    '"Ha is i magen" — Keep your cool and stay calm.',
    '"Det er ingen ko på isen" — No need to panic here!',
    '"Borte bra, hjemme best" — Away is good, but home is best.',
    '"Etter regn kommer solskinn" — After rain comes sunshine.',
    '"Bedre føre var enn etter snar" — Better safe than sorry.',
    '"Den som venter på noe godt, venter ikke forgjeves" — Good things come to those who wait.',
    '"Ikke kast perler for svin" — Don\'t waste good things on those who won\'t value them.',
    '"Å legge kortene på bordet" — Be honest and lay it all out.',
    '"Morgenstund har gull i munn" — The early bird gets the worm.',
    '"Små bekker gjør en stor å" — Small contributions add up to something big.',
    '"Øvelse gjør mester" — Practice makes perfect.',
    '"Tålmodighet er en dyd" — Patience is a virtue.',
    '"Kjært barn har mange navn" — A loved child has many names (popular things get many nicknames).',
    '"Liten tue kan velte stort lass" — Small things can cause big problems.',
    '"Ingen røyk uten ild" — There\'s no smoke without fire.',
    '"Å være på bærtur" — To be completely off track or mistaken.',
    '"Man skal ikke skue hunden på hårene" — Don\'t judge by appearances.',
    '"Mange bekker små gjør en stor å" — Many small streams make a big river.',
    '"Den som ler sist, ler best" — He who laughs last, laughs best.',
    '"Det er håp i hengende snøre" — There\'s always hope.',
    '"Å ta seg vann over hodet" — To take on more than you can handle.',
    '"Å ha flere baller i luften" — To juggle many tasks at once.',
    '"Som man reder, så ligger man" — You reap what you sow.',
    '"Ingen er perfekt" — Nobody is perfect.',
    '"Å gå rundt grøten" — To beat around the bush.',
    '"Det går som smurt" — It goes smoothly.',
    '"Å slå to fluer i en smekk" — Kill two birds with one stone.',
    '"Å være i vinden" — To be popular or trending.',
    '"Stillhet er gull" — Silence is golden.',
  ],
};
window.GUIDES = [
  {key:'ow2',  name:'Astrid',  price:2000, role:'fishing',  desc:'Fishing Guide — +50% XP from every catch!'},
  {key:'ow5',  name:'Bjorn',   price:2000, role:'hiking',   desc:'Hiking Guide — 2× XP on Kvalvika Beach!'},
  {key:'ow8',  name:'Gonzalo', price:2000, role:'stranger', desc:'The Stranger — 2× XP on Reine & Henningsvær!'},
  {key:'ow10', name:'Linnea Marie', price:2000, role:'sami', desc:'Sami Guide — 2× XP in Tromsø!'},
];

window.ENCOUNTER_ITEMS = [
  { name: 'Bape Ikke Musikk Shirt' },
  { name: 'Bape Shall Not Kill Bape Shirt' },
  { name: 'Japanese Shirt' },
  { name: 'Juice Wrld Shirt' },
  { name: 'Ed Sheeran Shirt' },
  { name: 'Hans Zimmer Shirt' },
  { name: 'Nav Shirt' },
  { name: 'Diamond Gold Owl Chain' },
  { name: 'Palm Tree Necklace' },
  { name: 'Ruby Necklace' },
  { name: 'Pearl Necklace' },
  { name: 'John Lennon Glasses' },
  { name: 'Gucci Watch' },
  { name: 'Maserati Watch' },
  { name: 'Silver Diamond Watch' },
  { name: 'Bape Shoes' },
  { name: 'La France Shoes' },
  { name: 'Arigato Shoes' },
  { name: 'Nike Shoes' },
  { name: 'Gucci Flops' },
  { name: 'Bape Socks' },
  { name: 'Hoka Shoes' },
  { name: 'Bjørn Borg Underwear' },
  { name: 'Stone Island Jacket' },
  { name: 'Copenhagen Jacket' },
  { name: 'Beatles Jacket' },
  { name: 'Nike Hat' },
  { name: 'Avicii Hat' },
  { name: 'Headphones' },
  { name: 'MacBook' },
  { name: 'iPhone' },
  { name: 'Blackmagic Camera' },
  { name: 'Norwegian Blanket' },
  { name: 'Wool Sweater' },
  { name: 'Amie Sweater' },
  { name: 'Giannis Bucks Jersey' },
  { name: 'Norway Football Jersey' },
  { name: 'Bodø Glimt Jersey' },
  { name: 'Zlatan Jersey' },
  { name: 'Messi Jersey' },
  { name: 'USA Jersey' },
  { name: 'Ronaldo Jersey' },
  { name: 'Chourio Brewers Jersey' },
  { name: 'Dos Santos Mexico Jersey' },
  { name: 'Kvikk Lunsj' },
  { name: 'Freia Melkesjokolade' },
  { name: 'Smash!' },
  { name: 'Brunost' },
  { name: 'Solo' },
  { name: 'Pepsi Max' },
  { name: "Kim's Chips" },
  { name: 'Caviar' },
  { name: 'Stratos' },
  { name: 'Sørlands Chips' },
  { name: 'Lefse' },
  { name: 'Bilar' },
  { name: 'Fiskekaker' },
  { name: 'Skolebrød' },
  { name: 'Solbærsirup' },
  { name: 'Hvit Monster Drink' },
  { name: 'Battery Energy Drink' },
  { name: 'Burn Energy Drink' },
  { name: 'Grandiosa Pizza' },
  { name: 'Walters Mandler' },
  { name: 'Østehovel' },
  { name: 'Leverpostei' },
  { name: 'Gulost' },
  { name: 'Waffle Iron' },
  { name: 'Mariusgenser' },
  { name: 'Sitteunderlag' },
  { name: 'Refleks' },
  { name: 'Helly Hansen Jacket' },
  { name: 'Duvet' },
  { name: 'Troll Figurine' },
  { name: 'Røros Tweed Blanket' },
  { name: 'Dan Brown Novel' },
  { name: 'Jo Nesbø Novel' },
  { name: 'Harry Potter Movies' },
  { name: 'Ugg Boots' },
  { name: 'Moon Boots' },
  { name: 'Timberland Boots' },
  { name: 'Porsche Keys' },
  { name: 'Hytte Keys' },
  { name: 'Hair Gel' },
  { name: 'Digital Camera' },
  { name: 'Analog Camera' },
  { name: 'Coca Cola' },
  { name: 'Julebrus' },
  { name: 'Star Wars Movies' },
  { name: 'Lord of the Rings Movies' },
  { name: 'Music Notepad' },
  { name: 'Black Ink Pen' },
  { name: 'Samurai Sword' },
  { name: 'Baggy Jeans' },
  { name: 'Skinny Jeans' },
  { name: 'Surt Skum' },
  { name: 'Akai Beat Mixer' },
  { name: 'Lofoten Salt' },
  { name: 'Golf Balls' },
  { name: 'Golf Clubs' },
  { name: 'Golf Shoes' },
  { name: 'Golf Glove' },
  { name: 'Paddle Board' },
  { name: 'Kayak' },
  { name: 'Snorkel' },
  { name: 'Water Goggles' },
  { name: 'Sun Block' },
  { name: 'Cowboy Hat' },
  { name: 'Camelbak Waterbottle' },
  { name: 'Extra Chewing Gum' },
];

window.DUFFEL_BAG_NAME = 'Ikke Musikk Duffel Bag';

window.NORWEGIAN_GIRL_NAMES = [
  // Norwegian (50)
  'Emma','Nora','Maja','Sofie','Ingrid',
  'Astrid','Frida','Thea','Mia','Sara',
  'Emilie','Live','Ida','Anna','Julie',
  'Mathilde','Silje','Karin','Solveig','Hilde',
  'Sigrid','Tuva','Helene','Maria','Vilde',
  'Signe','Ragnhild','Guro','Tone','Marit',
  'Karianne','Benedikte','Toril','Bente','Anette',
  'Kristine','Eline','Camilla','Linn','Stine',
  'Åse','Gry','Randi','Vigdis','Brit',
  'Inger','Bodil','Tove','Wenche','Berit',
  // American (10)
  'Ashley','Brittany','Madison','Savannah','Taylor',
  'Kayla','Hailey','Amber','Tiffany','Destiny',
  // English (10)
  'Charlotte','Poppy','Isla','Ellie','Rosie',
  'Daisy','Imogen','Freya','Millie','Phoebe',
  // Spanish (10)
  'Valentina','Lucía','Sofía','Isabella','Camila',
  'Valeria','Martina','Paula','Elena','Natalia',
  // Italian (10)
  'Giulia','Chiara','Francesca','Aurora','Beatrice',
  'Elisa','Ginevra','Alessia','Serena','Vittoria',
  // Asian (10)
  'Yuki','Sakura','Mei','Aiko','Hana',
  'Lin','Asha','Priya','Nari','Soo',
  // Swedish (10)
  'Linnea','Alva','Elsa','Ebba','Wilma',
  'Filippa','Klara','Britta','Lotta','Elin',
  // Danish (10)
  'Freja','Cecilie','Laura','Josefine','Katrine',
  'Nanna','Mette','Tine','Rikke','Fie',
  // Finnish (10)
  'Aino','Aada','Emmi','Siiri','Iida',
  'Helmi','Pilvi','Inkeri','Venla','Kaisa',
  // German (10)
  'Lena','Hannah','Lara','Lea','Nina',
  'Jana','Greta','Petra','Monika','Heike',
  // Brazilian (10)
  'Ana','Beatriz','Fernanda','Gabriela','Juliana',
  'Larissa','Leticia','Rafaela','Renata','Tatiana',
  // Mexican (5)
  'Guadalupe','Lupita','Xochitl','Citlali','Consuelo',
  // Argentinian (5)
  'Milagros','Rocío','Agustina','Florencia','Pilar',
  // French (10)
  'Amélie','Chloé','Léa','Manon','Camille',
  'Inès','Lucie','Océane','Élodie','Céline',
  // Icelandic (5)
  'Guðrún','Kristín','Sigríður','Inga','Ásta',
  // Sami (10)
  'Máret','Ánne','Elle','Birit','Risten',
  'Sunna','Láilá','Márit','Siri','Rávdná',
  // Australian (5)
  'Kylie','Zoe','Caitlin','Brooke','Ashleigh',
  // Nigerian (10)
  'Adaeze','Chioma','Ngozi','Amara','Chiamaka',
  'Temi','Funmi','Bisi','Yetunde','Kemi',
  // Greek (10)
  'Eleni','Dimitra','Athina','Niki','Katerina',
  'Despina','Vasiliki','Alexia','Stavroula','Chrysoula',
];

// Flag emoji keyed by baddie name — matches the nationality groups above
window.BADDIE_FLAGS = {
  // Norwegian
  'Emma':'🇳🇴','Nora':'🇳🇴','Maja':'🇳🇴','Sofie':'🇳🇴','Ingrid':'🇳🇴',
  'Astrid':'🇳🇴','Frida':'🇳🇴','Thea':'🇳🇴','Mia':'🇳🇴','Sara':'🇳🇴',
  'Emilie':'🇳🇴','Live':'🇳🇴','Ida':'🇳🇴','Anna':'🇳🇴','Julie':'🇳🇴',
  'Mathilde':'🇳🇴','Silje':'🇳🇴','Karin':'🇳🇴','Solveig':'🇳🇴','Hilde':'🇳🇴',
  'Sigrid':'🇳🇴','Tuva':'🇳🇴','Helene':'🇳🇴','Maria':'🇳🇴','Vilde':'🇳🇴',
  'Signe':'🇳🇴','Ragnhild':'🇳🇴','Guro':'🇳🇴','Tone':'🇳🇴','Marit':'🇳🇴',
  'Karianne':'🇳🇴','Benedikte':'🇳🇴','Toril':'🇳🇴','Bente':'🇳🇴','Anette':'🇳🇴',
  'Kristine':'🇳🇴','Eline':'🇳🇴','Camilla':'🇳🇴','Linn':'🇳🇴','Stine':'🇳🇴',
  'Åse':'🇳🇴','Gry':'🇳🇴','Randi':'🇳🇴','Vigdis':'🇳🇴','Brit':'🇳🇴',
  'Inger':'🇳🇴','Bodil':'🇳🇴','Tove':'🇳🇴','Wenche':'🇳🇴','Berit':'🇳🇴',
  // American
  'Ashley':'🇺🇸','Brittany':'🇺🇸','Madison':'🇺🇸','Savannah':'🇺🇸','Taylor':'🇺🇸',
  'Kayla':'🇺🇸','Hailey':'🇺🇸','Amber':'🇺🇸','Tiffany':'🇺🇸','Destiny':'🇺🇸',
  // English
  'Charlotte':'🇬🇧','Poppy':'🇬🇧','Isla':'🇬🇧','Ellie':'🇬🇧','Rosie':'🇬🇧',
  'Daisy':'🇬🇧','Imogen':'🇬🇧','Freya':'🇬🇧','Millie':'🇬🇧','Phoebe':'🇬🇧',
  // Spanish
  'Valentina':'🇪🇸','Lucía':'🇪🇸','Sofía':'🇪🇸','Isabella':'🇪🇸','Camila':'🇪🇸',
  'Valeria':'🇪🇸','Martina':'🇪🇸','Paula':'🇪🇸','Elena':'🇪🇸','Natalia':'🇪🇸',
  // Italian
  'Giulia':'🇮🇹','Chiara':'🇮🇹','Francesca':'🇮🇹','Aurora':'🇮🇹','Beatrice':'🇮🇹',
  'Elisa':'🇮🇹','Ginevra':'🇮🇹','Alessia':'🇮🇹','Serena':'🇮🇹','Vittoria':'🇮🇹',
  // Asian (per-name country)
  'Yuki':'🇯🇵','Sakura':'🇯🇵','Aiko':'🇯🇵','Hana':'🇯🇵',
  'Mei':'🇨🇳','Lin':'🇨🇳',
  'Asha':'🇮🇳','Priya':'🇮🇳',
  'Nari':'🇰🇷','Soo':'🇰🇷',
  // Swedish
  'Linnea':'🇸🇪','Alva':'🇸🇪','Elsa':'🇸🇪','Ebba':'🇸🇪','Wilma':'🇸🇪',
  'Filippa':'🇸🇪','Klara':'🇸🇪','Britta':'🇸🇪','Lotta':'🇸🇪','Elin':'🇸🇪',
  // Danish
  'Freja':'🇩🇰','Cecilie':'🇩🇰','Laura':'🇩🇰','Josefine':'🇩🇰','Katrine':'🇩🇰',
  'Nanna':'🇩🇰','Mette':'🇩🇰','Tine':'🇩🇰','Rikke':'🇩🇰','Fie':'🇩🇰',
  // Finnish
  'Aino':'🇫🇮','Aada':'🇫🇮','Emmi':'🇫🇮','Siiri':'🇫🇮','Iida':'🇫🇮',
  'Helmi':'🇫🇮','Pilvi':'🇫🇮','Inkeri':'🇫🇮','Venla':'🇫🇮','Kaisa':'🇫🇮',
  // German
  'Lena':'🇩🇪','Hannah':'🇩🇪','Lara':'🇩🇪','Lea':'🇩🇪','Nina':'🇩🇪',
  'Jana':'🇩🇪','Greta':'🇩🇪','Petra':'🇩🇪','Monika':'🇩🇪','Heike':'🇩🇪',
  // Brazilian
  'Ana':'🇧🇷','Beatriz':'🇧🇷','Fernanda':'🇧🇷','Gabriela':'🇧🇷','Juliana':'🇧🇷',
  'Larissa':'🇧🇷','Leticia':'🇧🇷','Rafaela':'🇧🇷','Renata':'🇧🇷','Tatiana':'🇧🇷',
  // Mexican
  'Guadalupe':'🇲🇽','Lupita':'🇲🇽','Xochitl':'🇲🇽','Citlali':'🇲🇽','Consuelo':'🇲🇽',
  // Argentinian
  'Milagros':'🇦🇷','Rocío':'🇦🇷','Agustina':'🇦🇷','Florencia':'🇦🇷','Pilar':'🇦🇷',
  // French
  'Amélie':'🇫🇷','Chloé':'🇫🇷','Léa':'🇫🇷','Manon':'🇫🇷','Camille':'🇫🇷',
  'Inès':'🇫🇷','Lucie':'🇫🇷','Océane':'🇫🇷','Élodie':'🇫🇷','Céline':'🇫🇷',
  // Icelandic
  'Guðrún':'🇮🇸','Kristín':'🇮🇸','Sigríður':'🇮🇸','Inga':'🇮🇸','Ásta':'🇮🇸',
  // Sami (Sápmi — using reindeer as there is no Unicode Sami flag)
  'Máret':'🦌','Ánne':'🦌','Elle':'🦌','Birit':'🦌','Risten':'🦌',
  'Sunna':'🦌','Láilá':'🦌','Márit':'🦌','Siri':'🦌','Rávdná':'🦌',
  // Australian
  'Kylie':'🇦🇺','Zoe':'🇦🇺','Caitlin':'🇦🇺','Brooke':'🇦🇺','Ashleigh':'🇦🇺',
  // Nigerian
  'Adaeze':'🇳🇬','Chioma':'🇳🇬','Ngozi':'🇳🇬','Amara':'🇳🇬','Chiamaka':'🇳🇬',
  'Temi':'🇳🇬','Funmi':'🇳🇬','Bisi':'🇳🇬','Yetunde':'🇳🇬','Kemi':'🇳🇬',
  // Greek
  'Eleni':'🇬🇷','Dimitra':'🇬🇷','Athina':'🇬🇷','Niki':'🇬🇷','Katerina':'🇬🇷',
  'Despina':'🇬🇷','Vasiliki':'🇬🇷','Alexia':'🇬🇷','Stavroula':'🇬🇷','Chrysoula':'🇬🇷',
};

window.getXPBonus = function(companion, scene) {
  if (!companion) return 1;
  let m = 1;
  if (companion === 'ow2') m *= 1.5;  // Astrid: fishing guide
  if (companion === 'ow5' && scene === 'kvalvika') m *= 2;   // Bjorn: hiking
  if (companion === 'ow8' && (scene === 'reine' || scene === 'henningsvaer')) m *= 2;  // Gonzalo: stranger
  if (companion === 'ow10' && scene === 'tromso') m *= 2;    // Linnea Marie: Sami
  return m;
};

// Cabin rental: 5000 kr per owned cabin per fish caught — collect from cabin manager
window.CABIN_PRICE   = 500000;
window.CABIN_INCOME  = 5000;   // per owned cabin per fish caught
window.RENTAL_CABINS = [
  { id:1, tx:12, ty:17, name:'Cabin 2' },
  { id:2, tx:19, ty:17, name:'Cabin 3' },
  { id:3, tx:26, ty:17, name:'Cabin 4' },
];
// Returns earnings per fish catch — caller adds to state.cabinEarnings accumulator
window.cabinFishBonus = function(state) {
  return (state.ownedCabins || []).length * window.CABIN_INCOME;
};
// Alias for menu display
window.computeCabinEarnings = function(state) { return state.cabinEarnings || 0; };

window.ANIMALS = [
  {id:1,  name:'Animal 1',  price:5000, terrain:'land'},
  {id:2,  name:'Animal 2',  price:5000, terrain:'land'},
  {id:3,  name:'Animal 3',  price:5000, terrain:'land'},
  {id:4,  name:'Animal 4',  price:5000, terrain:'land'},
  {id:5,  name:'Animal 5',  price:5000, terrain:'land'},
  {id:6,  name:'Animal 6',  price:5000, terrain:'land'},
  {id:7,  name:'Animal 7',  price:5000, terrain:'land'},
  {id:8,  name:'Animal 8',  price:5000, terrain:'land'},
  {id:9,  name:'Animal 9',  price:5000, terrain:'land'},
  {id:10, name:'Animal 10', price:5000, terrain:'land'},
  {id:11, name:'Animal 11', price:5000, terrain:'water'},
  {id:12, name:'Animal 12', price:5000, terrain:'water'},
  {id:13, name:'Animal 13', price:5000, terrain:'water'},
  {id:14, name:'Animal 14', price:5000, terrain:'water'},
  {id:15, name:'Animal 15', price:5000, terrain:'land'},
  {id:16, name:'Animal 16', price:5000, terrain:'land'},
];

// Spawn positions for animals on Kåkern — land=grass tiles, water=ocean tiles
window.ANIMAL_LAND_SPAWNS = [
  // Upper area (rows 0-8, full width)
  {tx:2, ty:2}, {tx:5, ty:7},
  // Upper centre-right
  {tx:15,ty:4}, {tx:22,ty:5},
  // Narrow bridge (rows 9-16, cols 8-11 only)
  {tx:9, ty:12}, {tx:10,ty:16},
  // Lower left (rows 17-31)
  {tx:4, ty:20}, {tx:6, ty:18},
  // Lower centre
  {tx:17,ty:23}, {tx:14,ty:27},
  // Lower right
  {tx:22,ty:26}, {tx:25,ty:23},
];
window.ANIMAL_WATER_SPAWNS = [
  {tx:2,ty:10},{tx:5,ty:10},{tx:14,ty:10},{tx:20,ty:10},
  {tx:2,ty:15},{tx:14,ty:15},{tx:20,ty:15},{tx:26,ty:10},
];


window.TOURNAMENT_MAP_DATA = {
  ground: [
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D'],
    ['D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D'],
    ['O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O'],
    ['O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O'],
    ['O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O'],
    ['B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B'],
    ['B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B'],
    ['B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B'],
    ['O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O'],
    ['O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O'],
    ['O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O'],
    ['D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D'],
    ['D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G']
  ],
  objects: [
    // Mountain borders — top,
    {type:'mountain-forest',tx:0,ty:0},{type:'mountain-forest',tx:3,ty:0},{type:'mountain-forest',tx:6,ty:0},{type:'mountain-forest',tx:9,ty:0},{type:'mountain-forest',tx:12,ty:0},{type:'mountain-forest',tx:15,ty:0},{type:'mountain-forest',tx:18,ty:0},{type:'mountain-forest',tx:21,ty:0},{type:'mountain-forest',tx:24,ty:0},{type:'mountain-forest',tx:27,ty:0},{type:'mountain-forest',tx:30,ty:0},
    // Mountain borders — bottom,
    {type:'mountain-forest',tx:0,ty:30},{type:'mountain-forest',tx:3,ty:30},{type:'mountain-forest',tx:6,ty:30},{type:'mountain-forest',tx:9,ty:30},{type:'mountain-forest',tx:12,ty:30},{type:'mountain-forest',tx:15,ty:30},{type:'mountain-forest',tx:18,ty:30},{type:'mountain-forest',tx:21,ty:30},{type:'mountain-forest',tx:24,ty:30},{type:'mountain-forest',tx:27,ty:30},{type:'mountain-forest',tx:30,ty:30},
    // Mountain borders — left column,
    {type:'mountain-forest',tx:0,ty:3},{type:'mountain-forest',tx:0,ty:6},{type:'mountain-forest',tx:0,ty:9},{type:'mountain-forest',tx:0,ty:12},{type:'mountain-forest',tx:0,ty:15},{type:'mountain-forest',tx:0,ty:18},{type:'mountain-forest',tx:0,ty:21},{type:'mountain-forest',tx:0,ty:24},{type:'mountain-forest',tx:0,ty:27},
    // Mountain borders — right column,
    {type:'mountain-forest',tx:29,ty:3},{type:'mountain-forest',tx:29,ty:6},{type:'mountain-forest',tx:29,ty:9},{type:'mountain-forest',tx:29,ty:12},{type:'mountain-forest',tx:29,ty:15},{type:'mountain-forest',tx:29,ty:18},{type:'mountain-forest',tx:29,ty:21},{type:'mountain-forest',tx:29,ty:24},{type:'mountain-forest',tx:29,ty:27}
  ],
};

window.TROMSO_MAP_DATA = {
  ground: [
    'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSOO',
    ['S','S','S','SBu','S','S','S','S','SBu','S','S','S','S','SBu','S','S','S','S','S','S','S','S','S','S','S','S','S','S','S','O','O','D'],
    'SSSSSSSSSSSSSSSSSSSSSSSSSSSSOODD',
    ['S','S','S','S','S','SFB','S','S','S','S','S','SFB','S','S','S','S','S','S','S','S','S','S','S','S','S','S','S','O','O','D','D','D'],
    'SSSSSSSSSSSSSSSSSSSSSSSSSSOODDDO',
    'SSSSSSSSSSSSSSSSSSSSSSSSSOODDDOO',
    'SSSSSSSSSSSSSSSSSSSSSSSSOODDDOOS',
    ['S','S','S','S','SFR','S','S','S','S','S','S','S','SFR','S','S','S','S','S','SFR','S','S','S','S','O','O','D','D','D','O','O','S','S'],
    'SSSSSSSSSSSSSSSSSSSSSSOODDDOOSSS',
    'SSSSSSSSSSSSSSSSSSSSSOODDDOOSSSS',
    'SSSSSSSSSSSSSSSSSSSSOODDDOOSSSSS',
    'SSSSSSSSSSSSSSSSSSSOODDDOOSSSSSS',
    'SSSSSSSSSSSSSSSSSSOODDDOOSSSSSSS',
    'SSSSSSSSSSSSSSSSSOODDDOOSSSSSSSS',
    ['S','S','S','S','S','S','S','S','S','S','S','S','S','S','S','S','O','O','D','D','D','O','O','S','S','SFR','S','S','S','SFB','S','S'],
    'SSSSSSSSSSSSSSSOODDDOOSSSSSSSSSS',
    'SSSSSSSSSSSSSSIIOOOOOSSSSSSSSSSS',
    'SSSSSSSSSSSSSIIOOOOOSSSSSSSSSSSS',
    'SSSSSSSSSSSSIIOOOOOSSSSSSSSSSSSS',
    'SSSSSSSSSSSIIOOOOOSSSSSSSSSSSSSS',
    'SSSSSSSSSSIIOOOOOSSSSSSSSSSSSSSS',
    'SSSSSSSSSIIOOOOOSSSSSSSSSSSSSSSS',
    ['S','S','S','S','S','S','S','S','I','I','O','O','O','O','O','S','S','S','S','SBu','S','S','S','S','SBu','S','S','S','S','S','S','S'],
    'SSSSSSSIIOOOOOSSSSSSSSSSSSSSSSSS',
    'SOOOOOOOOOOOOOOSSSSSSSSSSSSSSSSS',
    ['S','O','O','O','O','O','O','O','O','O','O','O','O','O','O','S','S','SBu','S','S','SBu','S','S','SBu','S','S','S','S','S','S','S','S'],
    'SOOOOOOOOOOOOOOOSSSSSSSSSSSSSSSS',
    'SOOOOOOOOOOOOOOSSSSSSSSSSSSSSSSS',
    ['S','O','O','O','O','O','D','D','O','O','O','O','O','S','S','SBu','S','S','S','S','S','S','SBu','S','S','S','S','S','SBu','S','S','S'],
    'SOOOODDDDOOOOSSSSSSSSSSSSSSSSSSS',
    'SSOODDDDOOOOSSSSSSSSSSSSSSSSSSSS',
    'SSODDDDOOOOSSSSSSSSSSSSSSSSSSSSS',
  ],
  objects: [
  {type:'cabin2', tx:17, ty:3},
  {type:'cabin1', tx:2, ty:17},
  {type:'snow-lake', tx:14, ty:9},
  {type:'snow-lake', tx:4, ty:13},
  // Top border: alternating tree1/tree2
  {type:'tree2',tx:0,ty:0},{type:'tree2',tx:2,ty:0},{type:'tree2',tx:4,ty:0},{type:'tree2',tx:6,ty:0},
  {type:'tree2',tx:8,ty:0},{type:'tree2',tx:10,ty:0},{type:'tree2',tx:12,ty:0},{type:'tree2',tx:14,ty:0},
  {type:'tree2',tx:16,ty:0},{type:'tree2',tx:18,ty:0},{type:'tree2',tx:20,ty:0},{type:'tree2',tx:22,ty:0},
  {type:'tree2',tx:24,ty:0},{type:'tree2',tx:26,ty:0},
  // Left border
  {type:'tree2',tx:0,ty:2},{type:'tree2',tx:0,ty:4},{type:'tree2',tx:0,ty:6},
  {type:'tree2',tx:0,ty:8},{type:'tree2',tx:0,ty:10},{type:'tree2',tx:0,ty:12},
  {type:'tree2',tx:0,ty:14},{type:'tree2',tx:0,ty:16},
  // Interior trees
  {type:'tree2',tx:7,ty:3},{type:'tree2',tx:10,ty:6},{type:'tree2',tx:9,ty:11},
  {type:'tree2',tx:8,ty:15},{type:'tree2',tx:28,ty:20},{type:'tree2',tx:26,ty:23},{type:'tree2',tx:29,ty:25},
  // Right border trees
  {type:'tree2', tx:30, ty:14},
  {type:'tree2', tx:30, ty:16},
  {type:'tree2', tx:30, ty:18},
  {type:'tree2', tx:30, ty:20},
  {type:'tree2', tx:30, ty:22},
  {type:'tree2', tx:30, ty:24},
  // Bottom border trees
  {type:'tree2', tx:13, ty:30},
  {type:'tree2', tx:17, ty:30},
  {type:'tree2', tx:21, ty:30},
  {type:'tree2', tx:27, ty:30},
  // Interior trees
  {type:'tree2', tx:22, ty:5},
  {type:'tree2', tx:22, ty:18},
  {type:'tree2', tx:24, ty:20},
  // Snow mountains — lower right
  {type:'ice-mountain', tx:24, ty:27},
  {type:'ice-mountain', tx:28, ty:27},
  ]


};

window.OBJECT_DEFS = {
  'mountain-forest': { key:'obj-mountain-forest', tw:3, th:3, walkable:false, water:false },
  'mountain-beach':  { key:'obj-mountain-beach',  tw:3, th:3, walkable:false, water:false },
  'tree1':           { key:'obj-tree1',            tw:1, th:2, walkable:false, water:false },
  'tree2':           { key:'obj-tree2',            tw:1, th:2, walkable:false, water:false },
  'cabin1':          { key:'obj-cabin1',           tw:5, th:5, walkable:false, water:false },
  'cabin2':          { key:'obj-cabin2',           tw:5, th:5, walkable:false, water:false },
  'badder-cabin':    { key:'badder-cabin',          tw:7, th:7, walkable:false, water:false },
  'shop':            { key:'obj-shop',             tw:5, th:5, walkable:false, water:false },
  'ferry-zone':      { key:'obj-ferry-zone',       tw:3, th:3, walkable:true,  water:false },
  'lake':            { key:'obj-lake',             tw:3, th:3, walkable:false, water:true  },
  'island-rock':     { key:'obj-island-rock',      tw:3, th:3, walkable:false, water:false },
  'lake-beach':      { key:'obj-lake-beach',      tw:3, th:3, walkable:false, water:true  },
  'island-beach':    { key:'obj-island-beach',     tw:3, th:3, walkable:true,  water:false },
  'ice-mountain':    { key:'obj-ice-mountain',     tw:3, th:3, walkable:false, water:false },
  'snow-tree':       { key:'obj-snow-tree',        tw:1, th:2, walkable:false, water:false },
  'snow-lake':       { key:'obj-snow-lake',        tw:3, th:3, walkable:false, water:true  },
};

window.buildMapGrids = function(map) {
  const ROWS = GAME_DATA.MAP_ROWS, COLS = GAME_DATA.MAP_COLS;
  const walkGrid  = Array.from({length:ROWS}, ()=>Array(COLS).fill(true));
  const waterGrid = Array.from({length:ROWS}, ()=>Array(COLS).fill(false));
  for (let r=0; r<ROWS; r++) {
    for (let c=0; c<COLS; c++) {
      const g = map.ground[r][c];
      if (g==='O'||g==='D') { walkGrid[r][c]=false; waterGrid[r][c]=true; }
    }
  }
  for (const obj of map.objects) {
    const def = OBJECT_DEFS[obj.type];
    if (!def) continue;
    for (let dy=0; dy<def.th; dy++) {
      for (let dx=0; dx<def.tw; dx++) {
        const r=obj.ty+dy, c=obj.tx+dx;
        if (r<ROWS && c<COLS) {
          walkGrid[r][c] = def.walkable;
          if (def.water) waterGrid[r][c] = true;
        }
      }
    }
  }
  return { walkGrid, waterGrid };
};

window.LEKNES_MAP_DATA = {
  ground: [
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','GB','GB','GB','GB','GB','GB','G','G','G','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','GB','GB','GB','GB','GB','GB','G','G','G','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','GB','GB','GB','GB','GB','GB','G','G','G','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','GB','GB','GB','GB','GB','GB','G','G','G','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','G','G','G'],
    ['O','O','O','O','O','O','O','O','O','G','G','G','G','G','G','G','G','G','G','G','G','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','G','G','G'],
    ['O','O','O','O','O','O','O','O','O','G','G','G','G','G','G','G','G','G','G','G','G','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','G','G','G'],
    ['O','O','O','O','O','O','O','O','O','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['O','O','O','O','O','O','O','O','O','G','G','GR','GR','GR','GR','GR','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['O','O','O','O','O','O','O','O','O','G','G','GR','GR','GR','GR','GR','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['O','O','O','O','O','O','O','O','O','G','G','GR','GR','GR','GR','GR','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['O','O','O','O','O','O','O','O','O','G','G','GR','GR','GR','GR','GR','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['O','O','O','O','O','O','O','O','O','G','G','GR','GR','GR','GR','GR','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['O','O','O','O','O','O','O','O','O','G','G','GR','GR','GR','GR','GR','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G']
  ],
  objects: [
    // Mountain border top row
    {type:'mountain-forest',tx:0, ty:0},{type:'mountain-forest',tx:3, ty:0},
    {type:'mountain-forest',tx:6, ty:0},{type:'mountain-forest',tx:9, ty:0},
    {type:'mountain-forest',tx:12,ty:0},{type:'mountain-forest',tx:15,ty:0},
    {type:'mountain-forest',tx:18,ty:0},{type:'mountain-forest',tx:21,ty:0},
    {type:'mountain-forest',tx:24,ty:0},{type:'mountain-forest',tx:27,ty:0},
    {type:'mountain-forest',tx:29,ty:0},
    // Mountain border bottom row
    {type:'mountain-forest',tx:0, ty:29},{type:'mountain-forest',tx:3, ty:29},
    {type:'mountain-forest',tx:6, ty:29},{type:'mountain-forest',tx:9, ty:29},
    {type:'mountain-forest',tx:12,ty:29},{type:'mountain-forest',tx:15,ty:29},
    {type:'mountain-forest',tx:18,ty:29},{type:'mountain-forest',tx:21,ty:29},
    {type:'mountain-forest',tx:24,ty:29},{type:'mountain-forest',tx:27,ty:29},
    {type:'mountain-forest',tx:29,ty:29},
    // Mountain border left column (skip rows 12-20 where lake sits)
    {type:'mountain-forest',tx:0,ty:3},{type:'mountain-forest',tx:0,ty:6},
    {type:'mountain-forest',tx:0,ty:9},
    {type:'mountain-forest',tx:0,ty:21},{type:'mountain-forest',tx:0,ty:24},
    {type:'mountain-forest',tx:0,ty:27},
    // Mountain border right column
    {type:'mountain-forest',tx:29,ty:3},{type:'mountain-forest',tx:29,ty:6},
    {type:'mountain-forest',tx:29,ty:9},{type:'mountain-forest',tx:29,ty:12},
    {type:'mountain-forest',tx:29,ty:15},{type:'mountain-forest',tx:29,ty:18},
    {type:'mountain-forest',tx:29,ty:21},{type:'mountain-forest',tx:29,ty:24},
    {type:'mountain-forest',tx:29,ty:27},
    // Large lake on left side (covers cols 0-8, rows 12-20)
    // Small central lakes
    {type:'lake',tx:14,ty:8},
    {type:'lake',tx:14,ty:22},
    // Buildings
    {type:'shop',   tx:8, ty:7},
    {type:'cabin1', tx:22,ty:7},
    {type:'cabin2', tx:22,ty:18},
    // Trees
    {type:'tree2',tx:3, ty:3},{type:'tree2',tx:5, ty:6},
    {type:'tree2',tx:7, ty:24},{type:'tree2',tx:4, ty:27},
    {type:'tree2',tx:12,ty:4},{type:'tree2',tx:18,ty:6},
    {type:'tree2',tx:7, ty:4},{type:'tree2',tx:11,ty:24},
    // Extra trees
    {type:'tree2',tx:16,ty:18},{type:'tree2',tx:5, ty:10},
    {type:'tree2',tx:20,ty:24},{type:'tree2',tx:17,ty:26},
    {type:'tree2',tx:24,ty:25},{type:'tree2',tx:4, ty:22},
    {type:'tree2',tx:6, ty:28},{type:'tree2',tx:21,ty:27},
    // Ferry zone (east of left lake)
  ]
};

window.HENNINGSVAER_MAP_DATA = {
  // Layout: 4 cabins on top island (rows 0-5), narrow bridge (rows 6-12, cols 15-17),
  // grass hillside (rows 13-15, cols 9-22), mountain-enclosed harbor basin (rows 16-27, cols 9-23)
  ground: [
    // Row 0: top island - G edges, GB under cabins, O water gaps between clusters
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    // Rows 1-5: top island — G open areas, GB only under/near cabin footprints
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    // Rows 6-12: narrow bridge channel — O (normal ocean) not D until mountains
    ['O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','GB','G','GB','O','O','O','O','O','O','O','O','O','O','O','O','O','O'],
    ['O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','GB','G','GB','O','O','O','O','O','O','O','O','O','O','O','O','O','O'],
    ['O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','GB','G','GB','O','O','O','O','O','O','O','O','O','O','O','O','O','O'],
    ['O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','GB','G','GB','O','O','O','O','O','O','O','O','O','O','O','O','O','O'],
    ['O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','GB','G','GB','O','O','O','O','O','O','O','O','O','O','O','O','O','O'],
    ['O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','GB','G','GB','O','O','O','O','O','O','O','O','O','O','O','O','O','O'],
    ['O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','GB','G','GB','O','O','O','O','O','O','O','O','O','O','O','O','O','O'],
    // Rows 13-15: grass hillside connecting to harbor — O surrounds (not deep)
    ['O','O','O','O','O','O','O','O','O','G','G','G','G','G','G','G','G','G','G','G','G','G','G','O','O','O','O','O','O','O','O','O'],
    ['O','O','O','O','O','O','O','O','O','G','G','G','G','G','G','G','G','G','G','G','G','G','G','O','O','O','O','O','O','O','O','O'],
    ['O','O','O','O','O','O','O','O','O','G','G','G','G','G','G','G','G','G','G','G','G','G','G','O','O','O','O','O','O','O','O','O'],
    // Rows 16-27: harbor basin — D outer sea, G interior with GB only at mountain-wall edges
    ['D','D','D','D','D','D','D','D','D','G','G','G','G','G','G','G','G','G','G','G','G','G','G','D','D','D','D','D','D','D','D','D'],
    ['D','D','D','D','D','D','D','D','D','G','G','G','G','G','G','G','G','G','G','G','G','G','G','D','D','D','D','D','D','D','D','D'],
    ['D','D','D','D','D','D','D','D','D','G','G','G','G','G','G','G','G','G','G','G','G','G','G','D','D','D','D','D','D','D','D','D'],
    ['D','D','D','D','D','D','D','D','D','G','G','G','G','G','G','G','G','G','G','G','G','G','G','D','D','D','D','D','D','D','D','D'],
    ['D','D','D','D','D','D','D','D','D','G','G','G','G','G','G','G','G','G','G','G','G','G','G','D','D','D','D','D','D','D','D','D'],
    ['D','D','D','D','D','D','D','D','D','G','G','G','G','G','G','G','G','G','G','G','G','G','G','D','D','D','D','D','D','D','D','D'],
    ['D','D','D','D','D','D','D','D','D','G','G','G','G','G','G','G','G','G','G','G','G','G','G','D','D','D','D','D','D','D','D','D'],
    ['D','D','D','D','D','D','D','D','D','G','G','G','G','G','G','G','G','G','G','G','G','G','G','D','D','D','D','D','D','D','D','D'],
    ['D','D','D','D','D','D','D','D','D','G','G','G','G','G','G','G','G','G','G','G','G','G','G','D','D','D','D','D','D','D','D','D'],
    ['D','D','D','D','D','D','D','D','D','G','G','G','G','G','G','G','G','G','G','G','G','G','G','D','D','D','D','D','D','D','D','D'],
    ['D','D','D','D','D','D','D','D','D','G','G','G','G','G','G','G','G','G','G','G','G','G','G','D','D','D','D','D','D','D','D','D'],
    ['D','D','D','D','D','D','D','D','D','G','G','G','G','G','G','G','G','G','G','G','G','G','G','D','D','D','D','D','D','D','D','D'],
    // Rows 28-31: open deep ocean (departure sea)
    ['D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D'],
    ['D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D'],
    ['D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D'],
    ['D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D']
  ],
  objects: [
    // === TOP ISLAND CABINS (rows 0-4) ===
    // cabin2 (green roof) at (3,0): cols 3-7, rows 0-4; door at (5,4), entry (5,5)
    {type:'cabin2', tx:3,  ty:0},
    // cabin2 (green roof) at (10,0): cols 10-14, rows 0-4; door at (12,4), entry (12,5)
    {type:'cabin2', tx:10, ty:0},
    // cabin1 (blue roof) at (18,0): cols 18-22, rows 0-4; door at (20,4), entry (20,5)
    {type:'cabin1', tx:18, ty:0},
    // cabin1 (blue roof) at (25,0): cols 25-29, rows 0-4; door at (27,4), entry (27,5)
    {type:'cabin1', tx:25, ty:0},

    // === TOP ISLAND TREES (in G areas, clear of cabin footprints and doors) ===
    {type:'tree2', tx:1,  ty:2},   // left edge (cols 0-2 = G), rows 2-3
    {type:'tree2', tx:16, ty:2},   // center G strip (cols 15-17), rows 2-3
    {type:'tree2', tx:31, ty:2},   // right edge (cols 30-31 = G), rows 2-3

    // === MAIN ISLAND TREES (grass rows 13-15, cols 9-22) ===
    {type:'tree2', tx:10, ty:13},  // col 10, rows 13-14
    {type:'tree2', tx:14, ty:13},  // col 14, rows 13-14
    {type:'tree2', tx:19, ty:13},  // col 19, rows 13-14
    {type:'tree2', tx:20, ty:12},  // col 20, rows 12-13

    // === HARBOR MOUNTAIN WALLS ===
    // Left wall (cols 9-11, stacked 3 mountains)
    {type:'mountain-forest', tx:9, ty:16},
    {type:'mountain-forest', tx:9, ty:19},
    {type:'mountain-forest', tx:9, ty:22},
    // Right wall (cols 21-23, stacked 3 mountains)
    {type:'mountain-forest', tx:21, ty:16},
    {type:'mountain-forest', tx:21, ty:19},
    {type:'mountain-forest', tx:21, ty:22},
    // Bottom wall (5 mountains across cols 9-23)
    {type:'mountain-forest', tx:9,  ty:25},
    {type:'mountain-forest', tx:12, ty:25},
    {type:'mountain-forest', tx:15, ty:25},
    {type:'mountain-forest', tx:18, ty:25},
    {type:'mountain-forest', tx:21, ty:25},

    // === FERRY ZONE (harbor basin south area) ===
  ]
};

window.KAKERN_MAP_DATA = {
  ground: [
    ['GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','G','G','G','G','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GB','GB','GB','GB','GB','G','G','G','G','G','G'],
    ['GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','G','G','G','G','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GB','GB','GB','GB','GB','G','G','G','G','G','G'],
    ['GB','GB','GB','GB','GB','GBu','GBu','GBu','G','G','G','G','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GB','GB','GB','GB','GB','G','G','G','G','G','G'],
    ['GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','G','G','G','G','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GB','GB','GB','GB','GB','G','G','G','G','G','G'],
    ['GB','GB','GB','GB','GB','GBu','GBu','GBu','G','G','G','G','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','G','G','G','G','G','G','G','G','G','G','G'],
    ['GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','G','G','G','G','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','G','G','G','G','G','G','G','G','G','G','G'],
    ['O','O','O','O','O','O','O','O','G','G','G','G','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O'],
    ['O','O','O','O','O','O','O','O','G','G','G','G','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O'],
    ['O','O','O','O','O','O','O','O','G','G','G','G','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O'],
    ['D','D','D','D','D','D','O','O','G','G','G','G','O','O','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D'],
    ['D','D','D','D','D','D','O','O','G','G','G','G','O','O','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D'],
    ['O','O','O','O','O','O','O','O','G','G','G','G','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O'],
    ['O','O','O','O','O','O','O','O','G','G','G','G','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O'],
    ['O','O','O','O','O','O','O','O','G','G','G','G','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O'],
    ['GBu','GBu','GBu','GBu','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['GBu','GBu','GBu','GBu','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['GBu','GBu','GBu','GBu','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['GBu','GBu','GBu','GBu','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['GBu','GBu','GBu','GBu','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['GBu','GBu','GBu','GBu','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['GBu','GBu','GBu','GBu','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['GBu','GBu','GBu','GBu','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['GBu','GBu','GBu','GBu','G','G','G','G','G','G','G','G','G','G','G','GR','GB','G','GR','GB','G','GR','GB','G','GR','GB','G','GR','G','G','G','G'],
    ['GBu','GBu','GBu','GBu','G','G','G','G','G','G','G','G','G','G','G','GR','GB','G','GR','GB','G','GR','GB','G','GR','GB','G','GR','G','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G']
  ],
  objects: [
    // Mountain border top
    {type:'mountain-forest',tx:9, ty:0},{type:'mountain-forest',tx:12,ty:0},
    {type:'mountain-forest',tx:15,ty:0},{type:'mountain-forest',tx:18,ty:0},
    {type:'mountain-forest',tx:21,ty:0},{type:'mountain-forest',tx:24,ty:0},
    {type:'mountain-forest',tx:27,ty:0},{type:'mountain-forest',tx:29,ty:0},
    // Mountain border right column
    {type:'mountain-forest',tx:29,ty:3},{type:'mountain-forest',tx:29,ty:6},
    {type:'mountain-forest',tx:29,ty:23},{type:'mountain-forest',tx:29,ty:26},
    // Mountain border bottom (cols 0-20)
    {type:'mountain-forest',tx:0, ty:29},{type:'mountain-forest',tx:3, ty:29},
    {type:'mountain-forest',tx:6, ty:29},{type:'mountain-forest',tx:9, ty:29},
    {type:'mountain-forest',tx:12,ty:29},{type:'mountain-forest',tx:15,ty:29},
    {type:'mountain-forest',tx:18,ty:29},
    // Trees in top-left GBu zone
    {type:'tree2',tx:0, ty:3},{type:'tree2',tx:2, ty:5},{type:'tree2',tx:1, ty:7},
    {type:'tree2',tx:5, ty:5},{type:'tree2',tx:6, ty:7},
    // Trees top-right flower zone
    {type:'tree2',tx:21,ty:3},{type:'tree2',tx:23,ty:3},
    // Left edge trees (bottom section, lining left side)
    {type:'tree2',tx:0, ty:17},{type:'tree2',tx:0, ty:19},{type:'tree2',tx:0, ty:21},
    {type:'tree2',tx:0, ty:27},
    // Extra trees — clear of cabins, doors, water, bridge
    {type:'tree2',tx:3, ty:2},
    {type:'tree2',tx:7, ty:4},
    {type:'tree2',tx:14, ty:7},
    {type:'tree2',tx:18, ty:6},
    {type:'tree2',tx:7, ty:18},
    {type:'tree2',tx:7, ty:22},
    {type:'tree2',tx:9, ty:20},
    {type:'tree2',tx:11, ty:22},
    {type:'tree2',tx:17, ty:19},
    {type:'tree2',tx:24, ty:23},
    // Cabin on left side
    {type:'cabin2',tx:1, ty:22},
    // Three cabins right section
    {type:'cabin2',tx:12,ty:17},{type:'cabin2',tx:19,ty:17},{type:'cabin2',tx:26,ty:17},
  ],
};

window.KVALVIKA_MAP_DATA = {
  ground: [
    ['D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D'],
    ['D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D'],
    ['D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D'],
    ['D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D'],
    ['D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D'],
    ['D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D'],
    ['O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O'],
    ['O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O'],
    ['O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O'],
    ['O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O'],
    ['O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O'],
    ['O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O'],
    ['B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B'],
    ['B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B'],
    ['B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B'],
    ['B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B'],
    ['G','B','G','GB','GB','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','GB','GB','G','B','G'],
    ['G','B','G','GR','GR','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','GR','GR','G','B','G'],
    ['G','G','G','GB','GB','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','GB','GB','G','G','G'],
    ['G','GB','G','G','GB','G','G','GB','G','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','G','GB','G','G','GB','G','G','GB','G'],
    ['G','GB','G','G','GB','G','G','GB','G','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','G','GB','G','G','GB','G','G','GB','G'],
    ['G','G','G','G','G','G','G','G','G','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','G','G','G','G','G','G','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','GBu','GBu','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','GBu','GBu','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','GBu','GBu','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','GBu','GBu','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','GBu','GBu','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','GBu','GBu','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','G','G','G','G','G','G','G','G','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','G','G','G','G','G','G','G','G','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','G','G','G','G','G','G','G','G','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','G','G','G','G','G','G','G','G','G','G','G']
  ],
  objects: [
    // Mountain-forest side walls — left column
    {type:'mountain-forest', tx:0,  ty:16},
    {type:'mountain-forest', tx:0,  ty:19},
    {type:'mountain-forest', tx:3,  ty:19},
    {type:'mountain-forest', tx:6,  ty:19},
    {type:'mountain-forest', tx:0,  ty:22},
    {type:'mountain-forest', tx:3,  ty:22},
    {type:'mountain-forest', tx:6,  ty:22},
    {type:'mountain-forest', tx:9,  ty:22},
    {type:'mountain-forest', tx:12, ty:22},
    {type:'mountain-forest', tx:9,  ty:25},
    {type:'mountain-forest', tx:12, ty:25},
    {type:'mountain-forest', tx:3,  ty:26},
    {type:'mountain-forest', tx:6,  ty:26},
    {type:'mountain-forest', tx:0,  ty:28},
    // Mountain-forest side walls — right column
    {type:'mountain-forest', tx:29, ty:16},
    {type:'mountain-forest', tx:23, ty:19},
    {type:'mountain-forest', tx:26, ty:19},
    {type:'mountain-forest', tx:29, ty:19},
    {type:'mountain-forest', tx:17, ty:22},
    {type:'mountain-forest', tx:20, ty:22},
    {type:'mountain-forest', tx:23, ty:22},
    {type:'mountain-forest', tx:26, ty:22},
    {type:'mountain-forest', tx:29, ty:22},
    {type:'mountain-forest', tx:17, ty:25},
    {type:'mountain-forest', tx:20, ty:25},
    {type:'mountain-forest', tx:23, ty:26},
    {type:'mountain-forest', tx:26, ty:26},
    {type:'mountain-forest', tx:29, ty:28},
    // Trees in grass area (rows 16-18, cols 5-27 — away from mountain edges)
    {type:'tree2', tx:10, ty:16},
    {type:'tree2', tx:21, ty:16},
    {type:'tree2', tx:13, ty:16},
    {type:'tree2', tx:18, ty:16},
  ]
};

window.TROMSO_MAP_DATA = {
  ground: [
    // Rows 0-15: upper-right diagonal river (unchanged)
    'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSOO',
    ['S','S','S','SBu','S','S','S','S','SBu','S','S','S','S','SBu','S','S','S','S','S','S','S','S','S','S','S','S','S','S','S','O','O','D'],
    'SSSSSSSSSSSSSSSSSSSSSSSSSSSSOODD',
    ['S','S','S','S','S','S','S','S','S','S','SFB','SFB','S','S','S','S','S','S','S','S','S','S','S','S','S','S','S','O','O','D','D','D'],
    'SSSSSSSSSSSSSSSSSSSSSSSSSSOODDDO',
    ['S','I','I','I','I','I','I','I','I','S','SFB','SFB','S','S','S','S','S','S','S','S','S','S','S','S','S','O','O','D','D','D','O','O'],
    ['S','I','I','I','I','I','I','I','I','S','S','S','S','S','S','S','S','S','S','S','S','S','S','S','O','O','D','D','D','O','O','S'],
    ['S','I','I','I','I','I','I','I','I','S','S','S','S','S','S','S','S','S','S','S','S','S','S','O','O','D','D','D','O','O','S','S'],
    ['S','I','I','I','I','I','I','I','I','S','S','S','S','S','S','S','S','S','S','S','S','S','O','O','D','D','D','O','O','S','S','S'],
    ['S','I','I','I','I','I','I','I','I','S','S','S','S','S','SBu','SBu','SBu','SBu','S','S','S','O','O','D','D','D','O','O','S','S','S','S'],
    ['S','I','I','I','I','I','I','I','I','S','S','S','S','S','SBu','SBu','SBu','SBu','S','S','O','O','D','D','D','O','O','S','S','S','S','S'],
    ['S','S','S','S','S','S','S','S','S','S','S','S','S','S','SBu','SBu','SBu','SBu','S','O','O','D','D','D','O','O','S','S','S','S','S','S'],
    ['S','S','S','S','S','S','S','S','S','S','S','S','S','S','SBu','SBu','SBu','SBu','O','O','D','D','D','O','O','S','S','S','S','S','S','S'],
    'SSSSSSSSSSSSSSSSSSOODDDOOSSSSSSS',
    ['S','S','S','S','S','S','S','S','S','SFR','SFR','SFR','S','S','S','S','S','S','O','O','D','D','D','O','O','S','S','S','S','S','S','S'],
    'SSSSSSSSSSSSSSSSOODDDOOSSSSSSSSS',
    'SSSSSSSSSSSSSSSOODDDOOSSSSSSSSSS',
    // Rows 16-19: lower-left diagonal river matching upper-right (2O+3D+2O)
    ['S','S','S','S','S','S','S','S','S','S','S','S','S','S','O','O','D','D','D','O','O','S','S','S','S','S','S','S','S','S','S','S'],
    ['S','S','S','S','S','S','S','S','S','S','S','S','S','O','O','D','D','D','O','O','S','S','SFR','SFR','S','S','S','S','S','S','S','S'],
    'SSSSSSSSSSSSOODDDOOSSSSSSSSSSSSS',
    'SSSSSSSSSSSOODDDOOSSSSSSSSSSSSSS',
    // Rows 20-22: snow bridge connecting the two land plots
    ['S','S','S','S','S','S','S','S','S','S','S','S','S','S','S','S','S','SBu','SBu','SBu','SBu','S','SFR','SFR','S','S','S','S','S','S','S','S'],
    ['S','S','S','S','S','S','S','S','S','S','S','S','S','S','S','S','S','SBu','SBu','SBu','SBu','S','S','S','S','S','S','S','S','S','S','S'],
    ['S','S','S','S','S','S','S','S','S','S','S','S','S','S','S','S','S','SBu','SBu','SBu','SBu','S','S','S','S','S','SFR','SFR','SFR','S','S','S'],
    // Rows 23-31: lower-left diagonal river continues
    ['S','S','S','S','S','S','S','O','O','D','D','D','O','O','S','S','S','SBu','SBu','SBu','SBu','S','S','S','S','S','S','S','S','S','S','S'],
    ['S','S','S','S','S','S','O','O','D','D','D','O','O','S','S','S','S','S','SBu','SBu','SBu','SBu','S','S','S','S','S','S','S','S','S','S'],
    ['S','S','S','S','S','O','O','D','D','D','O','O','S','S','S','S','S','S','SBu','SBu','SBu','SBu','S','S','S','S','S','S','S','S','S','S'],
    ['S','S','S','S','O','O','D','D','D','O','O','S','S','S','S','S','S','S','SBu','SBu','SBu','SBu','S','S','S','S','S','S','S','S','S','S'],
    ['S','S','S','O','O','D','D','D','O','O','S','S','SFB','SFB','SFB','S','S','S','SBu','SBu','SBu','SBu','S','S','S','S','S','S','S','S','S','S'],
    ['S','S','O','O','D','D','D','O','O','S','S','S','S','S','S','S','S','S','S','S','S','S','S','S','S','S','S','S','S','S','S','S'],
    ['S','O','O','D','D','D','O','O','S','S','S','S','S','S','S','S','S','S','S','S','S','S','S','S','S','S','S','S','S','S','S','S'],
    'OODDDOOSSSSSSSSSSSSSSSSSSSSSSSSS',
    'ODDDOOSSSSSSSSSSSSSSSSSSSSSSSSSS',
  ],
  objects: [
  {type:'cabin2', tx:17, ty:3},
  {type:'cabin1', tx:2, ty:17},
  {type:'snow-lake', tx:14, ty:9},
  {type:'snow-lake', tx:4, ty:13},
  // Top border trees — row 0, every column (cols 0-29, skipping ocean at 30-31)
  {type:'tree2',tx:0,ty:0},{type:'tree2',tx:1,ty:0},{type:'tree2',tx:2,ty:0},{type:'tree2',tx:3,ty:0},
  {type:'tree2',tx:4,ty:0},{type:'tree2',tx:5,ty:0},{type:'tree2',tx:6,ty:0},{type:'tree2',tx:7,ty:0},
  {type:'tree2',tx:8,ty:0},{type:'tree2',tx:9,ty:0},{type:'tree2',tx:10,ty:0},{type:'tree2',tx:11,ty:0},
  {type:'tree2',tx:12,ty:0},{type:'tree2',tx:13,ty:0},{type:'tree2',tx:14,ty:0},{type:'tree2',tx:15,ty:0},
  {type:'tree2',tx:16,ty:0},{type:'tree2',tx:17,ty:0},{type:'tree2',tx:18,ty:0},{type:'tree2',tx:19,ty:0},
  {type:'tree2',tx:20,ty:0},{type:'tree2',tx:21,ty:0},{type:'tree2',tx:22,ty:0},{type:'tree2',tx:23,ty:0},
  {type:'tree2',tx:24,ty:0},{type:'tree2',tx:25,ty:0},{type:'tree2',tx:26,ty:0},{type:'tree2',tx:27,ty:0},
  {type:'tree2',tx:28,ty:0},{type:'tree2',tx:29,ty:0},
  // Left column trees — full height of left plot (tx=0, rows 2-28)
  {type:'tree2',tx:0,ty:2},{type:'tree2',tx:0,ty:4},{type:'tree2',tx:0,ty:6},
  {type:'tree2',tx:0,ty:8},{type:'tree2',tx:0,ty:10},{type:'tree2',tx:0,ty:12},
  {type:'tree2',tx:0,ty:14},{type:'tree2',tx:0,ty:16},{type:'tree2',tx:0,ty:18},
  {type:'tree2',tx:0,ty:20},{type:'tree2',tx:0,ty:22},{type:'tree2',tx:0,ty:24},
  {type:'tree2',tx:0,ty:26},{type:'tree2',tx:0,ty:28},
  // Right column trees — full height of right plot (tx=31, rows 6-30)
  {type:'tree2',tx:31,ty:6},{type:'tree2',tx:31,ty:8},{type:'tree2',tx:31,ty:10},{type:'tree2',tx:31,ty:12},
  {type:'tree2',tx:31,ty:14},{type:'tree2',tx:31,ty:16},{type:'tree2',tx:31,ty:18},
  {type:'tree2',tx:31,ty:20},{type:'tree2',tx:31,ty:22},{type:'tree2',tx:31,ty:24},
  {type:'tree2',tx:31,ty:26},{type:'tree2',tx:31,ty:28},{type:'tree2',tx:31,ty:30},
  // Bottom border trees — row 30, every column (cols 7-30, skipping ocean at 0-6; col 31 in right-column list)
  {type:'tree2',tx:7,ty:30},{type:'tree2',tx:8,ty:30},{type:'tree2',tx:9,ty:30},
  {type:'tree2',tx:10,ty:30},{type:'tree2',tx:11,ty:30},{type:'tree2',tx:12,ty:30},{type:'tree2',tx:13,ty:30},
  {type:'tree2',tx:14,ty:30},{type:'tree2',tx:15,ty:30},{type:'tree2',tx:16,ty:30},{type:'tree2',tx:17,ty:30},
  {type:'tree2',tx:18,ty:30},{type:'tree2',tx:19,ty:30},{type:'tree2',tx:20,ty:30},{type:'tree2',tx:21,ty:30},
  {type:'tree2',tx:22,ty:30},{type:'tree2',tx:23,ty:30},{type:'tree2',tx:24,ty:30},{type:'tree2',tx:25,ty:30},
  {type:'tree2',tx:26,ty:30},{type:'tree2',tx:27,ty:30},{type:'tree2',tx:28,ty:30},{type:'tree2',tx:29,ty:30},
  {type:'tree2',tx:30,ty:30},
  // Interior trees
  {type:'tree2',tx:7,ty:3},{type:'tree2',tx:10,ty:6},{type:'tree2',tx:9,ty:11},
  {type:'tree2',tx:8,ty:15},{type:'tree2',tx:28,ty:20},{type:'tree2',tx:26,ty:23},{type:'tree2',tx:29,ty:25},
  {type:'tree2',tx:22,ty:5},{type:'tree2',tx:22,ty:18},{type:'tree2',tx:24,ty:20},
  // Snow mountains — lower right
  {type:'ice-mountain', tx:24, ty:27},
  {type:'ice-mountain', tx:28, ty:27},
  ]
};
window.OBJECT_DEFS = {
  'mountain-forest': { key:'obj-mountain-forest', tw:3, th:3, walkable:false, water:false },
  'mountain-beach':  { key:'obj-mountain-beach',  tw:3, th:3, walkable:false, water:false },
  'tree1':           { key:'obj-tree1',            tw:1, th:2, walkable:false, water:false },
  'tree2':           { key:'obj-tree2',            tw:1, th:2, walkable:false, water:false },
  'cabin1':          { key:'obj-cabin1',           tw:5, th:5, walkable:false, water:false },
  'cabin2':          { key:'obj-cabin2',           tw:5, th:5, walkable:false, water:false },
  'badder-cabin':    { key:'badder-cabin',          tw:7, th:7, walkable:false, water:false },
  'shop':            { key:'obj-shop',             tw:5, th:5, walkable:false, water:false },
  'ferry-zone':      { key:'obj-ferry-zone',       tw:3, th:3, walkable:true,  water:false },
  'lake':            { key:'obj-lake',             tw:3, th:3, walkable:false, water:true  },
  'island-rock':     { key:'obj-island-rock',      tw:3, th:3, walkable:false, water:false },
  'lake-beach':      { key:'obj-lake-beach',      tw:3, th:3, walkable:false, water:true  },
  'island-beach':    { key:'obj-island-beach',     tw:3, th:3, walkable:true,  water:false },
  'ice-mountain':    { key:'obj-ice-mountain',     tw:3, th:3, walkable:false, water:false },
  'snow-tree':       { key:'obj-snow-tree',        tw:1, th:2, walkable:false, water:false },
  'snow-lake':       { key:'obj-snow-lake',        tw:3, th:3, walkable:false, water:true  },
};

window.buildMapGrids = function(map) {
  const ROWS = GAME_DATA.MAP_ROWS, COLS = GAME_DATA.MAP_COLS;
  const walkGrid  = Array.from({length:ROWS}, ()=>Array(COLS).fill(true));
  const waterGrid = Array.from({length:ROWS}, ()=>Array(COLS).fill(false));
  for (let r=0; r<ROWS; r++) {
    for (let c=0; c<COLS; c++) {
      const g = map.ground[r][c];
      if (g==='O'||g==='D') { walkGrid[r][c]=false; waterGrid[r][c]=true; }
    }
  }
  for (const obj of map.objects) {
    const def = OBJECT_DEFS[obj.type];
    if (!def) continue;
    for (let dy=0; dy<def.th; dy++) {
      for (let dx=0; dx<def.tw; dx++) {
        const r=obj.ty+dy, c=obj.tx+dx;
        if (r<ROWS && c<COLS) {
          walkGrid[r][c] = def.walkable;
          if (def.water) waterGrid[r][c] = true;
        }
      }
    }
  }
  return { walkGrid, waterGrid };
};

window.LEKNES_MAP_DATA = {
  ground: [
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','GB','GB','GB','GB','GB','GB','G','G','G','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','GB','GB','GB','GB','GB','GB','G','G','G','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','GB','GB','GB','GB','GB','GB','G','G','G','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','GB','GB','GB','GB','GB','GB','G','G','G','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','G','G','G'],
    ['O','O','O','O','O','O','O','O','O','G','G','G','G','G','G','G','G','G','G','G','G','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','G','G','G'],
    ['O','O','O','O','O','O','O','O','O','G','G','G','G','G','G','G','G','G','G','G','G','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','G','G','G'],
    ['O','O','O','O','O','O','O','O','O','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['O','O','O','O','O','O','O','O','O','G','G','GR','GR','GR','GR','GR','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['O','O','O','O','O','O','O','O','O','G','G','GR','GR','GR','GR','GR','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['O','O','O','O','O','O','O','O','O','G','G','GR','GR','GR','GR','GR','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['O','O','O','O','O','O','O','O','O','G','G','GR','GR','GR','GR','GR','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['O','O','O','O','O','O','O','O','O','G','G','GR','GR','GR','GR','GR','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['O','O','O','O','O','O','O','O','O','G','G','GR','GR','GR','GR','GR','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G']
  ],
  objects: [
    // Mountain border top row
    {type:'mountain-forest',tx:0, ty:0},{type:'mountain-forest',tx:3, ty:0},
    {type:'mountain-forest',tx:6, ty:0},{type:'mountain-forest',tx:9, ty:0},
    {type:'mountain-forest',tx:12,ty:0},{type:'mountain-forest',tx:15,ty:0},
    {type:'mountain-forest',tx:18,ty:0},{type:'mountain-forest',tx:21,ty:0},
    {type:'mountain-forest',tx:24,ty:0},{type:'mountain-forest',tx:27,ty:0},
    {type:'mountain-forest',tx:29,ty:0},
    // Mountain border bottom row
    {type:'mountain-forest',tx:0, ty:29},{type:'mountain-forest',tx:3, ty:29},
    {type:'mountain-forest',tx:6, ty:29},{type:'mountain-forest',tx:9, ty:29},
    {type:'mountain-forest',tx:12,ty:29},{type:'mountain-forest',tx:15,ty:29},
    {type:'mountain-forest',tx:18,ty:29},{type:'mountain-forest',tx:21,ty:29},
    {type:'mountain-forest',tx:24,ty:29},{type:'mountain-forest',tx:27,ty:29},
    {type:'mountain-forest',tx:29,ty:29},
    // Mountain border left column (skip rows 12-20 where lake sits)
    {type:'mountain-forest',tx:0,ty:3},{type:'mountain-forest',tx:0,ty:6},
    {type:'mountain-forest',tx:0,ty:9},
    {type:'mountain-forest',tx:0,ty:21},{type:'mountain-forest',tx:0,ty:24},
    {type:'mountain-forest',tx:0,ty:27},
    // Mountain border right column
    {type:'mountain-forest',tx:29,ty:3},{type:'mountain-forest',tx:29,ty:6},
    {type:'mountain-forest',tx:29,ty:9},{type:'mountain-forest',tx:29,ty:12},
    {type:'mountain-forest',tx:29,ty:15},{type:'mountain-forest',tx:29,ty:18},
    {type:'mountain-forest',tx:29,ty:21},{type:'mountain-forest',tx:29,ty:24},
    {type:'mountain-forest',tx:29,ty:27},
    // Large lake on left side (covers cols 0-8, rows 12-20)
    // Small central lakes
    {type:'lake',tx:14,ty:8},
    {type:'lake',tx:14,ty:22},
    // Buildings
    {type:'shop',   tx:8, ty:7},
    {type:'cabin1', tx:22,ty:7},
    {type:'cabin2', tx:22,ty:18},
    // Trees
    {type:'tree1',tx:3, ty:3},{type:'tree1',tx:5, ty:6},
    {type:'tree1',tx:7, ty:24},{type:'tree1',tx:4, ty:27},
    {type:'tree1',tx:12,ty:4},{type:'tree1',tx:18,ty:6},
    {type:'tree1',tx:7, ty:4},{type:'tree1',tx:11,ty:24},
    // Extra trees
    {type:'tree1',tx:16,ty:18},{type:'tree1',tx:5, ty:10},
    {type:'tree1',tx:20,ty:24},{type:'tree1',tx:17,ty:26},
    {type:'tree1',tx:24,ty:25},{type:'tree1',tx:4, ty:22},
    {type:'tree1',tx:6, ty:27},{type:'tree1',tx:21,ty:27},
    // Ferry zone (east of left lake)
  ]
};

window.HENNINGSVAER_MAP_DATA = {
  // Layout: 4 cabins on top island (rows 0-5), narrow bridge (rows 6-12, cols 15-17),
  // grass hillside (rows 13-15, cols 9-22), mountain-enclosed harbor basin (rows 16-27, cols 9-23)
  ground: [
    // Row 0: top island - G edges, GB under cabins, O water gaps between clusters
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    // Rows 1-5: top island — G open areas, GB only under/near cabin footprints
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    // Rows 6-12: narrow bridge channel — O (normal ocean) not D until mountains
    ['O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','GB','G','GB','O','O','O','O','O','O','O','O','O','O','O','O','O','O'],
    ['O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','GB','G','GB','O','O','O','O','O','O','O','O','O','O','O','O','O','O'],
    ['O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','GB','G','GB','O','O','O','O','O','O','O','O','O','O','O','O','O','O'],
    ['O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','GB','G','GB','O','O','O','O','O','O','O','O','O','O','O','O','O','O'],
    ['O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','GB','G','GB','O','O','O','O','O','O','O','O','O','O','O','O','O','O'],
    ['O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','GB','G','GB','O','O','O','O','O','O','O','O','O','O','O','O','O','O'],
    ['O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','GB','G','GB','O','O','O','O','O','O','O','O','O','O','O','O','O','O'],
    // Rows 13-15: grass hillside connecting to harbor — O surrounds (not deep)
    ['O','O','O','O','O','O','O','O','O','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','O','O','O','O','O','O','O','O'],
    ['O','O','O','O','O','O','O','O','O','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','O','O','O','O','O','O','O','O'],
    ['O','O','O','O','O','O','O','O','O','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','O','O','O','O','O','O','O','O'],
    // Rows 16-27: harbor basin — D outer sea, G interior with GB only at mountain-wall edges
    ['D','D','D','D','D','D','D','D','D','G','G','G','G','G','G','G','G','G','G','G','GR','GR','G','D','D','D','D','D','D','D','D','D'],
    ['D','D','D','D','D','D','D','D','D','G','G','G','G','G','G','G','G','G','G','G','GR','GR','G','D','D','D','D','D','D','D','D','D'],
    ['D','D','D','D','D','D','D','D','D','G','G','G','G','G','G','G','G','G','G','G','GR','GR','G','D','D','D','D','D','D','D','D','D'],
    ['D','D','D','D','D','D','D','D','D','G','G','G','G','G','G','G','G','G','G','G','GR','GR','G','D','D','D','D','D','D','D','D','D'],
    ['D','D','D','D','D','D','D','D','D','G','G','G','G','G','G','G','G','G','G','G','GR','GR','G','D','D','D','D','D','D','D','D','D'],
    ['D','D','D','D','D','D','D','D','D','G','G','G','G','G','G','G','G','G','G','G','GR','GR','G','D','D','D','D','D','D','D','D','D'],
    ['D','D','D','D','D','D','D','D','D','G','G','G','G','G','G','G','G','G','G','G','GR','GR','G','D','D','D','D','D','D','D','D','D'],
    ['D','D','D','D','D','D','D','D','D','G','G','G','G','G','G','G','G','G','G','G','GR','GR','G','D','D','D','D','D','D','D','D','D'],
    ['D','D','D','D','D','D','D','D','D','G','G','G','G','G','G','G','G','G','G','G','GR','GR','G','D','D','D','D','D','D','D','D','D'],
    ['D','D','D','D','D','D','D','D','D','G','G','G','G','G','G','G','G','G','G','G','G','G','G','D','D','D','D','D','D','D','D','D'],
    ['D','D','D','D','D','D','D','D','D','G','G','G','G','G','G','G','G','G','G','G','G','G','G','D','D','D','D','D','D','D','D','D'],
    ['D','D','D','D','D','D','D','D','D','G','G','G','G','G','G','G','G','G','G','G','G','G','G','D','D','D','D','D','D','D','D','D'],
    // Rows 28-31: open deep ocean (departure sea)
    ['D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D'],
    ['D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D'],
    ['D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D'],
    ['D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D']
  ],
  objects: [
    // === TOP ISLAND CABINS (rows 0-4) ===
    // cabin2 (green roof) at (3,0): cols 3-7, rows 0-4; door at (5,4), entry (5,5)
    {type:'cabin2', tx:3,  ty:0},
    // cabin2 (green roof) at (10,0): cols 10-14, rows 0-4; door at (12,4), entry (12,5)
    {type:'cabin2', tx:10, ty:0},
    // cabin1 (blue roof) at (18,0): cols 18-22, rows 0-4; door at (20,4), entry (20,5)
    {type:'cabin1', tx:18, ty:0},
    // cabin1 (blue roof) at (25,0): cols 25-29, rows 0-4; door at (27,4), entry (27,5)
    {type:'cabin1', tx:25, ty:0},

    // === TOP ISLAND TREES (in G areas, clear of cabin footprints and doors) ===
    {type:'tree1', tx:1,  ty:2},   // left edge (cols 0-2 = G), rows 2-3
    {type:'tree1', tx:16, ty:2},   // center G strip (cols 15-17), rows 2-3
    {type:'tree1', tx:31, ty:2},   // right edge (cols 30-31 = G), rows 2-3

    // === MAIN ISLAND TREES (grass rows 13-15, cols 9-22) ===
    {type:'tree1', tx:10, ty:13},  // col 10, rows 13-14
    {type:'tree1', tx:14, ty:13},  // col 14, rows 13-14
    {type:'tree1', tx:19, ty:13},  // col 19, rows 13-14
    {type:'tree1', tx:20, ty:13},  // col 20, rows 13-14

    // === HARBOR MOUNTAIN WALLS ===
    // Left wall (cols 9-11, stacked 3 mountains)
    {type:'mountain-forest', tx:9, ty:16},
    {type:'mountain-forest', tx:9, ty:19},
    {type:'mountain-forest', tx:9, ty:22},
    // Right wall (cols 21-23, stacked 3 mountains)
    {type:'mountain-forest', tx:21, ty:16},
    {type:'mountain-forest', tx:21, ty:19},
    {type:'mountain-forest', tx:21, ty:22},
    // Bottom wall (5 mountains across cols 9-23)
    {type:'mountain-forest', tx:9,  ty:25},
    {type:'mountain-forest', tx:12, ty:25},
    {type:'mountain-forest', tx:15, ty:25},
    {type:'mountain-forest', tx:18, ty:25},
    {type:'mountain-forest', tx:21, ty:25},

    // === FERRY ZONE (harbor basin south area) ===
  ]
};

window.KAKERN_MAP_DATA = {
  ground: [
    ['GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','G','G','G','G','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GB','GB','GB','GB','GB','G','G','G','G','G','G'],
    ['GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','G','G','G','G','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GB','GB','GB','GB','GB','G','G','G','G','G','G'],
    ['GB','GB','GB','GB','GB','GBu','GBu','GBu','G','G','G','G','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GB','GB','GB','GB','GB','G','G','G','G','G','G'],
    ['GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','G','G','G','G','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GB','GB','GB','GB','GB','G','G','G','G','G','G'],
    ['GB','GB','GB','GB','GB','GBu','GBu','GBu','G','G','G','G','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','G','G','G','G','G','G','G','G','G','G','G'],
    ['GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','G','G','G','G','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','G','G','G','G','G','G','G','G','G','G','G'],
    ['O','O','O','O','O','O','O','O','G','G','G','G','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O'],
    ['O','O','O','O','O','O','O','O','G','G','G','G','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O'],
    ['O','O','O','O','O','O','O','O','G','G','G','G','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O'],
    ['D','D','D','D','D','D','O','O','G','G','G','G','O','O','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D'],
    ['D','D','D','D','D','D','O','O','G','G','G','G','O','O','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D'],
    ['O','O','O','O','O','O','O','O','G','G','G','G','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O'],
    ['O','O','O','O','O','O','O','O','G','G','G','G','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O'],
    ['O','O','O','O','O','O','O','O','G','G','G','G','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O'],
    ['GBu','GBu','GBu','GBu','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['GBu','GBu','GBu','GBu','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['GBu','GBu','GBu','GBu','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['GBu','GBu','GBu','GBu','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['GBu','GBu','GBu','GBu','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['GBu','GBu','GBu','GBu','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['GBu','GBu','GBu','GBu','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['GBu','GBu','GBu','GBu','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['GBu','GBu','GBu','GBu','G','G','G','G','G','G','G','G','G','G','G','GR','GB','G','GR','GB','G','GR','GB','G','GR','GB','G','GR','G','G','G','G'],
    ['GBu','GBu','GBu','GBu','G','G','G','G','G','G','G','G','G','G','G','GR','GB','G','GR','GB','G','GR','GB','G','GR','GB','G','GR','G','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G']
  ],
  objects: [
    // Mountain border top
    {type:'mountain-forest',tx:9, ty:0},{type:'mountain-forest',tx:12,ty:0},
    {type:'mountain-forest',tx:15,ty:0},{type:'mountain-forest',tx:18,ty:0},
    {type:'mountain-forest',tx:21,ty:0},{type:'mountain-forest',tx:24,ty:0},
    {type:'mountain-forest',tx:27,ty:0},{type:'mountain-forest',tx:29,ty:0},
    // Mountain border right column
    {type:'mountain-forest',tx:29,ty:3},{type:'mountain-forest',tx:29,ty:6},
    {type:'mountain-forest',tx:29,ty:23},{type:'mountain-forest',tx:29,ty:26},
    // Mountain border bottom (cols 0-20)
    {type:'mountain-forest',tx:0, ty:29},{type:'mountain-forest',tx:3, ty:29},
    {type:'mountain-forest',tx:6, ty:29},{type:'mountain-forest',tx:9, ty:29},
    {type:'mountain-forest',tx:12,ty:29},{type:'mountain-forest',tx:15,ty:29},
    {type:'mountain-forest',tx:18,ty:29},
    // Trees in top-left GBu zone
    {type:'tree1',tx:0, ty:3},{type:'tree1',tx:2, ty:5},{type:'tree1',tx:1, ty:7},
    {type:'tree1',tx:5, ty:5},{type:'tree1',tx:6, ty:7},
    // Trees top-right flower zone
    {type:'tree1',tx:21,ty:3},{type:'tree1',tx:23,ty:3},
    // Left edge trees (bottom section, lining left side)
    {type:'tree1',tx:0, ty:17},{type:'tree1',tx:0, ty:19},{type:'tree1',tx:0, ty:21},
    {type:'tree1',tx:0, ty:27},
    // Parked cars
    // Extra trees — clear of cabins, doors, water, bridge
    {type:'tree1',tx:3, ty:2},
    {type:'tree1',tx:7, ty:4},
    {type:'tree1',tx:14, ty:7},
    {type:'tree1',tx:18, ty:6},
    {type:'tree1',tx:7, ty:18},
    {type:'tree1',tx:7, ty:22},
    {type:'tree1',tx:9, ty:20},
    {type:'tree1',tx:11, ty:22},
    {type:'tree1',tx:17, ty:19},
    {type:'tree1',tx:24, ty:23},
    // Cabin on left side
    {type:'cabin2',tx:1, ty:22},
    // Three cabins right section
    {type:'cabin2',tx:12,ty:17},{type:'cabin2',tx:19,ty:17},{type:'cabin2',tx:26,ty:17},
  ],
};

window.KVALVIKA_MAP_DATA = {
  ground: [
    ['D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D'],
    ['D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D'],
    ['D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D'],
    ['D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D'],
    ['D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D'],
    ['D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D','D'],
    ['O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O'],
    ['O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O'],
    ['O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O'],
    ['O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O'],
    ['O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O'],
    ['O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O'],
    ['B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B'],
    ['B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B'],
    ['B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B'],
    ['B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B'],
    ['G','B','G','GB','GB','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','GB','GB','G','B','G'],
    ['G','B','G','GR','GR','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','GR','GR','G','B','G'],
    ['G','G','G','GB','GB','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','GB','GB','G','G','G'],
    ['G','GB','G','G','GB','G','G','GB','G','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','G','GB','G','G','GB','G','G','GB','G'],
    ['G','GB','G','G','GB','G','G','GB','G','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','G','GB','G','G','GB','G','G','GB','G'],
    ['G','G','G','G','G','G','G','G','G','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','G','G','G','G','G','G','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','GBu','GBu','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','GBu','GBu','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','GBu','GBu','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['G','GFB','G','GFR','G','G','G','G','G','G','G','G','G','G','G','GBu','GBu','G','G','G','G','G','G','G','G','G','GFB','G','G','GFR','G','G'],
    ['G','G','GFR','G','GFB','G','G','G','G','G','G','G','G','G','G','GBu','GBu','G','G','G','G','G','G','G','G','G','G','GFR','G','G','GFB','G'],
    ['GFB','G','G','GFR','G','G','G','G','G','G','G','G','G','G','G','GBu','GBu','G','G','G','G','G','G','G','G','G','GFB','G','G','GFR','G','G'],
    ['G','GFR','G','G','GFB','G','G','G','G','G','G','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','G','G','G','G','G','G','G','GFR','G','GFB','G'],
    ['G','G','GFB','G','GFR','G','G','G','G','G','G','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','G','G','G','G','GFB','G','G','GFR','G','G','G'],
    ['GFR','G','GFB','G','G','G','G','G','G','G','G','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','G','G','G','G','G','G','GFR','G','G','GFB','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','GBu','G','G','G','G','G','G','G','G','G','G','G']
  ],
  objects: [
    {type:'mountain-forest', tx:0,  ty:16},
    {type:'mountain-forest', tx:0,  ty:19},
    {type:'mountain-forest', tx:3,  ty:19},
    {type:'mountain-forest', tx:6,  ty:19},
    {type:'mountain-forest', tx:0,  ty:22},
    {type:'mountain-forest', tx:3,  ty:22},
    {type:'mountain-forest', tx:6,  ty:22},
    {type:'mountain-forest', tx:9,  ty:22},
    {type:'mountain-forest', tx:12, ty:22},
    {type:'mountain-forest', tx:9,  ty:25},
    {type:'mountain-forest', tx:12, ty:25},
    {type:'mountain-forest', tx:3,  ty:26},
    {type:'mountain-forest', tx:6,  ty:26},
    {type:'mountain-forest', tx:0,  ty:28},
    // Mountain-forest side walls — right column
    {type:'mountain-forest', tx:29, ty:16},
    {type:'mountain-forest', tx:23, ty:19},
    {type:'mountain-forest', tx:26, ty:19},
    {type:'mountain-forest', tx:29, ty:19},
    {type:'mountain-forest', tx:17, ty:22},
    {type:'mountain-forest', tx:20, ty:22},
    {type:'mountain-forest', tx:23, ty:22},
    {type:'mountain-forest', tx:26, ty:22},
    {type:'mountain-forest', tx:29, ty:22},
    {type:'mountain-forest', tx:17, ty:25},
    {type:'mountain-forest', tx:20, ty:25},
    {type:'mountain-forest', tx:23, ty:26},
    {type:'mountain-forest', tx:26, ty:26},
    {type:'mountain-forest', tx:29, ty:28},
    // Trees in grass area (rows 16-18, cols 5-27 — away from mountain edges)
    {type:'tree1', tx:10, ty:16},
    {type:'tree1', tx:21, ty:16},
    {type:'tree1', tx:13, ty:16},
    {type:'tree1', tx:18, ty:16},
    // Lower corner decoration
    {type:'tree1',tx:1,ty:25},
    {type:'tree1',tx:4,ty:29},
    {type:'tree1',tx:3,ty:29},
    {type:'tree1',tx:28,ty:29},
    {type:'tree1',tx:30,ty:25},
    {type:'tree1',tx:26,ty:29}
  ]
};

window.REINE_MAP_DATA = {
  ground: [
    ['D','D','O','O','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','D','D','D','D','D','D','D','G','G','G','G','G','G'],
    ['D','D','O','O','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','D','D','D','D','D','D','D','G','G','G','G','G','G'],
    ['D','D','O','O','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','D','D','D','D','D','D','D','G','G','G','G','G','G'],
    ['D','D','O','O','G','G','G','G','G','G','GBu','GBu','G','O','O','O','O','O','O','D','D','D','D','G','G','G','G','G','G','G','G','G'],
    ['D','D','O','O','G','G','G','G','G','G','GBu','GBu','G','G','O','O','O','O','O','O','O','O','O','G','G','G','G','G','G','G','G','G'],
    ['D','D','O','O','G','G','G','G','G','G','G','G','G','G','GBu','GBu','O','O','O','O','O','O','O','G','G','G','G','G','G','G','G','G'],
    ['D','D','O','O','O','O','G','G','G','G','G','G','G','G','GBu','GBu','O','O','O','O','O','O','O','O','D','D','D','D','D','D','D','D'],
    ['D','D','O','O','O','O','G','G','G','G','G','G','G','G','G','O','O','O','O','O','O','O','O','O','D','D','D','D','D','D','D','D'],
    ['D','D','O','O','O','O','G','G','G','G','G','G','G','G','G','O','O','O','O','O','O','O','O','O','D','D','D','D','D','D','D','D'],
    ['D','D','O','O','O','O','G','G','G','G','G','G','G','G','G','O','O','O','O','O','O','O','O','O','D','D','D','D','D','D','D','D'],
    ['D','D','O','O','O','O','G','G','G','G','G','G','G','G','G','O','O','O','O','O','O','O','O','O','D','D','D','D','D','G','G','G'],
    ['D','D','O','O','O','O','G','G','G','G','G','G','G','G','G','GR','O','O','O','O','O','O','O','O','D','D','D','D','D','G','G','G'],
    ['D','D','O','O','GBu','GBu','G','G','G','G','G','G','G','G','G','GR','O','O','O','O','O','O','O','O','D','D','D','D','D','G','G','G'],
    ['D','D','O','O','GBu','GBu','G','G','G','G','G','G','G','G','G','GR','O','O','O','O','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['O','O','O','O','GR','GR','G','G','G','G','G','G','G','G','G','GR','O','O','O','O','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['O','O','O','O','O','O','G','G','G','G','G','G','G','G','G','O','O','O','O','O','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['O','O','G','G','G','G','G','G','G','G','G','G','G','G','G','O','O','O','O','O','O','O','O','O','D','D','D','D','D','G','G','G'],
    ['O','O','G','G','G','G','G','G','G','G','G','G','G','G','G','O','O','O','O','O','O','O','O','O','D','D','D','D','D','G','G','G'],
    ['GBu','GBu','GBu','GBu','GBu','G','G','G','G','G','G','G','G','G','G','O','O','O','O','O','O','O','O','O','D','D','D','D','D','G','G','G'],
    ['GBu','GBu','GBu','GBu','GBu','G','G','G','G','G','G','G','G','G','G','GR','O','O','O','O','O','O','O','O','D','D','D','D','D','D','D','D'],
    ['GBu','GBu','GBu','GBu','GBu','G','G','G','G','G','G','G','G','G','G','GR','O','O','O','O','O','O','O','O','D','D','D','D','D','D','D','D'],
    ['GBu','GBu','GBu','GBu','GBu','G','G','G','G','G','G','G','G','G','G','GR','O','O','O','O','O','O','O','O','D','D','D','D','D','D','D','D'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','GR','O','G','G','G','G','G','O','O','D','D','D','D','D','D','D','D'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','O','GBu','G','G','G','G','G','O','O','O','O','G','G','G','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','O','GBu','G','G','G','G','G','O','O','O','O','G','G','G','G','G','G'],
    ['G','G','G','G','G','G','G','GBu','GBu','GBu','GBu','G','G','G','G','O','G','G','G','G','G','G','O','O','O','O','G','G','G','G','G','G'],
    ['G','G','G','G','G','G','G','GBu','GBu','GBu','GBu','G','G','G','G','O','G','G','G','G','G','G','O','O','O','O','G','G','G','G','G','G'],
    ['G','G','G','G','G','G','G','GBu','GBu','GBu','GBu','G','G','G','G','G','G','G','G','G','G','G','GBu','GBu','GBu','GBu','G','G','G','G','G','G'],
    ['G','G','G','G','G','G','G','GBu','GBu','GBu','GBu','G','G','G','G','G','G','G','G','G','G','G','GBu','GBu','GBu','GBu','G','G','G','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['GR','GR','GR','GR','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G']
  ],
  objects: [
    // Three cabins identified from reference image
    {type:'cabin1', tx:6,  ty:6},   // green roof cabin, central-left
    {type:'cabin2', tx:5,  ty:16},  // purple roof cabin, lower-left
    {type:'cabin1', tx:17, ty:22},  // green roof cabin, lower-center
    // Mountain-forest border — top row
    {type:'mountain-forest', tx:4,  ty:0},
    {type:'mountain-forest', tx:7,  ty:0},
    {type:'mountain-forest', tx:10, ty:0},
    {type:'mountain-forest', tx:13, ty:0},
    {type:'mountain-forest', tx:16, ty:0},
    // Mountain-forest — right border upper
    {type:'mountain-forest', tx:26, ty:0},
    {type:'mountain-forest', tx:29, ty:0},
    {type:'mountain-forest', tx:23, ty:3},
    {type:'mountain-forest', tx:26, ty:3},
    {type:'mountain-forest', tx:29, ty:3},
    {type:'mountain-forest', tx:29, ty:10},
    // Mountain-forest — right border cluster
    {type:'mountain-forest', tx:20, ty:13},
    {type:'mountain-forest', tx:23, ty:13},
    {type:'mountain-forest', tx:26, ty:13},
    {type:'mountain-forest', tx:29, ty:13},
    {type:'mountain-forest', tx:29, ty:16},
    // Mountain-forest — lower areas
    {type:'mountain-forest', tx:2,  ty:17},
    {type:'mountain-forest', tx:26, ty:23},
    {type:'mountain-forest', tx:29, ty:23},
    {type:'mountain-forest', tx:3,  ty:26},
    // tx:16,ty:26 removed — overlapped with cabin1 at tx:17,ty:22 (rows 22-26)
    {type:'mountain-forest', tx:26, ty:26},
    {type:'mountain-forest', tx:29, ty:26},
    {type:'mountain-forest', tx:26, ty:29},
    {type:'mountain-forest', tx:29, ty:29},
    // Trees in grass areas
    {type:'tree1', tx:12, ty:3},   // moved from (7,11) — was next to cabin1 entry
    {type:'tree1', tx:5,  ty:3},   // moved from (10,11) — was next to cabin1 entry
    {type:'tree1', tx:9,  ty:13},
    {type:'tree1', tx:13, ty:18},  // moved from (6,21) — was next to cabin2 entry
    {type:'tree1', tx:10, ty:23},  // moved from (9,21) — was next to cabin2 entry
    {type:'tree1', tx:12, ty:14},
    {type:'tree1', tx:4,  ty:23},  // moved from (4,25) — was overlapping mountain at tx:3,ty:26
    {type:'tree1', tx:11, ty:26},
  ]
};
// NPC sprite keys by index
window.NPC_KEYS = ['ow2','ow3','ow4','ow5','ow6','ow7','ow8','ow9','ow10'];

window.getRandomFish = function(location, hasBoat, isDeepOcean, northernLightsActive) {
  const fishList = GAME_DATA.FISH_BY_LOCATION[location] || GAME_DATA.FISH_BY_LOCATION.leknes;
  const available = fishList.filter(f => {
    if (f.requiresDeepOcean && !isDeepOcean) return false;
    if (f.requiresNorthernLights && !northernLightsActive) return false;
    return true;
  });
  const weights = GAME_DATA.RARITY_WEIGHTS;
  const pool = [];
  // Killer Whale gets ~4% chance in deep ocean (separate from rarity pool)
  if (isDeepOcean) {
    const kw = available.find(f => f.isKillerWhale);
    if (kw && Math.random() < 0.04) {
      const weight = Math.floor(Math.random() * (kw.maxW - kw.minW + 1)) + kw.minW;
      return { ...kw, weight };
    }
  }
  const normal = available.filter(f => !f.isKillerWhale);
  normal.forEach(f => { for(let i=0;i<(weights[f.rarity]||10);i++) pool.push(f); });
  if (!pool.length) return null;
  const fish = pool[Math.floor(Math.random()*pool.length)];
  let weight = Phaser.Math.Between(fish.minW, fish.maxW);
  if (!hasBoat) weight = Math.min(weight, 20);
  return { ...fish, weight };
};

window.generateAlgebraChallenge = function() {
  // Two-step algebra: ax + b = c  or  ax - b = c  → solve for x
  const a = Phaser.Math.Between(2, 9);
  const x = Phaser.Math.Between(2, 15);
  const b = Phaser.Math.Between(1, 30);
  const type = Phaser.Math.Between(0, 1);
  let c, question;
  if (type === 0) { c = a * x + b; question = `${a}x + ${b} = ${c}   solve x`; }
  else            { c = a * x - b; question = `${a}x - ${b} = ${c}   solve x`; }
  return { question, answer: x };
};

window.generateMathProblem = function(fishWeight, playerLevel) {
  const diff = Math.min(Math.floor((fishWeight/10) + (playerLevel/5)), 4);
  let answer, question;
  if (diff === 0) { const a=Phaser.Math.Between(1,20),b=Phaser.Math.Between(1,20); answer=a+b; question=`${a} + ${b} = ?`; }
  else if (diff === 1) { const a=Phaser.Math.Between(10,50),b=Phaser.Math.Between(1,a); answer=a-b; question=`${a} - ${b} = ?`; }
  else if (diff === 2) { const a=Phaser.Math.Between(2,12),b=Phaser.Math.Between(2,12); answer=a*b; question=`${a} x ${b} = ?`; }
  else if (diff === 3) { const b=Phaser.Math.Between(2,12),a=b*Phaser.Math.Between(2,12); answer=a/b; question=`${a} / ${b} = ?`; }
  else { const a=Phaser.Math.Between(2,9),b=Phaser.Math.Between(2,9),c=Phaser.Math.Between(1,20); answer=(a*b)+c; question=`(${a}x${b})+${c} = ?`; }
  return { question, answer };
};

window.addTrophy = function(state, fishName) {
  if (!GAME_DATA.TROPHY_FISH.includes(fishName)) return false;
  if (!state.trophies) state.trophies = [];
  if (state.trophies.includes(fishName)) return false;
  state.trophies.push(fishName);
  return true;
};

window.addXP = function(state, amount) {
  state.xp += amount;
  let leveled = false;
  let threshold = state.level * 1000;
  while (state.xp >= threshold) {
    state.xp -= threshold;
    state.level++;
    leveled = true;
    threshold = state.level * 1000;
  }
  return leveled;
};

window.addFishAuraMiss = function(state, fish, magical) {
  if (typeof state.aura === 'undefined') state.aura = 20;
  const isTrophy = fish && GAME_DATA.TROPHY_FISH.includes(fish.name);
  const loss = isTrophy ? 10 : (magical ? 2 : 1);
  state.aura = Math.max(-100, Math.min(100, state.aura - loss));
  return -loss;
};

window.addFishAura = function(state, fish) {
  if (typeof state.aura === 'undefined') state.aura = 20;
  const isTrophy = GAME_DATA.TROPHY_FISH.includes(fish.name);
  const isMagical = !!fish.magical;
  const gain = isTrophy ? 10 : (isMagical ? 2 : 1);
  state.aura = Math.max(-100, Math.min(100, state.aura + gain));
  return gain;
};

window.updateTop10 = function(state, fish, mapName) {
  if (!state.top10) state.top10 = [];
  const entry = {
    name: fish.name,
    weight: fish.weight,
    rarity: fish.rarity,
    magical: !!fish.magical,
    map: mapName,
    date: Date.now()
  };
  state.top10.push(entry);

  const rarityOrder = { legendary: 0, rare: 1, uncommon: 2, common: 3, secret: 4 };

  state.top10.sort((a, b) => {
    // 1. Weight (desc)
    if (b.weight !== a.weight) return b.weight - a.weight;
    
    // 2. Magical (desc) - if one is magical and the other isn't, magical wins.
    if (a.magical !== b.magical) return a.magical ? -1 : 1;
    
    // 3. Rarity (order: legendary, rare, uncommon, common)
    const orderA = rarityOrder[a.rarity] !== undefined ? rarityOrder[a.rarity] : 99;
    const orderB = rarityOrder[b.rarity] !== undefined ? rarityOrder[b.rarity] : 99;
    if (orderA !== orderB) return orderA - orderB;
    
    // 4. Date (newest first for same stats)
    return b.date - a.date;
  });

  // Keep only top 10
  if (state.top10.length > 10) {
    state.top10 = state.top10.slice(0, 10);
  }
};

window.DRAG_FISH = [
  // Common
  {name:'Arctic Shrimp',      minW:1, maxW:8,   rarity:'common',    xpMult:0.5, pricePerKg:50 },
  {name:'Capelin',            minW:1, maxW:10,  rarity:'common',    xpMult:0.4, pricePerKg:50 },
  {name:'Lumpfish',           minW:1, maxW:6,   rarity:'common',    xpMult:0.5, pricePerKg:50 },
  // Uncommon
  {name:'Wrasse',             minW:1, maxW:4,   rarity:'uncommon',  xpMult:0.6, pricePerKg:50 },
  {name:'Norwegian Lobster',  minW:1, maxW:4,   rarity:'uncommon',  xpMult:0.8, pricePerKg:100},
  {name:'Wolffish',           minW:5, maxW:25,  rarity:'uncommon',  xpMult:1.0, pricePerKg:50 },
  // Rare
  {name:'Snow Crab',          minW:1, maxW:8,   rarity:'rare',      xpMult:1.2, pricePerKg:100},
  {name:'European Lobster',   minW:1, maxW:6,   rarity:'rare',      xpMult:1.2, pricePerKg:100},
  {name:'Monkfish',           minW:5, maxW:35,  rarity:'rare',      xpMult:1.5, pricePerKg:100},
  // Legendary
  {name:'King Crab',          minW:3, maxW:20,  rarity:'legendary', xpMult:2.0, pricePerKg:100},
  // Secret — Reine only
  {name:'Oarfish',            minW:20, maxW:100, rarity:'secret',   xpMult:3.0, pricePerKg:100, reineOnly:true},
];

window.getDragFish = function(location) {
  // Filter by location — Oarfish only at Reine
  const pool = window.DRAG_FISH.filter(f => !f.reineOnly || location === 'reine');
  // Rarity weights
  const weights = { common:40, uncommon:30, rare:20, legendary:8, secret:2 };
  const totalWeight = pool.reduce((sum, f) => sum + (weights[f.rarity] || 1), 0);
  let roll = Math.random() * totalWeight;
  for (const f of pool) {
    roll -= weights[f.rarity] || 1;
    if (roll <= 0) return f;
  }
  return pool[pool.length - 1];
};

window.BADDIE_QUESTIONS = [
  {prompt:"Hei hei 😊", correct:"Hei!", wrong:["Jeg spiser brød","Klokken er blå"]},
  {prompt:"Hvordan går det?", correct:"Det går bra, hva med deg?", wrong:["Jeg er fra tirsdag","Nakne fisker løper"]},
  {prompt:"Hva heter du?", correct:"Jeg heter Ikke Musikk", wrong:["Jeg heter bordet","Navn er ikke lov"]},
  {prompt:"Hvor er du fra?", correct:"Jeg er ikke fra Florida, du da?", wrong:["Jeg kommer fra kaffe","Jeg bor i en bil"]},
  {prompt:"Bor du her?", correct:"Nei, jeg er på ferie", wrong:["Jeg bor i en sko","Nei, jeg er en bil"]},
  {prompt:"Hva driver du med?", correct:"Jeg jobber som musikker", wrong:["Jeg driver en potet","Jeg gjør blå"]},
  {prompt:"Har du hatt en fin dag?", correct:"Ja, ganske fin, deg?", wrong:["Nei, jeg er torsdag","Dagen min er en stol"]},
  {prompt:"Du har et fint smil", correct:"Tusen takk!", wrong:["Smil er ulovlig","Jeg kjøper en fisk"]},
  {prompt:"Kan jeg sette meg her?", correct:"Ja, selvfølgelig", wrong:["Nei, stolen er gift","Jeg sitter i været"]},
  {prompt:"Liker du kaffe?", correct:"Ja, veldig!", wrong:["Jeg drikker sko","Kaffe er ikke for meg"]},
  {prompt:"Hva liker du å gjøre på fritiden?", correct:"Jeg liker å lage bangers", wrong:["Jeg liker å Netflix og chill","Fritid er ikke ekte"]},
  {prompt:"Har du noen planer i helgen?", correct:"Ikke helt ennå, du da?", wrong:["Helgen min? Nei","Ja, jeg er busy"]},
  {prompt:"Skal vi ta en kaffe en dag?", correct:"Ja, det hadde vært hyggelig", wrong:["Nei, jeg liker ikke kaffe","Kaffe er for svensk"]},
  {prompt:"Liker du å reise?", correct:"Jeg elsker å reise Lofoten", wrong:["Jeg reiser aldri til meg selv","Reise? Aldrig"]},
  {prompt:"Hva er favorittmaten din?", correct:"Jeg elsker pizza", wrong:["Jeg spiser alt","Kua"]},
  {prompt:"Er det greit at jeg slår av en prat?", correct:"Ja, gjerne", wrong:["Prat er for fisk","Ikke i dag"]},
  {prompt:"Hva studerer du?", correct:"Jeg studerer deg", wrong:["Jeg studerer ingenting","Studier er darlig"]},
  {prompt:"Jobber du eller studerer du?", correct:"Jeg jobber fulltid", wrong:["Jeg jobber ikke","Jeg studerer på tirsdag"]},
  {prompt:"Har du vært her lenge?", correct:"Nei, jeg kom nettopp", wrong:["Ja, jeg har vært","Tiden er nå"]},
  {prompt:"Hva slags musikk liker du?", correct:"Jeg liker hip-hop", wrong:["Jeg liker lyden av fuglene","Musikk er ikke for meg"]},
  {prompt:"Liker du å danse?", correct:"Ja, litt, hva om deg?", wrong:["Jeg danser ikke så bra","Dans? Nei takk"]},
  {prompt:"Du virker interessant", correct:"Takk, i lage måte", wrong:["Jeg er en smørbrød","Interessant er en katt"]},
  {prompt:"Hva gjør du i kveld?", correct:"Jeg fisker", wrong:["Jeg gjør ingenting","Skal sove"]},
  {prompt:"Kan jeg få nummeret ditt?", correct:"Ja, klart det", wrong:["Har ikke en mobil","Jeg gir deg en banan"]},
  {prompt:"Har du kjæreste?", correct:"Nei, det har jeg ikke", wrong:["Jeg har to","Kjæreste er vær"]},
  {prompt:"Hva er drømmejobben din?", correct:"Jeg lever min drøm", wrong:["Jeg jobber som musikker","Jobb? Nei"]},
  {prompt:"Er du her ofte?", correct:"Ikke så ofte", wrong:["Jeg er her som en fisk","Ofte er en ord"]},
  {prompt:"Skal vi gå en tur?", correct:"Ja, en tur av en livstid", wrong:["Jeg går i sirkler","Tur? Nei takk"]},
  {prompt:"Hva gjør deg glad?", correct:"God mat med p-max cola", wrong:["Jeg er glad i kino","Glede er sol"]},
  {prompt:"Jeg vil gjerne bli bedre kjent med deg", correct:"Si less", wrong:["Jeg ikke forstår","Nei takk"]},
  {prompt:"Liker du å gå tur i naturen?", correct:"Ja, det er veldig fint i Lofoten", wrong:["Jeg går i en bil","Naturen er best på sm"]},
  {prompt:"Hva gjorde du i går?", correct:"Jeg var på Kvalika Beach", wrong:["Jeg gjorde ingenting","Jeg vet ikke"]},
  {prompt:"Har du søsken?", correct:"Ja, jeg har to. To!", wrong:["Jeg har en hytte","Søsken er ikke her"]},
  {prompt:"Hva slags filmer liker du?", correct:"Jeg liker Norske filmer", wrong:["Jeg ser på serier","Film er ikke for meg"]},
  {prompt:"Er du glad i sport?", correct:"Ja, jeg trener litt", wrong:["Jeg spiser mat","Sport? Nei"]},
  {prompt:"Hva er favorittstedet ditt i Lofoten?", correct:"Det er en vanskelig spørsmål", wrong:["Frognerparken","Tromsø"]},
  {prompt:"Har du reist mye?", correct:"Ja, litt rundt i Europa", wrong:["Jeg reiser i bare Europa","Reise er ikke for meg"]},
  {prompt:"Hva gjør deg stresset?", correct:"Ikke noe stress", wrong:["Jeg stress med deg","Jeg stresser alltid"]},
  {prompt:"Hva gjør deg rolig?", correct:"Musikk og natur", wrong:["Rolig kvelder","Netflix"]},
  {prompt:"Liker du sommer eller vinter best?", correct:"Sommer, helt klart", wrong:["Jeg liker fredag","Vinter i nord norge er best"]},
  {prompt:"Drikker du?", correct:"Ja, skal vi?", wrong:["Jeg drikker masse","Bare vann"]},
  {prompt:"Hva er favorittdrikken din?", correct:"Kanskje kaffe eller p-max", wrong:["Matcha","Flus"]},
  {prompt:"Er du morgenmenneske?", correct:"Nei, jeg er Ikke Musikk", wrong:["Ja, keg er en morgen","Ja, stå opp kl. fire"]},
  {prompt:"Liker du å lage mat?", correct:"Jeg liker barbeque", wrong:["Jeg lager musikk","Mat lager meg"]},
  {prompt:"Hva er din favorittrestaurant?", correct:"Jeg liker italiensk mat", wrong:["Restaurant er for mye penger","Jeg spiser på hjem"]},
  {prompt:"Hva gjør du etter jobb?", correct:"Slapp av i solen", wrong:["Jeg gjør alt","Jeg ser etter fisk"]},
  {prompt:"Har du en hobby?", correct:"Ja, jeg liker damer", wrong:["Hobby er TV","Jeg hobbyer kaffe"]},
  {prompt:"Liker du dyr?", correct:"Ja, spesielt hunder", wrong:["Ja, spesielt katter","Dyr er darlig"]},
  {prompt:"Har du kjæledyr?", correct:"Ja, en Bape", wrong:["Jeg har en hytte","Jeg har mye"]},
  {prompt:"Hva er din favorittserie?", correct:"Har du sett Lillehammer?", wrong:["Breaking Bad","Jeg ser på Love Island"]},
  {prompt:"Jeg liker stilen din", correct:"Takk, jeg liker stilen din og", wrong:["Stil er for flashy","Jeg bruker perfume"]},
  {prompt:"Du virker veldig hyggelig", correct:"Takk, deg også", wrong:["Hyggelig?","Jeg må gå"]},
  {prompt:"Har du lyst til å bli med ut en dag?", correct:"Ja, men bare med deg", wrong:["Jeg blir med i morgen","Dag er for fisk"]},
  {prompt:"Hva ser du etter?", correct:"Noen koselig", wrong:["Jeg ser etter en baddie","Etter deg"]},
  {prompt:"Er du singel?", correct:"Ja, jeg er singel", wrong:["Jeg er ikke beklager","Singel, nei"]},
  {prompt:"Hva er din type?", correct:"Noen snill og morsom", wrong:["Noen rik","Ikke deg"]},
  {prompt:"Liker du spontane ting?", correct:"Ja, på ganger", wrong:["Spontan er for mye","Ja, livet mitt er spontan"]},
  {prompt:"Hva er det beste med deg?", correct:"Kanskje humoren min", wrong:["Hytte mitt","Musikken min"]},
  {prompt:"Hva er det verste med deg?", correct:"Du fortell meg", wrong:["Verste er ingenting","Jeg er verst på mandag"]},
  {prompt:"Hva får deg til å le?", correct:"Ikke Musikk comment seksjon", wrong:["Jeg ler i en bil","Le er ikke kult"]},
  {prompt:"Tror du på kjærlighet ved første blikk?", correct:"Kanskje i Lofoten", wrong:["Kjærlighet er lang historien","Ja med exen min"]},
  {prompt:"Eller skal jeg gå forbi igjen?", correct:"En gang til", wrong:["Jeg går nå","Forbi er blå"]},
  {prompt:"Er du alltid så hyggelig?", correct:"Jeg er en hyggelig mann", wrong:["Jeg prøver","Hyggelig å møte deg"]},
  {prompt:"Hva er din superkraft?", correct:"Jeg kan lese tanker", wrong:["Å finne fine damer","Jeg super kul"]},
  {prompt:"Hva ville du gjort hvis du vant i lotto?", correct:"Tar oss på tur", wrong:["Spare pengene","Jeg vinner aldrig"]},
  {prompt:"Øl eller brus?", correct:"Kanskje vin", wrong:["Jeg drikker begge","Øl"]},
  {prompt:"Strand eller fjell?", correct:"Har du vært til Kvalvika", wrong:["Strand er bra","Fjell er bedre"]},
  {prompt:"Kaffe eller te?", correct:"Kaffe med to", wrong:["Melk","Te"]},
  {prompt:"Netflix eller kino?", correct:"Neste spørsmål", wrong:["Netflix","Kino er hyggelig"]},
  {prompt:"Tidlig kveld eller sen natt?", correct:"Er jeg alene?", wrong:["Sen Natt","Skal sove snart"]},
  {prompt:"Hva drømmer du om?", correct:"Å reise Lofoten sammen", wrong:["Drøm er stort","Jeg drømmer om deg"]},
  {prompt:"Hva motiverer deg?", correct:"Mine fans", wrong:["Motivasjon videor","Penger"]},
  {prompt:"Hva gjør deg unik?", correct:"Jeg er ikke norsk", wrong:["Unik er min etternavn","Ja, jeg er unik"]},
  {prompt:"Hva betyr mest for deg?", correct:"Familie og venner", wrong:["Penger og baddies","Haterne"]},
  {prompt:"Hva er din største drøm?", correct:"Nordlys", wrong:["Å fange en jenta på en vors","Jeg drøm stor"]},
  {prompt:"Hva gjør deg lykkelig?", correct:"Et fint kyss", wrong:["Stor klem","Jeg lykkes deg"]},
  {prompt:"Hva gjør du når du kjeder deg?", correct:"Ser på Ikke Musikk videoer", wrong:["Kjeder alt","Ring deg"]},
  {prompt:"Hva slags humor liker du?", correct:"Vi skal se", wrong:["Mørk humor","Jeg ler nå"]},
  {prompt:"Liker du overraskelser?", correct:"Jeg liker denne", wrong:["Hvis de er hyggelige","Kanskje"]},
  {prompt:"Hva er din største styrke?", correct:"Jeg er positiv", wrong:["Jeg har hytte","Jeg har båt"]},
  {prompt:"Skal vi ta en drink senere?", correct:"Ja, vi snakkes", wrong:["Nei takk","Hvor?"]},
  {prompt:"Vil du bli med ut i helgen?", correct:"Det høres bra ut", wrong:["Ja takk","Kanskje i sentrum"]},
  {prompt:"Kan jeg bli bedre kjent med deg?", correct:"Kan du elsk meg litt før vi ses?", wrong:["Ja, det gjør vi","Jeg kjenner ingenting"]},
  {prompt:"Har du lyst til å møtes igjen?", correct:"Ja, vi ses", wrong:["Møte på mandag?","Jeg møter deg nå"]},
  {prompt:"Når passer det for deg?", correct:"Ring meg senere", wrong:["Kanskje i morgen?","Jeg passer deg"]},
  {prompt:"Hva sier du til en kaffe i morgen?", correct:"Jeg sier, vi ses", wrong:["Morgen er bra","Ja"]},
  {prompt:"Skal vi gå en tur sammen en dag?", correct:"Ja, det skal vi", wrong:["Nei, vi tar en tur nå","Jeg går hjem snart"]},
  {prompt:"Har du Instagram?", correct:"Ja, men hva er nummeret ditt", wrong:["Instagram, ja, du kan følg meg","Ja, kan følge deg"]},
  {prompt:"Kan jeg sende deg en melding?", correct:"Ja, send første nå", wrong:["Melding, ja","Hva om?"]},
  {prompt:"Vil du gi meg nummeret ditt?", correct:"Ja, er du klar?", wrong:["Nummer er kl. 20","Jeg gir deg en klem"]},
  {prompt:"Jeg er glad jeg kom bort til deg", correct:"Jeg også", wrong:["Glad laks","Har det bra"]},
  {prompt:"Du virker som en jeg burde kjenne", correct:"Lykke til", wrong:["Er du klar?","Jeg kjenner ikke megselv"]},
  {prompt:"Dette var en hyggelig prat", correct:"Skal ringe deg", wrong:["Prat var fint","Ja takk"]},
  {prompt:"Jeg håper vi ses igjen", correct:"Toodeloo", wrong:["Det gjør vi","Jeg også"]},
  {prompt:"Du gjorde dagen min bedre", correct:"Du er nydelig", wrong:["Dagen min også","Jeg gjør ikke"]},
  {prompt:"Jeg liker energien din", correct:"Digg", wrong:["Energien min?","Jeg liker deg og"]},
  {prompt:"Du er lett å snakke med", correct:"Du snakke på norsk så bra", wrong:["Jeg liker det også","Jeg snakker ikke norsk"]},
  {prompt:"Jeg håper jeg ikke var for direkte", correct:"Nei, det var bare hyggelig", wrong:["Direkte er norsk","Litt"]},
  {prompt:"Kanskje vi burde gjøre dette igjen", correct:"Skal vi?", wrong:["Igjen?","Det høres bra ut"]},
  {prompt:"Ha en fin kveld!", correct:"Ha det bra!", wrong:["God kveld","Farvel"]},
];

window.RECORDS_FOR_SALE = [
  'Tusen Takk 4 All My Haters','Ikke Norsk','Ikke Russ','Demon Mode','Hun',
  'Jeg Flyttet til Norge','Snakke på Norsk','Vi Ses','Lander Gardermoen',
  'Eg Kommer te Bergen','Bape Dress','Bruce Wayne','Sweden Mode','Julebord','Turn Her Up'
];
window.RECORD_PRICE_NOK = 5000;

// FLAG_QUIZ_DATA — used by FlagQuizScene (lazy-loaded, only active when state.flagQuizMode = true)
// Each entry: { code: 'two-letter ISO', name: 'Country Name' }
window.FLAG_QUIZ_DATA = [
  {code:'ac',name:'Ascension Island'},{code:'ad',name:'Andorra'},{code:'ae',name:'United Arab Emirates'},
  {code:'af',name:'Afghanistan'},{code:'ag',name:'Antigua & Barbuda'},{code:'ai',name:'Anguilla'},
  {code:'al',name:'Albania'},{code:'am',name:'Armenia'},{code:'ao',name:'Angola'},
  {code:'aq',name:'Antarctica'},{code:'ar',name:'Argentina'},{code:'as',name:'American Samoa'},
  {code:'at',name:'Austria'},{code:'au',name:'Australia'},{code:'aw',name:'Aruba'},
  {code:'ax',name:'Åland Islands'},{code:'az',name:'Azerbaijan'},{code:'ba',name:'Bosnia & Herzegovina'},
  {code:'bb',name:'Barbados'},{code:'bd',name:'Bangladesh'},{code:'be',name:'Belgium'},
  {code:'bf',name:'Burkina Faso'},{code:'bg',name:'Bulgaria'},{code:'bh',name:'Bahrain'},
  {code:'bi',name:'Burundi'},{code:'bj',name:'Benin'},{code:'bl',name:'St. Barthélemy'},
  {code:'bm',name:'Bermuda'},{code:'bn',name:'Brunei'},{code:'bo',name:'Bolivia'},
  {code:'bq',name:'Caribbean Netherlands'},{code:'br',name:'Brazil'},{code:'bs',name:'Bahamas'},
  {code:'bt',name:'Bhutan'},{code:'bw',name:'Botswana'},{code:'by',name:'Belarus'},
  {code:'bz',name:'Belize'},{code:'ca',name:'Canada'},{code:'cc',name:'Cocos (Keeling) Islands'},
  {code:'cd',name:'DR Congo'},{code:'cf',name:'Central African Republic'},{code:'cg',name:'Republic of the Congo'},
  {code:'ch',name:'Switzerland'},{code:'ci',name:'Côte d\'Ivoire'},{code:'ck',name:'Cook Islands'},
  {code:'cl',name:'Chile'},{code:'cm',name:'Cameroon'},{code:'cn',name:'China'},
  {code:'co',name:'Colombia'},{code:'cr',name:'Costa Rica'},{code:'cu',name:'Cuba'},
  {code:'cv',name:'Cape Verde'},{code:'cw',name:'Curaçao'},{code:'cx',name:'Christmas Island'},
  {code:'cy',name:'Cyprus'},{code:'cz',name:'Czech Republic'},{code:'de',name:'Germany'},
  {code:'dj',name:'Djibouti'},{code:'dk',name:'Denmark'},{code:'dm',name:'Dominica'},
  {code:'do',name:'Dominican Republic'},{code:'dz',name:'Algeria'},{code:'ec',name:'Ecuador'},
  {code:'ee',name:'Estonia'},{code:'eg',name:'Egypt'},{code:'eh',name:'Western Sahara'},
  {code:'er',name:'Eritrea'},{code:'es',name:'Spain'},{code:'et',name:'Ethiopia'},
  {code:'eu',name:'European Union'},{code:'fi',name:'Finland'},{code:'fj',name:'Fiji'},
  {code:'fk',name:'Falkland Islands'},{code:'fm',name:'Micronesia'},{code:'fo',name:'Faroe Islands'},
  {code:'fr',name:'France'},{code:'ga',name:'Gabon'},{code:'gb',name:'United Kingdom'},
  {code:'gd',name:'Grenada'},{code:'ge',name:'Georgia'},{code:'gf',name:'French Guiana'},
  {code:'gg',name:'Guernsey'},{code:'gh',name:'Ghana'},{code:'gi',name:'Gibraltar'},
  {code:'gl',name:'Greenland'},{code:'gm',name:'Gambia'},{code:'gn',name:'Guinea'},
  {code:'gp',name:'Guadeloupe'},{code:'gq',name:'Equatorial Guinea'},{code:'gr',name:'Greece'},
  {code:'gs',name:'South Georgia'},{code:'gt',name:'Guatemala'},{code:'gu',name:'Guam'},
  {code:'gw',name:'Guinea-Bissau'},{code:'gy',name:'Guyana'},{code:'hk',name:'Hong Kong'},
  {code:'hn',name:'Honduras'},{code:'hr',name:'Croatia'},{code:'ht',name:'Haiti'},
  {code:'hu',name:'Hungary'},{code:'ic',name:'Canary Islands'},{code:'id',name:'Indonesia'},
  {code:'ie',name:'Ireland'},{code:'il',name:'Israel'},{code:'im',name:'Isle of Man'},
  {code:'in',name:'India'},{code:'io',name:'British Indian Ocean Territory'},{code:'iq',name:'Iraq'},
  {code:'ir',name:'Iran'},{code:'is',name:'Iceland'},{code:'it',name:'Italy'},
  {code:'je',name:'Jersey'},{code:'jm',name:'Jamaica'},{code:'jo',name:'Jordan'},
  {code:'jp',name:'Japan'},{code:'ke',name:'Kenya'},{code:'kg',name:'Kyrgyzstan'},
  {code:'kh',name:'Cambodia'},{code:'ki',name:'Kiribati'},{code:'km',name:'Comoros'},
  {code:'kn',name:'St. Kitts & Nevis'},{code:'kp',name:'North Korea'},{code:'kr',name:'South Korea'},
  {code:'kw',name:'Kuwait'},{code:'ky',name:'Cayman Islands'},{code:'kz',name:'Kazakhstan'},
  {code:'la',name:'Laos'},{code:'lb',name:'Lebanon'},{code:'lc',name:'St. Lucia'},
  {code:'li',name:'Liechtenstein'},{code:'lk',name:'Sri Lanka'},{code:'lr',name:'Liberia'},
  {code:'ls',name:'Lesotho'},{code:'lt',name:'Lithuania'},{code:'lu',name:'Luxembourg'},
  {code:'lv',name:'Latvia'},{code:'ly',name:'Libya'},{code:'ma',name:'Morocco'},
  {code:'mc',name:'Monaco'},{code:'md',name:'Moldova'},{code:'me',name:'Montenegro'},
  {code:'mf',name:'St. Martin'},{code:'mg',name:'Madagascar'},{code:'mh',name:'Marshall Islands'},
  {code:'mk',name:'North Macedonia'},{code:'ml',name:'Mali'},{code:'mm',name:'Myanmar'},
  {code:'mn',name:'Mongolia'},{code:'mo',name:'Macao'},{code:'mp',name:'Northern Mariana Islands'},
  {code:'mq',name:'Martinique'},{code:'mr',name:'Mauritania'},{code:'ms',name:'Montserrat'},
  {code:'mt',name:'Malta'},{code:'mu',name:'Mauritius'},{code:'mv',name:'Maldives'},
  {code:'mw',name:'Malawi'},{code:'mx',name:'Mexico'},{code:'my',name:'Malaysia'},
  {code:'mz',name:'Mozambique'},{code:'na',name:'Namibia'},{code:'nc',name:'New Caledonia'},
  {code:'ne',name:'Niger'},{code:'nf',name:'Norfolk Island'},{code:'ng',name:'Nigeria'},
  {code:'ni',name:'Nicaragua'},{code:'nl',name:'Netherlands'},{code:'no',name:'Norway'},
  {code:'np',name:'Nepal'},{code:'nr',name:'Nauru'},{code:'nu',name:'Niue'},
  {code:'nz',name:'New Zealand'},{code:'om',name:'Oman'},{code:'pa',name:'Panama'},
  {code:'pe',name:'Peru'},{code:'pf',name:'French Polynesia'},{code:'pg',name:'Papua New Guinea'},
  {code:'ph',name:'Philippines'},{code:'pk',name:'Pakistan'},{code:'pl',name:'Poland'},
  {code:'pm',name:'St. Pierre & Miquelon'},{code:'pn',name:'Pitcairn Islands'},{code:'pr',name:'Puerto Rico'},
  {code:'ps',name:'Palestine'},{code:'pt',name:'Portugal'},{code:'pw',name:'Palau'},
  {code:'py',name:'Paraguay'},{code:'qa',name:'Qatar'},{code:'re',name:'Réunion'},
  {code:'ro',name:'Romania'},{code:'rs',name:'Serbia'},{code:'ru',name:'Russia'},
  {code:'rw',name:'Rwanda'},{code:'sa',name:'Saudi Arabia'},{code:'sb',name:'Solomon Islands'},
  {code:'sc',name:'Seychelles'},{code:'sd',name:'Sudan'},{code:'se',name:'Sweden'},
  {code:'sg',name:'Singapore'},{code:'sh',name:'St. Helena'},{code:'si',name:'Slovenia'},
  {code:'sk',name:'Slovakia'},{code:'sl',name:'Sierra Leone'},{code:'sm',name:'San Marino'},
  {code:'sn',name:'Senegal'},{code:'so',name:'Somalia'},{code:'sr',name:'Suriname'},
  {code:'ss',name:'South Sudan'},{code:'st',name:'São Tomé & Príncipe'},{code:'sv',name:'El Salvador'},
  {code:'sx',name:'Sint Maarten'},{code:'sy',name:'Syria'},{code:'sz',name:'Eswatini'},
  {code:'ta',name:'Tristan da Cunha'},{code:'tc',name:'Turks & Caicos Islands'},{code:'td',name:'Chad'},
  {code:'tf',name:'French Southern Territories'},{code:'tg',name:'Togo'},{code:'th',name:'Thailand'},
  {code:'tj',name:'Tajikistan'},{code:'tk',name:'Tokelau'},{code:'tl',name:'Timor-Leste'},
  {code:'tm',name:'Turkmenistan'},{code:'tn',name:'Tunisia'},{code:'to',name:'Tonga'},
  {code:'tr',name:'Turkey'},{code:'tt',name:'Trinidad & Tobago'},{code:'tv',name:'Tuvalu'},
  {code:'tw',name:'Taiwan'},{code:'tz',name:'Tanzania'},{code:'ua',name:'Ukraine'},
  {code:'ug',name:'Uganda'},{code:'uk',name:'United Kingdom'},{code:'un',name:'United Nations'},
  {code:'us',name:'United States'},{code:'uy',name:'Uruguay'},{code:'uz',name:'Uzbekistan'},
  {code:'va',name:'Vatican City'},{code:'vc',name:'St. Vincent & Grenadines'},{code:'ve',name:'Venezuela'},
  {code:'vg',name:'British Virgin Islands'},{code:'vi',name:'US Virgin Islands'},{code:'vn',name:'Vietnam'},
  {code:'vu',name:'Vanuatu'},{code:'wf',name:'Wallis & Futuna'},{code:'ws',name:'Samoa'},
  {code:'xk',name:'Kosovo'},{code:'ye',name:'Yemen'},{code:'yt',name:'Mayotte'},
  {code:'za',name:'South Africa'},{code:'zm',name:'Zambia'},{code:'zw',name:'Zimbabwe'},
];
window.RADIO_PRICE_NOK = 5000;
window.RECORD_PRICE_AURA = 25;


window.MUSEUM_ITEMS = [
  // ── BRONZE DEFENCE (armour, ordered lowest → highest def, then by price) ──
  { name:'Bronze Gloves',       frame:9,  price:450,   aura:1,  type:'armour', slot:'gloves',  def:1 },
  { name:'Bronze Boots',        frame:5,  price:500,   aura:1,  type:'armour', slot:'boots',   def:1 },
  { name:'Bronze Helmet',       frame:0,  price:500,   aura:1,  type:'armour', slot:'helmet',  def:1 },
  { name:'Bronze Leg Armour',   frame:4,  price:550,   aura:1,  type:'armour', slot:'legs',    def:1 },
  { name:'Bronze Body Armour',  frame:1,  price:600,   aura:1,  type:'armour', slot:'body',    def:1 },
  { name:'Bronze Shield',       frame:8,  price:700,   aura:1,  type:'armour', slot:'shield',  def:1 },
  // ── BRONZE ATTACK (weapons, ordered lowest → highest atk) ──
  { name:'Bronze Arrow',        frame:25, price:300,   aura:1,  type:'weapon', atk:1 },
  { name:'Bronze Shovel',       frame:12, price:300,   aura:1,  type:'weapon', atk:1 },
  { name:'Bronze Pickaxe',      frame:13, price:600,   aura:2,  type:'weapon', atk:2 },
  { name:'Bronze Dagger',       frame:29, price:1000,  aura:3,  type:'weapon', atk:3 },
  { name:'Bronze Machete',      frame:21, price:1200,  aura:3,  type:'weapon', atk:3 },
  { name:'Bronze Bow',          frame:24, price:1800,  aura:4,  type:'weapon', atk:4 },
  { name:'Bronze Crossbow',     frame:28, price:2200,  aura:4,  type:'weapon', atk:4 },
  { name:'Bronze Hammer',       frame:16, price:3000,  aura:5,  type:'weapon', atk:5 },
  { name:'Bronze Battle Axe',   frame:20, price:3000,  aura:5,  type:'weapon', atk:5 },
  { name:'Bronze Sword',        frame:17, price:5000,  aura:6,  type:'weapon', atk:6 },
  // ── STEEL DEFENCE (armour, ordered lowest → highest def, then by price) ──
  { name:'Steel Gloves',        frame:11, price:1200,  aura:2,  type:'armour', slot:'gloves',  def:2 },
  { name:'Steel Boots',         frame:7,  price:1500,  aura:2,  type:'armour', slot:'boots',   def:2 },
  { name:'Steel Helmet',        frame:2,  price:1500,  aura:2,  type:'armour', slot:'helmet',  def:2 },
  { name:'Steel Leg Armour',    frame:6,  price:1800,  aura:2,  type:'armour', slot:'legs',    def:2 },
  { name:'Steel Body Armour',   frame:3,  price:2000,  aura:2,  type:'armour', slot:'body',    def:2 },
  { name:'Steel Shield',        frame:10, price:2500,  aura:2,  type:'armour', slot:'shield',  def:2 },
  // ── STEEL ATTACK (weapons, ordered lowest → highest atk) ──
  { name:'Steel Shovel',        frame:14, price:700,   aura:2,  type:'weapon', atk:2 },
  { name:'Steel Arrow',         frame:27, price:1200,  aura:3,  type:'weapon', atk:3 },
  { name:'Steel Pickaxe',       frame:15, price:2000,  aura:4,  type:'weapon', atk:4 },
  { name:'Steel Dagger',        frame:31, price:5000,  aura:6,  type:'weapon', atk:6 },
  { name:'Steel Machete',       frame:23, price:7000,  aura:7,  type:'weapon', atk:7 },
  { name:'Steel Bow',           frame:26, price:9000,  aura:8,  type:'weapon', atk:8 },
  { name:'Steel Crossbow',      frame:30, price:12000, aura:9,  type:'weapon', atk:9 },
  { name:'Steel Hammer',        frame:18, price:15000, aura:10, type:'weapon', atk:10 },
  { name:'Steel Battle Axe',    frame:22, price:20000, aura:12, type:'weapon', atk:12 },
  { name:'Steel Sword',         frame:19, price:20000, aura:12, type:'weapon', atk:12 },
];

window.getPlayerATK = function(state) {
  if (!state) return 0;
  const weapon = (window.MUSEUM_ITEMS || []).find(i => i.type === 'weapon' && i.name === state.equippedWeapon);
  return (weapon ? weapon.atk : 0);
};
window.getPlayerDEF = function(state) {
  if (!state) return 0;
  // Only count items that are in the equipped armour slots
  const slots = state.equippedArmour || {};
  const equippedNames = new Set(Object.values(slots).filter(Boolean));
  return (window.MUSEUM_ITEMS || [])
    .filter(i => i.type === 'armour' && equippedNames.has(i.name))
    .reduce((sum, i) => sum + i.def, 0);
};

window.SKILPADDE_WORDS = [
  { word:'FLAGGERMUS',    literal:'Flap-Mouse',       meaning:'Bat' },
  { word:'SOMMERFUGL',    literal:'Summer-Bird',       meaning:'Butterfly' },
  { word:'FLODHEST',      literal:'River-Horse',       meaning:'Hippopotamus' },
  { word:'ISBJØRN',       literal:'Ice-Bear',          meaning:'Polar Bear' },
  { word:'JORDBÆR',       literal:'Earth-Berry',       meaning:'Strawberry' },
  { word:'KJØLESKAP',     literal:'Cool-Cabinet',      meaning:'Refrigerator' },
  { word:'SYKEHUS',       literal:'Sick-House',        meaning:'Hospital' },
  { word:'FLYPLASS',      literal:'Fly-Place',         meaning:'Airport' },
  { word:'BRANNBIL',      literal:'Fire-Car',          meaning:'Fire Truck' },
  { word:'REGNBUE',       literal:'Rain-Bow',          meaning:'Rainbow' },
  { word:'SKILPADDE',     literal:'Shield-Toad',       meaning:'Turtle' },
  { word:'BLÅBÆR',        literal:'Blue-Berry',        meaning:'Blueberry' },
  { word:'SØPPELKASSE',   literal:'Garbage-Box',       meaning:'Trash Can' },
  { word:'DATAMASKIN',    literal:'Data-Machine',      meaning:'Computer' },
  { word:'ARMLENESTOL',   literal:'Arm-Rest-Chair',    meaning:'Armchair' },
  { word:'KVELDSMAT',     literal:'Evening-Food',      meaning:'Supper' },
  { word:'HØYTTALER',     literal:'Loud-Speaker',      meaning:'Speaker' },
  { word:'TØMMERHOGGER',  literal:'Timber-Chopper',    meaning:'Lumberjack' },
  { word:'NØKKELHULL',    literal:'Key-Hole',          meaning:'Keyhole' },
  { word:'BRANNMANN',     literal:'Fire-Man',          meaning:'Firefighter' },
  { word:'HÅNDVASK',      literal:'Hand-Wash',         meaning:'Sink' },
  { word:'LYSBRYTER',     literal:'Light-Breaker',     meaning:'Light Switch' },
  { word:'SMØRBLOMST',    literal:'Butter-Flower',     meaning:'Buttercup' },
  { word:'SNØFNUGG',      literal:'Snow-Flake',        meaning:'Snowflake' },
  { word:'BOKHYLLE',      literal:'Book-Shelf',        meaning:'Bookshelf' },
  { word:'SOLBRILLER',    literal:'Sun-Glasses',       meaning:'Sunglasses' },
  { word:'HVALROSS',      literal:'Whale-Horse',       meaning:'Walrus' },
  { word:'SNØSKRED',      literal:'Snow-Slide',        meaning:'Avalanche' },
  { word:'VINDMØLLE',     literal:'Wind-Mill',         meaning:'Windmill' },
  { word:'DAGDRØM',       literal:'Day-Dream',         meaning:'Daydream' },
  { word:'FOTBALL',       literal:'Foot-Ball',         meaning:'Soccer' },
  { word:'GLEMSEL',       literal:'The Forgetting',    meaning:'Amnesia/Oblivion' },
  { word:'LUFTPUTE',      literal:'Air-Pillow',        meaning:'Air Cushion' },
  { word:'SØVNPILLE',     literal:'Sleep-Pill',        meaning:'Sleeping Pill' },
  { word:'SJØHEST',       literal:'Sea-Horse',         meaning:'Seahorse' },

  // --- Animals ---
  { word:'PINNSVIN',      literal:'Spike-Pig',          meaning:'Hedgehog' },
  { word:'NESHORN',       literal:'Nose-Horn',           meaning:'Rhinoceros' },
  { word:'SJØLØVE',       literal:'Sea-Lion',            meaning:'Sea Lion' },
  { word:'SJØSTJERNE',    literal:'Sea-Star',            meaning:'Starfish' },
  { word:'BLEKKSPRUT',    literal:'Ink-Spray',           meaning:'Octopus' },
  { word:'MAURSLUKER',    literal:'Ant-Swallower',       meaning:'Anteater' },
  { word:'BREVDUE',       literal:'Letter-Dove',         meaning:'Carrier Pigeon' },
  { word:'ROVFUGL',       literal:'Prey-Bird',           meaning:'Bird of Prey' },
  { word:'GULLFISK',      literal:'Gold-Fish',           meaning:'Goldfish' },
  { word:'ILDFLUE',       literal:'Fire-Fly',            meaning:'Firefly' },
  { word:'REINSDYR',      literal:'Reindeer-Animal',     meaning:'Reindeer' },
  { word:'HAVØRN',        literal:'Sea-Eagle',           meaning:'White-tailed Eagle' },
  { word:'BLÅHVAL',       literal:'Blue-Whale',          meaning:'Blue Whale' },
  { word:'SPEKKHUGGER',   literal:'Blubber-Chopper',     meaning:'Orca' },
  { word:'STEINBIT',      literal:'Stone-Bite',          meaning:'Catfish' },
  { word:'REGNORM',       literal:'Rain-Worm',           meaning:'Earthworm' },
  { word:'ROVDYR',        literal:'Prey-Animal',         meaning:'Predator' },
  { word:'JORDSVIN',      literal:'Earth-Pig',           meaning:'Aardvark' },
  { word:'NØTTESKRIKE',   literal:'Nut-Shrieker',        meaning:'Jay' },
  { word:'KONGEØRN',      literal:'King-Eagle',          meaning:'Golden Eagle' },
  { word:'KLAPPMYSS',     literal:'Clap-Cap',            meaning:'Hooded Seal' },
  { word:'RØDREV',        literal:'Red-Fox',             meaning:'Red Fox' },
  { word:'SKOGSMUS',      literal:'Forest-Mouse',        meaning:'Wood Mouse' },
  { word:'SNØUGLE',       literal:'Snow-Owl',            meaning:'Snowy Owl' },
  { word:'STRANDKRABBE',  literal:'Beach-Crab',          meaning:'Shore Crab' },
  { word:'HAVNÅL',        literal:'Sea-Needle',          meaning:'Garfish' },
  { word:'HORNUGLE',      literal:'Horn-Owl',            meaning:'Long-eared Owl' },
  { word:'SANGFUGL',      literal:'Song-Bird',           meaning:'Songbird' },
  { word:'VANDREFALK',    literal:'Wandering-Falcon',    meaning:'Peregrine Falcon' },
  { word:'TREKKFUGL',     literal:'Trek-Bird',           meaning:'Migratory Bird' },
  { word:'BRUNBJØRN',     literal:'Brown-Bear',          meaning:'Brown Bear' },
  { word:'SJØPØLSE',      literal:'Sea-Sausage',         meaning:'Sea Cucumber' },
  { word:'HAVKATT',       literal:'Sea-Cat',             meaning:'Wolffish' },
  { word:'SVARTTROST',    literal:'Black-Thrush',        meaning:'Blackbird' },
  { word:'ISFUGL',        literal:'Ice-Bird',            meaning:'Kingfisher' },
  { word:'HUMLEBI',       literal:'Humble-Bee',          meaning:'Bumblebee' },
  { word:'GULLFINKE',     literal:'Gold-Finch',          meaning:'Goldfinch' },
  { word:'GRISEUNGE',     literal:'Pig-Young',           meaning:'Piglet' },
  { word:'KATTUNGE',      literal:'Cat-Young',           meaning:'Kitten' },
  { word:'LØVEUNGE',      literal:'Lion-Young',          meaning:'Lion Cub' },
  { word:'BJØRNEUNGE',    literal:'Bear-Young',          meaning:'Bear Cub' },
  { word:'FJORDØRRET',    literal:'Fjord-Trout',         meaning:'Sea Trout' },
  { word:'SKOGSDYR',      literal:'Forest-Animal',       meaning:'Forest Creature' },
  { word:'STEINFLUE',     literal:'Stone-Fly',           meaning:'Stonefly' },
  { word:'HAVMUS',        literal:'Sea-Mouse',           meaning:'Chimaera Fish' },

  // --- Nature & Weather ---
  { word:'SOLOPPGANG',    literal:'Sun-Up-Walk',         meaning:'Sunrise' },
  { word:'SOLNEDGANG',    literal:'Sun-Down-Walk',       meaning:'Sunset' },
  { word:'NORDLYS',       literal:'North-Light',         meaning:'Northern Lights' },
  { word:'MIDNATTSSOL',   literal:'Midnight-Sun',        meaning:'Midnight Sun' },
  { word:'FJELLTOPP',     literal:'Mountain-Top',        meaning:'Mountain Peak' },
  { word:'HAVBUNN',       literal:'Sea-Bottom',          meaning:'Ocean Floor' },
  { word:'SKOGBRANN',     literal:'Forest-Fire',         meaning:'Forest Fire' },
  { word:'JORDSKJELV',    literal:'Earth-Shake',         meaning:'Earthquake' },
  { word:'SNØSTORM',      literal:'Snow-Storm',          meaning:'Blizzard' },
  { word:'TORDENVÆR',     literal:'Thunder-Weather',     meaning:'Thunderstorm' },
  { word:'REGNVÆR',       literal:'Rain-Weather',        meaning:'Rainy Weather' },
  { word:'SOLSKINN',      literal:'Sun-Shine',           meaning:'Sunshine' },
  { word:'LYNNEDSLAG',    literal:'Lightning-Strike',    meaning:'Lightning Strike' },
  { word:'ELVEMUNNING',   literal:'River-Mouth',         meaning:'River Estuary' },
  { word:'FJELLKJEDE',    literal:'Mountain-Chain',      meaning:'Mountain Range' },
  { word:'ISBRE',         literal:'Ice-Slope',           meaning:'Glacier' },
  { word:'LAVTRYKK',      literal:'Low-Pressure',        meaning:'Low Pressure' },
  { word:'HØYTRYKK',      literal:'High-Pressure',       meaning:'High Pressure' },
  { word:'VINDKAST',      literal:'Wind-Throw',          meaning:'Wind Gust' },
  { word:'SJØBRIS',       literal:'Sea-Breeze',          meaning:'Sea Breeze' },
  { word:'STRANDLINJE',   literal:'Beach-Line',          meaning:'Coastline' },
  { word:'SKOGSBUNN',     literal:'Forest-Bottom',       meaning:'Forest Floor' },
  { word:'HAVSTORM',      literal:'Sea-Storm',           meaning:'Ocean Storm' },

  // --- Food & Drink ---
  { word:'SMØRBRØD',      literal:'Butter-Bread',        meaning:'Open-Faced Sandwich' },
  { word:'KJØTTKAKE',     literal:'Meat-Cake',           meaning:'Meatloaf' },
  { word:'FISKESUPPE',    literal:'Fish-Soup',           meaning:'Fish Soup' },
  { word:'PØLSEBRØD',     literal:'Sausage-Bread',       meaning:'Hot Dog Bun' },
  { word:'SUKKERBRØD',    literal:'Sugar-Bread',         meaning:'Sponge Cake' },
  { word:'RISGRØT',       literal:'Rice-Porridge',       meaning:'Rice Pudding' },
  { word:'HAVREGRØT',     literal:'Oat-Porridge',        meaning:'Oatmeal' },
  { word:'EPLEKAKE',      literal:'Apple-Cake',          meaning:'Apple Cake' },
  { word:'KLIPPFISK',     literal:'Cliff-Fish',          meaning:'Salted Cod' },
  { word:'TØRRFISK',      literal:'Dry-Fish',            meaning:'Stockfish' },
  { word:'BRUNOST',       literal:'Brown-Cheese',        meaning:'Brown Cheese' },
  { word:'HVITOST',       literal:'White-Cheese',        meaning:'White Cheese' },
  { word:'FISKEBOLLE',    literal:'Fish-Ball',           meaning:'Fish Ball' },
  { word:'KJØTTBOLLE',    literal:'Meat-Ball',           meaning:'Meatball' },
  { word:'PANNEKAKE',     literal:'Pan-Cake',            meaning:'Pancake' },
  { word:'BRØDSKIVE',     literal:'Bread-Slice',         meaning:'Slice of Bread' },
  { word:'SUKKERTØY',     literal:'Sugar-Stuff',         meaning:'Candy' },
  { word:'ISKREM',        literal:'Ice-Cream',           meaning:'Ice Cream' },
  { word:'PEPPERKAKE',    literal:'Pepper-Cake',         meaning:'Gingerbread Cookie' },
  { word:'HONNINGKAKE',   literal:'Honey-Cake',          meaning:'Honey Cake' },
  { word:'MANDELKAKE',    literal:'Almond-Cake',         meaning:'Almond Cake' },
  { word:'BLODPØLSE',     literal:'Blood-Sausage',       meaning:'Black Pudding' },
  { word:'SJOKOLADEKAKE', literal:'Chocolate-Cake',      meaning:'Chocolate Cake' },
  { word:'KREMKAKE',      literal:'Cream-Cake',          meaning:'Cream Cake' },
  { word:'VAFFELRØRE',    literal:'Waffle-Batter',       meaning:'Waffle Mix' },
  { word:'RØDKÅL',        literal:'Red-Cabbage',         meaning:'Red Cabbage' },
  { word:'GRØNNKÅL',      literal:'Green-Cabbage',       meaning:'Kale' },
  { word:'HVITLØK',       literal:'White-Onion',         meaning:'Garlic' },
  { word:'KJERNEMELK',    literal:'Churn-Milk',          meaning:'Buttermilk' },
  { word:'SYLTETØY',      literal:'Preserve-Stuff',      meaning:'Jam' },

  // --- Household ---
  { word:'STØVSUGER',     literal:'Dust-Sucker',         meaning:'Vacuum Cleaner' },
  { word:'OPPVASKMASKIN', literal:'Wash-Up-Machine',     meaning:'Dishwasher' },
  { word:'VASKEMASKIN',   literal:'Washing-Machine',     meaning:'Washing Machine' },
  { word:'TØRKETROMMEL',  literal:'Drying-Drum',         meaning:'Tumble Dryer' },
  { word:'LYSEKRONE',     literal:'Light-Crown',         meaning:'Chandelier' },
  { word:'GULVTEPPE',     literal:'Floor-Carpet',        meaning:'Rug' },
  { word:'SOFABORD',      literal:'Sofa-Table',          meaning:'Coffee Table' },
  { word:'SENGEPUTE',     literal:'Bed-Pillow',          meaning:'Bed Pillow' },
  { word:'KLESSKAP',      literal:'Clothes-Cabinet',     meaning:'Wardrobe' },
  { word:'KJØKKENBENK',   literal:'Kitchen-Bench',       meaning:'Kitchen Counter' },
  { word:'BADEKAR',       literal:'Bath-Vessel',         meaning:'Bathtub' },
  { word:'DUSJHODE',      literal:'Shower-Head',         meaning:'Shower Head' },
  { word:'KJØKKENKNIV',   literal:'Kitchen-Knife',       meaning:'Kitchen Knife' },
  { word:'KJØKKENVASK',   literal:'Kitchen-Sink',        meaning:'Kitchen Sink' },
  { word:'SOVEROM',       literal:'Sleep-Room',          meaning:'Bedroom' },
  { word:'BLOMSTERPOTTE', literal:'Flower-Pot',          meaning:'Flower Pot' },
  { word:'BILDERAMME',    literal:'Picture-Frame',       meaning:'Picture Frame' },
  { word:'VEGGMALERI',    literal:'Wall-Painting',       meaning:'Mural' },
  { word:'TAKLAMPE',      literal:'Ceiling-Lamp',        meaning:'Ceiling Light' },
  { word:'GULVLAMPE',     literal:'Floor-Lamp',          meaning:'Floor Lamp' },
  { word:'STRIKKETØY',    literal:'Knitting-Stuff',      meaning:'Knitwear' },

  // --- Jobs & Occupations ---
  { word:'BRANNMESTER',   literal:'Fire-Master',         meaning:'Fire Chief' },
  { word:'TANNLEGE',      literal:'Tooth-Doctor',        meaning:'Dentist' },
  { word:'ØYELEGE',       literal:'Eye-Doctor',          meaning:'Ophthalmologist' },
  { word:'BARNELEGE',     literal:'Child-Doctor',        meaning:'Pediatrician' },
  { word:'GULLSMED',      literal:'Gold-Smith',          meaning:'Goldsmith' },
  { word:'SØLVSMED',      literal:'Silver-Smith',        meaning:'Silversmith' },
  { word:'BREVBÆRER',     literal:'Letter-Bearer',       meaning:'Mail Carrier' },
  { word:'RØRLEGGER',     literal:'Pipe-Layer',          meaning:'Plumber' },
  { word:'DAGMAMMA',      literal:'Day-Mama',            meaning:'Childminder' },
  { word:'VAKTMANN',      literal:'Guard-Man',           meaning:'Security Guard' },
  { word:'KJØPMANN',      literal:'Buy-Man',             meaning:'Merchant' },
  { word:'BAKERMESTER',   literal:'Baker-Master',        meaning:'Master Baker' },
  { word:'BRØDBAKER',     literal:'Bread-Baker',         meaning:'Bread Baker' },
  { word:'SKIPSFØRER',    literal:'Ship-Leader',         meaning:'Ship Captain' },
  { word:'FJELLVEILEDER', literal:'Mountain-Guide',      meaning:'Mountain Guide' },
  { word:'SJØKAPTEIN',    literal:'Sea-Captain',         meaning:'Sea Captain' },
  { word:'FISKEHANDLER',  literal:'Fish-Dealer',         meaning:'Fishmonger' },
  { word:'ØRELEGE',       literal:'Ear-Doctor',          meaning:'ENT Doctor' },

  // --- Emotions & Inner States ---
  { word:'HJERTESORG',    literal:'Heart-Sorrow',        meaning:'Heartbreak' },
  { word:'LIVSGLEDE',     literal:'Life-Joy',            meaning:'Joy of Life' },
  { word:'LIVSLYST',      literal:'Life-Desire',         meaning:'Zest for Life' },
  { word:'SJELEFRED',     literal:'Soul-Peace',          meaning:'Peace of Mind' },
  { word:'HJERTEGLEDE',   literal:'Heart-Joy',           meaning:'Heart\'s Delight' },
  { word:'LIVSMOT',       literal:'Life-Courage',        meaning:'Will to Live' },
  { word:'GLEDESDAG',     literal:'Joy-Day',             meaning:'Day of Celebration' },
  { word:'VELVÆRE',       literal:'Well-Being',          meaning:'Wellbeing' },
  { word:'TUNGSINN',      literal:'Heavy-Mind',          meaning:'Melancholy' },
  { word:'SINNATOPP',     literal:'Angry-Top',           meaning:'Hothead' },
  { word:'DRØMMEVERDEN',  literal:'Dream-World',         meaning:'Dreamworld' },
  { word:'SORGTID',       literal:'Sorrow-Time',         meaning:'Time of Grief' },
  { word:'GLEDESRUS',     literal:'Joy-Rush',            meaning:'Euphoria' },
  { word:'TANKEVEKKER',   literal:'Thought-Waker',       meaning:'Thought-Provoker' },
  { word:'LIVSVERK',      literal:'Life-Work',           meaning:'Life\'s Work' },

  // --- Technology ---
  { word:'MOBILTELEFON',  literal:'Mobile-Phone',        meaning:'Mobile Phone' },
  { word:'FJERNKONTROLL', literal:'Far-Control',         meaning:'Remote Control' },
  { word:'MINNEPINNE',    literal:'Memory-Stick',        meaning:'USB Stick' },
  { word:'BILDESKJERM',   literal:'Picture-Screen',      meaning:'Monitor' },
  { word:'LYDBOK',        literal:'Sound-Book',          meaning:'Audiobook' },
  { word:'NETTBRETT',     literal:'Net-Board',           meaning:'Tablet' },
  { word:'NETTSIDE',      literal:'Net-Side',            meaning:'Website' },
  { word:'SKJERMSPARER',  literal:'Screen-Saver',        meaning:'Screensaver' },

  // --- Body Parts ---
  { word:'FINGERSPISS',   literal:'Finger-Tip',          meaning:'Fingertip' },
  { word:'HÅNDFLATE',     literal:'Hand-Flat',           meaning:'Palm of Hand' },
  { word:'SKULDERBLAD',   literal:'Shoulder-Blade',      meaning:'Shoulder Blade' },
  { word:'PANNEBEN',      literal:'Forehead-Bone',       meaning:'Frontal Bone' },
  { word:'KINNBEN',       literal:'Cheek-Bone',          meaning:'Cheekbone' },
  { word:'RYGGMARG',      literal:'Back-Marrow',         meaning:'Spinal Cord' },
  { word:'HJERNESKALLE',  literal:'Brain-Skull',         meaning:'Skull' },
  { word:'RINGFINGER',    literal:'Ring-Finger',         meaning:'Ring Finger' },
  { word:'PEKEFINGER',    literal:'Pointing-Finger',     meaning:'Index Finger' },
  { word:'LILLEFINGER',   literal:'Little-Finger',       meaning:'Little Finger' },
  { word:'MELLOMFINGER',  literal:'Middle-Finger',       meaning:'Middle Finger' },
  { word:'TOMMELFINGER',  literal:'Thumb-Finger',        meaning:'Thumb' },
  { word:'FOTSÅLE',       literal:'Foot-Sole',           meaning:'Sole of Foot' },
  { word:'LEGGBEIN',      literal:'Calf-Bone',           meaning:'Shin Bone' },
  { word:'TÅNEGL',        literal:'Toe-Nail',            meaning:'Toenail' },

  // --- Sports & Activities ---
  { word:'LANGRENN',      literal:'Long-Run',            meaning:'Cross-Country Skiing' },
  { word:'SKISKYTING',    literal:'Ski-Shooting',        meaning:'Biathlon' },
  { word:'HÅNDBALL',      literal:'Hand-Ball',           meaning:'Handball' },
  { word:'SVØMMEHALL',    literal:'Swimming-Hall',       meaning:'Indoor Pool' },
  { word:'RIDEBANE',      literal:'Riding-Track',        meaning:'Riding Arena' },
  { word:'PADLEBÅT',      literal:'Paddle-Boat',         meaning:'Canoe' },
  { word:'TRENINGSSENTER',literal:'Training-Centre',     meaning:'Gym' },
  { word:'FRIIDRETT',     literal:'Free-Athletics',      meaning:'Track and Field' },
  { word:'SNØBRETT',      literal:'Snow-Board',          meaning:'Snowboard' },
  { word:'FJELLKLATRING', literal:'Mountain-Climbing',   meaning:'Mountaineering' },


  // --- Places ---
  { word:'BARNEHAGE',     literal:'Child-Garden',        meaning:'Kindergarten' },
  { word:'SYKEHJEM',      literal:'Sick-Home',           meaning:'Nursing Home' },
  { word:'ALDERSHJEM',    literal:'Age-Home',            meaning:'Old People\'s Home' },
  { word:'KJØPESENTER',   literal:'Buy-Centre',          meaning:'Shopping Mall' },
  { word:'IDRETTSHALL',   literal:'Sport-Hall',          meaning:'Sports Hall' },
  { word:'KULTURHUS',     literal:'Culture-House',       meaning:'Cultural Centre' },
  { word:'RÅDHUS',        literal:'Council-House',       meaning:'City Hall' },
  { word:'TINGHUS',       literal:'Assembly-House',      meaning:'Courthouse' },
  { word:'CAMPINGPLASS',  literal:'Camping-Place',       meaning:'Campsite' },
  { word:'RULLEBANE',     literal:'Rolling-Track',       meaning:'Airport Runway' },
  { word:'VEIKRYSS',      literal:'Road-Cross',          meaning:'Road Junction' },
  { word:'MOTORVEI',      literal:'Motor-Road',          meaning:'Motorway' },
  { word:'JERNBANE',      literal:'Iron-Road',           meaning:'Railway' },
  { word:'TOGSTASJON',    literal:'Train-Station',       meaning:'Train Station' },
  { word:'LEKEPLASS',     literal:'Play-Place',          meaning:'Playground' },
  { word:'BADEPLASS',     literal:'Bath-Place',          meaning:'Swimming Spot' },
  { word:'UTSIKTSPUNKT',  literal:'View-Point',          meaning:'Viewpoint' },
  { word:'KIRKEGÅRD',     literal:'Church-Yard',         meaning:'Cemetery' },
  { word:'MARKEDSPLASS',  literal:'Market-Place',        meaning:'Marketplace' },
  { word:'FOTGJENGER',    literal:'Foot-Walker',         meaning:'Pedestrian' },

  // --- Vehicles & Transport ---
  { word:'LASTEBIL',      literal:'Load-Car',            meaning:'Truck' },
  { word:'MOTORSYKKEL',   literal:'Motor-Cycle',         meaning:'Motorcycle' },
  { word:'SNØSCOOTER',    literal:'Snow-Scooter',        meaning:'Snowmobile' },
  { word:'REDNINGSBÅT',   literal:'Rescue-Boat',         meaning:'Lifeboat' },
  { word:'FERGEBÅT',      literal:'Ferry-Boat',          meaning:'Ferry' },
  { word:'HURTIGBÅT',     literal:'Fast-Boat',           meaning:'Speedboat' },
  { word:'LUFTBALLONG',   literal:'Air-Balloon',         meaning:'Hot Air Balloon' },
  { word:'ROMSKIP',       literal:'Space-Ship',          meaning:'Spaceship' },
  { word:'DAMPSKIP',      literal:'Steam-Ship',          meaning:'Steamship' },
  { word:'TANKVOGN',      literal:'Tank-Cart',           meaning:'Tank Wagon' },
  { word:'TOGVOGN',       literal:'Train-Cart',          meaning:'Railway Carriage' },
  { word:'BRANNBÅT',      literal:'Fire-Boat',           meaning:'Fireboat' },
  { word:'SEILBÅT',       literal:'Sail-Boat',           meaning:'Sailboat' },
  { word:'SYKKELSTI',     literal:'Bicycle-Path',        meaning:'Bike Path' },
  { word:'SNØPLOG',       literal:'Snow-Plow',           meaning:'Snowplow' },

  // --- Clothing & Accessories ---
  { word:'REGNJAKKE',     literal:'Rain-Jacket',         meaning:'Rain Jacket' },
  { word:'UNDERTØY',      literal:'Under-Clothes',       meaning:'Underwear' },
  { word:'OVERTØY',       literal:'Over-Clothes',        meaning:'Outerwear' },
  { word:'BADEDRESS',     literal:'Bath-Suit',           meaning:'Swimsuit' },
  { word:'REGNTØY',       literal:'Rain-Clothes',        meaning:'Rain Gear' },
  { word:'VINDJAKKE',     literal:'Wind-Jacket',         meaning:'Windbreaker' },
  { word:'SKIDRESS',      literal:'Ski-Suit',            meaning:'Ski Suit' },
  { word:'STRØMPEBUKSE',  literal:'Stocking-Pants',      meaning:'Tights' },
  { word:'LOMMEKLUT',     literal:'Pocket-Cloth',        meaning:'Handkerchief' },
  { word:'LOMMEBOK',      literal:'Pocket-Book',         meaning:'Wallet' },
  { word:'SOLHATT',       literal:'Sun-Hat',             meaning:'Sun Hat' },
  { word:'VINTERFRAKK',   literal:'Winter-Coat',         meaning:'Winter Coat' },
  { word:'SYDVEST',       literal:'South-West',          meaning:'Sou\'wester Hat' },
  { word:'SKOSNOR',       literal:'Shoe-String',         meaning:'Shoelace' },
  { word:'HALVSTØVEL',    literal:'Half-Boot',           meaning:'Ankle Boot' },

  // --- Mixed & Other ---
  { word:'LOMMETYV',      literal:'Pocket-Thief',        meaning:'Pickpocket' },
  { word:'LOMMELYKT',     literal:'Pocket-Light',        meaning:'Flashlight' },
  { word:'TANNPIRKER',    literal:'Tooth-Picker',        meaning:'Toothpick' },
  { word:'ØREPLUGG',      literal:'Ear-Plug',            meaning:'Earplug' },
  { word:'MORGENFUGL',    literal:'Morning-Bird',        meaning:'Early Riser' },
  { word:'NATTERAVN',     literal:'Night-Raven',         meaning:'Night Owl' },
  { word:'TIDSFORDRIV',   literal:'Time-Drive',          meaning:'Pastime' },
  { word:'ØYEBLIKK',      literal:'Eye-Blink',           meaning:'Moment' },
  { word:'RULLESTEIN',    literal:'Rolling-Stone',       meaning:'Pebble' },
  { word:'HJEMSTED',      literal:'Home-Place',          meaning:'Hometown' },
  { word:'PAPPBOKS',      literal:'Cardboard-Box',       meaning:'Cardboard Box' },
  { word:'ØRERING',       literal:'Ear-Ring',            meaning:'Earring' },
  { word:'LYSESTAKE',     literal:'Candle-Stake',        meaning:'Candlestick' },
  { word:'KALDFRONT',     literal:'Cold-Front',          meaning:'Cold Front' },
  { word:'VARMFRONT',     literal:'Warm-Front',          meaning:'Warm Front' },
  { word:'STEINALDER',    literal:'Stone-Age',           meaning:'Stone Age' },
  { word:'JERNALDER',     literal:'Iron-Age',            meaning:'Iron Age' },
  { word:'GULLGRUVE',     literal:'Gold-Mine',           meaning:'Gold Mine' },
  { word:'SØLVGRUVE',     literal:'Silver-Mine',         meaning:'Silver Mine' },
  { word:'KIRKEKLOKKE',   literal:'Church-Bell',         meaning:'Church Bell' },
  { word:'LYSTHUS',       literal:'Pleasure-House',      meaning:'Summerhouse' },
  { word:'BADESTRAND',    literal:'Bath-Beach',          meaning:'Swimming Beach' },
  { word:'HAVFRUE',       literal:'Sea-Lady',            meaning:'Mermaid' },
  { word:'SJØTROLL',      literal:'Sea-Troll',           meaning:'Sea Monster' },
  { word:'TROLLSKOG',     literal:'Troll-Forest',        meaning:'Enchanted Forest' },
  { word:'MATPAKKE',      literal:'Food-Pack',           meaning:'Packed Lunch' },
  { word:'SOVEPOSE',      literal:'Sleep-Bag',           meaning:'Sleeping Bag' },
  { word:'TELTTUR',       literal:'Tent-Trip',           meaning:'Camping Trip' },
  { word:'FJELLTUR',      literal:'Mountain-Trip',       meaning:'Mountain Hike' },
  { word:'SKOGTUR',       literal:'Forest-Trip',         meaning:'Forest Walk' },
  { word:'SANGBOK',       literal:'Song-Book',           meaning:'Songbook' },
  { word:'TEGNEFILM',     literal:'Drawing-Film',        meaning:'Animated Film' },
  { word:'SPILLEFILM',    literal:'Play-Film',           meaning:'Feature Film' },
  { word:'BILLEDBOK',     literal:'Picture-Book',        meaning:'Picture Book' },
  { word:'SKOLEBOK',      literal:'School-Book',         meaning:'Textbook' },
  { word:'LÆREBOK',       literal:'Teaching-Book',       meaning:'Textbook' },
  { word:'SKOLEGÅRD',     literal:'School-Yard',         meaning:'School Playground' },
  { word:'NATURFAG',      literal:'Nature-Subject',      meaning:'Science Class' },
  { word:'KJERNEKRAFT',   literal:'Core-Power',          meaning:'Nuclear Power' },
  { word:'VINDKRAFT',     literal:'Wind-Power',          meaning:'Wind Power' },
  { word:'SOLKRAFT',      literal:'Sun-Power',           meaning:'Solar Power' },
  { word:'MORGENKAFFE',   literal:'Morning-Coffee',      meaning:'Morning Coffee' },
  { word:'FOLKESANG',     literal:'Folk-Song',           meaning:'Folk Song' },
  { word:'KONGEHUS',      literal:'King-House',          meaning:'Royal Family' },
  { word:'SOLSTRÅLE',     literal:'Sun-Ray',             meaning:'Sunbeam' },
  { word:'MÅNESKINN',     literal:'Moon-Shine',          meaning:'Moonlight' },
  { word:'STJERNEHIMMEL', literal:'Star-Sky',            meaning:'Starry Sky' },
  { word:'DRØMMELAND',    literal:'Dream-Land',          meaning:'Dreamland' },
  { word:'SUKKERSPINN',   literal:'Sugar-Spin',          meaning:'Cotton Candy' },
  { word:'NATURPARK',     literal:'Nature-Park',         meaning:'Nature Park' },
  { word:'BAKGÅRD',       literal:'Back-Yard',           meaning:'Backyard' },
  { word:'INNSJØ',        literal:'In-Lake',             meaning:'Lake' },
  { word:'ØDEMARK',       literal:'Desolate-Land',       meaning:'Wilderness' },
  { word:'DYREHAGE',      literal:'Animal-Garden',       meaning:'Zoo' },
  { word:'BLOMSTERENG',   literal:'Flower-Meadow',       meaning:'Flower Meadow' },
  { word:'GRØNNSAK',      literal:'Green-Thing',         meaning:'Vegetable' },
  { word:'FRUKTTRE',      literal:'Fruit-Tree',          meaning:'Fruit Tree' },
  { word:'KJÆLEDYR',      literal:'Dear-Animal',         meaning:'Pet' },
  { word:'BÆREKRAFT',     literal:'Bear-Power',          meaning:'Sustainability' },
  { word:'ÆRESORD',       literal:'Honour-Word',         meaning:'Word of Honour' },
  { word:'GÅGATE',        literal:'Walk-Street',         meaning:'Pedestrian Street' },
  { word:'MAURTUE',       literal:'Ant-Mound',           meaning:'Anthill' },
  { word:'GULLGRAVER',    literal:'Gold-Digger',         meaning:'Gold Digger' },
  { word:'HÅNDVERK',      literal:'Hand-Work',           meaning:'Handicraft' },
  { word:'SKOMAKER',      literal:'Shoe-Maker',          meaning:'Cobbler' },
  { word:'HØNSEHAUK',     literal:'Hen-Hawk',            meaning:'Goshawk' },
  { word:'SOMMERFERIE',   literal:'Summer-Holiday',      meaning:'Summer Vacation' },
  { word:'VINTERFERIE',   literal:'Winter-Holiday',      meaning:'Winter Vacation' },
  { word:'PÅSKEFERIE',    literal:'Easter-Holiday',      meaning:'Easter Break' },
  { word:'JULEFERIE',     literal:'Christmas-Holiday',   meaning:'Christmas Break' },
  { word:'FESTSTEMNING',  literal:'Party-Mood',          meaning:'Festive Atmosphere' },
  { word:'JULENISSE',     literal:'Christmas-Gnome',     meaning:'Santa Claus' },
  { word:'JULEKVELD',     literal:'Christmas-Eve',       meaning:'Christmas Evening' },
  { word:'JULETREPYNT',   literal:'Christmas-Tree-Trim', meaning:'Christmas Ornament' },
  { word:'PÅSKEEGG',      literal:'Easter-Egg',          meaning:'Easter Egg' },
  { word:'SNØMANN',       literal:'Snow-Man',            meaning:'Snowman' },
  { word:'ISSLOTT',       literal:'Ice-Castle',          meaning:'Ice Castle' },
  { word:'SNØBALL',       literal:'Snow-Ball',           meaning:'Snowball' },
  { word:'ISFLAKET',      literal:'Ice-Flake',           meaning:'Ice Floe' },
  { word:'TÅKEVÆR',       literal:'Fog-Weather',         meaning:'Foggy Weather' },
  { word:'SKYDEKKE',      literal:'Cloud-Cover',         meaning:'Cloud Cover' },
  { word:'REGNBYGE',      literal:'Rain-Squall',         meaning:'Rain Shower' },
  { word:'SOLBRENT',      literal:'Sun-Burnt',           meaning:'Sunburnt' },
  { word:'VINTERMØRKE',   literal:'Winter-Dark',         meaning:'Winter Darkness' },
  { word:'HØSTBLAD',      literal:'Autumn-Leaf',         meaning:'Autumn Leaf' },
  { word:'VÅRBLOMST',     literal:'Spring-Flower',       meaning:'Spring Flower' },
  { word:'SOMMERVIND',    literal:'Summer-Wind',         meaning:'Summer Breeze' },
  { word:'VINTERSOL',     literal:'Winter-Sun',          meaning:'Winter Sun' },
  { word:'HØSTVÆR',       literal:'Autumn-Weather',      meaning:'Autumn Weather' },
  { word:'ÅRSTID',        literal:'Year-Time',           meaning:'Season' },
  { word:'MIDTSOMMER',    literal:'Mid-Summer',          meaning:'Midsummer' },
  { word:'FYRTÅRN',       literal:'Fire-Tower',          meaning:'Lighthouse' },
  { word:'FISKEBÅT',      literal:'Fish-Boat',           meaning:'Fishing Boat' },
  { word:'FISKEHAVN',     literal:'Fish-Harbour',        meaning:'Fishing Harbour' },
  { word:'FJORDTUR',      literal:'Fjord-Trip',          meaning:'Fjord Tour' },
];


// ── Bird Watcher rotating facts (Reine) ───────────────────────────────────
window.BIRD_WATCHER_FACTS = [
  "Did you know the White-tailed Eagle calls Lofoten home? Norway has one of the world's densest populations of them! I recommend you take the Bird Watching Tour here!",
  "The Atlantic Puffin is known as the 'clown of the sea' for its colorful beak and clumsy landings. You can spot them right on these shores! I recommend you take the Bird Watching Tour here!",
  "The Peregrine Falcon is the world's fastest animal — it nests on these very coastal cliffs! I recommend you take the Bird Watching Tour here!",
  "Northern Gannets plunge-dive from incredible heights straight into the sea to catch fish. One of nature's great spectacles! I recommend you take the Bird Watching Tour here!",
  "The Northern Fulmar looks just like a gull but is actually related to the albatross — and it can spit foul-smelling oil at predators! I recommend you take the Bird Watching Tour here!",
  "The Arctic Skua is the pirate of the sky. It chases other birds until they drop their catch and then steals it mid-air! I recommend you take the Bird Watching Tour here!",
  "The Gyrfalcon is the largest falcon in the world — a rare but majestic sight here in Lofoten. I recommend you take the Bird Watching Tour here!",
  "Great Cormorants in the harbour are expert divers and can stay underwater for over a minute hunting fish! I recommend you take the Bird Watching Tour here!",
  "The Common Guillemot looks exactly like a tiny penguin when it swims and nests on the narrowest cliff ledges! I recommend you take the Bird Watching Tour here!",
  "The Arctic Tern migrates from the Arctic all the way to the Antarctic and back every year — the longest migration of any creature on Earth! I recommend you take the Bird Watching Tour here!",
];

// ── Lofoten historical facts (Villager, Reine) ───────────────────────────
window.LOFOTEN_FACTS = [
  "Sakrisøy — established 1889. One of the most beautiful fishing villages in all of Lofoten!",
  "Human activity in Lofoten dates back at least 11,000 years. People have been calling these islands home almost as long as anywhere else in Northern Europe!",
  "Until the 1960s, Norway's biggest industry was cod. And nowhere in Norway matters more for cod fishing than these islands right here.",
  "Tørrfisk — dried stockfish — is unique to Lofoten. The wind and temperature here are the only conditions on Earth perfect for drying cod naturally, at no extra cost!",
  "The rorbu cabins you see on stilts over the water were first ordered built in 1120 by King Øistein to house visiting fishermen. They've been here ever since!",
  "Lofoten has the biggest temperature anomaly relative to latitude anywhere in the world. The Gulf Stream keeps our winters far warmer than they should be this far north!",
  "The town of Vågan, right here in Lofoten, is the oldest known town in all of Northern Norway.",
  "In 1432, a Venetian sea-captain named Pietro Querini was shipwrecked and rescued by islanders of Røst. He brought stockfish back to Venice — that's how Norwegian dried cod became a signature Italian dish still eaten there today!",
  "Norwegian stockfish from Lofoten can be found in most countries around the world. A small island feeding the globe for over a thousand years!",
  "Viking chieftain Thorir the Stag from Austvågøy stood up to King Olav himself. One of the most legendary battles in the history of these islands happened right here.",
];

// ── Ikke Musikk artist facts (Artist NPC, Henningsvær) ───────────────────
window.IKKE_MUSIKK_ARTIST_FACTS = [
  "I heard you moved to Norway with just two bags and a t-shirt. Is it true?",
  "I heard you studied abroad at NTNU in Trondheim. I'm from there! Is it true?",
  "I heard you used to be IKE Music, but people on the internet started calling you Ikke Musikk and recognizing you in the streets. Then you dropped Tusen Takk 4 All My Haters and it blew up! That's legendary!",
  "I heard that Kevin Lauren was the first Norwegian kjendis to show you love. He has an eye for talent, that's for sure!",
  "I heard when you visited Bergen that fans surprised you at the train station. That's Beatlemania!",
  "I heard you have a ton of fan pages posting awesome content. Is it true your fans are called Bape Gang?",
  "I heard you got stopped at Gardermoen airport in your Bape. That they were filming you and going to put it on toll, but they made a mistake — and that whole story inspired Lander Gardermoen. That's a banger!",
  "I heard you were the first artist to start repping Bape. Now everyone's doing it. You're a trendsetter!",
  "I heard you used to know nobody in Norway — you'd make friends at the park or the grocery store. And now when you go to the small towns they even recognize you. That's so cool!",
  "I heard you went out to celebrate your friend's birthday and woke up the next day completely viral. That must have been wild!",
  "I heard your nickname was Ikke Norsk, but now you're actually Norsk. It's like how you're called Ikke Musikk but make the realest music! Juxtaposition!",
  "I heard your concerts are so much fun. When's your next show? I'm so there!",
  "I heard that when you went to Sweden you didn't tell anyone and just popped up in Uddevalla. Sweden Mode was crazy and you have fans there too! Swerve in that Volvo — I'm on my way to Stockholm!",
];
