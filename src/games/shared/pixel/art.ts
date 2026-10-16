/**
 * Original pixel art for the Game Zone, drawn as ASCII (one character = one pixel, see PALETTE).
 * Rows shorter than the widest row are padded with transparent pixels.
 * To replace a sprite with a real sprite sheet, change its entry in manifest.ts — game code
 * only uses the texture keys.
 */
import type { CharacterLook, EvidenceSprite, IconKey } from '../../../education/types';

export interface SpriteDef {
  frames: string[][];
  /** Extra / overriding colours for this sprite (e.g. palette swaps). */
  palette?: Record<string, string>;
}

const one = (rows: string[], palette?: Record<string, string>): SpriteDef => ({ frames: [rows], palette });

/* ---------------- Grammar Blaster ---------------- */

const SHIP_BODY = [
  '.......KK.......',
  '......KCCK......',
  '......KCCK......',
  '.....KCLLCK.....',
  '.....KBLLBK.....',
  '....KBBCCBBK....',
  '....KBBCCBBK....',
  '...KVBBBBBBVK...',
  '..KVVBBWWBBVVK..',
  '.KVVKBBWWBBKVVK.',
  'KVVK.KBBBBK.KVVK',
  'KVK..KbBBbK..KVK',
  'KK...KKbbKK...KK',
];
export const SHIP: SpriteDef = {
  frames: [
    [...SHIP_BODY, '......KOOK......', '......KYYK......', '.......YY.......'],
    [...SHIP_BODY, '......KOOK......', '.......YY.......', '................'],
  ],
};

const MINE_A = [
  '.....KK.....',
  '....KRRK....',
  '..K.KRRK.K..',
  '.KRKKggKKRK.',
  '..KgGGGGgK..',
  'KRKGGWWGGKRK',
  'KRKGGWWGGKRK',
  '..KgGGGGgK..',
  '.KRKKggKKRK.',
  '..K.KRRK.K..',
  '....KRRK....',
  '.....KK.....',
];
export const MINE: SpriteDef = {
  frames: [MINE_A, MINE_A.map((r, i) => (i === 5 || i === 6 ? 'KRKGGRRGGKRK' : r))],
};

/* ---------------- Word Jumper ---------------- */

const ASTRO_TOP = [
  '................',
  '.....KKKKKK.....',
  '....KWWWWWWK....',
  '...KWWWKKKKWK...',
  '...KWWKCCLLKK...',
  '.KKKWWKCCCLKK...',
  '.KSKWWWKKKKWK...',
  '.KSKKWWWWWWK....',
  '.KSKOWWWWWOK....',
  '.KKKWWWOOWWWK...',
  '...KWWWWWWWSK...',
];
export const ASTRO: SpriteDef = {
  frames: [
    // idle
    [...ASTRO_TOP, '...KKWWKKWWK....', '....KSSKKSSK....', '....KWWKKWWK....', '...KOOKK.KOOK...', '...KKKK..KKKK...'],
    // run 1
    [...ASTRO_TOP, '...KKWWKKWWK....', '...KSSK..KSSK...', '..KWWK....KWWK..', '.KOOK.....KOOK..', '.KKK.......KKK..'],
    // run 2
    [...ASTRO_TOP, '...KKWWWWWK.....', '....KSSSSK......', '....KWWWWK......', '....KOOOOK......', '....KKKKKK......'],
    // jump
    [...ASTRO_TOP, '...KKWWKKWWK....', '...KSSKKSSK.....', '..KOOK.KOOK.....', '..KKK..KKK......', '................'],
  ],
};

export const TILE_TOP = one([
  'KKKKKKKKKKKKKKKK',
  'KCCCCCCCCCCCCCCK',
  'KLLLLLLLLLLLLLLK',
  'KBBBBBBBBBBBBBBK',
  'KbbbbbbbbbbbbbbK',
  'KDDDDDDDDDDDDDDK',
  'KDGDDDDDDDDDDGDK',
  'KDDDDDDDDDDDDDDK',
  'KDDDDDDddDDDDDDK',
  'KDDDDDDddDDDDDDK',
  'KDDDDDDDDDDDDDDK',
  'KDDDDDDDDDDDDDDK',
  'KDGDDDDDDDDDDGDK',
  'KDDDDDDDDDDDDDDK',
  'KddddddddddddddK',
  'KKKKKKKKKKKKKKKK',
]);

