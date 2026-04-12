# Agents

# Magnetic Fundraising Toolkit

## Project Overview
AI-powered fundraising toolkit for Danish charities. Built with Next.js 14+ (App Router), TypeScript, Tailwind CSS, Supabase, and Anthropic Claude API. **ALL user-facing text is in Danish.**

## Tech Stack
- **Framework:** Next.js 14+ with App Router, TypeScript strict mode
- **Styling:** Tailwind CSS + shadcn/ui components (install via `npx shadcn@latest add [component]`)
- **Backend:** Supabase (PostgreSQL, Row Level Security, Auth, Edge Functions, Storage)
- **AI:** Anthropic Claude API (claude-sonnet-4-6) called from Next.js API routes
- **Icons:** lucide-react
- **File parsing:** papaparse (CSV), xlsx (Excel)
- **Future payments:** Stripe (DKK) + MobilePay via Stripe local methods

## Directory Structure
```
src/
  app/
    page.tsx                    # Landing page (/)
    login/page.tsx              # Login (/login)
    signup/page.tsx             # Sign up (/signup)
    onboarding/page.tsx         # Charity profile setup (/onboarding)
    dashboard/page.tsx          # Main hub (/dashboard)
    profile/page.tsx            # Edit profile (/profile)
    library/page.tsx            # Saved outputs (/library)
    tool/
      copywriter/page.tsx       # Fundraising Tekstforfatter
      strategy/page.tsx         # Strategi Arkitekt (chat UI)
      data-cleansing/page.tsx   # Datarensning & Formatering
      stewardship/page.tsx      # Stewardship Planner
      journey/page.tsx          # Supporter Journey Designer
      case-builder/page.tsx     # Case for Support Builder
    api/
      generate/route.ts         # AI generation endpoint
      analyze-data/route.ts     # Data cleansing endpoint
  components/
    ui/                         # shadcn/ui components
    layout/
      Sidebar.tsx               # Navigation sidebar
      Header.tsx                # Page header
      ProtectedRoute.tsx        # Auth wrapper
    tools/
      ToolLayout.tsx            # Split-screen template (form left, output right)
      OutputViewer.tsx          # Formatted output display
      OutputActions.tsx         # Save, Copy, Regenerate, Export buttons
      ChatInterface.tsx         # Chat UI for Strategy tool
      StepperForm.tsx           # Multi-step form for Case Builder
      FileUploader.tsx          # Drag-and-drop for Data Cleansing
  lib/
    supabase/
      client.ts                 # Browser Supabase client
      server.ts                 # Server Supabase client
      middleware.ts             # Auth middleware
    ai/
      prompts.ts                # System prompts for each tool
      generate.ts               # Claude API call wrapper
    utils.ts                    # Helper functions
  hooks/
    useProfile.ts               # Load org profile
    useOutputs.ts               # CRUD for saved outputs
    useUsage.ts                 # Usage tracking
  types/
    index.ts                    # TypeScript interfaces
```

## Database Schema (Supabase)

### Table: organisation_profiles
- id (uuid, PK, default gen_random_uuid())
- user_id (uuid, FK -> auth.users, unique)
- name (text, not null)
- cvr_number (text)
- website_url (text)
- mission (text)
- programs (text)
- target_audience (text)
- geographic_focus (text)
- key_messages (text)
- brand_voice (text)
- annual_income (text)
- logo_url (text)
- created_at (timestamptz, default now())
- updated_at (timestamptz, default now())

### Table: outputs
- id (uuid, PK, default gen_random_uuid())
- user_id (uuid, FK -> auth.users, not null)
- tool_slug (text, not null)
- title (text)
- input_data (jsonb)
- output_text (text, not null)
- created_at (timestamptz, default now())

### Table: usage_log
- id (uuid, PK, default gen_random_uuid())
- user_id (uuid, FK -> auth.users, not null)
- tool_slug (text, not null)
- tokens_used (integer)
- created_at (timestamptz, default now())

### Row Level Security
All tables: enable RLS. Policy: users can SELECT, INSERT, UPDATE, DELETE only rows where user_id = auth.uid().

## Design System
- Primary: 1B4F72
- Secondary: 2E75B6
- Accent/CTA: 27AE60
- Background: F5F7FA
- Cards: FFFFFF with shadow-sm
- Destructive: E74C3C
- Text: 333333
- Muted: 718096
- Font: Inter (via next/font/google) or system sans-serif
- Border radius: rounded-lg (8px) for cards, rounded-md (6px) for inputs
- Spacing: generous, p-6 for cards, gap-6 for grids

## Language
- ALL UI labels, buttons, placeholders, error messages, and headings are in Danish
- AI prompts are written natively in Danish
- Reference Danish fundraising terms: indsamling, legater, stottemedlemskab, fradrag
- Reference Danish law: section 8A fradrag, arveloven, ISOBRO guidelines

## 6 AI Tools
1. Fundraising Tekstforfatter (/tool/copywriter) - form input, generates copy
2. Strategi Arkitekt (/tool/strategy) - CHAT interface, builds strategy
3. Datarensning & Formatering (/tool/data-cleansing) - FILE UPLOAD, analyses data
4. Stewardship Planner (/tool/stewardship) - form input, generates plan
5. Supporter Journey Designer (/tool/journey) - form input, generates journey
6. Case for Support Builder (/tool/case-builder) - MULTI-STEP form (4 steps)

## Coding Standards
- TypeScript strict mode, no `any` types
- Use shadcn/ui components (install as needed)
- Server Components by default, add "use client" only when needed
- Use Next.js App Router conventions (layout.tsx, page.tsx, loading.tsx, error.tsx)
- API routes in src/app/api/ using Route Handlers
- Environment variables via process.env (server) or NEXT_PUBLIC_ (client)
- Handle loading and error states on every page
- All components must be responsive (mobile-first with Tailwind breakpoints)
- Commit messages in English, descriptive (e.g., "Add copywriter tool form and output display")
