// Stats state
let category = 'scrimmage';
let wins = 0, losses = 0, goals = 0, assists = 0, onTarget = 0, offTarget = 0;

// Timer state (session only — not persisted)
let clockInterval = null;
let clockSeconds = 3600;
let clockRunning = false;
let playInterval = null;
let playSeconds = 0;
let playRunning = false;

// Element refs — stats
const winsEl       = document.getElementById('wins');
const lossesEl     = document.getElementById('losses');
const recordEl     = document.getElementById('record');
const goalsEl      = document.getElementById('goals');
const assistsEl    = document.getElementById('assists');
const onTargetEl   = document.getElementById('onTarget');
const offTargetEl  = document.getElementById('offTarget');
const shotAccEl    = document.getElementById('shotAccuracy');

// Element refs — timers
const timersEl      = document.getElementById('timers');
const gameClockEl   = document.getElementById('gameClock');
const playTimeEl    = document.getElementById('playTime');
const clockToggleEl = document.getElementById('clockToggle');
const playToggleEl  = document.getElementById('playToggle');

function formatTime(s) {
  const m = Math.floor(s / 60);
  return `${m}:${(s % 60).toString().padStart(2, '0')}`;
}

function save() {
  localStorage.setItem('soccer-tracker', JSON.stringify(
    { category, wins, losses, goals, assists, onTarget, offTarget }
  ));
}

function load() {
  try {
    const d = JSON.parse(localStorage.getItem('soccer-tracker') || 'null');
    if (!d) return;
    category  = d.category  ?? 'scrimmage';
    wins      = d.wins      ?? 0;
    losses    = d.losses    ?? 0;
    goals     = d.goals     ?? 0;
    assists   = d.assists   ?? 0;
    onTarget  = d.onTarget  ?? 0;
    offTarget = d.offTarget ?? 0;
  } catch (_) {}
}

function render() {
  winsEl.textContent      = wins;
  lossesEl.textContent    = losses;
  goalsEl.textContent     = goals;
  assistsEl.textContent   = assists;
  onTargetEl.textContent  = onTarget;
  offTargetEl.textContent = offTarget;

  const total = wins + losses;
  recordEl.textContent = total === 0
    ? '0 1v1s attempted'
    : `${total} 1v1${total !== 1 ? 's' : ''} attempted · ${Math.round(wins / total * 100)}% win rate`;

  const shots = onTarget + offTarget;
  shotAccEl.textContent = shots === 0
    ? '0 shots'
    : `${shots} shot${shots !== 1 ? 's' : ''} · ${Math.round(onTarget / shots * 100)}% on target`;
}

function renderClocks() {
  gameClockEl.textContent = formatTime(clockSeconds);
  playTimeEl.textContent  = formatTime(playSeconds);
}

function setCategory(cat) {
  category = cat;
  document.querySelectorAll('.btn--category').forEach(b =>
    b.classList.toggle('active', b.dataset.cat === cat)
  );
  timersEl.classList.toggle('hidden', cat === 'scrimmage');
  save();
}

function toggleClock() {
  if (clockRunning) {
    clearInterval(clockInterval);
    clockInterval = null;
    clockRunning = false;
    clockToggleEl.textContent = 'Start';
    clockToggleEl.classList.remove('running');
  } else {
    if (clockSeconds === 0) return;
    clockRunning = true;
    clockToggleEl.textContent = 'Pause';
    clockToggleEl.classList.add('running');
    clockInterval = setInterval(() => {
      clockSeconds--;
      renderClocks();
      if (clockSeconds === 0) {
        clearInterval(clockInterval);
        clockInterval = null;
        clockRunning = false;
        clockToggleEl.textContent = 'Start';
        clockToggleEl.classList.remove('running');
      }
    }, 1000);
  }
}

function resetClock() {
  clearInterval(clockInterval);
  clockInterval = null;
  clockRunning = false;
  clockSeconds = 3600;
  clockToggleEl.textContent = 'Start';
  clockToggleEl.classList.remove('running');
  renderClocks();
}

function togglePlay() {
  if (playRunning) {
    clearInterval(playInterval);
    playInterval = null;
    playRunning = false;
    playToggleEl.textContent = "I'm On";
    playToggleEl.classList.remove('running');
  } else {
    playRunning = true;
    playToggleEl.textContent = "I'm Off";
    playToggleEl.classList.add('running');
    playInterval = setInterval(() => { playSeconds++; renderClocks(); }, 1000);
  }
}

function bump(el) {
  el.classList.remove('bump');
  void el.offsetWidth;
  el.classList.add('bump');
  setTimeout(() => el.classList.remove('bump'), 150);
}

// Category
document.querySelectorAll('.btn--category').forEach(btn =>
  btn.addEventListener('click', () => setCategory(btn.dataset.cat))
);

// Timers
clockToggleEl.addEventListener('click', toggleClock);
document.getElementById('clockReset').addEventListener('click', resetClock);
playToggleEl.addEventListener('click', togglePlay);

// Stats
document.getElementById('win').addEventListener('click',      () => { wins++;      bump(winsEl);      save(); render(); });
document.getElementById('loss').addEventListener('click',     () => { losses++;    bump(lossesEl);    save(); render(); });
document.getElementById('addGoal').addEventListener('click',  () => { goals++;     bump(goalsEl);     save(); render(); });
document.getElementById('addAssist').addEventListener('click',() => { assists++;   bump(assistsEl);   save(); render(); });
document.getElementById('addOn').addEventListener('click',    () => { onTarget++;  bump(onTargetEl);  save(); render(); });
document.getElementById('addOff').addEventListener('click',   () => { offTarget++; bump(offTargetEl); save(); render(); });

// Reset All
document.getElementById('reset').addEventListener('click', () => {
  if (!confirm('Reset all stats? Timers will also stop.')) return;
  wins = losses = goals = assists = onTarget = offTarget = 0;
  clearInterval(clockInterval); clockInterval = null; clockRunning = false;
  clockSeconds = 3600; clockToggleEl.textContent = 'Start'; clockToggleEl.classList.remove('running');
  clearInterval(playInterval); playInterval = null; playRunning = false;
  playSeconds = 0; playToggleEl.textContent = "I'm On"; playToggleEl.classList.remove('running');
  save(); render(); renderClocks();
});

// Init
load();
setCategory(category);
render();
renderClocks();
