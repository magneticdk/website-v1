# Magnetic Fundraising Toolkit

AI-drevet værktøjskasse til danske fundraisere. Skriv bedre appeller, byg stærkere strategier og forstå dine støtter med AI der kender din organisation.

## Features

- 🤖 **6 AI-powered værktøjer**: Tekstforfatter, Strategi Arkitekt, Datarensning, Arv & Testamente, Støtterrejse Designer, Case Builder
- 🔐 **Sikker autentifikation**: Supabase Auth med Row Level Security
- 📊 **Organisations-profil**: AI lærer din organisations stemme og kontekst
- 💾 **Output bibliotek**: Gem, søg og administrer dine AI-genererede outputs
- 🇩🇰 **100% dansk**: Alt tekst, AI-prompts og fundraising-kontekst på dansk

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS + shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Storage, RLS)
- **AI**: Anthropic Claude API (claude-sonnet-4)
- **Language**: TypeScript (strict mode)
- **Icons**: lucide-react
- **File Parsing**: papaparse, xlsx

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account ([sign up here](https://supabase.com))
- Anthropic API key ([get one here](https://console.anthropic.com))

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/magneticdk/website-v1.git
cd website-v1
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Copy `.env.local.example` to `.env.local`:
```bash
cp .env.local.example .env.local
```

Then fill in your credentials:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon/public key
- `ANTHROPIC_API_KEY`: Your Anthropic API key

4. **Set up Supabase database**

Run the migration in Supabase SQL Editor:
```bash
# Copy the contents of supabase/migrations/001_initial_schema.sql
# Paste into Supabase SQL Editor and run
```

This creates:
- `organisation_profiles` table
- `outputs` table
- `usage_log` table
- Row Level Security policies
- Indexes and triggers

5. **Create Supabase Storage bucket** (optional, for logo uploads)

In Supabase Storage, create a public bucket named `organisation-assets` with folder `logos/`.

6. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub** (already done)

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Add environment variables (same as `.env.local`)

3. **Deploy**
   - Vercel will automatically build and deploy
   - Your app will be live at `your-project.vercel.app`

### Environment Variables for Production

Make sure to set these in your Vercel project settings:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `ANTHROPIC_API_KEY`
- `NEXT_PUBLIC_APP_URL` (your production URL)

## Project Structure

```
src/
├── app/                      # Next.js App Router pages
│   ├── page.tsx             # Landing page
│   ├── login/               # Authentication
│   ├── signup/
│   ├── onboarding/          # Profile setup
│   ├── dashboard/           # Main hub
│   ├── profile/             # Profile editing
│   ├── library/             # Saved outputs
│   ├── tool/                # 6 AI tools
│   │   ├── copywriter/
│   │   ├── strategy/
│   │   ├── data-cleansing/
│   │   ├── stewardship/
│   │   ├── journey/
│   │   └── case-builder/
│   └── api/                 # API routes
│       ├── generate/        # AI generation
│       └── analyze-data/    # Data analysis
├── components/
│   ├── layout/              # Sidebar, Header
│   └── tools/               # Reusable tool components
├── lib/
│   ├── supabase/            # Supabase clients
│   └── ai/                  # AI prompts and generation
├── hooks/                   # Custom React hooks
└── types/                   # TypeScript definitions
```

## AI Tools

1. **Fundraising Tekstforfatter**: Generate appeals, emails, letters with A/B testing
2. **Strategi Arkitekt**: Build fundraising strategies through AI chat
3. **Datarensning & Formatering**: Clean and format donor data (CSV/Excel)
4. **Arv og Testamente**: Legacy giving program planning
5. **Støtterrejse Designer**: Map supporter journeys
6. **Søg fonde eller partnerskabe**: Create compelling cases for support

## Database Schema

See `supabase/migrations/001_initial_schema.sql` for complete schema including:
- Tables with RLS policies
- Indexes for performance
- Triggers for auto-updating timestamps

## Contributing

This is a private project for Magnetic Consulting. For questions or issues, contact the development team.

## License

© 2026 Magnetic Consulting. All rights reserved.

## Support

For support, email support@magneticconsulting.dk

---

Built with ❤️ by Magnetic Consulting for danske fundraisere
