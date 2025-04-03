import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Authentication helpers
export const signUp = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
};

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// Organization helpers
export const getOrganizations = async (userId) => {
  const { data, error } = await supabase
    .from('user_organizations')
    .select(`
      organization_id,
      role,
      organizations (
        id,
        name,
        industry,
        size,
        logo_url
      )
    `)
    .eq('user_id', userId);
  
  return { data, error };
};

export const createOrganization = async (organizationData) => {
  const { data, error } = await supabase
    .from('organizations')
    .insert(organizationData)
    .select()
    .single();
  
  return { data, error };
};

// Project helpers
export const getProjects = async (organizationId) => {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      project_progress (
        current_step,
        updated_at
      )
    `)
    .eq('organization_id', organizationId)
    .eq('is_archived', false)
    .order('updated_at', { ascending: false });
  
  return { data, error };
};

export const getProject = async (projectId) => {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      project_progress (
        *
      )
    `)
    .eq('id', projectId)
    .single();
  
  return { data, error };
};

export const createProject = async (projectData) => {
  // First create the project
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .insert(projectData)
    .select()
    .single();
  
  if (projectError) {
    return { data: null, error: projectError };
  }
  
  // Then create the initial progress record
  const { data: progress, error: progressError } = await supabase
    .from('project_progress')
    .insert({
      project_id: project.id,
      current_step: 1,
      strategic_vision: {},
      workflows: [],
      workflow_tasks: [],
      implementation_phases: [],
      selected_tools: []
    })
    .select()
    .single();
  
  if (progressError) {
    return { data: project, error: progressError };
  }
  
  return { data: { ...project, project_progress: progress }, error: null };
};

export const updateProjectProgress = async (projectId, progressData) => {
  const { data, error } = await supabase
    .from('project_progress')
    .update(progressData)
    .eq('project_id', projectId)
    .select()
    .single();
  
  return { data, error };
};

// AI Tools helpers
export const getAITools = async (filters = {}) => {
  let query = supabase
    .from('ai_tools')
    .select('*');
  
  // Apply filters if provided
  if (filters.category) {
    query = query.eq('category', filters.category);
  }
  
  if (filters.complexity_level) {
    query = query.eq('complexity_level', filters.complexity_level);
  }
  
  if (filters.pricing_model) {
    query = query.eq('pricing_model', filters.pricing_model);
  }
  
  const { data, error } = await query;
  return { data, error };
};

// Assessment Results helpers
export const saveAssessmentResult = async (resultData) => {
  const { data, error } = await supabase
    .from('assessment_results')
    .insert(resultData)
    .select()
    .single();
  
  return { data, error };
};

export const getAssessmentResults = async (projectId) => {
  const { data, error } = await supabase
    .from('assessment_results')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });
  
  return { data, error };
};

// Project Deliverables helpers
export const saveProjectDeliverable = async (deliverableData) => {
  const { data, error } = await supabase
    .from('project_deliverables')
    .insert(deliverableData)
    .select()
    .single();
  
  return { data, error };
};

export const getProjectDeliverables = async (projectId) => {
  const { data, error } = await supabase
    .from('project_deliverables')
    .select('*')
    .eq('project_id', projectId)
    .order('step_number', { ascending: true });
  
  return { data, error };
};

// Help Content helpers
export const getHelpContent = async (section) => {
  let query = supabase
    .from('help_content')
    .select('*')
    .order('order_index', { ascending: true });
  
  if (section) {
    query = query.eq('section', section);
  }
  
  const { data, error } = await query;
  return { data, error };
};

// Audit logging helper
export const logAuditEvent = async (auditData) => {
  const { error } = await supabase
    .from('audit_logs')
    .insert(auditData);
  
  return { error };
};

// Notifications helpers
export const getUserNotifications = async (userId) => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  return { data, error };
};

export const markNotificationAsRead = async (notificationId) => {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId);
  
  return { error };
};
