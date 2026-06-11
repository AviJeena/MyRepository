document.addEventListener('DOMContentLoaded', () => {
    const titleInput = document.querySelector('.note-title-input');
    const textarea = document.querySelector('.note-textarea');
    const notesListItems = document.querySelectorAll('.notes-list li');

    // Mock document structural dictionary data store
    const notesData = {
        "System Design Patterns": "Explore architectural blueprints like Microservices, MVC, and Pub-Sub messaging brokers.",
        "Compiler Design Formulae": "LL(1) parsing rules, First and Follow sets calculation steps, and AST conversions."
    };

    // Initialize content canvas based on current active list node
    if (textarea && titleInput) {
        textarea.value = notesData[titleInput.value] || "";
    }

    notesListItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove previous active flags
            document.querySelector('.notes-list li.active')?.classList.remove('active');
            item.classList.add('active');

            // Swap values
            const targetTitle = item.textContent.trim();
            if (titleInput && textarea) {
                titleInput.value = targetTitle;
                textarea.value = notesData[targetTitle] || "";
            }
        });
    });

    // Auto-update internal dict cache state when modification happens
    textarea?.addEventListener('input', () => {
        if (titleInput) notesData[titleInput.value] = textarea.value;
    });
});