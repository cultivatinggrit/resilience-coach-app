import Hero from "../components/Hero";
import Features from "../components/Features";
import Footer from "../components/Footer";
import VoiceCoach from "../components/VoiceCoach";

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-grit-900 text-gray-100 selection:bg-grit-500 selection:text-grit-900">
      
      {/* Navigation (Simple) */}
      <nav className="absolute top-0 w-full z-50 py-6 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-serif font-bold text-white tracking-tight">
            Cultivating<span className="text-grit-500">Grit</span>
          </div>
          <div className="hidden sm:flex space-x-8">
            <a href="#coach" className="text-gray-300 hover:text-grit-500 transition-colors">AI Coach</a>
            <a href="#resources" className="text-gray-300 hover:text-grit-500 transition-colors">Resources</a>
          </div>
        </div>
      </nav>

      <main>
        <Hero />
        
        {/* Interactive Voice Coach Section */}
        <section id="coach" className="py-20 bg-gradient-to-b from-grit-900 to-grit-800 relative">
            <div className="max-w-4xl mx-auto px-4 relative z-10">
                <div className="text-center mb-12">
                    <span className="text-grit-500 font-semibold tracking-wider text-sm uppercase">Interactive Experience</span>
                    <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mt-2">Speak to your Resilience Coach</h2>
                    <p className="mt-4 text-gray-400">
                        Feeling stuck? Need a push? Have a real-time voice conversation with our AI trained on grit psychology.
                    </p>
                </div>
                <VoiceCoach />
            </div>
        </section>

        <Features />
      </main>

      <Footer />
    </div>
  );
};

export default App;
