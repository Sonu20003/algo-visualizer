let currentAlgorithm = '';
let array = [];
let targetValue = 0;
let animationSpeed = 1000;
let animationInProgress = false;
const arraySize = 10;

// DOM elements
const container = document.getElementById('container');
const arrayDisplay = document.getElementById('array-display');
const messageBox = document.getElementById('message-box');
const searchInfo = document.getElementById('search-info');
const codeDisplay = document.getElementById('code-display');
const algorithmCode = document.getElementById('algorithm-code');
const speedSlider = document.getElementById('speed-slider');

// Buttons and dropdowns
const dropdownToggle = document.getElementById('dropdown-toggle');
const dropdownContent = document.getElementById('dropdown-content');
const speedToggle = document.getElementById('dropdown-toggle-speed');
const speedContent = document.getElementById('dropdown-content-speed');
const visualizeBtn = document.getElementById('visualize');
const clearBtn = document.getElementById('clear');
const newArrayBtn = document.getElementById('new-array');
const toggleCodeBtn = document.getElementById('toggle-code');
const linearSearchBtn = document.getElementById('Linear_search');
const binarySearchBtn = document.getElementById('Binary_search');

// Event listeners for dropdown menus
dropdownToggle.addEventListener('click', () => {
    dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
});

speedToggle.addEventListener('click', () => {
    speedContent.style.display = speedContent.style.display === 'block' ? 'none' : 'block';
});

// Close dropdowns when clicking outside
document.addEventListener('click', (event) => {
    if (!event.target.matches('#dropdown-toggle') && !event.target.matches('.list-buttons')) {
        dropdownContent.style.display = 'none';
    }
    if (!event.target.matches('#dropdown-toggle-speed') && !event.target.matches('.list-buttons')) {
        speedContent.style.display = 'none';
    }
});

// Set animation speed
speedSlider.addEventListener('input', () => {
    animationSpeed = parseInt(speedSlider.value);
    messageBox.textContent = `Animation speed set to ${animationSpeed}ms`;
});

// Algorithm selection
linearSearchBtn.addEventListener('click', () => {
    currentAlgorithm = 'linear';
    dropdownToggle.textContent = 'Linear Search ▼';
    dropdownContent.style.display = 'none';
    setupNewSearch();
    showLinearSearchCode();
});

binarySearchBtn.addEventListener('click', () => {
    currentAlgorithm = 'binary';
    dropdownToggle.textContent = 'Binary Search ▼';
    dropdownContent.style.display = 'none';
    setupNewSearch(true);
    showBinarySearchCode();
});

// Speed options
document.getElementById('slow').addEventListener('click', () => {
    animationSpeed = 1500;
    speedToggle.textContent = 'Slow ▼';
    speedContent.style.display = 'none';
    messageBox.textContent = 'Animation speed set to Slow';
    speedSlider.value = animationSpeed;
});

document.getElementById('average').addEventListener('click', () => {
    animationSpeed = 1000;
    speedToggle.textContent = 'Average ▼';
    speedContent.style.display = 'none';
    messageBox.textContent = 'Animation speed set to Average';
    speedSlider.value = animationSpeed;
});

document.getElementById('fast').addEventListener('click', () => {
    animationSpeed = 500;
    speedToggle.textContent = 'Fast ▼';
    speedContent.style.display = 'none';
    messageBox.textContent = 'Animation speed set to Fast';
    speedSlider.value = animationSpeed;
});

// Main action buttons
visualizeBtn.addEventListener('click', startVisualization);
clearBtn.addEventListener('click', clearVisualization);
newArrayBtn.addEventListener('click', () => setupNewSearch(currentAlgorithm === 'binary'));
toggleCodeBtn.addEventListener('click', toggleCodeDisplay);

// Helper Functions
function generateRandomArray(size, sorted = false) {
    let newArray = [];
    for (let i = 0; i < size; i++) {
        newArray.push(Math.floor(Math.random() * 100));
    }

    if (sorted) {
        return newArray.sort((a, b) => a - b);
    }
    return newArray;
}

