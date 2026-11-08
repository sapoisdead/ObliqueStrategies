import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Bookmark, BookmarkCheck, Volume2, VolumeX, 
  Search, Compass, Download, Skull, Flame, ShieldAlert
} from 'lucide-react';

const OBLIQUE_CARDS = [
  { id: 1, text: "Abandon normal instruments", category: "Sound" },
  { id: 2, text: "Accept advice, but don't feel obligated to follow it", category: "Mindset" },
  { id: 3, text: "Accretion: collect small elements into a whole", category: "Action" },
  { id: 4, text: "Allow an easement (an easement is the right to use another's land)", category: "Perspective" },
  { id: 5, text: "Always first steps", category: "Action" },
  { id: 6, text: "Are there sections? Consider transitions", category: "Constraints" },
  { id: 7, text: "Ask your body", category: "Mindset" },
  { id: 8, text: "Be dirty", category: "Action" },
  { id: 9, text: "Breathe more deeply", category: "Mindset" },
  { id: 10, text: "Change instrument roles", category: "Sound" },
  { id: 11, text: "Change nothing and continue with consistency", category: "Mindset" },
  { id: 12, text: "Consider different fading systems", category: "Constraints" },
  { id: 13, text: "Consult other sources - promising or unpromising", category: "Perspective" },
  { id: 14, text: "Courage!", category: "Mindset" },
  { id: 15, text: "Cut a vital connection", category: "Action" },
  { id: 16, text: "Decorate, decorate", category: "Action" },
  { id: 17, text: "Destroy nothing; destroy the most important thing", category: "Perspective" },
  { id: 18, text: "Discard an axiom", category: "Mindset" },
  { id: 19, text: "Disconnect from desire", category: "Mindset" },
  { id: 20, text: "Discover the recipes you are using and abandon them", category: "Action" },
  { id: 21, text: "Distorting time", category: "Constraints" },
  { id: 22, text: "Do nothing for as long as possible", category: "Action" },
  { id: 23, text: "Don't be afraid of things because they're easy to do", category: "Perspective" },
  { id: 24, text: "Emphasize differences", category: "Perspective" },
  { id: 25, text: "Emphasize repetitions", category: "Action" },
  { id: 26, text: "Emphasize the flaws", category: "Perspective" },
  { id: 27, text: "Faced with a choice, do both", category: "Action" },
  { id: 28, text: "Give the game away", category: "Mindset" },
  { id: 29, text: "Go outside. Shut the door.", category: "Action" },
  { id: 30, text: "Honor thy error as a hidden intention", category: "Mindset" },
  { id: 31, text: "How would you have done it as a child?", category: "Perspective" },
  { id: 32, text: "Is it finished?", category: "Constraints" },
  { id: 33, text: "Into the impossible", category: "Perspective" },
  { id: 34, text: "Just carry on", category: "Mindset" },
  { id: 35, text: "Look at the order in which you do things", category: "Constraints" },
  { id: 36, text: "Make a sudden, destructive unpredictable action; incorporate it", category: "Action" },
  { id: 37, text: "Only one element of each kind", category: "Constraints" },
  { id: 38, text: "Overtly resist change", category: "Mindset" },
  { id: 39, text: "Question the heroic approach", category: "Perspective" },
  { id: 40, text: "Remember those quiet evenings", category: "Mindset" },
  { id: 41, text: "Remove ambiguities and convert to specifics", category: "Action" },
  { id: 42, text: "Reverse", category: "Perspective" },
  { id: 43, text: "Simple subtraction", category: "Action" },
  { id: 44, text: "State the problem in plain words as clearly as possible", category: "Action" },
  { id: 45, text: "Take away the elements in order of apparent importance", category: "Constraints" },
  { id: 46, text: "Use 'unqualified' people", category: "Action" },
  { id: 47, text: "What are you really thinking about right now?", category: "Perspective" },
  { id: 48, text: "What would your closest friend do?", category: "Perspective" },
  { id: 49, text: "Work at a different speed", category: "Constraints" },
  { id: 50, text: "You don't have to be ashamed of using your own ideas", category: "Mindset" }
];

