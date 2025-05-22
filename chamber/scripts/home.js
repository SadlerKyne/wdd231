const membersDataURL = 'scripts/members.json';
let allMembers = [];

const WEATHER_API_KEY = '544d56eedf0a1fb0358b0abb68e8d498';
const LATITUDE = 38.5733;
const LONGITUDE = -109.5498;
const WEATHER_CURRENT_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${LATITUDE}&lon=${LONGITUDE}&appid=${WEATHER_API_KEY}&units=imperial`;
const WEATHER_FORECAST_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${LATITUDE}&lon=${LONGITUDE}&appid=${WEATHER_API_KEY}&units=imperial`;

async function getMemberData() {
    try {
        const response = await fetch(membersDataURL);
        if (response.ok) {
            allMembers = await response.json();
            displayMemberSpotlights(allMembers);
        } else {
            console.error('Error fetching member data for home page:', response.status, response.statusText);
        }
    } catch (error) {
        console.error("Fetch API failed for member data:", error);
    }
}

async function fetchWeatherData() {
    if (WEATHER_API_KEY === 'YOUR_API_KEY' || WEATHER_API_KEY === '' || WEATHER_API_KEY.length < 30) {
        console.warn("WEATHER API KEY is not set or is invalid. Please check home.js.");
        const weatherSection = document.getElementById('weather-section');
        if (weatherSection) weatherSection.innerHTML = "<p>Weather data currently unavailable.</p>";
        return;
    }
    try {
        const [currentResponse, forecastResponse] = await Promise.all([
            fetch(WEATHER_CURRENT_URL),
            fetch(WEATHER_FORECAST_URL)
        ]);

        if (currentResponse.ok && forecastResponse.ok) {
            const currentData = await currentResponse.json();
            const forecastData = await forecastResponse.json();
            displayCurrentWeather(currentData);
            displayWeatherForecast(forecastData);
        } else {
            if (!currentResponse.ok) console.error('Error fetching current weather data:', currentResponse.status, currentResponse.statusText);
            if (!forecastResponse.ok) console.error('Error fetching forecast weather data:', forecastResponse.status, forecastResponse.statusText);
        }
    } catch (error) {
        console.error("Fetch API failed for weather data:", error);
    }
}