export const TILE_FILL = one([
  'KDDDDDDDDDDDDDDK',
  'KDDDDDDDDDDDDDDK',
  'KDGDDDDDDDDDDGDK',
  'KDDDDDDDDDDDDDDK',
  'KDDDDDDddDDDDDDK',
  'KDDDDDDddDDDDDDK',
  'KDDDDDDDDDDDDDDK',
  'KddddddddddddddK',
  'KDDDDDDDDDDDDDDK',
  'KDDDDDDDDDDDDDDK',
  'KDGDDDDDDDDDDGDK',
  'KDDDDDDDDDDDDDDK',
  'KDDDDDDddDDDDDDK',
  'KDDDDDDddDDDDDDK',
  'KddddddddddddddK',
  'KKKKKKKKKKKKKKKK',
]);

export const SPIKES = one([
  '...K.......K....',
  '..KSK.....KSK...',
  '..KSK.....KSK...',
  '.KSWSK...KSWSK..',
  '.KSWSK...KSWSK..',
  'KSSWSSK.KSSWSSK.',
  'KGGGGGGKKGGGGGGK',
  'KKKKKKKKKKKKKKKK',
]);

const BEACON = (light: string) => [
  '...KK.....',
  `..K${light}${light}K....`,
  `..K${light}${light}K....`,
  '...KK.....',
  '...KK.....',
  '...KSK....',
  '...KSK....',
  '...KSK....',
  '...KSK....',
  '...KSK....',
  '...KSK....',
  '...KSK....',
  '...KSK....',
  '..KSSSK...',
  '.KGGGGGK..',
  '.KKKKKKK..',
];
export const BEACON_SPRITE: SpriteDef = { frames: [BEACON('G'), BEACON('E')] };

/* ---------------- Tense Racer ---------------- */

const CAR_ROWS = [
  '.....KKKKKK.....',
  '....K444444K....',
  '...K44LLLL44K...',
  '...K4LLLLLL4K...',
  '..KK44444444KK..',
  '.KhK45544554KhK.',
  '.KhK44444444KhK.',
  '.KhK44CCCC44KhK.',
  '..KK4CLLLLC4KK..',
  '...K4CLLLLC4K...',
  '...K4CCCCCC4K...',
  '...K44444444K...',
  '...K45444454K...',
  '...K44444444K...',
  '..KK44666644KK..',
  '.KhK44444444KhK.',
  '.KhK44444444KhK.',
  '.KhK45555554KhK.',
  '..KK44444444KK..',
  '...K4RR44RR4K...',
  '...KKKKKKKKKK...',
];
const carColours = (main: string, shade: string, stripe: string) => ({ '4': main, '5': shade, '6': stripe });
const FLAME_A = ['....KOO..OOK....', '.....Y....Y.....', '................'];
const FLAME_B = ['....KYY..YYK....', '....OYO..OYO....', '.....O....O.....'];
export const CAR_COLOURS = {
  player: carColours('#2878FF', '#1B4FB0', '#FFD166'),
  rival1: carColours('#FF9F43', '#C46A1C', '#F5F7FF'),
  rival2: carColours('#B36BFF', '#4E36B8', '#39D9FF'),
  rival3: carColours('#3DDC84', '#1F9E5A', '#0B1024'),
};
export function carSprite(colours: Record<string, string>): SpriteDef {
  return { frames: [[...CAR_ROWS, ...FLAME_A], [...CAR_ROWS, ...FLAME_B]], palette: colours };
}

export const CONE = one([
  '...KK...',
  '..KOOK..',
  '..KWWK..',
  '.KOOOOK.',
  '.KWWWWK.',
  'KOOOOOOK',
  'KKKKKKKK',
]);

/* ---------------- shared small things ---------------- */

export const COIN = one([
  '..KKKK..',
  '.KYYYYK.',
  'KYYWYYyK',
  'KYWYYYyK',
  'KYYYYYyK',
  'KYYYYyyK',
  '.KyyyyK.',
  '..KKKK..',
]);

export const HEART = one([
  '.KK.KK..',
  'KRRKRRK.',
  'KRWRRRK.',
  'KRRRRRK.',
  '.KRRRK..',
  '..KRK...',
  '...K....',
]);

export const SPARK = one(['W']);

/* ---------------- English Detective characters ---------------- */

