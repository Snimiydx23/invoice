# Invoice Data Extraction AI

Extract invoice data to Excel with AI. Upload PDF/image invoices, describe what you want to extract, and download structured data as XLSX, CSV, or JSON.

## Features

- **AI-Powered Extraction**: Upload invoices (PDF, JPG, PNG) and extract structured data using Vision AI
- **Natural Language Prompts**: Simply describe what data you need - no templates required
- **Multiple Export Formats**: Download results as Excel (.xlsx), CSV, or JSON
- **Unlimited Pages Free**: No page limits, no credit card required
- **Dark/Light Mode**: Beautiful UI with theme support
- **Responsive Design**: Works on mobile, tablet, and desktop

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS 4** + **shadcn/ui**
- **Prisma ORM** (SQLite)
- **Framer Motion** (animations)
- **VLM (Vision Language Model)** for invoice reading
- **LLM** for JSON structuring

## Quick Start (Local Development)

### 1. Install Dependencies

```bash
npm install
# or
bun install
```

### 2. Set Up Environment Variables

Copy the example env file:

```bash
cp .env.example .env
```

Edit `.env` and add your Z-AI API key (get it from https://z-ai.dev):

```
DATABASE_URL="file:./dev.db"
ZAI_API_KEY="your-api-key-here"
```

### 3. Set Up Database

```bash
npx prisma db push
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Deploy to Vercel (Free + Lifetime)

### Step 1: Push to GitHub

1. Create a new repository on [GitHub](https://github.com/new)
2. Push your code:

```bash
git init
git add .
git commit -m "Initial commit: Invoice Data Extraction AI"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

### Step 2: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New" → "Project"**
3. Select your GitHub repository
4. Configure settings:
   - **Framework Preset**: Next.js (auto-detected)
   - **Build Command**: `prisma generate && next build` (already set in package.json)
   - **Output Directory**: `.next` (auto-detected)
5. Add **Environment Variables**:
   - `DATABASE_URL` = `file:./dev.db`
   - `ZAI_API_KEY` = `your-z-ai-api-key`
6. Click **"Deploy"** 🚀

### Step 3: Your App is Live!

Vercel will give you a URL like: `https://your-project.vercel.app`

---

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `DATABASE_URL` | SQLite database path | Yes | `file:./dev.db` |
| `ZAI_API_KEY` | Z-AI API key for VLM/LLM | Yes | - |

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── extract/route.ts    # AI extraction endpoint
│   │   └── download/route.ts   # Download XLSX/CSV/JSON
│   ├── layout.tsx              # Root layout with theme
│   ├── page.tsx                # Main landing page
│   └── globals.css             # Global styles
├── components/
│   ├── header.tsx              # Navigation bar
│   ├── hero-section.tsx        # Hero section
│   ├── extraction-tool.tsx     # Core extraction tool
│   ├── sample-output.tsx       # Spreadsheet preview
│   ├── document-types.tsx      # Supported document types
│   ├── how-it-works.tsx        # How it works section
│   ├── features-section.tsx    # Feature cards
│   ├── finance-roles.tsx       # Role-specific sections
│   ├── api-section.tsx         # API documentation
│   ├── security-section.tsx    # Security & compliance
│   ├── footer.tsx              # Footer
│   └── ui/                     # shadcn/ui components
├── lib/
│   ├── db.ts                   # Prisma client
│   └── utils.ts                # Utility functions
└── hooks/                      # Custom React hooks
prisma/
└── schema.prisma               # Database schema
```

---

## How It Works

1. **Upload** your invoice files (PDF, JPG, PNG)
2. **Describe** what data you want to extract in natural language
3. **Click Extract** — AI reads each document and extracts structured data
4. **Download** results as Excel, CSV, or JSON

---

## License

MIT
