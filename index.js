// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area="

// Your code here!




const stateInput = document.querySelector("#state-input");
const fetchButton = document.querySelector("#fetch-alerts");
const alertsDisplay = document.querySelector("#alerts-display");
const errorMessage = document.querySelector("#error-message");

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.remove("hidden");
}

function clearError() {
  errorMessage.textContent = "";
  errorMessage.classList.add("hidden");
}

function displayAlerts(data) {
  alertsDisplay.innerHTML = "";

  const summary = document.createElement("h2");
  summary.textContent = data.title + ": " + data.features.length;
  alertsDisplay.appendChild(summary);

  data.features.forEach(function(alert) {
    const headline = document.createElement("p");
    headline.textContent = alert.properties.headline || "No headline available";
    alertsDisplay.appendChild(headline);
  });

  clearError();
}

function fetchWeatherAlerts(state) {
  return fetch(weatherApi + state)
    .then(function(response) {
      if (!response.ok) {
        throw new Error("Unable to fetch weather alerts. Please try again.");
      }

      return response.json();
    })
    .then(function(data) {
      displayAlerts(data);
      return data;
    })
    .catch(function(error) {
      showError(error.message);
      console.log(error.message);
    });
}

fetchButton.addEventListener("click", function() {
  const state = stateInput.value.trim().toUpperCase();

  alertsDisplay.innerHTML = "";
  stateInput.value = "";

  clearError();
  fetchWeatherAlerts(state);
});