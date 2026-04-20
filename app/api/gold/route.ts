import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

let currentGold = [
  { id: '24K', name: 'زێڕی عەیارە ٢٤', priceIQD: 1100000, param: 'gold_24' },
  { id: '21K', name: 'زێڕی عەیارە ٢١', priceIQD: 950000, param: 'gold_21' },
  { id: '18K', name: 'زێڕی عەیارە ١٨', priceIQD: 820000, param: 'gold_18' },
];

let lastFetchTime = 0;
const CACHE_DURATION = 10000; // 10 seconds

export async function GET() {
  const borsaKey = "571d8f8b5fc837aca9b503b6c9ece7b7ca45905eb478f7755b347ca7ba43c2fd";
  
  try {
    const now = Date.now();
    if (now - lastFetchTime > CACHE_DURATION) {
      const promises = currentGold.map(g => 
        fetch(`https://borsapi.vercel.app/api/v2/get-price?item=${g.param}&location=erbil`, {
          headers: { 'Authorization': `Bearer ${borsaKey}` },
          cache: 'no-store'
        }).then(r => r.json().then(data => ({ id: g.id, value: data.value, ok: r.ok })))
        .catch(e => ({ id: g.id, value: null, ok: false }))
      );

      const results = await Promise.all(promises);
      lastFetchTime = now;

      currentGold = currentGold.map(gold => {
        const match = results.find(r => r.id === gold.id);
        if (match && match.ok && match.value) {
          return {
            ...gold,
            priceIQD: match.value
          };
        }
        return gold;
      });
    }

  } catch(e) {
    console.error("Failed to fetch gold from BorsaAPI");
  }
  
  return NextResponse.json(currentGold);
}
