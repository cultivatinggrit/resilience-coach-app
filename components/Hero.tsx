import React from 'react';
import { ArrowRight } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        <h1 className="text-4xl sm:text-6xl font-serif font-bold tracking-tight text-white mb-8">
          Build the <span className="text-grit-500">Resilience</span> <br/>
          to Achieve Anything.
        </h1>
        <p className="mt-4 text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
          Grit isn't just about working hard. It's about passion and perseverance for long-term goals. 
          Unlock your potential with our dynamic AI coaching and proven strategies.
        </p>
        <div className="flex justify-center gap-4">
          <a href="#coach" className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-grit-900 bg-grit-500 hover:bg-grit-400 transition-colors duration-300">
            Try AI Coach
            <ArrowRight className="ml-2 w-5 h-5" />
          </a>
          <a href="#resources" className="inline-flex items-center px-8 py-3 border border-gray-600 text-base font-medium rounded-md text-gray-300 hover:bg-gray-800 transition-colors duration-300">
            Learn More
          </a>
        </div>
      </div>
      
      {/* Abstract Background Shapes */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-grit-500/10 rounded-full blur-3xl -z-10 animate-pulse-slow"></div>
    </div>
  );
};
