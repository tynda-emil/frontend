const playPauseBtn = document.getElementById('playPauseBtn');
    const progressBar = document.querySelector('.progress');
    const volumeControl = document.getElementById('volume');
    const volumeValue = document.getElementById('volume-value');
    let isPlaying = false;
    let currentProgress = 0;

    playPauseBtn.addEventListener('click', () => {
        if (isPlaying) {
            playPauseBtn.innerHTML = '&#9654;'; // Play icon
        } else {
            playPauseBtn.innerHTML = '&#10074;&#10074;'; // Pause icon
        }
        isPlaying = !isPlaying;
    });

    volumeControl.addEventListener('input', () => {
        volumeValue.textContent = volumeControl.value;
    });

    function updateProgress() {
        if (isPlaying) {
            currentProgress += 0.5;
            if (currentProgress > 100) {
                currentProgress = 0;
            }
            progressBar.style.width = currentProgress + '%';
        }
    }

    setInterval(updateProgress, 1000);// JavaScript Document

 volumeControl.style.setProperty('--progress', `${(volumeControl.value / volumeControl.max) * 100}%`);

        volumeControl.addEventListener('input', () => {
            // Update the progress color dynamically as the slider is moved
            volumeControl.style.setProperty('--progress', `${(volumeControl.value / volumeControl.max) * 100}%`);
        });