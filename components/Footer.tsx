import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-grit-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center flex-col md:flex-row gap-4">
            <div className="flex items-center">
                <span className="text-2xl font-serif font-bold text-white">Cultivating<span className="text-grit-500">Grit</span></span>
            </div>
            <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Cultivating Grit. All rights reserved.
            </p>
        </div>
      </div>
    </footer>
  );
};
