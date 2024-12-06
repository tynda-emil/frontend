document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Получаем ID альбома из URL
    const params = new URLSearchParams(window.location.search);
    const albumId = params.get("id");

    if (!albumId) {
      console.error("ID альбома не передан в URL");
      return;
    }

    // Реальный запрос к бэкенду (закомментировано для теста)
    /*
        const baseURL = `http://${window.config.mainServiceIp}:${window.config.mainServicePort}`;
        const response = await fetch(`${baseURL}/albums/${albumId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Не удалось получить данные альбома");
        }

        const albumData = await response.json();
        */

    // Фиктивные данные для теста
    const albumData = {
      title: "Бог рэпа",
      artist: "Face",
      genre: "Хип-хоп",
      year: 2024,
      cover: "https://via.placeholder.com/200", // Моковая обложка альбома
      tracks: [
        { name: "Песня 1", duration: "03:54" },
        { name: "Песня 2", duration: "04:12" },
        { name: "Песня 3", duration: "02:48" },
        { name: "Песня 4", duration: "03:35" },
        { name: "Песня 5", duration: "03:01" },
      ],
    };

    // Отображение информации об альбоме
    document.querySelector(".album-title").textContent = albumData.title;
    document.querySelector(".artist-name").textContent = albumData.artist;
    document.querySelector(".album-meta").textContent =
      `${albumData.genre} • ${albumData.year}`;
    document.querySelector(".album-image").src = albumData.cover;

    // Генерация списка песен
    const tracklistContainer = document.querySelector(".tracklist");
    tracklistContainer.innerHTML = ""; // Очищаем контейнер для треков

    albumData.tracks.forEach((track, index) => {
      const trackElement = document.createElement("div");
      trackElement.className = `track ${index % 2 === 0 ? "track-even" : "track-odd"}`;

      trackElement.innerHTML = `
    <span class="track-name">${track.name}</span>
    <span class="track-duration">${track.duration}</span>
  `;

      tracklistContainer.appendChild(trackElement);
    });
  } catch (error) {
    console.error("Ошибка при загрузке данных альбома:", error);
    alert("Не удалось загрузить данные альбома. Попробуйте снова.");
  }
});
