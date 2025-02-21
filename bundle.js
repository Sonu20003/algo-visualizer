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

