import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

let currentGold = [
  { id: '24K', name: 'زێڕی عەیارە ٢٤', priceIQD: 1100000, param: 'gold_24' },
  { id: '21K', name: 'زێڕی عەیارە ٢١', priceIQD: 950000, param: 'gold_21' },
  { id: '18K', name: 'زێڕی عەیارە ١٨', priceIQD: 820000, param: 'gold_18' },
  { id: 'Ounce', name: 'ئۆنسەی زێڕ', priceUSD: 2350.50, unit: 'USD' },
  { id: 'KiloGold', name: 'کیلۆی زێڕ', priceUSD: 75500, unit: 'USD' },
  { id: 'KiloSilver', name: 'کیلۆی زیو', priceUSD: 1020, unit: 'USD' },
];

let lastFetchTime = 0;
const CACHE_DURATION = 2000; // 2 seconds

export async function GET(req: Request) {
  const dinarKey = "dinarapi_live_8kBT5sAyl0E3QqA1YYi1PVUX0Ck5UD26DwGpwwLm";
  
  try {
    const now = Date.now();
    if (now - lastFetchTime > CACHE_DURATION) {
      let scrapedGold: any = null;
      let globalData: any = null;

      // 1. Try to scrape from Azura Gold for local rates
      try {
        const resTele = await fetch('https://t.me/s/azura_gold', { cache: 'no-store' });
        if (resTele.ok) {
          const html = await resTele.text();
          const messages = html.match(/<div class="tgme_widget_message_text[^>]*>(.*?)<\/div>/g);
          if (messages && messages.length > 0) {
            const lastMsg = messages[messages.length - 1];
            const p24 = lastMsg.match(/عەیار 24 به (\d+)/);
            const p21 = lastMsg.match(/عەیار 21 به (\d+)/);
            const p18 = lastMsg.match(/عەیار 18 به (\d+)/);

            if (p24 || p21 || p18) {
              scrapedGold = {};
              if (p24) scrapedGold['24K'] = parseInt(p24[1]) * (lastMsg.includes('ملیۆن') ? 1000 : 1);
              if (p21) scrapedGold['21K'] = parseInt(p21[1]) * (lastMsg.includes('ملیۆن') ? 1000 : 1);
              if (p18) scrapedGold['18K'] = parseInt(p18[1]) * (lastMsg.includes('هەزار') ? 1000 : 1);
            }
          }
        }
      } catch (e) {
        console.error("Azura scraping failed", e);
      }

      // 2. Try to scrape from Ounce Gold Silver for global rates (Kilo/Ounce)
      try {
        const resGlobal = await fetch('https://t.me/s/ounce_gold_silver', { cache: 'no-store' });
        if (resGlobal.ok) {
          const html = await resGlobal.text();
          const messages = html.match(/<div class="tgme_widget_message_text[^>]*>(.*?)<\/div>/g);
          if (messages && messages.length > 0) {
             // Look at several recent messages as they might be split
             const recent = messages.slice(-5).join(' ');
             globalData = {};
             
             // Regex for prices like: 2,345.10 or 75,400
             const findPrice = (label: string) => {
               const regex = new RegExp(`${label}\\s*:?\\s*([\\d,\\.]+)`, 'i');
               const match = recent.match(regex);
               return match ? parseFloat(match[1].replace(/,/g, '')) : null;
             };

             globalData.Ounce = findPrice('Gold') || findPrice('Ounce');
             globalData.KiloGold = findPrice('Kilo Gold') || findPrice('Gold Kilo');
             globalData.KiloSilver = findPrice('Kilo Silver') || findPrice('Silver Kilo');
             
             // If not found, try more generic ones
             if (!globalData.Ounce) {
               const match = recent.match(/(\d{4}\.\d{2})/); // Match 2350.50
               if (match) globalData.Ounce = parseFloat(match[1]);
             }
          }
        }
      } catch (e) {
        console.error("Global scraping failed", e);
      }

      // Update the data
      lastFetchTime = now;
      currentGold = currentGold.map(item => {
        if (item.id === 'Ounce' && globalData?.Ounce) return { ...item, priceUSD: globalData.Ounce };
        if (item.id === 'KiloGold' && globalData?.KiloGold) return { ...item, priceUSD: globalData.KiloGold };
        if (item.id === 'KiloSilver' && globalData?.KiloSilver) return { ...item, priceUSD: globalData.KiloSilver };
        
        if (scrapedGold && scrapedGold[item.id]) {
          return { ...item, priceIQD: scrapedGold[item.id] };
        }
        return item;
      });

      // DinarAPI Fallback for local rates if Azura failed
      if (!scrapedGold) {
        const localItems = ['24K', '21K', '18K'];
        const promises = localItems.map(id => {
          const dinarId = id === '24K' ? 3 : id === '21K' ? 2 : 1;
          return fetch(`https://dinarapi.hediworks.site/api/v2/get-price?id=${dinarId}&location=erbil`, {
            headers: { Authorization: `Bearer ${dinarKey}` },
            cache: 'no-store'
          }).then(r => r.ok ? r.json() : null)
          .then(data => ({ id, value: data?.value || null }))
          .catch(() => ({ id, value: null }));
        });

        const results = await Promise.all(promises);
        currentGold = currentGold.map(item => {
          const match = results.find(r => r.id === item.id);
          if (match && match.value) return { ...item, priceIQD: match.value };
          return item;
        });
      }
    }
  } catch(e) {
    console.error("Failed to fetch gold", e);
  }
  
  return NextResponse.json({
    gold: currentGold,
    metadata: {
      lastUpdate: lastFetchTime,
      source: 'AZURA / OUNCE / DINAR'
    }
  }, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    }
  });
}
