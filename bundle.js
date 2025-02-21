document.querySelectorAll('.nav-button').forEach(button => {
    button.addEventListener('click', (event) => {
        const buttonId = event.target.id;

        switch (buttonId) {
            case 'searching-button':
                window.location.href = 'search.html';
                break;
            case 'sorting-button':
                window.location.href = 'sort.html';
                break;
            case 'matrix-button':
                window.location.href = 'matrixPathFinder.html';
                break;
            case 'graph-button':
                window.location.href = 'graphMaker.html';
                break;
            case 'string-button':
                window.location.href = 'stringMatching.html';
                break;
            default:
                alert('Unknown action!');
        }
    });
});

// UPDATED JS WITH DEBUGGING
document.addEventListener('DOMContentLoaded', () => {
    const ball = document.querySelector('.bouncing-ball');
    let posX = 50; // Starting X position
    let posY = 50; // Starting Y position
    let velX = 3;
    let velY = 2;
    let maxX, maxY;

    function updateDimensions() {
        maxX = window.innerWidth - ball.offsetWidth;
        maxY = window.innerHeight - ball.offsetHeight;
    }

    function animate() {
        // Update position
        posX += velX;
        posY += velY;

        // Check collisions
        if (posX >= maxX || posX <= 0) {
            velX *= -0.95; // Reverse and dampen X velocity
            ball.style.background = `radial-gradient(circle at 30% 30%, ${getRandomColor()}, ${getRandomColor()})`;
        }

        if (posY >= maxY || posY <= 0) {
            velY *= -0.95; // Reverse and dampen Y velocity
            ball.style.boxShadow = `0 0 25px ${getRandomColor(0.5)}`;
        }

        // Apply boundaries
        posX = Math.max(0, Math.min(posX, maxX));
        posY = Math.max(0, Math.min(posY, maxY));

        // Update position
        ball.style.transform = `translate(${posX}px, ${posY}px)`;

        requestAnimationFrame(animate);
    }

    function getRandomColor(alpha = 1) {
        const hue = Math.random() * 360;
        return `hsla(${hue}, 100%, 50%, ${alpha})`;
    }

    // Initialize
    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    // Start with random direction
    velX = (Math.random() - 0.5) * 8;
    velY = (Math.random() - 0.5) * 8;

    animate();
});
