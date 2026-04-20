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

export async function GET(req: Request) {
  const borsaKey = "571d8f8b5fc837aca9b503b6c9ece7b7ca45905eb478f7755b347ca7ba43c2fd";
  const userExchangeKey = "343dd2fb977fc3fbbd762a51";
  let forexRates: any = null;
  
  try {
    const now = Date.now();
    if (now - lastFetchTime > CACHE_DURATION) {
      // 1. Fetch Local USD from Borsa
      const resBorsa = await fetch('https://borsapi.vercel.app/api/v2/get-price?item=usd&location=erbil', {
        headers: { 'Authorization': `Bearer ${borsaKey}` },
        cache: 'no-store'
      }).catch(() => null);
      
      let liveUSD = null;
      if (resBorsa && resBorsa.ok) {
        const d = await resBorsa.json();
        liveUSD = d.value;
      }

      // 2. Fetch Global Foreign Rates from User's ExchangeRate-API
      const resForex = await fetch(`https://v6.exchangerate-api.com/v6/${userExchangeKey}/latest/USD`, { cache: 'no-store' }).catch(() => null);
      if (resForex && resForex.ok) {
        const d = await resForex.json();
        forexRates = d.conversion_rates;
      }

      if (liveUSD || forexRates) {
        lastFetchTime = now;
        const effectiveUsd = liveUSD || currentRates.find(r => r.id === 'USD')?.rate || 153000;
        const usdToIqd = effectiveUsd / 100;
        
        currentRates = currentRates.map(currency => {
          // Borsa for USD
          if (currency.id === 'USD') return { ...currency, rate: effectiveUsd };
          // IQD is fixed base
          if (currency.id === 'IQD') return currency;
          // Global API for everything else
          if (forexRates && forexRates[currency.id]) {
            let exactRate = (1 / forexRates[currency.id]) * usdToIqd * currency.amount;
            // Special handling for IRR if needed via Forex mapping
            if (currency.id === 'IRR') exactRate = (1 / forexRates.IRR) * usdToIqd * 1000000;
            return { ...currency, rate: Math.round(exactRate) };
          }
          return currency;
        });
      }
    }
  } catch(e) {
    console.error("Failed to update rates", e);
  }
  
  return NextResponse.json({
    rates: currentRates,
    metadata: {
      lastUpdate: lastFetchTime,
      source: 'BORSA + GLOBAL'
    }
  }, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    }
  });
}
