import type { DetectiveCase, ContentBank } from '../../types';

// Draft sample content (not yet reviewed by a Tronwell teacher).
export const bank: ContentBank<DetectiveCase> = {
  game: 'english-detective',
  level: 'B1',
  items: [
    {
      id: 'ed-b1-01',
      level: 'B1',
      games: ['english-detective'],
      objective: 'Inference from past continuous alibis and a timeline',
      difficulty: 2,
      status: 'draft',
      tags: ['past continuous', 'alibis', 'timeline'],
      title: 'The Drone That Crashed',
      scene: 'hangar',
      briefing: [
        "This morning Kai found his racing drone, Falcon, on the hangar floor with a broken wing.",
        'He left it on the workbench at 7 pm last night. Its flight log shows that someone switched it on later.',
        "Three people were near the hangar last night. Who flew Falcon — and why hasn't anyone owned up?",
      ],
      suspects: [
        {
          id: 's1', name: 'Yuki', role: 'the station engineer', look: 'girl-dark',
          statement: "I was working under the shuttle from 7.30 until 9. I heard a crash at some point, but I was lying on my back with my head inside the engine, so I didn't see anything.",
        },
        {
          id: 's2', name: 'Marta', role: "Kai's classmate", look: 'girl-ginger',
          statement: "I've been reading a brilliant mystery novel all week. Last night I was reading in the library from 7.30 until it closed at 9. I didn't go anywhere near the hangar.",
        },
        {
          id: 's3', name: 'Zib', role: 'an alien from planet Zoom', look: 'alien',
          statement: "I was helping Gus in the garden from 7 until 9 — we were watering the moon trees. Earth drones? I don't even know how they work! I can fly by myself, so why would I need one?",
        },
      ],
      evidence: [
        {
          id: 'e1', name: "Falcon's flight log", sprite: 'tablet', x: 0.14, y: 0.64,
          description: "Flight log: 'Owner: Kai — always PRO mode.' Last night: 'Switched on 8.09 pm in BEGINNER mode. 8.14 pm: CRASH — left wing.'",
        },
        {
          id: 'e2', name: 'Shuttle camera photo', sprite: 'photo', x: 0.32, y: 0.84,
          description: "Shuttle camera, 8.00 to 8.20 pm: Yuki's boots were sticking out from under the engine. They didn't move once.",
        },
        {
          id: 'e3', name: 'Library loan slip', sprite: 'ticket', x: 0.5, y: 0.62,
          description: "Library loan slip: 'The Silent Station' — borrowed by Marta at 8.11 pm.",
        },
        {
          id: 'e4', name: 'Station map', sprite: 'map', x: 0.68, y: 0.84,
          description: 'Station map: the library is on Deck 5, about 15 minutes from the hangar. The garden is right next door to the hangar.',
        },
        {
          id: 'e5', name: "Gus's garden diary", sprite: 'book', x: 0.86, y: 0.62, hidden: true,
          description: "Gus's garden diary: 'Zib helped me from 7 until 8. Then he said he wanted to go next door to watch something fly.'",
        },
        {
          id: 'e6', name: 'An unfinished note', sprite: 'note', x: 0.5, y: 0.88, hidden: true,
          description: "A note under the workbench: 'Dear Kai, I'm so sorry. We don't have machines like this on Zoom, and I only wanted to try…'",
        },
      ],
      questions: [
        {
          id: 'q1', category: 'reading-detail', requires: ['e1'],
          prompt: 'According to the flight log, when did Falcon crash?',
          choices: ['At 7 pm', 'At 8.09 pm', 'At 8.14 pm'],
          answer: 2,
          feedback: "The log says: 'Switched on 8.09 pm… 8.14 pm: CRASH.' So the pilot was flying Falcon between 8.09 and 8.14.",
        },
        {
          id: 'q2', category: 'reading-inference', requires: ['s1', 'e2'],
          prompt: "Why couldn't Yuki have flown the drone?",
          choices: ['She was under the shuttle the whole time.', "She's never used a drone before.", 'She was in the library at 8 pm.'],
          answer: 0,
          feedback: "Yuki says she was working under the shuttle, and the camera shows her boots didn't move from 8.00 to 8.20 — exactly while Falcon was flying.",
        },
        {
          id: 'q3', category: 'reading-inference', requires: ['s2', 'e3', 'e4'], reveals: ['e5'],
          prompt: "Marta borrowed a book at 8.11 pm. Why couldn't she have switched Falcon on at 8.09?",
          choices: ['She was reading on Deck 1.', "She hadn't finished her novel.", 'The library is 15 minutes from the hangar.'],
          answer: 2,
          feedback: "At 8.11 Marta was borrowing a book on Deck 5, which is about 15 minutes from the hangar. She couldn't have been in the hangar two minutes earlier! A new clue has appeared…",
        },
        {
          id: 'q4', category: 'reading-inference', requires: ['s3', 'e5'], reveals: ['e6'],
          prompt: "Zib said he was in the garden from 7 until 9. What does Gus's diary show?",
          choices: ['His story is completely true.', 'He left the garden at 8 to go next door.', "He wasn't in the garden at all."],
          answer: 1,
          feedback: "Gus wrote: 'Zib helped me from 7 until 8. Then he said he wanted to go next door to watch something fly.' And the map shows that the hangar is next door to the garden.",
        },
        {
          id: 'q5', category: 'reading-inference', requires: ['e1', 's3', 'e6'],
          prompt: 'Falcon was in BEGINNER mode last night. What does that tell us?',
          choices: ['The pilot must have been a beginner.', 'Kai must have changed his favourite mode.', 'The crash must have changed the mode.'],
          answer: 0,
          feedback: "The log says Kai ALWAYS uses PRO mode, so someone else was flying — someone new to drones. Zib told us: 'I don't even know how they work!' And the note says: 'We don't have machines like this on Zoom.'",
        },
      ],
      solution: {
        question: 'What happened to Falcon?',
        choices: ['Zib tried flying it, crashed it and was too shy to say.', 'Yuki knocked it off the bench while she worked.', 'Marta flew it from the library.'],
        answer: 0,
        explanation: "Zib left the garden at 8 to 'watch something fly' next door — in the hangar. Falcon was flown in BEGINNER mode, and the unfinished note mentions Zoom. Zib was too embarrassed to finish it. Maybe Yuki can help Zib and Kai repair the wing together!",
      },
      proof: {
        question: 'Which clue proves it was Zib?',
        choices: ['The library is 15 minutes from the hangar.', 'Falcon crashed at 8.14 pm.', 'Zib left the garden at 8, and the note mentions Zoom.'],
        answer: 2,
        explanation: "Gus's diary shows that Zib's alibi is wrong, and only someone from Zoom would write that note. The map only rules out Marta, and the crash time doesn't tell us who the pilot was.",
      },
    },
    {
      id: 'ed-b1-02',
      level: 'B1',
      games: ['english-detective'],
      objective: 'Inference from past continuous alibis and present perfect',
      difficulty: 3,
      status: 'draft',
      tags: ['past continuous', 'present perfect', 'deduction'],
      title: 'The Salty Birthday Cake',
      scene: 'cafe',
      briefing: [
        "Yesterday was Captain Nia's birthday, so Chef Bruno baked her a huge lemon cake at 5 pm.",
        'At the party everyone took a bite — and it was SALTY! The captain laughed, but Bruno is very upset.',
        'Bruno was at the market from 1 until 4. Somebody has been in his storeroom. Was it a prank or a mistake?',
      ],
      suspects: [
        {
          id: 's1', name: 'Leo', role: "Sofi's brother", look: 'boy-glasses',
          statement: "I was playing football in the hangar from 1 until 4 — Coach Ben was there the whole time. Anyway, I've never been allowed into Chef Bruno's storeroom!",
        },
        {
          id: 's2', name: 'Bix', role: 'the café cleaning robot', look: 'robot',
          statement: 'Beep. From 1 until 4 I was charging on Deck 2. My battery was empty because I had cleaned every table twice. I did not open any jars.',
        },
        {
          id: 's3', name: 'Holly', role: 'a new student from England', look: 'girl-ginger',
          statement: "I've only been on the station for a week. Yesterday afternoon I was helping in the café while Chef Bruno was out. I wiped the tables and tidied the storeroom. I didn't cook anything!",
        },
      ],
      evidence: [
        {
          id: 'e1', name: 'Two big sacks', sprite: 'box', x: 0.12, y: 0.64,
          description: "Two big sacks: 'AZÚCAR' (Spanish for sugar) and 'SAL' (Spanish for salt). The SAL sack was opened yesterday.",
        },
        {
          id: 'e2', name: 'The SUGAR jar', sprite: 'bottle', x: 0.28, y: 0.84,
          description: 'The blue jar that says SUGAR. It has been filled right to the top — and the white crystals taste very salty!',
        },
        {
          id: 'e3', name: 'Hangar camera photo', sprite: 'photo', x: 0.44, y: 0.62,
          description: 'Hangar camera, 2.30 pm: Leo was scoring a goal while Coach Ben was clapping.',
        },
        {
          id: 'e4', name: 'Charging log', sprite: 'tablet', x: 0.6, y: 0.84,
          description: "Charging station, Deck 2: 'Bix — plugged in 1.02 pm, unplugged 4.05 pm. Battery: 3% → 100%.'",
        },
        {
          id: 'e5', name: 'A sticky note', sprite: 'note', x: 0.76, y: 0.62, hidden: true,
          description: "A sticky note on the storeroom door: 'Chef, I've filled the sugar jar for you! — H.'",
        },
        {
          id: 'e6', name: 'A Spanish workbook', sprite: 'book', x: 0.88, y: 0.82, hidden: true,
          description: "Holly's Spanish workbook. So far she has only learnt 'hola', 'gracias' and the numbers from 1 to 10.",
        },
      ],
      questions: [
        {
          id: 'q1', category: 'reading-inference', requires: ['e1', 'e2'],
          prompt: 'The SAL sack was opened, and the SUGAR jar tastes salty. What must have happened?',
          choices: ['Someone filled the sugar jar from the salt sack.', 'Bruno added salt to the cake on purpose.', 'The sugar went bad in the heat.'],
          answer: 0,
          feedback: "The SAL (salt) sack was opened yesterday, and the SUGAR jar 'has been filled right to the top' with something salty. Someone must have filled it from the wrong sack.",
        },
        {
          id: 'q2', category: 'reading-inference', requires: ['s1', 'e3'],
          prompt: 'Could Leo have filled the jar?',
          choices: ['Yes — he was in the café at 2.30.', 'No — he was playing football in the hangar.', 'Yes — he often helps in the storeroom.'],
          answer: 1,
          feedback: "The hangar camera shows Leo scoring a goal at 2.30 pm, and he says Coach Ben was with him the whole time. He's never even been allowed into the storeroom.",
        },
        {
          id: 'q3', category: 'reading-inference', requires: ['s2', 'e4'], reveals: ['e5'],
          prompt: 'What does the charging log tell us about Bix?',
          choices: ['He was charging all afternoon, as he said.', 'He left the charging station at 2 pm.', 'He was cleaning the storeroom at 3 pm.'],
          answer: 0,
          feedback: 'The log says Bix was plugged in from 1.02 to 4.05 pm — the whole time Bruno was out. His story is true. Look, a note has appeared on the storeroom door!',
        },
        {
          id: 'q4', category: 'reading-inference', requires: ['s3', 'e5'], reveals: ['e6'],
          prompt: 'Who must have written the sticky note?',
          choices: ['Chef Bruno', 'Bix', 'Holly'],
          answer: 2,
          feedback: "The note is signed 'H', and Holly says she was tidying the storeroom while Bruno was out. Bruno was at the market, and Bix was charging on Deck 2.",
        },
        {
          id: 'q5', category: 'reading-inference', requires: ['e1', 'e6'],
          prompt: 'Why did Holly use the wrong sack?',
          choices: ['She wanted to play a prank on the captain.', "She couldn't read the Spanish words on the sacks.", 'The AZÚCAR sack was empty.'],
          answer: 1,
          feedback: "Holly's workbook shows she has only learnt 'hola', 'gracias' and some numbers. She couldn't have known that SAL means salt and AZÚCAR means sugar!",
        },
      ],
      solution: {
        question: 'What happened to the birthday cake?',
        choices: ['Leo put salt in the sugar jar as a joke.', 'Bix mixed up the jars while he was cleaning.', 'Holly filled the sugar jar with salt by mistake.'],
        answer: 2,
        explanation: "Holly was trying to help. While she was tidying the storeroom, she filled the SUGAR jar from the SAL sack because she can't read Spanish yet. Then Bruno used the 'sugar' in the cake. Maybe the storeroom needs labels in English too!",
      },
      proof: {
        question: 'Which clue proves it?',
        choices: ['Leo scored a goal at 2.30 pm.', "Holly's note says she filled the sugar jar.", 'The cake was a lemon cake.'],
        answer: 1,
        explanation: "Holly's own note says she filled the sugar jar, and only the SAL sack was opened. Leo's goal only shows that it wasn't Leo, and the type of cake doesn't tell us anything about the salt.",
      },
    },
  ],
};