export default function App() {
  const [deck, setDeck] = useState(OBLIQUE_CARDS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [activeTab, setActiveTab] = useState('studio');
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [notes, setNotes] = useState({});
  const [installPrompt, setInstallPrompt] = useState(null);

  const audioCtxRef = useRef(null);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    });
  }, []);

  const currentCard = deck[currentIndex];

  const playSynthDrone = () => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(55, ctx.currentTime); // Deep occult drone (A1)
      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.8);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.8);
    } catch (e) {
      console.log('Audio init context', e);
    }
  };

  const drawRandom = () => {
    setIsFlipped(false);
    setTimeout(() => {
      const randIdx = Math.floor(Math.random() * deck.length);
      setCurrentIndex(randIdx);
      playSynthDrone();
    }, 250);
  };

  const toggleFavorite = (id) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleInstallClick = () => {
    if (installPrompt) {
      installPrompt.prompt();
    } else {
      alert("To install on Android: Tap the 3 dots in Chrome and select 'Install app' or 'Add to Home screen'.");
    }
  };

  const filteredCatalog = deck.filter(c => {
    const matchesCat = categoryFilter === 'All' || c.category === categoryFilter;
    const matchesSearch = c.text.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#0A0908] text-[#D8CEBE] flex flex-col items-center justify-between p-4 selection:bg-[#7A1C1C] selection:text-[#D8CEBE]">
      {/* Header */}
      <header className="w-full max-w-2xl flex items-center justify-between py-4 border-b border-[#3D3226] mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg border-2 border-[#C5A059] flex items-center justify-center bg-[#12100E]">
            <Skull className="w-5 h-5 text-[#C5A059]" />
          </div>
          <div>
            <h1 className="font-cinzel text-base tracking-widest text-[#C5A059] font-bold">OBLIQUE TAROT</h1>
            <p className="text-xs text-[#8A7E6E] italic">Esoteric Woodcut Edition</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setSoundEnabled(!soundEnabled)} 
            className={`p-2 rounded-lg border transition ${soundEnabled ? 'border-[#C5A059] text-[#C5A059] bg-[#C5A059]/10' : 'border-[#3D3226] text-[#8A7E6E]'}`}
            title="Toggle Ambient Drone"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
          
          <button 
            onClick={handleInstallClick} 
            className="px-3 py-1.5 rounded-lg border border-[#C5A059] text-[#C5A059] hover:bg-[#C5A059] hover:text-[#0A0908] text-xs font-semibold tracking-wider transition flex items-center space-x-1"
          >
            <Download className="w-3.5 h-3.5 mr-1" />
            Install App
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-2xl flex-1 flex flex-col justify-center items-center">
        {/* Navigation Tabs */}
        <div className="flex space-x-3 mb-6 bg-[#12100E] p-1.5 rounded-xl border border-[#3D3226]">
          <button 
            onClick={() => setActiveTab('studio')}
            className={`px-4 py-2 rounded-lg text-xs font-cinzel tracking-wider transition ${activeTab === 'studio' ? 'bg-[#7A1C1C] text-[#D8CEBE] font-bold shadow-lg border border-[#C5A059]/40' : 'text-[#8A7E6E] hover:text-[#D8CEBE]'}`}
          >
            Sanctum Studio
          </button>
          <button 
            onClick={() => setActiveTab('catalog')}
            className={`px-4 py-2 rounded-lg text-xs font-cinzel tracking-wider transition ${activeTab === 'catalog' ? 'bg-[#7A1C1C] text-[#D8CEBE] font-bold shadow-lg border border-[#C5A059]/40' : 'text-[#8A7E6E] hover:text-[#D8CEBE]'}`}
          >
            Full Deck ({deck.length})
          </button>
          <button 
            onClick={() => setActiveTab('journal')}
            className={`px-4 py-2 rounded-lg text-xs font-cinzel tracking-wider transition ${activeTab === 'journal' ? 'bg-[#7A1C1C] text-[#D8CEBE] font-bold shadow-lg border border-[#C5A059]/40' : 'text-[#8A7E6E] hover:text-[#D8CEBE]'}`}
          >
            Grimoire ({favorites.length})
          </button>
        </div>

        {/* TAB 1: STUDIO (DARK WOODCUT TAROT CARD) */}
        {activeTab === 'studio' && (
          <div className="flex flex-col items-center w-full max-w-sm">
            <div 
              onClick={() => { setIsFlipped(!isFlipped); playSynthDrone(); }}
              className="w-full aspect-[3/5] relative perspective-1000 cursor-pointer group"
            >
              <div className={`w-full h-full duration-700 transform-style-3d transition-transform ${isFlipped ? 'rotate-y-180' : ''}`}>
                
                {/* CARD BACK (Dark Leather & Esoteric Geometry) */}
                <div className="absolute inset-0 w-full h-full bg-[#12100E] border-4 border-[#C5A059] rounded-2xl shadow-2xl p-6 flex flex-col justify-between backface-hidden">
                  <div className="w-full h-full border-2 border-[#3D3226] rounded-xl p-4 flex flex-col items-center justify-between bg-[radial-gradient(#3D3226_1px,transparent_1px)] [background-size:20px_20px]">
                    <div className="text-[#C5A059] text-xs font-cinzel tracking-widest">✦ OBLIQUE TAROT ✦</div>
                    <div className="w-28 h-28 rounded-full border-2 border-[#C5A059] flex items-center justify-center relative bg-[#0A0908]">
                      <div className="w-20 h-20 border border-[#7A1C1C] rotate-45"></div>
                      <Skull className="w-10 h-10 text-[#C5A059] absolute" />
                    </div>
                    <div className="text-[#8A7E6E] text-xs font-cinzel tracking-wider">TOUCH TO DIVINE</div>
                  </div>
                </div>

                {/* CARD FRONT (Dark Woodcut Tarot Aesthetic matching reference) */}
                <div className="absolute inset-0 w-full h-full bg-[#161310] text-[#D8CEBE] border-4 border-[#C5A059] rounded-2xl shadow-2xl p-5 flex flex-col justify-between rotate-y-180 backface-hidden overflow-hidden">
                  {/* Ornate corners and top emblem */}
                  <div className="absolute top-3 left-3 font-cinzel text-sm text-[#C5A059] font-bold">Q</div>
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 text-center">
                    <Skull className="w-5 h-5 text-[#C5A059] mx-auto opacity-80" />
                  </div>
                  <div className="absolute top-3 right-3 font-cinzel text-sm text-[#C5A059] font-bold">Q</div>

                  {/* Inner Woodcut Artwork Box */}
                  <div className="mt-8 mb-2 mx-1 flex-1 bg-[#0A0908] border-2 border-[#C5A059]/60 rounded-xl p-4 flex flex-col justify-between relative shadow-inner">
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#7A1C1C_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none"></div>

                    <div className="flex justify-between items-center z-10 border-b border-[#3D3226] pb-1">
                      <span className="font-cinzel text-[11px] text-[#C5A059] tracking-widest uppercase">
                        № {currentCard?.id} • {currentCard?.category}
                      </span>
                      <button 
                        onClick={(e) => { e.stopPropagation(); toggleFavorite(currentCard.id); }}
                        className="text-[#C5A059] hover:scale-110 transition"
                      >
                        {favorites.includes(currentCard.id) ? (
                          <BookmarkCheck className="w-5 h-5 fill-[#C5A059]" />
                        ) : (
                          <Bookmark className="w-5 h-5" />
                        )}
                      </button>
                    </div>

                    <div className="my-auto text-center px-2 z-10">
                      <p className="font-cinzel text-xl md:text-2xl font-bold leading-relaxed text-[#EAE0D0]">
                        "{currentCard?.text}"
                      </p>
                    </div>

                    <div className="border-t border-[#3D3226] pt-1 flex justify-between items-center text-[10px] text-[#8A7E6E] font-cinzel z-10">
                      <span>ENO & SCHMIDT</span>
                      <span>ESOTERIC</span>
                    </div>
                  </div>

                  <div className="text-center text-[9px] text-[#8A7E6E] font-cinzel tracking-widest">
                    ✦ OBLIQUE STRATEGIES ✦
                  </div>
                </div>

              </div>
            </div>

            {/* Action Control */}
            <div className="flex items-center justify-center space-x-4 mt-6 w-full">
              <button 
                onClick={drawRandom}
                className="flex-1 bg-[#7A1C1C] hover:bg-[#912222] text-[#D8CEBE] font-cinzel font-bold tracking-widest py-3 px-6 rounded-xl shadow-lg border border-[#C5A059]/60 transition flex items-center justify-center space-x-2 text-sm"
              >
                <Flame className="w-4 h-4 text-[#C5A059]" />
                <span>DRAW DIVINATION</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: CATALOG */}
        {activeTab === 'catalog' && (
          <div className="w-full space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-3 text-[#8A7E6E]" />
                <input 
                  type="text" 
                  placeholder="Search esoteric prompts..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#12100E] border border-[#3D3226] rounded-xl pl-9 pr-4 py-2 text-sm text-[#D8CEBE] focus:outline-none focus:border-[#C5A059]"
                />
              </div>
              <select 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-[#12100E] border border-[#3D3226] rounded-xl px-4 py-2 text-sm text-[#D8CEBE] focus:outline-none focus:border-[#C5A059]"
              >
                <option value="All">All Spheres</option>
                <option value="Mindset">Mindset</option>
                <option value="Action">Action</option>
                <option value="Perspective">Perspective</option>
                <option value="Sound">Sound</option>
                <option value="Constraints">Constraints</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto pr-1">
              {filteredCatalog.map(card => (
                <div key={card.id} className="bg-[#12100E] border border-[#3D3226] hover:border-[#C5A059] p-4 rounded-xl flex flex-col justify-between transition">
                  <p className="font-cinzel text-base font-semibold text-[#EAE0D0] mb-2">"{card.text}"</p>
                  <div className="flex items-center justify-between text-xs text-[#8A7E6E]">
                    <span className="bg-[#1A1613] px-2 py-0.5 rounded border border-[#3D3226] font-cinzel">{card.category}</span>
                    <button onClick={() => toggleFavorite(card.id)}>
                      {favorites.includes(card.id) ? (
                        <BookmarkCheck className="w-4 h-4 text-[#C5A059]" />
                      ) : (
                        <Bookmark className="w-4 h-4 text-[#8A7E6E] hover:text-[#C5A059]" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: GRIMOIRE / SAVED */}
        {activeTab === 'journal' && (
          <div className="w-full space-y-4">
            <h2 className="font-cinzel text-sm text-[#C5A059] uppercase tracking-wider font-bold">Saved Grimoire Prompts</h2>
            {favorites.length === 0 ? (
              <div className="bg-[#12100E] border border-[#3D3226] p-8 rounded-xl text-center text-[#8A7E6E]">
                <Skull className="w-8 h-8 mx-auto mb-2 opacity-50 text-[#C5A059]" />
                <p className="font-cinzel">Your grimoire is empty. Bookmark cards to record your divinations.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                {deck.filter(c => favorites.includes(c.id)).map(card => (
                  <div key={card.id} className="bg-[#12100E] border border-[#3D3226] p-4 rounded-xl">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-cinzel text-base font-bold text-[#EAE0D0]">"{card.text}"</p>
                      <button onClick={() => toggleFavorite(card.id)} className="text-[#C5A059]">
                        <BookmarkCheck className="w-5 h-5" />
                      </button>
                    </div>
                    <textarea 
                      placeholder="Record ritual notes or creative reflections..."
                      value={notes[card.id] || ''}
                      onChange={(e) => setNotes({...notes, [card.id]: e.target.value})}
                      className="w-full bg-[#0A0908] border border-[#3D3226] rounded-lg p-2 text-xs text-[#D8CEBE] focus:outline-none focus:border-[#C5A059] mt-2 resize-none h-16 font-serif"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full max-w-2xl py-4 border-t border-[#3D3226] text-center text-xs text-[#8A7E6E] mt-6 font-cinzel">
        Esoteric Oblique Strategies • Dark Woodcut Edition
      </footer>
    </div>
  );
}