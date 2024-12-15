document.addEventListener("DOMContentLoaded", async () => {
  try {
    console.log("Script loaded!");
    const params = new URLSearchParams(window.location.search);
    let albumId = params.get("id");
    console.log(`Album ID: ${albumId}`);

    if (!albumId) {
      albumId = -1;
    }

    let albumData;

    try {
      // ЗАПРОС К БЭКЕНДУ
      const baseURL = "http://localhost:8083";

      const response = await fetch(`${baseURL}/album/${albumId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Не удалось получить данные альбома");
      }

      albumData = await response.json();
    } catch (error) {
      console.warn(
        "Ошибка получения реальных данных, используются фиктивные данные:",
        error,
      );

      // ФИКТИВНЫЕ ДАННЫЕ
      albumData = {
        title: "Бог рэпа",
        artist: "Face",
        genre: "Хип-хоп",
        year: 2024,
        cover: "https://via.placeholder.com/200",
        tracks: [
          { name: "Песня 1", duration: 154 },
          { name: "Песня 2", duration: 154 },
          { name: "Песня 3", duration: 154 },
          { name: "Песня 4", duration: 154 },
          { name: "Песня 5", duration: 154 },
          { name: "Песня 6", duration: 154 },
          { name: "Песня 7", duration: 154 },
        ],
      };
    }

    // ОТРИСОВКА ДАННЫХ ОБ АЛЬБОМЕ
    document.querySelector(".album-title").textContent = albumData.title;
    document.querySelector(".artist-name").textContent = albumData.artist;
    document.querySelector(".album-meta").textContent =
      `${albumData.genre} • ${albumData.year}`;
    document.querySelector(".album-image").src = albumData.cover;

    // ОТРИСОВКА СПИСКА ПЕСЕН
    const tracklistContainer = document.querySelector(".tracklist");
    tracklistContainer.innerHTML = ""; // Очищаем контейнер для треков

    let currentTrackIndex = 0;
    let isPlaying = false;

    const audioPlayer = document.getElementById("audioPlayer");
    const playPauseBtn = document.getElementById("playPauseBtn");
    const nextBtn = document.getElementById("nextBtn");
    const prevBtn = document.getElementById("prevBtn");

    // Функция обновления информации о текущем треке
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

    // Функция воспроизведения трека
    function playTrack(index) {
      if (!albumData.tracks[index]) {
        console.error("Трек не найден.");
        return;
      }
      const track = albumData.tracks[index];
      const trackUrl = `http://localhost:8086/audio/${encodeURIComponent(track.name)}.mp3`; // Добавляем .mp3
      console.log("Воспроизведение трека:", trackUrl);

      audioPlayer.src = trackUrl;
      audioPlayer.load();
      audioPlayer.play()
        .then(() => {
          isPlaying = true;
          playPauseBtn.innerHTML = "&#10074;&#10074;"; // Иконка Pause
          updateTrackInfo(track.name); // Обновляем информацию о текущем треке
        })
        .catch((error) => {
          console.error("Ошибка воспроизведения:", error);
        });
    }

    // Обработчики событий для кнопок
    playPauseBtn.addEventListener("click", () => {
      if (isPlaying) {
        audioPlayer.pause();
        isPlaying = false;
        playPauseBtn.innerHTML = "&#9654;"; // Иконка Play
      } else {
        audioPlayer.play()
          .then(() => {
            isPlaying = true;
            playPauseBtn.innerHTML = "&#10074;&#10074;"; // Иконка Pause
          })
          .catch((error) => {
            console.error("Ошибка воспроизведения:", error);
          });
      }
    });

    nextBtn.addEventListener("click", () => {
      currentTrackIndex = (currentTrackIndex + 1) % albumData.tracks.length; // Циклический переход
      playTrack(currentTrackIndex);
    });

    prevBtn.addEventListener("click", () => {
      currentTrackIndex =
        (currentTrackIndex - 1 + albumData.tracks.length) % albumData.tracks.length; // Циклический переход назад
      playTrack(currentTrackIndex);
    });

    // Отображение треков и добавление слушателей для клика
    albumData.tracks.forEach((track, index) => {
      const trackMinutes = Math.floor(track.duration / 60);
      const trackSeconds = track.duration % 60;
      const trackDuration = `${trackMinutes}:${trackSeconds.toString().padStart(2, "0")}`;

      const trackElement = document.createElement("div");
      trackElement.className = `track ${index % 2 === 0 ? "track-even" : "track-odd"}`;

      trackElement.innerHTML = `
        <span class="track-name">${track.name}</span>
        <span class="track-duration">${trackDuration}</span>
      `;

      // Добавляем обработчик клика для выбора трека
      trackElement.addEventListener("click", () => {
        currentTrackIndex = index;
        playTrack(index);
      });

      tracklistContainer.appendChild(trackElement);
    });

    // Воспроизведение первого трека при загрузке
    playTrack(currentTrackIndex);
  } catch (error) {
    console.error("Ошибка при загрузке данных альбома:", error);
  }
});
