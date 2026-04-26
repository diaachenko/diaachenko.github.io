const getBookedStatus = () => {
    const saved = localStorage.getItem('bookedSuites');
    return saved ? JSON.parse(saved) : {}; 
};

const saveBookedStatus = (bookedObj) => {
    localStorage.setItem('bookedSuites', JSON.stringify(bookedObj));
};

window.cancelBooking = function(suiteId) {
    if (confirm("Cancel this booking?")) {
        const booked = getBookedStatus();
        delete booked[suiteId];
        saveBookedStatus(booked);
        renderBookings();
    }
};

const renderBookings = () => {
    fetch('json/suites.json')
        .then(res => res.json())
        .then(data => {
            const container = document.getElementById('cards');
            const booked = getBookedStatus();
            container.innerHTML = "";

            const userBookings = data.filter(s => booked[s.id || s.title]);

            if (userBookings.length === 0) {
                container.innerHTML = "<p>No active bookings.</p>";
                return;
            }

            userBookings.forEach(suite => {
                let card = document.createElement('div');
                card.className = "property-card";
                card.innerHTML = `
                    <img src="${suite.image}" alt="${suite.alt}">
                    <h3>${suite.title}</h3>
                    <p><strong>Status:</strong> Confirmed</p>
                    <h5>Total: ${suite.price}</h5>
                    <button class="cancel-btn" onclick="cancelBooking('${suite.id || suite.title}')">Cancel Booking</button>
                `;
                container.appendChild(card);
            });
        });
};

renderBookings();