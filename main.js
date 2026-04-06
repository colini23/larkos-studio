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

    // Custom Cursor Logic
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    if (cursorDot && cursorOutline) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            // Show cursor on first move
            cursorDot.style.opacity = '1';
            cursorOutline.style.opacity = '1';

            // Immediate position for the dot
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            // Delayed/Smooth position for the outline
            // Using animate for ultra-smooth performance
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 400, fill: "forwards" });
        });

        // Hover effect for links and interactive elements
        const selectables = document.querySelectorAll('a, button, .menu-toggle, .game-card');
        
        selectables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                document.body.classList.add('cursor-hover');
            });
            el.addEventListener('mouseleave', () => {
                document.body.classList.remove('cursor-hover');
            });
        });
    }

    // ==================================
    // HORROR AMBIENCE ENGINE (Web Audio)
    // ==================================
    class HorrorSoundEngine {
        constructor() {
            this.audioCtx = null;
            this.osc1 = null;
            this.osc2 = null;
            this.lfo = null;
            this.mainGain = null;
            this.filter = null;
            this.isPlaying = false;
        }

        init() {
            if (this.audioCtx) return;
            
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            
            // Main Gain for volume control and fades
            this.mainGain = this.audioCtx.createGain();
            this.mainGain.gain.value = 0;
            this.mainGain.connect(this.audioCtx.destination);

            // Filter to keep it dark
            this.filter = this.audioCtx.createBiquadFilter();
            this.filter.type = 'lowpass';
            this.filter.frequency.value = 400; // Muffled industrial sound
            this.filter.connect(this.mainGain);

            // Base Drone 1 (Low Hum)
            this.osc1 = this.audioCtx.createOscillator();
            this.osc1.type = 'sine';
            this.osc1.frequency.value = 45; // Very low
            this.osc1.connect(this.filter);

            // Deep Wobble Drone 2 (Detuned)
            this.osc2 = this.audioCtx.createOscillator();
            this.osc2.type = 'triangle';
            this.osc2.frequency.value = 46.5; // Slight detune for 'beating' effect
            const osc2Gain = this.audioCtx.createGain();
            osc2Gain.gain.value = 0.4;
            this.osc2.connect(osc2Gain);
            osc2Gain.connect(this.filter);

            // LFO for 'Breathing' / Throbbing effect
            this.lfo = this.audioCtx.createOscillator();
            this.lfo.type = 'sine';
            this.lfo.frequency.value = 0.15; // Slow throb (every ~6 seconds)
            const lfoGain = this.audioCtx.createGain();
            lfoGain.gain.value = 100; // Modulate filter frequency
            this.lfo.connect(lfoGain);
            lfoGain.connect(this.filter.frequency);

            // Start everything
            this.osc1.start();
            this.osc2.start();
            this.lfo.start();
        }

        toggle() {
            if (!this.audioCtx) this.init();

            if (this.audioCtx.state === 'suspended') {
                this.audioCtx.resume();
            }

            if (!this.isPlaying) {
                // Fade In
                this.mainGain.gain.setTargetAtTime(0.3, this.audioCtx.currentTime, 2);
                this.isPlaying = true;
                document.body.classList.add('sound-on');
                document.querySelector('.sound-label').textContent = 'Ambience: ON';
            } else {
                // Fade Out
                this.mainGain.gain.setTargetAtTime(0, this.audioCtx.currentTime, 0.5);
                this.isPlaying = false;
                document.body.classList.remove('sound-on');
                document.querySelector('.sound-label').textContent = 'Ambience: OFF';
            }
        }
    }

    const ambience = new HorrorSoundEngine();
    const soundBtn = document.getElementById('sound-toggle');

    if (soundBtn) {
        soundBtn.addEventListener('click', () => {
            ambience.toggle();
        });
    }
});
