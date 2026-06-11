document.addEventListener('DOMContentLoaded', () => {
    const addTaskBtn = document.getElementById('add-task-btn');
    const todoColumn = document.querySelector('.task-board .task-column:first-child');

    if (addTaskBtn && todoColumn) {
        addTaskBtn.addEventListener('click', () => {
            const taskText = prompt("Enter assignment or task title:");
            if (!taskText || taskText.trim() === "") return;

            // Create wrapper element
            const taskCard = document.createElement('div');
            taskCard.className = 'task-card';
            taskCard.textContent = taskText;

            // Generate Badge
            const badge = document.createElement('span');
            badge.className = 'badge high';
            badge.textContent = 'High';
            
            taskCard.appendChild(badge);
            todoColumn.appendChild(taskCard);

            // Add simple toggle completion behavior
            taskCard.addEventListener('click', () => {
                taskCard.classList.toggle('completed');
            });
        });
    }

    // Setup initial static items to toggle complete states
    document.querySelectorAll('.task-card').forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('completed');
        });
    });
});