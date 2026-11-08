import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Bookmark, BookmarkCheck, Volume2, VolumeX, BookOpen, Settings, Search, RefreshCw, Palette } from 'lucide-react';

const OBLIQUE_STRATEGIES = [
  { id: 1, text: "Abandon normal instruments" },
  { id: 2, text: "Accept advice, but don't feel obligated to follow it" },
  { id: 3, text: "Accretion: collect small elements into a whole" },
  { id: 4, text: "Allow an easement (an easement is the right to use another's land)" },
  { id: 5, text: "Always first steps" },
  { id: 6, text: "Are there sections? Consider transitions" },
  { id: 7, text: "Ask your body" },
  { id: 8, text: "Be dirty" },
  { id: 9, text: "Breathe more deeply" },
  { id: 10, text: "Change instrument roles" },
  { id: 11, text: "Change nothing and continue with consistency" },
  { id: 12, text: "Consider different fading systems" },
  { id: 13, text: "Consult other sources - promising or unpromising" },
  { id: 14, text: "Courage!" },
  { id: 15, text: "Cut a vital connection" },
  { id: 16, text: "Decorate, decorate" },
  { id: 17, text: "Destroy nothing; destroy the most important thing" },
  { id: 18, text: "Discard an axiom" },
  { id: 19, text: "Disconnect from desire" },
  { id: 20, text: "Discover the recipes you are using and abandon them" },
  { id: 21, text: "Distorting time" },
  { id: 22, text: "Do nothing for as long as possible" },
  { id: 23, text: "Don't be afraid of things because they're easy to do" },
  { id: 24, text: "Emphasize differences" },
  { id: 25, text: "Emphasize repetitions" },
  { id: 26, text: "Emphasize the flaws" },
  { id: 27, text: "Faced with a choice, do both" },
  { id: 28, text: "Give the game away" },
  { id: 29, text: "Go outside. Shut the door." },
  { id: 30, text: "Honor thy error as a hidden intention" },
  { id: 31, text: "How would you have done it as a child?" },
  { id: 32, text: "Is it finished?" },
  { id: 33, text: "Into the impossible" },
  { id: 34, text: "Just carry on" },
  { id: 35, text: "Look at the order in which you do things" },
  { id: 36, text: "Make a sudden, destructive unpredictable action; incorporate it" },
  { id: 37, text: "Only one element of each kind" },
  { id: 38, text: "Overtly resist change" },
  { id: 39, text: "Question the heroic approach" },
  { id: 40, text: "Remember those quiet evenings" },
  { id: 41, text: "Remove ambiguities and convert to specifics" },
  { id: 42, text: "Reverse" },
  { id: 43, text: "Simple subtraction" },
  { id: 44, text: "State the problem in plain words as clearly as possible" },
  { id: 45, text: "Take away the elements in order of apparent importance" },
  { id: 46, text: "Use 'unqualified' people" },
  { id: 47, text: "What are you really thinking about right now?" },
  { id: 48, text: "What would your closest friend do?" },
  { id: 49, text: "Work at a different speed" },
  { id: 50, text: "You don't have to be ashamed of using your own ideas" }
];

