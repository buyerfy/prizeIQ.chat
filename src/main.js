// ── Smooth scroll for nav links
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── Active nav link on scroll
const navLinks = document.querySelectorAll('.nav-links a');
const sections = ['hero','problem','flow','ai-logic','analytics','pricing','final-cta']
  .map(id => document.getElementById(id)).filter(Boolean);

function updateActiveNav() {
  const scrollY = window.scrollY + 120;
  let current = sections[0];
  sections.forEach(s => { if (s.offsetTop <= scrollY) current = s; });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current.id);
  });
}
window.addEventListener('scroll', updateActiveNav, { passive: true });
updateActiveNav();
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 60));

// ── Scroll reveal
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('visible'); obs.unobserve(e.target); }});
}, { threshold:.1, rootMargin:'0px 0px -50px 0px' });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

// ── Animated counters
function animCounter(el, target, suffix='') {
  const cObs = new IntersectionObserver(([e]) => {
    if(!e.isIntersecting) return;
    let cur=0; const step=16, inc=target/(1600/step);
    const t=setInterval(()=>{
      cur=Math.min(cur+inc,target);
      el.textContent=Math.floor(cur).toLocaleString('hr')+suffix;
      if(cur>=target)clearInterval(t);
    },step);
    cObs.unobserve(el);
  },{threshold:.5});
  cObs.observe(el);
}
animCounter(document.getElementById('c1'),4521);
animCounter(document.getElementById('c2'),2847);
animCounter(document.getElementById('c3'),97,'%');

// ── WhatsApp chat loop — runs in BOTH hero and flow section
const RECEIPT_IMG = '/receipt.png';
const MSGS=[
  {type:'user',text:'Prijava u Nagradnu igru; Račune slikaj, WhatsApp klikaj!'},
  {type:'ai',text:'Dobrodošli u PrizeIQ! 🎯\nPošaljite fotografiju fiskalnog računa.'},
  {type:'img',text:''},
  {type:'ai',text:'⏳ Obrađujem vaš račun...'},
  {type:'success',text:''},
];
const DELAYS=[700,1500,2900,3700,5500];
// Live clock in phone status bar
function updateClock(){
  const now=new Date();
  const el=document.getElementById('wa-clock');
  if(el) el.textContent=`${now.getHours()}:${String(now.getMinutes()).padStart(2,'0')}`;
}
updateClock(); setInterval(updateClock,10000);

function makeMsg(m){
  const d=document.createElement('div');
  const isUser=m.type==='user', isSuccess=m.type==='success';
  d.style.opacity='0'; d.style.transform='translateY(8px)'; d.style.transition='opacity .3s,transform .3s';
  const now=new Date();
  const t=`${now.getHours()}:${String(now.getMinutes()).padStart(2,'0')}`;
  const col=isUser?'#53bdeb':'#8696a0';
  const tickSVG=`<svg width="15" height="11" viewBox="0 0 15 11" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block;vertical-align:middle;flex-shrink:0"><path d="M1 5L4 8L8 2" stroke="${col}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M5.5 8L10 2" stroke="${col}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  if(m.type==='img'){
    d.className='wa-msg wa-msg-user';
    d.style.padding='4px 4px 4px 4px';
    d.style.maxWidth='72%';
    d.innerHTML=`<div style="position:relative;border-radius:6px;overflow:hidden;"><img src="${RECEIPT_IMG}" style="width:100%;max-width:180px;display:block;border-radius:6px;"/><div class="wa-meta" style="position:absolute;bottom:4px;right:6px;background:rgba(0,0,0,.45);padding:2px 5px;border-radius:6px;backdrop-filter:blur(4px)">${t}&nbsp;`+tickSVG+`</div></div>`;
  } else if(isSuccess){
    d.className='wa-msg wa-msg-success';
    d.innerHTML=`<div class="wa-success-header">✅ Račun validiran!</div><div class="wa-success-body" style="font-size:.68rem;line-height:1.7;color:#a8c5a0"><span style="color:#e9edef;font-weight:700">🛒 Kaufland Hrvatska k.d.</span><br><span style="color:#8696a0;font-size:.62rem">Zagreb Središće · Julija Knifera 1</span><br><br>📦 Borovnica 300g<br>💶 Iznos: <span style="color:#e9edef;font-weight:700">4,99 EUR</span><br>📅 17.03.2026. u 18:09<br>💳 Visa Debit · Contactless<br><br><span style="color:#25D366;font-weight:700">🎉 Bod #4472 dodan za izvlačenje!</span></div><div class="wa-meta">${t}</div>`;
  } else {
    d.className='wa-msg '+(isUser?'wa-msg-user':'wa-msg-ai');
    d.innerHTML=`<span>${m.text}</span><div class="wa-meta">${t}${isUser?'&nbsp;'+tickSVG:''}</div>`;
  }
  return d;
}
function makeTyping(){
  const d=document.createElement('div');d.className='wa-typing';
  d.innerHTML='<span></span><span></span><span></span>';
  d.style.opacity='0';d.style.transition='opacity .25s';
  const s=d.querySelectorAll('span');
  s.forEach((sp,i)=>{sp.style.cssText='width:5px;height:5px;border-radius:50%;background:rgba(255,255,255,.35);display:block;';sp.style.animation=`typingB 1s ${i*.2}s infinite`;});
  return d;
}

