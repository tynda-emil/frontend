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

/* ПОЛУЧЕНИЕ СПИСКА АРТИСТОВ И АЛЬБОМОВ С БЭКЕНДА
 * ЕСЛИ НЕТ ДАННЫХ, ТО ОТРИСОВЫВАЮТСЯ ФИКТИВНЫЕ ДАННЫЕ */
document.addEventListener("DOMContentLoaded", async () => {
  const baseURL = `http://${window.config.mainServiceIp}:${window.config.mainServicePort}`;
  let data;

  try {
    // ЗАПРОС К БЭКЕНДУ
    const response = await fetch(`${baseURL}/home`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Не удалось получить данные с сервера");
    }

    data = await response.json();
  } catch (error) {
    console.warn(
      "Так как произошла ошибка данных при попытке получить данные с бэкенда, то будут использованы фиктивные данные",
      error,
    );

    // ФИКТИВНЫЕ ДАННЫЕ. ОТРИСОВЫВАЮТСЯ ТОЛЬКО ПРИ ОШИБКЕ ПОЛУЧЕНИЯ ДАННЫХ С БЭКЕНДА.
    data = {
      artists: [],
      albums: [],
    };

    const numArtists = 10;
    for (let i = 0; i < numArtists; i++) {
      data.artists.push({ name: `Mock artist ${i}` });
    }

    for (let i = 0; i < numArtists; i++) {
      data.albums.push({
        id: i,
        name: `Mock album ${i}`,
        artist: `Mock artist ${i}`,
      });
    }
  }

 // ОТРИСОВКА АРТИСТОВ
const artistsContainer = document.querySelector(".artists-container");
data.artists.forEach((artist) => {
  const artistElement = document.createElement("div");
  artistElement.classList.add("artist");

  // Динамический URL для изображения артиста
  const artistImageUrl = `http://localhost:8083/img/${encodeURIComponent(artist.name)}`;

  artistElement.innerHTML = `
    <div class="artist-circle artist-circle-small">
      <img src="${artistImageUrl}" 
           alt="Изображение артиста" 
           class="artist-image" 
           width="80px" height="80px">
    </div>
    <p class="artistName">${artist.name}</p>
  `;

  // Обновление обложки с обработкой ошибки загрузки
  const artistImage = artistElement.querySelector(".artist-image");
  artistImage.onerror = () => {
    console.warn(`Ошибка загрузки изображения для артиста ${artist.name}`);
    artistImage.src = "../images/frogs.gif"; // Устанавливаем резервное изображение
  };

  artistsContainer.appendChild(artistElement);
});


  // ОТРИСОВКА АЛЬБОМОВ
const albumsContainer = document.querySelector(".albums-container");
data.albums.forEach((album) => {
  const albumElement = document.createElement("div");
  albumElement.classList.add("album");

  // Динамический URL для изображения
  const albumCoverUrl = `http://localhost:8083/img/${album.id}`;

  albumElement.innerHTML = `
    <div class="album-cover">
      <img src="${albumCoverUrl}" 
           alt="Обложка альбома" 
           class="album-image" 
           width="80px" height="80px">
    </div>
    <p class="albumName">${album.name}</p>
    <p class="artistName">${album.artist}</p>
  `;


    // СЛУШАТЕЛЬ СОБЫТИЙ ДЛЯ КАЖДОГО АЛЬБОМА НА КЛИК
    albumElement.addEventListener("click", () => {
      window.location.href = `../pages/albumPage.html?id=${album.id}`;
    });

    albumsContainer.appendChild(albumElement);
  });
});
