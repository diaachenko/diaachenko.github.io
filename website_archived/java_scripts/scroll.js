document.addEventListener('DOMContentLoaded', () => {
    const swiitch = document.getElementById('swiitch'); 

    if (swiitch) {
        swiitch.addEventListener('click', (event) => {
            event.preventDefault(); 

            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});