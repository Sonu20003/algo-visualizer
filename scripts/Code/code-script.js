const floatingButton = document.querySelector('.code-floater');
const modal = document.querySelector('.code-modal');
const langButtons = document.querySelectorAll('.lang-btn');

floatingButton.addEventListener('click', toggleModal);
langButtons.forEach(btn => {
    btn.addEventListener('click', () => switchLang(btn.dataset.lang));
});

function toggleModal() {
    modal.classList.toggle('visible');
    if (modal.classList.contains('visible')) {
        Prism.highlightElement(document.querySelector('.code-block.active code'));
    }
}

function closeCode() {
    modal.classList.remove('visible');
}

function switchLang(lang) {
    langButtons.forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.code-block').forEach(block => block.classList.remove('active'));

    const activeBtn = document.querySelector(`[data-lang="${lang}"]`);
    const activeBlock = document.getElementById(lang);
    activeBtn.classList.add('active');
    activeBlock.classList.add('active');

    Prism.highlightElement(activeBlock.querySelector('code'));
}

function copyCode(btn) {
    const code = document.querySelector('.code-block.active code').textContent;
    navigator.clipboard.writeText(code)
        .then(() => {
            btn.textContent = 'Copied!';
            setTimeout(() => btn.textContent = 'Copy', 3000);
        })
        .catch(err => {
            console.error('Copy failed:', err);
            btn.textContent = 'Error';
            setTimeout(() => btn.textContent = 'Copy', 2000);
        });
}