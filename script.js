document.addEventListener('DOMContentLoaded', () => {
    const inputField = document.getElementById('inputField');
    const validateBtn = document.getElementById('validateBtn');
    const resultsSection = document.getElementById('resultsSection');
    const qrScanner = document.getElementById('qr-scanner');
    var apiToken = '';

    validateBtn.addEventListener('click', () => {
        apiToken = inputField.value.trim();

        if (apiToken !== '') {
            resultsSection.innerHTML = '';
            getClientRegistration(apiToken);
        } else {
            alert('Please enter some text before validating.');
        }
    });

    let config = {
        fps: 10,
        qrbox: {width: 100, height: 100},
        rememberLastUsedCamera: true
    };

    var html5QrScanner;

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
                    displayRegistrations(registration.custom_unique_id)
                })
                displayRegistrations('android-player-francoism')
            }

        } catch (error) {
            console.error('Fetch error:', error);
            displayError(`Invalid API token`);
        }
    }

    var clickedPlayerId = '';

    function displayRegistrations(customUniqueId)
    {
        const newButton = document.createElement('button');
        newButton.className = 'registrations-button';
        newButton.textContent = `${customUniqueId}`;
        newButton.id = `${customUniqueId}`

        newButton.addEventListener('click', event => {
            clickedPlayerId = event.target.id;
            const registrationElement = document.getElementById(clickedPlayerId);

            let html5QrScanner = new Html5QrcodeScanner(
                "qr-reader", config, /* verbose= */ true);
            html5QrScanner.render(onScanSuccess);
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

    async function onScanSuccess(decodedText, decodedResult) {
        // handle the scanned code as you like, for example:
        console.log(`Code matched = ${decodedText}`, decodedResult);

        let playerUrl = decodedText;

        try {
            const httpCall = fetch(`http://${playerUrl}`,
                {
                    method: 'post',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({api_token: `${apiToken}`, player_id: `${clickedPlayerId}`, hostname: "https://control-qa.broadsign.net" })
                });
            const response = await httpCall;
        } catch(error) {
                console.log(error)
        }

        // html5QrScanner.clear()
    }
});