const HUMAN_SHORT = [
  '................',
  '.....KKKKKK.....',
  '....K333333K....',
  '...K33333333K...',
  '...K33111133K...',
  '...K31111113K...',
  '...K11K11K11K...',
  '...K11111111K...',
  '...K11122111K...',
  '....K111111K....',
  '.....KK11KK.....',
  '...KK444444KK...',
  '..K4444664444K..',
  '..K4444664444K..',
  '.K14K446644K41K.',
  '.K11K444444K11K.',
  '..KK.K4444K.KK..',
  '.....K5555K.....',
  '.....K5KK5K.....',
  '.....K5KK5K.....',
  '.....K5KK5K.....',
  '....KhhKKhhK....',
  '....KKKKKKKK....',
  '................',
];
const HUMAN_LONG = HUMAN_SHORT.map((r, i) => {
  if (i >= 5 && i <= 9) return '..K3' + r.slice(4, 12) + '3K..';
  if (i === 10) return '..K33KK11KK33K..';
  return r;
});
const CHEF_HAT = ['....KKKKKKK.....', '...KWWWWWWWK....', '...KWWWWWWWK....', '....KWWWWWK.....'];
const withHat = (rows: string[], hat: string[]) => [...hat, ...rows.slice(hat.length)];

const ROBOT_ROWS = [
  '.......KK.......',
  '.......KRK......',
  '......KKKK......',
  '...KKKKKKKKKK...',
  '...KSSSSSSSSK...',
  '...KSKKSSKKSK...',
  '...KSKCSSKCSK...',
  '...KSSSSSSSSK...',
  '...KSSKKKKSSK...',
  '...KSSSSSSSSK...',
  '...KKKKKKKKKK...',
  '.....KKggKK.....',
  '..KKKSSSSSSKKK..',
  '.KSKSSCCCCSSKSK.',
  '.KSKSSCYYCSSKSK.',
  '.KSKSSCCCCSSKSK.',
  '.KGK.SSSSSS.KGK.',
  '..K..KKKKKK..K..',
  '.....KgK.KgK....',
  '.....KgK.KgK....',
  '.....KgK.KgK....',
  '....KSSK.KSSK...',
  '....KKKK.KKKK...',
  '................',
];
const ALIEN_ROWS = [
  '...K........K...',
  '...KEK....KEK...',
  '....KK....KK....',
  '.....KKKKKK.....',
  '...KKEEEEEEKK...',
  '..KEEEEEEEEEEK..',
  '..KEKKKEEKKKEK..',
  '..KEKWKEEKWKEK..',
  '..KEKKKEEKKKEK..',
  '..KEEEEEEEEEEK..',
  '...KEEEKKEEEK...',
  '....KKEEEEKK....',
  '...KKVVVVVVKK...',
  '..KEKVVVVVVKEK..',
  '..KEKVVYYVVKEK..',
  '..KEKVVVVVVKEK..',
  '...K.VVVVVV.K...',
  '.....KKKKKK.....',
  '.....KEK.KEK....',
  '.....KEK.KEK....',
  '.....KEK.KEK....',
  '....KEEK.KEEK...',
  '....KKKK.KKKK...',
  '................',
];

const look = (rows: string[], skin: string, hair: string, top: string, trousers: string, accent: string): SpriteDef => ({
  frames: [rows],
  palette: { '1': skin, '2': '#B8324A', '3': hair, '4': top, '5': trousers, '6': accent },
});

export const CHARACTERS: Partial<Record<CharacterLook, SpriteDef>> = {
  'student-a': look(HUMAN_SHORT, '#F2C29B', '#6B4425', '#2878FF', '#24315E', '#FFD166'),
  'student-b': look(HUMAN_LONG, '#C68A5E', '#2A1E1A', '#B36BFF', '#24315E', '#F5F7FF'),
  'teen-a': look(HUMAN_SHORT, '#8A5A3B', '#2A1E1A', '#3DDC84', '#3A4466', '#F5F7FF'),
  'teen-b': look(HUMAN_LONG, '#F2C29B', '#C46A1C', '#FF5468', '#24315E', '#FFD166'),
  engineer: look(HUMAN_SHORT, '#C68A5E', '#6B4425', '#FF9F43', '#C46A1C', '#3A4466'),
  scientist: look(HUMAN_SHORT, '#F2C29B', '#B7C1DF', '#F5F7FF', '#24315E', '#39D9FF'),
  chef: look(withHat(HUMAN_SHORT, CHEF_HAT), '#8A5A3B', '#2A1E1A', '#F5F7FF', '#3A4466', '#FF5468'),
  captain: look(HUMAN_SHORT, '#C68A5E', '#2A1E1A', '#7957FF', '#182449', '#FFD166'),
  medic: look(HUMAN_LONG, '#F2C29B', '#6B4425', '#A8F0FF', '#2878FF', '#FF5468'),
  gardener: look(HUMAN_LONG, '#8A5A3B', '#6B4425', '#1F9E5A', '#8B5A2B', '#FFD166'),
  robot: one(ROBOT_ROWS),
  alien: one(ALIEN_ROWS),
};

