let ticking = false;
let soundEnabled = true;
let currentSection = 0;
const progressBar = document.querySelector('.progress-bar');
const navDots = document.querySelectorAll('.nav-dot');
const sections = document.querySelectorAll('.layer-section, .hero');
const layerContents = document.querySelectorAll('.layer-content');
const tooltip = document.getElementById('tooltip');
const cursor = document.querySelector('.custom-cursor');
const currentLayerSpan = document.getElementById('current-layer');
const soundToggle = document.getElementById('soundToggle');
const particleSystem = document.getElementById('particleSystem');

const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playSound(frequency = 440, duration = 100, type = 'sine') {
    if (!soundEnabled) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.type = type;

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration / 1000);
}

function createFloatingElements() {
    const container = document.querySelector('.floating-elements');
    for (let i = 0; i < 30; i++) {
        const element = document.createElement('div');
        element.className = 'floating-element';
        element.style.left = Math.random() * 100 + '%';
        element.style.animationDelay = Math.random() * 6 + 's';
        element.style.animationDuration = (4 + Math.random() * 4) + 's';
        container.appendChild(element);
    }
}

function createParticles(x, y, count = 10) {
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';

        const angle = (Math.PI * 2 * i) / count;
        const velocity = 2 + Math.random() * 3;
        const life = 1000 + Math.random() * 1000;

        particleSystem.appendChild(particle);

        let startTime = Date.now();
        function animateParticle() {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / life;

            if (progress >= 1) {
                particle.remove();
                return;
            }

            const currentX = x + Math.cos(angle) * velocity * elapsed / 10;
            const currentY = y + Math.sin(angle) * velocity * elapsed / 10;

            particle.style.left = currentX + 'px';
            particle.style.top = currentY + 'px';
            particle.style.opacity = 1 - progress;
            particle.style.transform = `scale(${1 - progress})`;

            requestAnimationFrame(animateParticle);
        }
        animateParticle();
    }
}

function updateProgress() {
    const scrolled = window.pageYOffset;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrolled / maxScroll) * 100;
    progressBar.style.transform = `scaleX(${progress / 100})`;
}

function updateActiveSection() {
    const scrollPosition = window.pageYOffset + window.innerHeight / 2;

    sections.forEach((section, index) => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            if (currentSection !== index) {
                currentSection = index;
                playSound(200 + index * 50, 150);
                currentLayerSpan.textContent = index;
            }

            navDots.forEach(dot => dot.classList.remove('active'));
            if (navDots[index]) {
                navDots[index].classList.add('active');
            }

            if (index > 0) {
                const layerContent = section.querySelector('.layer-content');
                if (layerContent && !layerContent.classList.contains('active')) {
                    layerContent.classList.add('active');

                    const packets = layerContent.querySelectorAll('.data-packet, .header');
                    packets.forEach((packet, i) => {
                        packet.style.animationDelay = (i * 0.2) + 's';
                    });
                }
            }
        }
    });
}

function onScroll() {
    if (!ticking) {
        requestAnimationFrame(() => {
            updateProgress();
            updateActiveSection();
            ticking = false;
        });
        ticking = true;
    }
}

function animateDataFlow(element) {
    const flowContainer = element.querySelector('.data-flow-animation');
    flowContainer.innerHTML = '';

    for (let i = 0; i < 15; i++) {
        const bit = document.createElement('div');
        bit.className = 'data-bit';
        bit.style.top = Math.random() * 80 + 10 + '%';
        bit.style.animationDelay = i * 0.1 + 's';
        flowContainer.appendChild(bit);
    }

    playSound(800, 200, 'square');

    const rect = element.getBoundingClientRect();
    createParticles(rect.left + rect.width/2, rect.top + rect.height/2, 8);

    setTimeout(() => {
        flowContainer.innerHTML = '';
    }, 3000);
}

function startJourney() {
    playSound(523, 300);
    sections[1].scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

function showTooltip(e, text) {
    tooltip.textContent = text;
    tooltip.style.left = e.pageX + 10 + 'px';
    tooltip.style.top = e.pageY - 40 + 'px';
    tooltip.classList.add('show');
}

function hideTooltip() {
    tooltip.classList.remove('show');
}

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';

    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        section.style.setProperty('--mouse-x', x + '%');
        section.style.setProperty('--mouse-y', y + '%');
    });
});

document.addEventListener('mouseenter', (e) => {
    if (e.target.matches('[data-tooltip]')) {
        cursor.classList.add('hover');
        showTooltip(e, e.target.getAttribute('data-tooltip'));
    }
});

document.addEventListener('mouseleave', (e) => {
    if (e.target.matches('[data-tooltip]')) {
        cursor.classList.remove('hover');
        hideTooltip();
    }
});

document.addEventListener('click', (e) => {
    const rect = e.target.getBoundingClientRect();
    createParticles(e.clientX, e.clientY, 6);
    playSound(Math.random() * 400 + 200, 100);
});

navDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        const targetSection = sections[index];
        if (targetSection) {
            playSound(300 + index * 100, 200);
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

soundToggle.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundToggle.textContent = soundEnabled ? '🔊' : '🔇';
    playSound(440, 100);
});

document.addEventListener('keydown', (e) => {
    const currentActive = document.querySelector('.nav-dot.active');
    const currentIndex = Array.from(navDots).indexOf(currentActive);

    if (e.key === 'ArrowDown' && currentIndex < navDots.length - 1) {
        e.preventDefault();
        sections[currentIndex + 1].scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    } else if (e.key === 'ArrowUp' && currentIndex > 0) {
        e.preventDefault();
        sections[currentIndex - 1].scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    } else if (e.key === ' ') {
        e.preventDefault();
        if (currentIndex < navDots.length - 1) {
            sections[currentIndex + 1].scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

setInterval(() => {
    const randomElement = document.querySelector('.floating-element:nth-child(' + (Math.floor(Math.random() * 30) + 1) + ')');
    if (randomElement) {
        randomElement.style.background = ['#4ecdc4', '#ff6b6b', '#45b7d1', '#96ceb4'][Math.floor(Math.random() * 4)];
    }
}, 2000);

window.addEventListener('scroll', onScroll);
window.addEventListener('resize', onScroll);

window.addEventListener('load', () => {
    const heroContent = document.querySelector('.hero-content');
    heroContent.style.opacity = '0';
    heroContent.style.transform = 'translateY(30px)';

    setTimeout(() => {
        heroContent.style.transition = 'all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        heroContent.style.opacity = '1';
        heroContent.style.transform = 'translateY(0)';
    }, 100);

    createFloatingElements();
    updateActiveSection();
});

document.querySelectorAll('.protocol-tag').forEach(tag => {
    tag.addEventListener('click', () => {
        playSound(600, 150);
        tag.style.transform = 'scale(0.95)';
        setTimeout(() => {
            tag.style.transform = '';
        }, 100);
    });
});

document.querySelectorAll('.data-packet').forEach(packet => {
    packet.addEventListener('mouseenter', () => {
        playSound(400, 50, 'triangle');
    });
});

document.querySelectorAll('.layer-info h2').forEach(header => {
    header.addEventListener('click', () => {
        playSound(300, 200, 'sawtooth');
        header.style.animation = 'none';
        setTimeout(() => {
            header.style.animation = '';
        }, 10);
    });
});