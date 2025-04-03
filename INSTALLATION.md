# Installation Guide for AI Implementation Journey Application

## Prerequisites
- Node.js 16+ and npm
- Supabase account (for database and authentication)

## Step 1: Database Setup
1. Create a new Supabase project at https://supabase.com
2. Go to the SQL Editor in your Supabase dashboard
3. Run the SQL script in `database-schema.sql` to create the necessary tables and relationships
4. Note your Supabase URL and anon key for the next step

## Step 2: Environment Setup
1. Copy `.env.template` to `.env.local` in the frontend directory
2. Replace the placeholder values with your actual Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

## Step 3: Application Installation
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. For production, build the application: `npm run build`
5. Start the production server: `npm start`

## Step 4: Deployment Options
### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Configure environment variables in the Vercel dashboard
3. Deploy

### Traditional Hosting
1. Build the application: `npm run build`
2. Deploy the `out` directory to your web server

## Troubleshooting
- If you encounter database connection issues, verify your Supabase credentials
- For authentication problems, check that RLS policies are properly configured
- For deployment issues, ensure all environment variables are correctly set
