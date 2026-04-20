
async function test() {
  const res = await fetch('https://t.me/s/ounce_gold_silver');
  const text = await res.text();
  console.log(text.slice(-5000)); // Last 5000 chars should have recent messages
}
test();
