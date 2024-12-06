/* CONTROL FOR ARTISTS AND ALBUMS CAROUSEL */
document.addEventListener("DOMContentLoaded", () => {
  // Функция для настройки карусели
  function setupCarousel(
    wrapperSelector,
    itemSelector,
    leftBtnSelector,
    rightBtnSelector,
  ) {
    const carousel = document.querySelector(wrapperSelector);
    const leftButton = document.querySelector(leftBtnSelector);
    const rightButton = document.querySelector(rightBtnSelector);

    if (!carousel || !leftButton || !rightButton) return;

    // Определяем ширину прокрутки одного элемента
    const scrollAmount =
      carousel.querySelector(itemSelector)?.offsetWidth + 15 || 200;

    // Прокрутка влево
    leftButton.addEventListener("click", () => {
      carousel.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    });

    // Прокрутка вправо
    rightButton.addEventListener("click", () => {
      carousel.scrollBy({ left: scrollAmount, behavior: "smooth" });
    });
  }

  // Настраиваем карусели для артистов и альбомов
  setupCarousel(".artists-container", ".artist", "#left-btn", "#right-btn");
  setupCarousel(
    ".albums-container",
    ".album",
    "#albums-left-btn",
    "#albums-right-btn",
  );
});

/* ПОЛУЧЕНИЕ СПИСКА АРТИСТОВ И АЛЬБОМОВ С БЭКЕНДА */
document.addEventListener("DOMContentLoaded", async () => {
  const baseURL = `http://${window.config.mainServiceIp}:${window.config.mainServicePort}`;

  try {
    const response = await fetch(`${baseURL}/home`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      alert("Failed to load data from server.");
      console.error("Error fetching data:", response.statusText);
      return;
    }

    // Получаем JSON с данными
    const data = await response.json();

    // Фиктивные данные
    // const data = {
    //   artists: [
    //     { name: "Mock Artist 1" },
    //     { name: "Mock Artist 2" },
    //     { name: "Mock Artist 1" },
    //     { name: "Mock Artist 2" },
    //     { name: "Mock Artist 1" },
    //     { name: "Mock Artist 2" },
    //     { name: "Mock Artist 1" },
    //     { name: "Mock Artist 2" },
    //   ],
    //   albums: [
    //     { name: "Mock Album 1", artist: "Mock Artist 1" },
    //     { name: "Mock Album 2", artist: "Mock Artist 2" },
    //     { name: "Mock Album 1", artist: "Mock Artist 1" },
    //     { name: "Mock Album 2", artist: "Mock Artist 2" },
    //     { name: "Mock Album 1", artist: "Mock Artist 1" },
    //     { name: "Mock Album 2", artist: "Mock Artist 2" },
    //     { name: "Mock Album 1", artist: "Mock Artist 1" },
    //     { name: "Mock Album 2", artist: "Mock Artist 2" },
    //   ],
    // };

    // Рендерим артистов
    const artistsContainer = document.querySelector(".artists-container");
    data.artists.forEach((artist) => {
      const artistElement = document.createElement("div");
      artistElement.classList.add("artist");
      artistElement.innerHTML = `
        <div class="artist-circle artist-circle-small"></div>
        <p class="artistName">${artist.name}</p>
      `;
      artistsContainer.appendChild(artistElement);
    });

    // Рендерим альбомы
    const albumsContainer = document.querySelector(".albums-container");
    data.albums.forEach((album) => {
      const albumElement = document.createElement("div");
      albumElement.classList.add("album");
      albumElement.innerHTML = `
        <div class="album-cover"></div>
        <p class="albumName">${album.name}</p>
        <p class="artistName">${album.artist}</p>
      `;
      albumsContainer.appendChild(albumElement);
    });
  } catch (error) {
    console.error("Error loading data:", error);
    alert("Something went wrong while loading data. Please try again later.");
  }
});
