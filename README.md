# Draw Together

Real-time collaborative drawing platform built with Next.js and Socket.io.

![Draw Together](/thumbnail.png)

## Live Demo

[draw-together-nextjs.vercel.app](https://draw-together-nextjs.vercel.app/)

## Tech Stack

### Client

- [Next.js](https://nextjs.org/) (React 19)
- [Socket.io Client](https://socket.io/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/)
- [Zustand](https://zustand.docs.pmnd.rs/) (State Management)
- [Framer Motion](https://www.framer.com/motion/) (Animations)
- [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) (Validation)
- [Biome](https://biomejs.dev/) (Linting & Formatting)
- [Vitest](https://vitest.dev/) + [Playwright](https://playwright.dev/) (Testing)

### Server

- [Bun](https://bun.sh/) (Runtime)
- [Socket.io](https://socket.io/)
- [Zod](https://zod.dev/) (Validation)
- [Biome](https://biomejs.dev/) (Linting & Formatting)

## Features

- **Collaborative Drawing** — Real-time multi-user drawing with live cursor tracking
- **Drawing Tools** — Pencil, line, rectangle, circle with configurable stroke width and color
- **Rich Color Picker** — Full color palette with custom color selection
- **Chat System** — Real-time messaging with sender names, timestamps, message grouping, emojis, typing indicators, and unread badges
- **System Messages** — Join/leave events displayed inline in chat
- **User Presence** — Active drawing vs idle status indicators
- **User Roles** — Admin/viewer permissions with kick, lock canvas, and promote controls
- **Password-Protected Rooms** — Optional password requirement for room access
- **Room Invite Links** — Shareable links that auto-fill room ID on join
- **Drawing Attribution** — Visual indication of which user drew each stroke
- **Canvas Controls** — Undo, clear, and download canvas as image
- **Theme** — Dark mode UI

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Bun](https://bun.sh/)

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/baxsm/draw-together-nextjs.git
   cd draw-together-nextjs
   ```

2. Install dependencies:

   ```bash
   # Client
   cd client
   npm install

   # Server
   cd ../server
   bun install
   ```

3. Start development servers:

   ```bash
   # Server (from /server)
   bun dev

   # Client (from /client)
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000)

### Testing

```bash
# Client unit tests
cd client
npm test

# Client E2E tests
npm run test:e2e

# Server tests
cd server
bun test
```

## License

MIT
