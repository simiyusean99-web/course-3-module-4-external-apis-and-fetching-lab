// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area="

// Wait for the DOM to load before adding event listeners
document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("#weather-form"); // Replace with your actual form or button ID if different
    const inputField = document.querySelector("#state-input"); // Replace with your actual input ID
    const errorContainer = document.querySelector("#error-message");
    const alertContainer = document.querySelector("#alert-container");

    // Event listener for form submission or button click
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const state = inputField.value.trim().toUpperCase();
            
            // Step 3: Clear and Reset the UI before fetching new data
            if (errorContainer) errorContainer.textContent = "";
            if (alertContainer) alertContainer.innerHTML = "";
            
            if (state) {
                fetchWeatherAlerts(state);
            } else {
                displayError("Please enter a valid state abbreviation.");
            }
        });
    }
});

// Step 1: Fetch Alerts for a State from the API
function fetchWeatherAlerts(state) {
    const url = `https://api.weather.gov/alerts/active/area/${state}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch weather alerts. Please check the input or network response.");
            }
            return response.json();
        })
        .then(data => {
            console.log(data); // Console log for testing
            displayAlerts(data);
        })
        .catch(error => {
            // Step 4: Implement Error Handling
            displayError(error.message);
        });
}

// Step 2: Display the Alerts on the Page
function displayAlerts(data) {
    const alertContainer = document.querySelector("#alert-container");
    if (!alertContainer) return;

    // Clear previous data
    alertContainer.innerHTML = "";

    // 1. Summary message (title and number of alerts)
    const summaryHeading = document.createElement("h2");
    summaryHeading.textContent = `${data.title} - Total Alerts: ${data.features.length}`;
    alertContainer.appendChild(summaryHeading);

    // 2. List of alert headlines
    const ul = document.createElement("ul");
    data.features.forEach(alert => {
        const li = document.createElement("li");
        li.textContent = alert.properties.headline;
        ul.appendChild(li);
    });
    alertContainer.appendChild(ul);
}

// Step 4 Helper: Display Error Message in div#error-message
function displayError(message) {
    const errorContainer = document.querySelector("#error-message");
    if (errorContainer) {
        errorContainer.textContent = message;
    }
}