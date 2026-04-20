const key = "571d8f8b5fc837aca9b503b6c9ece7b7ca45905eb478f7755b347ca7ba43c2fd";
const urls = [
  'https://borsapi.vercel.app/api',
  'https://borsapi.vercel.app/api/rates',
  'https://borsapi.vercel.app/api/v1/rates',
  'https://borsapi.vercel.app/api/v1/latest',
  'https://borsapi.vercel.app/api/latest',
  'https://borsapi.vercel.app/api/prices',
  'https://borsapi.vercel.app/api/exchange',
];

async function test() {
  for (let u of urls) {
    try {
      let r = await fetch(u, { headers: { 'Authorization': `Bearer ${key}` }});
      let text = await r.text();
      console.log('URL:', u, 'STATUS:', r.status);
      console.log('DATA:', text.substring(0, 200));
    } catch(e) {
      console.error('Error on', u, e.message);
    }
  }
}
test();
