const IMAGE_CHUNKS = Object.freeze({
  lifestyle: ['/assets/site-lifestyle-1.txt', '/assets/site-lifestyle-2.txt'],
  founder: ['/assets/site-founder-1.txt', '/assets/site-founder-2.txt'],
  cup: ['/assets/site-cup-1.txt', '/assets/site-cup-2.txt'],
  coffee: ['/assets/site-coffee-1.txt', '/assets/site-coffee-2.txt'],
});

const founderStyle = document.createElement('style');
founderStyle.textContent = `
  .founder{background:#fbf7ef!important;color:#1b120d!important;padding:78px 0!important}
  .founderGrid{grid-template-columns:minmax(280px,.8fr) minmax(0,1.2fr)!important;gap:48px!important;align-items:center!important}
  .founderPhoto .media{background:#f2e6d3!important;border-radius:18px!important;box-shadow:none!important;overflow:hidden!important}
  .founderPhoto img{width:100%!important;height:auto!important;object-fit:contain!important;filter:brightness(1.16) contrast(.96)!important}
  .founderText h2{color:#1b120d!important}
  .founderText p{color:#5f554d!important}
  .founderText .eyebrow{color:#914321!important}
  .founder .credentials{display:none!important}
  @media(max-width:820px){
    .founderGrid{grid-template-columns:1fr!important;gap:28px!important}
    .founderPhoto{width:100%;max-width:560px;margin:0 auto}
  }
`;
document.head.appendChild(founderStyle);

async function hydrateImages() {
  const entries = Object.entries(IMAGE_CHUNKS);
  await Promise.all(entries.map(async ([name, urls]) => {
    const targets = document.querySelectorAll(`[data-image="${name}"]`);
    if (!targets.length) return;

    try {
      const chunks = await Promise.all(urls.map(async (url) => {
        const response = await fetch(url, { cache: 'force-cache' });
        if (!response.ok) throw new Error(`Image asset request failed: ${response.status}`);
        return response.text();
      }));
      const src = `data:image/webp;base64,${chunks.join('')}`;
      targets.forEach((img) => { img.src = src; });
    } catch (error) {
      console.error(`Unable to load ${name} image`, error);
    }
  }));
}

void hydrateImages();

const WA = '256772487887';
const texts = {
  order: 'Hello Odek Coffee. I would like to order the 250g Single-Origin Pure Robusta. Please send the current price, availability and delivery options.',
  wholesale: 'Hello Odek Coffee. I am interested in wholesale / hospitality supply. Please share trade pricing, minimum order and delivery options.',
  general: 'Hello Odek Coffee. I found you through the website and would like more information.',
  concierge: 'Hello Odek Coffee. I was speaking with the website concierge and would like a person to assist me.',
};

document.querySelectorAll('[data-wa]').forEach((button) => {
  button.addEventListener('click', () => {
    const text = texts[button.dataset.wa] || texts.general;
    window.open(`https://wa.me/${WA}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  });
});

document.getElementById('year').textContent = new Date().getFullYear();

const panel = document.getElementById('panel');
const chat = document.getElementById('chat');
const quick = document.getElementById('quick');
const input = document.getElementById('input');
let started = false;

const kb = [
  { k: ['origin', 'where', 'uganda', 'odek', 'omoro', 'acholi'], a: 'Odek Coffee is single-origin pure Robusta from Odek, Omoro District, Acholi Sub-Region, Northern Uganda.' },
  { k: ['joseph', 'oryang', 'owner', 'founder', 'engineer', 'ceo', 'century'], a: 'Odek Coffee is owned by Eng. Joseph Oryang, a professional Civil Engineer with 32 years of hands-on engineering design, construction and project management experience. He also heads Century Investors’ operations.' },
  { k: ['story', 'hope', 'war', 'conflict', 'community', 'farmer'], a: '“Hope Grows in Odek” is the heart of the brand. The story connects coffee with a community moving from the legacy of conflict toward farming, livelihoods, enterprise and development.' },
  { k: ['roast', 'taste', 'robusta', 'strong'], a: 'The pack identifies Odek Coffee as Pure Robusta with a medium-dark roast — a fuller, stronger coffee style.' },
  { k: ['price', 'buy', 'order', 'delivery', '250'], a: 'The featured pack is 250g ground coffee. Use the WhatsApp receptionist for the current price, stock and delivery information.' },
  { k: ['wholesale', 'hotel', 'cafe', 'office', 'retail'], a: 'Yes. Odek Coffee welcomes wholesale, hospitality, office and retail enquiries. I can hand you directly to WhatsApp.' },
];

function add(text, who = 'bot') {
  const message = document.createElement('div');
  message.className = `msg ${who}`;
  message.textContent = text;
  chat.appendChild(message);
  chat.scrollTop = chat.scrollHeight;
}

function answer(question) {
  const q = question.toLowerCase();
  let best = [0, ''];
  kb.forEach((entry) => {
    const score = entry.k.reduce((count, keyword) => count + (q.includes(keyword) ? 1 : 0), 0);
    if (score > best[0]) best = [score, entry.a];
  });
  return best[0] ? best[1] : 'Ask me about Odek’s origin, Joseph Oryang, the Hope Grows in Odek story, the roast, ordering or wholesale.';
}

function ask(question) {
  if (!question.trim()) return;
  add(question, 'user');
  setTimeout(() => add(answer(question)), 120);
  input.value = '';
}

function openPanel() {
  panel.classList.add('open');
  if (!started) {
    add('Welcome to Odek Coffee. I can explain the coffee, its Ugandan origin, Joseph Oryang’s founder story, ordering or wholesale.');
    ['Our story', 'Who is Joseph Oryang?', 'The coffee', 'Order', 'Wholesale'].forEach((label) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = label;
      button.onclick = () => ask(label);
      quick.appendChild(button);
    });
    started = true;
  }
}

document.querySelectorAll('[data-open]').forEach((button) => button.addEventListener('click', openPanel));
document.getElementById('close').onclick = () => panel.classList.remove('open');
document.getElementById('form').onsubmit = (event) => { event.preventDefault(); ask(input.value); };
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') panel.classList.remove('open'); });
