
import React, { useState, useEffect } from 'react';
import { Letter, CoffeeMood, PaperStyle, UserRole, MenuItemConfig } from './types';
import { Icons } from './constants';
import LetterCard from './components/LetterCard';
import SteamAnimation from './components/SteamAnimation';
import { brewInspiration, refineLetter } from './services/geminiService';

// Navigation button for the management interface
const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ComponentType; children: React.ReactNode }> = ({ active, onClick, icon: Icon, children }) => (
  <button 
    onClick={onClick}
    className={`px-6 py-2.5 rounded-full flex items-center space-x-2 transition-all duration-300 font-medium tracking-tight whitespace-nowrap ${
      active 
        ? 'bg-[#3e2723] text-[#fdfaf7] shadow-lg shadow-black/10' 
        : 'bg-white/50 text-[#3e2723] hover:bg-white border border-[#3e2723]/10 hover:border-[#3e2723]/30'
    }`}
  >
    <Icon />
    <span className="text-xs uppercase tracking-widest">{children}</span>
  </button>
);

const MenuSection: React.FC<{ title: string; children?: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-12">
    <div className="flex items-center space-x-4 mb-8">
      <div className="flex-1 h-px bg-gray-100"></div>
      <h3 className="text-xs uppercase tracking-[0.4em] font-bold text-gray-400 font-montserrat">{title}</h3>
      <div className="flex-1 h-px bg-gray-100"></div>
    </div>
    <div className="space-y-10">
      {children}
    </div>
  </div>
);

