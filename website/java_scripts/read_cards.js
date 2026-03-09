fetch('json/suites.json')
	.then(response => response.json())
	.then(data => {
		const Container = document.getElementById('cards');

		if (data.length > 0) {
			let i = 0;

			do {
				let card = document.createElement('div');
				card.className = "property-card";

				let featureList = "";
				for (let j = 0; j < data[i].features.length; j++) {
					featureList += `<li>${data[i].features[j]}</li>`;
				}


				card.innerHTML = `
					<img src="${data[i].image}" alt="${data[i].alt}">
					<h3>${data[i].title}</h3>
					<h5>${data[i].price}</h5>
					<details>
						<summary>Details</summary>
						<p>${data[i].description}</p>
						<ul>${featureList}</ul>
					</details><br>
					<button>Book</button>
				`;

				Container.appendChild(card);

				i++;
			} while (i < data.length);
		}
	})
	.catch(error => console.error('Error:', error));