/* ---------------- Vocabulary icons (12×12) ---------------- */

export const ICONS: Record<IconKey, SpriteDef> = {
  cat: one(['.K........K.', 'KOK......KOK', 'KOOKKKKKKOOK', 'KOOOOOOOOOOK', 'KOKEOOOOKEOK', 'KOOOOOOOOOOK', 'KOOOOXXOOOOK', 'KOOOKOOKOOOK', '.KOOOOOOOOK.', '..KKOOOOKK..', '....KKKK....']),
  dog: one(['............', '.KKK....KKK.', 'KHHHKKKKHHHK', 'KHHmmmmmmHHK', 'KHKmmmmmmKHK', '.KmKmmmmKmK.', '.KmmmmmmmmK.', '.KmmmKKmmmK.', '.KmmmKKmmmK.', '..KmmRRmmK..', '...KKKKKK...']),
  fish: one(['............', '....KKKK....', '..KKBBBBKK.K', '.KBBBBBBBBKK', 'KBWKBBBBBBBK', 'KBKKBBBBBBBK', 'KBBBBBBBBBBK', '.KBBCCBBBBKK', '..KKBBBBKK.K', '....KKKK....']),
  bird: one(['............', '....KKKK....', '...KYYYYK...', '..KYYWKYYKK.', '..KYYYYYYKOK', '..KYYYYYYKK.', '.KYYYYYYYK..', 'KYYyyyyYYK..', '.KYyyyyYK...', '..KKYYKK....', '...K..K.....', '...O..O.....']),
  rabbit: one(['..KK....KK..', '.KWWK..KWWK.', '.KWXK..KXWK.', '.KWXK..KXWK.', '..KWWKKWWK..', '.KWWWWWWWWK.', 'KWWKWWWWKWWK', 'KWWWWXXWWWWK', 'KWWWWWWWWWWK', '.KWWWWWWWWK.', '..KKKKKKKK..']),
  apple: one(['.....KK.....', '.....KMK....', '....KKMKEEK.', '..KKRRKRRKK.', '.KRRWRRRRRRK', 'KRRWRRRRRRRK', 'KRRRRRRRRRRK', 'KRRRRRRRRRRK', 'KRRRRRRRRRrK', '.KRRRRRRRrK.', '..KKRRRRKK..', '....KKKK....']),
  banana: one(['..........K.', '.........KyK', '........KYYK', '.......KYYK.', '......KYYYK.', '....KKYYYK..', '..KKYYYYK...', 'KKYYYYYK....', 'KyYYYKK.....', '.KKKK.......']),
  cake: one(['.....Y......', '....KOK.....', '....KWK.....', '.KKKKWKKKKK.', 'KXXXXXXXXXXK', 'KWWWWWWWWWWK', 'KXWXWXWXWXWK', 'KMMMMMMMMMMK', 'KmmmmmmmmmmK', 'KMMMMMMMMMMK', '.KKKKKKKKKK.']),
  egg: one(['....KKKK....', '...KWWWWK...', '..KWWWWWWK..', '..KWWWWWWK..', '.KWWWWWWWSK.', '.KWWWWWWWSK.', '.KWWWWWWWSK.', '.KWWWWWWSSK.', '..KWWWWSSK..', '...KKKKKK...']),
  pizza: one(['KKKKKKKKKKKK', 'KmmmmmmmmmmK', 'KMYYRYYYYYMK', '.KYYYYYRYYK.', '.KYRYYYYYYK.', '..KYYYRYYK..', '..KYYYYYYK..', '...KYRYYK...', '...KYYYYK...', '....KYYK....', '....KYYK....', '.....KK.....']),
  sun: one(['.....YY.....', '.Y...YY...Y.', '..Y..KK..Y..', '....KYYK....', '...KYYYYK...', 'YYKYYYYYYKYY', 'YYKYYYYYYKYY', '...KYYYYK...', '....KYYK....', '..Y..KK..Y..', '.Y...YY...Y.', '.....YY.....']),
  moon: one(['....KKKK....', '..KKYYYK....', '.KYYYYK.....', '.KYYYK......', 'KYYYYK......', 'KYYYYK......', 'KYYYYK......', 'KYYYYYK.....', '.KYYYYYK....', '.KYYYYYYKKK.', '..KKYYYYYYK.', '....KKKKKK..']),
  star: one(['.....KK.....', '.....YY.....', '....KYYK....', '....KYYK....', 'KKKKYYYYKKKK', 'KYYYYYYYYYYK', '.KYYYYYYYYK.', '..KYYYYYYK..', '..KYYKKYYK..', '.KYYK..KYYK.', '.KYK....KYK.', '.KK......KK.']),
  cloud: one(['............', '............', '....KKKK....', '...KWWWWK...', '.KKWWWWWWKK.', 'KWWWWWWWWWWK', 'KWWWWWWWWWSK', 'KWWWWWWWWSSK', '.KSSSSSSSSK.', '..KKKKKKKK..']),
  tree: one(['....KKKK....', '..KKEEEEKK..', '.KEEEEeEEEK.', 'KEEeEEEEEEEK', 'KEEEEEEEeEEK', 'KEEEEEEEEEEK', '.KEEeEEEEEK.', '..KKKMMKKK..', '....KMMK....', '....KMMK....', '...KMMMMK...', '...KKKKKK...']),
  flower: one(['.....KK.....', '....KXXK....', '..KKKXXKKK..', '.KXXKYYKXXK.', '.KXXKYYKXXK.', '..KKKXXKKK..', '....KXXK....', '.....KK.....', '.....KE.KK..', '...KKEKEEK..', '...KEEEKK...', '.....KE.....']),
  rocket: one(['.....KK.....', '....KWWK....', '...KWRRWK...', '...KWWWWK...', '...KWCCWK...', '...KWCCWK...', '...KWWWWK...', '..KRKWWKRK..', '.KRRKWWKRRK.', '.KRK.KK.KRK.', '.....OO.....', '.....YY.....']),
  planet: one(['............', '....KKKK....', '..KKPPPPKK..', '.KPPPPVVPPK.', 'YYKPPPPPPKYY', '.YYYYYYYYYY.', 'YYKPVPPPPKYY', '.KPPPPPPPPK.', '..KKPPPPKK..', '....KKKK....']),
  house: one(['.....KK.....', '....KRRK....', '...KRRRRK...', '..KRRRRRRK..', '.KRRRRRRRRK.', 'KKKKKKKKKKKK', '.KWWWWWWWWK.', '.KWCCWWMMWK.', '.KWCCWWMMWK.', '.KWWWWWMMWK.', '.KKKKKKKKKK.']),
  car: one(['............', '............', '...KKKKKK...', '..KRRLLRRK..', '..KRLLRLLRK.', '.KRRRRRRRRRK', 'KRRRRRRRRRRK', 'KRRRRRRRRRRK', 'KKKhhKKKhhKK', '..KhGhK.KhGh', '...KK....KK.']),
  bus: one(['............', 'KKKKKKKKKKK.', 'KYYYYYYYYYYK', 'KYLLKLLKLLYK', 'KYLLKLLKLLYK', 'KYYYYYYYYYYK', 'KYYYYYYYYYYK', 'KyyyyyyyyyyK', 'KKhhKKKKhhKK', '.KhGhK.KhGhK', '..KK....KK..']),
  ball: one(['....KKKK....', '..KKRRWWKK..', '.KRRRRWWBBK.', '.KRRRWWWBBK.', 'KRRRRWWBBBBK', 'KRRRWWWBBBBK', 'KYYYWWWBBBBK', 'KYYYYWWBBBBK', '.KYYYWWWBBK.', '.KYYYYWWBBK.', '..KKYYWWKK..', '....KKKK....']),
  book: one(['............', '.KKKKKKKKKK.', '.KBBBBBBBBWK', '.KBYYYYYYBWK', '.KBBBBBBBBWK', '.KBYYYYBBBWK', '.KBBBBBBBBWK', '.KBBBBBBBBWK', '.KBBBBBBBBWK', '.KbbbbbbbbWK', '.KKKKKKKKKK.']),
  pen: one(['..........KK', '.........KRK', '........KRRK', '.......KRRK.', '......KRRK..', '.....KRRK...', '....KRRK....', '...KSSK.....', '..KWSK......', '..KWK.......', '.KK.........']),
  bag: one(['....KKKK....', '...K....K...', '..KKKKKKKK..', '.KOOOOOOOOK.', '.KOOOOOOOOK.', '.KoKKKKKKoK.', '.KoKOOOOKoK.', '.KoKOYYOKoK.', '.KoKOOOOKoK.', '.KoKKKKKKoK.', '.KKKKKKKKKK.']),
  hat: one(['............', '............', '............', '....KKKK....', '..KKBBBBKK..', '.KBBBBBBBBK.', '.KBBBBBBBBK.', 'KYYYYYYYYYYK', 'KKKKKKKKKKKK', 'KbbbbbbbbbbK', '.KKKKKKKKKK.']),
  clock: one(['....KKKK....', '..KKWWWWKK..', '.KWWWKWWWWK.', '.KWWWKWWWWK.', 'KWWWWKWWWWWK', 'KWWWWKKKKWWK', 'KWWWWWWWWWWK', 'KWWWWWWWWWWK', '.KWWWWWWWWK.', '.KWWWWWWWWK.', '..KKWWWWKK..', '....KKKK....']),
  phone: one(['...KKKKKK...', '..KggggggK..', '..KgKKKKgK..', '..KgLLLLgK..', '..KgLCCLgK..', '..KgLLLLgK..', '..KgLCCLgK..', '..KgLLLLgK..', '..KgKKKKgK..', '..KggWWggK..', '..KggggggK..', '...KKKKKK...']),
  key: one(['............', '............', '.KKKK.......', 'KYYYYK......', 'KYKKYKKKKKKK', 'KYKKYYYYYYYK', 'KYYYYKKYKYKK', '.KKKK..K.K..']),
  chair: one(['.KK.........', '.KMK........', '.KMK........', '.KMK........', '.KMK........', '.KMKKKKKKKK.', '.KMMMMMMMMMK', '.KMKKKKKKKMK', '.KMK.....KMK', '.KMK.....KMK', '.KMK.....KMK', '.KKK.....KKK']),
  cup: one(['............', '...S..S.....', '....S..S....', '.KKKKKKKK...', '.KBBBBBBKKK.', '.KBWWBBBK.K.', '.KBWWBBBK.K.', '.KBBBBBBKKK.', '.KBBBBBBK...', '.KbbbbbbK...', '..KKKKKK....']),
  shoe: one(['............', '............', '............', '...KKKK.....', '..KRWRRK....', '..KRWRRRKK..', '..KRRRRRRRK.', '.KRRRRRRRRRK', 'KWWWWWWWWWWK', 'KKKKKKKKKKKK']),
};

