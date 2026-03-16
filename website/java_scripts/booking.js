const getBookedStatus = () => {
    const saved = localStorage.getItem('bookedSuites');
    return saved ? JSON.parse(saved) : {}; 
};

const saveBookedStatus = (bookedObj) => {
    localStorage.setItem('bookedSuites', JSON.stringify(bookedObj));
};

const renderBookings = () => {
    fetch('json/suites.json')
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('cards');
            const bookedSuites = getBookedStatus();

            container.innerHTML = "";

            const userBookings = data.filter(suite => {
                const suiteId = suite.id || suite.title;
                return bookedSuites[suiteId] === true;
            });

            if (userBookings.length === 0) {
                container.innerHTML = "<p>You have no active bookings.</p>";
                return;
            }

            userBookings.forEach(suite => {
                const suiteId = suite.id || suite.title;
                let card = document.createElement('div');
                card.className = "property-card";

                card.innerHTML = `
                    <img src="${suite.image}" alt="${suite.alt}">
                    <h3>${suite.title}</h3>
                    <p><strong>Status:</strong> <span class="status-upcoming">Confirmed</span></p>
                    <p><strong>Dates:</strong> Upcoming Stay</p>
                    <h5 class="price">Total Price: ${suite.price}</h5>
                    
                    <details>
                        <summary>Receipt & Details</summary>
                        <div class="details-container">
                            <div>
                                <p>Thank you for booking with us!</p>
                                <ul>
                                    <li>Confirmation #: #${Math.floor(Math.random() * 90000) + 10000}</li>
                                    <li>Check-in: 3:00 PM</li>
                                </ul>
                            </div>
                        </div>
                    </details><br>

                    <div class="button-container">
                        <button class="cancel-btn" onclick="cancelBooking('${suiteId}')">Cancel Booking</button>
                        <button class="review-btn">Leave a Review</button>
                    </div>
                `;
                container.appendChild(card);
            });
        });
};

window.cancelBooking = function(suiteId) {
    if (confirm("Are you sure you want to cancel this booking?")) {
        const bookedSuites = getBookedStatus();
        delete bookedSuites[suiteId]; 
        saveBookedStatus(bookedSuites);
        renderBookings();
    }
};

renderBookings();