import React from 'react';
import WelcomeHero from '../components/landing/WelcomeHero';
import FeatureSection from '../components/landing/FeatureSection';
import HowItWorks from '../components/landing/HowItWorks';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <main>
        <WelcomeHero />
        <FeatureSection />
        <HowItWorks />
      </main>
    </div>
  );
}
