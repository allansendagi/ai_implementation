import React from 'react';
import { motion } from 'framer-motion';

const HowItWorks = () => {
  const steps = [
    {
      number: '01',
      title: 'Strategic Canvas',
      description: 'Define your business goals, use cases, and success criteria for AI implementation.',
    },
    {
      number: '02',
      title: 'Starting Point Analysis',
      description: 'Determine your current state: manual processes, existing software, or new problem areas.',
    },
    {
      number: '03',
      title: 'Strategy Selection',
      description: 'Choose between evolutionary (gradual) or revolutionary (comprehensive) approaches.',
    },
    {
      number: '04',
      title: 'Workflow Analysis',
      description: 'Identify and map key workflows that can be enhanced with AI technology.',
    },
    {
      number: '05',
      title: 'Implementation Plan',
      description: 'Create a phased roadmap with timelines, budgets, and responsible teams.',
    },
    {
      number: '06',
      title: 'AI Tools Selection',
      description: 'Get personalized recommendations for AI tools that match your requirements.',
    },
  ];

  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">Methodology</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            How It Works
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Our step-by-step process guides you from AI novice to implementation ready.
          </p>
        </div>

        <div className="mt-10">
          <div className="space-y-10">
            {steps.map((step, index) => (
              <motion.div 
                key={step.number}
                className="flex flex-col md:flex-row"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-16 w-16 rounded-md bg-primary-500 text-white text-2xl font-bold">
                    {step.number}
                  </div>
                </div>
                <div className="mt-4 md:mt-0 md:ml-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">{step.title}</h3>
                  <p className="mt-2 text-base text-gray-500">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
