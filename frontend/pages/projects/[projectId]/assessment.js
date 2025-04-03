import React from 'react';
import { useRouter } from 'next/router';
import StrategicCanvas from '../../components/assessment/StrategicCanvas';
import StartingPointAnalysis from '../../components/assessment/StartingPointAnalysis';
import StrategySelection from '../../components/assessment/StrategySelection';
import StrategyOnboarding from '../../components/assessment/StrategyOnboarding';
import WorkflowAnalysis from '../../components/assessment/WorkflowAnalysis';
import TaskDeconstruction from '../../components/assessment/TaskDeconstruction';
import ProcessMapping from '../../components/assessment/ProcessMapping';
import ImplementationPlan from '../../components/assessment/ImplementationPlan';
import AIToolsSelection from '../../components/assessment/AIToolsSelection';
import DataVisualization from '../../components/visualization/DataVisualization';
import AIInsightsPanel from '../../components/visualization/AIInsightsPanel';

export default function Assessment() {
  const router = useRouter();
  const { projectId, step } = router.query;
  
  // Mock project data - in a real app, this would come from an API
  const projectData = {
    id: projectId,
    name: 'Marketing Automation',
    description: 'Implementing AI for marketing campaign optimization',
    currentStep: step || 'strategic-canvas',
    workflows: [],
    tasks: [],
    implementationPlan: {}
  };
  
  const renderStep = () => {
    switch(step) {
      case 'strategic-canvas':
        return <StrategicCanvas projectData={projectData} />;
      case 'starting-point':
        return <StartingPointAnalysis projectData={projectData} />;
      case 'strategy-selection':
        return <StrategySelection projectData={projectData} />;
      case 'strategy-onboarding':
        return <StrategyOnboarding projectData={projectData} />;
      case 'workflow-analysis':
        return <WorkflowAnalysis projectData={projectData} />;
      case 'task-deconstruction':
        return <TaskDeconstruction projectData={projectData} />;
      case 'process-mapping':
        return <ProcessMapping projectData={projectData} />;
      case 'implementation-plan':
        return <ImplementationPlan projectData={projectData} />;
      case 'ai-tools':
        return <AIToolsSelection projectData={projectData} />;
      case 'visualization':
        return <DataVisualization projectData={projectData} />;
      case 'insights':
        return <AIInsightsPanel projectData={projectData} />;
      default:
        return <StrategicCanvas projectData={projectData} />;
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              {projectData.name}: {step ? step.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Assessment'}
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Complete each step of your AI implementation journey
            </p>
          </div>
          
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            {renderStep()}
          </div>
        </div>
      </main>
    </div>
  );
}
