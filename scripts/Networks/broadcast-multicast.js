document.addEventListener('DOMContentLoaded', function() {
    // --- Constants ---
    const NODE_COUNT = 12; // Total number of nodes in the network
    const SOURCE_NODE_INDEX = 0; // The index of the source node (Node 1)
    const PACKET_DURATION_MS = 1000; // Base duration for packet travel (simplified)
    const PACKET_STAGGER_MS = 150; // Delay between packets being sent
    const NODE_SIZE = 35; // Fixed size of the network nodes (from CSS)

    // --- DOM Elements ---
    const broadcastViz = document.getElementById('broadcast-viz');
    const multicastViz = document.getElementById('multicast-viz');
    const startBroadcastBtn = document.getElementById('start-broadcast');
    const startMulticastBtn = document.getElementById('start-multicast');
    const resetBtn = document.getElementById('reset');
    const multicastGroupDisplay = document.getElementById('multicast-group-display');

    // --- State Variables ---
    let broadcastNodes = [];
    let multicastNodes = [];
    let activeAnimations = []; // Store requestAnimationFrame IDs
    let activePackets = []; // Store packet elements
    let currentMulticastGroup = new Set([2, 5, 8, 11]); // Default multicast group (Node 3, 6, 9, 12)
    let currentVisualizationMode = null; // 'broadcast' or 'multicast'

    // --- Utility Functions ---

    /**
     * Calculates the position for a node in a circle.
     * @param {number} index - The index of the node.
     * @param {number} totalNodes - Total number of nodes.
     * @param {number} centerX - X coordinate of the circle center.
     * @param {number} centerY - Y coordinate of the circle center.
     * @param {number} radius - Radius of the circle.
     * @returns {{x: number, y: number}} - Calculated x and y coordinates (center of the node).
     */
    function calculateNodePosition(index, totalNodes, centerX, centerY, radius) {
        const angle = (index / totalNodes) * 2 * Math.PI - Math.PI / 2; // Start from top
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        return { x, y };
    }

    /**
     * Updates the display of the current multicast group.
     */
    function updateMulticastGroupDisplay() {
        if (currentMulticastGroup.size === 0) {
            multicastGroupDisplay.textContent = 'None Selected';
        } else {
            const sortedMembers = Array.from(currentMulticastGroup).sort((a, b) => a - b);
            multicastGroupDisplay.innerHTML = sortedMembers
                .map(nodeIndex => `<span>Node ${nodeIndex + 1}</span>`)
                .join('');
        }
    }

    // --- Network Setup ---

    /**
     * Sets up the network nodes in a given container.
     * @param {HTMLElement} container - The DOM element to append nodes to.
     * @param {Array<Object>} nodesArray - The array to store node data.
     * @param {boolean} isMulticastViz - True if setting up the multicast visualization.
     */
    function setupNetwork(container, nodesArray, isMulticastViz = false) {
        const width = container.clientWidth;
        const height = container.clientHeight;
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) * 0.35;

        // Clear existing nodes first (important for resize)
        while (container.querySelector('.network-node')) {
            container.removeChild(container.querySelector('.network-node'));
        }
        // Clear the nodesArray to prevent duplicates on resize
        nodesArray.length = 0;

        for (let i = 0; i < NODE_COUNT; i++) {
            const { x, y } = calculateNodePosition(i, NODE_COUNT, centerX, centerY, radius);

            const node = document.createElement('div');
            node.className = 'network-node';
            if (i === SOURCE_NODE_INDEX) {
                node.classList.add('source');
            } else if (isMulticastViz && currentMulticastGroup.has(i)) {
                node.classList.add('multicast-member');
            }
            node.textContent = (i + 1);

            container.appendChild(node); // Append first

            // Set position using fixed NODE_SIZE for accurate centering
            node.style.left = `${x - NODE_SIZE / 2}px`;
            node.style.top = `${y - NODE_SIZE / 2}px`;

            nodesArray.push({
                element: node,
                x: x, // Store the calculated center X, Y
                y: y,
                isSource: i === SOURCE_NODE_INDEX,
                index: i // Store the index for easy reference
            });
        }
    }

    /**
     * Draws concentric dashed circles for network aesthetic.
     * @param {HTMLElement} container - The DOM element to append circles to.
     */
    function drawNetworkCircles(container) {
        const width = container.clientWidth;
        const height = container.clientHeight;
        const centerX = width / 2;
        const centerY = height / 2;

        // Clear existing circles first (important for resize)
        while (container.querySelector('.network-circle')) {
            container.removeChild(container.querySelector('.network-circle'));
        }

        for (let i = 1; i <= 3; i++) {
            const circle = document.createElement('div');
            circle.className = 'network-circle';
            const size = Math.min(width, height) * (0.2 + i * 0.15); // Varying sizes
            circle.style.width = `${size}px`;
            circle.style.height = `${size}px`;
            circle.style.left = `${centerX - size / 2}px`;
            circle.style.top = `${centerY - size / 2}px`;
            container.appendChild(circle);
        }
    }

    /**
     * Toggles a node's membership in the multicast group.
     * @param {number} nodeIndex - The index of the node to toggle.
     * @param {HTMLElement} nodeElement - The DOM element of the node.
     */
    function toggleMulticastMembership(nodeIndex, nodeElement) {
        if (currentMulticastGroup.has(nodeIndex)) {
            currentMulticastGroup.delete(nodeIndex);
            nodeElement.classList.remove('multicast-member');
        } else {
            currentMulticastGroup.add(nodeIndex);
            nodeElement.classList.add('multicast-member');
        }
        updateMulticastGroupDisplay();
        // If multicast is active, restart to reflect changes
        if (currentVisualizationMode === 'multicast') {
            startMulticast();
        }
    }

    // --- Animation Functions ---

    /**
     * Creates and animates a packet from source to target with a simple linear path.
     * @param {HTMLElement} container - The container for the packet.
     * @param {Object} sourceNode - The source node object.
     * @param {Object} targetNode - The target node object.
     * @returns {Promise<void>} - A promise that resolves when the packet animation is complete.
     */
    function createPacket(container, sourceNode, targetNode) {
        return new Promise(resolve => {
            const packet = document.createElement('div');
            packet.className = 'packet';
            container.appendChild(packet);
            activePackets.push(packet);

            // Initial position (center of packet)
            const packetSize = 15; // From CSS .packet width/height
            packet.style.left = `${sourceNode.x - packetSize / 2}px`;
            packet.style.top = `${sourceNode.y - packetSize / 2}px`;

            const startTime = performance.now();
            const duration = PACKET_DURATION_MS;

            const animatePacket = (timestamp) => {
                const elapsed = timestamp - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easedProgress = 0.5 - Math.cos(progress * Math.PI) / 2; // Ease-in-out

                // Simple linear interpolation
                const currentX = sourceNode.x + (targetNode.x - sourceNode.x) * easedProgress;
                const currentY = sourceNode.y + (targetNode.y - sourceNode.y) * easedProgress;

                packet.style.left = `${currentX - packetSize / 2}px`;
                packet.style.top = `${currentY - packetSize / 2}px`;

                if (progress < 1) {
                    activeAnimations.push(requestAnimationFrame(animatePacket));
                } else {
                    // Animation complete
                    if (container.contains(packet)) {
                        packet.remove(); // Remove packet element
                    }

                    // Animate target node reception
                    targetNode.element.classList.add('receiving');
                    targetNode.element.addEventListener('animationend', () => {
                        targetNode.element.classList.remove('receiving');
                        targetNode.element.classList.add('highlighted'); // Keep highlighted briefly
                        setTimeout(() => {
                            targetNode.element.classList.remove('highlighted');
                            resolve(); // Resolve the promise
                        }, 300);
                    }, { once: true });
                }
            };

            activeAnimations.push(requestAnimationFrame(animatePacket));
        });
    }

    /**
     * Adds a temporary "sending" highlight to the source node.
     * @param {Object} sourceNode - The source node object.
     */
    function animateSourceSending(sourceNode) {
        sourceNode.element.classList.add('highlighted');
        setTimeout(() => {
            sourceNode.element.classList.remove('highlighted');
        }, 500); // Short highlight
    }

    // --- Visualization Logic ---

    async function startBroadcast() {
        resetAll();
        currentVisualizationMode = 'broadcast';
        startBroadcastBtn.classList.add('active');
        startMulticastBtn.classList.remove('active');
        setControlsDisabled(true);

        const sourceNode = broadcastNodes[SOURCE_NODE_INDEX];
        animateSourceSending(sourceNode);

        const packetPromises = [];
        let packetCount = 0;

        for (let i = 0; i < broadcastNodes.length; i++) {
            const targetNode = broadcastNodes[i];
            if (!targetNode.isSource) {
                const delay = packetCount * PACKET_STAGGER_MS;
                packetCount++;
                const promise = new Promise(resolve => {
                    setTimeout(() => {
                        createPacket(broadcastViz, sourceNode, targetNode).then(resolve);
                    }, delay);
                });
                packetPromises.push(promise);
            }
        }

        // Wait for all packets to finish before scheduling replay
        await Promise.all(packetPromises);

        setTimeout(() => {
            if (currentVisualizationMode === 'broadcast') {
                startBroadcast(); // Auto-replay
            }
        }, PACKET_DURATION_MS + 1000); // Wait a bit after last packet finishes

        setControlsDisabled(false);
    }

    async function startMulticast() {
        resetAll();
        currentVisualizationMode = 'multicast';
        startMulticastBtn.classList.add('active');
        startBroadcastBtn.classList.remove('active');
        setControlsDisabled(true);

        const sourceNode = multicastNodes[SOURCE_NODE_INDEX];
        animateSourceSending(sourceNode);

        // Highlight multicast group members
        multicastNodes.forEach(node => {
            if (currentMulticastGroup.has(node.index)) {
                node.element.classList.add('multicast-member'); // Re-add class if reset removed it
                node.element.classList.add('highlighted'); // Temporarily highlight
                setTimeout(() => node.element.classList.remove('highlighted'), 1000);
            }
        });

        const packetPromises = [];
        let packetCount = 0;

        // Filter nodes that are part of the multicast group
        const targetMembers = multicastNodes.filter(node => currentMulticastGroup.has(node.index));

        for (let i = 0; i < targetMembers.length; i++) {
            const targetNode = targetMembers[i];
            const delay = packetCount * PACKET_STAGGER_MS;
            packetCount++;
            const promise = new Promise(resolve => {
                setTimeout(() => {
                    createPacket(multicastViz, sourceNode, targetNode).then(resolve);
                }, delay);
            });
            packetPromises.push(promise);
        }

        await Promise.all(packetPromises);

        setTimeout(() => {
            if (currentVisualizationMode === 'multicast') {
                startMulticast(); // Auto-replay
            }
        }, PACKET_DURATION_MS + 1000); // Wait a bit after last packet finishes

        setControlsDisabled(false);
    }

    /**
     * Resets both visualizations to their initial state.
     */
    function resetAll() {
        // Cancel all pending animations
        activeAnimations.forEach(id => cancelAnimationFrame(id));
        activeAnimations = [];

        // Remove all packets
        activePackets.forEach(packet => {
            if (packet.parentNode) {
                packet.parentNode.removeChild(packet);
            }
        });
        activePackets = [];

        // Remove all highlights and special classes from nodes
        [...broadcastNodes, ...multicastNodes].forEach(node => {
            node.element.classList.remove('highlighted', 'receiving', 'multicast-member');
            node.element.style.boxShadow = ''; // Clear inline styles
        });

        // Ensure multicast members are correctly colored for the next run
        multicastNodes.forEach(node => {
            if (currentMulticastGroup.has(node.index)) {
                node.element.classList.add('multicast-member');
            }
        });

        // Reset buttons and mode
        startBroadcastBtn.classList.remove('active');
        startMulticastBtn.classList.remove('active');
        currentVisualizationMode = null;
        setControlsDisabled(false);
    }

    /**
     * Disables/enables control buttons during animation.
     * @param {boolean} disabled - True to disable, false to enable.
     */
    function setControlsDisabled(disabled) {
        startBroadcastBtn.disabled = disabled;
        startMulticastBtn.disabled = disabled;
        resetBtn.disabled = disabled;
    }

    // --- Initialization ---
    function init() {
        setupNetwork(broadcastViz, broadcastNodes, false);
        setupNetwork(multicastViz, multicastNodes, true); // Pass true for multicast viz
        drawNetworkCircles(broadcastViz);
        drawNetworkCircles(multicastViz);
        updateMulticastGroupDisplay();

        // Set up event listeners
        startBroadcastBtn.addEventListener('click', startBroadcast);
        startMulticastBtn.addEventListener('click', startMulticast);
        resetBtn.addEventListener('click', resetAll);

        // Start with broadcast demo after a short delay
        setTimeout(startBroadcast, 800);
    }

    // Initialize on load
    init();

    // Handle window resize to re-render network
    window.addEventListener('resize', function() {
        resetAll(); // Reset current animations
        // Reinitialize networks to adjust node positions and circles
        setupNetwork(broadcastViz, broadcastNodes, false);
        setupNetwork(multicastViz, multicastNodes, true);
        drawNetworkCircles(broadcastViz);
        drawNetworkCircles(multicastViz);
        // Restart the currently active visualization if any
        if (currentVisualizationMode === 'broadcast') {
            startBroadcast();
        } else if (currentVisualizationMode === 'multicast') {
            startMulticast();
        } else {
            // If nothing was running, default to broadcast
            startBroadcast();
        }
    });
});