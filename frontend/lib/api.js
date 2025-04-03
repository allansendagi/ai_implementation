// Supabase client configuration
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create a single supabase client for the entire app
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Authentication functions
export const signUp = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
};

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const resetPassword = async (email) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  
  if (error) throw error;
};

export const updatePassword = async (newPassword) => {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  
  if (error) throw error;
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error) throw error;
  return user;
};

// Organization functions
export const createOrganization = async (organizationData) => {
  const { data, error } = await supabase
    .from('organizations')
    .insert([organizationData])
    .select();
  
  if (error) throw error;
  return data[0];
};

export const getOrganization = async (id) => {
  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};

export const updateOrganization = async (id, updates) => {
  const { data, error } = await supabase
    .from('organizations')
    .update(updates)
    .eq('id', id)
    .select();
  
  if (error) throw error;
  return data[0];
};

export const getUserOrganizations = async (userId) => {
  const { data, error } = await supabase
    .from('organization_members')
    .select('organization_id, role, organizations(*)')
    .eq('user_id', userId);
  
  if (error) throw error;
  return data.map(item => ({
    ...item.organizations,
    role: item.role
  }));
};

// Project functions
export const createProject = async (projectData) => {
  const { data, error } = await supabase
    .from('projects')
    .insert([projectData])
    .select();
  
  if (error) throw error;
  
  // Initialize project progress
  await supabase
    .from('project_progress')
    .insert([{
      project_id: data[0].id,
      current_step: 1,
      completed_steps: []
    }]);
  
  return data[0];
};

