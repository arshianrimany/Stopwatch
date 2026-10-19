const startBtn = document.getElementById("start");
const pauseBtn = document.getElementById("pause");
const lapBtn = document.getElementById("lap");
const resetBtn = document.getElementById("reset");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");
const millisecondsEl = document.getElementById("milliseconds");
const lapsEl = document.getElementById("laps");
const emptyEl = document.getElementById("empty");

let startTime = 0;
let elapsedTime = 0;
let timer = null;
let lapCount = 0;

function formatTime(ms) {
    const h = String(Math.floor(ms / 3600000)).padStart(2, "0");
    const m = String(Math.floor((ms % 3600000) / 60000)).padStart(2, "0");
    const s = String(Math.floor((ms % 60000) / 1000)).padStart(2, "0");
    const cs = String(Math.floor((ms % 1000) / 10)).padStart(2, "0");
    return `${h}:${m}:${s}:${cs}`;
}

function updateDisplay() {
    const [h, m, s, cs] = formatTime(elapsedTime).split(":");

    hoursEl.textContent = h;
    minutesEl.textContent = m;
    secondsEl.textContent = s;
    millisecondsEl.textContent = cs;
}

function updateTime() {
    elapsedTime = Date.now() - startTime;
    updateDisplay();
}

function updateEmptyState() {
    emptyEl.style.display = lapsEl.children.length === 0 ? "flex" : "none";
}

startBtn.addEventListener("click", () => {
    if (timer !== null) {
        return;
    }
    startTime = Date.now() - elapsedTime;
    timer = setInterval(updateTime, 10);
});

pauseBtn.addEventListener("click", () => {
    clearInterval(timer);
    timer = null;
});

lapBtn.addEventListener("click", () => {
    if (timer === null) return;

    lapCount++;

    const li = document.createElement("li");
    li.innerHTML = `
        <span>Lap ${lapCount}</span>
        <span>${formatTime(elapsedTime)}</span>
        <button class="delete-btn" aria-label="Delete lap">
            <i class="ri-delete-bin-line"></i>
        </button>
    `;

    lapsEl.append(li);
    lapsEl.scrollTop = lapsEl.scrollHeight;
    updateEmptyState();
});

lapsEl.addEventListener("click", (e) => {
    const deleteBtn = e.target.closest(".delete-btn");
    if (!deleteBtn) return;

    deleteBtn.closest("li").remove();
    updateEmptyState();
});

resetBtn.addEventListener("click", () => {
    clearInterval(timer);
    timer = null;
    startTime = 0;
    elapsedTime = 0;

    lapsEl.innerHTML = "";
    lapCount = 0;
    updateEmptyState();

    updateDisplay();
});

updateDisplay();
updateEmptyState();