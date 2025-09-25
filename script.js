document.addEventListener('DOMContentLoaded', () => {
    const inputField = document.getElementById('inputField');
    const validateBtn = document.getElementById('validateBtn');
    const resultsSection = document.getElementById('resultsSection');

    validateBtn.addEventListener('click', () => {
        const inputValue = inputField.value.trim();

        if (inputValue !== '') {
            resultsSection.innerHTML = '';
            getClientRegistration(inputValue);
        } else {
            alert('Please enter some text before validating.');
        }
    });

    async function getClientRegistration(restApiKey) {
        let url = "http://dev.broadsign.com/rest/client_registration/v7/";
        try {
            const httpCall = fetch(url, {
                mode: 'cors',
                headers: {
                    'Authorization': `Bearer ${restApiKey}`,
                }
            })
            
            // Wait for the response from the server.
            const response = await httpCall;

            if (!response.ok) {
                displayError("Invalid REST API key provided.");
                return;
            }

            // Parse the JSON data from the response.
            const data = await response.json();
            
            if (data && data.client_registration && Array.isArray(data.client_registration))
            {
                const client_registration = data.client_registration.filter(registration => 
                    { return registration.active && registration.custom_unique_id; });

                client_registration.forEach(registration => {
                    displayRegistrations(registration)
                })
            }

        } catch (error) {
            console.error('Fetch error:', error);
            displayError(`Invalid API token`);
        }
    }

    function displayRegistrations(activeRegistration)
    {
        const newButton = document.createElement('button');
        newButton.className = 'registrations-button';
        newButton.textContent = `${activeRegistration.custom_unique_id}`;

        newButton.addEventListener('click', () => {
            alert(`You clicked: "${activeRegistration.custom_unique_id}"`);
        });

        resultsSection.appendChild(newButton);
    }

    function displayError(errorMessage)
    {
        let newElement;
        newElement = document.createElement('div');
        newElement.className = 'result-text error-message';
        newElement.textContent = errorMessage;

        resultsSection.appendChild(newElement)
    }
});