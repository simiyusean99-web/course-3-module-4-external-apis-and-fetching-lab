document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form') || document.querySelector('#weather-form');
  const input = document.querySelector('input') || document.querySelector('#state-input');
  const alertsDisplay = document.querySelector('#alerts-display');
  const errorMessage = document.querySelector('#error-message');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const state = input.value.trim();
    if (!state) return;

    // Reset error display prior to fetching
    if (errorMessage) {
      errorMessage.classList.add('hidden');
      errorMessage.textContent = '';
    }

    try {
      // 1. Fetch weather alerts using the state code input
      const response = await fetch(`https://api.weather.gov/alerts/active?area=${state}`);

      if (!response.ok) {
        throw new Error('Network failure');
      }

      const data = await response.json();

      // Clear input after fetching
      input.value = '';

      // 2. Render fetched alerts in the DOM
      displayAlerts(data);
    } catch (error) {
      // Display error message when fetch fails
      if (errorMessage) {
        errorMessage.classList.remove('hidden');
        errorMessage.textContent = error.message || 'Network failure';
      }
    }
  });

  function displayAlerts(data) {
    if (!alertsDisplay) return;

    alertsDisplay.innerHTML = '';

    const features = data.features || [];
    
    // Header indicating total count
    const countHeading = document.createElement('h3');
    countHeading.textContent = `Weather Alerts: ${features.length}`;
    alertsDisplay.appendChild(countHeading);

    // Render list of alerts
    const ul = document.createElement('ul');
    features.forEach(feature => {
      const li = document.createElement('li');
      // Takes event title or headline from NWS API response
      li.textContent = feature.properties?.event || feature.properties?.headline || '';
      ul.appendChild(li);
    });

    alertsDisplay.appendChild(ul);
  }
});