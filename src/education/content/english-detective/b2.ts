import type { DetectiveCase, ContentBank } from '../../types';

// Draft sample content (not yet reviewed by a Tronwell teacher).
export const bank: ContentBank<DetectiveCase> = {
  game: 'english-detective',
  level: 'B2',
  items: [
    {
      id: 'ed-b2-01',
      level: 'B2',
      games: ['english-detective'],
      objective: 'Inference from conflicting testimonies, reported speech and the passive',
      difficulty: 2,
      status: 'draft',
      tags: ['reported speech', 'passive', 'deduction'],
      title: 'The Frozen Seedlings',
      scene: 'lab',
      briefing: [
        "For six weeks Dr Rosa Díaz had been growing Martian tomato seedlings in the lab's warm room.",
        'On Monday morning they were found frozen: the heater had been switched off during the night.',
        "Three people were in or near the lab on Sunday evening, and their stories don't quite match.",
        'Work out who switched the heater off — and, just as importantly, why.',
      ],
      suspects: [
        {
          id: 's1', name: 'Tomás', role: "Dr Rosa's lab assistant", look: 'boy-glasses',
          statement: "I locked up at seven, as I always do, and I'm certain the heater was on — I checked it twice. Ana had told me she would come back later to feed the fish, so I lent her my spare keycard. Then I went to the cinema.",
        },
        {
          id: 's2', name: 'Ana', role: 'a student volunteer', look: 'girl-dark',
          statement: "I fed the fish at about eight and left straight away — I wasn't there for more than a quarter of an hour. Everything seemed normal, although the heater was making a strange rattling noise. I gave Tomás his keycard back at breakfast.",
        },
        {
          id: 's3', name: 'Jonah', role: 'the station medic', look: 'man-beard',
          statement: "The lab's smoke alarm went off at about twenty to eleven, so I was sent to check. There was no fire, thank goodness. I reset the alarm and left. I didn't touch any of the scientific equipment — that isn't my job.",
        },
      ],
      evidence: [
        {
          id: 'e1', name: 'Heater log', sprite: 'tablet', x: 0.14, y: 0.62,
          description: "Heater log: '19.00 ON, 25 degrees. 22.37 OVERHEAT WARNING. 22.41 switched OFF by hand.' At 06.00 the lab was just 3 degrees.",
        },
        {
          id: 'e2', name: 'Spare keycard', sprite: 'keycard', x: 0.34, y: 0.84,
          description: "Tomás's spare keycard. The door system shows it was used only once on Sunday: in at 20.02, out at 20.17.",
        },
        {
          id: 'e3', name: 'Cinema ticket', sprite: 'ticket', x: 0.54, y: 0.62,
          description: "A ticket from Tomás's jacket: 'Space Pirates 3', Sunday 20.30–23.00. It was scanned at the cinema door at 20.24.",
        },
        {
          id: 'e4', name: 'Medical glove', sprite: 'glove', x: 0.72, y: 0.84, hidden: true,
          description: "A blue medical glove on the floor, right beneath the heater's OFF switch. These gloves are only used in the medical bay.",
        },
        {
          id: 'e5', name: 'Alarm report', sprite: 'note', x: 0.86, y: 0.62, hidden: true,
          description: "Alarm report, handed in by Jonah at 23.10: 'Alarm set off by an overheating machine. Problem solved.'",
        },
      ],
      questions: [
        {
          id: 'q1', category: 'reading-detail', requires: ['s1'],
          prompt: 'According to Tomás, what had Ana told him?',
          choices: ['That she would come back later to feed the fish', 'That the heater was making a strange noise', 'That she had lost her own keycard'],
          answer: 0,
          feedback: "Tomás reports Ana's words: 'Ana had told me she would come back later to feed the fish.' That's why he lent her his spare keycard.",
        },
        {
          id: 'q2', category: 'reading-inference', requires: ['s2', 'e1', 'e2'],
          prompt: "Why can't Ana have switched the heater off?",
          choices: ["She doesn't know how the heater works.", 'She was at the cinema with Tomás.', 'She had left the lab long before 22.41.'],
          answer: 2,
          feedback: 'The keycard Ana borrowed was used only once: in at 20.02, out at 20.17. The heater was switched off at 22.41 — more than two hours after she had left.',
        },
        {
          id: 'q3', category: 'reading-inference', requires: ['s1', 'e3'], reveals: ['e4'],
          prompt: "What does the cinema ticket tell us about Tomás's account?",
          choices: ['It proves he lied about the film.', 'It supports it: he was at the film from 20.24.', 'It shows that he left the film early.'],
          answer: 1,
          feedback: "The ticket was scanned at 20.24 and the film ran until 23.00, so Tomás can't have been in the lab at 22.41. Meanwhile, a new clue has been found near the heater…",
        },
        {
          id: 'q4', category: 'reading-inference', requires: ['s3', 'e4'], reveals: ['e5'],
          prompt: "Jonah insists he didn't touch any equipment. Which clue contradicts him?",
          choices: ['Ana heard the heater rattling at eight.', 'A medical glove was found under the OFF switch.', 'The alarm went off at twenty to eleven.'],
          answer: 1,
          feedback: "Medical gloves are only used in the medical bay, and one was lying right beneath the heater's OFF switch. Jonah was the only medic in the lab that night. His alarm report has now turned up too…",
        },
        {
          id: 'q5', category: 'reading-inference', requires: ['e1', 'e5'],
          prompt: 'Why must Jonah have switched the heater off?',
          choices: ['It was overheating and had set off the alarm.', 'He wanted to ruin the experiment.', 'Dr Rosa had asked him to do it.'],
          answer: 0,
          feedback: "The log shows an OVERHEAT WARNING at 22.37, and Jonah's report says the alarm was 'set off by an overheating machine. Problem solved.' He switched it off for safety — but nobody told Dr Rosa.",
        },
      ],
      solution: {
        question: 'What happened to the seedlings?',
        choices: ['Jonah switched off the overheating heater for safety.', 'Tomás forgot to switch the heater on.', 'Ana turned the noisy heater off at eight.'],
        answer: 0,
        explanation: "The heater overheated at 22.37 and set off the smoke alarm. Jonah arrived at about 22.40, and the heater was switched off by hand at 22.41. He did the right thing for safety, but he can't have known that the seedlings needed heat — and he probably didn't think a switch counted as 'equipment'.",
      },
      proof: {
        question: 'Which clue proves it?',
        choices: ["Jonah's report says the overheating problem was solved.", 'Ana heard the heater rattling at about eight.', 'Tomás checked the heater twice at seven.'],
        answer: 0,
        explanation: "Jonah's own report admits that he dealt with the overheating machine, which fits the glove under the OFF switch. Ana's rattling noise and Tomás's checks happened hours earlier and don't tell us who switched it off.",
      },
    },
    {
      id: 'ed-b2-02',
      level: 'B2',
      games: ['english-detective'],
      objective: 'Inference from reported speech and conflicting accounts',
      difficulty: 3,
      status: 'draft',
      tags: ['reported speech', 'passive', 'messages'],
      title: 'The Quiz That Never Was',
      scene: 'library',
      briefing: [
        'On Tuesday Mrs Adeyemi, the librarian, decided that the space quiz should be moved from Thursday to Friday.',
        "On Wednesday the station newsletter announced: 'SPACE QUIZ CANCELLED.' So on Friday at 6, nobody came.",
        'The message was passed along by three people before it was printed. Somewhere, it was changed.',
        'Read every account carefully and work out where — and how — it went wrong.',
      ],
      suspects: [
        {
          id: 's1', name: 'Kai', role: "Mrs Adeyemi's helper", look: 'boy-glasses',
          statement: "Mrs Adeyemi handed me a note on Tuesday and asked me to pass it on to Wen, who collects news for the newsletter. I was worried I'd forget, so I texted her straight away. I copied it word for word — check my tablet if you don't believe me.",
        },
        {
          id: 's2', name: 'Wen', role: 'the newsletter reporter', look: 'girl-dark',
          statement: "Kai's message arrived while I was running to my swimming lesson. It said the quiz wasn't happening on Thursday any more, so the next day I told Dex it had been cancelled. That's what the message said — I'm sure of it.",
        },
        {
          id: 's3', name: 'Dex', role: 'the newsletter robot', look: 'robot',
          statement: 'At 16.05 on Wednesday, Wen informed me that the space quiz had been cancelled. I printed exactly that. In 412 issues of the newsletter, I have never changed a single word I was given.',
        },
      ],
      evidence: [
        {
          id: 'e1', name: "Mrs Adeyemi's note", sprite: 'note', x: 0.14, y: 0.62,
          description: "Mrs Adeyemi's note: 'The space quiz is no longer on Thursday. It has been moved to Friday at 6 pm. Bring a friend!'",
        },
        {
          id: 'e2', name: "Kai's tablet", sprite: 'tablet', x: 0.32, y: 0.84,
          description: "Kai's text to Wen, Tuesday 15.52: 'The space quiz is no longer on Thursday. It has been moved to Friday at 6 pm. Bring a friend!'",
        },
        {
          id: 'e3', name: 'Swimming pool ticket', sprite: 'ticket', x: 0.52, y: 0.6,
          description: "A pool ticket: 'Wen — swimming lesson, Tuesday 16.00.' On the back, in Wen's handwriting: 'Late AGAIN!!'",
        },
        {
          id: 'e4', name: "Dex's message log", sprite: 'book', x: 0.7, y: 0.84, hidden: true,
          description: "Dex's log, Wednesday 16.05: 'Input from Wen: the space quiz has been cancelled. Printed: SPACE QUIZ CANCELLED.'",
        },
        {
          id: 'e5', name: "Wen's smartwatch", sprite: 'watch', x: 0.86, y: 0.62, hidden: true,
          description: "Wen's smartwatch only shows the first line of each text. Kai's text appears as: 'The space quiz is no longer on Thursday.'",
        },
      ],
      questions: [
        {
          id: 'q1', category: 'reading-detail', requires: ['s1', 'e1', 'e2'],
          prompt: "Compare Mrs Adeyemi's note with Kai's text. What do you notice?",
          choices: ['The two messages are exactly the same.', 'Kai left out the new day and time.', "Kai added the word 'cancelled'."],
          answer: 0,
          feedback: "Both say: 'The space quiz is no longer on Thursday. It has been moved to Friday at 6 pm. Bring a friend!' Kai really did copy it word for word.",
        },
        {
          id: 'q2', category: 'reading-detail', requires: ['s2'], reveals: ['e4'],
          prompt: "According to Wen, what did Kai's message say?",
          choices: ['That the quiz had been moved to Friday', "That the quiz wasn't happening on Thursday", 'That she should bring a friend'],
          answer: 1,
          feedback: "Wen reports: 'It said the quiz wasn't happening on Thursday any more.' Notice that she doesn't mention Friday at all! Meanwhile, Dex's log has been found…",
        },
        {
          id: 'q3', category: 'reading-inference', requires: ['s3', 'e4'], reveals: ['e5'],
          prompt: 'Can Dex have changed the message?',
          choices: ["Yes — he turned 'moved' into 'cancelled'.", "Yes — he removed the word 'Friday'.", 'No — his log shows he printed what Wen said.'],
          answer: 2,
          feedback: "Dex's log shows that the input from Wen was 'the space quiz has been cancelled', and that's exactly what was printed. So the message must have changed before it reached Dex. Wen's smartwatch has also been found…",
        },
        {
          id: 'q4', category: 'reading-inference', requires: ['s2', 'e3', 'e5'],
          prompt: 'Why did Wen believe the quiz had been cancelled?',
          choices: ['Kai had phoned her and said so.', "She only saw the first line of Kai's text.", 'She had read it in the newsletter.'],
          answer: 1,
          feedback: "Her watch only shows the first line: 'The space quiz is no longer on Thursday.' She was rushing to her swimming lesson ('Late AGAIN!!'), so she never opened the full text.",
        },
        {
          id: 'q5', category: 'reading-inference', requires: ['e2', 'e5'],
          prompt: "Which part of Kai's text can't Wen have seen on her watch?",
          choices: ["'It has been moved to Friday at 6 pm.'", "'The space quiz is no longer on Thursday.'", "Kai's name as the sender"],
          answer: 0,
          feedback: "The watch showed only the first sentence. The second one — 'It has been moved to Friday at 6 pm. Bring a friend!' — was hidden, so Wen guessed that the quiz had been cancelled.",
        },
      ],
      solution: {
        question: 'Where did the message go wrong?',
        choices: ["Kai copied Mrs Adeyemi's note incorrectly.", "Wen read only the first line and passed on 'cancelled'.", "Dex changed 'moved' into 'cancelled'."],
        answer: 1,
        explanation: "Kai's text matched the note exactly, and Dex printed exactly what he was told. The change happened with Wen: her watch only showed 'The space quiz is no longer on Thursday', so in her hurry she assumed it had been cancelled. An honest mistake — not a prank.",
      },
      proof: {
        question: 'Which clue proves it?',
        choices: ["Kai's text matches Mrs Adeyemi's note exactly.", 'Dex has printed 412 issues of the newsletter.', "Wen's watch only shows the first line of each text."],
        answer: 2,
        explanation: "The watch explains exactly how Wen missed the words 'moved to Friday'. Kai's matching text only shows that Kai isn't to blame, and Dex's 412 issues don't tell us anything about this message.",
      },
    },
  ],
};
