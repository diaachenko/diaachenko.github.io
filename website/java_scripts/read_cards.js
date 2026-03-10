const getBookedStatus = () => {
    const saved = localStorage.getItem('bookedSuites');
    return saved ? JSON.parse(saved) : {}; 
};

const saveBookedStatus = (bookedObj) => {
    localStorage.setItem('bookedSuites', JSON.stringify(bookedObj));
};

function bookSuite(button, suiteId) {
    const bookedSuites = getBookedStatus();

    bookedSuites[suiteId] = true;
    saveBookedStatus(bookedSuites);

    button.classList.add('is-booked');
    button.textContent = 'Booked';
    button.disabled = true;
}

fetch('json/suites.json')
    .then(response => response.json())
    .then(data => {
        const container = document.getElementById('cards');
        const bookedSuites = getBookedStatus();

        data.forEach((suite) => {
            const suiteId = suite.id || suite.title;

            const isBooked = bookedSuites[suiteId] === true || suite.booked === true;

            let card = document.createElement('div');
            card.className = "property-card";

            let featureList = suite.features.map(f => `<li>${f}</li>`).join('');

            card.innerHTML = `
                <img src="${suite.image}" alt="${suite.alt}">
                <h3>${suite.title}</h3>
                <h5>${suite.price}</h5>
	            <div class="details-wrapper">    
	                <details>
	                    <summary>Details</summary>
	                    <div class="details-container">
	                        <div>
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
    })
    .catch(error => console.error('Error:', error));