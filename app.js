const ODEK_WHATSAPP = '256704650600'; // Prototype receptionist; swap to Odek Coffee's official number at handover.
const whatsappBase = `https://wa.me/${ODEK_WHATSAPP}?text=`;

const messages = {
  order: 'Hello Odek Coffee. I would like to order the 250g Single-Origin Pure Robusta. Please send me the current price, availability and delivery options.',
  wholesale: 'Hello Odek Coffee. I am interested in wholesale / hospitality supply. Please share pack sizes, trade pricing, minimum order and delivery options.',
  general: 'Hello Odek Coffee. I found you through the website and would like more information.',
  concierge: 'Hello Odek Coffee. I was speaking with the website concierge and would like a person to assist me.'
};

document.querySelectorAll('[data-whatsapp]').forEach(btn => btn.addEventListener('click', () => {
  const key = btn.dataset.whatsapp || 'general';
  window.open(whatsappBase + encodeURIComponent(messages[key] || messages.general), '_blank', 'noopener');
}));

document.getElementById('year').textContent = new Date().getFullYear();

const reveals = document.querySelectorAll('.reveal');
const io = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add('visible'); io.unobserve(entry.target); }
}), {threshold:.12});
reveals.forEach(el => io.observe(el));

const panel = document.getElementById('concierge');
const backdrop = document.getElementById('backdrop');
const chat = document.getElementById('chat');
const quickReplies = document.getElementById('quickReplies');
const input = document.getElementById('chatInput');
let started = false;

const knowledge = [
  {
    keys:['origin','where','uganda','odek','omoro','acholi'],
    answer:'Odek Coffee is a single-origin Ugandan coffee from Odek, in Omoro District, Acholi Sub-Region, Northern Uganda. The pack identifies it as Pure Robusta.'
  },
  {
    keys:['roast','taste','strong','flavour','flavor','robusta'],
    answer:'The pack describes Odek as Pure Robusta with a medium-dark roast. That makes it a good fit for drinkers who want a fuller, more assertive cup and for milk-based coffee.'
  },
  {
    keys:['story','hope','war','conflict','community','impact','farmer'],
    answer:'The heart of the brand is “Hope Grows in Odek.” Odek and the wider Acholi region were deeply affected by conflict. The pack presents coffee as part of renewed livelihoods, community recovery and a brighter future — so the origin story is economic as well as geographic.'
  },
  {
    keys:['brew','french','press','pour','recipe','make'],
    answer:'For French press, start with 18g coffee to 300ml hot water and steep 4 minutes. For pour-over, try 16g to 250ml. If you like a stronger Ugandan-style cup, simmer 1–2 tablespoons per cup to taste.'
  },
  {
    keys:['price','buy','order','delivery','available','pack','250'],
    answer:'The current pack shown is 250g ground coffee. I will not invent a price — tap the WhatsApp receptionist and the team can confirm current price, stock and delivery.'
  },
  {
    keys:['wholesale','hotel','cafe','café','office','retail','shop','corporate'],
    answer:'Yes — the site is set up for wholesale, hospitality, office and retail enquiries. I can hand you straight to WhatsApp with a pre-filled trade request.'
  }
];

function addMessage(text, who='bot') {
  const div = document.createElement('div');
  div.className = `msg ${who}`;
  div.textContent = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function setQuickReplies() {
  const items = ['What makes Odek special?','Tell me the story','How do I brew it?','I want to order','Wholesale'];
  quickReplies.innerHTML = '';
  items.forEach(label => {
    const b = document.createElement('button');
    b.type = 'button'; b.textContent = label;
    b.addEventListener('click', () => handleQuery(label));
    quickReplies.appendChild(b);
  });
}

function answerFor(query) {
  const q = query.toLowerCase();
  let best = {score:0, answer:''};
  knowledge.forEach(item => {
    const score = item.keys.reduce((n,k) => n + (q.includes(k) ? 1 : 0), 0);
    if (score > best.score) best = {score, answer:item.answer};
  });
  if (best.score) return best.answer;
  return 'I can help with Odek’s origin, the “Hope Grows in Odek” story, the roast, brewing, orders or wholesale. Ask me one of those — or continue to WhatsApp for a person.';
}

function handleQuery(query) {
  if (!query.trim()) return;
  addMessage(query.trim(),'user');
  const answer = answerFor(query);
  setTimeout(() => addMessage(answer), 180);
  input.value='';
}

function openConcierge() {
  panel.classList.add('open'); backdrop.classList.add('open'); panel.setAttribute('aria-hidden','false');
  if (!started) {
    addMessage('Welcome to Odek Coffee. I can tell you where the coffee comes from, explain the story on the pack, suggest a brew method, or help you order.');
    setQuickReplies(); started = true;
  }
  setTimeout(() => input.focus(),250);
}
function closeConcierge(){panel.classList.remove('open');backdrop.classList.remove('open');panel.setAttribute('aria-hidden','true')}

document.querySelectorAll('[data-open-concierge]').forEach(btn=>btn.addEventListener('click',openConcierge));
document.getElementById('closeConcierge').addEventListener('click',closeConcierge);
backdrop.addEventListener('click',closeConcierge);
document.getElementById('chatForm').addEventListener('submit',e=>{e.preventDefault();handleQuery(input.value)});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeConcierge()});
