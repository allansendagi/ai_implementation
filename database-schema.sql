// This file contains the database schema for the AI Journey application
// It is written in SQL format compatible with PostgreSQL/Supabase

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Organizations table
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Organization members table (for user-organization relationships)
CREATE TABLE organization_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'member')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(organization_id, user_id)
);

-- Projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Project progress tracking
CREATE TABLE project_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  current_step INTEGER NOT NULL DEFAULT 1,
  completed_steps JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id)
);

-- Assessment data for each step
CREATE TABLE assessment_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  step TEXT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id, step)
);

-- Workflows table
CREATE TABLE workflows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  complexity TEXT NOT NULL CHECK (complexity IN ('low', 'medium', 'high')),
  data_readiness TEXT NOT NULL CHECK (data_readiness IN ('low', 'medium', 'high')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  workflow_id UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  predictability INTEGER NOT NULL CHECK (predictability BETWEEN 1 AND 5),
  data_availability INTEGER NOT NULL CHECK (data_availability BETWEEN 1 AND 5),
  complexity INTEGER NOT NULL CHECK (complexity BETWEEN 1 AND 5),
  frequency INTEGER NOT NULL CHECK (frequency BETWEEN 1 AND 5),
  ai_potential INTEGER NOT NULL CHECK (ai_potential BETWEEN 0 AND 10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Process maps table
CREATE TABLE process_maps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  workflow_id UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
  nodes JSONB NOT NULL DEFAULT '[]'::jsonb,
  edges JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id, workflow_id)
);

-- Implementation plans table
CREATE TABLE implementation_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  phases JSONB NOT NULL DEFAULT '[]'::jsonb,
  timeline TEXT NOT NULL CHECK (timeline IN ('short', 'medium', 'long')),
  resources TEXT NOT NULL CHECK (resources IN ('low', 'medium', 'high')),
  budget TEXT NOT NULL CHECK (budget IN ('low', 'medium', 'high')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id)
);

-- AI tool selections table
CREATE TABLE ai_tool_selections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  selected_tool_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  selected_tools JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id)
);

-- Create RLS policies for security
-- Enable Row Level Security
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE process_maps ENABLE ROW LEVEL SECURITY;
ALTER TABLE implementation_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_tool_selections ENABLE ROW LEVEL SECURITY;

-- Create policies for organizations
CREATE POLICY "Organizations are viewable by members" ON organizations
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM organization_members WHERE organization_id = id
    )
  );

CREATE POLICY "Organizations can be created by authenticated users" ON organizations
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Organizations can be updated by owners and admins" ON organizations
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT user_id FROM organization_members 
      WHERE organization_id = id AND role IN ('owner', 'admin')
    )
  );

-- Create policies for organization_members
CREATE POLICY "Organization members are viewable by members" ON organization_members
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM organization_members WHERE organization_id = organization_id
    )
  );

CREATE POLICY "Organization members can be created by owners and admins" ON organization_members
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM organization_members 
      WHERE organization_id = organization_id AND role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Organization members can be updated by owners and admins" ON organization_members
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT user_id FROM organization_members 
      WHERE organization_id = organization_id AND role IN ('owner', 'admin')
    )
  );

-- Create policies for projects
CREATE POLICY "Projects are viewable by organization members" ON projects
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM organization_members WHERE organization_id = organization_id
    )
  );

CREATE POLICY "Projects can be created by organization members" ON projects
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM organization_members WHERE organization_id = organization_id
    )
  );

CREATE POLICY "Projects can be updated by organization members" ON projects
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT user_id FROM organization_members WHERE organization_id = organization_id
    )
  );

-- Create similar policies for other tables
-- (Policies for project_progress, assessment_data, workflows, tasks, process_maps, implementation_plans, ai_tool_selections)
-- These would follow the same pattern as the projects table, ensuring that only organization members can access their data

-- Create indexes for performance
CREATE INDEX idx_organization_members_user_id ON organization_members(user_id);
CREATE INDEX idx_organization_members_organization_id ON organization_members(organization_id);
CREATE INDEX idx_projects_organization_id ON projects(organization_id);
CREATE INDEX idx_project_progress_project_id ON project_progress(project_id);
CREATE INDEX idx_assessment_data_project_id ON assessment_data(project_id);
CREATE INDEX idx_workflows_project_id ON workflows(project_id);
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_workflow_id ON tasks(workflow_id);
CREATE INDEX idx_process_maps_project_id ON process_maps(project_id);
CREATE INDEX idx_process_maps_workflow_id ON process_maps(workflow_id);
CREATE INDEX idx_implementation_plans_project_id ON implementation_plans(project_id);
CREATE INDEX idx_ai_tool_selections_project_id ON ai_tool_selections(project_id);
