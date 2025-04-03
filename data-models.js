// AI Implementation Journey Application Data Models
// This file contains the JavaScript data models that correspond to the database schema

/**
 * User Model
 * Represents a user in the system
 */
class User {
  constructor(data = {}) {
    this.id = data.id || null;
    this.email = data.email || '';
    this.fullName = data.full_name || '';
    this.avatarUrl = data.avatar_url || null;
    this.createdAt = data.created_at || new Date();
    this.lastLogin = data.last_login || null;
    this.isActive = data.is_active !== undefined ? data.is_active : true;
  }
}

/**
 * Organization Model
 * Represents an organization in the system
 */
class Organization {
  constructor(data = {}) {
    this.id = data.id || null;
    this.name = data.name || '';
    this.industry = data.industry || '';
    this.size = data.size || '';
    this.logoUrl = data.logo_url || null;
    this.createdAt = data.created_at || new Date();
    this.updatedAt = data.updated_at || new Date();
  }
}

/**
 * UserOrganization Model
 * Represents the relationship between a user and an organization
 */
class UserOrganization {
  constructor(data = {}) {
    this.id = data.id || null;
    this.userId = data.user_id || null;
    this.organizationId = data.organization_id || null;
    this.role = data.role || 'member'; // 'admin', 'project_manager', 'member'
    this.createdAt = data.created_at || new Date();
  }
}

/**
 * Project Model
 * Represents an AI implementation project
 */
class Project {
  constructor(data = {}) {
    this.id = data.id || null;
    this.organizationId = data.organization_id || null;
    this.title = data.title || '';
    this.description = data.description || '';
    this.createdAt = data.created_at || new Date();
    this.updatedAt = data.updated_at || new Date();
    this.createdBy = data.created_by || null;
    this.isArchived = data.is_archived !== undefined ? data.is_archived : false;
  }
}

/**
 * ProjectProgress Model
 * Tracks the progress of a project through the AI implementation journey
 */
class ProjectProgress {
  constructor(data = {}) {
    this.id = data.id || null;
    this.projectId = data.project_id || null;
    this.currentStep = data.current_step || 1;
    this.strategicVision = data.strategic_vision || {};
    this.startingPoint = data.starting_point || null; // 'manual', 'existing_software', 'new_problem'
    this.strategy = data.strategy || null; // 'evolutionary', 'revolutionary'
    this.strategyPreferences = data.strategy_preferences || {};
    this.workflows = data.workflows || [];
    this.workflowTasks = data.workflow_tasks || [];
    this.implementationPhases = data.implementation_phases || [];
    this.selectedTools = data.selected_tools || [];
    this.updatedAt = data.updated_at || new Date();
  }
  
  // Get the current step name based on step number
  getStepName() {
    const steps = [
      'Strategic Canvas',
      'Starting Point Analysis',
      'Strategy Selection',
      'Strategy Onboarding',
      'Workflow Analysis',
      'Task Deconstruction',
      'Process Mapping',
      'Implementation Plan',
      'AI Tools Selection'
    ];
    
    return steps[this.currentStep - 1] || 'Unknown Step';
  }
  
  // Calculate overall progress percentage
  getProgressPercentage() {
    // Total number of steps
    const totalSteps = 9;
    
    // Calculate completion of current step (simplified)
    let currentStepCompletion = 0;
    
    switch(this.currentStep) {
      case 1: // Strategic Canvas
        currentStepCompletion = Object.keys(this.strategicVision).length > 0 ? 1 : 0;
        break;
      case 2: // Starting Point Analysis
        currentStepCompletion = this.startingPoint ? 1 : 0;
        break;
      case 3: // Strategy Selection
        currentStepCompletion = this.strategy ? 1 : 0;
        break;
      case 4: // Strategy Onboarding
        currentStepCompletion = Object.keys(this.strategyPreferences).length > 0 ? 1 : 0;
        break;
      case 5: // Workflow Analysis
        currentStepCompletion = this.workflows.length > 0 ? 1 : 0;
        break;
      case 6: // Task Deconstruction
        currentStepCompletion = this.workflowTasks.length > 0 ? 1 : 0;
        break;
      case 7: // Process Mapping
        // Process mapping is optional for evolutionary strategy
        currentStepCompletion = this.strategy === 'evolutionary' ? 1 : 0.5;
        break;
      case 8: // Implementation Plan
        currentStepCompletion = this.implementationPhases.length > 0 ? 1 : 0;
        break;
      case 9: // AI Tools Selection
        currentStepCompletion = this.selectedTools.length > 0 ? 1 : 0;
        break;
      default:
        currentStepCompletion = 0;
    }
    
    // Calculate overall progress
    return Math.round(((this.currentStep - 1) / totalSteps + currentStepCompletion / totalSteps) * 100);
  }
}

/**
 * AITool Model
 * Represents an AI tool that can be recommended to users
 */
class AITool {
  constructor(data = {}) {
    this.id = data.id || null;
    this.name = data.name || '';
    this.description = data.description || '';
    this.category = data.category || '';
    this.pricingModel = data.pricing_model || '';
    this.complexityLevel = data.complexity_level || '';
    this.features = data.features || [];
    this.useCases = data.use_cases || [];
    this.url = data.url || '';
    this.logoUrl = data.logo_url || null;
    this.createdAt = data.created_at || new Date();
    this.updatedAt = data.updated_at || new Date();
  }
  
