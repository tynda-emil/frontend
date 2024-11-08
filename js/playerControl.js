const playPauseBtn = document.getElementById('playPauseBtn');
const progressBar = document.querySelector('.progress');
const volumeControl = document.getElementById('volume'); 
let isPlaying = false;
let currentProgress = 0;

// Обработчик клика на кнопку Play/Pause
playPauseBtn.addEventListener('click', () => {
    if (isPlaying) {
        playPauseBtn.innerHTML = '&#9654;'; // Play icon
    } else {
        playPauseBtn.innerHTML = '&#10074;&#10074;'; // Pause icon
    }
    isPlaying = !isPlaying;
});

// Функция обновления прогресса
function updateProgress() {
    if (isPlaying) {
        currentProgress += 0.5; // Увеличиваем прогресс
        if (currentProgress > 100) {
            currentProgress = 0;
        }
        progressBar.style.width = currentProgress + '%';
    }
}

setInterval(updateProgress, 1000); // Обновление каждую секунду

// Обновление прогресса громкости слайдера
volumeControl.addEventListener('input', () => {
    const volumeProgress = (volumeControl.value / volumeControl.max) * 100;
    volumeControl.style.setProperty('--progress', `${volumeProgress}%`);
});
