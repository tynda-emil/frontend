const playPauseBtn = document.getElementById("playPauseBtn");
const progressBar = document.querySelector(".progress");
const volumeControl = document.getElementById("volume");
const audioPlayer = document.getElementById("audioPlayer");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const trackInfo = document.querySelector(".track-info");
let isPlaying = false;
let songs = [];
let currentTrackIndex = 0;

// Загрузка списка песен
async function getSongs() {
    try {
        const response = await fetch('http://192.168.30.199:8080/api/list');
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        songs = await response.json(); // Получаем массив строк
        if (!Array.isArray(songs) || songs.length === 0) {
            console.error("Список песен пуст или некорректен.");
        }
    } catch (error) {
        console.error("Ошибка при загрузке песен:", error);
    }
}
function updateTrackInfo(trackName) {
    if (!trackName) {
        console.error("Имя трека не указано.");
        return;
    }

    // Убираем расширение .mp3
    trackName = trackName.replace(".mp3", "");

    // Проверяем разделитель (может быть длинное тире, короткое тире или дефис)
    const separators = [" – ", " - ", "-"];
    let artist = "Unknown Artist";
    let title = "Unknown Title";

    for (const separator of separators) {
        if (trackName.includes(separator)) {
            [artist, title] = trackName.split(separator);
            break;
        }
    }

    // Заполняем данные в блок .track-info
    const trackInfo = document.querySelector(".track-info");
    trackInfo.querySelector("h3").textContent = title ? title.trim() : "Unknown Title";
    trackInfo.querySelector("p").textContent = artist ? artist.trim() : "Unknown Artist";

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

function playSong(trackName) {
    if (!trackName) {
        console.error("trackName не указан.");
        return;
    }
    const songUrl = `http://192.168.30.199:8080/audio/${encodeURIComponent(trackName)}`;
    console.log("Воспроизведение трека:", songUrl);
    updateTrackInfo(trackName);
    audioPlayer.src = songUrl;
    audioPlayer.load();
    audioPlayer.addEventListener("canplay", () => {
        audioPlayer.play();
    });
}
playPauseBtn.addEventListener("click", () => {
    if (isPlaying) {
        audioPlayer.pause();
    } else {
        if (songs.length === 0) {
            getSongs().then(() => {
                if (songs.length > 0) playSong(songs[0]);
            });
        } else {
            if (!audioPlayer.src) {
                playSong(songs[0]);
            } else {
                audioPlayer.play();
            }
        }
    }
});

// Обработчик кнопки "Следующий трек"
nextBtn.addEventListener("click", () => {
    if (songs.length === 0) {
        console.error("Список песен пуст. Загрузка песен...");
        return;
    }

    currentTrackIndex = (currentTrackIndex + 1) % songs.length; // Циклический переход
    playSong(songs[currentTrackIndex]);
});

// Обработчик кнопки "Предыдущий трек"
prevBtn.addEventListener("click", () => {
    if (songs.length === 0) {
        console.error("Список песен пуст. Загрузка песен...");
        return;
    }

    currentTrackIndex =
        (currentTrackIndex - 1 + songs.length) % songs.length; // Циклический переход назад
    playSong(songs[currentTrackIndex]);
});
// Событие при начале воспроизведения
audioPlayer.addEventListener("play", () => {
    isPlaying = true;
    playPauseBtn.innerHTML = "&#10074;&#10074;"; // Иконка Pause
});

// Событие при паузе
audioPlayer.addEventListener("pause", () => {
    isPlaying = false;
    playPauseBtn.innerHTML = "&#9654;"; // Иконка Play
});

// Обновление прогресса трека
audioPlayer.addEventListener("timeupdate", () => {
    if (audioPlayer.duration) {
        const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressBar.style.width = progress + "%";
    }
});

// Управление громкостью
volumeControl.addEventListener("input", () => {
  const volumeProgress = (volumeControl.value / volumeControl.max) * 100;
  volumeControl.style.setProperty("--progress", `${volumeProgress}%`);
  audioPlayer.volume = volumeControl.value / 100;
});

// ВЫДВИГАЮЩАЯСЯ ШТУКА ДЛЯ ТЕКСТА ПЕСНИ СПРАВА
document.getElementById("showLyricsBtn").addEventListener("click", function () {
  const lyricsContainer = document.getElementById("lyricsContainer");
  const button = this;
  lyricsContainer.classList.toggle("visible");
  button.classList.toggle("active");
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