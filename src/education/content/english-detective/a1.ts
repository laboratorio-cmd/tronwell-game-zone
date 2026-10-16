import type { DetectiveCase, ContentBank } from '../../types';

// Draft sample content (not yet reviewed by a Tronwell teacher).
export const bank: ContentBank<DetectiveCase> = {
  game: 'english-detective',
  level: 'A1',
  items: [
    {
      id: 'ed-a1-01',
      level: 'A1',
      games: ['english-detective'],
      objective: "Reading for detail: present continuous, clothes and can/can't",
      difficulty: 1,
      status: 'draft',
      tags: ['present continuous', 'clothes', 'plants'],
      title: 'The Moon Plant',
      scene: 'lab',
      briefing: [
        'Dr Rosa Díaz has got a tiny moon plant. It lives on the lab table.',
        "At 3 o'clock the plant is there. At 4 o'clock it isn't! There are muddy footprints on the floor.",
        'Who moves the plant — and why? Talk to the crew and look at the clues.',
      ],
      suspects: [
        {
          id: 's1', name: 'Marco', role: 'the station chef', look: 'man-beard',
          statement: "Hello! I'm Marco, the station chef. I'm wearing my big white kitchen shoes today. Every afternoon I make bread for dinner.",
        },
        {
          id: 's2', name: 'Sofi', role: "Leo's sister", look: 'girl-dark',
          statement: "Hi, I'm Sofi. I'm wearing my new trainers today — they've got little stars on them! I love plants, but I never go in the lab.",
        },
        {
          id: 's3', name: 'Bolt', role: 'the cleaning robot', look: 'robot',
          statement: "Beep! I am Bolt, the cleaning robot. I haven't got feet — I've got wheels. I clean the lab every day at 5 o'clock.",
        },
      ],
      evidence: [
        {
          id: 'e1', name: 'Muddy footprints', sprite: 'footprints', x: 0.18, y: 0.8,
          description: 'Small muddy footprints. There are little stars on them. They go from the table to the door.',
        },
        {
          id: 'e2', name: 'A plant book', sprite: 'book', x: 0.4, y: 0.6,
          description: "A book about plants. It's open at page 12: 'Moon plants need sun every day.'",
        },
        {
          id: 'e3', name: "Bolt's cleaning box", sprite: 'toolbox', x: 0.66, y: 0.62,
          description: "Bolt's cleaning box. There's soap in it, but there isn't any mud.",
        },
        {
          id: 'e4', name: 'Garden camera photo', sprite: 'photo', x: 0.52, y: 0.86, hidden: true,
          description: "Garden camera, 3.30: a girl is putting a little plant in the sun. You can't see her face, but she's wearing trainers with stars.",
        },
        {
          id: 'e5', name: 'A note on the door', sprite: 'note', x: 0.84, y: 0.78, hidden: true,
          description: "A note: 'Don't worry, Dr Rosa! Your plant is in the garden. It's happy in the sun. — S'",
        },
      ],
      questions: [
        {
          id: 'q1', category: 'reading-detail', requires: ['e1'],
          prompt: 'What can you see on the muddy footprints?',
          choices: ['Big circles', 'Little stars', 'Green leaves'],
          answer: 1,
          feedback: "The clue says: 'Small muddy footprints. There are little stars on them.'",
        },
        {
          id: 'q2', category: 'reading-inference', requires: ['s1', 'e1'], reveals: ['e4'],
          prompt: "Are the footprints Marco's? Why or why not?",
          choices: ["Yes — he's in the lab every day.", "Yes — they're muddy.", "No — they're small, and his shoes are big."],
          answer: 2,
          feedback: "Marco says: 'I'm wearing my big white kitchen shoes today.' The footprints are small, so they aren't his. A new clue is in the room!",
        },
        {
          id: 'q3', category: 'reading-inference', requires: ['s3', 'e1', 'e3'],
          prompt: "Why can't the footprints be Bolt's?",
          choices: ["Bolt hasn't got feet — he's got wheels.", 'Bolt is cleaning the garden.', "Bolt can't see the plant."],
          answer: 0,
          feedback: "Bolt says: 'I haven't got feet — I've got wheels.' Wheels can't make footprints! And there isn't any mud in his cleaning box.",
        },
        {
          id: 'q4', category: 'reading-inference', requires: ['s2', 'e1', 'e4'], reveals: ['e5'],
          prompt: "Sofi says: 'I never go in the lab.' Is that true today?",
          choices: ["Yes — she's in the garden all day.", 'No — her star trainers make the footprints.', "Yes — she doesn't like the lab."],
          answer: 1,
          feedback: "Sofi says her new trainers 'have got little stars on them'. The small footprints in the lab have got little stars too! And the girl in the photo is wearing trainers with stars. Read the new note.",
        },
        {
          id: 'q5', category: 'reading-inference', requires: ['e2', 'e4', 'e5'],
          prompt: 'Why is the girl in the photo putting the plant in the sun?',
          choices: ['Because the lab is too cold.', 'Because moon plants need sun every day.', "Because Dr Rosa doesn't like it."],
          answer: 1,
          feedback: "The plant book says: 'Moon plants need sun every day.' The note says: 'It's happy in the sun.' The girl wants to help the plant!",
        },
      ],
      solution: {
        question: 'Who moves the moon plant to the garden?',
        choices: ['Marco', 'Sofi', 'Bolt'],
        answer: 1,
        explanation: "Sofi! She's wearing trainers with stars, and the small muddy footprints have got little stars on them. The girl in the photo is wearing trainers with stars too, and the note is from 'S'. Sofi says she never goes in the lab — but today she does. She wants to help: moon plants need sun!",
      },
      proof: {
        question: 'Which clue proves it?',
        choices: ["The footprints have got stars, like Sofi's trainers.", 'The plant book says moon plants need sun.', 'Marco is wearing big white shoes.'],
        answer: 0,
        explanation: "Only Sofi is wearing trainers with stars. The plant book tells us WHY, not WHO. Marco's big shoes only tell us that it isn't Marco.",
      },
    },
    {
      id: 'ed-a1-02',
      level: 'A1',
      games: ['english-detective'],
      objective: "Reading for detail: days, times and can/can't",
      difficulty: 2,
      status: 'draft',
      tags: ['days and times', 'can', 'messages'],
      title: 'The Wrong Message',
      scene: 'hangar',
      briefing: [
        "Today is Tuesday. The shuttle trip to the Moon is at 10 o'clock.",
        "But there's a note on the hangar door: 'NO TRIP TODAY!' Now nobody is here.",
        "The trip ISN'T cancelled! Who is writing the wrong message — and why?",
      ],
      suspects: [
        {
          id: 's1', name: 'Captain Nia', role: 'the shuttle pilot', look: 'officer',
          statement: "I'm Captain Nia. I fly the shuttle every Tuesday. I always write with a black pen. Right now I'm waiting for the students!",
        },
        {
          id: 's2', name: 'Zib', role: 'an alien from planet Zoom', look: 'alien',
          statement: "Hello! I'm Zib. I can speak English, but I can't write it yet. I only write in Zoom letters.",
        },
        {
          id: 's3', name: 'Amara', role: "the captain's helper", look: 'girl-ginger',
          statement: "Hi, I'm Amara. I help the captain on Tuesdays and Thursdays. I'm writing lots of notes today with my new purple pen!",
        },
      ],
      evidence: [
        {
          id: 'e1', name: 'The note on the door', sprite: 'note', x: 0.14, y: 0.62,
          description: "The note says: 'NO TRIP TODAY! The shuttle is in repair.' The writing is purple.",
        },
        {
          id: 'e2', name: 'The timetable', sprite: 'tablet', x: 0.34, y: 0.82,
          description: 'Hangar timetable. Tuesday: Moon trip at 10.00. Thursday: NO TRIP — the shuttle is in repair.',
        },
        {
          id: 'e3', name: 'A cup of hot chocolate', sprite: 'cup', x: 0.52, y: 0.6,
          description: "A cup of hot chocolate. It's Captain Nia's cup. It's still hot.",
        },
        {
          id: 'e4', name: "Zib's notebook", sprite: 'book', x: 0.7, y: 0.84,
          description: "Zib's notebook. All the words are in Zoom letters. There aren't any English words in it.",
        },
        {
          id: 'e5', name: 'A purple watch', sprite: 'watch', x: 0.86, y: 0.64, hidden: true,
          description: "A purple watch with the name 'Amara' on it. It says THURSDAY — but today is Tuesday!",
        },
      ],
      questions: [
        {
          id: 'q1', category: 'reading-detail', requires: ['e2'],
          prompt: 'Look at the timetable. When is there NO trip?',
          choices: ['On Tuesday', 'On Thursday', 'Every day'],
          answer: 1,
          feedback: "The timetable says: 'Thursday: NO TRIP — the shuttle is in repair.' On Tuesday there IS a trip, at 10.00.",
        },
        {
          id: 'q2', category: 'reading-inference', requires: ['s1', 'e1'],
          prompt: "The writing on the note is purple. Is it Captain Nia's note?",
          choices: ['Yes — she flies the shuttle.', "Yes — she's in the hangar.", 'No — she always writes with a black pen.'],
          answer: 2,
          feedback: "Captain Nia says: 'I always write with a black pen.' The writing on the note is purple, so it isn't her note.",
        },
        {
          id: 'q3', category: 'reading-inference', requires: ['s2', 'e1', 'e4'],
          prompt: "Why can't Zib be the writer of the note?",
          choices: ["He can't write in English yet.", "He hasn't got a pen.", "He isn't in the hangar."],
          answer: 0,
          feedback: "Zib says: 'I can't write it yet. I only write in Zoom letters.' His notebook hasn't got any English words. But the note is in English.",
        },
        {
          id: 'q4', category: 'reading-detail', requires: ['s3'], reveals: ['e5'],
          prompt: 'What is Amara writing with today?',
          choices: ['A black pen', 'A new purple pen', 'A blue pencil'],
          answer: 1,
          feedback: "Amara says: 'I'm writing lots of notes today with my new purple pen!' The note is purple too… Look, a new clue!",
        },
        {
          id: 'q5', category: 'reading-inference', requires: ['e5', 'e2'],
          prompt: "Why does Amara write 'NO TRIP TODAY'?",
          choices: ["She doesn't like the Moon.", 'The shuttle is broken today.', 'She thinks today is Thursday.'],
          answer: 2,
          feedback: "Amara's watch says THURSDAY, and the timetable says there's no trip on Thursday. So Amara thinks there's no trip today — but today is Tuesday!",
        },
      ],
      solution: {
        question: 'Who is writing the wrong message?',
        choices: ['Amara', 'Captain Nia', 'Zib'],
        answer: 0,
        explanation: "Amara! She's writing with a purple pen, and the note is purple. Her watch says Thursday, so she copies the Thursday line from the timetable. It's a mistake, not a prank!",
      },
      proof: {
        question: 'Which clue proves it?',
        choices: ["Captain Nia's hot chocolate is still hot.", 'The Moon trip is on Tuesday at 10.00.', "The note is purple, and Amara's pen is purple."],
        answer: 2,
        explanation: "Only Amara is writing with a purple pen today. The hot chocolate and the trip time are true, but they don't tell us WHO writes the note.",
      },
    },
  ],
};
