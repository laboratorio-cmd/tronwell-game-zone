import type { CategoryItem, SpellItem, ContentBank } from '../../types';

// Draft sample content (not yet reviewed by a Tronwell teacher).
export const bank: ContentBank<CategoryItem | SpellItem> = {
  game: 'word-jumper',
  level: 'B1',
  items: [
    /* ---------- Category missions ---------- */
    {
      id: 'wj-b1-001', kind: 'category', level: 'B1', games: ['word-jumper'], objective: 'Vocabulary: the environment', category: 'word-categories', difficulty: 1,
      prompt: 'Find the environmental problems', correct: ['pollution', 'global warming', 'deforestation', 'litter'], distractors: ['recycling', 'reusable bags', 'tree planting'],
      feedback: 'Pollution, global warming, deforestation (cutting down forests) and litter are environmental problems. Recycling, reusable bags and tree planting are solutions: they help the planet.',
      tags: ['environment', 'problems'], status: 'draft',
    },
    {
      id: 'wj-b1-002', kind: 'category', level: 'B1', games: ['word-jumper'], objective: 'Vocabulary: crime and mystery', category: 'word-categories', difficulty: 1,
      prompt: 'Find the people in a crime story', correct: ['thief', 'suspect', 'witness', 'detective'], distractors: ['clue', 'evidence', 'fingerprint'],
      feedback: 'A thief, a suspect, a witness and a detective are people in a crime story. A clue, evidence and a fingerprint are things that help to solve the crime.',
      tags: ['mystery', 'crime'], status: 'draft',
    },
    {
      id: 'wj-b1-003', kind: 'category', level: 'B1', games: ['word-jumper'], objective: 'Vocabulary: media and news', category: 'word-categories', difficulty: 1,
      prompt: 'Find the people who work in the news', correct: ['journalist', 'reporter', 'editor', 'presenter'], distractors: ['headline', 'article', 'interview'],
      feedback: 'Journalists, reporters, editors and presenters are people who work in the news. A headline, an article and an interview are things they write or do.',
      tags: ['media', 'jobs'], status: 'draft',
    },
    {
      id: 'wj-b1-004', kind: 'category', level: 'B1', games: ['word-jumper'], objective: 'Vocabulary: travel problems', category: 'word-categories', difficulty: 1,
      prompt: 'Find the travel problems', correct: ['delay', 'lost luggage', 'missed flight', 'traffic jam'], distractors: ['souvenir', 'sightseeing', 'guidebook'],
      feedback: 'A delay, lost luggage, a missed flight and a traffic jam are travel problems. Souvenirs, sightseeing and a guidebook are fun or useful parts of a trip.',
      tags: ['travel', 'problems'], status: 'draft',
    },
    {
      id: 'wj-b1-005', kind: 'category', level: 'B1', games: ['word-jumper'], objective: 'Vocabulary: the environment', category: 'word-categories', difficulty: 1,
      prompt: 'Find the renewable energy sources', correct: ['solar power', 'wind power', 'wave power'], distractors: ['coal', 'oil', 'gas'],
      feedback: 'Solar, wind and wave power are renewable: the sun, the wind and the sea never run out. Coal, oil and gas are fossil fuels: one day they will run out.',
      tags: ['environment', 'energy'], status: 'draft',
    },
    {
      id: 'wj-b1-006', kind: 'category', level: 'B1', games: ['word-jumper'], objective: '-ed and -ing adjectives', category: 'word-categories', difficulty: 2,
      prompt: 'Find the words for how people feel', correct: ['bored', 'excited', 'confused', 'amazed'], distractors: ['boring', 'exciting', 'confusing'],
      hint: '-ed or -ing? Which ending is for feelings?',
      feedback: "-ed adjectives describe how people feel: I'm bored, excited, confused or amazed. -ing adjectives describe the thing that causes the feeling: a boring lesson, an exciting match, a confusing question.",
      tags: ['adjectives', 'feelings'], status: 'draft',
    },
    {
      id: 'wj-b1-007', kind: 'category', level: 'B1', games: ['word-jumper'], objective: 'Collocations: make vs do', category: 'word-categories', difficulty: 2,
      prompt: "Find what goes with 'make'", correct: ['a mistake', 'a decision', 'a cake', 'money'], distractors: ['homework', 'the washing-up', 'sport'],
      feedback: 'We say make a mistake, make a decision, make a cake and make money. But we say do homework, do the washing-up and do sport.',
      tags: ['collocations', 'make-do'], status: 'draft',
    },
    {
      id: 'wj-b1-008', kind: 'category', level: 'B1', games: ['word-jumper'], objective: 'Collocations: make vs do', category: 'word-categories', difficulty: 2,
      prompt: "Find what goes with 'do'", correct: ['the shopping', 'exercise', 'your best', 'a test'], distractors: ['a noise', 'friends', 'a phone call'],
      feedback: 'We say do the shopping, do exercise, do your best and do a test. But we make a noise, make friends and make a phone call.',
      tags: ['collocations', 'make-do'], status: 'draft',
    },
    {
      id: 'wj-b1-009', kind: 'category', level: 'B1', games: ['word-jumper'], objective: 'Phrasal verbs: travel', category: 'vocabulary', difficulty: 2,
      prompt: 'Find the travel phrasal verbs', correct: ['set off', 'check in', 'check out', 'get on'], distractors: ['give up', 'look after', 'turn down'],
      feedback: 'Set off (start a journey), check in and check out (at a hotel or airport) and get on (a bus, train or plane) are about travel. Give up means stop trying, look after means take care of, and turn down means refuse.',
      tags: ['phrasal verbs', 'travel'], status: 'draft',
    },
    {
      id: 'wj-b1-010', kind: 'category', level: 'B1', games: ['word-jumper'], objective: 'Vocabulary: strong emotions', category: 'word-categories', difficulty: 2,
      prompt: "Find the words meaning 'very happy'", correct: ['delighted', 'thrilled', 'over the moon'], distractors: ['furious', 'terrified', 'exhausted'],
      feedback: 'Delighted, thrilled and over the moon all mean very happy. Furious means very angry, terrified means very scared and exhausted means very tired.',
      tags: ['feelings', 'emotions'], status: 'draft',
    },
    {
      id: 'wj-b1-011', kind: 'category', level: 'B1', games: ['word-jumper'], objective: 'Vocabulary: emotions', category: 'word-categories', difficulty: 2,
      prompt: 'Find the negative feelings', correct: ['jealous', 'anxious', 'disappointed', 'embarrassed'], distractors: ['relieved', 'proud', 'grateful'],
      feedback: 'Jealous, anxious, disappointed and embarrassed are negative feelings. Relieved, proud and grateful are positive feelings.',
      tags: ['feelings', 'emotions'], status: 'draft',
    },
    {
      id: 'wj-b1-012', kind: 'category', level: 'B1', games: ['word-jumper'], objective: 'Phrasal verbs: relationships', category: 'vocabulary', difficulty: 3,
      prompt: 'Find the relationship phrasal verbs', correct: ['get on with', 'fall out', 'break up', 'make up'], distractors: ['look up', 'set off', 'put on'],
      feedback: 'Get on with (have a good relationship), fall out (stop being friends after an argument), break up (end a relationship) and make up (become friends again) are about relationships. Look up means search for information, set off means start a journey and put on is for clothes.',
      tags: ['phrasal verbs', 'relationships'], status: 'draft',
    },
    {
      id: 'wj-b1-013', kind: 'category', level: 'B1', games: ['word-jumper'], objective: 'Vocabulary: crime and mystery', category: 'word-categories', difficulty: 3,
      prompt: 'Find what a detective does', correct: ['investigate', 'interview', 'solve', 'arrest'], distractors: ['steal', 'break in', 'escape'],
      feedback: 'A detective investigates a crime, interviews witnesses, solves the case and arrests the criminal. Criminals steal, break in and try to escape.',
      tags: ['mystery', 'crime', 'verbs'], status: 'draft',
    },
    {
      id: 'wj-b1-014', kind: 'category', level: 'B1', games: ['word-jumper'], objective: '-ed and -ing adjectives', category: 'word-categories', difficulty: 3,
      prompt: 'Find words for: The film was ___', correct: ['boring', 'terrifying', 'disappointing', 'confusing'], distractors: ['bored', 'terrified', 'disappointed'],
      hint: 'A film causes a feeling. It does not feel anything!',
      feedback: '-ing adjectives describe the thing that causes the feeling: the film was boring, terrifying, disappointing or confusing. -ed adjectives describe how people feel: I was bored, terrified or disappointed.',
      tags: ['adjectives', 'films'], status: 'draft',
    },
    {
      id: 'wj-b1-015', kind: 'category', level: 'B1', games: ['word-jumper'], objective: 'Phrasal verbs: clothes', category: 'vocabulary', difficulty: 3,
      prompt: 'Find the phrasal verbs about clothes', correct: ['put on', 'take off', 'try on', 'dress up'], distractors: ['run out', 'put off', 'look up'],
      feedback: 'Put on, take off, try on and dress up are about clothes. Run out means have none left, put off means delay, and look up means search for information.',
      tags: ['phrasal verbs', 'clothes'], status: 'draft',
    },

    /* ---------- Spelling missions ---------- */
    {
      id: 'wj-b1-016', kind: 'spell', level: 'B1', games: ['word-jumper'], objective: 'Spelling: the environment', category: 'spelling', difficulty: 1,
      clue: 'To use old things again to make new things, like glass or paper.', word: 'recycle', decoys: 'isk',
      feedback: 'We recycle bottles and paper to help the planet. Spelling: re + cycle, with a y: r-e-c-y-c-l-e.',
      tags: ['environment', 'recycling'], status: 'draft',
    },
    {
      id: 'wj-b1-017', kind: 'spell', level: 'B1', games: ['word-jumper'], objective: 'Spelling: mystery words', category: 'spelling', difficulty: 1,
      clue: 'Something that helps a detective find the answer to a mystery.', word: 'clue', decoys: 'kio',
      feedback: 'A clue helps you solve a mystery. Spelling: c-l-u-e, with a silent e at the end.',
      tags: ['mystery', 'detectives'], status: 'draft',
    },
    {
      id: 'wj-b1-018', kind: 'spell', level: 'B1', games: ['word-jumper'], objective: 'Spelling: emotions', category: 'spelling', difficulty: 1,
      clue: "'I passed my exam! I'm really ___ of myself.'", word: 'proud', decoys: 'aew',
      feedback: "You feel proud when you or someone you love does something well. Spelling: p-r-o-u-d. The /au/ sound is written ou, like in 'loud'.",
      tags: ['feelings', 'emotions'], status: 'draft',
    },
    {
      id: 'wj-b1-019', kind: 'spell', level: 'B1', games: ['word-jumper'], objective: 'Spelling: media', category: 'spelling', difficulty: 1,
      clue: 'A short video or picture that tries to sell you something.', word: 'advert', decoys: 'bio',
      feedback: "An advert (or ad) tries to make you buy something; it's short for advertisement. Spelling: a-d-v-e-r-t, with v, not b.",
      tags: ['media', 'advertising'], status: 'draft',
    },
    {
      id: 'wj-b1-020', kind: 'spell', level: 'B1', games: ['word-jumper'], objective: 'Spelling: the environment', category: 'spelling', difficulty: 1,
      clue: 'Things people throw away, like old food and empty packets.', word: 'rubbish', decoys: 'vae',
      feedback: "Rubbish is the British word for things we throw away (in American English it's garbage). Spelling: r-u-b-b-i-s-h, with double b.",
      tags: ['environment', 'british english'], status: 'draft',
    },
    {
      id: 'wj-b1-021', kind: 'spell', level: 'B1', games: ['word-jumper'], objective: 'Spelling: mystery words', category: 'spelling', difficulty: 2,
      clue: 'Something strange that nobody can explain.', word: 'mystery', decoys: 'iao',
      feedback: "A mystery is something nobody can explain. Spelling: m-y-s-t-e-r-y. Careful: it's y after the m, not i like in the Spanish 'misterio'.",
      tags: ['mystery', 'false friends'], status: 'draft',
    },
    {
      id: 'wj-b1-022', kind: 'spell', level: 'B1', games: ['word-jumper'], objective: 'Spelling: mystery words', category: 'spelling', difficulty: 2,
      clue: 'Things that prove what happened in a crime, like fingerprints or videos.', word: 'evidence', decoys: 'bsa',
      feedback: "Detectives look for evidence. It's uncountable: some evidence, not 'an evidence'. Spelling: e-v-i-d-e-n-c-e, ending in -ence.",
      tags: ['mystery', 'crime'], status: 'draft',
    },
    {
      id: 'wj-b1-023', kind: 'spell', level: 'B1', games: ['word-jumper'], objective: 'Spelling: emotions', category: 'spelling', difficulty: 2,
      clue: 'Upset because your best friend now spends all their time with someone new.', word: 'jealous', decoys: 'yic',
      feedback: 'You feel jealous when you want the attention (or the things) that someone else has. Spelling: j-e-a-l-o-u-s, with ea and the ending -ous.',
      tags: ['feelings', 'emotions'], status: 'draft',
    },
    {
      id: 'wj-b1-024', kind: 'spell', level: 'B1', games: ['word-jumper'], objective: 'Spelling: travel problems', category: 'spelling', difficulty: 2,
      clue: "Later than planned: 'Sorry, the 10:15 flight is ___ by an hour.'", word: 'delayed', decoys: 'iot',
      feedback: 'Delayed means late because of a problem. Spelling: delay + ed. Keep the y: d-e-l-a-y-e-d.',
      tags: ['travel', 'problems'], status: 'draft',
    },
    {
      id: 'wj-b1-025', kind: 'spell', level: 'B1', games: ['word-jumper'], objective: 'Spelling: travel', category: 'spelling', difficulty: 2,
      clue: 'A person travelling in a car, bus or plane who is not the driver or pilot.', word: 'passenger', decoys: 'jio',
      feedback: "A passenger travels in a vehicle but doesn't drive it. Spelling: p-a-s-s-e-n-g-e-r, with double s and g (not j).",
      tags: ['travel', 'transport'], status: 'draft',
    },
    {
      id: 'wj-b1-026', kind: 'spell', level: 'B1', games: ['word-jumper'], objective: 'Spelling: the environment', category: 'spelling', difficulty: 2,
      clue: 'The usual weather in a region over many years.', word: 'climate', decoys: 'kyo',
      feedback: 'Climate is the usual weather in a place, and climate change is a big problem for the planet. Spelling: c-l-i-m-a-t-e, with a silent e at the end.',
      tags: ['environment', 'weather'], status: 'draft',
    },
    {
      id: 'wj-b1-027', kind: 'spell', level: 'B1', games: ['word-jumper'], objective: 'Spelling: mystery words', category: 'spelling', difficulty: 3,
      clue: 'A criminal who breaks into houses to steal things.', word: 'burglar', decoys: 'eiv',
      feedback: 'A burglar breaks into homes to steal. Spelling: b-u-r-g-l-a-r. The ending is -ar, not -er.',
      tags: ['mystery', 'crime'], status: 'draft',
    },
    {
      id: 'wj-b1-028', kind: 'spell', level: 'B1', games: ['word-jumper'], objective: 'Spelling: emotions', category: 'spelling', difficulty: 3,
      clue: "How you feel when a worry ends: 'Phew! The test was easy!'", word: 'relieved', decoys: 'abo',
      feedback: 'You feel relieved when something stressful ends well. Spelling: r-e-l-i-e-v-e-d. Remember i before e: rel-ie-ved.',
      tags: ['feelings', 'emotions'], status: 'draft',
    },
    {
      id: 'wj-b1-029', kind: 'spell', level: 'B1', games: ['word-jumper'], objective: 'Spelling: travel problems', category: 'spelling', difficulty: 3,
      clue: "Stopped and it won't happen: 'There's a storm, so all flights are ___.'", word: 'cancelled', decoys: 'sio',
      feedback: 'Cancelled means it will not happen. In British English it has double l: c-a-n-c-e-l-l-e-d.',
      tags: ['travel', 'british english'], status: 'draft',
    },
    {
      id: 'wj-b1-030', kind: 'spell', level: 'B1', games: ['word-jumper'], objective: 'Spelling: travel', category: 'spelling', difficulty: 3,
      clue: 'A line of people waiting, for example at a bus stop.', word: 'queue', decoys: 'kai',
      hint: 'It sounds just like the letter Q.',
      feedback: 'In British English, people wait in a queue. It sounds like the letter Q, but it is spelt q-u-e-u-e!',
      tags: ['travel', 'british english'], status: 'draft',
    },
  ],
};
