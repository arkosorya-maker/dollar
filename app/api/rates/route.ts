import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

let currentRates = [
  { id: 'USD', name: 'دۆلاری ئەمریکی', flag: '🇺🇸', rate: 153000, change: 0, amount: 100 },
  { id: 'EUR', name: 'یۆرۆ', flag: '🇪🇺', rate: 165000, change: 0, amount: 100 },
  { id: 'GBP', name: 'پاوەندی بەریتانی', flag: '🇬🇧', rate: 195000, change: 0, amount: 100 },
  { id: 'KWD', name: 'دیناری کوەیتی', flag: '🇰🇼', rate: 498000, change: 0, amount: 100 },
  { id: 'JOD', name: 'دیناری ئوردنی', flag: '🇯🇴', rate: 216000, change: 0, amount: 100 },
  { id: 'AED', name: 'دیرهەمی ئیماراتی', flag: '🇦🇪', rate: 41700, change: 0, amount: 100 },
  { id: 'TRY', name: 'لیرەی تورکی', flag: '🇹🇷', rate: 4500, change: 0, amount: 100 },
  { id: 'IRR', name: 'تمەنی ئێرانی', flag: '🇮🇷', rate: 2600, change: 0, amount: 100000 },
  { id: 'IQD', name: 'دیناری عێراقی', flag: '🇮🇶', rate: 1, change: 0.00, amount: 1 },
];

let lastFetchTime = 0;
const CACHE_DURATION = 2000; // 2 seconds

export async function GET() {
  const borsaKey = "571d8f8b5fc837aca9b503b6c9ece7b7ca45905eb478f7755b347ca7ba43c2fd";
  
  try {
    const now = Date.now();
    if (now - lastFetchTime > CACHE_DURATION) {
      
      const [resBorsa, resForex] = await Promise.all([
        fetch('https://borsapi.vercel.app/api/v2/get-price?item=usd&location=erbil', {
          headers: { 'Authorization': `Bearer ${borsaKey}` },
          cache: 'no-store'
        }).catch(() => null),
        fetch('https://api.exchangerate-api.com/v4/latest/USD', { cache: 'no-store' }).catch(() => null)
      ]);
      
      let liveUSD = null;
      let forexRates = null;
      
      if (resBorsa && resBorsa.ok) {
        const d = await resBorsa.json();
        liveUSD = d.value;
      }
      if (resForex && resForex.ok) {
        const d = await resForex.json();
        forexRates = d.rates;
      }

      if (liveUSD || forexRates) {
        lastFetchTime = now;
        // Use either live fetch or last known local rate
        const effectiveUsd = liveUSD || currentRates.find(r => r.id === 'USD')?.rate || 153000;
        const usdToIqd = effectiveUsd / 100;
        
        currentRates = currentRates.map(currency => {
          if (currency.id === 'USD' && liveUSD) return { ...currency, rate: liveUSD };
          if (currency.id === 'IQD') return currency;

          if (forexRates && forexRates[currency.id]) {
            let exactRate = (1 / forexRates[currency.id]) * usdToIqd * currency.amount;
            
            if (currency.id === 'IRR') {
              exactRate = (1 / forexRates.IRR) * usdToIqd * 1000000;
            }
            
            return { ...currency, rate: Math.round(exactRate) };
          }
          return currency;
        });
      }
    }
  } catch(e) {
    console.error("Failed to update rates", e);
  }
  
  return NextResponse.json(currentRates, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    }
  });
}