function generateRandomTarget(array) {
    // 75% chance to pick a value from the array, 25% chance for a random value
    if (Math.random() < 0.75) {
        const index = Math.floor(Math.random() * array.length);
        return array[index];
    } else {
        return Math.floor(Math.random() * 100);
    }
}

function setupNewSearch(sorted = false) {
    if (animationInProgress) return;

    array = generateRandomArray(arraySize, sorted);
    targetValue = generateRandomTarget(array);

    displayArray();
    displayTarget();

    clearSearchInfo();
    messageBox.textContent = `Ready to visualize ${currentAlgorithm === 'linear' ? 'Linear' : 'Binary'} Search`;

    codeDisplay.style.display = 'none';
    if (currentAlgorithm === 'linear') {
        showLinearSearchCode();
    } else if (currentAlgorithm === 'binary') {
        showBinarySearchCode();
    }
}

function displayArray() {
    arrayDisplay.innerHTML = '';
    array.forEach((value, index) => {
        const element = document.createElement('div');
        element.className = 'array-element';
        element.id = `element-${index}`;

        const valueSpan = document.createElement('span');
        valueSpan.textContent = value;
        element.appendChild(valueSpan);

        const indexSpan = document.createElement('span');
        indexSpan.className = 'index';
        indexSpan.textContent = index;
        element.appendChild(indexSpan);

        arrayDisplay.appendChild(element);
    });
}

function displayTarget() {
    // Create a target element if it doesn't exist
    if (!document.getElementById('target-element')) {
        const targetContainer = document.createElement('div');
        targetContainer.style.textAlign = 'center';
        targetContainer.style.marginTop = '30px';

        const targetLabel = document.createElement('div');
        targetLabel.textContent = 'Target Value:';
        targetLabel.style.marginBottom = '10px';
        targetLabel.style.fontWeight = 'bold';

        const targetElement = document.createElement('div');
        targetElement.className = 'array-element target-element';
        targetElement.id = 'target-element';

        const valueSpan = document.createElement('span');
        valueSpan.textContent = targetValue;
        targetElement.appendChild(valueSpan);

        targetContainer.appendChild(targetLabel);
        targetContainer.appendChild(targetElement);
        container.insertBefore(targetContainer, searchInfo);
    } else {
        const targetElement = document.getElementById('target-element');
        targetElement.querySelector('span').textContent = targetValue;
    }
}

function clearSearchInfo() {
    searchInfo.innerHTML = '';
    const elements = document.querySelectorAll('.array-element');
    elements.forEach(el => {
        el.classList.remove('current', 'found', 'disabled');
        const pointer = el.querySelector('.pointer');
        if (pointer) {
            pointer.remove();
        }
    });

    // Remove pointer elements
    const pointers = document.querySelectorAll('.binary-pointers');
    pointers.forEach(p => p.remove());
}

async function startVisualization() {
    if (animationInProgress || !currentAlgorithm) {
        messageBox.textContent = !currentAlgorithm ?
            'Please select an algorithm first!' :
            'Animation in progress, please wait...';
        return;
    }

    clearSearchInfo();
    animationInProgress = true;
    visualizeBtn.disabled = true;

    if (currentAlgorithm === 'linear') {
        await visualizeLinearSearch();
    } else if (currentAlgorithm === 'binary') {
        await visualizeBinarySearch();
    }

    animationInProgress = false;
    visualizeBtn.disabled = false;
}

function clearVisualization() {
    if (animationInProgress) {
        // Force stop animation
        animationInProgress = false;
        messageBox.textContent = 'Visualization stopped';
    }

    array = [];
    targetValue = 0;
    currentAlgorithm = '';

    // Clear display
    arrayDisplay.innerHTML = '';
    searchInfo.innerHTML = '';
    codeDisplay.style.display = 'none';

    // Reset dropdown text
    dropdownToggle.textContent = 'Algorithms ▼';

    // Remove target element
    const targetContainer = document.getElementById('target-element');
    if (targetContainer) {
        targetContainer.parentElement.remove();
    }

    messageBox.textContent = 'Board cleared. Select an algorithm to begin';
}

function toggleCodeDisplay() {
    codeDisplay.style.display = codeDisplay.style.display === 'none' ? 'block' : 'none';
}

