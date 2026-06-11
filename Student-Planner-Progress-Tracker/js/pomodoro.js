document.addEventListener('DOMContentLoaded', () => {
    let countdown;
    let timeLeft = 1500; // 25 minutes default context

    const timerDisplay = document.getElementById('timer');
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');

    function displayTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainderSeconds = seconds % 60;
        if (timerDisplay) {
            timerDisplay.textContent = `${minutes}:${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`;
        }
    }

    if (startBtn) {
        startBtn.addEventListener('click', () => {
            if (countdown) {
                clearInterval(countdown);
                countdown = null;
                startBtn.textContent = 'Start';
            } else {
                startBtn.textContent = 'Pause';
                countdown = setInterval(() => {
                    timeLeft--;
                    displayTime(timeLeft);
                    if (timeLeft <= 0) {
                        clearInterval(countdown);
                        alert("Focus block complete! Time to stand up and stretch.");
                        timeLeft = 1500;
                        displayTime(timeLeft);
                        startBtn.textContent = 'Start';
                    }
                }, 1000);
            }
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            clearInterval(countdown);
            countdown = null;
            timeLeft = 1500;
            displayTime(timeLeft);
            if (startBtn) startBtn.textContent = 'Start';
        });
    }
});