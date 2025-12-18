import React, { useState } from "react";
import { Mic, MicOff, Activity, XCircle } from "lucide-react";

const VoiceCoach: React.FC = () => {
  const [isActive, setIsActive] = useState(false);

  const handleToggle = () => {
    setIsActive(prev => !prev);
  };

  return (
    <div className="bg-grit-800 rounded-2xl p-8 shadow-2xl border border-grit-500/20 max-w-lg mx-auto text-center relative overflow-hidden">
      
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-grit-900 to-transparent opacity-50" />

      <div className="relative z-10">
        <h2 className="text-2xl font-serif text-grit-500 mb-6">
          Real-time Grit Coach
        </h2>

        <div className="mb-8 flex justify-center items-center h-32">
          {isActive ? (
            <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-grit-500/20 scale-110 transition-all">
              <div className="absolute w-full h-full rounded-full border border-grit-500 animate-ping opacity-50" />
              <Activity className="w-10 h-10 text-grit-400" />
            </div>
          ) : (
            <div className="w-24 h-24 rounded-full bg-grit-900 border-4 border-grit-800 flex items-center justify-center shadow-inner">
              <MicOff className="w-8 h-8 text-gray-600" />
            </div>
          )}
        </div>

        <p className="text-gray-300 mb-8 h-6">
          {isActive
            ? "Coach session active (demo mode)"
            : "Tap to start your resilience session"}
        </p>

        <button
          onClick={handleToggle}
          className={`inline-flex items-center justify-center px-8 py-3 text-lg font-medium rounded-full transition-all ${
            isActive
              ? "bg-red-600 hover:bg-red-700 text-white"
              : "bg-grit-500 hover:bg-grit-400 text-grit-900"
          }`}
        >
          {isActive ? (
            <>
              <XCircle className="w-5 h-5 mr-2" />
              End Session
            </>
          ) : (
            <>
              <Mic className="w-5 h-5 mr-2" />
              Start Coaching
            </>
          )}
        </button>

        {!isActive && (
          <p className="mt-4 text-xs text-gray-500">
            AI voice coming soon. This is a visual demo.
          </p>
        )}
      </div>
    </div>
  );
};

export default VoiceCoach;
