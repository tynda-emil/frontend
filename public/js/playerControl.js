const playPauseBtn = document.getElementById("playPauseBtn");
const progressBar = document.querySelector(".progress");
const volumeControl = document.getElementById("volume");
let isPlaying = false;
let currentProgress = 0;

// ОБРАБОТЧИК КЛИКА НА КНОПКУ PLAY/PAUSE
playPauseBtn.addEventListener("click", () => {
  if (isPlaying) {
    playPauseBtn.innerHTML = "&#9654;"; // Play icon
  } else {
    playPauseBtn.innerHTML = "&#10074;&#10074;"; // Pause icon
  }
  isPlaying = !isPlaying;
});

// ОБНОВЛЕНИЕ ПРОГРЕССА
function updateProgress() {
  if (isPlaying) {
    currentProgress += 0.5; // Увеличиваем прогресс
    if (currentProgress > 100) {
      currentProgress = 0;
    }
    progressBar.style.width = currentProgress + "%";
  }
}

setInterval(updateProgress, 1000); // Обновление каждую секунду

// ОБНОВЛЕНИЕ ПРОГРЕССА СЛАЙДЕРА ГРОМКОСТИ
volumeControl.addEventListener("input", () => {
  const volumeProgress = (volumeControl.value / volumeControl.max) * 100;
  volumeControl.style.setProperty("--progress", `${volumeProgress}%`);
});

// ВЫДВИГАЮЩАЯСЯ ШТУКА ДЛЯ ТЕКСТА ПЕСНИ СПРАВА
document.getElementById("showLyricsBtn").addEventListener("click", function () {
  const lyricsContainer = document.getElementById("lyricsContainer");
  const button = this;

  lyricsContainer.classList.toggle("visible");
  button.classList.toggle("active"); // смена состояния кнопки
});

// это для модального окна (которое на весь экран), где отображается текст песни
// КНОПКА "НА ВЕСЬ ЭКРАН
document.querySelector(".fullscreenBtn").addEventListener("click", function () {
  document.getElementById("fullscreenLyricsModal").style.display = "flex";
});

// КНОПКА "ЗАКРЫТЬ"
document.querySelector(".closeModalBtn").addEventListener("click", function () {
  document.getElementById("fullscreenLyricsModal").style.display = "none";
});
