const goalsEl = document.getElementById("goals");
const missesEl = document.getElementById("misses");
const attemptsEl = document.getElementById("attempts");

let goals = 0;
let misses = 0;

function bump(el) {
  el.classList.remove("bump");
  void el.offsetWidth;
  el.classList.add("bump");
  setTimeout(() => el.classList.remove("bump"), 150);
}

function render() {
  goalsEl.textContent = goals;
  missesEl.textContent = misses;
  const total = goals + misses;
  attemptsEl.textContent = total === 1 ? "1 attempt" : `${total} attempts`;
}

document.getElementById("goal").addEventListener("click", () => {
  goals++;
  bump(goalsEl);
  render();
});

document.getElementById("miss").addEventListener("click", () => {
  misses++;
  bump(missesEl);
  render();
});

document.getElementById("reset").addEventListener("click", () => {
  goals = 0;
  misses = 0;
  render();
});