// Linear Search Visualization
async function visualizeLinearSearch() {
    searchInfo.innerHTML = `
                <h3>Linear Search</h3>
                <p>Checking each element from left to right until the target value is found.</p>
                <div class="stats" id="iteration-count">Iterations: 0</div>
            `;

    const iterationCount = document.getElementById('iteration-count');
    let found = false;

    for (let i = 0; i < array.length; i++) {
        if (!animationInProgress) break;

        // Update current element
        const element = document.getElementById(`element-${i}`);
        element.classList.add('current');

        // Add a pointer to the current element
        const pointer = document.createElement('div');
        pointer.className = 'pointer';
        pointer.textContent = '▼';
        element.appendChild(pointer);

        // Update iteration count
        iterationCount.textContent = `Iterations: ${i + 1}`;

        // Check if current element equals target
        await new Promise(resolve => setTimeout(resolve, animationSpeed));

        if (array[i] === targetValue) {
            element.classList.remove('current');
            element.classList.add('found');
            found = true;

            searchInfo.innerHTML += `
                        <div style="margin-top: 15px; color: green; font-weight: bold;">
                            Element found at index ${i}!
                        </div>`;

            const targetElement = document.getElementById('target-element');
            targetElement.classList.add('found');
            break;
        }

        // Remove current class after checking
        element.classList.remove('current');
        pointer.remove();
    }

    if (!found && animationInProgress) {
        searchInfo.innerHTML += `
                    <div style="margin-top: 15px; color: red; font-weight: bold;">
                        Element not found in the array!
                    </div>`;
    }
}

// Binary Search Visualization
async function visualizeBinarySearch() {
    searchInfo.innerHTML = `
                <h3>Binary Search</h3>
                <p>For sorted arrays, this divides the search interval in half with each comparison.</p>
                <div class="stats" id="iteration-count">Iterations: 0</div>
            `;

    // Create pointers
    const pointersContainer = document.createElement('div');
    pointersContainer.className = 'binary-pointers';
    container.insertBefore(pointersContainer, searchInfo);

    // Add indicators for start, mid, end
    const startPointer = document.createElement('div');
    startPointer.className = 'pointer-label';
    startPointer.textContent = 'Start';
    startPointer.id = 'start-pointer';

    const midPointer = document.createElement('div');
    midPointer.className = 'pointer-label';
    midPointer.textContent = 'Mid';
    midPointer.id = 'mid-pointer';

    const endPointer = document.createElement('div');
    endPointer.className = 'pointer-label';
    endPointer.textContent = 'End';
    endPointer.id = 'end-pointer';

    pointersContainer.appendChild(startPointer);
    pointersContainer.appendChild(midPointer);
    pointersContainer.appendChild(endPointer);

    const iterationCount = document.getElementById('iteration-count');
    let found = false;
    let start = 0;
    let end = array.length - 1;
    let iteration = 0;

    updatePointers(start, end);

    while (start <= end && animationInProgress) {
        iteration++;
        iterationCount.textContent = `Iterations: ${iteration}`;

        let mid = Math.floor((start + end) / 2);
        updatePointers(start, end, mid);

        // Highlight the middle element
        const midElement = document.getElementById(`element-${mid}`);
        midElement.classList.add('current');

        // Add a special pointer to mid
        const pointer = document.createElement('div');
        pointer.className = 'pointer';
        pointer.textContent = '▼';
        midElement.appendChild(pointer);

        await new Promise(resolve => setTimeout(resolve, animationSpeed));

        if (array[mid] === targetValue) {
            midElement.classList.remove('current');
            midElement.classList.add('found');
            found = true;

            searchInfo.innerHTML += `
                        <div style="margin-top: 15px; color: green; font-weight: bold;">
                            Element found at index ${mid}!
                        </div>`;

            const targetElement = document.getElementById('target-element');
            targetElement.classList.add('found');
            break;
        } else if (array[mid] < targetValue) {
            // Disable all elements from start to mid
            for (let i = start; i <= mid; i++) {
                document.getElementById(`element-${i}`).classList.add('disabled');
            }

            searchInfo.innerHTML += `
                        <div style="margin-top: 5px;">
                            ${array[mid]} < ${targetValue}, searching right half
                        </div>`;

            start = mid + 1;
        } else {
            // Disable all elements from mid to end
            for (let i = mid; i <= end; i++) {
                document.getElementById(`element-${i}`).classList.add('disabled');
            }

            searchInfo.innerHTML += `
                        <div style="margin-top: 5px;">
                            ${array[mid]} > ${targetValue}, searching left half
                        </div>`;

            end = mid - 1;
        }

        midElement.classList.remove('current');
        pointer.remove();
    }

    if (!found && animationInProgress) {
        searchInfo.innerHTML += `
                    <div style="margin-top: 15px; color: red; font-weight: bold;">
                        Element not found in the array!
                    </div>`;
    }
}

