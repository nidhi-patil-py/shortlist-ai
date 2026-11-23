import React from 'react'
import { Navbar } from '../components/common/Navbar'
import { Footer } from '../components/common/Footer'
import { HeroSection } from '../components/landing/HeroSection'
import { HowItWorksSection } from '../components/landing/HowItWorksSection'
import { FeaturesSection } from '../components/landing/FeaturesSection'
import { InteractiveDemoSection } from '../components/landing/InteractiveDemoSection'
import { AtsExplanationSection } from '../components/landing/AtsExplanationSection'
import { PricingSection } from '../components/landing/PricingSection'
import { FaqSection } from '../components/landing/FaqSection'

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-slate-950 transition-colors duration-200">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <HowItWorksSection />
        <FeaturesSection />
        <InteractiveDemoSection />
        <AtsExplanationSection />
        <PricingSection />
        <FaqSection />
      </main>
      <Footer />
    </div>
  )
}

export default LandingPage