function runChatIn(container, timersArr){
  container.innerHTML='';
  timersArr.forEach(clearTimeout); timersArr.length=0;
  MSGS.forEach((m,i)=>{
    if(m.type!=='user'){
      timersArr.push(setTimeout(()=>{
        const t=makeTyping(); container.appendChild(t);
        setTimeout(()=>{ if(t.parentNode) t.style.opacity='1'; },20);
      },DELAYS[i]-750));
    }
    timersArr.push(setTimeout(()=>{
      container.querySelectorAll('.wa-typing').forEach(t=>t.remove());
      const el=makeMsg(m); container.appendChild(el);
      setTimeout(()=>{ el.style.opacity='1'; el.style.transform='translateY(0)'; container.scrollTop=container.scrollHeight; },20);
    },DELAYS[i]));
  });
  timersArr.push(setTimeout(()=>runChatIn(container,timersArr), DELAYS[DELAYS.length-1]+3200));
}

const heroChat=document.getElementById('hero-chat');
const flowChat=document.getElementById('wa-body');
const heroTimers=[], flowTimers=[];
setTimeout(()=>runChatIn(heroChat,heroTimers), 600);
setTimeout(()=>runChatIn(flowChat,flowTimers), 1200);

// ── CSS for typing animation
const style=document.createElement('style');
style.textContent=`@keyframes typingB{0%,60%,100%{transform:translateY(0);opacity:.35}30%{transform:translateY(-4px);opacity:1}}`;
document.head.appendChild(style);

// ── Live log
const LOG=[
  ['var(--green)','Račun validiran · Zagreb'],
  ['var(--purple)','Nova prijava · Split'],
  ['var(--green)','Duplikat blokiran · AI'],
  ['var(--green)','Račun validiran · Rijeka'],
  ['var(--purple)','Nova prijava · Osijek'],
  ['var(--green)','OCR validacija · Zadar'],
  ['var(--purple)','Nova prijava · Dubrovnik'],
];
let logIdx=0;
setInterval(()=>{
  const items=document.querySelectorAll('#live-log .log-item');
  if(!items.length) return;
  const item=items[Math.floor(Math.random()*items.length)];
  const entry=LOG[logIdx%LOG.length]; logIdx++;
  item.style.opacity='.3';
  setTimeout(()=>{
    const dot=item.querySelector('.log-dot'),text=item.querySelector('.log-text'),time=item.querySelector('.log-time');
    if(dot&&text&&time){dot.style.background=entry[0];text.textContent=entry[1];time.textContent='upravo';}
    item.style.opacity='1';
   }, 400);
}, 2800);