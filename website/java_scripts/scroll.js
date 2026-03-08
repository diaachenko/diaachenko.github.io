console.log("scroll.js file loaded at: ", new Date().toLocaleString());

document.addEventListener('DOMContentLoaded', () => {
    const siteLogo = document.getElementById('siteLogo'); 

    if (siteLogo) {
        siteLogo.addEventListener('click', (event) => {
            event.preventDefault(); 

            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
})