document.addEventListener('DOMContentLoaded', () => {
    const inputField = document.getElementById('inputField');
    const validateBtn = document.getElementById('validateBtn');
    const resultsSection = document.getElementById('resultsSection');

    validateBtn.addEventListener('click', () => {
        const inputValue = inputField.value.trim();

        if (inputValue !== '') {
            validateInput(inputValue);
            inputField.value = '';
        } else {
            alert('Please enter some text before validating.');
        }
    });

    function validateInput(value) {
        const newButton = document.createElement('button');
        newButton.className = 'result-button';
        newButton.textContent = `Result: ${value}`;

        newButton.addEventListener('click', () => {
            alert(`You clicked: "${value}"`);
        });

        resultsSection.appendChild(newButton);
    }
});