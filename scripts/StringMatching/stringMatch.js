let currentAlgorithm = 'naive';
let visualizationSteps = [];
let currentStep = 0;
let intervalId = null;

function selectAlgorithm(algo) {
    currentAlgorithm = algo;
    document.querySelectorAll('.algorithm-selector button').forEach(btn => {
        btn.classList.toggle('active', btn.onclick.name.includes(algo));
    });
}

function visualize() {
    const text = document.getElementById('textInput').value;
    const pattern = document.getElementById('patternInput').value;

    if (!text || !pattern) {
        alert('Please enter both text and pattern');
        return;
    }

    if (pattern.length > text.length) {
        alert('Pattern cannot be longer than text');
        return;
    }

    visualizationSteps = [];
    currentStep = 0;

    switch(currentAlgorithm) {
        case 'naive':
            naiveSearch(text, pattern);
            break;
        case 'kmp':
            kmpSearch(text, pattern);
            break;
        case 'rabin-karp':
            rabinKarpSearch(text, pattern);
            break;
    }

    startVisualization(text, pattern);
}

// Naive Algorithm Implementation
function naiveSearch(text, pattern) {
    const n = text.length;
    const m = pattern.length;

    for (let i = 0; i <= n - m; i++) {
        let j;
        visualizationSteps.push({
            textIndex: i,
            patternIndex: 0,
            explanation: `Checking position ${i} of text...`
        });

        for (j = 0; j < m; j++) {
            visualizationSteps.push({
                textIndex: i + j,
                patternIndex: j,
                explanation: `Comparing text[${i+j}] (${text[i+j]}) with pattern[${j}] (${pattern[j]})`
            });

            if (text[i+j] !== pattern[j]) {
                visualizationSteps.push({
                    explanation: `Mismatch at position ${j} of pattern. Moving to next position...`
                });
                break;
            }
        }

        if (j === m) {
            visualizationSteps.push({
                explanation: `Pattern found at index ${i}`,
                matches: [i]
            });
        }
    }
}

// KMP Algorithm Implementation
function kmpSearch(text, pattern) {
    const lps = computeLPS(pattern);
    const n = text.length;
    const m = pattern.length;
    let i = 0, j = 0;

    visualizationSteps.push({
        explanation: `Preprocessing LPS array: [${lps.join(', ')}]`
    });

    while (i < n) {
        visualizationSteps.push({
            textIndex: i,
            patternIndex: j,
            explanation: `Comparing text[${i}] (${text[i]}) with pattern[${j}] (${pattern[j]})`
        });

        if (pattern[j] === text[i]) {
            i++;
            j++;
        }

        if (j === m) {
            visualizationSteps.push({
                explanation: `Pattern found at index ${i - j}`,
                matches: [i - j]
            });
            j = lps[j - 1];
        } else if (i < n && pattern[j] !== text[i]) {
            if (j !== 0) {
                visualizationSteps.push({
                    explanation: `Mismatch. Using LPS table to shift pattern by ${j - lps[j - 1]} positions`
                });
                j = lps[j - 1];
            } else {
                visualizationSteps.push({
                    explanation: `Mismatch. Moving to next character in text`
                });
                i++;
            }
        }
    }
}

function computeLPS(pattern) {
    const lps = new Array(pattern.length).fill(0);
    let len = 0;
    let i = 1;

    while (i < pattern.length) {
        if (pattern[i] === pattern[len]) {
            len++;
            lps[i] = len;
            i++;
        } else {
            if (len !== 0) {
                len = lps[len - 1];
            } else {
                lps[i] = 0;
                i++;
            }
        }
    }
    return lps;
}

// Rabin-Karp Algorithm Implementation
function rabinKarpSearch(text, pattern) {
    const d = 256;
    const q = 101;
    const n = text.length;
    const m = pattern.length;
    let p = 0, t = 0, h = 1;

    for (let i = 0; i < m - 1; i++) {
        h = (h * d) % q;
    }

    for (let i = 0; i < m; i++) {
        p = (d * p + pattern.charCodeAt(i)) % q;
        t = (d * t + text.charCodeAt(i)) % q;
    }

    visualizationSteps.push({
        explanation: `Pattern hash: ${p}, Initial window hash: ${t}`
    });

    for (let i = 0; i <= n - m; i++) {
        visualizationSteps.push({
            textIndex: i,
            patternIndex: 0,
            explanation: `Checking window starting at ${i} (hash: ${t})`
        });

        if (p === t) {
            let match = true;
            visualizationSteps.push({
                explanation: `Hash match found. Checking characters...`
            });

            for (let j = 0; j < m; j++) {
                visualizationSteps.push({
                    textIndex: i + j,
                    patternIndex: j,
                    explanation: `Comparing text[${i+j}] (${text[i+j]}) with pattern[${j}] (${pattern[j]})`
                });

                if (text[i+j] !== pattern[j]) {
                    match = false;
                    break;
                }
            }

            if (match) {
                visualizationSteps.push({
                    explanation: `Pattern found at index ${i}`,
                    matches: [i]
                });
            }
        }

        if (i < n - m) {
            t = (d * (t - text.charCodeAt(i) * h) + text.charCodeAt(i + m)) % q;
            t = t < 0 ? t + q : t;
            visualizationSteps.push({
                explanation: `Rolling hash to next window: ${t}`
            });
        }
    }
}

// Visualization Functions
function startVisualization(text, pattern) {
    const textDisplay = document.getElementById('textDisplay');
    const patternDisplay = document.getElementById('patternDisplay');
    const explanationDiv = document.getElementById('explanation');

    // Create text display
    textDisplay.innerHTML = text.split('').map((char, i) =>
        `<span class="char-box" id="text-${i}" data-index="${i}">${char}</span>`
    ).join('');

    // Create pattern display
    patternDisplay.innerHTML = pattern.split('').map((char, i) =>
        `<span class="char-box" id="pattern-char-${i}" data-index="${i}">${char}</span>`
    ).join('');

    explanationDiv.innerHTML = '';

    if (intervalId) clearInterval(intervalId);
    currentStep = 0;
    intervalId = setInterval(updateVisualization, 1000);
}

function updateVisualization() {
    if (currentStep >= visualizationSteps.length) {
        clearInterval(intervalId);
        return;
    }

    const step = visualizationSteps[currentStep];
    const explanationDiv = document.getElementById('explanation');
    explanationDiv.innerHTML = step.explanation.replace(/\d+/g, m => `<span class="hash-display">${m}</span>`);

    // Clear previous highlights
    document.querySelectorAll('.char-box').forEach(el => {
        el.classList.remove('current', 'pattern-current', 'highlight');
    });

    // Highlight text character
    if (step.textIndex !== undefined) {
        const textChar = document.getElementById(`text-${step.textIndex}`);
        if (textChar) {
            textChar.classList.add('current', 'highlight');
        }
    }

    // Highlight pattern character
    if (step.patternIndex !== undefined) {
        const patternChar = document.getElementById(`pattern-char-${step.patternIndex}`);
        if (patternChar) {
            patternChar.classList.add('pattern-current', 'highlight');
        }
    }

    // Highlight matches
    if (step.matches) {
        step.matches.forEach(matchIndex => {
            for (let i = matchIndex; i < matchIndex + document.getElementById('patternInput').value.length; i++) {
                const span = document.getElementById(`text-${i}`);
                if (span) {
                    span.classList.add('match');
                    span.style.animation = 'pulse 0.5s ease';
                }
            }
        });
    }

    currentStep++;
}