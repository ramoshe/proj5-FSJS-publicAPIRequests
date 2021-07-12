const gallery = document.querySelector('#gallery');

const usersPromise = new Promise( (resolve, reject) => {
    fetch('https://randomuser.me/api/?nat=us&results=12')
        .then(response => response.json())
        .then(data => resolve(data.results));
});

usersPromise
    .then(users => {
        users.forEach((person, index) => {
            const userCard = generateUserCard(person);
            gallery.insertAdjacentElement('beforeend', userCard);
            userCard.addEventListener('click', () => {
                const userModal = generateModal(person);
                gallery.insertAdjacentElement('afterend', userModal);
                buttonListeners(userModal, index);
            });
        });
    });

function generateUserCard(person) {
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
    return userCard;
}

function generateModal(person) {
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
    return userModal;
}

function buttonListeners(modal, index) {
    const closeButton = document.querySelector('#modal-close-btn');
    closeButton.addEventListener('click', () => modal.remove());

    const nextButton = document.querySelector('#modal-next');
    nextButton.addEventListener('click', () => {
        console.log('next');
    });

    const prevButton = document.querySelector('#modal-prev');
    prevButton.addEventListener('click', () => {
        console.log('prev');
    });
}