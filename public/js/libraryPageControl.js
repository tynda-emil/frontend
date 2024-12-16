document.addEventListener('DOMContentLoaded', async () => {
  const baseURL = `http://${window.config.mySongsServiceIp}:${window.config.mySongsServicePort}`;
  const token = localStorage.getItem('token'); // Получаем токен пользователя
  const tracklistContainer = document.querySelector('.tracklist');

  if (!token) {
    alert('User is not authenticated. Please log in.');
    window.location.href = '../pages/login.html';
    return;
  }

  let userTracks;

  try {
    // Запрос к бэкенду за песнями пользователя
    const response = await fetch(`${baseURL}/MySongs`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Передаем токен в заголовке
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user songs from the server.');
    }

    userTracks = await response.json(); // Получаем песни пользователя
  } catch (error) {
    console.warn(
      'Failed to fetch real data. Using mock data for testing purposes:',
      error,
    );

    // Фиктивные данные на случай ошибки
    userTracks = [
      { name: 'Mock Track 1', duration: 154 },
      { name: 'Mock Track 2', duration: 200 },
      { name: 'Mock Track 3', duration: 180 },
      { name: 'Mock Track 4', duration: 210 },
      { name: 'Mock Track 5', duration: 190 },
    ];
  }

  // Очистка контейнера перед отрисовкой
  tracklistContainer.innerHTML = '';

  // Генерация списка песен
  userTracks.forEach((track, index) => {
    const trackMinutes = Math.floor(track.duration / 60);
    const trackSeconds = track.duration % 60;
    const trackDuration = `${trackMinutes}:${trackSeconds
      .toString()
      .padStart(2, '0')}`;

    const trackElement = document.createElement('div');
    trackElement.className = `track ${index % 2 === 0 ? 'track-even' : 'track-odd'}`;

    // Контент каждой песни
    trackElement.innerHTML = `
      <span class="track-name">${track.name}</span>
      <span class="track-duration">${trackDuration}</span>
      <!-- Меню действий с треком -->
      <button class="track-options-btn" data-index="${index}">
        <i class="fa-solid fa-ellipsis-vertical"></i>
      </button>
      <div class="track-menu hidden" id="menu-${index}">
        <ul>
          <li>Add to Playlist</li>
          <li>Remove from Library</li>
        </ul>
      </div>
    `;

    // Добавляем слушатель для кнопки с тремя точками
    const optionsButton = trackElement.querySelector('.track-options-btn');
    const trackMenu = trackElement.querySelector(`#menu-${index}`);

    optionsButton.addEventListener('click', (event) => {
      event.stopPropagation();
      trackMenu.classList.toggle('hidden');
    });

    // Скрываем меню при клике за пределами
    document.addEventListener('click', (e) => {
      if (!trackMenu.contains(e.target) && e.target !== optionsButton) {
        trackMenu.classList.add('hidden');
      }
    });

    // Добавляем песню в контейнер
    tracklistContainer.appendChild(trackElement);
  });
});
