# 💌 Ask Your Crush

A Valentine's Day invite link generator. Create a personalized invitation, share the link, and find out if your crush says yes!

## Features

- **Create Invites** - Write a heartfelt (or fun!) message with customizable themes
- **Shareable Links** - Get a unique link to send to your crush
- **Playful Responses** - Yes, Maybe, or No with fun Filipino-inspired messages
- **Email Notifications** - Get notified via email when your crush responds
- **Calendar Integration** - Add the date to your calendar when they say yes
- **Mobile Friendly** - Beautiful on any device

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: PostgreSQL with Prisma 7
- **Styling**: Tailwind CSS
- **Email**: Nodemailer (SMTP)
- **Hosting**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (or Supabase)

### Environment Variables

Create a `.env` file:

```env
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

### Installation

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Deployment

Deploy easily on Vercel:

1. Push to GitHub
2. Import project on Vercel
3. Add environment variables
4. Deploy!
