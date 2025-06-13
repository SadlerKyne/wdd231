import { getLikedItems } from './utils.js';

const likedCountSpan = document.getElementById('liked-count');
const ordersContainer = document.getElementById('sales-orders-item')?.querySelector('p');
const projectsContainer = document.getElementById('projects-item')?.querySelector('p');
const accountDataUrl = 'data/account-data.json';

const updateLikedCount = () => {
    if (likedCountSpan) {
        const likedItems = getLikedItems();
        likedCountSpan.textContent = likedItems.length;
    }
};

const displayOrders = (orders) => {
    if (!ordersContainer || orders.length === 0) return;
    ordersContainer.innerHTML = orders.map(order => 
        `<span>ID: ${order.orderId} | Status: ${order.status}</span>`
    ).join('<br>');
};

const displayProjects = (projects) => {
    if (!projectsContainer || projects.length === 0) return;
    projectsContainer.innerHTML = projects.map(project =>
        `<span>ID: ${project.projectId} | Status: ${project.status}</span>`
    ).join('<br>');
};

async function fetchAccountData() {
    try {
        const response = await fetch(accountDataUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        displayOrders(data.orders);
        displayProjects(data.projects);
    } catch (error) {
        console.error('Could not fetch account data:', error);
        if (ordersContainer) ordersContainer.textContent = 'Could not load order data.';
        if (projectsContainer) projectsContainer.textContent = 'Could not load project data.';
    }
}

updateLikedCount();
fetchAccountData();