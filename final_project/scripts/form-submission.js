document.addEventListener('DOMContentLoaded', () => {
    const displayArea = document.getElementById('formDataDisplay');
    const urlParams = new URLSearchParams(window.location.search);

    if (displayArea && urlParams.toString() !== '') {
        let output = '<h2>Submitted Data:</h2><ul>';
        for (const [key, value] of urlParams.entries()) {
            const displayedValue = key === 'password' ? '********' : value;
            output += `<li><strong>${key}:</strong> ${displayedValue}</li>`;
        }
        output += '</ul>';
        displayArea.innerHTML = output;
    } else if (displayArea) {
        displayArea.innerHTML = '<p>No form data was submitted.</p>';
    }
});