function displayMemberSpotlights(members) {
    const spotlightsArea = document.getElementById('member-spotlights-area');
    if (!spotlightsArea) {
        console.error("Spotlight area '#member-spotlights-area' not found in HTML.");
        return;
    }
    spotlightsArea.innerHTML = '';

    const qualifiedMembers = members.filter(member => member.membershipLevel === 3 || member.membershipLevel === 2);

    if (qualifiedMembers.length === 0) {
        spotlightsArea.innerHTML = "<p>No qualified members available for spotlights.</p>";
        return;
    }

    const shuffledMembers = qualifiedMembers.sort(() => 0.5 - Math.random());
    const numSpotlights = Math.min(shuffledMembers.length, 3);
    const selectedMembers = shuffledMembers.slice(0, numSpotlights);

    selectedMembers.forEach(member => {
        let card = document.createElement('section');
        card.classList.add('spotlight-member-card');

        let img = document.createElement('img');
        img.setAttribute('src', 'images/' + member.imageFileName);
        img.setAttribute('alt', `Logo of ${member.name}`);
        img.setAttribute('loading', 'lazy');
        img.setAttribute('width', '100');
        img.setAttribute('height', 'auto');

        let h3 = document.createElement('h3');
        h3.textContent = member.name;

        let website = document.createElement('p');
        website.classList.add('website');
        let websiteLink = document.createElement('a');
        websiteLink.setAttribute('href', member.websiteURL);
        websiteLink.setAttribute('target', '_blank');
        websiteLink.textContent = member.websiteURL.replace(/^https?:\/\//, '').replace(/\/$/, '');
        website.appendChild(websiteLink);

        let membershipPara = document.createElement('p');
        membershipPara.classList.add('membership-level-spotlight');
        membershipPara.textContent = member.membershipLevel === 3 ? 'Gold Member' : 'Silver Member';

        card.appendChild(img);
        card.appendChild(h3);
        card.appendChild(website);
        card.appendChild(membershipPara);

        spotlightsArea.appendChild(card);
    });
}

function displayCurrentWeather(data) {
    const currentTempEl = document.getElementById('current-temp');
    const weatherDescEl = document.getElementById('weather-description');
    const weatherIconEl = document.getElementById('weather-icon');

    if (currentTempEl) currentTempEl.textContent = `${Math.round(data.main.temp)}°F`;
    if (weatherDescEl && data.weather && data.weather[0]) {
        weatherDescEl.textContent = data.weather[0].description.replace(/\b\w/g, char => char.toUpperCase());
    } else if (weatherDescEl) {
        weatherDescEl.textContent = 'N/A';
    }

    if (weatherIconEl && data.weather && data.weather[0]) {
        const iconCode = data.weather[0].icon;
        weatherIconEl.setAttribute('src', `https://openweathermap.org/img/wn/${iconCode}@2x.png`);
        weatherIconEl.setAttribute('alt', data.weather[0].description);
        weatherIconEl.style.display = 'inline';
    } else if (weatherIconEl) {
        weatherIconEl.style.display = 'none';
    }
}

function displayWeatherForecast(data) {
    const forecastArea = document.getElementById('weather-forecast-area');
    if (!forecastArea) {
        console.error("Forecast area '#weather-forecast-area' not found in HTML.");
        return;
    }
    forecastArea.innerHTML = '<h3>3-Day Forecast</h3>';

    const dailyForecasts = [];
    const today = new Date().setHours(0,0,0,0);

    if (data && data.list) {
        const uniqueDaysData = {};
        for (const item of data.list) {
            const forecastDate = new Date(item.dt * 1000);
            const forecastDayStart = new Date(forecastDate).setHours(0,0,0,0);

            if (forecastDayStart > today) {
                const dayKey = forecastDate.toISOString().split('T')[0];
                if (!uniqueDaysData[dayKey]) {
                     uniqueDaysData[dayKey] = {
                        temps: [],
                        icons: [],
                        descriptions: [],
                        dt: item.dt // Store dt for sorting, will use the first one for the day
                    };
                }
                uniqueDaysData[dayKey].temps.push(item.main.temp);
                if (forecastDate.getHours() >= 12 && forecastDate.getHours() <= 14 && uniqueDaysData[dayKey].icons.length === 0) { // Prioritize noonish icon
                    uniqueDaysData[dayKey].icons.push(item.weather[0].icon);
                    uniqueDaysData[dayKey].descriptions.push(item.weather[0].description);
                } else if (uniqueDaysData[dayKey].icons.length === 0) { // Fallback to first available icon
                     uniqueDaysData[dayKey].icons.push(item.weather[0].icon);
                     uniqueDaysData[dayKey].descriptions.push(item.weather[0].description);
                }
            }
        }
        
        const sortedDayKeys = Object.keys(uniqueDaysData).sort((a,b) => new Date(a) - new Date(b));

        for (let i = 0; i < Math.min(3, sortedDayKeys.length); i++) {
            const dayKey = sortedDayKeys[i];
            const dayData = uniqueDaysData[dayKey];
            const date = new Date(dayData.dt * 1000);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            
            const avgTemp = dayData.temps.reduce((acc, temp) => acc + temp, 0) / dayData.temps.length;
            const displayTemp = Math.round(avgTemp);
            
            const iconCode = dayData.icons[0] || '01d'; 
            const desc = dayData.descriptions[0] ? dayData.descriptions[0].replace(/\b\w/g, char => char.toUpperCase()) : 'Weather';

            dailyForecasts.push({ dayName, temp: displayTemp, iconCode, desc });
        }
    }


    if (dailyForecasts.length > 0) {
        dailyForecasts.forEach(forecast => {
            const dayDiv = document.createElement('div');
            dayDiv.classList.add('forecast-day');
            dayDiv.innerHTML = `
                <p class="forecast-dayname">${forecast.dayName}</p>
                <img src="https://openweathermap.org/img/wn/${forecast.iconCode}.png" alt="${forecast.desc}" loading="lazy">
                <p class="forecast-temp">${forecast.temp}°F</p>
            `;
            forecastArea.appendChild(dayDiv);
        });
    } else {
        forecastArea.innerHTML += '<p>No forecast data available for upcoming days.</p>';
    }
}

getMemberData();
fetchWeatherData();