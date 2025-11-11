# Recipe Blog

A modern, full-featured recipe blog built with Next.js, Prisma, PostgreSQL, Clerk authentication, and Vercel Blob Storage.

## Features

- 🍳 **Recipe Management**: Full CRUD operations for recipes
- 🔐 **Authentication**: Secure admin authentication with Clerk
- 📸 **Image Uploads**: Upload recipe images to Vercel Blob Storage
- 🎨 **Modern UI**: Beautiful, responsive design with Tailwind CSS and shadcn/ui
- 🚀 **Vercel Ready**: Optimized for deployment on Vercel

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Clerk
- **Storage**: Vercel Blob Storage
- **Styling**: Tailwind CSS + shadcn/ui
- **Deployment**: Vercel

## Prerequisites

- Node.js 18+ and npm
- A PostgreSQL database (Vercel Postgres recommended)
- A Clerk account for authentication
- A Vercel account for deployment

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...

# App URL (for production, use your Vercel deployment URL)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Database Setup

#### Option A: Vercel Postgres (Recommended)

1. Go to your Vercel dashboard
2. Navigate to your project → Storage → Create Database
3. Select "Postgres"
4. Copy the `POSTGRES_URL` connection string to your `.env` as `DATABASE_URL`

#### Option B: Local PostgreSQL

1. Install PostgreSQL locally
2. Create a new database
3. Use the connection string: `postgresql://user:password@localhost:5432/recipe_blog`

### 4. Run Database Migrations

```bash
npx prisma migrate dev --name init
```

This will:
- Create the database schema
- Generate the Prisma Client

### 5. Generate Prisma Client

```bash
npx prisma generate
```

### 6. Clerk Setup

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Create a new application
3. Copy your Publishable Key and Secret Key to `.env`
4. Configure allowed redirect URLs:
   - Development: `http://localhost:3000`
   - Production: Your Vercel deployment URL

### 7. Vercel Blob Storage Setup

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to your project → Settings → Environment Variables
3. Add `BLOB_READ_WRITE_TOKEN` (you can get this from Vercel Blob Storage settings)
4. Or use the Vercel CLI: `vercel blob:token`

### 8. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your application.

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── recipes/          # Recipe API endpoints
│   │   └── upload/           # Image upload endpoint
│   ├── admin/                # Admin dashboard pages
│   ├── recipes/              # Public recipe pages
│   ├── layout.tsx            # Root layout with ClerkProvider
│   └── page.tsx              # Home page
├── components/
│   ├── ui/                   # shadcn/ui components
│   └── nav.tsx               # Navigation component
├── lib/
│   ├── prisma.ts             # Prisma client instance
│   └── utils.ts              # Utility functions
├── prisma/
│   └── schema.prisma         # Database schema
└── middleware.ts             # Clerk middleware
```

## Database Schema

The `Recipe` model includes:

- `recipe_id`: Primary key (auto-increment)
- `title`: Recipe title (required)
- `slug`: URL-friendly identifier (required, unique)
- `description`: Recipe description
- `prep_time_min`: Preparation time in minutes
- `cook_time_min`: Cooking time in minutes
- `servings`: Number of servings
- `image_url`: URL to recipe image
- `ingredients`: JSON array of ingredients
- `instructions`: JSON array of instruction steps
- `published_date`: Publication timestamp
- `updated_date`: Last update timestamp (auto-updated)

## API Routes

### Public Routes

- `GET /api/recipes` - Get all recipes
- `GET /api/recipes/[slug]` - Get a single recipe by slug

### Admin Routes (Requires Authentication)

- `POST /api/recipes` - Create a new recipe
- `PUT /api/admin/recipes/[id]` - Update a recipe
- `DELETE /api/admin/recipes/[id]` - Delete a recipe
- `POST /api/upload` - Upload an image

## Deployment to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/new)
2. Import your GitHub repository
3. Add environment variables in Vercel dashboard:
   - `DATABASE_URL`
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - `BLOB_READ_WRITE_TOKEN`
   - `NEXT_PUBLIC_APP_URL` (your Vercel deployment URL)

### 3. Run Migrations in Production

After deployment, run migrations:

```bash
npx prisma migrate deploy
```

Or use Vercel's build command to run migrations automatically by adding to `package.json`:

```json
{
  "scripts": {
    "postinstall": "prisma generate && prisma migrate deploy"
  }
}
```

### 4. Update Clerk Redirect URLs

In Clerk dashboard, add your production URL to allowed redirect URLs.

## Usage

### Creating a Recipe

1. Sign in with Clerk
2. Navigate to `/admin`
3. Click "New Recipe"
4. Fill in the recipe details
5. Add ingredients and instructions
6. Upload an image (optional)
7. Click "Create Recipe"

### Editing a Recipe

1. Go to `/admin`
2. Click "Edit" on any recipe
3. Make your changes
4. Click "Update Recipe"

### Deleting a Recipe

1. Go to `/admin`
2. Click "Delete" on any recipe
3. Confirm deletion

## Troubleshooting

### Database Connection Issues

- Verify your `DATABASE_URL` is correct
- Ensure your database is accessible from your network
- For Vercel Postgres, check SSL mode is set correctly

### Clerk Authentication Issues

- Verify your Clerk keys are correct
- Check that redirect URLs are configured in Clerk dashboard
- Ensure `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is prefixed with `NEXT_PUBLIC_`

### Image Upload Issues

- Verify `BLOB_READ_WRITE_TOKEN` is set correctly
- Check file size (max 5MB)
- Ensure file is an image type

### Prisma Issues

- Run `npx prisma generate` after schema changes
- Run `npx prisma migrate dev` for local development
- Run `npx prisma migrate deploy` for production

## Development

### Prisma Studio

View and edit your database with Prisma Studio:

```bash
npx prisma studio
```

### Type Checking

```bash
npm run build
```

### Linting

```bash
npm run lint
```

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.
