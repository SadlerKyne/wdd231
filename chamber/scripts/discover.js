// scripts/discover.js

const discoverItemsURL = 'data/discover-items.json';

async function getDiscoverItems() {
    try {
        const response = await fetch(discoverItemsURL);
        if (response.ok) {
            const data = await response.json();
            displayAttractionCards(data);
            createAttractionGlossary(data);
        } else {
            console.error('Error fetching discover items data:', response.status, response.statusText);
        }
    } catch (error) {
        console.error("Fetch API failed for discover items:", error);
    }
}

function displayAttractionCards(items) {
    const container = document.getElementById('attraction-cards-container');
    container.innerHTML = '';

    items.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('attraction-card');
        const cardId = item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-*|-*$/g, '');
        card.id = cardId;

        const h2 = document.createElement('h2');
        h2.textContent = item.name;

        const figure = document.createElement('figure');
        const img = document.createElement('img');
        img.setAttribute('src', `images/${item.imageFileName}`);
        img.setAttribute('alt', item.name);
        img.setAttribute('loading', 'lazy');
        img.setAttribute('width', '300');
        img.setAttribute('height', '200');
        figure.appendChild(img);

        const address = document.createElement('address');
        address.textContent = item.address;

        const description = document.createElement('p');
        description.textContent = item.description;

        const learnMoreBtn = document.createElement('button');
        learnMoreBtn.textContent = 'Learn More';
        learnMoreBtn.addEventListener('click', () => {
            card.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });


        card.appendChild(h2);
        card.appendChild(figure);
        card.appendChild(address);
        card.appendChild(description);
        card.appendChild(learnMoreBtn);

        container.appendChild(card);
    });
}

function createAttractionGlossary(items) {
    const glossaryList = document.getElementById('attraction-glossary-list');
    glossaryList.innerHTML = '';

    items.forEach(item => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        const cardId = item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-*|-*$/g, '');

        a.href = `#${cardId}`;
        a.textContent = item.name;

        a.addEventListener('click', (event) => {
            event.preventDefault();
            const targetElement = document.getElementById(cardId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });

        li.appendChild(a);
        glossaryList.appendChild(li);
    });
}

function displayLastVisitMessage() {
    const messageContainer = document.getElementById('visitor-message');
    const lastVisit = localStorage.getItem('lastVisit');
    const currentTime = Date.now();
    const msToDays = 86400000;

    if (!lastVisit) {
        messageContainer.textContent = "Welcome! Let us know if you have any questions.";
    } else {
        const daysBetweenVisits = (currentTime - lastVisit) / msToDays;

        if (daysBetweenVisits < 1) {
            messageContainer.textContent = "Back so soon! Awesome!";
        } else {
            const days = Math.round(daysBetweenVisits);
            if (days === 1) {
                messageContainer.textContent = `You last visited 1 day ago.`;
            } else {
                messageContainer.textContent = `You last visited ${days} days ago.`;
            }
        }
    }
    localStorage.setItem('lastVisit', currentTime);
}

document.addEventListener('DOMContentLoaded', () => {
    getDiscoverItems();
    displayLastVisitMessage();
});