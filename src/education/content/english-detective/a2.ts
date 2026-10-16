import type { DetectiveCase, ContentBank } from '../../types';

// Draft sample content (not yet reviewed by a Tronwell teacher).
export const bank: ContentBank<DetectiveCase> = {
  game: 'english-detective',
  level: 'A2',
  items: [
    {
      id: 'ed-a2-01',
      level: 'A2',
      games: ['english-detective'],
      objective: 'Reading for detail: past simple alibis, times and places',
      difficulty: 2,
      status: 'draft',
      tags: ['past simple', 'times', 'alibis'],
      title: 'Crumbs in the Library',
      scene: 'library',
      briefing: [
        'The station library closed at 8 pm last night. No food is allowed inside.',
        'This morning Mr Okafor, the librarian, found biscuit crumbs on the old star map!',
        "Nobody is in trouble — he just wants to know who was there. Can you find out?",
      ],
      suspects: [
        {
          id: 's1', name: 'Kai', role: "Leo's cousin", look: 'boy-glasses',
          statement: "I went to the gym at 7.30 and stayed there until 9. Then I went straight to bed. I didn't go to the library last night.",
        },
        {
          id: 's2', name: 'Priya', role: 'a student from Deck 3', look: 'girl-dark',
          statement: "I was in my room all evening. I studied for my space history test. I didn't eat anything because I wasn't hungry.",
        },
        {
          id: 's3', name: 'Zib', role: 'an alien from planet Zoom', look: 'alien',
          statement: 'I planted moon trees in the garden with Gus from 8 until 10. They grow faster than Earth trees! And I never eat biscuits — on Zoom we only eat fruit.',
        },
      ],
      evidence: [
        {
          id: 'e1', name: 'Crumbs on the map', sprite: 'crumbs', x: 0.14, y: 0.62,
          description: "Orange crumbs on the old star map. Mr Okafor said they came from the café's orange biscuits.",
        },
        {
          id: 'e2', name: 'Library door log', sprite: 'tablet', x: 0.32, y: 0.82,
          description: "Library door log, last night: 'Opened at 8.40 pm. Closed at 9.50 pm.'",
        },
        {
          id: 'e3', name: 'Gym photo', sprite: 'photo', x: 0.5, y: 0.6,
          description: 'Gym camera, 8.45 pm: Kai was lifting weights with Coach Ben. The gym is on Deck 1, far from the library.',
        },
        {
          id: 'e4', name: 'Moon tree label', sprite: 'plant', x: 0.68, y: 0.84,
          description: "A small moon tree in a pot. The label says: 'Planted by Zib and Gus, 9 pm.'",
        },
        {
          id: 'e5', name: 'Space history book', sprite: 'book', x: 0.86, y: 0.62, hidden: true,
          description: 'A space history book under the table. It was open at page 54, and there were orange crumbs between the pages.',
        },
        {
          id: 'e6', name: 'Café receipt', sprite: 'ticket', x: 0.48, y: 0.88, hidden: true,
          description: "A café receipt from yesterday: 'Three orange biscuits, 7.45 pm. Customer: Priya.'",
        },
      ],
      questions: [
        {
          id: 'q1', category: 'reading-detail', requires: ['e2'],
          prompt: 'When was somebody in the library last night?',
          choices: ['From 7.30 to 9 pm', 'From 8.40 to 9.50 pm', 'From 7.45 to 8 pm'],
          answer: 1,
          feedback: "The door log says: 'Opened at 8.40 pm. Closed at 9.50 pm.' So the visitor was there between 8.40 and 9.50.",
        },
        {
          id: 'q2', category: 'reading-inference', requires: ['s1', 'e2', 'e3'],
          prompt: 'Was Kai the library visitor?',
          choices: ['Yes — he went to bed late.', 'Yes — the gym is next to the library.', 'No — he was at the gym at 8.45 pm.'],
          answer: 2,
          feedback: "The library door opened at 8.40. At 8.45 the gym camera filmed Kai with Coach Ben on Deck 1, far from the library. So Kai wasn't the visitor.",
        },
        {
          id: 'q3', category: 'reading-inference', requires: ['s3', 'e4'], reveals: ['e5'],
          prompt: "Why wasn't Zib in the library?",
          choices: ['He was planting moon trees in the garden.', 'He was at the gym with Kai.', 'He was eating fruit in the café.'],
          answer: 0,
          feedback: "Zib says he planted moon trees with Gus from 8 until 10, and the tree label says 'Planted by Zib and Gus, 9 pm'. He never eats biscuits, too. Look — there's something under the table!",
        },
        {
          id: 'q4', category: 'reading-detail', requires: ['s2', 'e5'], reveals: ['e6'],
          prompt: 'The book under the table was about space history. Who had a space history test?',
          choices: ['Kai', 'Priya', 'Zib'],
          answer: 1,
          feedback: "Priya says: 'I studied for my space history test.' And the book had orange crumbs between the pages! A new clue has appeared.",
        },
        {
          id: 'q5', category: 'reading-inference', requires: ['s2', 'e6', 'e1'],
          prompt: "Priya said she didn't eat anything. Why is that strange?",
          choices: ["She wasn't hungry last night.", 'She bought three orange biscuits at 7.45 pm.', "She doesn't like orange biscuits."],
          answer: 1,
          feedback: "The receipt says: 'Three orange biscuits, 7.45 pm. Customer: Priya.' Orange crumbs were on the star map and in the space history book.",
        },
      ],
      solution: {
        question: 'Who was in the library last night?',
        choices: ['Kai', 'Priya', 'Zib'],
        answer: 1,
        explanation: "Priya studied for her test in the library, not in her room. She bought orange biscuits at 7.45, and orange crumbs were on the star map and in the space history book. She forgot the 'no food' rule — maybe she can help Mr Okafor clean the map!",
      },
      proof: {
        question: 'Which clue proves it?',
        choices: ['The library door opened at 8.40 pm.', 'Priya bought orange biscuits, and orange crumbs were found.', 'Kai was at the gym at 8.45 pm.'],
        answer: 1,
        explanation: "Only Priya bought orange biscuits, and the crumbs were orange. The door time tells us WHEN, not WHO, and the gym photo only shows that it wasn't Kai.",
      },
    },
    {
      id: 'ed-a2-02',
      level: 'A2',
      games: ['english-detective'],
      objective: 'Reading for detail: past simple, times and comparatives',
      difficulty: 2,
      status: 'draft',
      tags: ['past simple', 'comparatives', 'robots'],
      title: 'Where Is Chip?',
      scene: 'quarters',
      briefing: [
        'Leo has got a tiny pet robot called Chip. Chip sleeps in a box on the top shelf.',
        'Yesterday Leo went to football at 3 pm. When he came back at 5, the box was empty!',
        'Who took Chip off the shelf — and why? Read every clue carefully.',
      ],
      suspects: [
        {
          id: 's1', name: 'Sofi', role: "Leo's sister", look: 'girl-dark',
          statement: "I was at my piano lesson from 3 to 5. After that I went to the café with Kai. Anyway, I'm shorter than Leo — I can't reach his top shelf!",
        },
        {
          id: 's2', name: 'Omar', role: 'the station engineer', look: 'man-beard',
          statement: "I was in the hangar all afternoon. I fixed the old shuttle — it was dirtier than a football boot! I didn't go near Leo's room.",
        },
        {
          id: 's3', name: 'Dr Rosa Díaz', role: 'the station scientist', look: 'girl-ginger',
          statement: 'I worked in the lab all afternoon. I only went out once, at about 3.30, to get a coffee. My lab is much quieter than the rest of the station.',
        },
      ],
      evidence: [
        {
          id: 'e1', name: "Chip's sleeping box", sprite: 'box', x: 0.14, y: 0.62,
          description: "Chip's sleeping box on the top shelf. It was empty. The shelf is higher than Leo's head.",
        },
        {
          id: 'e2', name: "Chip's tablet", sprite: 'tablet', x: 0.34, y: 0.82,
          description: "Chip's tablet: '3.25 pm: LOW BATTERY! BEEP BEEP!' '3.40 pm: Charging in the LAB.'",
        },
        {
          id: 'e3', name: 'Hangar camera photo', sprite: 'photo', x: 0.54, y: 0.6,
          description: 'Hangar camera, 3.20 to 3.50 pm: Omar was under the old shuttle all the time. His hands were very dirty.',
        },
        {
          id: 'e4', name: 'Piano lesson card', sprite: 'ticket', x: 0.72, y: 0.84,
          description: "Sofi's piano lesson card: 'Tuesday, 3–5 pm. Sofi was here all the time. — Mr Lee'",
        },
        {
          id: 'e5', name: 'A lab glove', sprite: 'glove', x: 0.86, y: 0.62, hidden: true,
          description: "A white lab glove next to the shelf. The name inside was 'R. Díaz'.",
        },
        {
          id: 'e6', name: 'A note under the bed', sprite: 'note', x: 0.3, y: 0.6, hidden: true,
          description: "A note under Leo's bed — it fell off the door! 'Chip was beeping, so I took him to the lab to charge him. — R.'",
        },
      ],
      questions: [
        {
          id: 'q1', category: 'reading-detail', requires: ['s1', 'e4', 'e1'],
          prompt: 'Where was Sofi from 3 to 5 pm?',
          choices: ["In Leo's room", 'At her piano lesson', 'In the café'],
          answer: 1,
          feedback: "Sofi says she was at her piano lesson from 3 to 5, and Mr Lee's card says 'Sofi was here all the time'. She went to the café AFTER that. And she's shorter than Leo, but the shelf is higher than Leo's head!",
        },
        {
          id: 'q2', category: 'reading-inference', requires: ['s2', 'e2', 'e3'],
          prompt: "Chip went to the lab at about 3.40. Why couldn't Omar take him?",
          choices: ['He was under the shuttle from 3.20 to 3.50.', 'He is shorter than Leo.', 'He was in the café.'],
          answer: 0,
          feedback: 'The hangar camera shows Omar under the old shuttle from 3.20 to 3.50 pm — the same time that Chip left the room and went to the lab.',
        },
        {
          id: 'q3', category: 'reading-detail', requires: ['e2'], reveals: ['e5'],
          prompt: 'What happened to Chip at 3.25 pm?',
          choices: ['He started charging in the lab.', 'His battery was low and he beeped.', 'He went to the café.'],
          answer: 1,
          feedback: "Chip's tablet says: '3.25 pm: LOW BATTERY! BEEP BEEP!' He started charging later, at 3.40. Look — there's a glove by the shelf!",
        },
        {
          id: 'q4', category: 'reading-inference', requires: ['s3', 'e2', 'e5'], reveals: ['e6'],
          prompt: 'Dr Rosa went out at about 3.30. What did she probably hear?',
          choices: ['Chip beeping because his battery was low', 'Leo playing football', 'Sofi playing the piano'],
          answer: 0,
          feedback: "Dr Rosa went out at about 3.30, and Chip was beeping 'LOW BATTERY!' from 3.25. Her lab glove was next to the shelf. Now look under the bed!",
        },
        {
          id: 'q5', category: 'reading-detail', requires: ['e6'],
          prompt: "Why didn't Leo find the note when he came back?",
          choices: ["Dr Rosa didn't write a note.", 'Chip took it to the lab.', 'It fell off the door and went under the bed.'],
          answer: 2,
          feedback: "The note was under Leo's bed — it 'fell off the door'. That's why Leo didn't see it.",
        },
      ],
      solution: {
        question: 'What happened to Chip?',
        choices: ['Sofi took him to her piano lesson.', 'Omar took him to the hangar to fix him.', 'Dr Rosa took him to the lab to charge him.'],
        answer: 2,
        explanation: "Dr Rosa went out at about 3.30 and heard Chip beeping because his battery was low. Her glove was next to the shelf, Chip was charging in the LAB at 3.40, and her note explains everything. Chip is safe!",
      },
      proof: {
        question: 'Which clue proves it?',
        choices: ["Dr Rosa's glove was by the shelf and Chip went to her lab.", 'Sofi is shorter than Leo.', "Omar's hands were very dirty."],
        answer: 0,
        explanation: "Dr Rosa's glove was next to Chip's shelf, and Chip was charging in the lab, where she works. Sofi's height and Omar's dirty hands don't tell us WHO took Chip.",
      },
    },
  ],
};
