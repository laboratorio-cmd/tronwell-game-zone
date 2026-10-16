import type { DetectiveCase, ContentBank } from '../../types';

// Draft sample content (not yet reviewed by a Tronwell teacher).
export const bank: ContentBank<DetectiveCase> = {
  game: 'english-detective',
  level: 'A0',
  items: [
    {
      id: 'ed-a0-01',
      level: 'A0',
      games: ['english-detective'],
      objective: 'Reading for detail: colours, sizes and numbers',
      difficulty: 1,
      status: 'draft',
      tags: ['colours', 'numbers', 'have got'],
      title: 'The Birthday Cake',
      scene: 'cafe',
      briefing: [
        "Today is Tronny's birthday. Tronny is a robot.",
        'His big chocolate cake is not on the table!',
        'Who has got the cake? Read and look. Find the clues.',
      ],
      suspects: [
        {
          id: 's1', name: 'Kai', role: "Leo's cousin", look: 'boy-glasses',
          statement: 'Hello! I am Kai. I am from Australia. My shoes are big. They are blue.',
        },
        {
          id: 's2', name: 'Bip', role: 'the café robot', look: 'robot',
          statement: 'Beep! I am Bip. I am a robot. I have got two wheels. I have got no feet.',
        },
        {
          id: 's3', name: 'Nubi', role: 'an alien from planet Zoom', look: 'alien',
          statement: "Hi! I am Nubi. I am small and green. I have got three toes and green gloves. I haven't got the cake!",
        },
      ],
      evidence: [
        {
          id: 'e1', name: 'Footprints', sprite: 'footprints', x: 0.18, y: 0.8,
          description: 'Small footprints on the floor. They are brown. Brown is chocolate! They have got three toes.',
        },
        {
          id: 'e2', name: 'Cake crumbs', sprite: 'crumbs', x: 0.42, y: 0.62,
          description: 'Brown crumbs on the floor. They are chocolate cake crumbs.',
        },
        {
          id: 'e3', name: 'A blue cup', sprite: 'cup', x: 0.7, y: 0.6,
          description: "A blue cup. It is Kai's cup. It has got milk in it.",
        },
        {
          id: 'e4', name: 'A green glove', sprite: 'glove', x: 0.58, y: 0.84, hidden: true,
          description: 'A small green glove. It has got chocolate on it!',
        },
        {
          id: 'e5', name: 'A note', sprite: 'note', x: 0.86, y: 0.76, hidden: true,
          description: "A note: 'The cake is in my room. I have got ten candles for it. Surprise! — N'",
        },
      ],
      questions: [
        {
          id: 'q1', category: 'reading-detail', requires: ['s1'],
          prompt: "What are Kai's shoes like?",
          choices: ['Big and blue', 'Small and blue', 'Big and red'],
          answer: 0,
          feedback: "Kai says: 'My shoes are big. They are blue.' So his shoes are big and blue.",
        },
        {
          id: 'q2', category: 'reading-detail', requires: ['e1'],
          prompt: 'Look at the footprints. How many toes have they got?',
          choices: ['Two', 'Three', 'Five'],
          answer: 1,
          feedback: "The footprints clue says: 'They have got three toes.' Who has got three toes? Keep reading!",
        },
        {
          id: 'q3', category: 'reading-inference', requires: ['s1', 'e1'], reveals: ['e4'],
          prompt: "The footprints are small. Are they Kai's footprints?",
          choices: ['Yes. Kai has got blue shoes.', "No. Kai's shoes are big.", 'Yes. Kai is from Australia.'],
          answer: 1,
          feedback: "The footprints are small, but Kai says: 'My shoes are big.' So they are not Kai's footprints. Look! A new clue is on the floor.",
        },
        {
          id: 'q4', category: 'reading-inference', requires: ['s2', 'e1'],
          prompt: "Are the footprints Bip's footprints?",
          choices: ['No. Bip has got wheels, not feet.', 'Yes. Bip is a robot.', 'Yes. Bip is in the café.'],
          answer: 0,
          feedback: "Bip says: 'I have got two wheels. I have got no feet.' No feet = no footprints!",
        },
        {
          id: 'q5', category: 'reading-inference', requires: ['s3', 'e4'], reveals: ['e5'],
          prompt: 'The glove is small and green. Who has got green gloves?',
          choices: ['Kai', 'Bip', 'Nubi'],
          answer: 2,
          feedback: "Nubi says: 'I have got three toes and green gloves.' The small green glove has got chocolate on it. Now read the new note!",
        },
      ],
      solution: {
        question: "Who has got Tronny's cake?",
        choices: ['Kai', 'Bip', 'Nubi'],
        answer: 2,
        explanation: "Nubi has got the cake! The footprints have got three toes, like Nubi. The green glove has got chocolate on it. Nubi says 'I haven't got the cake' — but it is in Nubi's room. It is a birthday surprise with candles!",
      },
      proof: {
        question: 'Which clue proves it?',
        choices: ["Kai's cup is blue.", 'The footprints have got three toes, like Nubi.', 'The crumbs are brown.'],
        answer: 1,
        explanation: "Only Nubi has got three toes. Kai has got big shoes and Bip has got wheels. The blue cup and the brown crumbs don't tell us WHO has got the cake.",
      },
    },
    {
      id: 'ed-a0-02',
      level: 'A0',
      games: ['english-detective'],
      objective: 'Reading for detail: colours, sizes and have got',
      difficulty: 1,
      status: 'draft',
      tags: ['colours', 'have got', 'garden'],
      title: 'The Purple Flowers',
      scene: 'garden',
      briefing: [
        'The station garden has got purple flowers. They are very pretty.',
        'Today the purple flowers are not there!',
        'Who has got the flowers? Read and look. Find the clues.',
      ],
      suspects: [
        {
          id: 's1', name: 'Gus', role: 'the gardener', look: 'man-beard',
          statement: 'Hello. I am Gus. I am the gardener. My gloves are green. They are big.',
        },
        {
          id: 's2', name: 'Sofi', role: "Leo's sister", look: 'girl-dark',
          statement: 'Hi! I am Sofi. My bag is small and yellow. I have got a book about cats in it.',
        },
        {
          id: 's3', name: 'Tomás', role: "Leo's friend", look: 'boy-glasses',
          statement: 'Hi, I am Tomás. My gloves are red. My bag is red too. It is big. It is empty!',
        },
      ],
      evidence: [
        {
          id: 'e1', name: 'The flower plant', sprite: 'plant', x: 0.16, y: 0.62,
          description: 'A big plant. It has got green leaves. The purple flowers are not here!',
        },
        {
          id: 'e2', name: 'A red glove', sprite: 'glove', x: 0.38, y: 0.82,
          description: 'A small red glove. It has got a purple flower on it.',
        },
        {
          id: 'e3', name: 'A water bottle', sprite: 'bottle', x: 0.58, y: 0.6,
          description: "A big green bottle. It is Gus's bottle. It has got water in it.",
        },
        {
          id: 'e4', name: 'A big red bag', sprite: 'bag', x: 0.74, y: 0.84, hidden: true,
          description: 'A big red bag. It is not empty! It has got six purple flowers in it.',
        },
        {
          id: 'e5', name: 'A note', sprite: 'note', x: 0.86, y: 0.62, hidden: true,
          description: "A note: 'The flowers are for Dr Rosa. Happy birthday! — Tomás'",
        },
      ],
      questions: [
        {
          id: 'q1', category: 'reading-detail', requires: ['s1'],
          prompt: "What colour are Gus's gloves?",
          choices: ['Green', 'Red', 'Yellow'],
          answer: 0,
          feedback: "Gus says: 'My gloves are green. They are big.'",
        },
        {
          id: 'q2', category: 'reading-detail', requires: ['e2'],
          prompt: 'What is the glove like?',
          choices: ['Big and green', 'Small and red', 'Small and yellow'],
          answer: 1,
          feedback: "The clue says: 'A small red glove. It has got a purple flower on it.'",
        },
        {
          id: 'q3', category: 'reading-inference', requires: ['s1', 'e2'], reveals: ['e4'],
          prompt: "Is the red glove Gus's glove?",
          choices: ["No. Gus's gloves are big and green.", 'Yes. Gus is the gardener.', 'Yes. Gus has got a bottle.'],
          answer: 0,
          feedback: "The glove is small and red. Gus's gloves are big and green, so it is not Gus's glove. Look! A bag is here now.",
        },
        {
          id: 'q4', category: 'reading-inference', requires: ['s2', 'e4'],
          prompt: "The flowers are in a big red bag. Is it Sofi's bag?",
          choices: ['Yes. Sofi has got a bag.', "No. Sofi's bag is small and yellow.", 'Yes. Sofi likes cats.'],
          answer: 1,
          feedback: "Sofi says: 'My bag is small and yellow.' The flower bag is big and red. It is not Sofi's bag.",
        },
        {
          id: 'q5', category: 'reading-inference', requires: ['s3', 'e4'], reveals: ['e5'],
          prompt: "Tomás says: 'My bag is empty!' Is that true?",
          choices: ['Yes. It is empty.', 'No. It has got a cat book in it.', 'No. It has got six flowers in it.'],
          answer: 2,
          feedback: "Tomás's bag is big and red. The big red bag has got six purple flowers in it — it is not empty! Now read the new note.",
        },
      ],
      solution: {
        question: 'Who has got the purple flowers?',
        choices: ['Tomás', 'Gus', 'Sofi'],
        answer: 0,
        explanation: 'Tomás has got the flowers. He has got red gloves and a big red bag. The small red glove has got a purple flower on it, and the red bag has got six flowers in it. They are a birthday present for Dr Rosa!',
      },
      proof: {
        question: 'Which clue proves it?',
        choices: ['Gus has got a green bottle.', 'Sofi has got a book about cats.', "The flowers are in a big red bag, like Tomás's bag."],
        answer: 2,
        explanation: "Only Tomás has got a big red bag, and the flowers are in it. The bottle and the cat book don't tell us WHO has got the flowers.",
      },
    },
  ],
};
