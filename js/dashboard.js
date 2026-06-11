document.addEventListener('DOMContentLoaded', () => {
    // 1. Live Date Initialization
    const dateDisplay = document.getElementById('current-date');
    if (dateDisplay) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateDisplay.textContent = new Date().toLocaleDateString(undefined, options);
    }

    // 2. Interactive Checkbox Tracker Logic
    const checkboxes = document.querySelectorAll('.task-preview-list input[type="checkbox"]');
    const progressBar = document.querySelector('.progress-bar');

    function updateProgress() {
        if (checkboxes.length === 0 || !progressBar) return;
        const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
        const calculatedPercentage = Math.round((checkedCount / checkboxes.length) * 100);
        
        progressBar.style.width = `${calculatedPercentage}%`;
        progressBar.textContent = `${calculatedPercentage}%`;
    }

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateProgress);
    });
});