  // Calculate match score based on project requirements
  calculateMatchScore(projectProgress) {
    let score = 0;
    
    // Match based on strategy
    if (projectProgress.strategy === 'evolutionary' && this.complexityLevel !== 'Advanced') {
      score += 10;
    } else if (projectProgress.strategy === 'revolutionary' && this.complexityLevel === 'Advanced') {
      score += 10;
    }
    
    // Match based on workflows
    const workflowCategories = projectProgress.workflows.map(w => w.category.toLowerCase());
    if (workflowCategories.some(category => 
      this.useCases.some(useCase => useCase.toLowerCase().includes(category)))) {
      score += 15;
    }
    
    // Match based on tasks
    const highPotentialTasks = projectProgress.workflowTasks
      .filter(task => task.aiPotential >= 7)
      .map(task => task.name.toLowerCase());
      
    for (const task of highPotentialTasks) {
      if (this.useCases.some(useCase => useCase.toLowerCase().includes(task))) {
        score += 5;
      }
    }
    
    // Match based on complexity preferences
    const preferredComplexity = projectProgress.strategyPreferences.complexity || 'medium';
    if ((preferredComplexity === 'low' && this.complexityLevel === 'Beginner') ||
        (preferredComplexity === 'medium' && this.complexityLevel === 'Intermediate') ||
        (preferredComplexity === 'high' && this.complexityLevel === 'Advanced')) {
      score += 10;
    }
    
    return Math.min(score, 100); // Cap at 100
  }
}

/**
 * AssessmentResult Model
 * Represents the result of an assessment
 */
class AssessmentResult {
  constructor(data = {}) {
    this.id = data.id || null;
    this.projectId = data.project_id || null;
    this.assessmentType = data.assessment_type || '';
    this.resultData = data.result_data || {};
    this.createdAt = data.created_at || new Date();
  }
}

/**
 * ProjectCollaborator Model
 * Represents a collaborator on a project
 */
class ProjectCollaborator {
  constructor(data = {}) {
    this.id = data.id || null;
    this.projectId = data.project_id || null;
    this.userId = data.user_id || null;
    this.role = data.role || 'viewer'; // 'editor', 'viewer'
    this.createdAt = data.created_at || new Date();
  }
}

/**
 * ProjectComment Model
 * Represents a comment on a project
 */
class ProjectComment {
  constructor(data = {}) {
    this.id = data.id || null;
    this.projectId = data.project_id || null;
    this.userId = data.user_id || null;
    this.comment = data.comment || '';
    this.createdAt = data.created_at || new Date();
  }
}

/**
 * ProjectDeliverable Model
 * Represents a deliverable document generated during the project
 */
class ProjectDeliverable {
  constructor(data = {}) {
    this.id = data.id || null;
    this.projectId = data.project_id || null;
    this.title = data.title || '';
    this.description = data.description || '';
    this.fileUrl = data.file_url || '';
    this.stepNumber = data.step_number || 1;
    this.createdAt = data.created_at || new Date();
    this.updatedAt = data.updated_at || new Date();
  }
}

/**
 * AuditLog Model
 * Represents an audit log entry
 */
class AuditLog {
  constructor(data = {}) {
    this.id = data.id || null;
    this.userId = data.user_id || null;
    this.action = data.action || '';
    this.entityType = data.entity_type || '';
    this.entityId = data.entity_id || null;
    this.details = data.details || {};
    this.ipAddress = data.ip_address || '';
    this.createdAt = data.created_at || new Date();
  }
}

/**
 * Notification Model
 * Represents a notification for a user
 */
class Notification {
  constructor(data = {}) {
    this.id = data.id || null;
    this.userId = data.user_id || null;
    this.title = data.title || '';
    this.message = data.message || '';
    this.isRead = data.is_read !== undefined ? data.is_read : false;
    this.link = data.link || '';
    this.createdAt = data.created_at || new Date();
  }
}

/**
 * SystemSetting Model
 * Represents a system setting
 */
class SystemSetting {
  constructor(data = {}) {
    this.id = data.id || null;
    this.settingKey = data.setting_key || '';
    this.settingValue = data.setting_value || {};
    this.description = data.description || '';
    this.updatedAt = data.updated_at || new Date();
  }
}

/**
 * HelpContent Model
 * Represents a help content entry
 */
class HelpContent {
  constructor(data = {}) {
    this.id = data.id || null;
    this.section = data.section || '';
    this.title = data.title || '';
    this.content = data.content || '';
    this.orderIndex = data.order_index || 0;
    this.createdAt = data.created_at || new Date();
    this.updatedAt = data.updated_at || new Date();
  }
}

// Export all models
module.exports = {
  User,
  Organization,
  UserOrganization,
  Project,
  ProjectProgress,
  AITool,
  AssessmentResult,
  ProjectCollaborator,
  ProjectComment,
  ProjectDeliverable,
  AuditLog,
  Notification,
  SystemSetting,
  HelpContent
};