export default function App() {
  const [strategyIndex, setStrategyIndex] = useState(() => Math.floor(Math.random() * OBLIQUE_STRATEGIES.length));
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [activeTab, setActiveTab] = useState('sanctum');
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFlipped, setIsFlipped] = useState(false);
  const [installPrompt, setInstallPrompt] = useState(null);

  const audioContextRef = useRef(null);
  const gainNodeRef = useRef(null);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    });
  }, []);

  const currentStrategy = OBLIQUE_STRATEGIES[strategyIndex];

  const toggleAudio = () => {
    if (audioEnabled) {
      if (gainNodeRef.current) {
        gainNodeRef.current.gain.linearRampToValueAtTime(0, audioContextRef.current.currentTime + 1.2);
        setTimeout(() => setAudioEnabled(false), 1200);
      }
    } else {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, ctx.currentTime);

      const baseFreq = 77.78;
      const voices = [baseFreq, baseFreq * 1.5, baseFreq * 1.25];

      voices.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        osc.type = index === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        const voiceGain = ctx.createGain();
        voiceGain.gain.setValueAtTime(index === 0 ? 0.08 : 0.04, ctx.currentTime);
        osc.detune.setValueAtTime((Math.random() - 0.5) * 8, ctx.currentTime);
        osc.connect(voiceGain);
        voiceGain.connect(gain);
        osc.start();
      });

      gainNodeRef.current = gain;
      gain.connect(ctx.destination);
      gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 2.5);
      setAudioEnabled(true);
    }
  };

  const showNextStrategy = () => {
    setIsFlipped(true);
    setTimeout(() => {
      let nextIndex;
      do {
        nextIndex = Math.floor(Math.random() * OBLIQUE_STRATEGIES.length);
      } while (nextIndex === strategyIndex);
      setStrategyIndex(nextIndex);
      setIsFlipped(false);
    }, 450);
  };

  const toggleFavorite = (id) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(favId => favId !== id) : [...prev, id]
    );
  };

  const handleInstallClick = () => {
    if (installPrompt) {
      installPrompt.prompt();
    } else {
      alert("To install on Android: Tap the 3 dots in Chrome and select 'Install app' or 'Add to Home screen'.");
    }
  };

  const filteredStrategies = OBLIQUE_STRATEGIES.filter(s =>
    s.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0A0908] text-[#D8CEBE] flex flex-col items-center justify-between p-4 selection:bg-[#C5A059] selection:text-black">
      <header className="w-full max-w-5xl flex items-center justify-between py-6 border-b border-[#3D3226] mb-8">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded border-2 border-[#C5A059] flex items-center justify-center bg-[#12100E]">
             <BookOpen className="w-5 h-5 text-[#C5A059]" />
          </div>
          <div>
            <h1 className="font-['Playfair_Display'] text-2xl tracking-wider text-[#C5A059] font-black uppercase">Oblique Sanctum</h1>
            <p className="text-xs text-[#8A7E6E] italic tracking-tight">Brian Eno & Peter Schmidt’s Prompts for Creative Action</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button 
            onClick={toggleAudio} 
            className={`p-3 rounded-lg border-2 transition-all ${audioEnabled ? 'border-[#C5A059] text-[#C5A059] bg-[#C5A059]/10' : 'border-[#3D3226] text-[#8A7E6E]'}`}
            title="Toggle Ambient Drone"
          >
            {audioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
          
          <button 
            onClick={handleInstallClick}
            className="px-4 py-2 rounded-lg border-2 border-[#C5A059] text-[#C5A059] hover:bg-[#C5A059] hover:text-black text-xs font-bold tracking-wider transition-colors flex items-center space-x-1"
          >
            <Settings className="w-4 h-4 mr-1" />
            INSTALL
          </button>
        </div>
      </header>

      <main className="w-full max-w-5xl flex-1 flex flex-col justify-center items-center">
        <div className="flex space-x-2 mb-10 bg-[#12100E] p-1.5 rounded-xl border-2 border-[#3D3226]">
          <button 
            onClick={() => setActiveTab('sanctum')}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold tracking-wider transition ${activeTab === 'sanctum' ? 'bg-[#C5A059] text-black font-extrabold' : 'text-[#8A7E6E] hover:text-[#D8CEBE]'}`}
          >
            Sanctum (Drawing)
          </button>
          <button 
            onClick={() => setActiveTab('grimoire')}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold tracking-wider transition ${activeTab === 'grimoire' ? 'bg-[#C5A059] text-black font-extrabold' : 'text-[#8A7E6E] hover:text-[#D8CEBE]'}`}
          >
            Grimoire (Database)
          </button>
          <button 
            onClick={() => setActiveTab('archive')}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold tracking-wider transition ${activeTab === 'archive' ? 'bg-[#C5A059] text-black font-extrabold' : 'text-[#8A7E6E] hover:text-[#D8CEBE]'}`}
          >
            Favorites ({favorites.length})
          </button>
        </div>

        {activeTab === 'sanctum' && (
          <div className="flex flex-col items-center w-full max-w-md">
            <div className="w-full aspect-[3/5] relative bg-[#F4EBE1] text-[#1A1815] p-8 border-[16px] border-[#1A1815] shadow-2xl rounded-2xl flex flex-col justify-between selection:bg-[#F4DAB3]">
              <div className="absolute inset-3 border-2 border-[#1A1815] rounded-lg opacity-30 pointer-events-none"></div>

              <div className="flex justify-between items-center z-10">
                <span className="font-['Oswald'] text-xs text-[#524B40] tracking-widest uppercase font-black">
                  Strategy nº {currentStrategy.id}
                </span>
                <div className="flex space-x-2">
                    <button 
                        onClick={() => toggleFavorite(currentStrategy.id)}
                        className="text-[#1A1815] hover:scale-110 transition"
                    >
                        {favorites.includes(currentStrategy.id) ? (
                        <BookmarkCheck className="w-5 h-5 fill-[#C5A059] text-[#C5A059]" />
                        ) : (
                        <Bookmark className="w-5 h-5" />
                        )}
                    </button>
                    <button 
                        onClick={showNextStrategy}
                        className="text-[#1A1815] hover:rotate-90 transition-transform duration-300"
                    >
                        <RefreshCw className="w-5 h-5" />
                    </button>
                </div>
              </div>

              <div className={`my-auto text-center px-4 transition-all duration-500 ${isFlipped ? 'opacity-0 scale-90 blur-sm' : 'opacity-100 scale-100 blur-0'}`}>
                <p className="font-['Playfair_Display'] text-3xl md:text-4xl font-black leading-snug tracking-tight text-[#1A1815]">
                  "{currentStrategy.text}"
                </p>
              </div>

              <div className="flex flex-col items-center justify-center space-y-1 border-t border-[#1A1815] pt-4 z-10 text-center">
                <p className="font-['Oswald'] text-[10px] text-[#3D3226] tracking-[0.2em] font-black uppercase">BRIAN ENO / PETER SCHMIDT</p>
                <div className="w-24 h-0.5 bg-[#1A1815] rounded-full opacity-40"></div>
                <p className="text-[9px] text-[#8A7E6E] font-medium tracking-tight">Design Focused Edition</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 mt-8 w-full">
              <button 
                onClick={showNextStrategy}
                className="flex-1 bg-[#C5A059] hover:bg-[#D4AF67] text-black font-black py-3.5 px-6 rounded-xl shadow-xl transition-colors flex items-center justify-center space-x-2 text-sm tracking-wider"
              >
                <Sparkles className="w-5 h-5 mr-1" />
                DRAW CREATIVE ACTION
              </button>
            </div>
          </div>
        )}

        {activeTab === 'grimoire' && (
            <div className="w-full space-y-6">
                <div className="relative">
                    <Search className="w-5 h-5 absolute left-4 top-4 text-[#8A7E6E]" />
                    <input 
                        type="text" 
                        placeholder="Search the grimoire database..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#12100E] border-2 border-[#3D3226] rounded-xl pl-12 pr-4 py-3 text-[#D8CEBE] focus:outline-none focus:border-[#C5A059]"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[50vh] overflow-y-auto pr-1">
                    {filteredStrategies.map(strat => (
                        <div key={strat.id} className="bg-[#12100E] p-5 rounded-xl border-2 border-[#3D3226] hover:border-[#C5A059] flex flex-col justify-between transition-colors">
                            <p className="font-['Playfair_Display'] text-lg font-bold mb-3">"{strat.text}"</p>
                            <div className="flex items-center justify-between text-xs text-[#8A7E6E]">
                                <span>Action nº {strat.id}</span>
                                <button onClick={() => toggleFavorite(strat.id)}>
                                {favorites.includes(strat.id) ? (
                                    <BookmarkCheck className="w-5 h-5 text-[#C5A059]" />
                                ) : (
                                    <Bookmark className="w-5 h-5 hover:text-[#D8CEBE]" />
                                )}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {activeTab === 'archive' && (
            <div className="w-full space-y-6">
                <h2 className="font-['Playfair_Display'] text-2xl text-[#C5A059] uppercase tracking-widest font-black">Bookmarked Actions</h2>
                {favorites.length === 0 ? (
                    <div className="text-center bg-[#12100E] p-12 rounded-xl border-2 border-[#3D3226]">
                        <Bookmark className="w-10 h-10 mx-auto mb-3 text-[#8A7E6E]" />
                        <p className="text-sm font-medium text-[#8A7E6E]">Your list of favorite actions is empty. Bookmark strategies to view them here.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto pr-1">
                        {OBLIQUE_STRATEGIES.filter(s => favorites.includes(s.id)).map(strat => (
                            <div key={strat.id} className="bg-[#1A1815] p-6 rounded-xl border-2 border-[#C5A059] flex items-center justify-between">
                                <p className="font-['Playfair_Display'] text-xl font-black text-[#F4EBE1]">"{strat.text}"</p>
                                <button onClick={() => toggleFavorite(strat.id)} className="ml-4 shrink-0">
                                    <BookmarkCheck className="w-6 h-6 text-[#C5A059]" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )}
      </main>

      <footer className="w-full max-w-5xl py-6 border-t border-[#3D3226] text-center text-xs text-[#8A7E6E] mt-8 font-medium tracking-wide">
        Oblique Sanctum • Brian Eno & Peter Schmidt Strategies
      </footer>
    </div>
  );
}