const MenuItem: React.FC<{ title: string; desc: string; price: string; onClick?: () => void; interactive?: boolean }> = ({ title, desc, price, onClick, interactive = true }) => (
  <div 
    onClick={interactive ? onClick : undefined}
    className={`w-full text-left group outline-none ${interactive ? 'cursor-pointer' : 'cursor-default opacity-60'}`}
  >
    <div className="flex justify-between items-baseline mb-2">
      <span className={`font-serif text-xl text-gray-900 font-semibold transition-all duration-300 relative ${interactive ? 'group-hover:text-amber-800' : ''}`}>
        {title}
        {interactive && <span className="absolute bottom-0 left-0 w-0 h-px bg-amber-800 transition-all duration-300 group-hover:w-full"></span>}
      </span>
      <div className={`flex-1 border-b border-dotted border-gray-200 mx-4 h-0 transition-all ${interactive ? 'group-hover:border-amber-200' : ''}`}></div>
      <span className={`font-mono text-sm text-gray-400 transition-colors ${interactive ? 'group-hover:text-amber-800' : ''}`}>{price}</span>
    </div>
    <p className="text-sm text-gray-500 font-serif italic leading-relaxed max-w-[85%]">{desc}</p>
  </div>
);

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole>(null);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  
  const [letters, setLetters] = useState<Letter[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItemConfig[]>([]);
  const [view, setView] = useState<'wall' | 'write' | 'menu-manager' | 'menu'>('wall');
  const [selectedSpecialLetter, setSelectedSpecialLetter] = useState<Letter | null>(null);
  
  const [recipient, setRecipient] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<string>(CoffeeMood.LATTE);
  const [paper, setPaper] = useState<PaperStyle>('standard');
  const [isBrewing, setIsBrewing] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);

  useEffect(() => {
    // Load Letters
    const savedLetters = localStorage.getItem('kopi_letters');
    let initialLetters: Letter[] = [];
    if (savedLetters) {
      initialLetters = JSON.parse(savedLetters);
      setLetters(initialLetters);
    } else {
      initialLetters = [
        {
          id: '1',
          recipient: 'Kopi',
          content: "halo, happy anniversary :D\n\nnagtry ko make ani nga app from scratch but i kept postponing (*ahem* procrastinating) thinking 'ah dugay pa bitaw amo anniv' but crazy how time flies. sorry nalang sa amazon water nga na waste for making this app with gemini ai.\n\nanyway, happy 1st birthday to us, hala toddler na ato relationship, maka stand na ta on our own? aw haha. thank you for a year full of priceless memories. i really really really appreciate you and everything that you do. even the little things, they mean the world to me. \n\nthank you for the fun and silly moments we shared; the random detours we made just because im a newbie navi (im trying ok); the laughs we shared over the stupidest memes and the cutest cat vids; and for all the mundane moments together that made this year so special.  bitaw oi, di lang ni nako patas-on pa kay the real one is waiting for you here in cebu, tehee.\n\nlooking forward to brewing more memories with you~ to more sunrise and sunsets to chase. \n\ni love you <3 \n\nps. i don't drink coffee, but you're my favorite kopi",
          date: 'Feb 16, 2025',
          mood: CoffeeMood.LATTE,
          paperType: 'parchment',
          isSpecial: true
        }
      ];
      setLetters(initialLetters);
      localStorage.setItem('kopi_letters', JSON.stringify(initialLetters));
    }

    // Load Menu Configuration
    const savedMenu = localStorage.getItem('kopi_menu_config');
    if (savedMenu) {
      setMenuItems(JSON.parse(savedMenu));
    } else {
      const defaultMenu: MenuItemConfig[] = [
        {
          id: 'anniversary',
          title: "Anniversary Special",
          description: "Our house favorite. A deep, soulful blend of shared history, laughter, and a touch of sweetness. Best enjoyed in silence.",
          price: "02.16",
          letterId: '1',
          isAvailable: true,
          category: 'The Signature'
        },
        {
          id: 'vanilla-heart',
          title: "Vanilla Heart Latte",
          description: "A smooth, comforting draft for a bright morning. Notes of soft promises and gentle touches.",
          price: "Priceless",
          isAvailable: false,
          category: 'Sweet Additions'
        },
        {
          id: 'midnight-espresso',
          title: "Midnight Espresso",
          description: "Dark, complex, and unashamedly honest. For the late-night thoughts that refuse to stay hidden.",
          price: "00:00",
          isAvailable: false,
          category: 'Daily Brews'
        },
        {
          id: 'so-matcha',
          title: "(Miss you) So Matcha",
          description: "Earthy and bittersweet, with a lingering green note. For when you miss someone so much, it shows in every sip.",
          price: "24/7",
          isAvailable: false,
          category: 'Daily Brews'
        }
      ];
      setMenuItems(defaultMenu);
      localStorage.setItem('kopi_menu_config', JSON.stringify(defaultMenu));
    }

    const savedRole = sessionStorage.getItem('kopi_role');
    if (savedRole) {
      const roleVal = savedRole as UserRole;
      setRole(roleVal);
      setView(roleVal === 'recipient' ? 'menu' : 'wall');
    }
  }, []);

  const saveMenu = (updatedMenu: MenuItemConfig[]) => {
    setMenuItems(updatedMenu);
    localStorage.setItem('kopi_menu_config', JSON.stringify(updatedMenu));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'blahck09') {
      setRole('creator');
      sessionStorage.setItem('kopi_role', 'creator');
      setView('wall');
    } else if (password === '250216') {
      setRole('recipient');
      sessionStorage.setItem('kopi_role', 'recipient');
      setView('menu');
    } else {
      setLoginError(true);
      setTimeout(() => setLoginError(false), 2000);
    }
  };

  const handlePost = () => {
    if (!recipient || !content) return;
    const newLetter: Letter = {
      id: Date.now().toString(),
      recipient,
      content,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      mood,
      paperType: paper,
      isSpecial: recipient.toLowerCase().includes('kopi') && letters.length === 0
    };
    const updated = [newLetter, ...letters];
    setLetters(updated);
    localStorage.setItem('kopi_letters', JSON.stringify(updated));
    setRecipient('');
    setContent('');
    setAiSuggestion(null);
    setView('wall');
  };

  const handleLogout = () => {
    setRole(null);
    setPassword('');
    sessionStorage.removeItem('kopi_role');
  };

  const updateMenuItem = (id: string, updates: Partial<MenuItemConfig>) => {
    const updated = menuItems.map(item => item.id === id ? { ...item, ...updates } : item);
    saveMenu(updated);
  };

  const addNewMenuItem = () => {
    const newItem: MenuItemConfig = {
      id: Date.now().toString(),
      title: "New Brew",
      description: "A fresh addition to our menu.",
      price: "0.00",
      isAvailable: false,
      category: 'Daily Brews'
    };
    saveMenu([...menuItems, newItem]);
  };

  const deleteMenuItem = (id: string) => {
    if (confirm("Remove this item from the menu?")) {
      saveMenu(menuItems.filter(item => item.id !== id));
    }
  };

  // Helper to render the actual Kopi Menu UI
  const renderKopiMenu = () => (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000">
      {selectedSpecialLetter ? (
        <div>
          <button 
            onClick={() => setSelectedSpecialLetter(null)}
            className="mb-12 flex items-center space-x-3 text-gray-400 hover:text-[#3e2723] transition-colors group"
          >
            <div className="p-2 rounded-full border border-gray-100 bg-white group-hover:border-gray-300 transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
            </div>
            <span className="text-xs uppercase tracking-widest font-bold">Back to Menu</span>
          </button>
          <div className="scale-[1.05] origin-top transition-all duration-700">
            <LetterCard letter={selectedSpecialLetter} />
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-none shadow-2xl p-16 sm:p-24 border border-gray-100 max-w-2xl mx-auto relative group overflow-hidden">
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]"></div>
          
          <div className="absolute -top-10 -right-10 w-40 h-40 border-[1px] border-amber-900/5 rounded-full pointer-events-none"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 border-[1px] border-amber-900/5 rounded-full pointer-events-none"></div>

          <div className="text-center mb-16 relative">
            <div className="mb-2">
              <Icons.Feather />
            </div>
            <h2 className="font-serif text-5xl font-medium text-gray-900 mb-2 tracking-tighter uppercase italic">Menu de L'Amour</h2>
            <p className="text-[10px] tracking-[0.5em] text-gray-400 uppercase font-montserrat">Brewed exclusively for Kopi</p>
            <div className="w-20 h-px bg-[#3e2723]/10 mx-auto mt-6"></div>
          </div>

          {['The Signature', 'Daily Brews', 'Sweet Additions'].map((cat) => {
            const items = menuItems.filter(item => item.category === cat);
            if (items.length === 0) return null;
            return (
              <MenuSection key={cat} title={cat}>
                {items.map(item => (
                  <MenuItem 
                    key={item.id}
                    title={item.title}
                    desc={item.description}
                    price={item.price}
                    interactive={item.isAvailable && !!item.letterId}
                    onClick={() => {
                      const letter = letters.find(l => l.id === item.letterId);
                      if (letter) setSelectedSpecialLetter(letter);
                    }}
                  />
                ))}
              </MenuSection>
            );
          })}

          <div className="mt-20 text-center px-12 py-6 bg-amber-50/30 rounded-2xl border border-dashed border-amber-200/50">
            <p className="text-xs font-serif italic text-amber-900/60 leading-relaxed">
              "Some menu items are currently brewing. The words will be poured soon."
            </p>
          </div>

          <div className="mt-24 text-center border-t border-gray-50 pt-10 relative">
            <p className="font-serif text-[11px] tracking-[0.3em] text-gray-400 uppercase italic mb-1">Steeped in Intention • Poured with Grace</p>
            <p className="text-[9px] text-gray-300 font-mono italic">No refills needed when it's this good.</p>
          </div>
        </div>
      )}
    </div>
  );

  if (!role) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdfaf7] px-4 relative overflow-hidden font-montserrat">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-900/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-900/5 rounded-full blur-[120px]"></div>
        
        <div className="max-w-md w-full bg-white p-12 rounded-[2.5rem] shadow-2xl border border-gray-100 text-center relative z-10 animate-in fade-in zoom-in duration-1000">
          <div className="flex justify-center mb-8">
            <div className="p-5 bg-[#3e2723] rounded-full text-white shadow-xl relative steam-drift">
              <Icons.Coffee />
              <SteamAnimation />
            </div>
          </div>
          <h1 className="text-4xl font-black text-[#3e2723] mb-3 tracking-tighter">Letters to Kopi</h1>
          <p className="text-gray-400 mb-10 text-sm font-serif italic tracking-wide">A digital nook for the unspoken words.</p>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative group">
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="PASSCODE"
                className={`w-full px-8 py-5 rounded-2xl border-2 ${loginError ? 'border-red-200 bg-red-50' : 'border-gray-50 bg-gray-50/50 group-hover:bg-gray-50 group-hover:border-gray-100'} focus:outline-none focus:border-[#3e2723]/20 focus:bg-white text-center tracking-[0.6em] text-[#3e2723] font-black transition-all duration-300`}
                autoFocus
              />
            </div>
            <button 
              type="submit"
              className="w-full py-5 bg-[#3e2723] text-white rounded-2xl font-bold shadow-xl shadow-black/10 hover:shadow-2xl hover:bg-[#2d1d1a] active:scale-[0.98] transition-all duration-300 uppercase tracking-widest text-xs"
            >
              Step Inside
            </button>
          </form>
          {loginError && <p className="mt-6 text-xs text-red-400 font-medium animate-pulse">That code doesn't fit the lock.</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32">
      <header className="pt-16 pb-12 px-6 text-center relative z-10">
        <div className="absolute top-8 right-8">
          <button onClick={handleLogout} className="text-[10px] uppercase tracking-[0.3em] text-[#3e2723]/30 hover:text-[#3e2723] font-bold transition-colors">
            Leave Nook
          </button>
        </div>
        
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-[#3e2723] rounded-full text-white shadow-lg relative">
            <Icons.Coffee />
            <SteamAnimation />
          </div>
        </div>
        <h1 className="text-5xl font-black text-[#3e2723] mb-2 tracking-tighter font-montserrat">Letters to Kopi</h1>
        <p className="text-gray-400 text-sm font-serif italic tracking-widest opacity-80 uppercase">
          {role === 'creator' ? (view === 'menu' ? 'Menu Preview' : 'Stationary Room') : 'Reserved Selection'}
        </p>
      </header>

      {role === 'creator' && (
        <nav className="flex justify-center flex-wrap gap-4 mb-16 sticky top-6 z-50 px-4">
          <NavButton active={view === 'wall'} onClick={() => setView('wall')} icon={Icons.Mail}>Letters</NavButton>
          <NavButton active={view === 'menu-manager'} onClick={() => setView('menu-manager')} icon={Icons.Feather}>Menu Manager</NavButton>
          <NavButton active={view === 'menu'} onClick={() => setView('menu')} icon={Icons.Coffee}>Kopi View</NavButton>
          <NavButton active={view === 'write'} onClick={() => setView('write')} icon={Icons.Pen}>Write</NavButton>
        </nav>
      )}

      <main className="max-w-5xl mx-auto px-6 relative z-10">
        {role === 'recipient' || (role === 'creator' && view === 'menu') ? (
          renderKopiMenu()
        ) : view === 'wall' ? (
          <div className="animate-in fade-in duration-700 space-y-4">
            {letters.length === 0 ? (
              <div className="text-center py-32 bg-white/40 rounded-[3rem] border-2 border-dashed border-[#3e2723]/5">
                <p className="text-[#3e2723]/30 font-serif italic text-xl">The archive is empty. Start your first draft...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {letters.map(letter => (
                  <LetterCard key={letter.id} letter={letter} />
                ))}
              </div>
            )}
          </div>
        ) : view === 'menu-manager' ? (
          <div className="animate-in slide-in-from-left-8 duration-700 space-y-8">
             <div className="bg-white rounded-[2.5rem] shadow-2xl p-12 border border-gray-100">
                <div className="flex justify-between items-center mb-10">
                  <div className="flex flex-col">
                    <h2 className="text-2xl font-serif font-bold text-gray-800 italic">Menu Archive</h2>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Manage your offerings and link your letters</p>
                  </div>
                  <button 
                    onClick={addNewMenuItem}
                    className="px-6 py-2.5 bg-[#3e2723] text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-all shadow-md"
                  >
                    + Add Menu Item
                  </button>
                </div>
                
                <div className="space-y-12">
                  {['The Signature', 'Daily Brews', 'Sweet Additions'].map((cat) => (
                    <div key={cat} className="space-y-6">
                      <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold text-amber-800 bg-amber-50 px-4 py-1.5 rounded-full inline-block">{cat}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {menuItems.filter(item => item.category === cat).map(item => (
                          <div key={item.id} className="p-8 bg-[#fcfafa] rounded-3xl border border-gray-100 relative group hover:border-amber-200 transition-colors">
                            <button 
                              onClick={() => deleteMenuItem(item.id)}
                              className="absolute top-4 right-4 text-gray-300 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>

                            <div className="space-y-5">
                              <div>
                                <label className="text-[8px] uppercase tracking-widest text-gray-400 font-bold block mb-1">Item Title</label>
                                <input 
                                  value={item.title} 
                                  onChange={(e) => updateMenuItem(item.id, { title: e.target.value })}
                                  placeholder="Title"
                                  className="w-full bg-transparent border-b border-gray-100 focus:border-amber-800 outline-none font-serif text-lg font-bold placeholder:text-gray-200 transition-all"
                                />
                              </div>
                              
                              <div>
                                <label className="text-[8px] uppercase tracking-widest text-gray-400 font-bold block mb-1">Flavor Notes (Description)</label>
                                <textarea 
                                  value={item.description}
                                  onChange={(e) => updateMenuItem(item.id, { description: e.target.value })}
                                  placeholder="Description"
                                  rows={2}
                                  className="w-full bg-transparent border-b border-gray-100 focus:border-amber-800 outline-none text-xs italic text-gray-500 resize-none placeholder:text-gray-200 transition-all"
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-[8px] uppercase tracking-widest text-gray-400 font-bold block mb-1">Price/Time</label>
                                  <input 
                                    value={item.price}
                                    onChange={(e) => updateMenuItem(item.id, { price: e.target.value })}
                                    placeholder="Price"
                                    className="w-full bg-transparent border-b border-gray-100 focus:border-amber-800 outline-none text-xs font-mono text-gray-400"
                                  />
                                </div>
                                <div>
                                  <label className="text-[8px] uppercase tracking-widest text-gray-400 font-bold block mb-1">Category</label>
                                  <select 
                                    value={item.category}
                                    onChange={(e) => updateMenuItem(item.id, { category: e.target.value as any })}
                                    className="w-full bg-white text-[10px] uppercase tracking-widest font-bold text-gray-400 outline-none border border-gray-100 rounded-lg px-2 py-1"
                                  >
                                    <option value="The Signature">The Signature</option>
                                    <option value="Daily Brews">Daily Brews</option>
                                    <option value="Sweet Additions">Sweet Additions</option>
                                  </select>
                                </div>
                              </div>

                              <div className="pt-4 border-t border-gray-50 flex flex-col space-y-4">
                                <div>
                                  <label className="text-[8px] uppercase tracking-widest text-gray-400 font-bold block mb-1">Pour Letter Into Cup:</label>
                                  <select 
                                    value={item.letterId || ''}
                                    onChange={(e) => updateMenuItem(item.id, { letterId: e.target.value || undefined })}
                                    className="w-full bg-white text-[10px] border border-gray-100 rounded-lg px-2 py-2 outline-none text-gray-700 shadow-sm"
                                  >
                                    <option value="">-- No Letter Linked --</option>
                                    {letters.map(l => (
                                      <option key={l.id} value={l.id}>{l.date} - To: {l.recipient}</option>
                                    ))}
                                  </select>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-2">
                                    <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Status:</span>
                                    <span className={`text-[10px] font-bold uppercase tracking-widest ${item.isAvailable && item.letterId ? 'text-green-500' : 'text-amber-500'}`}>
                                      {item.isAvailable && item.letterId ? 'Serving' : 'Brewing'}
                                    </span>
                                  </div>
                                  <label className="flex items-center space-x-2 cursor-pointer group">
                                    <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400 group-hover:text-amber-800 transition-colors">Visible to Kopi?</span>
                                    <input 
                                      type="checkbox" 
                                      checked={item.isAvailable}
                                      onChange={(e) => updateMenuItem(item.id, { isAvailable: e.target.checked })}
                                      className="w-4 h-4 rounded accent-amber-800"
                                    />
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
             </div>
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden animate-in slide-in-from-right-8 duration-700">
            <div className="bg-[#fcfafa] p-8 border-b border-gray-100 flex flex-wrap gap-6 items-center justify-between">
              <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
                {(Object.values(CoffeeMood) as string[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMood(m)}
                    className={`px-4 py-2 text-[10px] uppercase tracking-widest rounded-full border transition-all duration-300 ${mood === m ? 'bg-[#3e2723] text-white border-[#3e2723] shadow-md' : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300'}`}
                  >
                    {m.split('(')[0]}
                  </button>
                ))}
              </div>
              <div className="flex space-x-2 bg-white p-1 rounded-full shadow-inner border border-gray-50">
                {(['standard', 'napkin', 'parchment'] as PaperStyle[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPaper(p)}
                    className={`px-4 py-1.5 text-[10px] uppercase tracking-widest rounded-full transition-all duration-300 ${paper === p ? 'bg-amber-100 text-amber-900' : 'text-gray-300 hover:text-gray-500'}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-12">
              <div className="mb-10 group">
                <label className="block text-[10px] uppercase tracking-[0.3em] font-black text-gray-300 mb-3 group-focus-within:text-[#3e2723] transition-colors">Recipient</label>
                <input 
                  type="text" 
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="E.g. Kopi"
                  className="w-full text-3xl font-serif bg-transparent border-b border-gray-50 focus:border-[#3e2723]/30 outline-none pb-4 text-[#3e2723] placeholder:text-gray-100 transition-all duration-500"
                />
              </div>

              <div className="mb-10 relative group">
                <label className="block text-[10px] uppercase tracking-[0.3em] font-black text-gray-300 mb-3 group-focus-within:text-[#3e2723] transition-colors">The Narrative</label>
                <textarea 
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={12}
                  placeholder="What's left unsaid?"
                  className={`w-full p-8 rounded-3xl border border-gray-50 focus:ring-4 focus:ring-[#3e2723]/5 outline-none text-xl leading-[1.8] text-[#3e2723] placeholder:text-gray-100 transition-all duration-500 ${paper === 'parchment' ? 'bg-[#fcf5e5] font-serif shadow-inner border-[#e5d5b5]' : paper === 'napkin' ? 'font-mono bg-[#fafafa] shadow-inner border-dashed border-gray-200' : 'bg-white shadow-inner'}`}
                />
              </div>

              <div className="mb-12 bg-gray-50/50 rounded-[2rem] p-8 border border-gray-50">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-white rounded-full shadow-sm text-amber-800"><Icons.Sparkles /></div>
                  <h4 className="font-serif italic text-lg text-gray-700">The Barista's Note</h4>
                </div>
                <div className="flex flex-wrap gap-3 mb-6">
                  <button 
                    onClick={async () => { setIsBrewing(true); setAiSuggestion(await brewInspiration(mood, recipient || "Someone Special")); setIsBrewing(false); }}
                    disabled={isBrewing}
                    className="text-[10px] uppercase tracking-widest px-6 py-3 bg-[#3e2723] text-white rounded-xl hover:bg-black disabled:opacity-50 transition-all duration-300 font-bold"
                  >
                    {isBrewing ? 'Steeping...' : 'Get Inspiration'}
                  </button>
                  <button 
                    onClick={async () => { if (!content) return; setIsBrewing(true); setAiSuggestion(await refineLetter(content)); setIsBrewing(false); }}
                    disabled={isBrewing || !content}
                    className="text-[10px] uppercase tracking-widest px-6 py-3 bg-white text-[#3e2723] border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-all duration-300 font-bold"
                  >
                    Refine Draft
                  </button>
                </div>
                {aiSuggestion && (
                  <div className="text-sm italic text-gray-600 bg-white p-6 rounded-2xl border border-gray-100 leading-relaxed shadow-sm animate-in fade-in slide-in-from-bottom-2">
                    "{aiSuggestion}"
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <button 
                  onClick={handlePost}
                  disabled={!recipient || !content}
                  className="px-12 py-5 bg-[#3e2723] text-white rounded-2xl shadow-2xl hover:shadow-black/20 hover:-translate-y-1 transition-all duration-300 disabled:opacity-30 disabled:translate-y-0 font-bold uppercase tracking-[0.2em] text-xs"
                >
                  Seal & Send
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-40 pb-20 text-center opacity-30 px-6">
        <div className="flex justify-center space-x-4 mb-4">
          <div className="w-1 h-1 bg-[#3e2723] rounded-full"></div>
          <div className="w-1 h-1 bg-[#3e2723] rounded-full"></div>
          <div className="w-1 h-1 bg-[#3e2723] rounded-full"></div>
        </div>
        <p className="text-[10px] tracking-[0.4em] uppercase font-bold text-[#3e2723] font-montserrat">Letters to Kopi &copy; 2024</p>
        <p className="text-[10px] font-serif italic text-gray-500 mt-2">Reserved for the brave hearts and quiet souls.</p>
      </footer>
    </div>
  );
};

export default App;
