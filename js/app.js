function updateClock() {
  try {
    const now = new Date();
    const opts = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'Europe/Paris' };
    const timeStr = now.toLocaleTimeString('fr-FR', opts);
    const el = document.getElementById('clock-time');
    if (el) el.textContent = timeStr;
  } catch (e) {
    const now = new Date();
    const pad = n => String(n).padStart(2,'0');
    const fallback = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    const el = document.getElementById('clock-time');
    if (el) el.textContent = fallback;
  }
}

updateClock();
setInterval(updateClock, 500);

// Minuteur
let timerSeconds = 60;
let timerInterval = null;

function updateTimerDisplay() {
  const min = Math.floor(timerSeconds / 60);
  const sec = timerSeconds % 60;
  const pad = n => String(n).padStart(2, '0');
  const el = document.getElementById('timer-time');
  if (el) el.textContent = `${pad(min)}:${pad(sec)}`;
  const input = document.getElementById('timer-input');
  if (input && input !== document.activeElement) input.value = timerSeconds;
}

function showTimerAlert(msg) {
  const alertEl = document.getElementById('timer-alert');
  if (alertEl) {
    alertEl.textContent = msg;
    alertEl.style.display = msg ? 'block' : 'none';
  }
}

function startTimer() {
  if (timerSeconds <= 0 || timerInterval) return;
  showTimerAlert("");
  document.getElementById('timer-start').disabled = true;
  document.getElementById('timer-stop').disabled = false;
  timerInterval = setInterval(() => {
    if (timerSeconds > 0) {
      timerSeconds--;
      updateTimerDisplay();
      if (timerSeconds === 0) {
        clearInterval(timerInterval);
        timerInterval = null;
        showTimerAlert('⏰ Temps écoulé !');
        document.getElementById('timer-start').disabled = false;
        document.getElementById('timer-stop').disabled = true;
      }
    }
  }, 1000);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
    document.getElementById('timer-start').disabled = false;
    document.getElementById('timer-stop').disabled = true;
  }
}

window.addEventListener('DOMContentLoaded', () => {
  // Timer controls
  updateTimerDisplay();
  document.getElementById('timer-dec').onclick = () => {
    timerSeconds = Math.max(0, timerSeconds - 10);
    updateTimerDisplay();
  };
  document.getElementById('timer-inc').onclick = () => {
    timerSeconds = Math.min(3599, timerSeconds + 10);
    updateTimerDisplay();
  };
  document.getElementById('timer-input').oninput = e => {
    let val = parseInt(e.target.value, 10);
    if (isNaN(val)) val = 0;
    timerSeconds = Math.max(0, Math.min(3599, val));
    updateTimerDisplay();
  };
  document.getElementById('timer-start').onclick = startTimer;
  document.getElementById('timer-stop').onclick = stopTimer;
});