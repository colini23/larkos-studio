document.addEventListener('DOMContentLoaded', () => {

    // Configurar Menú Móvil
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    if(mobileMenu && navLinks) {
        mobileMenu.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
        
        // Cerrar el menú al hacer clic en un enlace
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }
    
    // Cambiar la apariencia del Navbar al hacer scroll
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Pequeño efecto 3D Parallax en las tarjetas de juego en desktop
    const cards = document.querySelectorAll('.game-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within the element.
            const y = e.clientY - rect.top;  // y position within the element.
            
            // Calculating rotation (-10 to 10 deg)
            const xRotate = ((y / rect.height) - 0.5) * -20;
            const yRotate = ((x / rect.width) - 0.5) * 20;
            
            card.style.transform = `perspective(1000px) rotateX(${xRotate}deg) rotateY(${yRotate}deg) translateY(-10px) scale(1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)`;
            // Agregar una transición suave al volver al estado original
            card.style.transition = 'transform 0.5s ease, box-shadow 0.3s ease';
        });
        
        card.addEventListener('mouseenter', () => {
            // Remover la transición al mover para tener respuesta inmediata
            card.style.transition = 'none';
        });
    });
});
