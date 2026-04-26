document.addEventListener('DOMContentLoaded', () => {
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navLinksUl = document.getElementById('mobile-nav-links');

    if (hamburgerMenu && navLinksUl) {
        console.log("Hamburger menu and nav links found, attaching listeners.");
        hamburgerMenu.addEventListener('click', () => {
            console.log("Hamburger clicked!");
            navLinksUl.classList.toggle('active');
            hamburgerMenu.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });

        navLinksUl.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinksUl.classList.contains('active')) {
                    console.log("Nav link clicked, closing menu.");
                    navLinksUl.classList.remove('active');
                    hamburgerMenu.classList.remove('active');
                    document.body.classList.remove('no-scroll');
                }
            });
        });
    } else {
        console.warn("Hamburger menu or nav links UL not found. Mobile menu won't function.");
    }

});