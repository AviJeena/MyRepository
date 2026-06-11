document.addEventListener('DOMContentLoaded', () => {
    const saveSettingsBtn = document.querySelector('.settings-card button');
    
    if (saveSettingsBtn) {
        saveSettingsBtn.addEventListener('click', () => {
            alert("Application configuration preferences saved successfully!");
        });
    }

    // Dynamic Toggle Interaction handling
    const toggleInputs = document.querySelectorAll('.settings-option input[type="checkbox"]');
    toggleInputs.forEach(toggle => {
        toggle.addEventListener('change', (e) => {
            const settingName = e.target.closest('.settings-option').querySelector('span').textContent;
            console.log(`${settingName} status updated to: ${e.target.checked}`);
        });
    });
});