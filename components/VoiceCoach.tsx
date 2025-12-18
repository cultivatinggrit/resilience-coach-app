import React, { useState } from "react";
import { Mic, MicOff, Activity, XCircle } from "lucide-react";

const VoiceCoach: React.FC = () => {
  const [active, setActive] = useState(false);

  const toggleSession = () => {
    setActive((prev) => !prev);
  };

  return (
    <div className="bg-grit-800 rounded-2xl p-8 shadow-2xl border border-grit-500/20 max-w-lg mx-auto text-center">
      <h2 className="text-2xl font-serif text-grit-500 mb-6">
        Real-time Grit Coach
      </h2>

      <div className="mb-8 flex justify-center items-center h-32">
        {active ? (
          <div className="w-24 h-24 rounded-full bg-grit-500/20 flex items-center justify-center">
            <Activity className="w-10 h-10 text-grit-400" />
          </div>
        ) : (
          <div className="w-24 h-24 rounded-full bg-grit-900 flex items-center justify-center">
            <MicOff className="w-8 h-8 text-gray-600" />
          </div>
        )}
      </div>

      <p className="text-gray-300 mb-8">
        {active ? "Session active (demo mode)" : "Tap to start coaching"}
      </p>

      <button
        onClick={toggleSession}
        className={`inline-flex items-center justify-center px-8 py-3 text-lg font-medium rounded-full transition ${
          active
            ? "bg-red-600 hover:bg-red-700 text-white"
            : "bg-grit-500 hover:bg-grit-400 text-grit-900"
        }`}
      >
        {active ? (
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

      <p className="mt-4 text-xs text-gray-500">
        Voice AI coming soon (server-powered)
      </p>
    </div>
  );
};

export default VoiceCoach;
