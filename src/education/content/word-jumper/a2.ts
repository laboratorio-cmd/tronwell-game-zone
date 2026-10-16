import type { CategoryItem, SpellItem, ContentBank } from '../../types';

// Draft sample content (not yet reviewed by a Tronwell teacher).
export const bank: ContentBank<CategoryItem | SpellItem> = {
  game: 'word-jumper',
  level: 'A2',
  items: [
    /* ---------- Category missions ---------- */
    {
      id: 'wj-a2-001', kind: 'category', level: 'A2', games: ['word-jumper'], objective: 'Vocabulary: film genres', category: 'word-categories', difficulty: 1,
      prompt: 'Find the film genres', correct: ['comedy', 'horror', 'sci-fi', 'thriller'], distractors: ['actor', 'cinema', 'ticket'],
      feedback: 'Comedy, horror, sci-fi and thriller are film genres (types of film). An actor is a person, a cinema is a place and a ticket is what you buy to see the film.',
      tags: ['films', 'entertainment'], status: 'draft',
    },
    {
      id: 'wj-a2-002', kind: 'category', level: 'A2', games: ['word-jumper'], objective: 'Vocabulary: materials', category: 'word-categories', difficulty: 1,
      prompt: 'Find the materials', correct: ['metal', 'plastic', 'glass', 'paper'], distractors: ['table', 'bottle', 'window'],
      feedback: 'Metal, plastic, glass and paper are materials: what things are made of. A table, a bottle and a window are objects made from materials.',
      tags: ['materials', 'objects'], status: 'draft',
    },
    {
      id: 'wj-a2-003', kind: 'category', level: 'A2', games: ['word-jumper'], objective: 'Vocabulary: technology', category: 'word-categories', difficulty: 1,
      prompt: 'Find the gadgets', correct: ['laptop', 'tablet', 'smartphone', 'smartwatch'], distractors: ['website', 'app', 'email'],
      feedback: 'A laptop, a tablet, a smartphone and a smartwatch are gadgets: electronic devices you can hold. A website, an app and an email are things you use on a gadget, not devices.',
      tags: ['technology', 'gadgets'], status: 'draft',
    },
    {
      id: 'wj-a2-004', kind: 'category', level: 'A2', games: ['word-jumper'], objective: 'Vocabulary: nature and geography', category: 'word-categories', difficulty: 1,
      prompt: 'Find the things made by people', correct: ['bridge', 'motorway', 'factory', 'tower'], distractors: ['river', 'forest', 'cave'],
      feedback: 'Bridges, motorways, factories and towers are made by people. Rivers, forests and caves are natural: nature made them.',
      tags: ['nature', 'geography'], status: 'draft',
    },
    {
      id: 'wj-a2-005', kind: 'category', level: 'A2', games: ['word-jumper'], objective: 'Vocabulary: personality adjectives', category: 'word-categories', difficulty: 1,
      prompt: 'Find the personality adjectives', correct: ['friendly', 'shy', 'funny', 'confident'], distractors: ['tall', 'curly', 'slim'],
      feedback: 'Friendly, shy, funny and confident describe personality: what someone is like inside. Tall, curly and slim describe what someone looks like.',
      tags: ['personality', 'adjectives'], status: 'draft',
    },
    {
      id: 'wj-a2-006', kind: 'category', level: 'A2', games: ['word-jumper'], objective: 'Vocabulary: health', category: 'word-categories', difficulty: 2,
      prompt: 'Find the health problems', correct: ['headache', 'fever', 'sore throat', 'earache'], distractors: ['plaster', 'painkiller', 'pharmacy'],
      feedback: 'A headache, a fever, a sore throat and earache are health problems. A plaster and a painkiller help you get better, and a pharmacy is where you buy them.',
      tags: ['health', 'illness'], status: 'draft',
    },
    {
      id: 'wj-a2-007', kind: 'category', level: 'A2', games: ['word-jumper'], objective: 'Vocabulary: shopping', category: 'word-categories', difficulty: 2,
      prompt: 'Find what you can pay with', correct: ['cash', 'coins', 'credit card'], distractors: ['price', 'discount', 'shopping bag'],
      feedback: 'You can pay with cash, coins or a credit card. The price is how much something costs, a discount makes it cheaper and a shopping bag is for carrying things.',
      tags: ['shopping', 'money'], status: 'draft',
    },
    {
      id: 'wj-a2-008', kind: 'category', level: 'A2', games: ['word-jumper'], objective: 'Vocabulary: travel', category: 'word-categories', difficulty: 2,
      prompt: 'Find the words about flying', correct: ['check-in', 'boarding pass', 'runway', 'take-off'], distractors: ['carriage', 'railway', 'platform'],
      feedback: 'Check-in, a boarding pass, the runway and take-off are all about flying. A carriage, a railway and a platform are words for trains.',
      tags: ['travel', 'transport'], status: 'draft',
    },
    {
      id: 'wj-a2-009', kind: 'category', level: 'A2', games: ['word-jumper'], objective: 'Vocabulary: past time expressions', category: 'word-categories', difficulty: 2,
      prompt: 'Find the past time expressions', correct: ['yesterday', 'last week', 'two days ago', 'last summer'], distractors: ['tomorrow', 'next week', 'in two days'],
      feedback: 'Yesterday, last week, two days ago and last summer talk about the past (use the past simple). Tomorrow, next week and in two days talk about the future.',
      tags: ['time', 'past simple'], status: 'draft',
    },
    {
      id: 'wj-a2-010', kind: 'category', level: 'A2', games: ['word-jumper'], objective: 'Vocabulary: TV programmes', category: 'word-categories', difficulty: 2,
      prompt: 'Find the types of TV show', correct: ['the news', 'quiz show', 'soap opera', 'talent show'], distractors: ['remote control', 'channel', 'screen'],
      feedback: "The news, a quiz show, a soap opera and a talent show are types of TV programme. A remote control, a channel and a screen are TV words, but they aren't types of show.",
      tags: ['tv', 'entertainment'], status: 'draft',
    },
    {
      id: 'wj-a2-011', kind: 'category', level: 'A2', games: ['word-jumper'], objective: 'Vocabulary: personality adjectives', category: 'word-categories', difficulty: 2,
      prompt: 'Find the negative personality words', correct: ['rude', 'selfish', 'lazy', 'mean'], distractors: ['kind', 'honest', 'polite'],
      feedback: 'Rude, selfish, lazy and mean are negative personality words. Kind, honest and polite are positive qualities.',
      tags: ['personality', 'adjectives'], status: 'draft',
    },
    {
      id: 'wj-a2-012', kind: 'category', level: 'A2', games: ['word-jumper'], objective: 'Vocabulary: adverbs of frequency', category: 'word-categories', difficulty: 3,
      prompt: 'Find the adverbs of frequency', correct: ['always', 'usually', 'sometimes', 'never'], distractors: ['quickly', 'already', 'yesterday'],
      hint: 'They answer the question "How often?"',
      feedback: 'Always, usually, sometimes and never tell you how often something happens. Quickly tells you how, and already and yesterday tell you when.',
      tags: ['adverbs', 'time'], status: 'draft',
    },
    {
      id: 'wj-a2-013', kind: 'category', level: 'A2', games: ['word-jumper'], objective: 'Vocabulary: materials', category: 'word-categories', difficulty: 3,
      prompt: 'Find the natural materials', correct: ['wood', 'cotton', 'wool', 'leather'], distractors: ['plastic', 'nylon', 'polyester'],
      feedback: 'Wood, cotton, wool and leather come from plants and animals, so they are natural. Plastic, nylon and polyester are made in factories, usually from oil.',
      tags: ['materials', 'nature'], status: 'draft',
    },
    {
      id: 'wj-a2-014', kind: 'category', level: 'A2', games: ['word-jumper'], objective: 'Vocabulary: nature and geography', category: 'word-categories', difficulty: 3,
      prompt: 'Find the words for water in nature', correct: ['ocean', 'lake', 'river', 'waterfall'], distractors: ['desert', 'mountain', 'volcano'],
      feedback: 'An ocean, a lake, a river and a waterfall are water in nature. A desert, a mountain and a volcano are kinds of land.',
      tags: ['nature', 'geography'], status: 'draft',
    },
    {
      id: 'wj-a2-015', kind: 'category', level: 'A2', games: ['word-jumper'], objective: 'Vocabulary: health', category: 'word-categories', difficulty: 3,
      prompt: 'Find the healthy habits', correct: ['drink water', 'sleep well', 'eat fruit', 'exercise'], distractors: ['skip meals', 'eat junk food', 'stay up late'],
      feedback: 'Drinking water, sleeping well, eating fruit and exercising are healthy habits. Skipping meals, eating junk food and staying up late are bad for your health.',
      tags: ['health', 'lifestyle'], status: 'draft',
    },

    /* ---------- Spelling missions ---------- */
    {
      id: 'wj-a2-016', kind: 'spell', level: 'A2', games: ['word-jumper'], objective: 'Spelling: shopping', category: 'spelling', difficulty: 1,
      clue: "The opposite of expensive. It doesn't cost much money.", word: 'cheap', decoys: 'isk',
      feedback: "Something cheap doesn't cost much. Spelling: c-h-e-a-p. The long 'ee' sound is written ea, like in 'eat'.",
      tags: ['shopping', 'adjectives'], status: 'draft',
    },
    {
      id: 'wj-a2-017', kind: 'spell', level: 'A2', games: ['word-jumper'], objective: 'Spelling: film and TV', category: 'spelling', difficulty: 1,
      clue: 'A film or TV programme made with drawings that move.', word: 'cartoon', decoys: 'kue',
      feedback: 'A cartoon is a film made with moving drawings. Spelling: c-a-r-t-o-o-n, with double o at the end.',
      tags: ['films', 'tv'], status: 'draft',
    },
    {
      id: 'wj-a2-018', kind: 'spell', level: 'A2', games: ['word-jumper'], objective: 'Spelling: technology', category: 'spelling', difficulty: 1,
      clue: 'The secret code you type to get into your account.', word: 'password', decoys: 'eiu',
      feedback: "A password keeps your account safe. Spelling: it's pass + word, so it has double s: p-a-s-s-w-o-r-d.",
      tags: ['technology', 'internet'], status: 'draft',
    },
    {
      id: 'wj-a2-019', kind: 'spell', level: 'A2', games: ['word-jumper'], objective: 'Spelling: technology', category: 'spelling', difficulty: 1,
      clue: 'A device for taking photos. Most phones have one too.', word: 'camera', decoys: 'kio',
      feedback: 'You take photos with a camera. Spelling: c-a-m-e-r-a. It starts with c, not k.',
      tags: ['technology', 'photos'], status: 'draft',
    },
    {
      id: 'wj-a2-020', kind: 'spell', level: 'A2', games: ['word-jumper'], objective: 'Spelling: nature and travel', category: 'spelling', difficulty: 1,
      clue: 'The sandy place next to the sea where you swim and sunbathe.', word: 'beach', decoys: 'vsu',
      feedback: "A beach is the sand next to the sea. Spelling: b-e-a-c-h. The long 'ee' sound is written ea, like in 'sea'.",
      tags: ['nature', 'holidays'], status: 'draft',
    },
    {
      id: 'wj-a2-021', kind: 'spell', level: 'A2', games: ['word-jumper'], objective: 'Spelling: personality adjectives', category: 'spelling', difficulty: 2,
      clue: 'Describes someone who loves giving and sharing things with others.', word: 'generous', decoys: 'jai',
      feedback: "A generous person likes giving. Spelling: g-e-n-e-r-o-u-s. It starts with g (not j) and ends in -ous, like 'famous'.",
      tags: ['personality', 'adjectives'], status: 'draft',
    },
    {
      id: 'wj-a2-022', kind: 'spell', level: 'A2', games: ['word-jumper'], objective: 'Spelling: personality adjectives', category: 'spelling', difficulty: 2,
      clue: 'Describes a person who always tells the truth.', word: 'honest', decoys: 'aiu',
      feedback: "An honest person tells the truth. Spelling: h-o-n-e-s-t. The h is silent, so we say 'an honest person', not 'a honest person'.",
      tags: ['personality', 'adjectives'], status: 'draft',
    },
    {
      id: 'wj-a2-023', kind: 'spell', level: 'A2', games: ['word-jumper'], objective: 'Spelling: health', category: 'spelling', difficulty: 2,
      clue: "You take this when you're ill, to help you get better.", word: 'medicine', decoys: 'sao',
      feedback: 'Medicine helps you get better. Spelling: m-e-d-i-c-i-n-e. The /s/ sound is written c: medi-cine.',
      tags: ['health', 'illness'], status: 'draft',
    },
    {
      id: 'wj-a2-024', kind: 'spell', level: 'A2', games: ['word-jumper'], objective: 'Spelling: nature and geography', category: 'spelling', difficulty: 2,
      clue: 'A very dry place with lots of sand and little rain, like the Atacama.', word: 'desert', decoys: 'zai',
      feedback: "The Atacama in Chile is a desert. Spelling: d-e-s-e-r-t, with one s. Dessert, with double s, is the sweet food after a meal!",
      tags: ['nature', 'geography'], status: 'draft',
    },
    {
      id: 'wj-a2-025', kind: 'spell', level: 'A2', games: ['word-jumper'], objective: 'Spelling: travel', category: 'spelling', difficulty: 2,
      clue: 'A small book with your photo. You need it to travel abroad.', word: 'passport', decoys: 'eiu',
      feedback: 'You show your passport when you travel to another country. Spelling: pass + port, so it has double s.',
      tags: ['travel', 'holidays'], status: 'draft',
    },
    {
      id: 'wj-a2-026', kind: 'spell', level: 'A2', games: ['word-jumper'], objective: 'Spelling: materials', category: 'spelling', difficulty: 2,
      clue: 'A shiny grey metal. In a race, second place wins a medal made of it.', word: 'silver', decoys: 'bao',
      feedback: 'Silver is a shiny grey metal: gold is for first place and silver is for second. Spelling: s-i-l-v-e-r, with v, not b.',
      tags: ['materials', 'metals'], status: 'draft',
    },
    {
      id: 'wj-a2-027', kind: 'spell', level: 'A2', games: ['word-jumper'], objective: 'Spelling: health', category: 'spelling', difficulty: 3,
      clue: 'You do this when you have a cold and your throat hurts. Cover your mouth!', word: 'cough', decoys: 'fak',
      hint: 'The end of the word sounds like f, but there is no f.',
      feedback: "When you have a cold, you cough. Spelling: c-o-u-g-h. The gh at the end sounds like f: we say 'cof'.",
      tags: ['health', 'illness'], status: 'draft',
    },
    {
      id: 'wj-a2-028', kind: 'spell', level: 'A2', games: ['word-jumper'], objective: 'Spelling: shopping', category: 'spelling', difficulty: 3,
      clue: 'The piece of paper a shop gives you after you pay.', word: 'receipt', decoys: 'sao',
      hint: 'One letter is silent.',
      feedback: 'A receipt shows what you paid. Spelling: r-e-c-e-i-p-t. The p is silent, and it is e before i after c.',
      tags: ['shopping', 'silent letters'], status: 'draft',
    },
    {
      id: 'wj-a2-029', kind: 'spell', level: 'A2', games: ['word-jumper'], objective: 'Spelling: nature and geography', category: 'spelling', difficulty: 3,
      clue: 'Land with sea all around it, like Rapa Nui.', word: 'island', decoys: 'eyt',
      hint: 'One letter is silent.',
      feedback: "An island has water all around it. Spelling: i-s-l-a-n-d. The s is silent: we say 'eye-land'.",
      tags: ['nature', 'geography'], status: 'draft',
    },
    {
      id: 'wj-a2-030', kind: 'spell', level: 'A2', games: ['word-jumper'], objective: 'Spelling: time expressions', category: 'spelling', difficulty: 3,
      clue: 'The day after today.', word: 'tomorrow', decoys: 'eau',
      feedback: 'Tomorrow is the day after today. Spelling: t-o-m-o-r-r-o-w, with one m and double r.',
      tags: ['time', 'double letters'], status: 'draft',
    },
  ],
};
