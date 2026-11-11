(() => {
  const toggle = document.getElementById('menuToggle');
  const menu = document.getElementById('mobileNav');
  const closeMenu = () => { toggle.setAttribute('aria-expanded', 'false'); menu.hidden = true; };
  toggle.addEventListener('click', () => { const open = toggle.getAttribute('aria-expanded') !== 'true'; toggle.setAttribute('aria-expanded', String(open)); menu.hidden = !open; });
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.getElementById('year').textContent = new Date().getFullYear();
  const scripts = {
    leak: [
      ['customer', 'A pipe just burst under my kitchen sink. There’s water everywhere.'],
      ['bot', 'I’m sorry—that sounds urgent. If safe, shut off the water supply. Can I take your service address?'],
      ['customer', 'I’m in Mesa, near Main Street.'],
      ['bot', 'Thanks. I’ll flag this as urgent and capture your preferred callback number so the plumbing team can follow up.'],
      ['summary', 'URGENT LEAK · Mesa area · Water shutoff guidance given · Owner callback needed']
    ],
    heater: [
      ['customer', 'My water heater stopped making hot water yesterday.'],
      ['bot', 'Understood. Is it leaking, making unusual noises, or simply not heating?'],
      ['customer', 'No leak. It’s just cold. I’m free tomorrow morning.'],
      ['bot', 'I can capture tomorrow morning as your preferred window. The team will confirm availability before any appointment is booked.'],
      ['summary', 'NO HOT WATER · No reported leak · Morning preferred · Confirmation pending']
    ],
    drain: [
      ['customer', 'The bathroom drain has been clogged for two days.'],
      ['bot', 'I can help collect the details. Is the backup affecting one fixture or multiple drains?'],
      ['customer', 'Just the shower for now.'],
      ['bot', 'Got it. I’ll note a single-fixture shower drain issue and capture the best contact information for the team to follow up.'],
      ['summary', 'CLOGGED SHOWER DRAIN · Single fixture · Follow-up requested · No appointment confirmed']
    ]
  };
  let selected = 'leak'; let currentRun = 0; let activeTimers = [];
  const conversation = document.getElementById('conversation');
  const status = document.getElementById('simStatus');
  const clock = document.getElementById('callClock');
  const play = document.getElementById('startDemo');
  function clearTimers(){ activeTimers.forEach(clearTimeout); activeTimers = []; }
  document.querySelectorAll('.scenario').forEach(btn => btn.addEventListener('click', () => {
    selected = btn.dataset.scenario;
    document.querySelectorAll('.scenario').forEach(b => { const active = b === btn; b.classList.toggle('active', active); b.setAttribute('aria-pressed', String(active)); });
    currentRun++; clearTimers(); status.textContent = 'READY'; clock.textContent = '00:00'; play.disabled = false; play.innerHTML = 'Play call preview <span aria-hidden="true">▶</span>';
    conversation.innerHTML = '<div class="msg bot"><span>AI · Alex</span><p>Hi, this is Alex — an AI assistant answering for a plumbing company. How can I help you today?</p></div><div class="demo-placeholder">Press play to preview this scenario.</div>';
  }));
  play.addEventListener('click', () => {
    currentRun++; const run = currentRun; clearTimers(); conversation.innerHTML = '<div class="msg bot"><span>AI · Alex</span><p>Hi, this is Alex — an AI assistant answering for a plumbing company. How can I help you today?</p></div>'; status.textContent = 'SIMULATING'; play.disabled = true; play.innerHTML = 'Playing preview…';
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const delay = reduced ? 110 : 950;
    scripts[selected].forEach(([speaker, text], i) => {
      activeTimers.push(setTimeout(() => {
        if (run !== currentRun) return;
        const el = document.createElement('div'); el.className = speaker === 'summary' ? 'summary-msg' : `msg ${speaker}`;
        const lab = document.createElement('span'); lab.textContent = speaker === 'summary' ? 'EXAMPLE CALL HANDOFF' : speaker === 'bot' ? 'AI · Alex' : 'Caller';
        const p = document.createElement('p'); p.textContent = text; el.append(lab, p); conversation.appendChild(el); conversation.scrollTop = conversation.scrollHeight;
        clock.textContent = `00:${String((i+1)*8).padStart(2, '0')}`;
        if (i === scripts[selected].length - 1) { status.textContent = 'PREVIEW COMPLETE'; play.disabled = false; play.innerHTML = 'Replay preview <span aria-hidden="true">↻</span>'; }
      }, (i+1)*delay));
    });
  });
})();
