# Numeral

A daily number guessing game built with Next.js. Guess the secret 5-digit code in 6 tries.

## How to Play

- Enter a 5-digit guess using the on-screen keyboard
- After each guess, colored tiles show how close each digit is to the target
- Green: exact match, Orange: off by 1-2, Dark Orange: off by 3-4, Red: off by 5+, Purple: Hidden
- Hard mode: correct digits must stay in place

## Tech Stack

- Next.js 14+ with App Router
- TypeScript
- Tailwind CSS
- Sonner (toast notifications)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to play.

## Features

- Daily puzzles that reset at midnight
- Game state persistence (continue where you left off)
- Statistics tracking with shareable results
- Hard mode option
- Responsive design
