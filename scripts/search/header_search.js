import {linearSearch, binarySearch} from '../sorting/visualizer.js';

let algo = null;
const ls = document.getElementById('Linear_search');
const bs = document.getElementById('Binary_search');
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

ls.onclick = () => {
    algo = 'linear';
    hideDropdown();
    dropdownToggle.innerHTML = "Linear Search ▼";
};

bs.onclick = () => {
    algo = 'binary';
    hideDropdown();
    dropdownToggle.innerHTML = "Binary Search ▼";
};

if(algo === null)
    msg.innerHTML = "Please select a Searching Algorithm !"

visualise.onclick= function visualiser(){
    console.log(algo);
    if(algo === 'linear'){
        msg.innerHTML = "Linear Search";
        linearSearch();
    }
    if(algo === 'binary') {
        msg.innerHTML = "Binary Search";
        binarySearch();
    }
}

// Dropdown interaction
document.querySelectorAll('.dropdown').forEach(dropdown => {
    const header = dropdown.querySelector('.dropdown-header');
    const content = dropdown.querySelector('#dropdown-content') || dropdown.querySelector('#dropdown-content-speed');

    if (header && content) {
        header.addEventListener('click', () => {
            content.style.display = content.style.display === 'block' ? 'none' : 'block';
        });
    }
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