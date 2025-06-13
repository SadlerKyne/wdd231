import { getLikedItems, saveLikedItems } from './utils.js';

const grid = document.querySelector('.display-grid');
const tabsContainer = document.querySelector('.product-tabs');
const modal = document.getElementById('detailModal');
const modalBody = document.getElementById('modal-body');
const closeModalButton = document.querySelector('#detailModal .modal-close');
const productsUrl = 'data/products.json';
let allProducts = [];

async function fetchProducts() {
    try {
        const response = await fetch(productsUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        allProducts = await response.json();
        displayProducts('All');
    } catch (error) {
        console.error('Could not fetch products:', error);
        if (grid) grid.innerHTML = '<p>Sorry, we were unable to load products. Please try again later.</p>';
    }
}

function populateModal(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product || !modalBody) return;

    modalBody.innerHTML = `
        <img src="${product.imageUrl}" alt="${product.name}" class="modal-product-image">
        <div class="modal-product-details">
            <h2 class="modal-product-title">${product.name}</h2>
            <span class="tag">${product.tag}</span>
            <p class="modal-product-price">$${product.price}</p>
            <p class="modal-product-description">${product.description}</p>
        </div>
    `;
    if (modal) modal.style.display = 'block';
}

function displayProducts(filter) {
    if (!grid) return;
    grid.innerHTML = '';
    const filteredProducts = filter === 'All' ? allProducts : allProducts.filter(product => product.category === filter);
    const likedItems = getLikedItems();

    filteredProducts.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.setAttribute('data-product-id', product.id);
        
        const isLiked = likedItems.includes(product.id);
        
        card.innerHTML = `
            <img src="${product.imageUrl}" alt="${product.name}" loading="lazy">
            <div class="card-content">
                <div class="card-header">
                    <h3>${product.name}</h3>
                    <button class="like-button ${isLiked ? 'liked' : ''}" data-id="${product.id}" aria-label="Like ${product.name}">♡</button>
                </div>
                <div class="card-details">
                    <span class="price">$${product.price}</span>
                    <span class="tag">${product.tag}</span>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

function setupEventListeners() {
    if (tabsContainer && grid) {
        tabsContainer.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                document.querySelector('.tab-link.active').classList.remove('active');
                e.target.classList.add('active');
                const filter = e.target.getAttribute('data-filter');
                displayProducts(filter);
            }
        });
    }

    if (grid) {
        grid.addEventListener('click', (e) => {
            const likeButton = e.target.closest('.like-button');
            const card = e.target.closest('.product-card');

            if (likeButton) {
                e.stopPropagation();
                const productId = likeButton.getAttribute('data-id');
                let likedItems = getLikedItems();

                if (likedItems.includes(productId)) {
                    likedItems = likedItems.filter(id => id !== productId);
                    likeButton.classList.remove('liked');
                } else {
                    likedItems.push(productId);
                    likeButton.classList.add('liked');
                }
                saveLikedItems(likedItems);
            } else if (card) {
                const productId = card.getAttribute('data-product-id');
                populateModal(productId);
            }
        });
    }

    if (closeModalButton) {
        closeModalButton.addEventListener('click', () => {
            if (modal) modal.style.display = 'none';
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target == modal) {
            if (modal) modal.style.display = 'none';
        }
    });
}

setupEventListeners();
fetchProducts();