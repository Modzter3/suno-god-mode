/**
 * Load data/genre-artists.json + data/niche-artists.json, merge expansions, write back.
 * Run from repo root: node scripts/build-artist-json.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const genrePath = path.join(root, 'data', 'genre-artists.json');
const nichePath = path.join(root, 'data', 'niche-artists.json');
if (!fs.existsSync(genrePath) || !fs.existsSync(nichePath)) {
  throw new Error('Missing data/genre-artists.json or data/niche-artists.json (commit these from the repo).');
}
const GENRE_ARTISTS = JSON.parse(fs.readFileSync(genrePath, 'utf8'));
let NICHE_ARTISTS = JSON.parse(fs.readFileSync(nichePath, 'utf8'));

/** Remove entries matching these substrings (e.g. disallowed names). */
const ARTIST_BLOCKLIST_SUBSTR = ['Gary Glitter'];
function scrubArtistLists(obj) {
  for (const k of Object.keys(obj)) {
    if (!Array.isArray(obj[k])) continue;
    obj[k] = obj[k].filter(function(a) {
      return !ARTIST_BLOCKLIST_SUBSTR.some(function(b) { return String(a).includes(b); });
    });
  }
}
scrubArtistLists(GENRE_ARTISTS);
scrubArtistLists(NICHE_ARTISTS);

