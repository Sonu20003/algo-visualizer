import {bubbleSort, selectionSort, insertionSort, mergeSort} from './visualizer.js';

let algo = null;
const bubble = document.getElementById('bubble_sort');
const selection = document.getElementById('selection_sort');
const insertion = document.getElementById('insertion_sort');
const merge = document.getElementById('merge_sort');

const visualise = document.getElementById('visualise');
const dd = document.getElementById("dropdown-content");
const dropdownToggle = document.getElementById("dropdown-toggle");
const msg = document.getElementById('message-box');

document.getElementById('back').addEventListener('click', () => {
    window.history.back();
});

function toggleDropdown() {
    if (getComputedStyle(dd).display === "none") {
        dd.style.display = "block";
        dropdownToggle.innerHTML = "Algorithms ▲";
    } else {
        dd.style.display = "none";
        dropdownToggle.innerHTML = "Algorithms ▼";
    }
}

function hideDropdown() {
    dd.style.display = "none";
    dropdownToggle.innerHTML = "Algorithms ▼";
}

dropdownToggle.addEventListener("click", toggleDropdown);

bubble.onclick = () => {
    algo = 'bubble';
    hideDropdown();
    dropdownToggle.innerHTML = "Bubble Sort ▼";
};

selection.onclick = () => {
    algo = 'selection';
    hideDropdown();
    dropdownToggle.innerHTML = "Selection Sort ▼";
};
insertion.onclick = () => {
    algo = 'insertion';
    hideDropdown();
    dropdownToggle.innerHTML = "Insertion Sort ▼";
};
merge.onclick = () => {
    algo = 'merge';
    hideDropdown();
    dropdownToggle.innerHTML = "Merge Sort ▼";
};



if(algo === null)
    msg.innerHTML = "Please select a Sorting Algorithm !"

visualise.onclick= function visualiser(){
    console.log(algo);
    if(algo === 'bubble'){
        msg.innerHTML = "Bubble Sort";
        bubbleSort();
    }
    else if(algo === 'selection'){
        msg.innerHTML = "Selection Sort";
        selectionSort();
    }
    else if(algo === 'insertion'){
        msg.innerHTML = "Insertion Sort";
        insertionSort();
    }
    else if(algo === 'merge'){
        msg.innerHTML = "Merge Sort";
        mergeSort();
    }
    else {
        msg.innerHTML = "Please select a Sorting Algorithm !"
    }

}
// Dropdown interaction
document.querySelectorAll('.dropdown').forEach(dropdown => {
    const header = dropdown.querySelector('.dropdown-header');
    const contents = dropdown.querySelectorAll('#dropdown-content, #dropdown-content-speed');

    if (!header || contents.length === 0) return; // Prevent errors if elements are missing

    header.addEventListener('click', () => {
        contents.forEach(content => {
            content.style.display = content.style.display === 'block' ? 'none' : 'block';
        });
    });
});


// Close dropdowns when clicking outside
window.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown')) {
        document.querySelectorAll('#dropdown-content, #dropdown-content-speed').forEach(dd => {
            dd.style.display = 'none';
        });
    }
});

// Add smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
