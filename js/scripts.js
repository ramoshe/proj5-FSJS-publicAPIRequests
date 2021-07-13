const gallery = document.querySelector('#gallery');
let usersArray = [];

const usersPromise = new Promise( (resolve, reject) => {
    fetch('https://randomuser.me/api/?nat=us&results=12')
        .then(response => response.json())
        .then(data => resolve(data.results));
});

usersPromise
    .then(users => users.forEach((person, index) => {
        usersArray.push(person);
        generateUserCard(person, index);
    }));

function generateUserCard(person, index) {
    const userCard = document.createElement('div');
    userCard.className = 'card';
    userCard.insertAdjacentHTML('beforeend', `
        <div class="card-img-container">
            <img class="card-img" src="${person.picture.large}" alt="profile picture">
        </div>
        <div class="card-info-container">
            <h3 id="name" class="card-name cap">${person.name.first} ${person.name.last}</h3>
            <p class="card-text">${person.email}</p>
            <p class="card-text cap">${person.location.city}, ${person.location.state}</p>
        </div>
    `);
    gallery.insertAdjacentElement('beforeend', userCard);
    userCard.addEventListener('click', () => {
        generateModal(person, index);
    });
}

function generateModal(person, index) {
    const userDOB = new Date(person.dob.date); // pulled out to be formatted later
    const userModal = document.createElement('div');
    userModal.className = 'modal-container';
    userModal.insertAdjacentHTML('beforeend', `
        <div class="modal">
            <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
            <div class="modal-info-container">
                <img class="modal-img" src="${person.picture.large}" alt="profile picture">
                <h3 id="name" class="modal-name cap">${person.name.first} ${person.name.last}</h3>
                <p class="modal-text">${person.email}</p>
                <p class="modal-text cap">${person.location.city}</p>
                <hr>
                <p class="modal-text">${person.cell}</p>
                <p class="modal-text">${person.location.street.number} ${person.location.street.name}, ${person.location.city}, ${person.location.state} ${person.location.postcode}</p>
                <p class="modal-text">Birthday: ${userDOB.getMonth()}/${userDOB.getDay()}/${userDOB.getFullYear()}</p>
            </div>
        </div>
        <div class="modal-btn-container">
            <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
            <button type="button" id="modal-next" class="modal-next btn">Next</button>
        </div>
    `);
    gallery.insertAdjacentElement('afterend', userModal);
    buttonHandlers(userModal, index);
}

function buttonHandlers(modal, index) {
    const closeButton = document.querySelector('#modal-close-btn');
    closeButton.addEventListener('click', () => modal.remove());

    const prevButton = document.querySelector('#modal-prev');
    prevButton.addEventListener('click', () => {
        modal.remove();
        if (index > 0) {
            index -= 1;
            const prevUser = usersArray[index];
            generateModal(prevUser, index);
        }
    });

    const nextButton = document.querySelector('#modal-next');
    nextButton.addEventListener('click', () => {
        modal.remove();
        if (index < 11) {
            index += 1;
            const nextUser = usersArray[index];
            generateModal(nextUser, index);
        }
    });
}

const searchContainer = document.querySelector('.search-container');
searchContainer.insertAdjacentHTML('afterbegin', `
    <form action="#" method="get">
        <input type="search" id="search-input" class="search-input" placeholder="Search...">
        <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
    </form>
`);
const searchInput = document.querySelector('#search-input');
searchInput.addEventListener('input', searchEventHandler);

const searchSubmit = document.querySelector('#search-submit');
searchSubmit.addEventListener('click', searchEventHandler);

function searchEventHandler() {
    let matches = [];
    gallery.innerHTML = '';
    const input = searchInput.value.toLowerCase();
    usersArray.forEach((person) => {
        const userName = (person.name.first +' '+ person.name.last).toLowerCase();
        if (userName.includes(input)) {
            matches.push(person);
        }
    });
    matches.forEach((item, index) => generateUserCard(item, index));
}