/*************************
 * HORLOGE
 *************************/

function updateClock() {
  const el = document.getElementById('clock-time');
  if (!el) return;

  try {
    const now = new Date();
    const opts = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'Europe/Paris'
    };
    el.textContent = now.toLocaleTimeString('fr-FR', opts);
  } catch {
    const now = new Date();
    const pad = n => String(n).padStart(2, '0');
    el.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  }
}

updateClock();
setInterval(updateClock, 500);


/*************************
 * MINUTEUR
 *************************/

let timerSeconds = 60;
let timerInterval = null;

const pad = n => String(n).padStart(2, '0');

function updateTimerDisplay() {
  const timeEl = document.getElementById('timer-time');
  const inputEl = document.getElementById('timer-input');

  if (timeEl) {
    const m = Math.floor(timerSeconds / 60);
    const s = timerSeconds % 60;
    timeEl.textContent = `${pad(m)}:${pad(s)}`;
  }

  if (inputEl && inputEl !== document.activeElement) {
    inputEl.value = timerSeconds;
  }
}

function showTimerAlert(msg) {
  const alertEl = document.getElementById('timer-alert');
  if (!alertEl) return;
  alertEl.textContent = msg;
  alertEl.style.display = msg ? "block" : "none";
}

function startTimer() {
  if (timerSeconds <= 0 || timerInterval) return;

  showTimerAlert("");
  document.getElementById('timer-start').disabled = true;
  document.getElementById('timer-stop').disabled = false;

  timerInterval = setInterval(() => {
    timerSeconds--;
    updateTimerDisplay();

    if (timerSeconds <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;

      showTimerAlert("⏰ Temps écoulé !");
      document.getElementById('timer-start').disabled = false;
      document.getElementById('timer-stop').disabled = true;
    }
  }, 1000);
}

function stopTimer() {
  if (!timerInterval) return;

  clearInterval(timerInterval);
  timerInterval = null;
  document.getElementById('timer-start').disabled = false;
  document.getElementById('timer-stop').disabled = true;
}

window.addEventListener("DOMContentLoaded", () => {
  updateTimerDisplay();

  document.getElementById("timer-dec").onclick = () => {
    timerSeconds = Math.max(0, timerSeconds - 10);
    updateTimerDisplay();
  };

  document.getElementById("timer-inc").onclick = () => {
    timerSeconds = Math.min(3599, timerSeconds + 10);
    updateTimerDisplay();
  };

  document.getElementById("timer-input").oninput = e => {
    let v = parseInt(e.target.value, 10);
    if (isNaN(v)) v = 0;
    timerSeconds = Math.min(3599, Math.max(0, v));
    updateTimerDisplay();
  };

  document.getElementById("timer-start").onclick = startTimer;
  document.getElementById("timer-stop").onclick = stopTimer;
});


/*************************
 * CHRONOMÈTRE
 *************************/

let swInterval = null;
let swStartTime = 0;
let swElapsedTime = 0; // en miliseconde

function updateStopwatchDisplay() {
  const el = document.getElementById("stopwatch-time");
  if (!el) return;

  const minutes = Math.floor(swElapsedTime / 60000);
  const seconds = Math.floor((swElapsedTime % 60000) / 1000);
  const centiseconds = Math.floor((swElapsedTime % 1000) / 10);

  el.textContent = `${pad(minutes)}:${pad(seconds)}.${pad(centiseconds)}`;
}

function startStopwatch() {
  if (swInterval) return;

  swStartTime = Date.now() - swElapsedTime;
  swInterval = setInterval(() => {
    swElapsedTime = Date.now() - swStartTime;
    updateStopwatchDisplay();
  }, 10);

  document.getElementById("stopwatch-start").disabled = true;
  document.getElementById("stopwatch-stop").disabled = false;
  document.getElementById("stopwatch-lap").disabled = false;
}

function stopStopwatch() {
  if (!swInterval) return;

  clearInterval(swInterval);
  swInterval = null;

  document.getElementById("stopwatch-start").disabled = false;
  document.getElementById("stopwatch-stop").disabled = true;
}

function resetStopwatch() {
  stopStopwatch();
  swElapsedTime = 0;
  updateStopwatchDisplay();
  document.getElementById("stopwatch-lap-list").innerHTML = "";
  document.getElementById("stopwatch-lap").disabled = true;
}

function addLap() {
  const ul = document.getElementById("stopwatch-lap-list");
  const li = document.createElement("li");
  li.textContent = document.getElementById("stopwatch-time").textContent;
  ul.prepend(li);
}

window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("stopwatch-start").onclick = startStopwatch;
  document.getElementById("stopwatch-stop").onclick = stopStopwatch;
  document.getElementById("stopwatch-reset").onclick = resetStopwatch;
  document.getElementById("stopwatch-lap").onclick = addLap;
});

/*************************
 * RÉVEILS
 *************************/
const alarms = [];

function renderAlarms() {
  const ul = document.getElementById("alarm-list");
  if (!ul) return;
  ul.innerHTML = "";

  alarms.forEach((alarm, index) => {
    const li = document.createElement("li");
    li.textContent = `${alarm.time} - ${alarm.label}`;
    
    const delBtn = document.createElement("button");
    delBtn.textContent = "Supprimer";
    delBtn.onclick = () => {
      alarms.splice(index, 1);
      renderAlarms();
    };

    li.appendChild(delBtn);
    ul.appendChild(li);
  });
}

function checkAlarms() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2,"0");
  const m = String(now.getMinutes()).padStart(2,"0");
  const currentTime = `${h}:${m}`;

  alarms.forEach(alarm => {
    if (!alarm.triggered && alarm.time === currentTime) {
      alarm.triggered = true;
      alert(`⏰ Réveil : ${alarm.label}`);
    }
  });
}

// Formulaire
const alarmForm = document.getElementById("alarm-form");
if (alarmForm) {
  alarmForm.onsubmit = e => {
    e.preventDefault();
    const timeInput = document.getElementById("alarm-time");
    const labelInput = document.getElementById("alarm-label");
    if (!timeInput.value) return;
    alarms.push({ time: timeInput.value, label: labelInput.value || "Réveil", triggered: false });
    renderAlarms();
    timeInput.value = "";
    labelInput.value = "";
  };
}

setInterval(checkAlarms, 30000);