const GENRE_ARTISTS_MORE = {
  EDM: ['Tiësto', 'Afrojack', 'Steve Aoki', 'Dimitri Vegas & Like Mike', 'Hardwell', 'Swedish House Mafia', 'Alesso', 'Nicky Romero', 'R3HAB', 'Don Diablo', 'KSHMR', 'Vini Vici', 'W&W', 'Blasterjaxx', 'Timmy Trumpet'],
  House: ['Purple Disco Machine', 'Duke Dumont', 'Gorgon City', 'Solardo', 'Patrick Topping', 'Hot Since 82', 'Green Velvet', 'Claptone', 'Honey Dijon', 'The Blessed Madonna', 'LP Giobbi', 'Cloonee', 'Mochakk', 'HUGEL', 'James Hype'],
  'Deep House': ['Black Coffee', 'Themba', 'Bedouin', 'WhoMadeWho', 'Ben Böhmer', 'Jan Blomqvist', 'Monolink', 'Satori', 'Sébastien Léger', 'Yotto', 'Cubicolor', 'Tim Green', 'Lee Burridge'],
  'Tech House': ['Michael Bibi', 'PAWSA', 'Mason Maynard', 'Wade', 'Miane', 'Hector Coutro', 'Shermanology', 'Vintage Culture', 'Mau P', 'Chapter & Verse', 'ESSEL', 'Hannah Laing'],
  Techno: ['Carl Cox', 'Jeff Mills', 'Robert Hood', 'Ben Klock', 'Marcel Dettmann', 'Len Faki', 'Stephan Bodzin', 'Tale Of Us', 'Maceo Plex', 'Joseph Capriati', 'Enrico Sangiuliano', 'Reinier Zonneveld', 'I Hate Models', '999999999'],
  Trance: ['Ferry Corsten', 'Cosmic Gate', 'Giuseppe Ottaviani', 'MaRLo', 'Ben Gold', 'Factor B', 'Key4050', 'Cold Blue', 'Ruben de Ronde', 'ilan Bluestone', 'Andrew Rayel'],
  Dubstep: ['Flux Pavilion', 'Doctor P', 'Cookie Monsta', 'Eptic', 'Spag Heddy', 'Trivecta', 'Sullivan King', 'Ray Volpe', 'Eliminate', 'Space Laces', 'Kill The Noise', 'Barely Alive', 'MUST DIE!'],
  'Drum and Bass': ['Wilkinson', 'Dimension', 'Culture Shock', 'Metrik', 'Friction', 'Camo & Krooked', 'Noisia', 'Black Sun Empire', 'Mefjus', 'Emperor', 'Kanine', 'Turno', 'Koven', 'MUZZ'],
  Ambient: ['Stars of the Lid', 'Tim Hecker', 'Harold Budd', 'William Basinski', 'Julianna Barwick', 'Hiroshi Yoshimura', 'Susumu Yokota', 'Loscil', 'Celer'],
  Synthwave: ['Waveshaper', 'Mega Drive', 'Daniel Deluxe', 'Dance With The Dead', 'LeBrock', 'DEADLIFE', 'OGRE', 'Street Fever'],
  Chillwave: ['Memory Tapes', 'Small Black', 'Wild Nothing', 'Craft Spells', 'Beach Fossils', 'DIIV'],
  'Future Bass': ['ODESZA', 'What So Not', 'NGHTMRE', 'SLANDER', 'DROELOE', 'Taska Black', 'Whethan', 'Jai Wolf', 'ARMNHMR', 'Dabin'],
  Electro: ['The Hacker', 'Miss Kittin', 'Vitalic', 'The Toxic Avenger', 'Kavinsky', 'Carpenter Brut'],
  Industrial: ['Front242', 'Front Line Assembly', 'Cubanate', '3TEETH', 'Author & Punisher', 'Youth Code'],
  Downtempo: ['DJ Shadow', 'DJ Krush', 'Nightmares On Wax', 'Kruder & Dorfmeister', 'Emancipator', 'Blockhead', 'Bonobo'],
  Hardstyle: ['Noisecontrollers', 'Wildstylez', 'Coone', 'Atmozfears', 'Sound Rush', 'D-Block & S-te-Fan', 'Phuture Noize', 'Sub Zero Project'],
  Disco: ['Chic', 'Sister Sledge', 'Sylvester', 'Village People', 'Indeep', 'Change', 'Shalamar', 'Heatwave'],
  'Hip Hop': ['A$AP Rocky', 'Vince Staples', 'Pusha T', 'Big Sean', '2 Chainz', 'Schoolboy Q', 'Ab-Soul', 'Jay Rock', 'Isaiah Rashad', 'Smino', 'Saba', 'EarthGang', 'Bas', 'Cordae', 'Freddie Gibbs'],
  Rap: ['Offset', 'Quavo', 'Lil Durk', 'G Herbo', 'Moneybagg Yo', 'EST Gee', 'NLE Choppa', 'Polo G', 'Lil Tjay', 'A Boogie wit da Hoodie', 'Roddy Ricch', 'Jack Harlow', 'Latto', 'Flo Milli'],
  'Boom Bap': ['Griselda', 'Westside Gunn', 'Conway The Machine', 'Boldy James', 'Rome Streetz', 'Ka', 'Your Old Droog', 'Evidence', 'Blu & Exile', 'Crimeapple'],
  Trap: ['Young Thug', 'Lil Yachty', 'Ski Mask The Slump God', 'Comethazine', 'Sheck Wes', 'Lil Tecca', 'Don Toliver', 'Rod Wave'],
  'Lo-fi Hip Hop': ['Joji', 'Saib', 'Kudasai', 'BluntOne', 'Birocratic', 'Philanthrope', 'Leavv', 'Oatmello', 'goosetaf'],
  'R&B': ['Victoria Monét', 'Tinashe', 'Jorja Smith', 'Snoh Aalegra', 'Masego', 'Lucky Daye', 'Giveon', 'Mahalia', 'Ella Mai', 'Jhené Aiko', 'PartyNextDoor', 'Teyana Taylor', 'Ari Lennox'],
  'Neo-Soul': ['Thundercat', 'Robert Glasper', 'Hiatus Kaiyote', 'Jordan Rakei', 'Yebba', 'Mereba', 'Raveena', 'Amber Mark', 'Cleo Sol'],
  Soul: ['Otis Redding', 'Sam Cooke', 'Curtis Mayfield', 'Bill Withers', 'Etta James', 'Nina Simone', 'Solange', 'Leon Thomas', 'Curtis Harding'],
  Funk: ['Cameo', 'The Gap Band', 'Rick James', 'The Meters', 'Bootsy Collins', 'George Clinton', 'Silk Sonic', 'Vulfpeck'],
  Phonk: ['INTERWORLD', 'MUPP', 'TWISTED', 'SXID', 'Ghostface Playa', 'KSLV Noh', 'Frost Children'],
  Rock: ['The Black Keys', 'Jack White', 'Wolf Alice', 'The Killers', 'The War On Drugs', 'Sam Fender', 'Black Pumas', 'Cage The Elephant'],
  'Classic Rock': ['Queen', 'Fleetwood Mac', 'The Who', 'Creedence Clearwater Revival', 'Cream', 'The Doors', 'Jimi Hendrix Experience', 'Boston'],
  'Indie Rock': ['Yeah Yeah Yeahs', 'The National', 'Vampire Weekend', 'The xx', 'Foals', 'Two Door Cinema Club', 'Wolf Alice', 'Alvvays'],
  'Alternative Rock': ['Weezer', 'Third Eye Blind', 'Jane\'s Addiction', 'Bush', 'Live'],
  'Pop Rock': ['The 1975', 'All Time Low', 'The All-American Rejects', 'Simple Plan', 'Bowling For Soup', 'State Champs'],
  'Hard Rock': ['Volbeat', 'Ghost', 'Alter Bridge', 'Shinedown', 'Three Days Grace', 'Breaking Benjamin', 'Disturbed'],
  'Punk Rock': ['The Offspring', 'Rancid', 'Social Distortion', 'Rise Against', 'Anti-Flag', 'Descendents', 'Pennywise', 'The Interrupters'],
  'Post-Punk': ['The Cure', 'Siouxsie and the Banshees', 'Echo & the Bunnymen', 'Gang of Four', 'Wire', 'Television', 'Public Image Ltd', 'The Chameleons'],
  Grunge: ['Bush', 'Silverchair', 'Mudhoney', 'Temple Of The Dog', 'Mother Love Bone', 'Screaming Trees'],
  'Heavy Metal': ['Megadeth', 'Anthrax', 'Testament', 'Exodus', 'Lamb of God', 'Machine Head', 'Gojira', 'Mastodon', 'Trivium', 'Arch Enemy'],
  Emo: ['Jimmy Eat World', 'Taking Back Sunday', 'Thursday', 'Saves The Day', 'The Used', 'Sunny Day Real Estate', 'Jawbreaker', 'The Get Up Kids'],
  'Nu Metal': ['Papa Roach', 'Static-X', 'Mudvayne', 'P.O.D.', 'Nonpoint', 'Ill Niño', 'Spineshank'],
  Pop: ['Sabrina Carpenter', 'Chappell Roan', 'Tate McRae', 'Gracie Abrams', 'Conan Gray', 'Troye Sivan', 'RAYE', 'PinkPantheress', 'Olivia Dean'],
  'Synth Pop': ['La Roux', 'Little Boots', 'Röyksopp', 'Ladytron', 'CHVRCHES'],
  Electropop: ['Rina Sawayama', 'Caroline Polachek', 'Tove Lo', 'Zara Larsson', 'Kim Petras', 'Slayyyter'],
  'K-Pop': ['IVE', '(G)I-DLE', 'LE SSERAFIM', 'ITZY', 'Red Velvet', 'MAMAMOO', 'EXO', 'NCT', 'SEVENTEEN', 'ATEEZ', 'ENHYPEN'],
  Country: ['Kacey Musgraves', 'Miranda Lambert', 'Carrie Underwood', 'Kelsea Ballerini', 'Ashley McBryde', 'Cody Johnson', 'Lainey Wilson', 'Ashley Cooke'],
  Folk: ['Joan Baez', 'Simon & Garfunkel', 'The Tallest Man On Earth', 'Laura Marling', 'Big Thief', 'Andy Shauf', 'Nick Mulvey'],
  'Indie Folk': ['The Head And The Heart', 'The Paper Kites', 'Angus & Julia Stone', 'Mumford & Sons', 'The Lumineers', 'Noah Kahan'],
  Jazz: ['Esperanza Spalding', 'Christian Scott', 'Terrace Martin', 'Tom Misch', 'Yussef Dayes', 'DOMi & JD BECK', 'Melanie Charles'],
  Afrobeat: ['Burna Boy', 'Wizkid', 'Davido', 'Rema', 'Ayra Starr', 'Omah Lay', 'CKay', 'Asake', 'Libianca', 'Fela Kuti'],
  Reggaeton: ['Myke Towers', 'Feid', 'Ryan Castro', 'Young Miko', 'Maria Becerra', 'Emilia', 'Tainy', 'Chencho Corleone'],
  Latin: ['Rosalía', 'Shakira', 'Karol G', 'Anitta', 'Peso Pluma', 'Junior H', 'Natanael Cano', 'Kali Uchis'],
  Classical: ['Mozart', 'Bach', 'Tchaikovsky', 'Mahler', 'Stravinsky', 'Satie', 'Debussy', 'Ravel'],
  Cinematic: ['James Horner', 'James Newton Howard', 'Alan Silvestri', 'Danny Elfman', 'Michael Giacchino', 'Brian Tyler', 'Rupert Gregson-Williams'],
  Footwork: ['DJ Manny', 'DJ Taye', 'DJ Paypal', 'Heavee', 'Slick Shoota', 'EQ Why', 'DJ Tre', 'DJ Rashad'],
  'Miami Bass': ['DJ Magic Mike', 'Anquette', 'DJ Laz', 'DJ Uncle Al'],
  Gqom: ['DJ Lag', 'Distruction Boyz', 'Que', 'Rudeboyz', 'DJ Maphorisa'],
  Amapiano: ['DBN Gogo', 'Kamo Mphela', 'Musa Keys', 'Young Stunna', 'Ch\'cco', 'Pabi Cooper', 'Sam Deep', 'Sir Trill'],
  'Bongo Flava': ['Harmonize', 'Rayvanny', 'Zuchu', 'Nandy', 'Mbosso', 'Jux', 'Vanessa Mdee'],
  Metal: ['Avenged Sevenfold', 'Bullet For My Valentine', 'Killswitch Engage', 'Trivium'],
  'Bass Music': ['Truth', 'The Widdler', 'Biome', 'Kai Wachi', 'PhaseOne', 'ATLiens', 'TYNAN', 'Eliminate'],
  'Psychedelic Rock': ['King Gizzard & The Lizard Wizard', 'Ty Segall', 'Thee Oh Sees', 'Khruangbin'],
  'Progressive Rock': ['Opeth', 'Haken', 'Leprous', 'Caligula\'s Horse', 'Big Big Train'],
  'Power Metal': ['Gloryhammer', 'Unleash The Archers', 'HammerFall', 'Stratovarius', 'Kamelot'],
  'Thrash Metal': ['Testament', 'Exodus', 'Overkill', 'Death Angel', 'Kreator', 'Destruction'],
  'Hair Metal': ['Ratt', 'Cinderella', 'Winger', 'Warrant', 'Skid Row', 'Quiet Riot'],
  'Glam Rock': ['Roxy Music', 'T. Rex', 'Sweet', 'Slade'],
  'New Wave': ['The B-52\'s', 'Adam Ant', 'Gary Numan', 'Ultravox', 'OMD'],
  Britpop: ['Supergrass', 'Elastica', 'Sleeper', 'Cast', 'Ocean Colour Scene'],
  'J-Pop': ['King Gnu', 'Official HIGE DANdism', 'Mrs. GREEN APPLE', 'Bump of Chicken', 'Perfume'],
  'City Pop': ['Mariya Takeuchi', 'Tatsuro Yamashita', 'Taeko Ohnuki', 'Hiroshi Sato', 'Tomoko Aran'],
  'Smooth Jazz': ['David Sanborn', 'Bob James', 'Fourplay', 'Boney James', 'Richard Elliot'],
  'Jazz Fusion': ['Return To Forever', 'Mahavishnu Orchestra', 'Soft Machine', 'Brand X'],
  Blues: ['John Mayer (blues)', 'Joe Bonamassa', 'Susan Tedeschi', 'Derek Trucks', 'Tedeschi Trucks Band'],
  'World Music': ['Bombino', 'Fatoumata Diawara', 'Amadou & Mariam', 'Rokia Traoré'],
  Flamenco: ['Camarón de la Isla', 'Paco de Lucía', 'Estrella Morente', 'Niña Pastori'],
  Reggae: ['Gregory Isaacs', 'Barrington Levy', 'Sizzla', 'Capleton', 'Buju Banton'],
  Dancehall: ['Vybz Kartel', 'Mavado', 'Aidonia', 'Teejay', 'Skillibeng', 'Skeng'],
  Salsa: ['Willie Colón', 'Héctor Lavoe', 'Marc Anthony', 'Gilberto Santa Rosa', 'La India'],
  Orchestral: ['John Williams', 'Howard Shore', 'James Horner', 'Alan Silvestri'],
  Neoclassical: ['Hania Rani', 'Dustin O\'Halloran', 'Jóhann Jóhannsson', 'Hauschka'],
  Opera: ['Cecilia Bartoli', 'Anna Netrebko', 'Jonas Kaufmann', 'Plácido Domingo'],
  Minimalist: ['Terry Riley', 'La Monte Young', 'Michael Nyman'],
  'Spa/Ambient': ['Deuter', 'Karunesh', 'Medwyn Goodall'],
  Jit: ['Icewear Vezzo', 'Babyface Ray', 'Peezy', 'Veeze'],
  Kuduro: ['Buraka Som Sistema', 'Titica', 'Preto Show'],
  Kwaito: ['Mandoza', 'Zola', 'Bongo Maffin'],
  Azonto: ['Fuse ODG', 'Sarkodie', 'E.L.'],
  Balti: ['Rishi Rich', 'Juggy D', 'Jay Sean'],
  'Dark Garage': ['Burial', 'El-B', 'Zed Bias'],
  'Hard Tekno': ['DAX J', 'I Hate Models', 'SPFDJ', '999999999'],
  'Scouse House': ['Ultrabeat', 'Flip & Fill', 'Architechs'],
  Afroswing: ['J Hus', 'Mostack', 'Not3s', 'Kojo Funds', 'NSG', 'Headie One (afroswing cuts)'],
};

