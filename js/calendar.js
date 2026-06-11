document.addEventListener('DOMContentLoaded', () => {
    const calendarDaysContainer = document.getElementById('calendar-days');

    if (calendarDaysContainer) {
        const totalDays = 35; // Standard 5-week block container view
        const targetEvents = {
            12: "DBMS Final Assignment",
            18: "OS Lab Viva Prep",
            25: "Hackathon Deadline"
        };

        for (let i = 1; i <= totalDays; i++) {
            const dayCard = document.createElement('div');
            dayCard.className = 'calendar-day';
            
            // Simulating a rolling view layout (Days 1 to 30)
            const displayNum = i <= 30 ? i : i - 30;
            
            const numSpan = document.createElement('span');
            numSpan.className = 'day-number';
            numSpan.textContent = displayNum;
            dayCard.appendChild(numSpan);

            // Emphasize current numerical marker date
            if (i === 11) dayCard.classList.add('current');

            // Insert matching operational deadlines
            if (targetEvents[displayNum] && i <= 30) {
                const eventBadge = document.createElement('div');
                eventBadge.className = 'calendar-event';
                eventBadge.textContent = targetEvents[displayNum];
                dayCard.appendChild(eventBadge);
            }

            calendarDaysContainer.appendChild(dayCard);
        }
    }
});