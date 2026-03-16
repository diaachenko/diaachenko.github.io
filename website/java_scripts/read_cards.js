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

// Global function for buttons
window.bookSuite = function(button, suiteId) {
    const bookedSuites = getBookedStatus();
    bookedSuites[suiteId] = true;
    saveBookedStatus(bookedSuites);

    button.classList.add('is-booked');
    button.textContent = 'Booked';
    button.disabled = true;
    
    // Alert or small toast notification
    console.log(`Suite ${suiteId} booked!`);
};

const renderCards = (data) => {
    const container = document.getElementById('cards');
    const bookedSuites = getBookedStatus();
    container.innerHTML = "";

    data.forEach((suite) => {
        const suiteId = suite.id || suite.title;
        const isBooked = bookedSuites[suiteId] === true || suite.booked === true;
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
            <button 
                class="book-btn ${isBooked ? 'is-booked' : ''}" 
                ${isBooked ? 'disabled' : ''} 
                onclick="bookSuite(this, '${suiteId}')">
                ${isBooked ? 'Booked' : 'Book'}
            </button>
        `;
        container.appendChild(card);
    });
};

const initMap = () => {
    if (map) return; // Don't re-initialize

    // Center map on Lviv Opera House area
    map = L.map('map-container').setView([49.841, 24.031], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    updateMapMarkers();
};

const updateMapMarkers = () => {
    const bookedSuites = getBookedStatus();
    
    // Clear old markers if any
    markers.forEach(m => map.removeLayer(m));
    markers = [];

    allSuites.forEach(suite => {
        const suiteId = suite.id || suite.title;
        const isBooked = bookedSuites[suiteId] === true || suite.booked === true;

        const marker = L.marker([suite.lat, suite.lng]).addTo(map);
        
        // Custom Popup (Mini Card)
        const popupContent = `
            <div style="width:160px; font-family: sans-serif;">
                <img src="${suite.image}" style="width:100%; border-radius:5px;">
                <h4 style="margin:5px 0 2px 0;">${suite.title}</h4>
                <p style="margin:0 0 10px 0; font-size:12px;">${suite.price}</p>
                <button 
                    class="book-btn ${isBooked ? 'is-booked' : ''}"
                    style="width:100%; padding:5px; cursor:pointer;"
                    ${isBooked ? 'disabled' : ''} 
                    onclick="bookSuite(this, '${suiteId}')">
                    ${isBooked ? 'Booked' : 'Book Now'}
                </button>
            </div>
        `;
        marker.bindPopup(popupContent);
        markers.push(marker);
    });
};

// Toggle logic
document.getElementById('view-toggle-btn').addEventListener('click', function() {
    const gridView = document.getElementById('cards');
    const mapView = document.getElementById('map-container');

    if (!isMapView) {
        gridView.classList.add('hidden');
        mapView.style.display = 'block';
        this.textContent = "Show as Cards";
        isMapView = true;
        
        // Initialize map if first time, then invalidate size to fix gray tiles
        initMap();
        setTimeout(() => map.invalidateSize(), 100);
    } else {
        gridView.classList.remove('hidden');
        mapView.style.display = 'none';
        this.textContent = "Show on Map";
        isMapView = false;
        renderCards(allSuites); // Refresh cards in case status changed in map view
    }
});

// Start the process
fetch('json/suites.json')
    .then(response => response.json())
    .then(data => {
        allSuites = data;
        renderCards(allSuites);
    })
    .catch(error => console.error('Error fetching data:', error));