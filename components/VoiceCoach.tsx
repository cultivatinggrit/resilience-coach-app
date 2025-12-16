import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { Mic, MicOff, Activity, XCircle, Volume2 } from 'lucide-react';
import { base64ToUint8Array, decodeAudioData, createPCM16Blob } from '../utils/audio';

// System instruction for the Grit Coach persona
const SYSTEM_INSTRUCTION = `You are the "Grit Coach". Your goal is to help users cultivate resilience, perseverance, and passion for their long-term goals. 
You are supportive but firm—a "tough love" mentor. You listen to their challenges and offer actionable advice based on the psychology of grit (growth mindset, bouncing back from failure).
Keep your responses concise, encouraging, and conversational. Do not lecture; discuss.`;

export const VoiceCoach: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false); // AI is speaking
  const [isListening, setIsListening] = useState(false); // Mic is active
  const [error, setError] = useState<string | null>(null);

  // Audio Context Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  
  // Session & Playback Refs
  const sessionRef = useRef<any>(null); // To hold the active session
  const nextStartTimeRef = useRef<number>(0);
  const scheduledSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const cleanupAudio = useCallback(() => {
    // Stop microphone
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    // Disconnect input nodes
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    // Close input context
    if (inputContextRef.current) {
      inputContextRef.current.close();
      inputContextRef.current = null;
    }
    
    // Stop all playing audio
    scheduledSourcesRef.current.forEach(source => {
      try { source.stop(); } catch (e) {}
    });
    scheduledSourcesRef.current.clear();

    // Close output context
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    setIsConnected(false);
    setIsListening(false);
    setIsSpeaking(false);
    sessionRef.current = null;
    nextStartTimeRef.current = 0;
  }, []);

  const connectToGemini = async () => {
    setError(null);
    try {
      // 1. Initialize Audio Contexts
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContextClass({ sampleRate: 24000 });
      inputContextRef.current = new AudioContextClass({ sampleRate: 16000 });

      // 2. Get Microphone Stream
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 1,
          sampleRate: 16000,
        } 
      });
      streamRef.current = stream;

      // 3. Initialize Gemini Client
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const config = {
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: SYSTEM_INSTRUCTION,
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Fenrir' } }, // Fenrir sounds deeper/coach-like
          },
        },
      };

      // 4. Connect Session
      const sessionPromise = ai.live.connect({
        ...config,
        callbacks: {
          onopen: () => {
            console.log("Gemini Live Session Opened");
            setIsConnected(true);
            setIsListening(true);

            // Setup Input Processing
            if (!inputContextRef.current) return;
            const inputCtx = inputContextRef.current;
            const source = inputCtx.createMediaStreamSource(stream);
            sourceRef.current = source;
            
            // 4096 buffer size for balance between latency and processing
            const processor = inputCtx.createScriptProcessor(4096, 1, 1);
            processorRef.current = processor;

            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createPCM16Blob(inputData);
              sessionPromise.then(session => {
                  session.sendRealtimeInput({ media: pcmBlob });
              });
            };

            source.connect(processor);
            processor.connect(inputCtx.destination);
          },
          onmessage: async (msg: LiveServerMessage) => {
            const { serverContent } = msg;

            // Handle Audio Output
            const audioData = serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audioData && audioContextRef.current) {
              setIsSpeaking(true);
              const ctx = audioContextRef.current;
              
              // Ensure we schedule seamlessly
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              
              const audioBuffer = await decodeAudioData(
                base64ToUint8Array(audioData),
                ctx
              );
              
              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(ctx.destination);
              
              source.onended = () => {
                 scheduledSourcesRef.current.delete(source);
                 if (scheduledSourcesRef.current.size === 0) {
                   setIsSpeaking(false);
                 }
              };

              source.start(nextStartTimeRef.current);
              scheduledSourcesRef.current.add(source);
              nextStartTimeRef.current += audioBuffer.duration;
            }

            // Handle Interruption
            if (serverContent?.interrupted) {
              console.log("Model interrupted by user");
              scheduledSourcesRef.current.forEach(s => {
                try { s.stop(); } catch(e) {}
              });
              scheduledSourcesRef.current.clear();
              nextStartTimeRef.current = 0;
              setIsSpeaking(false);
            }

            if (serverContent?.turnComplete) {
               // Turn complete logic if needed
            }
          },
          onclose: () => {
            console.log("Session closed");
            cleanupAudio();
          },
          onerror: (err) => {
            console.error("Session error:", err);
            setError("Connection error. Please try again.");
            cleanupAudio();
          }
        }
      });
      
      sessionRef.current = sessionPromise;

    } catch (err) {
      console.error("Failed to start voice coach:", err);
      setError("Could not access microphone or connect to AI.");
      cleanupAudio();
    }
  };

  const handleToggle = () => {
    if (isConnected) {
      cleanupAudio();
    } else {
      connectToGemini();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => cleanupAudio();
  }, [cleanupAudio]);

  return (
    <div className="bg-grit-800 rounded-2xl p-8 shadow-2xl border border-grit-500/20 max-w-lg mx-auto text-center relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-grit-900 to-transparent opacity-50 z-0"></div>
      
      <div className="relative z-10">
        <h2 className="text-2xl font-serif text-grit-500 mb-6">Real-time Grit Coach</h2>
        
        <div className="mb-8 flex justify-center items-center h-32">
           {isConnected ? (
             <div className={`relative flex items-center justify-center w-24 h-24 rounded-full transition-all duration-500 ${isSpeaking ? 'bg-grit-500/20 scale-110' : 'bg-grit-900'}`}>
                {/* Visualizer Rings */}
                {isSpeaking && (
                   <>
                    <div className="absolute w-full h-full rounded-full border border-grit-500 animate-[ping_1.5s_ease-in-out_infinite] opacity-50"></div>
                    <div className="absolute w-[120%] h-[120%] rounded-full border border-grit-500/50 animate-[ping_2s_ease-in-out_infinite] opacity-30"></div>
                   </>
                )}
                {isListening && !isSpeaking && (
                   <div className="absolute w-full h-full rounded-full border-2 border-dashed border-grit-400/30 animate-[spin_10s_linear_infinite]"></div>
                )}
                
                <Activity className={`w-10 h-10 ${isSpeaking ? 'text-grit-400' : 'text-gray-500'}`} />
             </div>
           ) : (
             <div className="w-24 h-24 rounded-full bg-grit-900 border-4 border-grit-800 flex items-center justify-center shadow-inner">
               <MicOff className="w-8 h-8 text-gray-600" />
             </div>
           )}
        </div>

        <p className="text-gray-300 mb-8 h-6">
          {isConnected 
            ? (isSpeaking ? "Coach is speaking..." : "Listening...") 
            : "Tap to start your resilience session"}
        </p>

        {error && (
          <div className="text-red-400 text-sm mb-4 bg-red-900/20 py-2 px-4 rounded-lg inline-block">
            {error}
          </div>
        )}

        <button
          onClick={handleToggle}
          className={`group relative inline-flex items-center justify-center px-8 py-3 text-lg font-medium text-white transition-all duration-200 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-grit-500 ${
            isConnected 
              ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' 
              : 'bg-grit-500 hover:bg-grit-400 text-grit-900'
          }`}
        >
          {isConnected ? (
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
        
        {!isConnected && (
            <p className="mt-4 text-xs text-gray-500">
                Powered by Gemini Live API. Use headphones for best results.
            </p>
        )}
      </div>
    </div>
  );
};
