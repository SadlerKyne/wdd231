const membersDataURL = 'scripts/members.json';
let allMembers = [];

async function getMemberData() {
    try {
        const response = await fetch(membersDataURL);
        if (response.ok) {
            const data = await response.json();
            allMembers = data;
            displayMembers(allMembers);
            setupFilterButtons();
            setupViewToggleButtons();
        } else {
            console.error('Error fetching member data:', response.status, response.statusText);
        }
    } catch (error) {
        console.error("Fetch API failed:", error);
    }
}

function displayMembers(members) {
    const displayArea = document.getElementById('members-display-area');
    displayArea.innerHTML = '';

    const getMembershipLevelName = (level) => {
        if (level === 3) return 'Gold Member';
        if (level === 2) return 'Silver Member';
        if (level === 1) return 'Bronze Member';
        return 'Member';
    };

    members.forEach(member => {
        let card = document.createElement('section');
        card.classList.add('member-card');

        let img = document.createElement('img');
        img.setAttribute('src', 'images/' + member.imageFileName);
        img.setAttribute('alt', `Logo of ${member.name}`);
        img.setAttribute('loading', 'lazy');
        img.setAttribute('width', '160'); 
        img.setAttribute('height', '120'); 

        let h2 = document.createElement('h2');
        h2.textContent = member.name;

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
        membershipPara.classList.add('membership-level');
        membershipPara.textContent = getMembershipLevelName(member.membershipLevel);

        let descriptionPara = document.createElement('p');
        descriptionPara.classList.add('other-details');
        descriptionPara.textContent = member.description;

        card.appendChild(img);
        card.appendChild(h2);
        card.appendChild(address);
        card.appendChild(phone);
        card.appendChild(website);
        card.appendChild(membershipPara);
        card.appendChild(descriptionPara);
        
        displayArea.appendChild(card);
    });
}

function setupFilterButtons() {
    const filterButtonsContainer = document.querySelector('.filter-controls-directory');
    if (filterButtonsContainer) {
        const buttons = filterButtonsContainer.querySelectorAll('.filter-btn');

        buttons.forEach(button => {
            button.addEventListener('click', () => {
                buttons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const filterValue = button.getAttribute('data-filter');

                let filteredMembers;
                if (filterValue === 'all') {
                    filteredMembers = allMembers;
                } else {
                    filteredMembers = allMembers.filter(member => member.category === filterValue);
                }
                displayMembers(filteredMembers);
            });
        });
    } else {
        console.warn("Filter buttons container '.filter-controls-directory' not found.");
    }
}

function setupViewToggleButtons() {
    const gridButton = document.getElementById('grid-view-btn');
    const listButton = document.getElementById('list-view-btn');
    const displayArea = document.getElementById('members-display-area');

    if (gridButton && listButton && displayArea) {
        gridButton.addEventListener('click', () => {
            gridButton.classList.add('active');
            listButton.classList.remove('active');
            displayArea.classList.add('cards');
            displayArea.classList.remove('list');
        });

        listButton.addEventListener('click', () => {
            listButton.classList.add('active');
            gridButton.classList.remove('active');
            displayArea.classList.add('list');
            displayArea.classList.remove('cards');
        });

        if (displayArea.classList.contains('cards')) {
            gridButton.classList.add('active');
            listButton.classList.remove('active');
        } else if (displayArea.classList.contains('list')) {
            listButton.classList.add('active');
            gridButton.classList.remove('active');
        }
    } else {
        console.warn("Grid/List view toggle buttons or display area not found.");
    }
}

getMemberData();