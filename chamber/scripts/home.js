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
            console.log("Member data fetched successfully for home page:", allMembers);
            displayMemberSpotlights(allMembers);
        } else {
            console.error('Error fetching member data for home page:', response.status, response.statusText);
        }
    } catch (error) {
        console.error("Fetch API failed for member data:", error);
    }
}

async function fetchWeatherData() {
    if (WEATHER_API_KEY === 'YOUR_API_KEY') {
        console.warn("WEATHER API KEY is not set. Please replace 'YOUR_API_KEY' in home.js.");
        const weatherSection = document.getElementById('weather-section');
        if (weatherSection) weatherSection.innerHTML = "<p>Weather data currently unavailable. API key needed.</p>";
        return;
    }
    try {
        const [currentResponse, forecastResponse] = await Promise.all([
            fetch(WEATHER_CURRENT_URL),
            fetch(WEATHER_FORECAST_URL)
        ]);

        if (currentResponse.ok && forecastResponse.ok) {
            const currentData = await currentResponse.json();
            const forecastData = await response.json();
            console.log("Current weather data:", currentData);
            console.log("Forecast weather data:", forecastData);
            displayCurrentWeather(currentData);
            displayWeatherForecast(forecastData);
        } else {
            console.error('Error fetching weather data. Current OK:', currentResponse.ok, 'Forecast OK:', forecastResponse.ok);
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
        spotlightsArea.innerHTML = "<p>No qualified members available for spotlights at this time.</p>";
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

        let address = document.createElement('p');
        address.classList.add('address');
        address.textContent = member.address;

        let phone = document.createElement('p');
        phone.classList.add('phone');
        phone.textContent = member.phone;

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
    if (weatherDescEl) weatherDescEl.textContent = data.weather[0].description.replace(/\b\w/g, char => char.toUpperCase());
    if (weatherIconEl) {
        const iconCode = data.weather[0].icon;
        weatherIconEl.setAttribute('src', `https://openweathermap.org/img/wn/${iconCode}@2x.png`);
        weatherIconEl.setAttribute('alt', data.weather[0].description);
    }
}

function displayWeatherForecast(data) {
    const forecastArea = document.getElementById('weather-forecast-area');
    if (!forecastArea) {
        console.error("Forecast area '#weather-forecast-area' not found in HTML.");
        return;
    }
    forecastArea.innerHTML = '<h4>3-Day Forecast</h4>';

    const dailyForecasts = [];
    const today = new Date().getDate();
    let count = 0;

    for (let i = 0; i < data.list.length && count < 3; i++) {
        const forecastDate = new Date(data.list[i].dt * 1000);
        if (forecastDate.getDate() > today && forecastDate.getHours() >= 12 && forecastDate.getHours() < 15) {
            if (!dailyForecasts.find(df => new Date(df.dt * 1000).getDate() === forecastDate.getDate())) {
                dailyForecasts.push(data.list[i]);
                count++;
            }
        }
    }

    if (dailyForecasts.length < 3) {
        const uniqueDays = {};
        data.list.forEach(item => {
            const forecastDt = new Date(item.dt * 1000);
            if (forecastDt.getDate() > today) {
                const dayKey = forecastDt.toISOString().split('T')[0];
                if (!uniqueDays[dayKey] && Object.keys(uniqueDays).length < 3) {
                    uniqueDays[dayKey] = item;
                }
            }
        });
        if (Object.keys(uniqueDays).length > dailyForecasts.length) {
            const sorted