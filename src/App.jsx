import React, { useState, useEffect, useRef } from 'react';
import { 
  Layers, Volume2, VolumeX, Bookmark, BookmarkCheck, Search, 
  Download, RefreshCw, Sparkles, Shuffle, Eye, ChevronRight
} from 'lucide-react';

const OBLIQUE_CARDS = [
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
  const [deck, setDeck] = useState(OBLIQUE_CARDS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [activeTab, setActiveTab] = useState('3d-table'); // '3d-table', 'catalog', 'saved'
  const [searchQuery, setSearchQuery] = useState('');
  const [installPrompt, setInstallPrompt] = useState(null);

  const audioCtxRef = useRef(null);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    });
  }, []);

  const currentCard = deck[currentIndex];

  // Synthesize realistic card slide sound
  const playCardFlickSound = () => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      const bufferSize = ctx.sampleRate * 0.09;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, ctx.currentTime);
      filter.Q.setValueAtTime(2.5, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
    } catch (e) {
      console.log(e);
    }
  };

  const drawNextCard = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    playCardFlickSound();

    // Slide off animation sequence
    setTimeout(() => {
      setIsFlipped(false);
      setCurrentIndex((prev) => (prev + 1) % deck.length);
      setTimeout(() => {
        setIsAnimating(false);
      }, 300);
    }, 300);
  };

  const shuffleDeck = () => {
    playCardFlickSound();
    setIsFlipped(false);
    setIsAnimating(true);
    setTimeout(() => {
      const shuffled = [...deck].sort(() => Math.random() - 0.5);
      setDeck(shuffled);
      setCurrentIndex(0);
      setIsAnimating(false);
    }, 400);
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

  const filteredCatalog = deck.filter(c => c.text.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#121110] text-[#EBE6DF] flex flex-col items-center justify-between p-4 selection:bg-[#C5A059] selection:text-black">
      {/* Header */}
      <header className="w-full max-w-xl flex items-center justify-between py-4 border-b border-[#2A2724] mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded bg-[#1A1816] border border-[#C5A059] flex items-center justify-center">
            <Layers className="w-4 h-4 text-[#C5A059]" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-widest text-[#EBE6DF] uppercase">Oblique Deck 3D</h1>
            <p className="text-[11px] text-[#8A8175]">Brian Eno & Peter Schmidt Strategies</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setSoundEnabled(!soundEnabled)} 
            className={`p-2 rounded border transition ${soundEnabled ? 'border-[#C5A059] text-[#C5A059] bg-[#C5A059]/10' : 'border-[#2A2724] text-[#8A8175]'}`}
            title="Toggle Tactile Sounds"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          
          <button 
            onClick={handleInstallClick} 
            className="px-3 py-1.5 rounded border border-[#C5A059] text-[#C5A059] hover:bg-[#C5A059] hover:text-black text-xs font-semibold tracking-wide transition flex items-center space-x-1"
          >
            <Download className="w-3.5 h-3.5 mr-1" />
            Install
          </button>
        </div>
      </header>

      {/* Main Experience */}
      <main className="w-full max-w-xl flex-1 flex flex-col items-center justify-center">
        {/* Navigation Switcher */}
        <div className="flex space-x-2 mb-6 bg-[#1A1816] p-1 rounded-xl border border-[#2A2724]">
          <button 
            onClick={() => setActiveTab('3d-table')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wider transition ${activeTab === '3d-table' ? 'bg-[#C5A059] text-black font-bold' : 'text-[#8A8175] hover:text-[#EBE6DF]'}`}
          >
            3D Deck Table
          </button>
          <button 
            onClick={() => setActiveTab('catalog')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wider transition ${activeTab === 'catalog' ? 'bg-[#C5A059] text-black font-bold' : 'text-[#8A8175] hover:text-[#EBE6DF]'}`}
          >
            All Cards ({deck.length})
          </button>
          <button 
            onClick={() => setActiveTab('saved')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wider transition ${activeTab === 'saved' ? 'bg-[#C5A059] text-black font-bold' : 'text-[#8A8175] hover:text-[#EBE6DF]'}`}
          >
            Saved ({favorites.length})
          </button>
        </div>

        {/* TAB 1: REALISTIC 3D CARD DECK TABLE */}
        {activeTab === '3d-table' && (
          <div className="flex flex-col items-center w-full max-w-sm py-4">
            
            {/* 3D Perspective Table Setup */}
            <div className="w-full aspect-[3/4.2] relative perspective-2000 flex items-center justify-center">
              
              {/* Stack effect layers beneath main card to simulate 3D deck depth */}
              <div className="absolute w-[92%] h-[94%] bg-[#22201D] border border-[#3A3530] rounded-2xl shadow-xl transform translate-y-4 -rotate-3 opacity-60"></div>
              <div className="absolute w-[95%] h-[96%] bg-[#1E1C1A] border border-[#3A3530] rounded-2xl shadow-2xl transform translate-y-2 rotate-2 opacity-80"></div>
              <div className="absolute w-[97%] h-[98%] bg-[#1A1816] border border-[#3A3530] rounded-2xl shadow-2xl transform translate-y-1 -rotate-1"></div>

              {/* ACTIVE 3D FLIPPABLE CARD */}
              <div 
                onClick={() => { setIsFlipped(!isFlipped); playCardFlickSound(); }}
                className={`w-[98%] h-[98%] relative cursor-pointer transform-style-3d transition-all duration-700 ease-out ${isFlipped ? 'rotate-y-180' : ''} ${isAnimating ? '-translate-x-full rotate-[-25deg] opacity-0' : 'translate-x-0 rotate-0 opacity-100'}`}
              >
                {/* BACK OF CARD (Deck Backing - Matte Dark Velvet with Gold Symbol) */}
                <div className="absolute inset-0 w-full h-full bg-[#181614] border-4 border-[#2A2724] rounded-2xl p-6 flex flex-col justify-between backface-hidden shadow-2xl card-edge-depth">
                  <div className="w-full h-full border-2 border-[#C5A059]/40 rounded-xl p-4 flex flex-col items-center justify-between bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:16px_16px]">
                    <div className="text-[#C5A059] text-[10px] font-mono tracking-widest uppercase">✦ OBLIQUE DECK ✦</div>
                    <div className="w-20 h-20 rounded-full border-2 border-[#C5A059] flex items-center justify-center relative bg-[#121110]">
                      <div className="w-14 h-14 border border-[#C5A059]/60 rotate-45"></div>
                      <Layers className="w-7 h-7 text-[#C5A059] absolute" />
                    </div>
                    <div className="text-[#8A8175] text-[11px] font-mono tracking-wider">TAP CARD TO REVEAL</div>
                  </div>
                </div>

                {/* FRONT OF CARD (Classic Cream Card Stock) */}
                <div className="absolute inset-0 w-full h-full bg-[#EBE6DF] text-[#111111] border-4 border-[#111111] rounded-2xl p-7 flex flex-col justify-between rotate-y-180 backface-hidden shadow-2xl">
                  {/* Top metadata */}
                  <div className="flex justify-between items-center border-b border-[#D4CEC5] pb-2 text-xs font-mono font-bold text-[#555555]">
                    <span>CARD № {currentCard?.id}</span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(currentCard.id); }}
                      className="text-[#111111] hover:scale-110 transition"
                    >
                      {favorites.includes(currentCard.id) ? (
                        <BookmarkCheck className="w-5 h-5 fill-[#111111]" />
                      ) : (
                        <Bookmark className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  {/* Main strategy prompt text */}
                  <div className="my-auto text-center px-2">
                    <p className="text-xl sm:text-2xl font-bold leading-relaxed tracking-tight text-[#111111]">
                      "{currentCard?.text}"
                    </p>
                  </div>

                  {/* Bottom classic credits */}
                  <div className="border-t border-[#D4CEC5] pt-2 flex justify-between items-center text-[10px] font-mono tracking-widest text-[#666666]">
                    <span>BRIAN ENO</span>
                    <span>PETER SCHMIDT</span>
                  </div>
                </div>

              </div>

            </div>

            {/* Tactile Control Panel */}
            <div className="flex items-center justify-between w-full mt-6 space-x-3">
              <button 
                onClick={drawNextCard}
                className="flex-1 bg-[#C5A059] hover:bg-[#D4AF67] text-black font-bold py-3.5 px-6 rounded-xl shadow-lg transition flex items-center justify-center space-x-2 text-sm tracking-wider uppercase"
              >
                <Sparkles className="w-4 h-4" />
                <span>Draw Next Card</span>
              </button>

              <button 
                onClick={shuffleDeck}
                className="p-3.5 bg-[#1A1816] hover:bg-[#252320] text-[#EBE6DF] border border-[#2A2724] rounded-xl transition"
                title="Shuffle 3D Deck"
              >
                <Shuffle className="w-5 h-5 text-[#C5A059]" />
              </button>
            </div>

            <p className="text-[11px] text-[#8A8175] mt-3">Tap card to flip over • Draw button slides top card</p>
          </div>
        )}

        {/* TAB 2: CATALOG */}
        {activeTab === 'catalog' && (
          <div className="w-full space-y-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3.5 text-[#8A8175]" />
              <input 
                type="text" 
                placeholder="Search strategies in deck..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1A1816] border border-[#2A2724] rounded-xl pl-9 pr-4 py-2.5 text-sm text-[#EBE6DF] focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            <div className="grid grid-cols-1 gap-2.5 max-h-[50vh] overflow-y-auto pr-1">
              {filteredCatalog.map(card => (
                <div key={card.id} className="bg-[#1A1816] border border-[#2A2724] hover:border-[#C5A059]/60 p-3.5 rounded-xl flex items-center justify-between transition">
                  <p className="text-sm font-medium text-[#EBE6DF] pr-3">"{card.text}"</p>
                  <button onClick={() => toggleFavorite(card.id)} className="text-[#C5A059] shrink-0">
                    {favorites.includes(card.id) ? (
                      <BookmarkCheck className="w-5 h-5 fill-[#C5A059]" />
                    ) : (
                      <Bookmark className="w-5 h-5 text-[#8A8175] hover:text-[#C5A059]" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: SAVED CARDS */}
        {activeTab === 'saved' && (
          <div className="w-full space-y-4">
            <h2 className="text-xs font-mono text-[#C5A059] uppercase tracking-wider font-bold">Saved Bookmarks</h2>
            {favorites.length === 0 ? (
              <div className="bg-[#1A1816] border border-[#2A2724] p-8 rounded-xl text-center text-[#8A8175]">
                <Bookmark className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p>No saved cards yet. Tap the bookmark icon on any card to add it to your collection.</p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-1">
                {deck.filter(c => favorites.includes(c.id)).map(card => (
                  <div key={card.id} className="bg-[#EBE6DF] text-[#111111] p-4 rounded-xl flex items-center justify-between border-2 border-[#111111]">
                    <p className="text-base font-bold">"{card.text}"</p>
                    <button onClick={() => toggleFavorite(card.id)} className="text-[#111111] shrink-0 ml-3">
                      <BookmarkCheck className="w-5 h-5 fill-[#111111]" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full max-w-xl py-3 border-t border-[#2A2724] text-center text-[11px] text-[#8A8175] mt-4 font-mono">
        Interactive 3D Oblique Strategies Deck
      </footer>
    </div>
  );
}