/* ---------------- Evidence (12×12) ---------------- */

export const EVIDENCE: Record<EvidenceSprite, SpriteDef> = {
  note: one(['.KKKKKKKK...', '.KZZZZZZKK..', '.KZGGGGZZK..', '.KZZZZZZZK..', '.KZGGGGGZK..', '.KZZZZZZZK..', '.KZGGGGZZK..', '.KZZZZZZZK..', '.KZGGGZZZK..', '.KZZZZZZZK..', '.KKKKKKKKK..']),
  keycard: one(['............', '............', 'KKKKKKKKKKKK', 'KCCCCCCCCCCK', 'KCKKCCCCCCCK', 'KCKYCCWWWWCK', 'KCKKCCCCCCCK', 'KCCCCCWWWCCK', 'KCCCCCCCCCCK', 'KKKKKKKKKKKK']),
  footprints: one(['.KK.........', 'KMMK........', 'KMMK..KK....', '.KK..KMMK...', '.KK..KMMK...', '......KK....', '......KK....', '.........KK.', '........KMMK', '........KMMK', '.........KK.', '.........KK.']),
  cup: one(['............', '...KKKKKK...', '..KWWWWWWK..', '..KKKKKKKK..', '...KOOOOK...', '...KOWWOK...', '...KOWWOK...', '...KOOOOK...', '...KOOOOK...', '....KOOK....', '....KKKK....']),
  tablet: one(['............', '.KKKKKKKKKK.', '.KggggggggK.', '.KgLLLLLLgK.', '.KgLCLCLLgK.', '.KgLLLLLLgK.', '.KgLCCCLLgK.', '.KgLLLLLLgK.', '.KggggWgggK.', '.KKKKKKKKKK.']),
  box: one(['............', '............', 'KKKKKKKKKKKK', 'KmmmmmmmmmmK', 'KMMMMMMMMMMK', 'KmmmmYYmmmmK', 'KmmmmYYmmmmK', 'KmmmmmmmmmmK', 'KmmmmmmmmmmK', 'KMMMMMMMMMMK', 'KKKKKKKKKKKK']),
  plant: one(['...KK..KK...', '..KEEKKEEK..', '..KEeEEeEK..', '...KEEEEK...', '..KEEeEEEK..', '...KKEEKK...', '....KEEK....', '..KKKKKKKK..', '..KOOOOOOK..', '...KOOOOK...', '...KoooOK...', '...KKKKKK...']),
  toolbox: one(['............', '....KKKK....', '....K..K....', '.KKKKKKKKKK.', '.KRRRRRRRRK.', '.KRRRRRRRRK.', '.KrrrSSrrrK.', '.KRRRSSRRRK.', '.KRRRRRRRRK.', '.KrrrrrrrrK.', '.KKKKKKKKKK.']),
  map: one(['............', 'KKKKKKKKKKKK', 'KZZZKCCCKZZK', 'KZRZKCCCKZZK', 'KZZZKCEEKZZK', 'KZZZKCEEKZRK', 'KZZEKCCCKZZK', 'KZZZKCCCKZZK', 'KKKKKKKKKKKK']),
  photo: one(['............', 'KKKKKKKKKKKK', 'KWWWWWWWWWWK', 'KWCCCCCCCCWK', 'KWCCCYYCCCWK', 'KWCCKKKKCCWK', 'KWCKTTTTKCWK', 'KWEEKTTKEEWK', 'KWWWWWWWWWWK', 'KKKKKKKKKKKK']),
  bag: one(['............', '....KKKK....', '...K....K...', '..KKKKKKKK..', '.KPPPPPPPPK.', '.KPPPPPPPPK.', '.KPPYYPPPPK.', '.KPPPPPPPPK.', '.KvvvvvvvvK.', '.KKKKKKKKKK.']),
  glove: one(['............', '...K.K.K....', '..KYKYKYK...', '..KYKYKYK.K.', '..KYKYKYKKYK', '..KYYYYYYKYK', '..KYYYYYYYK.', '..KYYYYYYK..', '...KYYYYYK..', '...KOOOOOK..', '...KKKKKKK..']),
  key: ICONS_KEY(),
  crumbs: one(['............', '............', '............', '............', '...K........', '..KmK...K...', '...K...KmK..', '.K......K...', 'KmK..K....K.', '.K..KmK..KmK', '.....K....K.']),
  paint: one(['............', '............', '....KKK.....', '..KKVVVKK...', '.KVVVVVVVK..', 'KVVPVVVVVVK.', 'KVVVVVVPVVVK', '.KVVVVVVVVK.', '..KKVVVVKK.K', '....KKKK..KK']),
  ticket: one(['............', '............', 'KKKKKKKKKKKK', 'KOOOOKOOOOOK', 'KOWWOKOYYYOK', 'KOOOO.OOOOOK', 'KOWWOKOYYOOK', 'KOOOOKOOOOOK', 'KKKKKKKKKKKK']),
  book: ICONS_BOOK(),
  watch: one(['....KKKK....', '....KggK....', '...KKKKKK...', '..KYYYYYYK..', '..KYWWWWYK..', '..KYWKWWYK..', '..KYWKKWYK..', '..KYWWWWYK..', '..KYYYYYYK..', '...KKKKKK...', '....KggK....', '....KKKK....']),
  bottle: one(['....KKK.....', '....KRK.....', '....KLK.....', '...KLLLK....', '..KLLLLLK...', '..KCCCCCK...', '..KCWCCCK...', '..KCWCCCK...', '..KCCCCCK...', '..KCCCCCK...', '..KKKKKKK...']),
  torch: one(['............', '............', '............', 'KKKKKKKK....', 'KggggggKKK..', 'KgggYggKYYK.', 'KggggggKYYYK', 'KggggggKYYK.', 'KKKKKKKKKK..']),
};

function ICONS_KEY(): SpriteDef {
  return ICONS.key;
}
function ICONS_BOOK(): SpriteDef {
  return { frames: ICONS.book.frames, palette: { B: '#B8324A', b: '#7A1F33' } };
}
