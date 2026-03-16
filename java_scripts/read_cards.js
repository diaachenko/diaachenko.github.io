let allSuites = []; 
let map = null;
let isMapView = false;

const getBookedStatus = () => {
    const saved = localStorage.getItem('bookedSuites');
    return saved ? JSON.parse(saved) : {}; 
};

const renderCards = (data) => {
    const container = document.getElementById('cards');
    const bookedSuites = getBookedStatus();
    container.innerHTML = "";

    data.forEach((suite) => {
        const suiteId = suite.id || suite.title;
        const isBooked = bookedSuites[suiteId] === true;
        let featureList = suite.features.map(f => `<li>${f}</li>`).join('');

        let card = document.createElement('div');
        card.className = "property-card";
        card.innerHTML = `
            <img src="${suite.image}" alt="${suite.alt}">
            <h3>${suite.title}</h3>
            <h5>${suite.price}</h5>
            <div class="details-wrapper">    
                <details>
                    <summary>Details</summary>
                    <div class="details-container">
                        <p><strong>Address:</strong> ${suite.address}</p>
                        <p>${suite.description}</p>
                        <ul>${featureList}</ul>
                    </div>
                </details>
            </div>
            <button class="book-btn ${isBooked ? 'is-booked' : ''}" 
                ${isBooked ? 'disabled' : ''} 
                onclick="bookSuite(this, '${suiteId}')">
                ${isBooked ? 'Booked' : 'Book'}
            </button>
        `;
        container.appendChild(card);
    });
};

const initMap = () => {
    if (map) return; 
    console.log("Initializing Map...");
    map = L.map('map-container').setView([49.841, 24.031], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    const bookedSuites = getBookedStatus();
    allSuites.forEach(suite => {
        const marker = L.marker([suite.lat, suite.lng]).addTo(map);
        const isBooked = bookedSuites[suite.id] === true;
        
        marker.bindPopup(`
            <div style="width:150px">
                <img src="${suite.image}" style="width:100%">
                <b>${suite.title}</b><br>
                <button onclick="bookSuite(this, '${suite.id}')" ${isBooked ? 'disabled' : ''}>
                    ${isBooked ? 'Booked' : 'Book'}
                </button>
            </div>
        `);
    });
};

document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('view-toggle-btn');
    const cardsDiv = document.getElementById('cards');
    const mapDiv = document.getElementById('map-container');

    if (btn) {
        btn.addEventListener('click', () => {
            console.log("Button Clicked!"); // Debugging check
            if (!isMapView) {
                cardsDiv.classList.add('hidden');
                mapDiv.style.display = 'block';
                btn.textContent = "Show as Cards";
                initMap();
                setTimeout(() => map.invalidateSize(), 200);
                isMapView = true;
            } else {
                cardsDiv.classList.remove('hidden');
                mapDiv.style.display = 'none';
                btn.textContent = "Show on Map";
                isMapView = false;
            }
        });
    } else {
        console.error("Button with ID 'view-toggle-btn' not found!");
    }
});

window.bookSuite = function(button, suiteId) {
    const bookedSuites = getBookedStatus();
    bookedSuites[suiteId] = true;
    localStorage.setItem('bookedSuites', JSON.stringify(bookedSuites));
    button.classList.add('is-booked');
    button.textContent = 'Booked';
    button.disabled = true;
};

fetch('json/suites.json')
    .then(res => res.json())
    .then(data => {
        allSuites = data;
        renderCards(data);
    });