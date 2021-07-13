const gallery = document.querySelector('#gallery');

/**
 * Create a Promise object to hold fetched users
 */
const usersPromise = new Promise( (resolve, reject) => {
    fetch('https://randomuser.me/api/?nat=us&results=12')
        .then(response => response.json())
        .then(data => resolve(data.results))
        .catch(error => {
            reject(error);
            gallery.insertAdjacentHTML('afterbegin', `<h2>Error loading users<br>${error}</h2>`);
        });
});

/**
 * Use the Promise object to build an array of users and populate the page
 */
let usersArray = [];
usersPromise
    .then(users => users.forEach((person, index) => {
        usersArray.push(person);
        generateUserCard(person, index);
    }));

/**
 * This function generates and appends the HTML to display a card for the user
 * 
 * @param {Object} person - the person object from usersArray
 * @param {number} index - index of the current person object in the usersArray
 */
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

/**
 * This function generates and appends the HTML to display a modal box for the user
 * 
 * @param {Object} person - the person object from usersArray
 * @param {number} index - index of the current person object in the usersArray
 */
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

/**
 * This function adds listeners and handlers for the buttons on the modal display
 * 
 * @param {Object} person - the person object from usersArray
 * @param {number} index - index of the current person object in the usersArray
 */
function buttonHandlers(modal, index) {
    const closeButton = document.querySelector('#modal-close-btn');
    closeButton.addEventListener('click', () => modal.remove());

    let array = [];
    if (searchInput.value === '') {
        array = usersArray;
    } else {
        array = searchEventHandler();
    }

    const prevButton = document.querySelector('#modal-prev');
    prevButton.addEventListener('click', () => {
        modal.remove();
        if (index > 0) {
            index -= 1;
            const prevUser = array[index];
            generateModal(prevUser, index);
        }
    });

    const nextButton = document.querySelector('#modal-next');
    nextButton.addEventListener('click', () => {
        modal.remove();
        if (index < (array.length - 1)) {
            index += 1;
            const nextUser = array[index];
            generateModal(nextUser, index);
        }
    });
}

/**
 * EXTRA CREDIT: Add Search bar
 */
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

/**
 * This function performs the search based on user input
 * 
 * @returns {Array} matches - the array of person objects that match the search
 */
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
    return matches;
}

/**
 * EXTRA CREDIt: Custom styling
 */

// need to add code here, and add notes to README
