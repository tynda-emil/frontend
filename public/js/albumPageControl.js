/* ЗАПРОС К БЭКЕНДУ ЗА ДАННЫМИ ОБ АЛЬБОМЕ, ИСПОЛЬЗУЯ ID АЛЬБОМА, ПЕРЕДАННОГО ИЗ URL
 * ЕСЛИ НЕТ РЕАЛЬНЫХ ДАННЫХ, ТО ОТРИСОВЫВАЮТСЯ ФИКТИВНЫЕ */
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // ID АЛЬБОМА ПЕРЕДАЕТСЯ ЧЕРЕЗ URL
    const params = new URLSearchParams(window.location.search);
    let albumId = params.get('id');

    if (!albumId) {
      albumId = -1;
    }
    let albumData;

    try {
      // ЗАПРОС К БЭКЕНДУ
      const baseURL = `http://${window.config.albumServiceIp}:${window.config.albumServicePort}`;
      const response = await fetch(`${baseURL}/albums/${albumId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Не удалось получить данные альбома');
      }

      albumData = await response.json();
    } catch (error) {
      console.warn(
        'Ошибка получения реальных данных, используется фиктивные данные:',
        error,
      );

      // ФИКТИВНЫЕ ДАННЫЕ. ОТРИСОВЫВАЮТСЯ ТОЛЬКО ПРИ ОШИБКЕ ПОЛУЧЕНИЯ ДАННЫХ С БЭКЕНДА.
      albumData = {
        title: 'Бог рэпа',
        artist: 'Face',
        genre: 'Хип-хоп',
        year: 2024,
        cover: 'https://via.placeholder.com/200',
        tracks: [
          { name: 'Песня 1', duration: 154 },
          { name: 'Песня 2', duration: 154 },
          { name: 'Песня 3', duration: 154 },
          { name: 'Песня 4', duration: 154 },
          { name: 'Песня 5', duration: 154 },
          { name: 'Песня 6', duration: 154 },
          { name: 'Песня 7', duration: 154 },
        ],
      };
    }
    //console.log(albumData);

    // ОТРИСОВКА ДАННЫХ ОБ АЛЬБОМЕ
    document.querySelector('.album-title').textContent = albumData.title;
    document.querySelector('.artist-name').textContent = albumData.artist;
    document.querySelector('.album-meta').textContent =
      `${albumData.genre} • ${albumData.year}`;
    document.querySelector('.album-image').src = albumData.cover;

    // ОТРИСОВКА СПИСКА ПЕСЕН
    const tracklistContainer = document.querySelector('.tracklist');
    tracklistContainer.innerHTML = ''; // Очищаем контейнер для треков

    albumData.tracks.forEach((track, index) => {
      const trackMinutes = Math.floor(track.duration / 60);
      const trackSeconds = track.duration % 60;
      const trackDuration = `${trackMinutes}:${trackSeconds.toString().padStart(2, '0')}`;

      const trackElement = document.createElement('div');
      trackElement.className = `track ${index % 2 === 0 ? 'track-even' : 'track-odd'}`;

      trackElement.innerHTML = `
    <span class="track-name">${track.name}</span>
    <span class="track-duration">${trackDuration}</span>
    <!-- МЕНЮ ДЛЯ ДЕЙСТВИЙ С ПЕСНЕЙ -->
    <button class="track-options-btn" data-index="${index}">
      <i class="fa-solid fa-ellipsis-vertical"></i>
    </button>
    <div class="track-menu hidden" id="menu-${index}">
      <ul>
        <li>Add to Library</li>
      </ul>
    </div>
  `;

      tracklistContainer.appendChild(trackElement);
    });

    // Делегирование событий для кнопок с опциями
    document.querySelector('.tracklist').addEventListener('click', (event) => {
      // Проверяем, что нажата кнопка с тремя точками
      if (event.target.closest('.track-options-btn')) {
        const btn = event.target.closest('.track-options-btn');
        const menu = document.getElementById(`menu-${btn.dataset.index}`);

        // Закрываем все открытые меню
        document.querySelectorAll('.track-menu').forEach((m) => {
          if (m !== menu) m.classList.add('hidden');
        });

        // Переключаем видимость текущего меню
        menu.classList.toggle('hidden');
      }
    });

    // Закрытие меню при клике вне его
    document.addEventListener('click', (event) => {
      if (
        !event.target.closest('.track-options-btn') &&
        !event.target.closest('.track-menu')
      ) {
        document.querySelectorAll('.track-menu').forEach((menu) => {
          menu.classList.add('hidden');
        });
      }
    });
  } catch (error) {
    console.error('Ошибка при загрузке данных альбома:', error);
  }
});
