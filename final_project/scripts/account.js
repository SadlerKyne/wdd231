import { getLikedItems } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {

    const likedCountSpan = document.getElementById('liked-count');
    const dashboardGrid = document.querySelector('.dashboard-grid');
    const accountDataUrl = 'data/account-data.json';

    let dashboardItemsData = [
        { id: 'sales-orders-item', title: 'Sales Orders', content: 'Loading orders...', isDynamic: true },
        { id: 'invoices-item', title: 'Your Invoices', content: 'Follow, download, or pay your invoices.' },
        { id: 'payment-item', title: 'Payment methods', content: 'Manage your payment methods.' },
        { id: 'projects-item', title: 'Projects', content: 'See project status and details.', isDynamic: true },
        { id: 'tasks-item', title: 'Tasks', content: 'Follow and comment on tasks for your projects.' },
        { id: 'timesheets-item', title: 'Timesheets', content: 'Review all timesheets related to your projects.' },
        { id: 'tickets-item', title: 'Tickets', content: 'Follow all your helpdesk tickets.' },
        { id: 'rfq-item', title: 'Requests for Quotation', content: 'Follow your Requests for Quotation.' },
        { id: 'our-orders-item', title: 'Our Orders', content: 'Follow orders you have to fulfill.' },
        { id: 'addresses-item', title: 'Addresses', content: 'Add, remove or modify your addresses.' },
        { id: 'security-item', title: 'Connection & Security', content: 'Configure your connection parameters.' },
        { id: 'knowledge-item', title: 'Knowledge', content: 'Find all articles shared with you.' }
    ];

    const renderDashboard = () => {
        if (!dashboardGrid) return;
        dashboardGrid.innerHTML = '';

        dashboardItemsData.forEach(itemData => {
            const cardWrapper = document.createElement('a');
            cardWrapper.href = '#';
            cardWrapper.className = 'dashboard-item card card--dashboard';
            if (itemData.id) cardWrapper.id = itemData.id;
            if (itemData.isDynamic) cardWrapper.setAttribute('data-dynamic', 'true');

            const cardTitle = document.createElement('h4');
            cardTitle.textContent = itemData.title;

            const cardParagraph = document.createElement('p');
            cardParagraph.innerHTML = itemData.content;

            cardWrapper.appendChild(cardTitle);
            cardWrapper.appendChild(cardParagraph);
            dashboardGrid.appendChild(cardWrapper);
        });
    };

    async function fetchAccountData() {
        try {
            const response = await fetch(accountDataUrl);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();

            const ordersItem = dashboardItemsData.find(item => item.id === 'sales-orders-item');
            if (ordersItem) {
                if (data.orders && data.orders.length > 0) {
                    ordersItem.content = data.orders.map(order => `<span>ID: ${order.orderId} | Status: ${order.status}</span>`).join('<br>');
                } else {
                    ordersItem.content = 'No orders found.';
                }
            }

            const projectsItem = dashboardItemsData.find(item => item.id === 'projects-item');
            if (projectsItem) {
                if (data.projects && data.projects.length > 0) {
                    projectsItem.content = data.projects.map(project => `<span>ID: ${project.projectId} | Status: ${project.status}</span>`).join('<br>');
                } else {
                    projectsItem.content = 'No projects found.';
                }
            }

        } catch (error) {
            console.error('Could not fetch account data:', error);
            const ordersItem = dashboardItemsData.find(item => item.id === 'sales-orders-item');
            if (ordersItem) ordersItem.content = 'Could not load order data.';
            const projectsItem = dashboardItemsData.find(item => item.id === 'projects-item');
            if (projectsItem) projectsItem.content = 'Could not load project data.';
        } finally {
            renderDashboard();
        }
    }

    const updateLikedCount = () => {
        if (likedCountSpan) {
            const likedItems = getLikedItems();
            likedCountSpan.textContent = likedItems.length;
        }
    };

    function initialize() {
        updateLikedCount();
        fetchAccountData();
    }

    initialize();
});