function uniq(arr) {
  return [...new Set(arr.filter(Boolean))];
}

for (const [k, v] of Object.entries(GENRE_ARTISTS_MORE)) {
  if (!GENRE_ARTISTS[k]) GENRE_ARTISTS[k] = uniq(v);
  else GENRE_ARTISTS[k] = uniq([...GENRE_ARTISTS[k], ...v]);
}

const outDir = path.join(root, 'data');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'genre-artists.json'), JSON.stringify(GENRE_ARTISTS));

const NICHE_MORE = {
  ragetrap: ['Trippie Redd', 'SoFaygo', 'Lil Tecca', 'Cochise', 'midwxst'],
  drill: ['K-Trap', 'M24', 'OFB', 'Zone2', 'Loski', 'MizOrMac', 'Tion Wayne'],
  nydrill: ['Rowdy Rebel', '22Gz', 'Sleepy Hallow', 'Eli Fross', 'Dusty Locane', 'CJ'],
  cloudrap: ['Thaiboy Digital', 'Sickboyrari', 'Black Kray', 'Yung Lean'],
  hyperpop: ['Laura Les', 'Dorian Electra', 'Hannah Diamond', 'GFOTY', 'Umru', 'Fraxiom'],
  emorap: ['Iann Dior', 'Poorstacy', 'nothing,nowhere.', 'Lil Tracy', 'Cold Hart', 'Horse Head'],
  phonk: ['MUPP', 'KSLV Noh', 'Frost Children'],
  witchhouse: ['Holy Other', 'Balam Acab', 'Ritualz'],
  vaporwave: ['Macintosh Plus', 'Saint Pepsi', '猫シ Corp', 'death\'s dynamic shroud'],
  chiptune: ['Sabrepulse', 'Trey Frey', 'Big Giant Circles'],
  blackmetal: ['Dark Funeral', 'Marduk', 'Gorgoroth', 'Immortal'],
  doommetal: ['Electric Wizard', 'Sleep', 'Yob', 'Windhand', 'Monolord'],
  metalcore: ['Bad Omens', 'Spiritbox', 'Loathe', 'Currents', 'Erra'],
  breakcore: ['Ruby My Dear', 'Enduser', 'DJ Scotch Egg'],
  mathrock: ['TTNG', 'American Football', 'Invalid'],
  gabber: ['Miss K8', 'Dr. Peacock', 'Partyraiser'],
  postpunk: ['Protomartyr', 'Iceage', 'Shame', 'Squid', 'black midi'],
  eurodance: ['Culture Beat', 'Captain Hollywood Project', 'La Bouche', 'Corona'],
  crunkcore: ['Family Force5', 'I Set My Friends On Fire'],
  skramz: ['The Number Twelve Looks Like You', 'Jeromes Dream'],
  dembow: ['Natti Natasha', 'Bulova', 'El Mayor Clasico'],
  cumbia: ['Los Ángeles Azules', 'Celso Piña', 'La Sonora Dinamita', 'Aniceto Molina'],
  baile: ['Ludmilla', 'Pabllo Vittar', 'Gloria Groove'],
  skapunk: ['The Interrupters', 'The Skints', 'Streetlight Manifesto'],
  anthemictrap: ['TNGHT', 'Rustie', 'Lunice', 'Hudson Mohawke'],
  lofi: ['goosetaf', 'chief.', 'Kainbeats'],
  ballad: ['Sam Smith', 'James Arthur', 'Calum Scott', 'Labrinth'],
  cinematic: ['Tom Holkenborg', 'Volker Bertelmann', 'Nicholas Britell'],
  gospel: ['Kirk Franklin', 'Tasha Cobbs Leonard', 'CeCe Winans', 'Marvin Sapp'],
  detroitjit: ['BabyTron', 'Babyface Ray', 'Veeze'],
  dubstep: ['Eliminate', 'Ray Volpe', 'Subtronics', 'Excision'],
  mueve: ['Myke Towers', 'Jhayco', 'Mora'],
  perreo: ['Sech', 'Dalex', 'Justin Quiles'],
  bongo: ['Rayvanny', 'Zuchu', 'Mbosso'],
  dancehall_afroswing: ['J Hus', 'Mostack', 'Krept & Konan', 'NSG'],
  bushfire: ['Luude', 'Nina Las Vegas', 'What So Not'],
  dark_garage: ['Burial', 'Horsepower Productions'],
  hardtekno: ['Ilsa Gold', 'DJ Producer'],
};

for (const [k, v] of Object.entries(NICHE_MORE)) {
  if (!NICHE_ARTISTS[k]) NICHE_ARTISTS[k] = uniq(v);
  else NICHE_ARTISTS[k] = uniq([...NICHE_ARTISTS[k], ...v]);
}

fs.writeFileSync(path.join(outDir, 'niche-artists.json'), JSON.stringify(NICHE_ARTISTS));

console.log('genre-artists.json keys:', Object.keys(GENRE_ARTISTS).length);
console.log('niche-artists.json keys:', Object.keys(NICHE_ARTISTS).length);