export const getProject = async (id) => {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      project_progress(*),
      organization:organization_id(name)
    `)
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};

export const updateProject = async (id, updates) => {
  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', id)
    .select();
  
  if (error) throw error;
  return data[0];
};

export const getOrganizationProjects = async (organizationId) => {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      project_progress(*)
    `)
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const getUserProjects = async (userId) => {
  const { data: organizations, error: orgError } = await supabase
    .from('organization_members')
    .select('organization_id')
    .eq('user_id', userId);
  
  if (orgError) throw orgError;
  
  if (organizations.length === 0) return [];
  
  const organizationIds = organizations.map(org => org.organization_id);
  
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      project_progress(*),
      organization:organization_id(name)
    `)
    .in('organization_id', organizationIds)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

// Project progress functions
export const updateProjectProgress = async (projectId, updates) => {
  const { data, error } = await supabase
    .from('project_progress')
    .update(updates)
    .eq('project_id', projectId)
    .select();
  
  if (error) throw error;
  return data[0];
};

export const advanceProjectStep = async (projectId, currentStep, completedStep) => {
  // Get current progress
  const { data: currentProgress, error: progressError } = await supabase
    .from('project_progress')
    .select('*')
    .eq('project_id', projectId)
    .single();
  
  if (progressError) throw progressError;
  
  // Update completed steps
  const completedSteps = [...(currentProgress.completed_steps || [])];
  if (!completedSteps.includes(completedStep)) {
    completedSteps.push(completedStep);
  }
  
  // Update progress
  const { data, error } = await supabase
    .from('project_progress')
    .update({
      current_step: currentStep + 1,
      completed_steps: completedSteps
    })
    .eq('project_id', projectId)
    .select();
  
  if (error) throw error;
  return data[0];
};

// Assessment data functions
export const saveAssessmentData = async (projectId, step, data) => {
  // Check if assessment data already exists
  const { data: existingData, error: checkError } = await supabase
    .from('assessment_data')
    .select('*')
    .eq('project_id', projectId)
    .eq('step', step)
    .maybeSingle();
  
  if (checkError) throw checkError;
  
  if (existingData) {
    // Update existing data
    const { data: updatedData, error } = await supabase
      .from('assessment_data')
      .update({ data })
      .eq('id', existingData.id)
      .select();
    
    if (error) throw error;
    return updatedData[0];
  } else {
    // Insert new data
    const { data: newData, error } = await supabase
      .from('assessment_data')
      .insert([{
        project_id: projectId,
        step,
        data
      }])
      .select();
    
    if (error) throw error;
    return newData[0];
  }
};

export const getAssessmentData = async (projectId, step) => {
  const { data, error } = await supabase
    .from('assessment_data')
    .select('*')
    .eq('project_id', projectId)
    .eq('step', step)
    .maybeSingle();
  
  if (error) throw error;
  return data?.data || null;
};

export const getAllAssessmentData = async (projectId) => {
  const { data, error } = await supabase
    .from('assessment_data')
    .select('*')
    .eq('project_id', projectId);
  
  if (error) throw error;
  
  // Convert to object with step as key
  const result = {};
  data.forEach(item => {
    result[item.step] = item.data;
  });
  
  return result;
};

// Workflow functions
export const saveWorkflows = async (projectId, workflows) => {
  // First delete existing workflows
  const { error: deleteError } = await supabase
    .from('workflows')
    .delete()
    .eq('project_id', projectId);
  
  if (deleteError) throw deleteError;
  
  // Then insert new workflows
  const workflowsWithProjectId = workflows.map(workflow => ({
    ...workflow,
    project_id: projectId
  }));
  
  const { data, error } = await supabase
    .from('workflows')
    .insert(workflowsWithProjectId)
    .select();
  
  if (error) throw error;
  return data;
};

export const getWorkflows = async (projectId) => {
  const { data, error } = await supabase
    .from('workflows')
    .select('*')
    .eq('project_id', projectId);
  
  if (error) throw error;
  return data;
};

// Task functions
export const saveTasks = async (projectId, tasks) => {
  // First delete existing tasks
  const { error: deleteError } = await supabase
    .from('tasks')
    .delete()
    .eq('project_id', projectId);
  
  if (deleteError) throw deleteError;
  
  // Then insert new tasks
  const tasksWithProjectId = tasks.map(task => ({
    ...task,
    project_id: projectId
  }));
  
  const { data, error } = await supabase
    .from('tasks')
    .insert(tasksWithProjectId)
    .select();
  
  if (error) throw error;
  return data;
};

export const getTasks = async (projectId) => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('project_id', projectId);
  
  if (error) throw error;
  return data;
};

// Process map functions
export const saveProcessMap = async (projectId, processMap) => {
  // Check if process map already exists
  const { data: existingMap, error: checkError } = await supabase
    .from('process_maps')
    .select('*')
    .eq('project_id', projectId)
    .eq('workflow_id', processMap.workflowId)
    .maybeSingle();
  
  if (checkError) throw checkError;
  
  if (existingMap) {
    // Update existing map
    const { data, error } = await supabase
      .from('process_maps')
      .update({
        nodes: processMap.nodes,
        edges: processMap.edges
      })
      .eq('id', existingMap.id)
      .select();
    
    if (error) throw error;
    return data[0];
  } else {
    // Insert new map
    const { data, error } = await supabase
      .from('process_maps')
      .insert([{
        project_id: projectId,
        workflow_id: processMap.workflowId,
        nodes: processMap.nodes,
        edges: processMap.edges
      }])
      .select();
    
    if (error) throw error;
    return data[0];
  }
};

export const getProcessMap = async (projectId, workflowId) => {
  const { data, error } = await supabase
    .from('process_maps')
    .select('*')
    .eq('project_id', projectId)
    .eq('workflow_id', workflowId)
    .maybeSingle();
  
  if (error) throw error;
  return data;
};

export const getAllProcessMaps = async (projectId) => {
  const { data, error } = await supabase
    .from('process_maps')
    .select('*')
    .eq('project_id', projectId);
  
  if (error) throw error;
  return data;
};

// Implementation plan functions
export const saveImplementationPlan = async (projectId, plan) => {
  // Check if plan already exists
  const { data: existingPlan, error: checkError } = await supabase
    .from('implementation_plans')
    .select('*')
    .eq('project_id', projectId)
    .maybeSingle();
  
  if (checkError) throw checkError;
  
  if (existingPlan) {
    // Update existing plan
    const { data, error } = await supabase
      .from('implementation_plans')
      .update(plan)
      .eq('id', existingPlan.id)
      .select();
    
    if (error) throw error;
    return data[0];
  } else {
    // Insert new plan
    const { data, error } = await supabase
      .from('implementation_plans')
      .insert([{
        project_id: projectId,
        ...plan
      }])
      .select();
    
    if (error) throw error;
    return data[0];
  }
};

export const getImplementationPlan = async (projectId) => {
  const { data, error } = await supabase
    .from('implementation_plans')
    .select('*')
    .eq('project_id', projectId)
    .maybeSingle();
  
  if (error) throw error;
  return data;
};

// AI tools selection functions
export const saveSelectedTools = async (projectId, toolsData) => {
  // Check if selection already exists
  const { data: existingSelection, error: checkError } = await supabase
    .from('ai_tool_selections')
    .select('*')
    .eq('project_id', projectId)
    .maybeSingle();
  
  if (checkError) throw checkError;
  
  if (existingSelection) {
    // Update existing selection
    const { data, error } = await supabase
      .from('ai_tool_selections')
      .update({
        selected_tool_ids: toolsData.selectedTools,
        selected_tools: toolsData.selectedToolObjects
      })
      .eq('id', existingSelection.id)
      .select();
    
    if (error) throw error;
    return data[0];
  } else {
    // Insert new selection
    const { data, error } = await supabase
      .from('ai_tool_selections')
      .insert([{
        project_id: projectId,
        selected_tool_ids: toolsData.selectedTools,
        selected_tools: toolsData.selectedToolObjects
      }])
      .select();
    
    if (error) throw error;
    return data[0];
  }
};

export const getSelectedTools = async (projectId) => {
  const { data, error } = await supabase
    .from('ai_tool_selections')
    .select('*')
    .eq('project_id', projectId)
    .maybeSingle();
  
  if (error) throw error;
  return data;
};

// Export supabase instance for direct access when needed
export { supabase };
