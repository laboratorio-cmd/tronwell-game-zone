import type { CategoryItem, SpellItem, ContentBank } from '../../types';

// Draft sample content (not yet reviewed by a Tronwell teacher).
export const bank: ContentBank<CategoryItem | SpellItem> = {
  game: 'word-jumper',
  level: 'A1',
  items: [
    /* ---------- Category missions ---------- */
    {
      id: 'wj-a1-001', kind: 'category', level: 'A1', games: ['word-jumper'], objective: 'Vocabulary: days of the week', category: 'word-categories', difficulty: 1,
      prompt: 'Find the days of the week', correct: ['Monday', 'Wednesday', 'Friday', 'Sunday'], distractors: ['March', 'June', 'summer'],
      feedback: 'Monday, Wednesday, Friday and Sunday are days of the week. March and June are months, and summer is a season. Days and months start with a capital letter in English.',
      tags: ['days', 'time'], status: 'draft',
    },
    {
      id: 'wj-a1-002', kind: 'category', level: 'A1', games: ['word-jumper'], objective: 'Vocabulary: months', category: 'word-categories', difficulty: 1,
      prompt: 'Find the months', correct: ['June', 'August', 'November', 'December'], distractors: ['Tuesday', 'Saturday', 'spring'],
      feedback: 'June, August, November and December are months of the year. Tuesday and Saturday are days of the week, and spring is a season.',
      tags: ['months', 'time'], status: 'draft',
    },
    {
      id: 'wj-a1-003', kind: 'category', level: 'A1', games: ['word-jumper'], objective: 'Vocabulary: school subjects', category: 'word-categories', difficulty: 1,
      prompt: 'Find the school subjects', correct: ['maths', 'history', 'science', 'art'], distractors: ['ruler', 'classroom', 'homework'],
      feedback: 'Maths, history, science and art are school subjects: things you study. A ruler is a school object, a classroom is a room and homework is work you do at home.',
      tags: ['school', 'subjects'], status: 'draft',
    },
    {
      id: 'wj-a1-004', kind: 'category', level: 'A1', games: ['word-jumper'], objective: 'Vocabulary: rooms in a house', category: 'word-categories', difficulty: 1,
      prompt: 'Find the rooms in a house', correct: ['kitchen', 'bedroom', 'bathroom', 'living room'], distractors: ['sofa', 'bed', 'chair'],
      icons: { chair: 'chair' },
      feedback: 'A kitchen, a bedroom, a bathroom and a living room are rooms in a house. A sofa, a bed and a chair are furniture: you find them inside the rooms.',
      tags: ['home', 'rooms'], status: 'draft',
    },
    {
      id: 'wj-a1-005', kind: 'category', level: 'A1', games: ['word-jumper'], objective: 'Vocabulary: sports', category: 'word-categories', difficulty: 1,
      prompt: 'Find the sports', correct: ['football', 'swimming', 'cycling', 'karate'], distractors: ['ball', 'team', 'stadium'],
      icons: { ball: 'ball' },
      feedback: 'Football, swimming, cycling and karate are sports. A ball is sports equipment, a team is a group of players and a stadium is a place where people play and watch sport.',
      tags: ['sports', 'free time'], status: 'draft',
    },
    {
      id: 'wj-a1-006', kind: 'category', level: 'A1', games: ['word-jumper'], objective: 'Vocabulary: jobs', category: 'word-categories', difficulty: 2,
      prompt: 'Find the jobs', correct: ['doctor', 'teacher', 'pilot', 'chef'], distractors: ['hospital', 'school', 'kitchen'],
      feedback: 'A doctor, a teacher, a pilot and a chef are jobs. A hospital, a school and a kitchen are places where people work.',
      tags: ['jobs', 'places'], status: 'draft',
    },
    {
      id: 'wj-a1-007', kind: 'category', level: 'A1', games: ['word-jumper'], objective: 'Vocabulary: places in town', category: 'word-categories', difficulty: 2,
      prompt: 'Find the places in town', correct: ['bank', 'museum', 'post office', 'park'], distractors: ['forest', 'mountain', 'island'],
      feedback: 'A bank, a museum, a post office and a park are places in a town. Forests, mountains and islands are places in nature, outside the town.',
      tags: ['town', 'places'], status: 'draft',
    },
    {
      id: 'wj-a1-008', kind: 'category', level: 'A1', games: ['word-jumper'], objective: 'Vocabulary: transport', category: 'word-categories', difficulty: 2,
      prompt: 'Find the ways to travel', correct: ['bus', 'car', 'train', 'plane'], distractors: ['road', 'ticket', 'station'],
      icons: { bus: 'bus', car: 'car' },
      feedback: 'You can travel by bus, by car, by train or by plane. A road is where cars drive, a ticket is what you buy to travel and a station is where trains stop.',
      tags: ['transport', 'travel'], status: 'draft',
    },
    {
      id: 'wj-a1-009', kind: 'category', level: 'A1', games: ['word-jumper'], objective: 'Vocabulary: furniture', category: 'word-categories', difficulty: 2,
      prompt: 'Find the furniture', correct: ['wardrobe', 'desk', 'armchair', 'bookcase'], distractors: ['cup', 'phone', 'key'],
      icons: { cup: 'cup', phone: 'phone', key: 'key' },
      feedback: 'A wardrobe, a desk, an armchair and a bookcase are furniture: big things in a room. A cup, a phone and a key are small objects, not furniture.',
      tags: ['home', 'furniture'], status: 'draft',
    },
    {
      id: 'wj-a1-010', kind: 'category', level: 'A1', games: ['word-jumper'], objective: 'Vocabulary: feelings', category: 'word-categories', difficulty: 2,
      prompt: 'Find the feelings', correct: ['happy', 'sad', 'angry', 'scared'], distractors: ['tall', 'curly', 'young'],
      feedback: 'Happy, sad, angry and scared describe how you feel. Tall and curly describe what a person looks like, and young describes their age.',
      tags: ['feelings', 'adjectives'], status: 'draft',
    },
    {
      id: 'wj-a1-011', kind: 'category', level: 'A1', games: ['word-jumper'], objective: 'Vocabulary: daily routine', category: 'word-categories', difficulty: 2,
      prompt: 'Find what you do in the morning', correct: ['wake up', 'get up', 'have breakfast'], distractors: ['go to bed', 'have dinner', 'go to sleep'],
      feedback: 'In the morning you wake up, get up and have breakfast. In the evening you have dinner, go to bed and go to sleep.',
      tags: ['daily routine', 'verbs'], status: 'draft',
    },
    {
      id: 'wj-a1-012', kind: 'category', level: 'A1', games: ['word-jumper'], objective: 'Vocabulary: sports', category: 'word-categories', difficulty: 3,
      prompt: 'Find the water sports', correct: ['swimming', 'surfing', 'sailing', 'diving'], distractors: ['cycling', 'running', 'climbing'],
      feedback: 'Swimming, surfing, sailing and diving are water sports: you do them in or on the water. Cycling, running and climbing are sports on land.',
      tags: ['sports', 'water'], status: 'draft',
    },
    {
      id: 'wj-a1-013', kind: 'category', level: 'A1', games: ['word-jumper'], objective: 'Vocabulary: months in order', category: 'word-categories', difficulty: 3,
      prompt: 'Find the months before May', correct: ['January', 'February', 'March', 'April'], distractors: ['May', 'July', 'September'],
      hint: 'May is the fifth month.',
      feedback: 'January, February, March and April are the first four months, so they come before May. May is not before May, and July and September come later in the year.',
      tags: ['months', 'time'], status: 'draft',
    },
    {
      id: 'wj-a1-014', kind: 'category', level: 'A1', games: ['word-jumper'], objective: 'Vocabulary: shops', category: 'word-categories', difficulty: 3,
      prompt: 'Find the shops', correct: ['bakery', 'bookshop', 'supermarket', "chemist's"], distractors: ['library', 'park', 'hospital'],
      hint: 'Where do you pay for things?',
      feedback: "A bakery, a bookshop, a supermarket and a chemist's are shops: you buy things there. A library lends books for free, and a park and a hospital aren't shops. Careful: in Spanish, a 'librería' is a bookshop, not a library!",
      tags: ['town', 'shopping'], status: 'draft',
    },
    {
      id: 'wj-a1-015', kind: 'category', level: 'A1', games: ['word-jumper'], objective: 'Vocabulary: sports', category: 'word-categories', difficulty: 3,
      prompt: 'Find the sports with a ball', correct: ['tennis', 'basketball', 'volleyball', 'golf'], distractors: ['swimming', 'skating', 'running'],
      feedback: "You play tennis, basketball, volleyball and golf with a ball. Swimming, skating and running are sports too, but you don't need a ball.",
      tags: ['sports', 'free time'], status: 'draft',
    },

    /* ---------- Spelling missions ---------- */
    {
      id: 'wj-a1-016', kind: 'spell', level: 'A1', games: ['word-jumper'], objective: 'Spelling: transport', category: 'spelling', difficulty: 1,
      clue: "Look at the picture! It's big and takes lots of people to school or work.", word: 'bus', decoys: 'vao', asset: { image: 'icon:bus' },
      feedback: 'A bus carries lots of passengers. Spelling: b-u-s, with b (not v) and only one s.',
      tags: ['transport', 'town'], status: 'draft',
    },
    {
      id: 'wj-a1-017', kind: 'spell', level: 'A1', games: ['word-jumper'], objective: 'Spelling: home', category: 'spelling', difficulty: 1,
      clue: 'Look at the picture! A family lives in this building.', word: 'house', decoys: 'awz', asset: { image: 'icon:house' },
      feedback: 'A house is a building where people live. Spelling: h-o-u-s-e. The sound /au/ is written ou, and the e at the end is silent.',
      tags: ['home', 'buildings'], status: 'draft',
    },
    {
      id: 'wj-a1-018', kind: 'spell', level: 'A1', games: ['word-jumper'], objective: 'Spelling: home', category: 'spelling', difficulty: 1,
      clue: 'Look at the picture! You use it to open or lock a door.', word: 'key', decoys: 'iac', asset: { image: 'icon:key' },
      feedback: "You open a door with a key. Spelling: k-e-y. It sounds like 'kee', but the end is written ey.",
      tags: ['home', 'objects'], status: 'draft',
    },
    {
      id: 'wj-a1-019', kind: 'spell', level: 'A1', games: ['word-jumper'], objective: 'Spelling: feelings', category: 'spelling', difficulty: 1,
      clue: 'The opposite of sad. You feel like this at a great party!', word: 'happy', decoys: 'jie',
      feedback: 'Happy is the opposite of sad. Spelling: h-a-p-p-y, with double p and a y at the end.',
      tags: ['feelings', 'adjectives'], status: 'draft',
    },
    {
      id: 'wj-a1-020', kind: 'spell', level: 'A1', games: ['word-jumper'], objective: 'Spelling: transport', category: 'spelling', difficulty: 1,
      clue: 'It has lots of carriages and runs on rails from city to city.', word: 'train', decoys: 'eyo',
      feedback: "A train runs on rails. Spelling: t-r-a-i-n. The 'ay' sound is written ai, like in 'rain'.",
      tags: ['transport', 'travel'], status: 'draft',
    },
    {
      id: 'wj-a1-021', kind: 'spell', level: 'A1', games: ['word-jumper'], objective: 'Spelling: daily routine', category: 'spelling', difficulty: 2,
      clue: "Look at the picture! It's on the wall and it shows the time.", word: 'clock', decoys: 'aue', asset: { image: 'icon:clock' },
      feedback: 'A clock shows the time. Spelling: c-l-o-c-k. The /k/ sound at the end is written ck.',
      tags: ['time', 'objects'], status: 'draft',
    },
    {
      id: 'wj-a1-022', kind: 'spell', level: 'A1', games: ['word-jumper'], objective: 'Spelling: everyday objects', category: 'spelling', difficulty: 2,
      clue: 'Look at the picture! You use it to call or text your friends.', word: 'phone', decoys: 'fua', asset: { image: 'icon:phone' },
      feedback: 'You call people on your phone. Spelling: p-h-o-n-e. The /f/ sound is written ph, and the e at the end is silent.',
      tags: ['objects', 'technology'], status: 'draft',
    },
    {
      id: 'wj-a1-023', kind: 'spell', level: 'A1', games: ['word-jumper'], objective: 'Spelling: school subjects', category: 'spelling', difficulty: 2,
      clue: 'The school subject with numbers, sums and shapes.', word: 'maths', decoys: 'eoi',
      feedback: "Maths is the subject with numbers. In British English we say 'maths', with an s at the end: m-a-t-h-s.",
      tags: ['school', 'subjects'], status: 'draft',
    },
    {
      id: 'wj-a1-024', kind: 'spell', level: 'A1', games: ['word-jumper'], objective: 'Spelling: rooms', category: 'spelling', difficulty: 2,
      clue: 'The room in a house where you cook.', word: 'kitchen', decoys: 'sau',
      feedback: "You cook in the kitchen. Spelling: k-i-t-c-h-e-n. Don't forget the t before ch: kit-chen.",
      tags: ['home', 'rooms'], status: 'draft',
    },
    {
      id: 'wj-a1-025', kind: 'spell', level: 'A1', games: ['word-jumper'], objective: 'Spelling: feelings', category: 'spelling', difficulty: 2,
      clue: 'How you feel after a long day, when you want to sleep.', word: 'tired', decoys: 'ayu',
      feedback: "When you need to sleep, you feel tired. Spelling: t-i-r-e-d. The i says its name, like in 'fire'.",
      tags: ['feelings', 'adjectives'], status: 'draft',
    },
    {
      id: 'wj-a1-026', kind: 'spell', level: 'A1', games: ['word-jumper'], objective: 'Spelling: places in town', category: 'spelling', difficulty: 2,
      clue: 'The place in town where you watch films on a big screen.', word: 'cinema', decoys: 'sko',
      feedback: 'You watch films at the cinema. Spelling: c-i-n-e-m-a. It starts with c, not s, and ends with a.',
      tags: ['town', 'places'], status: 'draft',
    },
    {
      id: 'wj-a1-027', kind: 'spell', level: 'A1', games: ['word-jumper'], objective: 'Spelling: transport', category: 'spelling', difficulty: 3,
      clue: 'Look at the picture! It blasts off from Earth and flies into space.', word: 'rocket', decoys: 'aiu', asset: { image: 'icon:rocket' },
      feedback: 'A rocket flies into space. Spelling: r-o-c-k-e-t. The /k/ sound in the middle is written ck.',
      tags: ['transport', 'space'], status: 'draft',
    },
    {
      id: 'wj-a1-028', kind: 'spell', level: 'A1', games: ['word-jumper'], objective: 'Spelling: days of the week', category: 'spelling', difficulty: 3,
      clue: 'The day after Tuesday and before Thursday.', word: 'wednesday', decoys: 'iou',
      hint: 'One letter is silent: we say "Wenz-day".',
      feedback: "Wednesday is the day in the middle of the school week. Spelling: w-e-d-n-e-s-d-a-y. The first d is silent: we say 'Wenz-day'. Remember to write days with a capital letter.",
      tags: ['days', 'time'], status: 'draft',
    },
    {
      id: 'wj-a1-029', kind: 'spell', level: 'A1', games: ['word-jumper'], objective: 'Spelling: places in town', category: 'spelling', difficulty: 3,
      clue: 'A place where you can borrow books for free.', word: 'library', decoys: 'evo',
      feedback: "You borrow books from a library. Spelling: l-i-b-r-a-r-y, with -rary at the end. Careful: a 'librería' in Spanish is a bookshop!",
      tags: ['town', 'places'], status: 'draft',
    },
    {
      id: 'wj-a1-030', kind: 'spell', level: 'A1', games: ['word-jumper'], objective: 'Spelling: daily routine', category: 'spelling', difficulty: 3,
      clue: 'The first meal of the day, in the morning.', word: 'breakfast', decoys: 'vio',
      feedback: "Breakfast is your morning meal. Spelling: b-r-e-a-k-f-a-s-t. It comes from 'break' + 'fast', but we say 'brek-fast'.",
      tags: ['daily routine', 'food'], status: 'draft',
    },
  ],
};
