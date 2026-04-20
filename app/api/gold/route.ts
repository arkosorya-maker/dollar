import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

let currentGold = [
  { id: '24K', name: 'زێڕی عەیارە ٢٤', priceIQD: 1100000, param: 'gold_24' },
  { id: '21K', name: 'زێڕی عەیارە ٢١', priceIQD: 950000, param: 'gold_21' },
  { id: '18K', name: 'زێڕی عەیارە ١٨', priceIQD: 820000, param: 'gold_18' },
];

let lastFetchTime = 0;
const CACHE_DURATION = 2000; // 2 seconds

export async function GET(req: Request) {
  const dinarKey = "dinarapi_live_8kBT5sAyl0E3QqA1YYi1PVUX0Ck5UD26DwGpwwLm";
  
  try {
    const now = Date.now();
    if (now - lastFetchTime > CACHE_DURATION) {
      // DinarAPI Gold logic (24K=3, 21K=2, 18K=1)
      const promises = currentGold.map(g => {
        const dinarId = g.id === '24K' ? 3 : g.id === '21K' ? 2 : 1;
        return fetch(`https://dinarapi.hediworks.site/api/v2/get-price?id=${dinarId}&location=erbil`, {
          headers: { Authorization: `Bearer ${dinarKey}` },
          cache: 'no-store'
        }).then(r => r.ok ? r.json() : null)
        .then(data => ({ id: g.id, value: data?.value || null }))
        .catch(() => ({ id: g.id, value: null }));
      });

      const results = await Promise.all(promises);
      lastFetchTime = now;

      currentGold = currentGold.map(gold => {
        const match = results.find(r => r.id === gold.id);
        if (match && match.value) {
          return { ...gold, priceIQD: match.value };
        }
        return gold;
      });
    }

  } catch(e) {
    console.error("Failed to fetch gold", e);
  }
  
  return NextResponse.json({
    gold: currentGold,
    metadata: {
      lastUpdate: lastFetchTime,
      source: 'DINAR'
    }
  }, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    }
  });
}
