import type { CategoryItem, SpellItem, ContentBank } from '../../types';

// Draft sample content (not yet reviewed by a Tronwell teacher).
export const bank: ContentBank<CategoryItem | SpellItem> = {
  game: 'word-jumper',
  level: 'B2',
  items: [
    /* ---------- Category missions ---------- */
    {
      id: 'wj-b2-001', kind: 'category', level: 'B2', games: ['word-jumper'], objective: 'Vocabulary: abstract nouns', category: 'word-categories', difficulty: 1,
      prompt: 'Find the abstract nouns', correct: ['freedom', 'honesty', 'courage', 'happiness'], distractors: ['laptop', 'river', 'bicycle'],
      feedback: "Freedom, honesty, courage and happiness are abstract nouns: ideas and qualities you can't see or touch. A laptop, a river and a bicycle are concrete nouns: you can see and touch them.",
      tags: ['nouns', 'abstract nouns'], status: 'draft',
    },
    {
      id: 'wj-b2-002', kind: 'category', level: 'B2', games: ['word-jumper'], objective: 'Word formation: -ment nouns', category: 'word-categories', difficulty: 1,
      prompt: 'Find the nouns ending in -ment', correct: ['movement', 'agreement', 'payment', 'development'], distractors: ['kindness', 'decision', 'ability'],
      feedback: 'Movement, agreement, payment and development are nouns made with -ment (move, agree, pay, develop). Kindness uses -ness, decision uses -ion and ability uses -ity.',
      tags: ['word formation', 'nouns'], status: 'draft',
    },
    {
      id: 'wj-b2-003', kind: 'category', level: 'B2', games: ['word-jumper'], objective: 'Register: informal words', category: 'word-categories', difficulty: 1,
      prompt: 'Find the informal words', correct: ['kids', 'mate', 'cool', 'stuff'], distractors: ['children', 'purchase', 'assistance'],
      feedback: 'Kids, mate, cool and stuff are informal: we use them when we chat with friends. Children, purchase and assistance are more formal words, used in writing or with people we don\'t know.',
      tags: ['register', 'formal-informal'], status: 'draft',
    },
    {
      id: 'wj-b2-004', kind: 'category', level: 'B2', games: ['word-jumper'], objective: 'Vocabulary: science and space', category: 'word-categories', difficulty: 1,
      prompt: 'Find the planets', correct: ['Mars', 'Venus', 'Jupiter', 'Neptune'], distractors: ['Moon', 'Sun', 'comet'],
      feedback: 'Mars, Venus, Jupiter and Neptune are planets in our solar system. The Moon is a natural satellite, the Sun is a star and a comet is a ball of ice and dust.',
      tags: ['space', 'science'], status: 'draft',
    },
    {
      id: 'wj-b2-005', kind: 'category', level: 'B2', games: ['word-jumper'], objective: 'Synonyms: big', category: 'word-categories', difficulty: 1,
      prompt: "Find the synonyms of 'very big'", correct: ['huge', 'enormous', 'vast', 'massive'], distractors: ['tiny', 'minor', 'slight'],
      feedback: 'Huge, enormous, vast and massive all mean very big. Tiny means very small, and minor and slight mean small or not important.',
      tags: ['synonyms', 'adjectives'], status: 'draft',
    },
    {
      id: 'wj-b2-006', kind: 'category', level: 'B2', games: ['word-jumper'], objective: 'Register: formal words', category: 'word-categories', difficulty: 2,
      prompt: 'Find the formal words', correct: ['obtain', 'require', 'commence', 'enquire'], distractors: ['get', 'need', 'start'],
      feedback: 'Obtain, require, commence and enquire are formal verbs used in official letters and notices. Get, need and start are the everyday words with the same meaning (obtain = get, require = need, commence = start).',
      tags: ['register', 'formal-informal'], status: 'draft',
    },
    {
      id: 'wj-b2-007', kind: 'category', level: 'B2', games: ['word-jumper'], objective: "Synonyms: ways of looking", category: 'word-categories', difficulty: 2,
      prompt: 'Find the ways of looking', correct: ['stare', 'glance', 'peer', 'gaze'], distractors: ['whisper', 'shout', 'mutter'],
      feedback: 'Stare (look for a long time), glance (look quickly), peer (look closely at something hard to see) and gaze (look for a long time, often dreamily) are ways of looking. Whisper, shout and mutter are ways of speaking.',
      tags: ['synonyms', 'verbs'], status: 'draft',
    },
    {
      id: 'wj-b2-008', kind: 'category', level: 'B2', games: ['word-jumper'], objective: "Synonyms: ways of saying", category: 'word-categories', difficulty: 2,
      prompt: "Find other verbs for 'say'", correct: ['murmur', 'yell', 'exclaim', 'announce'], distractors: ['glance', 'peek', 'glimpse'],
      feedback: 'Murmur (say quietly), yell (say very loudly), exclaim (say suddenly, with emotion) and announce (say officially to everyone) are ways of saying something. Glance, peek and glimpse are ways of looking.',
      tags: ['synonyms', 'verbs'], status: 'draft',
    },
    {
      id: 'wj-b2-009', kind: 'category', level: 'B2', games: ['word-jumper'], objective: 'Vocabulary: science', category: 'word-categories', difficulty: 2,
      prompt: 'Find the scientific instruments', correct: ['telescope', 'microscope', 'thermometer', 'compass'], distractors: ['laboratory', 'experiment', 'research'],
      feedback: 'A telescope, a microscope, a thermometer and a compass are scientific instruments: tools for observing or measuring. A laboratory is a place, an experiment is a test and research is the work scientists do.',
      tags: ['science', 'equipment'], status: 'draft',
    },
    {
      id: 'wj-b2-010', kind: 'category', level: 'B2', games: ['word-jumper'], objective: 'Vocabulary: careers', category: 'word-categories', difficulty: 2,
      prompt: 'Find the jobs in medicine', correct: ['surgeon', 'nurse', 'paramedic', 'pharmacist'], distractors: ['architect', 'lawyer', 'engineer'],
      feedback: 'Surgeons, nurses, paramedics and pharmacists work in medicine and health care. Architects design buildings, lawyers work with the law and engineers design machines and structures.',
      tags: ['careers', 'jobs'], status: 'draft',
    },
    {
      id: 'wj-b2-011', kind: 'category', level: 'B2', games: ['word-jumper'], objective: 'Vocabulary: science', category: 'word-categories', difficulty: 2,
      prompt: 'Find the states of matter', correct: ['solid', 'liquid', 'gas', 'plasma'], distractors: ['atom', 'molecule', 'energy'],
      feedback: 'Solid, liquid, gas and plasma are states of matter: the forms that matter can take. Atoms and molecules are the tiny pieces that matter is made of, and energy is not a state of matter.',
      tags: ['science', 'physics'], status: 'draft',
    },
    {
      id: 'wj-b2-012', kind: 'category', level: 'B2', games: ['word-jumper'], objective: 'Vocabulary: careers and skills', category: 'word-categories', difficulty: 3,
      prompt: 'Find the soft skills', correct: ['teamwork', 'leadership', 'communication', 'creativity'], distractors: ['coding', 'accounting', 'video editing'],
      hint: 'Soft skills are personal skills you can use in any job.',
      feedback: 'Teamwork, leadership, communication and creativity are soft skills: personal skills that help you in any job. Coding, accounting and video editing are hard skills: technical skills for particular jobs.',
      tags: ['careers', 'skills'], status: 'draft',
    },
    {
      id: 'wj-b2-013', kind: 'category', level: 'B2', games: ['word-jumper'], objective: 'Word formation: negative prefixes', category: 'word-categories', difficulty: 3,
      prompt: 'Find the words with a negative prefix', correct: ['impossible', 'dishonest', 'unfair', 'irregular'], distractors: ['important', 'uniform', 'display'],
      hint: 'Can you take off the start and get the opposite word?',
      feedback: 'Impossible, dishonest, unfair and irregular have negative prefixes: im-, dis-, un- and ir- mean "not" (unfair = not fair). In important, uniform and display, the first letters are not a negative prefix: "portant", "iform" and "play" are not opposites.',
      tags: ['word formation', 'prefixes'], status: 'draft',
    },
    {
      id: 'wj-b2-014', kind: 'category', level: 'B2', games: ['word-jumper'], objective: 'Word formation: verbs and nouns', category: 'word-categories', difficulty: 3,
      prompt: 'Find the verbs (not the nouns)', correct: ['criticise', 'strengthen', 'widen', 'simplify'], distractors: ['criticism', 'strength', 'width', 'simplicity'],
      feedback: 'Criticise, strengthen, widen and simplify are verbs: the endings -ise, -en and -ify often make verbs. Criticism, strength, width and simplicity are the nouns from the same families.',
      tags: ['word formation', 'verbs'], status: 'draft',
    },
    {
      id: 'wj-b2-015', kind: 'category', level: 'B2', games: ['word-jumper'], objective: 'Vocabulary: careers', category: 'word-categories', difficulty: 3,
      prompt: 'Find the words about applying for a job', correct: ['CV', 'interview', 'application', 'reference'], distractors: ['retirement', 'resignation', 'pension'],
      feedback: 'A CV, an interview, an application and a reference are all part of applying for a job. Retirement, resignation and a pension are about leaving work.',
      tags: ['careers', 'work'], status: 'draft',
    },

    /* ---------- Spelling missions: commonly misspelt words ---------- */
    {
      id: 'wj-b2-016', kind: 'spell', level: 'B2', games: ['word-jumper'], objective: 'Spelling: commonly misspelt words', category: 'spelling', difficulty: 1,
      clue: "To think that something is true: 'I can't ___ we won the final!'", word: 'believe', decoys: 'aso',
      feedback: "Believe means think something is true. Spelling: b-e-l-i-e-v-e, with i before e. Tip: never believe a lie: be-LIE-ve.",
      tags: ['spelling', 'ie-ei'], status: 'draft',
    },
    {
      id: 'wj-b2-017', kind: 'spell', level: 'B2', games: ['word-jumper'], objective: 'Spelling: commonly misspelt words', category: 'spelling', difficulty: 1,
      clue: 'Where someone lives: number, street and town. You write it on an envelope.', word: 'address', decoys: 'ciz',
      feedback: "Your address tells people where you live. Spelling: a-d-d-r-e-s-s, with double d and double s. Many learners write 'adress': don't!",
      tags: ['spelling', 'double letters'], status: 'draft',
    },
    {
      id: 'wj-b2-018', kind: 'spell', level: 'B2', games: ['word-jumper'], objective: 'Spelling: commonly misspelt words', category: 'spelling', difficulty: 1,
      clue: "From another country: 'Do you speak a ___ language?'", word: 'foreign', decoys: 'uah',
      feedback: 'Foreign means from another country. Spelling: f-o-r-e-i-g-n. It breaks the "i before e" rule, and the g is silent.',
      tags: ['spelling', 'silent letters'], status: 'draft',
    },
    {
      id: 'wj-b2-019', kind: 'spell', level: 'B2', games: ['word-jumper'], objective: 'Spelling: commonly misspelt words', category: 'spelling', difficulty: 1,
      clue: 'Very strange or unusual.', word: 'weird', decoys: 'aoy',
      feedback: 'Weird means very strange. Spelling: w-e-i-r-d. It is weird because it breaks the "i before e" rule!',
      tags: ['spelling', 'ie-ei'], status: 'draft',
    },
    {
      id: 'wj-b2-020', kind: 'spell', level: 'B2', games: ['word-jumper'], objective: 'Spelling: science and space', category: 'spelling', difficulty: 1,
      clue: 'The force that pulls things down and keeps the Moon in orbit around Earth.', word: 'gravity', decoys: 'beo',
      feedback: 'Gravity pulls everything towards the ground and keeps planets in orbit. Spelling: g-r-a-v-i-t-y, with v (not b) and y at the end.',
      tags: ['science', 'space'], status: 'draft',
    },
    {
      id: 'wj-b2-021', kind: 'spell', level: 'B2', games: ['word-jumper'], objective: 'Spelling: commonly misspelt words', category: 'spelling', difficulty: 2,
      clue: 'Needed: something you must have or must do.', word: 'necessary', decoys: 'iou',
      hint: 'One c, two s.',
      feedback: "Necessary means needed. Spelling: n-e-c-e-s-s-a-r-y. Tip: a shirt has one collar and two sleeves, so it's one c and two s's.",
      tags: ['spelling', 'double letters'], status: 'draft',
    },
    {
      id: 'wj-b2-022', kind: 'spell', level: 'B2', games: ['word-jumper'], objective: 'Spelling: commonly misspelt words', category: 'spelling', difficulty: 2,
      clue: "Apart, not joined together: 'Please put the papers in two ___ piles.'", word: 'separate', decoys: 'oiu',
      feedback: "Separate means apart. Spelling: s-e-p-a-r-a-t-e, not 'seperate'. Tip: there's 'a rat' in sep-a-rat-e!",
      tags: ['spelling', 'commonly misspelt'], status: 'draft',
    },
    {
      id: 'wj-b2-023', kind: 'spell', level: 'B2', games: ['word-jumper'], objective: 'Spelling: commonly misspelt words', category: 'spelling', difficulty: 2,
      clue: 'To get something that someone sends or gives you, like a letter or a prize.', word: 'receive', decoys: 'sab',
      feedback: 'When someone sends you a message, you receive it. Spelling: r-e-c-e-i-v-e. The rule is "i before e, except after c": rec-ei-ve.',
      tags: ['spelling', 'ie-ei'], status: 'draft',
    },
    {
      id: 'wj-b2-024', kind: 'spell', level: 'B2', games: ['word-jumper'], objective: 'Spelling: commonly misspelt words', category: 'spelling', difficulty: 2,
      clue: 'What you learn and understand from study and experience.', word: 'knowledge', decoys: 'ija',
      feedback: 'Knowledge is everything you know. Spelling: k-n-o-w-l-e-d-g-e. It starts with "know" (silent k) and ends with -ledge.',
      tags: ['spelling', 'silent letters'], status: 'draft',
    },
    {
      id: 'wj-b2-025', kind: 'spell', level: 'B2', games: ['word-jumper'], objective: 'Spelling: commonly misspelt words', category: 'spelling', difficulty: 2,
      clue: 'An angry disagreement between two or more people.', word: 'argument', decoys: 'ijo',
      feedback: "An argument is an angry discussion. Spelling: a-r-g-u-m-e-n-t. The verb is argue, but we drop the e: argument, not 'arguement'.",
      tags: ['spelling', 'word formation'], status: 'draft',
    },
    {
      id: 'wj-b2-026', kind: 'spell', level: 'B2', games: ['word-jumper'], objective: 'Spelling: commonly misspelt words', category: 'spelling', difficulty: 2,
      clue: 'It shows all the days, weeks and months of the year.', word: 'calendar', decoys: 'kio',
      feedback: "A calendar shows the dates of the year. Spelling: c-a-l-e-n-d-a-r. The ending is -ar, not -er: not 'calender'.",
      tags: ['spelling', 'commonly misspelt'], status: 'draft',
    },
    {
      id: 'wj-b2-027', kind: 'spell', level: 'B2', games: ['word-jumper'], objective: 'Spelling: commonly misspelt words', category: 'spelling', difficulty: 3,
      clue: 'To make someone feel silly or ashamed in front of other people.', word: 'embarrass', decoys: 'ivz',
      hint: 'Two pairs of double letters.',
      feedback: "Embarrass means make someone feel silly or ashamed. Spelling: e-m-b-a-r-r-a-s-s, with double r and double s. Careful: 'embarazada' in Spanish means pregnant, not embarrassed!",
      tags: ['spelling', 'double letters', 'false friends'], status: 'draft',
    },
    {
      id: 'wj-b2-028', kind: 'spell', level: 'B2', games: ['word-jumper'], objective: 'Spelling: commonly misspelt words', category: 'spelling', difficulty: 3,
      clue: 'A place where you pay to sit down and eat a meal.', word: 'restaurant', decoys: 'oih',
      feedback: "You eat a meal in a restaurant. Spelling: r-e-s-t-a-u-r-a-n-t. The middle is -au-, not -o-: rest-au-rant, and there's no e at the end.",
      tags: ['spelling', 'commonly misspelt'], status: 'draft',
    },
    {
      id: 'wj-b2-029', kind: 'spell', level: 'B2', games: ['word-jumper'], objective: 'Spelling: science and space', category: 'spelling', difficulty: 3,
      clue: 'An object that orbits a planet, like the Moon or a machine that sends GPS data.', word: 'satellite', decoys: 'ouc',
      feedback: 'A satellite moves around a planet. Spelling: s-a-t-e-l-l-i-t-e: one t, then double l.',
      tags: ['science', 'space'], status: 'draft',
    },
    {
      id: 'wj-b2-030', kind: 'spell', level: 'B2', games: ['word-jumper'], objective: 'Spelling: careers', category: 'spelling', difficulty: 3,
      clue: 'A person you work with in the same company or team.', word: 'colleague', decoys: 'isk',
      feedback: 'A colleague is someone you work with. Spelling: c-o-l-l-e-a-g-u-e: double l, and it ends in -league, like a football league.',
      tags: ['careers', 'spelling'], status: 'draft',
    },
  ],
};
