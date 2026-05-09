const display = document.getElementById("display");
let count = 0;

function render() {
  display.textContent = count;
  display.className =
    "display" + (count > 0 ? " positive" : count < 0 ? " negative" : "");
}

document.getElementById("increment").addEventListener("click", () => { count++; render(); });
document.getElementById("decrement").addEventListener("click", () => { count--; render(); });
document.getElementById("reset").addEventListener("click", () => { count = 0; render(); });
