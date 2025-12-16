import React from 'react';
import { Brain, Mountain, Target, Shield } from 'lucide-react';

const features = [
  {
    name: 'Growth Mindset',
    description: 'Learn to embrace challenges and see failure as a springboard for growth and stretching your abilities.',
    icon: Brain,
  },
  {
    name: 'Long-term Goals',
    description: 'Define clear, high-level objectives and maintain the stamina to pursue them over years, not just weeks.',
    icon: Mountain,
  },
  {
    name: 'Deliberate Practice',
    description: 'Engage in focused, structured practice designed to improve performance and master your craft.',
    icon: Target,
  },
  {
    name: 'Mental Toughness',
    description: 'Develop the psychological armor to withstand pressure, stress, and adversity in any environment.',
    icon: Shield,
  },
];

export const Features: React.FC = () => {
  return (
    <div id="resources" className="py-24 bg-grit-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base text-grit-500 font-semibold tracking-wide uppercase">Core Pillars</h2>
          <p className="mt-2 text-3xl leading-8 font-serif font-extrabold tracking-tight text-white sm:text-4xl">
            The Science of Success
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-400 mx-auto">
            Grit is a distinct combination of passion and perseverance. Here is how we help you cultivate it.
          </p>
        </div>

        <div className="mt-20">
          <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            {features.map((feature) => (
              <div key={feature.name} className="relative group p-6 bg-grit-800 rounded-xl border border-transparent hover:border-grit-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-grit-500/10">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-grit-500 text-grit-900 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-white">{feature.name}</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-400">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};
