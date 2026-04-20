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

const translations: any = {
  ku: {
    home: 'سەرەکی',
    convert: 'گۆڕین',
    gold: 'زێڕ',
    profile: 'پرۆفایل',
    live: 'لایڤ',
    justNow: 'ئێستا',
    secondsAgo: 'چرکەی پێش ئێستا',
    minutesAgo: 'خولەکی پێش ئێستا',
    updated: 'ئەپدەیت کراوە',
    todayRates: 'نرخەکانی ئەمڕۆ',
    goldMarket: 'بازاڕی زێڕ',
    converter: 'گۆڕینەوەی دراو',
    youHave: 'هەتە بە',
    youGet: 'وەردەگری بە',
    goldPrice: 'نرخی زێڕ',
    ouncePrice: 'نرخی ئۆنسە',
    trend: 'ترێند (٧ ڕۆژ)',
    perGram: 'بۆ هەر مسقاڵێک/گرامێک',
    silver: 'زیو',
    more: 'زیاتر',
    settings: 'ڕێکخستنەکان',
    language: 'زمان',
    darkMode: 'دۆخی تاریک',
    share: 'هاوبەشکردن',
    aboutUs: 'دەربارەی ئێمە',
    about: 'دەربارە',
    version: 'وەشان',
    bitcoin: 'بیتکۆین (دۆلار)',
    adSpace: 'شوێنی ڕیکلام',
    swap: 'گۆڕین',
    oneGram: '١ گرام',
    locale: 'ckb-IQ',
    ounce: 'ئۆنسە',
    kiloGold: 'کیلۆی زێڕ',
    kiloSilver: 'کیلۆی زیو',
    currencies: {
      USD: 'دۆلاری ئەمریکی',
      EUR: 'یۆرۆ',
      GBP: 'پاوەندی بەریتانی',
      KWD: 'دیناری کوەیتی',
      JOD: 'دیناری ئوردنی',
      AED: 'دیرهەمی ئیماراتی',
      TRY: 'لیرەی تورکی',
      IRR: 'تمەنی ئێرانی',
      IQD: 'دیناری عێراقی'
    },
    goldNames: {
      '24K': 'زێڕی عەیارە ٢٤',
      '21K': 'زێڕی عەیارە ٢١',
      '18K': 'زێڕی عەیارە ١٨'
    }
  },
  ar: {
    home: 'الرئيسية',
    convert: 'تحويل',
    gold: 'الذهب',
    profile: 'الملف',
    live: 'مباشر',
    justNow: 'الآن',
    secondsAgo: 'قبل ثوانٍ',
    minutesAgo: 'قبل دقائق',
    updated: 'تم التحديث',
    todayRates: 'أسعار اليوم',
    goldMarket: 'سوق الذهب',
    converter: 'محول العملات',
    youHave: 'لديك بـ',
    youGet: 'تستلم بـ',
    goldPrice: 'سعر الذهب',
    ouncePrice: 'سعر الأونصة',
    trend: 'الاتجاه (٧ أيام)',
    perGram: 'لكل مثقال/غرام',
    silver: 'فضة',
    more: 'المزيد',
    settings: 'الإعدادات',
    language: 'اللغة',
    darkMode: 'الوضع الليلي',
    share: 'مشاركة',
    aboutUs: 'حولنا',
    about: 'حول',
    version: 'الإصدار',
    bitcoin: 'بیتکوین (دولار)',
    adSpace: 'مساحة إعلانية',
    swap: 'تحويل',
    oneGram: '١ غرام',
    locale: 'ar-IQ',
    ounce: 'أونصة',
    kiloGold: 'كيلو ذهب',
    kiloSilver: 'كيلو فضة',
    currencies: {
      USD: 'دولار أمريكي',
      EUR: 'يورو',
      GBP: 'جنيه إسترليني',
      KWD: 'دينار كويتي',
      JOD: 'دينار أردني',
      AED: 'درهم إماراتي',
      TRY: 'ليرة تركية',
      IRR: 'تومان إيراني',
      IQD: 'دينار عراقي'
    },
    goldNames: {
      '24K': 'ذهب عيار ٢٤',
      '21K': 'ذهب عيار ٢١',
      '18K': 'ذهب عيار ١٨'
    }
  },
  en: {
    home: 'Home',
    convert: 'Convert',
    gold: 'Gold',
    profile: 'Profile',
    live: 'Live',
    justNow: 'Just now',
    secondsAgo: 'seconds ago',
    minutesAgo: 'minutes ago',
    updated: 'Updated',
    todayRates: 'Today\'s Rates',
    goldMarket: 'Gold Market',
    converter: 'Currency Converter',
    youHave: 'You have',
    youGet: 'You get',
    goldPrice: 'Gold Price',
    ouncePrice: 'Ounce Price',
    trend: 'Trend (7 Days)',
    perGram: 'Per Mithqal/Gram',
    silver: 'Silver',
    more: 'More',
    settings: 'Settings',
    language: 'Language',
    darkMode: 'Dark Mode',
    share: 'Share',
    aboutUs: 'About Us',
    about: 'About',
    version: 'Version',
    bitcoin: 'Bitcoin (USD)',
    adSpace: 'Ad Space',
    swap: 'Convert',
    oneGram: '1 Gram',
    locale: 'en-US',
    ounce: 'Ounce',
    kiloGold: 'Gold Kilo',
    kiloSilver: 'Silver Kilo',
    currencies: {
      USD: 'US Dollar',
      EUR: 'Euro',
      GBP: 'British Pound',
      KWD: 'Kuwaiti Dinar',
      JOD: 'Jordanian Dinar',
      AED: 'UAE Dirham',
      TRY: 'Turkish Lira',
      IRR: 'Iranian Toman',
      IQD: 'Iraqi Dinar'
    },
    goldNames: {
      '24K': '24K Gold',
      '21K': '21K Gold',
      '18K': '18K Gold'
    }
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [liveCurrencies, setLiveCurrencies] = useState(mockCurrencies);
  const [liveGold, setLiveGold] = useState(mockGold);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [language, setLanguage] = useState('ku');
  const [theme, setTheme] = useState('dark');

  const t = translations[language];
  const isRTL = language === 'ku' || language === 'ar';

  useEffect(() => {
    let isFetchingRates = false;
    let isFetchingGold = false;

    const fetchLiveRates = async () => {
      if (isFetchingRates) return;
      isFetchingRates = true;
      setIsRefreshing(true);
      try {
        const res = await fetch(`/api/rates?t=` + Date.now(), { cache: 'no-store' });
        const data = await res.json();
        if (data && data.rates) {
          setLiveCurrencies(data.rates);
          if (data.metadata?.lastUpdate) {
            setLastUpdated(data.metadata.lastUpdate);
          }
        }
      } catch (e) {
        console.error("Error fetching live rates", e);
      } finally {
        isFetchingRates = false;
        setTimeout(() => setIsRefreshing(false), 800);
      }
    };

    const fetchLiveGold = async () => {
      if (isFetchingGold) return;
      isFetchingGold = true;
      try {
        const res = await fetch(`/api/gold?t=` + Date.now(), { cache: 'no-store' });
        const data = await res.json();
        if (data && data.gold) {
          setLiveGold(data.gold);
        }
      } catch (e) {
        console.error("Error fetching live gold", e);
      } finally {
        isFetchingGold = false;
      }
    };

    fetchLiveRates();
    fetchLiveGold(); // Fetch immediately
    
    const interval = setInterval(() => {
      fetchLiveRates();
      fetchLiveGold();
    }, 5000); 
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`w-full h-[100dvh] flex flex-col ${theme === 'dark' ? 'bg-[#0D0D1A] text-white' : 'bg-slate-50 text-slate-900'} overflow-hidden mx-auto max-w-md relative shadow-zinc-950 shadow-2xl transition-colors duration-300`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Main Content Area */}
      <div className={`flex-1 w-full relative overflow-hidden ${theme === 'dark' ? 'bg-[#0D0D1A]' : 'bg-slate-50'}`}>
        {activeTab === 'home' && (
          <HomeTab 
            currencies={liveCurrencies} 
            lastUpdated={lastUpdated} 
            isRefreshing={isRefreshing}
            onConvert={(id) => setActiveTab('converter')} 
            t={t}
            theme={theme}
          />
        )}
        {activeTab === 'converter' && <ConverterTab currencies={liveCurrencies} onBack={() => setActiveTab('home')} t={t} theme={theme} />}
        {activeTab === 'gold' && <GoldTab gold={liveGold} t={t} theme={theme} />}
        {activeTab === 'profile' && (
          <ProfileTab 
            language={language} 
            setLanguage={setLanguage} 
            theme={theme} 
            setTheme={setTheme} 
            t={t}
          />
        )}
      </div>

      {/* Bottom Navigation */}
      <nav className={`h-[64px] shrink-0 ${theme === 'dark' ? 'bg-[#13132B] border-white/5' : 'bg-white border-slate-200'} border-t flex items-center justify-around px-2 z-50 transition-colors`}>
        <NavItem id="home" emoji="🏠" label={t.home} active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
        <NavItem id="converter" emoji="🔄" label={t.convert} active={activeTab === 'converter'} onClick={() => setActiveTab('converter')} />
        <NavItem id="gold" emoji="🪙" label={t.gold} active={activeTab === 'gold'} onClick={() => setActiveTab('gold')} />
        <NavItem id="profile" emoji="👤" label={t.profile} active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
      </nav>
    </div>
  );
}

function NavItem({ id, emoji, label, active, onClick }: { id: string, emoji: string, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${active ? 'text-[#C9A84C]' : 'opacity-40 hover:opacity-100'}`}
    >
      <div className="text-xl leading-none" style={{ filter: active ? 'sepia(1) hue-rotate(10deg) saturate(3) brightness(1.2)' : 'grayscale(1)' }}>{emoji}</div>
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}

function HomeTab({ currencies, lastUpdated, isRefreshing, onConvert, t, theme }: { currencies: any[], lastUpdated: number | null, isRefreshing: boolean, onConvert: (id: string) => void, t: any, theme: string }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [timeText, setTimeText] = useState(t.justNow);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(s => (s + 1) % 3);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!lastUpdated) return;
    const updateTime = () => {
      const diff = Math.floor((Date.now() - lastUpdated) / 1000);
      if (diff < 10) setTimeText(t.justNow);
      else if (diff < 60) setTimeText(`${diff} ${t.secondsAgo}`);
      else setTimeText(`${Math.floor(diff / 60)} ${t.minutesAgo}`);
    };
    updateTime();
    const t_int = setInterval(updateTime, 10000);
    return () => clearInterval(t_int);
  }, [lastUpdated, t]);

  return (
    <div className="w-full h-full overflow-y-auto overflow-x-hidden pb-4">
      <div className="flex items-center justify-between px-6 pt-6 pb-2">
         <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isRefreshing ? 'bg-[#C9A84C] animate-pulse' : 'bg-green-500'}`} />
            <span className={`text-[10px] font-bold ${theme === 'dark' ? 'text-white/40' : 'text-slate-400'} uppercase tracking-widest`}>{t.live}</span>
            <div className="flex gap-1">
              <span className="text-[9px] bg-[#C9A84C]/10 text-[#C9A84C] border border-[#C9A84C]/20 px-2 py-0.5 rounded-full uppercase tracking-tighter font-mono">DINAR + GLOBAL</span>
            </div>
         </div>
         <div className="flex items-center gap-1.5 opacity-60">
            <span className="text-[10px] font-medium">{timeText} {t.updated}</span>
            <ArrowLeftRight size={10} className={`${isRefreshing ? 'animate-spin' : ''}`} />
         </div>
      </div>
      {/* Banner Slider */}
      <div className={`w-full h-[220px] relative shrink-0 ${theme === 'dark' ? 'bg-[#13132B]' : 'bg-[#C9A84C]'}`} style={{background: `linear-gradient(rgba(0,0,0,${theme === 'dark' ? 0.2 : 0.05}), rgba(0,0,0,${theme === 'dark' ? 0.5 : 0.1})), url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="220"><rect width="400" height="220" fill="%23${theme === 'dark' ? '13132B' : 'FFFFFF'}"/><path d="M0 110 Q 100 80 200 110 T 400 110" stroke="%23C9A84C" stroke-width="2" fill="none"/></svg>')`, backgroundSize: 'cover'}}>
        <div className="absolute inset-0 flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(${currentSlide * 100}%)` }}>
          {[1, 2, 3].map((slide, i) => (
            <div key={i} className="w-full h-full shrink-0 relative flex items-center justify-center">
              <div className={`absolute inset-x-8 bottom-8 flex justify-end`}>
                <div className="bg-[#C9A84C] text-black px-3 py-1 rounded text-sm font-bold">{t.goldMarket}</div>
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
          <h2 className="text-lg font-bold">{t.todayRates}</h2>
        </div>

        <div className="flex flex-col">
          {currencies.filter(c => c.id !== 'IQD').map((c, index) => {
            const row = (
              <div 
                key={c.id} 
                onClick={() => onConvert(c.id)}
                className={`${theme === 'dark' ? 'bg-[#13132B]' : 'bg-white shadow-sm border border-slate-100'} rounded-xl p-3 mx-4 my-2 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all duration-300`}
              >
                <div className="flex flex-col items-start min-w-[100px]">
                  <div className={`font-mono text-lg font-bold transition-colors duration-300 ${c.change > 0 ? 'text-[#22c55e]' : c.change < 0 ? 'text-[#ef4444]' : theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    {Math.round(c.rate).toLocaleString(t.locale)}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-2xl">{c.flag}</div>
                  <div className="flex flex-col items-start w-[120px]">
                    <span className="text-sm font-bold whitespace-nowrap">{c.amount.toLocaleString(t.locale)} {t.currencies[c.id] || c.name}</span>
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
              <div key={`ad-${index}`} className={`${theme === 'dark' ? 'bg-[#13132B] border-[#C9A84C]/30' : 'bg-white border-slate-200'} rounded-xl mx-4 my-4 h-[100px] flex items-center justify-center relative overflow-hidden group border border-dashed shadow-inner`}>
                <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-[#0D0D1A]/60' : 'bg-white/60'} z-10`} />
                <Image src={`https://picsum.photos/seed/ad${index}/800/200`} alt="Advertisement" fill className="object-cover opacity-50 mix-blend-overlay" referrerPolicy="no-referrer" />
                <div className="flex flex-col items-center z-20">
                  <span className={`${theme === 'dark' ? 'text-white bg-[#13132B] border-white/10' : 'text-slate-900 bg-white border-slate-200'} text-sm font-bold px-4 py-1.5 rounded-full shadow-lg border`}>{t.adSpace}</span>
                </div>
              </div>
            ) : null;

            return ad ? <Fragment key={`frag-${c.id}`}>{row}{ad}</Fragment> : row;
          })}

          {/* BTC Price block */}
          <div className={`${theme === 'dark' ? 'bg-[#13132B]' : 'bg-white shadow-sm border border-slate-100'} rounded-xl p-3 mx-4 my-2 flex items-center justify-between`}>
            <div className="flex flex-col items-start w-24">
              <div className={`font-mono text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                ${(67000).toLocaleString(t.locale)}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-2xl">₿</div>
              <div className="flex flex-col items-start">
                <span className="text-sm font-bold">{t.bitcoin}</span>
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

function ConverterTab({ currencies, onBack, t, theme }: { currencies: any[], onBack: () => void, t: any, theme: string }) {
  // Use currencies as the source of truth, but ensure we have a fallback if empty
  const allCurrencies = currencies.length > 0 ? currencies : [
    { id: 'IQD', name: 'IQD', flag: '🇮🇶', rate: 1, amount: 1 },
    { id: 'USD', name: 'USD', flag: '🇺🇸', rate: 148250, amount: 100 }
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

  const parsedAmount = parseFloat(amount) || 0;
  const fromBaseIQD = (parsedAmount / fromCurrency.amount) * (fromCurrency.rate || 1);
  const result = fromBaseIQD / ((toCurrency.rate || 1) / toCurrency.amount);

  return (
    <div className="w-full h-full flex flex-col p-4 overflow-hidden relative">
      <div className="text-center font-bold mb-4">{t.converter}</div>

      {/* Cards Area */}
      <div className="relative shrink-0 flex flex-col z-10 w-full mb-2">
        <div className={`${theme === 'dark' ? 'bg-[#13132B]' : 'bg-white border-slate-200'} rounded-2xl border mx-2 mb-2 p-4 h-20 flex justify-between items-center relative`}>
          <div className={`flex flex-col relative rounded-xl border ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'} px-3 py-1.5 cursor-pointer hover:opacity-80 transition-opacity`}>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{fromCurrency.flag}</span>
              <span className="text-sm font-bold">{t.currencies[fromCurrency.id] || fromCurrency.id}</span>
              <ChevronDown size={16} className="opacity-40 ml-1" />
            </div>
            <select 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              value={fromCurrency.id}
              onChange={(e) => setFromId(e.target.value)}
            >
              {allCurrencies.map(c => (
                <option key={c.id} value={c.id} className="text-black">{c.flag} {t.currencies[c.id] || c.id}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col items-end">
             <span className="text-xs opacity-50 mb-0.5">{t.youHave}</span>
             <div className="font-mono text-2xl font-bold truncate max-w-[150px]">{amount}</div>
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center -my-3 z-20 relative">
          <button onClick={handleSwap} className={`bg-[#C9A84C] text-[#0D0D1A] w-10 h-10 rounded-full border-2 ${theme === 'dark' ? 'border-[#0D0D1A]' : 'border-white'} flex items-center justify-center font-medium active:scale-95 transition-transform`}>
            <ArrowLeftRight size={18} className="rotate-90 stroke-[3]" />
          </button>
        </div>

        <div className={`${theme === 'dark' ? 'bg-[#13132B]' : 'bg-white border-slate-200'} rounded-2xl border mx-2 mt-2 p-4 h-20 flex justify-between items-center relative`}>
          <div className={`flex flex-col relative rounded-xl border ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'} px-3 py-1.5 cursor-pointer hover:opacity-80 transition-opacity`}>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{toCurrency.flag}</span>
              <span className="text-sm font-bold">{t.currencies[toCurrency.id] || toCurrency.id}</span>
              <ChevronDown size={16} className="opacity-40 ml-1" />
            </div>
            <select 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              value={toCurrency.id}
              onChange={(e) => setToId(e.target.value)}
            >
              {allCurrencies.map(c => (
                <option key={c.id} value={c.id} className="text-black">{c.flag} {t.currencies[c.id] || c.id}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col items-end">
             <span className="text-xs opacity-50 mb-0.5">{t.youGet}</span>
             <div className="font-mono text-2xl font-bold text-[#C9A84C] truncate max-w-[150px]">{result.toLocaleString(t.locale, { maximumFractionDigits: 2 })}</div>
          </div>
        </div>
      </div>

      {/* Numpad Area */}
      <div className={`flex-1 mt-4 mb-4 min-h-0 pt-4 bg-black/5 relative z-10 mx-auto w-full border-t border-black/5`} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px' }}>
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'backspace'].map((key) => (
          <button 
            key={key}
            onClick={() => handleNumpad(key)}
            className={`w-full h-full ${theme === 'dark' ? 'bg-[#0D0D1A] text-white active:bg-[#13132B]' : 'bg-white text-slate-900 active:bg-slate-100'} flex flex-col items-center justify-center text-xl font-medium font-mono transition-colors select-none`}
          >
            {key === 'backspace' ? '⌫' : key === '.' ? ',' : key}
          </button>
        ))}
      </div>

      {/* Action Button */}
      <button className="h-[56px] w-full bg-[#C9A84C] font-bold text-lg rounded-2xl shrink-0 mt-auto mb-2 flex items-center justify-center transition-opacity active:opacity-80" style={{color: 'black'}}>
        {t.swap}
      </button>
    </div>
  );
}

function GoldTab({ gold, t, theme }: { gold: any[], t: any, theme: string }) {
  const chartData = [
    { name: 'Mon', value: 83000 },
    { name: 'Tue', value: 83500 },
    { name: 'Wed', value: 84200 },
    { name: 'Thu', value: 84000 },
    { name: 'Fri', value: 84800 },
    { name: 'Sat', value: 85000 },
    { name: 'Sun', value: 85000 },
  ];

  const ouncePrice = gold.find(g => g.id === 'Ounce')?.priceUSD || 2350.50;
  const localGold = gold.filter(g => ['24K', '21K', '18K'].includes(g.id));
  const globalKilos = gold.filter(g => ['KiloGold', 'KiloSilver'].includes(g.id));

  return (
    <div className="w-full h-full p-4 overflow-y-auto">
      <h2 className="text-xl font-bold mb-6 text-center mt-2">{t.goldPrice}</h2>

      <div className={`${theme === 'dark' ? 'bg-[#13132B]' : 'bg-white shadow-sm border border-slate-100'} rounded-2xl p-5 mb-6`}>
        <div className="flex justify-between items-center mb-4">
           <div className="text-center flex-1">
             <div className="text-xs opacity-50 mb-1">{t.ouncePrice} (USD)</div>
             <div className="font-mono text-2xl text-[#C9A84C]">${ouncePrice.toLocaleString(t.locale, { minimumFractionDigits: 2 })}</div>
           </div>
           <div className={`w-[1px] h-12 ${theme === 'dark' ? 'bg-white/10' : 'bg-slate-200'} mx-4`}></div>
           <div className="text-center flex-1 border-l border-transparent">
             <div className="text-xs opacity-50 mb-1">{t.trend}</div>
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
        <h3 className="text-sm font-bold opacity-80 px-2">{t.perGram} (IQD)</h3>
        {localGold.map((g) => (
          <div key={g.id} className={`${theme === 'dark' ? 'bg-[#13132B]' : 'bg-white shadow-sm border border-slate-100'} rounded-2xl p-4 flex items-center justify-between`}>
             <div className={`font-mono text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{g.priceIQD.toLocaleString(t.locale)}</div>
             <div className="flex flex-col items-end">
                <span className="font-bold text-[#C9A84C]">{g.id}</span>
                <span className="text-xs opacity-60 text-end whitespace-nowrap">{t.goldNames[g.id] || g.name}</span>
             </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-4 mb-20">
         <h3 className="text-sm font-bold opacity-80 px-2">Global / Global Markets</h3>
         {globalKilos.map((g) => (
           <div key={g.id} className={`${theme === 'dark' ? 'bg-[#13132B]' : 'bg-white shadow-sm border border-slate-100'} rounded-2xl p-4 flex items-center justify-between`}>
              <div className={`font-mono text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>${g.priceUSD.toLocaleString(t.locale)}</div>
              <div className="flex flex-col items-end">
                 <span className="font-bold text-[#C9A84C]">{t[g.id === 'KiloGold' ? 'kiloGold' : 'kiloSilver']}</span>
                 <span className="text-xs opacity-60 text-end uppercase tracking-tigh">Global / Price per KG</span>
              </div>
           </div>
         ))}
         
         <div className={`${theme === 'dark' ? 'bg-[#13132B]' : 'bg-white shadow-sm border border-slate-100'} rounded-2xl p-4 flex items-center justify-between`}>
           <div className={`font-mono text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{ (1250).toLocaleString(t.locale) } <span className="text-sm font-sans font-normal opacity-50">IQD</span></div>
           <div className="flex items-center gap-3">
             <span className="text-sm font-bold">{t.silver} ({t.oneGram})</span>
             <div className="w-8 h-8 rounded-full bg-slate-300/20 flex items-center justify-center text-slate-300">Ag</div>
           </div>
         </div>
      </div>
    </div>
  );
}

function ProfileTab({ language, setLanguage, theme, setTheme, t }: { language: string, setLanguage: (l: string) => void, theme: string, setTheme: (th: string) => void, t: any }) {
  const [showLangs, setShowLangs] = useState(false);

  return (
    <div className="w-full h-full p-4 overflow-y-auto">
      <div className="flex flex-col items-center justify-center py-8">
        <div className={`w-20 h-20 rounded-full ${theme === 'dark' ? 'bg-[#13132B]' : 'bg-white shadow-md'} flex items-center justify-center mb-4 border-2 border-[#C9A84C]`}>
           <User size={40} className="text-[#C9A84C]" />
        </div>
        <h2 className="text-xl font-bold">DinarRate <span className="text-[#C9A84C]">Pro</span></h2>
        <p className="opacity-50 text-sm mt-1">{t.version} 1.0.1</p>
      </div>

      <div className="flex flex-col gap-2 mb-20 text-start">
        <div className="text-xs font-bold opacity-40 px-4 py-2 uppercase tracking-wider">{t.settings}</div>

        <div className={`w-full ${theme === 'dark' ? 'bg-[#13132B]' : 'bg-white shadow-sm border-slate-100 border'} rounded-t-2xl overflow-hidden`}>
          <button 
            onClick={() => setShowLangs(!showLangs)}
            className="w-full p-4 flex items-center justify-between active:bg-black/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Languages size={20} className="text-[#C9A84C]" />
              <span>{t.language}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs opacity-50">{language === 'ku' ? '☀️ کوردی' : language === 'ar' ? '🇮🇶 العربية' : '🇺🇸 English'}</span>
              <ChevronDown size={16} className={`opacity-40 transition-transform ${showLangs ? 'rotate-180' : ''}`} />
            </div>
          </button>
          
          {showLangs && (
            <div className={`flex flex-col border-t ${theme === 'dark' ? 'border-white/5' : 'border-slate-100'}`}>
              <button 
                onClick={() => { setLanguage('ku'); setShowLangs(false); }}
                className={`p-3 flex items-center gap-3 hover:bg-[#C9A84C]/10 transition-colors ${language === 'ku' ? 'text-[#C9A84C] font-bold' : ''}`}
              >
                <span className="text-lg">☀️</span>
                <span className="flex-1 text-start">کوردی</span>
              </button>
              <button 
                onClick={() => { setLanguage('ar'); setShowLangs(false); }}
                className={`p-3 flex items-center gap-3 hover:bg-[#C9A84C]/10 transition-colors border-t ${theme === 'dark' ? 'border-white/5' : 'border-slate-100'} ${language === 'ar' ? 'text-[#C9A84C] font-bold' : ''}`}
              >
                <span className="text-lg">🇮🇶</span>
                <span className="flex-1 text-start">العربية</span>
              </button>
              <button 
                onClick={() => { setLanguage('en'); setShowLangs(false); }}
                className={`p-3 flex items-center gap-3 hover:bg-[#C9A84C]/10 transition-colors border-t ${theme === 'dark' ? 'border-white/5' : 'border-slate-100'} ${language === 'en' ? 'text-[#C9A84C] font-bold' : ''}`}
              >
                <span className="text-lg">🇺🇸</span>
                <span className="flex-1 text-start">English</span>
              </button>
            </div>
          )}
        </div>
        
        <button 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className={`w-full ${theme === 'dark' ? 'bg-[#13132B]' : 'bg-white shadow-sm border-slate-100 border'} p-4 flex items-center justify-between active:bg-black/5 transition-colors`}
        >
          <div className="flex items-center gap-3">
            <Moon size={20} className="text-[#C9A84C]" />
            <span>{t.darkMode}</span>
          </div>
          <div className={`w-10 h-6 ${theme === 'dark' ? 'bg-[#C9A84C]' : 'bg-slate-300'} rounded-full relative transition-colors`}>
             <div className={`w-4 h-4 rounded-full ${theme === 'dark' ? 'bg-white' : 'bg-white'} absolute transition-all ${theme === 'dark' ? 'right-1' : 'left-1'} top-1`}></div>
          </div>
        </button>

        <button className={`w-full ${theme === 'dark' ? 'bg-[#13132B]' : 'bg-white shadow-sm border-slate-100 border'} p-4 rounded-b-2xl flex items-center justify-between active:bg-black/5 transition-colors`}>
          <div className="flex items-center gap-3">
            <Share2 size={20} className="text-[#C9A84C]" />
            <span>{t.share}</span>
          </div>
          <ChevronRight size={20} className="opacity-40" />
        </button>

        <div className="text-xs font-bold opacity-40 px-4 py-2 mt-4 uppercase tracking-wider">{t.about}</div>

        <button className={`w-full ${theme === 'dark' ? 'bg-[#13132B]' : 'bg-white shadow-sm border-slate-100 border'} p-4 rounded-2xl flex items-center justify-between active:bg-black/5 transition-colors`}>
          <div className="flex items-center gap-3">
            <Info size={20} className="text-[#C9A84C]" />
            <span>{t.aboutUs}</span>
          </div>
          <ChevronRight size={20} className="opacity-40" />
        </button>
      </div>
    </div>
  );
}
