const winsEl = document.getElementById("wins");
const lossesEl = document.getElementById("losses");
const recordEl = document.getElementById("record");

let wins = 0;
let losses = 0;

function bump(el) {
  el.classList.remove("bump");
  void el.offsetWidth;
  el.classList.add("bump");
  setTimeout(() => el.classList.remove("bump"), 150);
}

function render() {
  winsEl.textContent = wins;
  lossesEl.textContent = losses;

  const total = wins + losses;
  if (total === 0) {
    recordEl.textContent = "0 1v1s attempted";
  } else {
    const pct = Math.round((wins / total) * 100);
    recordEl.textContent = `${total} 1v1${total !== 1 ? "s" : ""} attempted · ${pct}% win rate`;
  }
}

document.getElementById("win").addEventListener("click", () => {
  wins++;
  bump(winsEl);
  render();
});

document.getElementById("loss").addEventListener("click", () => {
  losses++;
  bump(lossesEl);
  render();
});

document.getElementById("reset").addEventListener("click", () => {
  wins = 0;
  losses = 0;
  render();
});
