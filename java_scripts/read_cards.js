let allSuites = [];
let map = null;
let isMapView = false;

const getBookedStatus = () => {
    const saved = localStorage.getItem('bookedSuites');
    return saved ? JSON.parse(saved) : {};
};

const saveBookedStatus = (bookedObj) => {
    localStorage.setItem('bookedSuites', JSON.stringify(bookedObj));
};

window.bookSuite = function(button, suiteId) {
    const bookedSuites = getBookedStatus();
    bookedSuites[suiteId] = true;
    saveBookedStatus(bookedSuites);
    button.classList.add('is-booked');
    button.textContent = 'Booked';
    button.disabled = true;
};

const renderCards = (data) => {
    const container = document.getElementById('cards');
    if (!container) return;
    const bookedSuites = getBookedStatus();
    container.innerHTML = "";

    data.forEach((suite) => {
        const suiteId = suite.id || suite.title;
        const isBooked = bookedSuites[suiteId] === true;
        let featureList = (suite.features || []).map(f => `<li>${f}</li>`).join('');

        let card = document.createElement('div');
        card.className = "property-card";
        card.innerHTML = `
            <img src="${suite.image}" alt="${suite.alt}">
            <h3>${suite.title}</h3>
            <h5>${suite.price}</h5>
            <details>
                <summary>Details</summary>
                <p><strong>Address:</strong> ${suite.address || 'Lviv'}</p>
                <p>${suite.description}</p>
                <ul>${featureList}</ul>
            </details>
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
    map = L.map('map-container').setView([49.841, 24.031], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    const bookedSuites = getBookedStatus();
    allSuites.forEach(suite => {
        if (suite.lat && suite.lng) {
            const suiteId = suite.id || suite.title;
            const isBooked = bookedSuites[suiteId] === true;
            const marker = L.marker([suite.lat, suite.lng]).addTo(map);
            marker.bindPopup(`
                <b>${suite.title}</b><br>${suite.price}<br>
                <button onclick="bookSuite(this, '${suiteId}')" ${isBooked ? 'disabled' : ''}>
                    ${isBooked ? 'Booked' : 'Book'}
                </button>
            `);
        }
    });
};

function setupToggle() {
    const btn = document.getElementById('view-toggle-btn');
    const cardsDiv = document.getElementById('cards');
    const mapDiv = document.getElementById('map-container');

    if (btn && cardsDiv && mapDiv) {
        btn.onclick = () => {
            console.log("Toggle Clicked!");
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
        };
    }
}

fetch('json/suites.json')
    .then(res => res.json())
    .then(data => {
        allSuites = data;
        renderCards(data);
        setupToggle();
    })
    .catch(err => console.error("Fetch error:", err));