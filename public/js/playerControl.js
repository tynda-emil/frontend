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
        const response = await fetch('http://localhost:8086/api/list');
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
function updateAlbumCover(trackName) {
    if (!trackName) {
        console.error("trackName не указан.");
        return;
    }

    const imageUrl = `http://localhost:8086/img/${encodeURIComponent(trackName.replace(".mp3", ""))}`; // Путь к изображению
    const albumCover = document.querySelector(".album-cover img");
    
    // Устанавливаем новый src для обложки
    albumCover.src = imageUrl;

    // Логирование для отладки
    console.log("Обновление обложки альбома:", imageUrl);

    // Обработка ошибок загрузки
    albumCover.onerror = () => {
        console.error(`Ошибка загрузки изображения: ${imageUrl}`);
         // Установить изображение по умолчанию
    };
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
}
async function loadFullLyrics() {
  try {
    // Запрос к API для получения содержимого файла
    const response = await fetch("http://localhost:8086/api/getLyrics");
    if (!response.ok) {
      throw new Error(`Ошибка при загрузке текста: ${response.status}`);
    }

    // Чтение текста из ответа
    const rawLyrics = await response.text();

    // Удаляем таймкоды с помощью регулярного выражения
    const lyricsWithoutTimestamps = rawLyrics.replace(/\[\d{2}:\d{2}\.\d{3}\]\s*/g, "");

    // Заменяем переносы строк на HTML <br>
    const formattedLyrics = lyricsWithoutTimestamps.replace(/\n/g, "<br>");

    // Находим контейнер для текста и вставляем форматированный текст
    const lyricsContainer = document.querySelector("#lyricsContainer p");
    if (lyricsContainer) {
      lyricsContainer.innerHTML = formattedLyrics.trim();
    } else {
      console.error("Элемент #lyricsContainer не найден.");
    }
  } catch (error) {
    console.error("Ошибка при загрузке полного текста песни:", error);
  }
}

let lyricsWithTimestamps = []; // Хранилище для таймкодов и текста
let syncInterval = null; // Таймер синхронизации

// Метод для загрузки и парсинга текста с таймкодами
async function loadLyricsWithTimestamps() {
  try {
    const response = await fetch("http://localhost:8086/api/getLyrics");
    if (!response.ok) {
      throw new Error("Ошибка при загрузке текста с таймкодами.");
    }

    const rawLyrics = await response.text();

    // Парсим текст с таймкодами в массив { time, text }
    lyricsWithTimestamps = rawLyrics
      .split("\n") // Разделяем текст по строкам
      .map((line) => {
        const match = line.match(/\[(\d{2}):(\d{2}\.\d{3})\]\s*(.*)/); // Извлекаем таймкод и текст
        if (match) {
          const minutes = parseInt(match[1], 10);
          const seconds = parseFloat(match[2]);
          const timeInSeconds = minutes * 60 + seconds; // Конвертируем таймкод в секунды
          const text = match[3]; // Текст без таймкода
          return { time: timeInSeconds, text };
        }
        return null;
      })
      .filter((item) => item !== null); // Исключаем пустые строки

    console.log("Текст с таймкодами загружен:", lyricsWithTimestamps);
  } catch (error) {
    console.error("Ошибка при загрузке текста с таймкодами:", error);
  }
}

// Метод для синхронизации текста с таймингами
function synchronizeLyrics(audioPlayer, lyricsContainerSelector) {
  const lyricsContainer = document.querySelector(lyricsContainerSelector);

  if (!lyricsContainer) {
    console.error("Контейнер для синхронизации текста не найден.");
    return;
  }

  let lastLine = null; // Храним последнюю строку, чтобы не обновлять текст каждый раз

  // Таймер для обновления текста
  const syncInterval = setInterval(() => {
    const currentTime = audioPlayer.currentTime; // Текущее время аудио в секундах

    // Найти строку, которая соответствует текущему времени
    const currentLine = lyricsWithTimestamps.find((line, index, arr) => {
      const nextLine = arr[index + 1];
      return currentTime >= line.time && (!nextLine || currentTime < nextLine.time);
    });

    // Обновляем текст, если строка изменилась
    if (currentLine && currentLine.text !== lastLine) {
      lyricsContainer.textContent = currentLine.text; // Вставляем только одну строку
      lastLine = currentLine.text; // Обновляем последнюю строку
    }
  }, 500); // Проверка каждые 500 мс

  // Очищаем таймер при остановке аудио
  audioPlayer.addEventListener("ended", () => clearInterval(syncInterval));
}
// Основной метод для запуска синхронизации
async function startLyricsSync(audioPlayer, lyricsContainerSelector) {
  await loadLyricsWithTimestamps(); // Загружаем текст с таймкодами
  synchronizeLyrics(audioPlayer, lyricsContainerSelector); // Запускаем синхронизацию
}


function playSong(trackName) {
    if (!trackName) {
        console.error("trackName не указан.");
        return;
    }

    const songUrl = `http://localhost:8086/audio/${encodeURIComponent(trackName)}`;
    console.log("Воспроизведение трека:", songUrl);
    updateTrackInfo(trackName);
    updateAlbumCover(trackName);

    // Логика для двух разных методов и контейнеров
    if (trackName === "Kanye West - Flashing Lights.mp3") {
        console.log("Синхронизация текста по таймингам...");
        loadFullLyrics();
        const lyricsSyncContainer = document.querySelector(".lyrics-content p");
        if (lyricsSyncContainer) {
            lyricsSyncContainer.textContent = ""; // Очистка контейнера
            startLyricsSync(audioPlayer, ".lyrics-content p"); // Запуск синхронизации текста
        }
    } 

    // Запуск воспроизведения трека
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

// Управление отображением текста песни
document.getElementById("showLyricsBtn").addEventListener("click", function () {
  const lyricsContainer = document.getElementById("lyricsContainer");
  const button = this;
  lyricsContainer.classList.toggle("visible");
  button.classList.toggle("active");
});

// Модальное окно для текста песни
document.querySelector(".fullscreenBtn").addEventListener("click", function () {
  document.getElementById("fullscreenLyricsModal").style.display = "flex";
});

document.querySelector(".closeModalBtn").addEventListener("click", function () {
  document.getElementById("fullscreenLyricsModal").style.display = "none";
});