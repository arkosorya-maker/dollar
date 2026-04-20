'use client';

import { useState, useEffect, Fragment } from 'react';
import { ArrowLeftRight, TrendingUp, TrendingDown, ChevronRight, User, Share2, Info, Moon, Languages, ChevronDown } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line } from 'recharts';
import Image from 'next/image';

const mockCurrencies = [
  { id: 'USD', name: 'دۆلاری ئەمریکی', flag: '🇺🇸', rate: 154500, change: 0.12, amount: 100 },
  { id: 'EUR', name: 'یۆرۆ', flag: '🇪🇺', rate: 165000, change: -0.07, amount: 100 },
  { id: 'GBP', name: 'پاوەندی بەریتانی', flag: '🇬🇧', rate: 195000, change: -0.12, amount: 100 },
  { id: 'KWD', name: 'دیناری کوەیتی', flag: '🇰🇼', rate: 498000, change: 0.25, amount: 100 },
  { id: 'JOD', name: 'دیناری ئوردنی', flag: '🇯🇴', rate: 216000, change: 0.10, amount: 100 },
  { id: 'AED', name: 'دیرهەمی ئیماراتی', flag: '🇦🇪', rate: 41700, change: 0.50, amount: 100 },
  { id: 'TRY', name: 'لیرەی تورکی', flag: '🇹🇷', rate: 4500, change: 0.15, amount: 100 },
  { id: 'IRR', name: 'تمەنی ئێرانی', flag: '🇮🇷', rate: 2600, change: 0.05, amount: 100000 },
  { id: 'IQD', name: 'دیناری عێراقی', flag: '🇮🇶', rate: 1, change: 0.00, amount: 1 },
];

const mockGold = [
  { id: '24K', name: 'زێڕی عەیارە ٢٤', priceIQD: 1063000 },
  { id: '21K', name: 'زێڕی عەیارە ٢١', priceIQD: 1015000 },
  { id: '18K', name: 'زێڕی عەیارە ١٨', priceIQD: 870000 },
];

