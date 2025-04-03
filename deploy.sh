#!/bin/bash

# Deployment script for AI Implementation Journey application
# This script prepares and packages the application for deployment

echo "=== AI Implementation Journey Application Deployment ==="
echo "Starting deployment process..."

# Create deployment directory
DEPLOY_DIR="ai-journey-app-deployment"
mkdir -p $DEPLOY_DIR

# Copy frontend files
echo "Copying frontend files..."
mkdir -p $DEPLOY_DIR/frontend
cp -r ai-journey-app/frontend/* $DEPLOY_DIR/frontend/

# Copy database schema
echo "Copying database schema..."
cp ai-journey-app/database-schema.sql $DEPLOY_DIR/

# Copy documentation
echo "Copying documentation..."
cp ai-journey-app/README.md $DEPLOY_DIR/
cp ai-journey-app/architecture.md $DEPLOY_DIR/
cp ai-journey-app/user-journey.md $DEPLOY_DIR/

# Create environment template
echo "Creating environment template..."
cat > $DEPLOY_DIR/frontend/.env.template << EOL
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EOL

# Create installation guide
echo "Creating installation guide..."
cat > $DEPLOY_DIR/INSTALLATION.md << EOL
# Installation Guide for AI Implementation Journey Application

## Prerequisites
- Node.js 16+ and npm
- Supabase account (for database and authentication)

## Step 1: Database Setup
1. Create a new Supabase project at https://supabase.com
2. Go to the SQL Editor in your Supabase dashboard
3. Run the SQL script in \`database-schema.sql\` to create the necessary tables and relationships
4. Note your Supabase URL and anon key for the next step

## Step 2: Environment Setup
1. Copy \`.env.template\` to \`.env.local\` in the frontend directory
2. Replace the placeholder values with your actual Supabase credentials:
   \`\`\`
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   \`\`\`

## Step 3: Application Installation
1. Navigate to the frontend directory: \`cd frontend\`
2. Install dependencies: \`npm install\`
3. Start the development server: \`npm run dev\`
4. For production, build the application: \`npm run build\`
5. Start the production server: \`npm start\`

## Step 4: Deployment Options
### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Configure environment variables in the Vercel dashboard
3. Deploy

### Traditional Hosting
1. Build the application: \`npm run build\`
2. Deploy the \`out\` directory to your web server

## Troubleshooting
- If you encounter database connection issues, verify your Supabase credentials
- For authentication problems, check that RLS policies are properly configured
- For deployment issues, ensure all environment variables are correctly set
EOL

# Create user guide
echo "Creating user guide..."
cat > $DEPLOY_DIR/USER_GUIDE.md << EOL
# User Guide for AI Implementation Journey Application

## Getting Started

### Registration and Login
1. Navigate to the application landing page
2. Click "Sign Up" to create a new account
3. Enter your email and password
4. Verify your email if required
5. Log in with your credentials

### Creating an Organization
1. After logging in, you'll be prompted to create or join an organization
2. Click "Create Organization"
3. Enter organization details (name, description)
4. Upload an organization logo (optional)
5. Click "Create"

### Inviting Team Members
1. Go to Organization Settings
2. Click "Invite Members"
3. Enter email addresses and select roles
4. Click "Send Invitations"

## Starting Your AI Journey

### Creating a Project
1. From the dashboard, click "New Project"
2. Enter project details (title, description)
3. Click "Create Project"

### Completing the Assessment Steps

#### Step 1: Strategic Canvas
1. Define your business goals and AI strategy
2. Fill in each section of the canvas
3. Click "Save & Continue"

#### Step 2: Starting Point Analysis
1. Answer the questions about your current state
2. The system will determine your starting point (Manual, Existing Software, or New Problem)
3. Click "Save & Continue"

#### Step 3: Strategy Selection
1. Review the recommended strategies
2. Select the most appropriate strategy for your organization
3. Click "Save & Continue"

#### Step 4: Strategy Onboarding
1. Customize your preferences for the selected strategy
2. Set priorities and constraints
3. Click "Save & Continue"

#### Step 5: Workflow Analysis
1. Identify key workflows in your organization
2. Add each workflow and provide details
3. Rate each workflow on complexity and data readiness
4. Click "Save & Continue"

#### Step 6: Task Deconstruction
1. Break down each workflow into specific tasks
2. Rate each task on predictability, data availability, complexity, and frequency
3. The system will calculate AI potential scores
4. Click "Save & Continue"

#### Step 7: Process Mapping
1. Create visual process maps for your workflows
2. Add nodes and connections to represent the process
3. Click "Save & Continue"

#### Step 8: Implementation Plan
1. Review the recommended implementation phases
2. Customize the plan based on your organization's needs
3. Adjust timeline, resources, and budget as needed
4. Click "Save & Continue"

#### Step 9: AI Tools Selection
1. Review recommended AI tools based on your assessment
2. Select the tools that best fit your needs
3. Click "Save & Complete"

## Using the Results

### Viewing Insights
1. Navigate to the Insights tab
2. Review the AI potential analysis for your workflows and tasks
3. Explore recommendations and quick wins

### Viewing Visualizations
1. Navigate to the Visualizations tab
2. Explore charts showing workflow potential, task distribution, and implementation timeline
3. Use these visualizations to inform decision-making

### Downloading Reports
1. Navigate to the Reports tab
2. Select the report type you want to download
3. Click "Generate Report"
4. Download the PDF or Excel file

## Next Steps

### Implementing Your Plan
1. Follow the phased implementation plan
2. Start with quick wins to demonstrate value
3. Track progress and adjust as needed

### Updating Your Assessment
1. Return to the application periodically to update your assessment
2. As you implement AI solutions, update task and workflow statuses
3. The system will provide updated recommendations based on your progress
EOL

# Create admin guide
echo "Creating admin guide..."
cat > $DEPLOY_DIR/ADMIN_GUIDE.md << EOL
# Administrator Guide for AI Implementation Journey Application

## System Administration

### User Management
1. Navigate to the Admin Dashboard
2. Click "Users" to view all users
3. You can:
   - Create new users
   - Edit user details
   - Disable user accounts
   - Reset passwords

### Organization Management
1. Navigate to the Admin Dashboard
2. Click "Organizations" to view all organizations
3. You can:
   - Create new organizations
   - Edit organization details
   - Manage organization members
   - Delete organizations

### Project Management
1. Navigate to the Admin Dashboard
2. Click "Projects" to view all projects
3. You can:
   - View project details
   - Monitor project progress
   - Access project data
   - Delete projects

## Database Administration

### Backup and Restore
1. Use Supabase dashboard to create database backups
2. Schedule regular backups
3. Restore from backup if needed

### Data Migration
1. Export data using Supabase dashboard
2. Import data using SQL scripts
3. Verify data integrity after migration

## Security Administration

### Authentication Settings
1. Configure authentication providers in Supabase dashboard
2. Set password policies
3. Enable/disable email verification

### Authorization Policies
1. Review and update Row Level Security (RLS) policies
2. Ensure proper access controls for organizations and projects
3. Test security policies regularly

## Monitoring and Maintenance

### Performance Monitoring
1. Monitor application performance
2. Check database query performance
3. Optimize slow queries

### Error Logging
1. Review error logs
2. Address recurring errors
3. Implement fixes for common issues

### Updates and Patches
1. Keep dependencies up to date
2. Apply security patches promptly
3. Test updates in staging environment before deploying to production
EOL

# Create deployment guide
echo "Creating deployment guide..."
cat > $DEPLOY_DIR/DEPLOYMENT_GUIDE.md << EOL
# Deployment Guide for AI Implementation Journey Application

## Deployment Options

### Option 1: Vercel Deployment (Recommended)

#### Prerequisites
- GitHub repository with your application code
- Vercel account

#### Steps
1. Push your code to GitHub
2. Log in to Vercel and click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - Framework Preset: Next.js
   - Root Directory: frontend
   - Build Command: npm run build
   - Output Directory: .next
5. Add environment variables:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
6. Click "Deploy"
7. Once deployed, you can configure a custom domain

### Option 2: Traditional Hosting

#### Prerequisites
- Web server (Apache, Nginx, etc.)
- Node.js environment

#### Steps
1. Build the application:
   \`\`\`
   cd frontend
   npm run build
   \`\`\`
2. Set up environment variables on your server
3. Transfer the build files to your server
4. Configure your web server to serve the application
5. Set up SSL certificate for HTTPS

### Option 3: Docker Deployment

#### Prerequisites
- Docker and Docker Compose

#### Steps
1. Create a Dockerfile in the frontend directory:
   \`\`\`
   FROM node:16-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   RUN npm run build
   EXPOSE 3000
   CMD ["npm", "start"]
   \`\`\`
2. Create a docker-compose.yml file:
   \`\`\`
   version: '3'
   services:
     app:
       build: ./frontend
       ports:
         - "3000:3000"
       environment:
         - NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
         - NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   \`\`\`
3. Build and run the Docker container:
   \`\`\`
   docker-compose up -d
   \`\`\`

## Post-Deployment Tasks

### Verify Deployment
1. Test all application features
2. Verify database connection
3. Check authentication functionality

### Set Up Monitoring
1. Configure uptime monitoring
2. Set up error tracking
3. Implement performance monitoring

### Configure Backups
1. Set up database backups
2. Configure backup retention policy
3. Test backup restoration process

### Security Hardening
1. Enable HTTPS
2. Configure security headers
3. Set up rate limiting
4. Implement DDoS protection
EOL

# Create package.json for the deployment package
echo "Creating package.json for deployment..."
cat > $DEPLOY_DIR/package.json << EOL
{
  "name": "ai-journey-app-deployment",
  "version": "1.0.0",
  "description": "AI Implementation Journey Application Deployment Package",
  "scripts": {
    "setup": "cd frontend && npm install",
    "dev": "cd frontend && npm run dev",
    "build": "cd frontend && npm run build",
    "start": "cd frontend && npm start"
  },
  "author": "",
  "license": "MIT"
}
EOL

# Create zip file of the deployment package
echo "Creating deployment zip file..."
zip -r ai-journey-app-deployment.zip $DEPLOY_DIR

echo "Deployment package created successfully!"
echo "Deployment zip file: ai-journey-app-deployment.zip"
