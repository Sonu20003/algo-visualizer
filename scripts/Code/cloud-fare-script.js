function loadCodeScripts() {
    const scripts = [
        "https://cdnjs.cloudflare.com/ajax/libs/prism/1.24.1/prism.min.js",
        "https://cdnjs.cloudflare.com/ajax/libs/prism/1.24.1/components/prism-c.min.js",
        "https://cdnjs.cloudflare.com/ajax/libs/prism/1.24.1/components/prism-cpp.min.js",
        "https://cdnjs.cloudflare.com/ajax/libs/prism/1.24.1/components/prism-java.min.js",
        "https://cdnjs.cloudflare.com/ajax/libs/prism/1.24.1/components/prism-python.min.js",
    ];

    scripts.forEach(src => {
        let script = document.createElement("script");
        script.src = src;
        script.async = false; // Load scripts in order
        document.head.appendChild(script);
    });
}

document.addEventListener("DOMContentLoaded", loadCodeScripts);