const btcPrice = 67000;

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [liveCurrencies, setLiveCurrencies] = useState(mockCurrencies);
  const [liveGold, setLiveGold] = useState(mockGold);

  useEffect(() => {
    let isFetchingRates = false;
    let isFetchingGold = false;

    const fetchLiveRates = async () => {
      if (isFetchingRates) return;
      isFetchingRates = true;
      try {
        const res = await fetch('/api/rates?t=' + Date.now(), { cache: 'no-store' });
        const data = await res.json();
        if (data && data.length > 0) {
          setLiveCurrencies(data);
        }
      } catch (e) {
        console.error("Error fetching live rates", e);
      } finally {
        isFetchingRates = false;
      }
    };

    const fetchLiveGold = async () => {
      if (isFetchingGold) return;
      isFetchingGold = true;
      try {
        const res = await fetch('/api/gold?t=' + Date.now(), { cache: 'no-store' });
        const data = await res.json();
        if (data && data.length > 0) {
          setLiveGold(data);
        }
      } catch (e) {
        console.error("Error fetching live gold", e);
      } finally {
        isFetchingGold = false;
      }
    };

    fetchLiveRates();
    fetchLiveGold(); // Fetch immediately
    
    // ئەپدەیتکردنەوە هەر ٥ چرکە جارێک بۆ ئەوەی ڕاستەوخۆ بێت و بلۆک نەبێت
    const interval = setInterval(() => {
      fetchLiveRates();
      fetchLiveGold();
    }, 5000); 
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-[100dvh] flex flex-col bg-[#0D0D1A] overflow-hidden text-white mx-auto max-w-md relative shadow-zinc-950 shadow-2xl">
      {/* Main Content Area */}
      <div className="flex-1 w-full relative overflow-hidden bg-[#0D0D1A]">
        {activeTab === 'home' && <HomeTab currencies={liveCurrencies} onConvert={(id) => setActiveTab('converter')} />}
        {activeTab === 'converter' && <ConverterTab currencies={liveCurrencies} onBack={() => setActiveTab('home')} />}
        {activeTab === 'gold' && <GoldTab gold={liveGold} />}
        {activeTab === 'profile' && <ProfileTab />}
      </div>

      {/* Bottom Navigation */}
      <nav className="h-[64px] shrink-0 bg-[#13132B] border-t border-[rgba(255,255,255,0.05)] flex items-center justify-around px-2 z-50">
        <NavItem id="home" emoji="🏠" label="سەرەکی" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
        <NavItem id="converter" emoji="🔄" label="گۆڕین" active={activeTab === 'converter'} onClick={() => setActiveTab('converter')} />
        <NavItem id="gold" emoji="🪙" label="ئاڵتوون" active={activeTab === 'gold'} onClick={() => setActiveTab('gold')} />
        <NavItem id="profile" emoji="👤" label="پرۆفایل" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
      </nav>
    </div>
  );
}

function NavItem({ id, emoji, label, active, onClick }: { id: string, emoji: string, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${active ? 'text-[#C9A84C]' : 'text-white/60 hover:text-white'}`}
    >
      <div className="text-xl leading-none" style={{ filter: active ? 'sepia(1) hue-rotate(10deg) saturate(3) brightness(1.2)' : 'grayscale(1)' }}>{emoji}</div>
      <span className="text-[10px] font-medium" dir="rtl">{label}</span>
    </button>
  );
}

function HomeTab({ currencies, onConvert }: { currencies: any[], onConvert: (id: string) => void }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(s => (s + 1) % 3);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full h-full overflow-y-auto overflow-x-hidden">
      {/* Banner Slider */}
      <div className="w-full h-[220px] relative shrink-0 bg-[#13132B]" style={{background: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.5)), url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="220"><rect width="400" height="220" fill="%2313132B"/><path d="M0 110 Q 100 80 200 110 T 400 110" stroke="%23C9A84C" stroke-width="2" fill="none"/></svg>')`, backgroundSize: 'cover'}}>
        <div className="absolute inset-0 flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
          {[1, 2, 3].map((slide, i) => (
            <div key={i} className="w-full h-full shrink-0 relative flex items-center justify-center">
              <div className="absolute inset-x-8 bottom-8 flex justify-end">
                <div className="bg-[#C9A84C] text-black px-3 py-1 rounded text-sm font-bold">بازاری ئاڵتوون</div>
              </div>
            </div>
          ))}
        </div>
        {/* Slider Docs */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {[0, 1, 2].map(i => (
            <div key={i} className={`w-2 h-2 rounded-full transition-colors ${currentSlide === i ? 'bg-[#C9A84C]' : 'bg-white/30'}`} />
          ))}
        </div>
      </div>

      <div className="mt-2 mb-20 pb-4">
        <div className="flex justify-between items-center mb-4 px-4">
          <h2 className="text-lg font-bold" dir="rtl">نرخەکانی ئەمرۆ</h2>
        </div>

        <div className="flex flex-col">
          {currencies.filter(c => c.id !== 'IQD').map((c, index) => {
            const row = (
              <div 
                key={c.id} 
                onClick={() => onConvert(c.id)}
                className="bg-[#13132B] rounded-xl p-3 mx-4 my-2 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all duration-300"
              >
                <div className="flex flex-col items-start min-w-[100px]">
                  <div className={`font-mono text-lg font-bold transition-colors duration-300 ${c.change > 0 ? 'text-[#22c55e]' : c.change < 0 ? 'text-[#ef4444]' : 'text-white'}`}>
                    {Math.round(c.rate).toLocaleString()}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-2xl">{c.flag}</div>
                  <div className="flex flex-col items-start w-[120px]">
                    <span className="text-sm font-bold" dir="rtl">{c.amount.toLocaleString()} {c.name}</span>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className={`text-[11px] font-mono ${c.change >= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
                        {c.change > 0 ? '+' : ''}{c.change}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );

            const ad = (index + 1) % 4 === 0 ? (
              <div key={`ad-${index}`} className="bg-[#13132B] rounded-xl mx-4 my-4 h-[100px] flex items-center justify-center relative overflow-hidden group border border-dashed border-[#C9A84C]/30 shadow-inner">
                <div className="absolute inset-0 bg-[#0D0D1A]/60 z-10" />
                <Image src={`https://picsum.photos/seed/ad${index}/800/200`} alt="Advertisement" fill className="object-cover opacity-50 mix-blend-overlay" referrerPolicy="no-referrer" />
                <div className="flex flex-col items-center z-20">
                  <span className="text-white text-sm font-bold bg-[#13132B] px-4 py-1.5 rounded-full shadow-lg border border-white/10" dir="rtl">شوێنی ڕیکلام (Ad Space)</span>
                </div>
              </div>
            ) : null;

            return ad ? <Fragment key={`frag-${c.id}`}>{row}{ad}</Fragment> : row;
          })}

          {/* BTC Price block */}
          <div className="bg-[#13132B] rounded-xl p-3 mx-4 my-2 flex items-center justify-between">
            <div className="flex flex-col items-start w-24">
              <div className="font-mono text-lg font-bold">
                $67,000
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-2xl">₿</div>
              <div className="flex flex-col items-start">
                <span className="text-sm" dir="rtl">بیتکۆین (دۆلار)</span>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-xs font-mono text-[#22c55e]">+4.20%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConverterTab({ currencies, onBack }: { currencies: any[], onBack: () => void }) {
  // Use currencies as the source of truth, but ensure we have a fallback if empty
  const allCurrencies = currencies.length > 0 ? currencies : [
    { id: 'IQD', name: 'دیناری عێراقی', flag: '🇮🇶', rate: 1, amount: 1 },
    { id: 'USD', name: 'دۆلاری ئەمریکی', flag: '🇺🇸', rate: 148250, amount: 100 }
  ];

  const [amount, setAmount] = useState('100');
  const [fromId, setFromId] = useState('USD');
  const [toId, setToId] = useState('IQD');

  // Find the live object each render so rates stay updated
  const fromCurrency = allCurrencies.find(c => c.id === fromId) || allCurrencies[1];
  const toCurrency = allCurrencies.find(c => c.id === toId) || allCurrencies[0];

  const handleNumpad = (val: string) => {
    if (val === 'backspace') {
      setAmount(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
    } else if (val === '.') {
      if (!amount.includes('.')) setAmount(prev => prev + '.');
    } else {
      setAmount(prev => prev === '0' ? val : prev + val);
    }
  };

  const handleSwap = () => {
    setFromId(toCurrency.id);
    setToId(fromCurrency.id);
  };

  // Simplified conversion for UI purposes
  const parsedAmount = parseFloat(amount) || 0;
  // If from is USD (rate 1460, amount 1), to IQD (rate 1, amount 1)
  // Value in IQD = (fromAmount / fromCurrency.amount) * fromCurrency.rate
  // Final = Value in IQD / (toCurrency.rate / toCurrency.amount)
  
  const fromBaseIQD = (parsedAmount / fromCurrency.amount) * (fromCurrency.rate || 1);
  const result = fromBaseIQD / ((toCurrency.rate || 1) / toCurrency.amount);

  return (
    <div className="w-full h-full flex flex-col p-4 overflow-hidden relative">
      <div className="text-center font-bold mb-4">گۆڕینەوەی دراو</div>

      {/* Cards Area */}
      <div className="relative shrink-0 flex flex-col z-10 w-full mb-2">
        <div className="bg-[#13132B] rounded-2xl border border-white/5 mx-2 mb-2 p-4 h-20 flex justify-between items-center relative">
          <div className="flex flex-col relative rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 cursor-pointer hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{fromCurrency.flag}</span>
              <span className="text-sm font-bold">{fromCurrency.id}</span>
              <ChevronDown size={16} className="text-white/40 ml-1" />
            </div>
            <select 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              value={fromCurrency.id}
              onChange={(e) => setFromId(e.target.value)}
            >
              {allCurrencies.map(c => (
                <option key={c.id} value={c.id} className="text-black">{c.flag} {c.name} ({c.id})</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col items-end">
             <span className="text-xs text-white/50 mb-0.5" dir="rtl">هەتە بە</span>
             <div className="font-mono text-2xl font-bold truncate max-w-[150px]">{amount}</div>
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center -my-3 z-20 relative">
          <button onClick={handleSwap} className="bg-[#C9A84C] text-[#0D0D1A] w-10 h-10 rounded-full border-2 border-[#0D0D1A] flex items-center justify-center font-medium active:scale-95 transition-transform">
            <ArrowLeftRight size={18} className="rotate-90 stroke-[3]" />
          </button>
        </div>

        <div className="bg-[#13132B] rounded-2xl border border-white/5 mx-2 mt-2 p-4 h-20 flex justify-between items-center relative">
          <div className="flex flex-col relative rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 cursor-pointer hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{toCurrency.flag}</span>
              <span className="text-sm font-bold">{toCurrency.id}</span>
              <ChevronDown size={16} className="text-white/40 ml-1" />
            </div>
            <select 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              value={toCurrency.id}
              onChange={(e) => setToId(e.target.value)}
            >
              {allCurrencies.map(c => (
                <option key={c.id} value={c.id} className="text-black">{c.flag} {c.name} ({c.id})</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col items-end">
             <span className="text-xs text-white/50 mb-0.5" dir="rtl">وەردەگری بە</span>
             <div className="font-mono text-2xl font-bold text-[#C9A84C] truncate max-w-[150px]">{result.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
          </div>
        </div>
      </div>

      {/* Numpad Area */}
      <div className="flex-1 mt-4 mb-4 min-h-0 pt-4 bg-white/5 relative z-10 mx-auto w-full border-t border-white/5" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px' }}>
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'backspace'].map((key) => (
          <button 
            key={key}
            onClick={() => handleNumpad(key)}
            className="w-full h-full bg-[#0D0D1A] flex flex-col items-center justify-center text-xl font-medium font-mono text-white active:bg-[#13132B] transition-colors select-none"
          >
            {key === 'backspace' ? '⌫' : key === '.' ? ',' : key}
          </button>
        ))}
      </div>

      {/* Action Button */}
      <button className="h-[56px] w-full bg-[#C9A84C] font-bold text-lg rounded-2xl shrink-0 mt-auto mb-2 flex items-center justify-center transition-opacity active:opacity-80" style={{color: 'black'}}>
        گۆڕین
      </button>
    </div>
  );
}

function GoldTab({ gold }: { gold: any[] }) {
  const chartData = [
    { name: 'Mon', value: 83000 },
    { name: 'Tue', value: 83500 },
    { name: 'Wed', value: 84200 },
    { name: 'Thu', value: 84000 },
    { name: 'Fri', value: 84800 },
    { name: 'Sat', value: 85000 },
    { name: 'Sun', value: 85000 },
  ];

  return (
    <div className="w-full h-full p-4 overflow-y-auto">
      <h2 className="text-xl font-bold mb-6 text-center mt-2" dir="rtl">نرخی زێڕ</h2>

      <div className="bg-[#13132B] rounded-2xl p-5 mb-6">
        <div className="flex justify-between items-center mb-4">
           <div className="text-right flex-1">
             <div className="text-xs text-white/50 mb-1" dir="rtl">نرخی ئۆنسە (USD)</div>
             <div className="font-mono text-2xl text-[#C9A84C]">2,350.50$</div>
           </div>
           <div className="w-[1px] h-12 bg-white/10 mx-4"></div>
           <div className="text-left flex-1 border-l border-transparent">
             <div className="text-xs text-white/50 mb-1" dir="rtl">ترێند (٧ ڕۆژ)</div>
             <div className="h-10 w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <Line type="monotone" dataKey="value" stroke="#C9A84C" strokeWidth={2} dot={false} isAnimationActive={false} />
                  </LineChart>
               </ResponsiveContainer>
             </div>
           </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-bold text-white/80 px-2" dir="rtl">بۆ هەر مسقاڵێک/گرامێک (IQD)</h3>
        {gold.map((g) => (
          <div key={g.id} className="bg-[#13132B] rounded-2xl p-4 flex items-center justify-between">
             <div className="font-mono text-xl font-bold">{g.priceIQD.toLocaleString()}</div>
             <div className="flex flex-col items-end">
                <span className="font-bold text-[#C9A84C]">{g.id}</span>
                <span className="text-xs text-white/60" dir="rtl">{g.name}</span>
             </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-4 mb-20">
         <h3 className="text-sm font-bold text-white/80 px-2" dir="rtl">زیاتر</h3>
         <div className="bg-[#13132B] rounded-2xl p-4 flex items-center justify-between">
           <div className="font-mono text-xl font-bold">1,250 <span className="text-sm font-sans font-normal text-white/50">IQD</span></div>
           <div className="flex items-center gap-3">
             <span className="text-sm font-bold" dir="rtl">زیو (١ گرام)</span>
             <div className="w-8 h-8 rounded-full bg-slate-300/20 flex items-center justify-center text-slate-300">Ag</div>
           </div>
         </div>
      </div>
    </div>
  );
}

function ProfileTab() {
  return (
    <div className="w-full h-full p-4 overflow-y-auto">
      <div className="flex flex-col items-center justify-center py-8">
        <div className="w-20 h-20 rounded-full bg-[#13132B] flex items-center justify-center mb-4 border-2 border-[#C9A84C]">
           <User size={40} className="text-[#C9A84C]" />
        </div>
        <h2 className="text-xl font-bold">DinarRate <span className="text-[#C9A84C]">Pro</span></h2>
        <p className="text-white/50 text-sm mt-1">Version 1.0.0</p>
      </div>

      <div className="flex flex-col gap-2 mb-20">
        <div className="text-xs font-bold text-white/40 px-4 py-2 uppercase tracking-wider">Settings</div>

        <button className="w-full bg-[#13132B] p-4 rounded-t-2xl flex items-center justify-between active:bg-white/5 transition-colors">
          <ChevronRight size={20} className="text-white/40" />
          <div className="flex items-center gap-3">
            <span dir="rtl">زمان</span>
            <Languages size={20} className="text-[#C9A84C]" />
          </div>
        </button>
        
        <button className="w-full bg-[#13132B] p-4 flex items-center justify-between active:bg-white/5 transition-colors">
          <div className="w-10 h-6 bg-[#C9A84C] rounded-full relative">
             <div className="w-4 h-4 rounded-full bg-[#13132B] absolute right-1 top-1"></div>
          </div>
          <div className="flex items-center gap-3">
            <span dir="rtl">دۆخی تاریک</span>
            <Moon size={20} className="text-[#C9A84C]" />
          </div>
        </button>

        <button className="w-full bg-[#13132B] p-4 rounded-b-2xl flex items-center justify-between active:bg-white/5 transition-colors">
          <ChevronRight size={20} className="text-white/40" />
          <div className="flex items-center gap-3">
            <span dir="rtl">هاوبەشکردن</span>
            <Share2 size={20} className="text-[#C9A84C]" />
          </div>
        </button>

        <div className="text-xs font-bold text-white/40 px-4 py-2 mt-4 uppercase tracking-wider">About</div>

        <button className="w-full bg-[#13132B] p-4 rounded-2xl flex items-center justify-between active:bg-white/5 transition-colors">
          <ChevronRight size={20} className="text-white/40" />
          <div className="flex items-center gap-3">
            <span dir="rtl">دەربارەی ئێمە</span>
            <Info size={20} className="text-[#C9A84C]" />
          </div>
        </button>
      </div>
    </div>
  );
}
