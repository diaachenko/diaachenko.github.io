let allSuites = []; 
let map = null;
let markers = [];
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
                        <div>
                            <p><strong>Address:</strong> ${suite.address}</p>
                            <p>${suite.description}</p>
                            <ul>${featureList}</ul>
                        </div>
                    </div>
                </details><br>
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
    map = L.map('map-container').setView([49.841, 24.031], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(map);
    updateMapMarkers();
};

const updateMapMarkers = () => {
    const bookedSuites = getBookedStatus();
    markers.forEach(m => map.removeLayer(m));
    markers = [];

    allSuites.forEach(suite => {
        const marker = L.marker([suite.lat, suite.lng]).addTo(map);
        const suiteId = suite.id || suite.title;
        const isBooked = bookedSuites[suiteId] === true;

        marker.bindPopup(`
            <div style="width:150px">
                <img src="${suite.image}" style="width:100%">
                <h4>${suite.title}</h4>
                <button class="book-btn ${isBooked ? 'is-booked' : ''}" 
                    ${isBooked ? 'disabled' : ''} 
                    onclick="bookSuite(this, '${suiteId}')">
                    ${isBooked ? 'Booked' : 'Book'}
                </button>
            </div>
        `);
        markers.push(marker);
    });
};

const toggleBtn = document.getElementById('view-toggle-btn');
if(toggleBtn) {
    toggleBtn.addEventListener('click', function() {
        const gridView = document.getElementById('cards');
        const mapView = document.getElementById('map-container');
        if (!isMapView) {
            gridView.classList.add('hidden');
            mapView.style.display = 'block';
            this.textContent = "Show as Cards";
            isMapView = true;
            initMap();
            setTimeout(() => map.invalidateSize(), 100);
        } else {
            gridView.classList.remove('hidden');
            mapView.style.display = 'none';
            this.textContent = "Show on Map";
            isMapView = false;
        }
    });
}

fetch('json/suites.json')
    .then(res => res.json())
    .then(data => { allSuites = data; renderCards(data); });