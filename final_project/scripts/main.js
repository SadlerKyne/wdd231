import { updateFooter } from './utils.js';

function handleHamburgerMenu() {
    const menuButton = document.getElementById('menuButton');
    const primaryNav = document.getElementById('primaryNav');

    if (menuButton && primaryNav) {
        menuButton.addEventListener('click', () => {
            primaryNav.classList.toggle('show-menu');
            primaryNav.classList.toggle('hide-menu');
        });
    }
}

function initializeSite() {
    handleHamburgerMenu();
    updateFooter();
}

initializeSite();