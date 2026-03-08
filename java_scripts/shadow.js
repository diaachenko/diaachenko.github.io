document.addEventListener('DOMContentLoaded', () => {
  
    const header = document.querySelector('header');
    const mainSection = document.querySelector('main');

    if (header && mainSection) {
        console.log("Header and Main section found for scroll shadow logic.");
        let scrollThreshold = mainSection.offsetTop - header.offsetHeight; 

        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            scrollThreshold = heroSection.offsetHeight;
            console.log("Scroll shadow threshold set to hero-section height:", scrollThreshold, "px");
        } else {
            scrollThreshold = 200;
            console.warn("Hero section not found, using fallback scroll threshold:", scrollThreshold, "px");
        }

        window.addEventListener('scroll', () => {
            if (window.scrollY > scrollThreshold) {
                if (!header.classList.contains('scrolled')) {
                    header.classList.add('scrolled');
                    console.log("Scrolled past threshold, added 'scrolled' class.");
                }
            } else {
                if (header.classList.contains('scrolled')) {
                    header.classList.remove('scrolled');
                    console.log("Scrolled back up, removed 'scrolled' class.");
                }
            }
        });

        if (window.scrollY > scrollThreshold) {
            header.classList.add('scrolled');
            console.log("Page loaded already scrolled, added 'scrolled' class.");
        }

    } else {
        console.error("Header or Main section element not found for scroll shadow logic.");
    }
});