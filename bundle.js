document.addEventListener('DOMContentLoaded', () => {
    // Carousel functionality
    const carouselConfig = {
        slideTime: 3000,
        transitionSpeed: 0.6, // in seconds
        slideDistance: 300
    };

    class Carousel {
        constructor(element, config) {
            this.carousel = element;
            this.id = element.id;
            this.originalItems = Array.from(element.querySelectorAll('.carousel-item'));
            this.config = config;
            this.currentIndex = 0;
            this.totalOriginalItems = this.originalItems.length;
            this.autoplayInterval = null;
            this.isPaused = false;
            this.isTransitioning = false;

            // Clone items for infinite scrolling
            this.setupClones();

            // Calculate dimensions
            this.updateDimensions();

            // Set initial position
            this.setInitialPosition();

            // Set up event listeners
            this.setupEventListeners();

            // Start autoplay
            this.startAutoplay();
        }

        setupClones() {
            // Clone all items for better infinite scrolling
            this.originalItems.forEach(item => {
                const clone = item.cloneNode(true);
                this.carousel.appendChild(clone);
            });

            // We now have duplicates of all items
            this.allItems = Array.from(this.carousel.querySelectorAll('.carousel-item'));
        }

        updateDimensions() {
            // Get item dimensions including margins
            const firstItem = this.allItems[0];
            const style = window.getComputedStyle(firstItem);
            const marginRight = parseInt(style.marginRight) || 0;
            const marginLeft = parseInt(style.marginLeft) || 0;

            this.itemWidth = firstItem.offsetWidth + marginLeft + marginRight;
            this.containerWidth = this.carousel.parentElement.offsetWidth;

            // Number of items visible at once
            this.visibleItems = Math.floor(this.containerWidth / this.itemWidth);
        }

        setInitialPosition() {
            // Position at first item (not clone)
            this.carousel.style.transform = `translateX(0px)`;
        }

        setupEventListeners() {
            // Mouse hover pause
            this.carousel.addEventListener('mouseenter', () => {
                this.isPaused = true;
            });

            this.carousel.addEventListener('mouseleave', () => {
                this.isPaused = false;
            });

            // Handle transition end
            this.carousel.addEventListener('transitionend', () => {
                this.isTransitioning = false;

                // If we've gone past the end or beginning, reset position without animation
                if (this.currentIndex >= this.totalOriginalItems) {
                    this.resetToStart();
                } else if (this.currentIndex < 0) {
                    this.resetToEnd();
                }
            });

            // Window resize
            window.addEventListener('resize', () => {
                this.updateDimensions();
                this.updatePosition(false); // Update position without animation
            });
        }

        startAutoplay() {
            this.autoplayInterval = setInterval(() => {
                if (!this.isPaused && !this.isTransitioning) {
                    this.next();
                }
            }, this.config.slideTime);
        }

        stopAutoplay() {
            clearInterval(this.autoplayInterval);
        }

        next() {
            if (this.isTransitioning) return;

            this.currentIndex++;
            this.updatePosition(true);
        }

        prev() {
            if (this.isTransitioning) return;

            this.currentIndex--;
            this.updatePosition(true);
        }

        resetToStart() {
            // Reset to first item without animation
            this.carousel.style.transition = 'none';
            this.currentIndex = 0;
            this.updatePosition(false);

            // Force reflow to apply the style
            this.carousel.offsetHeight;

            // Restore transition
            this.carousel.style.transition = `transform ${this.config.transitionSpeed}s cubic-bezier(0.25, 0.1, 0.25, 1)`;
        }

        resetToEnd() {
            // Reset to last original item without animation
            this.carousel.style.transition = 'none';
            this.currentIndex = this.totalOriginalItems - 1;
            this.updatePosition(false);

            // Force reflow to apply the style
            this.carousel.offsetHeight;

            // Restore transition
            this.carousel.style.transition = `transform ${this.config.transitionSpeed}s cubic-bezier(0.25, 0.1, 0.25, 1)`;
        }

        updatePosition(animate = true) {
            if (animate) {
                this.isTransitioning = true;
                this.carousel.style.transition = `transform ${this.config.transitionSpeed}s cubic-bezier(0.25, 0.1, 0.25, 1)`;
            } else {
                this.carousel.style.transition = 'none';
            }

            const position = -(this.currentIndex * this.itemWidth);
            this.carousel.style.transform = `translateX(${position}px)`;
        }
    }

    // Initialize carousels
    const carousels = {};
    document.querySelectorAll('.carousel').forEach(element => {
        carousels[element.id] = new Carousel(element, carouselConfig);
    });

    // Button click handlers
    document.querySelectorAll('.next-btn').forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.dataset.target;
            carousels[targetId].next();
        });
    });

    document.querySelectorAll('.prev-btn').forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.dataset.target;
            carousels[targetId].prev();
        });
    });

    // Item click navigation
    document.querySelectorAll('.carousel-item').forEach(item => {
        item.addEventListener('click', () => {
            const href = item.dataset.href;
            if (href && href !== '#') {
                window.location.href = href;
            }
        });
    });

    // Keyboard navigation
    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowRight') {
            Object.values(carousels).forEach(carousel => carousel.next());
        } else if (event.key === 'ArrowLeft') {
            Object.values(carousels).forEach(carousel => carousel.prev());
        }
    });

    // Particle network animation
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.getElementById('canvas-container').appendChild(canvas);
    const ctx = canvas.getContext('2d');

    // Particle system
    const particles = [];
    const particleCount = 100;
    const connectionDistance = 150;
    const mouseRadius = 150;

    let mouse = {
        x: null,
        y: null,
        radius: mouseRadius
    };

    window.addEventListener('mousemove', (event) => {
        mouse.x = event.x;
        mouse.y = event.y;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        init();
    });

    // Particle class
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.velocityX = (Math.random() - 0.5) * 2;
            this.velocityY = (Math.random() - 0.5) * 2;
            this.color = `hsla(${Math.random() * 60 + 200}, 100%, 70%, 0.8)`;
        }

        update() {
            // Move particles
            this.x += this.velocityX;
            this.y += this.velocityY;

            // Mouse repulsion
            if (mouse.x != null && mouse.y != null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mouse.radius) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const force = (mouse.radius - distance) / mouse.radius;

                    const directionX = forceDirectionX * force * 5;
                    const directionY = forceDirectionY * force * 5;

                    this.velocityX -= directionX;
                    this.velocityY -= directionY;
                }
            }

            // Boundary check
            if (this.x < 0 || this.x > canvas.width) {
                this.velocityX = -this.velocityX;
            }
            if (this.y < 0 || this.y > canvas.height) {
                this.velocityY = -this.velocityY;
            }

            // Keep particles in bounds
            this.x = Math.max(0, Math.min(this.x, canvas.width));
            this.y = Math.max(0, Math.min(this.y, canvas.height));
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    function init() {
        particles.length = 0;
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function connect() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < connectionDistance) {
                    const opacity = 1 - (distance / connectionDistance);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.5})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }

        connect();
        requestAnimationFrame(animate);
    }

    init();
    animate();
});