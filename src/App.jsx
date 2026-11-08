import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, RotateCw, Bookmark, BookmarkCheck, Volume2, VolumeX, 
  Plus, Search, Info, Music, Compass, Feat, Layers, Share2, Download, Filter
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
  const [activeTab, setActiveTab] = useState('studio'); // 'studio', 'catalog', 'journal'
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [notes, setNotes] = useState({});
  const [customCardText, setCustomCardText] = useState('');
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
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(110, ctx.currentTime); // A2 tone
      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
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
    }, 200);
  };

  const toggleFavorite = (id) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleAddCustomCard = (e) => {
    e.preventDefault();
    if (!customCardText.trim()) return;
    const newCard = {
      id: Date.now(),
      text: customCardText.trim(),
      category: "Custom"
    };
    setDeck([newCard, ...deck]);
    setCurrentIndex(0);
    setCustomCardText('');
    setIsFlipped(true);
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
    <div className="min-h-screen bg-[#0F0E0C] text-[#E6DFD5] flex flex-col items-center justify-between p-4 selection:bg-[#C5A059] selection:text-black">
      {/* Header */}
      <header className="w-full max-w-2xl flex items-center justify-between py-4 border-b border-[#3A332A]/60 mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full border border-[#C5A059] flex items-center justify-center bg-[#1A1815]">
            <Sparkles className="w-4 h-4 text-[#C5A059]" />
          </div>
          <div>
            <h1 className="font-cinzel text-lg tracking-wider text-[#C5A059] uppercase font-bold">Oblique Tarot</h1>
            <p className="text-xs text-[#8A8175] font-garamond italic">Brian Eno & Peter Schmidt Strategies</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setSoundEnabled(!soundEnabled)} 
            className={`p-2 rounded-lg border transition ${soundEnabled ? 'border-[#C5A059] text-[#C5A059] bg-[#C5A059]/10' : 'border-[#3A332A] text-[#8A8175]'}`}
            title="Toggle Ambient Audio"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
          
          <button 
            onClick={handleInstallClick} 
            className="px-3 py-1.5 rounded-lg border border-[#C5A059] text-[#C5A059] hover:bg-[#C5A059] hover:text-black text-xs font-semibold tracking-wide transition flex items-center space-x-1"
          >
            <Download className="w-3.5 h-3.5 mr-1" />
            Install App
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-2xl flex-1 flex flex-col justify-center items-center">
        {/* Navigation Tabs */}
        <div className="flex space-x-4 mb-6 bg-[#161412] p-1.5 rounded-xl border border-[#3A332A]">
          <button 
            onClick={() => setActiveTab('studio')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'studio' ? 'bg-[#C5A059] text-black font-semibold' : 'text-[#8A8175] hover:text-[#E6DFD5]'}`}
          >
            Card Studio
          </button>
          <button 
            onClick={() => setActiveTab('catalog')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'catalog' ? 'bg-[#C5A059] text-black font-semibold' : 'text-[#8A8175] hover:text-[#E6DFD5]'}`}
          >
            Catalog ({deck.length})
          </button>
          <button 
            onClick={() => setActiveTab('journal')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'journal' ? 'bg-[#C5A059] text-black font-semibold' : 'text-[#8A8175] hover:text-[#E6DFD5]'}`}
          >
            Saved ({favorites.length})
          </button>
        </div>

        {/* TAB 1: STUDIO (3D CARD FLIP EXPERIENCE) */}
        {activeTab === 'studio' && (
          <div className="flex flex-col items-center w-full max-w-sm">
            {/* 3D Card Box */}
            <div 
              onClick={() => { setIsFlipped(!isFlipped); playSynthDrone(); }}
              className="w-full aspect-[3/5] relative perspective-1000 cursor-pointer group"
            >
              <div className={`w-full h-full duration-700 transform-style-3d transition-transform ${isFlipped ? 'rotate-y-180' : ''}`}>
                
                {/* CARD BACK (Engraved Pattern) */}
                <div className="absolute inset-0 w-full h-full bg-[#1A1815] border-2 border-[#C5A059] rounded-2xl shadow-2xl p-6 flex flex-col justify-between backface-hidden">
                  <div className="w-full h-full border border-[#C5A059]/40 rounded-xl p-4 flex flex-col items-center justify-between bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:16px_16px]">
                    <div className="text-[#C5A059] text-xs font-cinzel tracking-widest">✦ OBLIQUE TAROT ✦</div>
                    <div className="w-24 h-24 rounded-full border-2 border-[#C5A059] flex items-center justify-center relative">
                      <div className="w-16 h-16 border border-[#C5A059] rotate-45"></div>
                      <Compass className="w-8 h-8 text-[#C5A059] absolute" />
                    </div>
                    <div className="text-[#8A8175] text-xs font-garamond italic">Tap to reveal prompt</div>
                  </div>
                </div>

                {/* CARD FRONT (Parchment & Strategy) */}
                <div className="absolute inset-0 w-full h-full bg-[#F4EBE1] text-[#1A1815] border-2 border-[#C5A059] rounded-2xl shadow-2xl p-6 flex flex-col justify-between rotate-y-180 backface-hidden">
                  <div className="flex justify-between items-center border-b border-[#C5A059]/40 pb-2">
                    <span className="font-cinzel text-xs font-bold tracking-wider text-[#9A7B39] uppercase">
                      № {currentCard?.id} • {currentCard?.category}
                    </span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(currentCard.id); }}
                      className="text-[#9A7B39] hover:scale-110 transition"
                    >
                      {favorites.includes(currentCard.id) ? (
                        <BookmarkCheck className="w-5 h-5 fill-[#9A7B39]" />
                      ) : (
                        <Bookmark className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  <div className="my-auto text-center px-2">
                    <p className="font-garamond text-2xl md:text-3xl font-bold leading-tight text-[#1A1815]">
                      "{currentCard?.text}"
                    </p>
                  </div>

                  <div className="border-t border-[#C5A059]/40 pt-2 flex justify-between items-center text-[10px] text-[#8A8175] font-cinzel">
                    <span>BRIAN ENO</span>
                    <span>PETER SCHMIDT</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Studio Action Controls */}
            <div className="flex items-center justify-center space-x-4 mt-6 w-full">
              <button 
                onClick={drawRandom}
                className="flex-1 bg-[#C5A059] hover:bg-[#D4AF67] text-black font-semibold py-3 px-6 rounded-xl shadow-lg transition flex items-center justify-center space-x-2 font-cinzel text-sm"
              >
                <Sparkles className="w-4 h-4" />
                <span>Draw Prompt</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: CATALOG */}
        {activeTab === 'catalog' && (
          <div className="w-full space-y-4">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-3 text-[#8A8175]" />
                <input 
                  type="text" 
                  placeholder="Search prompts..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#161412] border border-[#3A332A] rounded-xl pl-9 pr-4 py-2 text-sm text-[#E6DFD5] focus:outline-none focus:border-[#C5A059]"
                />
              </div>
              <select 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-[#161412] border border-[#3A332A] rounded-xl px-4 py-2 text-sm text-[#E6DFD5] focus:outline-none focus:border-[#C5A059]"
              >
                <option value="All">All Categories</option>
                <option value="Mindset">Mindset</option>
                <option value="Action">Action</option>
                <option value="Perspective">Perspective</option>
                <option value="Sound">Sound</option>
                <option value="Constraints">Constraints</option>
              </select>
            </div>

            {/* Grid List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto pr-1">
              {filteredCatalog.map(card => (
                <div key={card.id} className="bg-[#161412] border border-[#3A332A] hover:border-[#C5A059]/60 p-4 rounded-xl flex flex-col justify-between transition">
                  <p className="font-garamond text-lg font-semibold text-[#F4EBE1] mb-2">"{card.text}"</p>
                  <div className="flex items-center justify-between text-xs text-[#8A8175]">
                    <span className="bg-[#1A1815] px-2 py-0.5 rounded border border-[#3A332A]">{card.category}</span>
                    <button onClick={() => toggleFavorite(card.id)}>
                      {favorites.includes(card.id) ? (
                        <BookmarkCheck className="w-4 h-4 text-[#C5A059]" />
                      ) : (
                        <Bookmark className="w-4 h-4 text-[#8A8175] hover:text-[#C5A059]" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: SAVED & NOTES */}
        {activeTab === 'journal' && (
          <div className="w-full space-y-4">
            <h2 className="font-cinzel text-sm text-[#C5A059] uppercase tracking-wider font-semibold">Saved Favorites</h2>
            {favorites.length === 0 ? (
              <div className="bg-[#161412] border border-[#3A332A] p-8 rounded-xl text-center text-[#8A8175]">
                <Bookmark className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No bookmarked cards yet. Tap the star icon on any card to save it here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {deck.filter(c => favorites.includes(c.id)).map(card => (
                  <div key={card.id} className="bg-[#161412] border border-[#3A332A] p-4 rounded-xl">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-garamond text-lg font-bold text-[#F4EBE1]">"{card.text}"</p>
                      <button onClick={() => toggleFavorite(card.id)} className="text-[#C5A059]">
                        <BookmarkCheck className="w-5 h-5" />
                      </button>
                    </div>
                    <textarea 
                      placeholder="Write your creative thoughts or reflections here..."
                      value={notes[card.id] || ''}
                      onChange={(e) => setNotes({...notes, [card.id]: e.target.value})}
                      className="w-full bg-[#0F0E0C] border border-[#3A332A] rounded-lg p-2 text-xs text-[#E6DFD5] focus:outline-none focus:border-[#C5A059] mt-2 resize-none h-16"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full max-w-2xl py-4 border-t border-[#3A332A]/60 text-center text-xs text-[#8A8175] mt-6">
        Designed for creative breakthroughs • Vintage Tarot Edition
      </footer>
    </div>
  );
}