function updatePointers(start, end, mid = null) {
    const startPointer = document.getElementById('start-pointer');
    const endPointer = document.getElementById('end-pointer');
    const midPointer = document.getElementById('mid-pointer');

    if (startPointer && endPointer) {
        // Position pointers based on the current start and end indices
        const startElement = document.getElementById(`element-${start}`);
        const endElement = document.getElementById(`element-${end}`);

        if (startElement && endElement) {
            const startRect = startElement.getBoundingClientRect();
            const endRect = endElement.getBoundingClientRect();
            const containerRect = arrayDisplay.getBoundingClientRect();

            startPointer.style.position = 'absolute';
            startPointer.style.left = `${startRect.left - containerRect.left + (startRect.width / 2)}px`;
            startPointer.style.top = `${startRect.bottom - containerRect.top + 10}px`;

            endPointer.style.position = 'absolute';
            endPointer.style.left = `${endRect.left - containerRect.left + (endRect.width / 2)}px`;
            endPointer.style.top = `${endRect.bottom - containerRect.top + 10}px`;

            if (mid !== null && midPointer) {
                const midElement = document.getElementById(`element-${mid}`);
                if (midElement) {
                    const midRect = midElement.getBoundingClientRect();
                    midPointer.style.position = 'absolute';
                    midPointer.style.left = `${midRect.left - containerRect.left + (midRect.width / 2)}px`;
                    midPointer.style.top = `${midRect.bottom - containerRect.top + 10}px`;
                }
            }
        }
    }
}

// Code display functions
function showLinearSearchCode() {
    algorithmCode.innerHTML = `// Linear Search Algorithm
function linearSearch(arr, target) {
    // Time Complexity: O(n) - where n is the array length
    // Space Complexity: O(1) - constant space

    // Iterate through each element in the array
    for (let i = 0; i < arr.length; i++) {
        // If current element equals the target
        if (arr[i] === target) {
            return i; // Return the index where target is found
        }
    }

    // If target is not found in the array
    return -1;
}`;
}

function showBinarySearchCode() {
    algorithmCode.innerHTML = `// Binary Search Algorithm
function binarySearch(arr, target) {
    // Time Complexity: O(log n) - where n is the array length
    // Space Complexity: O(1) - constant space
    // Note: Array MUST be sorted for binary search to work

    let start = 0;
    let end = arr.length - 1;

    while (start <= end) {
        // Find the middle index
        let mid = Math.floor((start + end) / 2);

        // If target is found at mid, return mid
        if (arr[mid] === target) {
            return mid;
        }

        // If target is greater, ignore left half
        if (arr[mid] < target) {
            start = mid + 1;
        }
        // If target is smaller, ignore right half
        else {
            end = mid - 1;
        }
    }

    // Target is not present in the array
    return -1;
}`;
}

// Initialize the visualizer
window.onload = function() {
    messageBox.textContent = 'Select an algorithm and click "Visualize" to begin';
    currentAlgorithm = '';

    // Responsive positioning for dropdowns
    window.addEventListener('resize', function() {
        if (currentAlgorithm === 'binary') {
            const start = document.getElementById('start-pointer');
            const end = document.getElementById('end-pointer');
            const mid = document.getElementById('mid-pointer');
            if (start && end && mid) {
                updatePointers(start.index, end.index, mid.index);
            }
        }
    });
};