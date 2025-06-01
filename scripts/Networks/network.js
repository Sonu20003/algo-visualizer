const map = document.getElementById('map');
let receivers = [];
let routers = [];
let isDraggingNode = false;
let currentDragger = null;
let offsetX, offsetY;
let networkGraph = new Map();
let trafficInterval = null;
let packetIdCounter = 0;
let packetsInTransit = new Set(); // Track active packets

// Statistics
let stats = {
    packetsSent: 0,
    packetsReceived: 0,
    packetsLost: 0,
    activeConnections: 0
};

// Network parameters
let networkParams = {
    packetLossRate: 5,           // Percentage (0-100)
    latencyBase: 100,            // Base latency in ms
    latencyVariation: 50,        // Latency variation in ms
    bandwidth: 1.0,              // Multiplier for packet transmission speed (higher = faster)
    protocol: 'tcp',             // TCP or UDP
    congestionPoints: new Set(), // Set of congested node IDs
    packetSpeedFactor: 5         // New: Controls base packet animation speed
};

// --- Protocol Simulation Functions ---
const protocols = {
    tcp: {
        sendPacket: function(path, color) {
            const packetId = packetIdCounter++;
            logProtocol(`[TCP] SYN Sent from ${path[0].id}`);
            setTimeout(() => { // Simulate delay for SYN-ACK
                logProtocol(`[TCP] SYN-ACK Recv at ${path[0].id}`);
                logProtocol(`[TCP] ACK Sent - Connection Established`);
                const packet = createPacket(color, 'TCP');
                animatePacket(packet, path, packetId, true);
            }, networkParams.latencyBase / 2); // Simulates RTT
            return packetId;
        },
        handlePacketLoss: function(packetId, position, path, currentPathIndex) {
            logProtocol(`[TCP] Packet #${packetId} LOST at ${position.id} - Retransmitting...`);
            showNotification(`Packet Lost! Retrying...`, position, 'error');
            stats.packetsLost++;
            updateStatusPanel();
            // Instead of just returning true, we re-animate from the lost point
            const newPath = path.slice(currentPathIndex); // Re-send from the lost node
            const packet = createPacket(path[0].dataset.packetColor, 'TCP'); // Use original packet color
            animatePacket(packet, newPath, packetId, true); // Retry with new packet
            return true;
        },
        completeTransfer: function(packetId, receiver) {
            logProtocol(`[TCP] Packet #${packetId} received at ${receiver.id} - ACK Sent`);
            stats.packetsReceived++;
            updateStatusPanel();
        }
    },
    udp: {
        sendPacket: function(path, color) {
            const packetId = packetIdCounter++;
            logProtocol(`[UDP] Datagram #${packetId} sent from ${path[0].id}`);
            const packet = createPacket(color, 'UDP');
            animatePacket(packet, path, packetId, false);
            return packetId;
        },
        handlePacketLoss: function(packetId, position) {
            logProtocol(`[UDP] Datagram #${packetId} LOST at ${position.id} - No retry`);
            showNotification(`Packet Lost (UDP)!`, position, 'warning');
            stats.packetsLost++;
            updateStatusPanel();
            return false; // No retry for UDP
        },
        completeTransfer: function(packetId, receiver) {
            logProtocol(`[UDP] Datagram #${packetId} received at ${receiver.id}`);
            stats.packetsReceived++;
            updateStatusPanel();
        }
    }
};

// --- Initialization & Event Handlers ---
function initialize() {
    generateSmartRouters();
    setupEventListeners();
    makeDraggable(document.getElementById('sender'));
    assignNodeIds();
    updateStatusPanel();
}

function setupEventListeners() {
    document.getElementById('addReceiver').addEventListener('click', addReceiverNode);
    document.getElementById('addRouter').addEventListener('click', addRouterNode);
    document.getElementById('startTransmission').addEventListener('click', startDataTransmission);
    document.getElementById('stopTransmission').addEventListener('click', stopDataTransmission);
    document.getElementById('clearAll').addEventListener('click', clearNetwork);
    document.getElementById('resetView').addEventListener('click', resetView); // New event listener

    window.addEventListener('resize', handleResize);

    // Map dragging for panning
    map.addEventListener('mousedown', startMapDragging);

    // Settings panel event listeners
    document.getElementById('packetLossRate').addEventListener('input', updatePacketLossRate);
    document.getElementById('networkLatency').addEventListener('input', updateNetworkLatency);
    document.getElementById('bandwidth').addEventListener('input', updateBandwidth);
    document.getElementById('protocolSelect').addEventListener('change', updateProtocol);
    document.getElementById('packetSpeed').addEventListener('input', updatePacketSpeed);
}

// --- Node Management ---
function generateSmartRouters() {
    routers.forEach(r => r.remove()); // Remove existing routers
    routers = []; // Clear array

    const mapRect = map.getBoundingClientRect();
    const padding = 150; // Padding from edges
    const routerSize = 45; // Router actual size for calculation

    // Calculate available space
    const availableWidth = mapRect.width - (2 * padding);
    const availableHeight = mapRect.height - (2 * padding);

    // Target a certain density, e.g., one router every 150-250px
    const routerSpacing = 200; // Average desired spacing
    const numCols = Math.max(1, Math.floor(availableWidth / routerSpacing));
    const numRows = Math.max(1, Math.floor(availableHeight / routerSpacing));

    for(let x = 0; x < numCols; x++) {
        for(let y = 0; y < numRows; y++) {
            // Distribute more evenly, with slight randomization
            const posX = padding + (x * availableWidth / numCols) + (Math.random() * 50 - 25);
            const posY = padding + (y * availableHeight / numRows) + (Math.random() * 50 - 25);

            createRouter(posX, posY);
        }
    }
    assignNodeIds();
    updateNetworkGraph();
}

function createNode(type, text, x, y, className, labelText) {
    const node = document.createElement('div');
    node.className = `node ${className}`;
    node.textContent = text;
    node.style.left = `${x}px`;
    node.style.top = `${y}px`;

    const label = document.createElement('div');
    label.className = 'node-label';
    label.textContent = labelText;
    node.appendChild(label);

    map.appendChild(node);
    makeDraggable(node);
    return node;
}

function createRouter(x, y) {
    const router = createNode('router', 'R', x, y, 'router', 'Router');
    routers.push(router);
    return router;
}

function addRouterNode() {
    const router = createRouter(
        Math.random() * (window.innerWidth - 100),
        Math.random() * (window.innerHeight - 100)
    );
    assignNodeIds();
    updateNetworkGraph();
}

function addReceiverNode() {
    const receiver = createNode('receiver', 'RX',
        Math.random() * (window.innerWidth - 100),
        Math.random() * (window.innerHeight - 100),
        'receiver', 'Receiver');
    receivers.push(receiver);
    assignNodeIds();
    updateNetworkGraph();
}

function assignNodeIds() {
    document.getElementById('sender').id = 'sender';
    document.getElementById('sender').querySelector('.node-label').textContent = 'Sender';

    routers.forEach((router, index) => {
        router.id = `router${index}`;
        router.querySelector('.node-label').textContent = `Router ${index}`;
    });

    receivers.forEach((receiver, index) => {
        receiver.id = `receiver${index}`;
        receiver.querySelector('.node-label').textContent = `Receiver ${index}`;
    });
}

// --- Network Graph & Pathfinding ---
function updateNetworkGraph() {
    networkGraph.clear();
    const allNodes = [document.getElementById('sender'), ...routers, ...receivers];

    allNodes.forEach(node => {
        const neighbors = [];
        const nodeRect = node.getBoundingClientRect(); // Use client rect for precise position

        allNodes.forEach(otherNode => {
            if(node === otherNode) return;
            const otherRect = otherNode.getBoundingClientRect();
            const dist = calculateDistance(nodeRect, otherRect);

            // Connect nodes if within a reasonable range (e.g., 300px)
            if(dist < 300) {
                neighbors.push({
                    node: otherNode,
                    distance: dist
                });
            }
        });
        networkGraph.set(node, neighbors);
    });

    drawAllConnections(); // Redraw connections after graph update
}

function drawAllConnections() {
    // Clear existing lines first
    document.querySelectorAll('.path-line').forEach(line => line.remove());

    const drawnConnections = new Set(); // To avoid duplicate lines for A-B and B-A

    networkGraph.forEach((neighbors, node) => {
        const nodeRect = node.getBoundingClientRect();

        neighbors.forEach(neighbor => {
            const neighborRect = neighbor.node.getBoundingClientRect();
            const connectionKey = [node.id, neighbor.node.id].sort().join('-');

            if (!drawnConnections.has(connectionKey)) {
                const line = document.createElement('div');
                line.className = 'path-line';
                line.dataset.from = node.id;
                line.dataset.to = neighbor.node.id;

                const startX = nodeRect.left + nodeRect.width / 2;
                const startY = nodeRect.top + nodeRect.height / 2;
                const endX = neighborRect.left + neighborRect.width / 2;
                const endY = neighborRect.top + neighborRect.height / 2;

                const length = Math.hypot(endX - startX, endY - startY);
                const angle = Math.atan2(endY - startY, endX - startX);

                line.style.width = `${length}px`;
                line.style.left = `${startX}px`;
                line.style.top = `${startY}px`;
                line.style.transform = `rotate(${angle}rad)`;
                line.style.background = 'rgba(0, 150, 255, 0.2)'; // Default link color

                map.appendChild(line);
                drawnConnections.add(connectionKey);
            }
        });
    });
}

function findOptimalPath(start, end) {
    const queue = new PriorityQueue((a, b) => a.cost < b.cost);
    const distances = new Map();
    const previous = new Map();

    networkGraph.forEach((_, node) => {
        distances.set(node, Infinity);
        previous.set(node, null);
    });

    distances.set(start, 0);
    queue.enqueue({ node: start, cost: 0 });

    while(!queue.isEmpty()) {
        const { node: current } = queue.dequeue();
        if(current === end) break;

        const neighbors = networkGraph.get(current) || [];
        neighbors.forEach(neighbor => {
            let alt = distances.get(current) + neighbor.distance;

            // Add extra cost for congested nodes
            if(networkParams.congestionPoints.has(neighbor.node.id)) {
                alt += 500; // Significant penalty for congestion
            }

            if(alt < distances.get(neighbor.node)) {
                distances.set(neighbor.node, alt);
                previous.set(neighbor.node, current);
                queue.enqueue({ node: neighbor.node, cost: alt });
            }
        });
    }

    const path = [];
    let current = end;
    while(current) {
        path.unshift(current);
        current = previous.get(current);
    }

    return path.length > 1 && path[0] === start ? path : null; // Ensure path starts at 'start'
}

// Priority queue implementation for Dijkstra's algorithm
class PriorityQueue {
    constructor(comparator = (a, b) => a < b) {
        this.elements = [];
        this.comparator = comparator;
    }

    enqueue(element) {
        let added = false;
        for(let i = 0; i < this.elements.length; i++) {
            if(this.comparator(element, this.elements[i])) {
                this.elements.splice(i, 0, element);
                added = true;
                break;
            }
        }
        if(!added) this.elements.push(element);
    }

    dequeue() {
        return this.elements.shift();
    }

    isEmpty() {
        return this.elements.length === 0;
    }
}

// --- Packet Animation & Simulation ---
function createPacket(color, protocol) {
    const packet = document.createElement('div');
    packet.className = 'packet';
    packet.style.backgroundColor = color;
    packet.style.boxShadow = `0 0 15px ${color}`;

    if(protocol === 'TCP') {
        packet.style.border = '2px solid white';
    }

    map.appendChild(packet);
    return packet;
}

async function animatePacket(packet, path, packetId, canRetry, currentPathIndex = 0) {
    packetsInTransit.add(packetId);

    // Highlight the path during transmission
    let activePathLines = [];
    for (let i = 0; i < path.length - 1; i++) {
        const node1 = path[i];
        const node2 = path[i+1];
        const line = document.querySelector(`.path-line[data-from="${node1.id}"][data-to="${node2.id}"], .path-line[data-from="${node2.id}"][data-to="${node1.id}"]`);
        if (line) {
            line.classList.add('active-path');
            activePathLines.push(line);
            line.style.background = networkParams.protocol === 'tcp' ?
                'rgba(0, 255, 255, 0.8)' : // Cyan for TCP
                'rgba(255, 255, 0, 0.8)'; // Yellow for UDP
        }
    }

    function resetPathHighlight() {
        activePathLines.forEach(line => {
            line.classList.remove('active-path');
            line.style.background = 'rgba(0, 150, 255, 0.2)'; // Reset to default
        });
    }


    while(currentPathIndex < path.length - 1) {
        const startNode = path[currentPathIndex];
        const endNode = path[currentPathIndex + 1];

        const startRect = startNode.getBoundingClientRect();
        const endRect = endNode.getBoundingClientRect();

        // Adjust packet position to be centered on node
        packet.style.left = `${startRect.left + startRect.width/2 - packet.offsetWidth/2}px`;
        packet.style.top = `${startRect.top + startRect.height/2 - packet.offsetHeight/2}px`;

        const dx = (endRect.left + endRect.width/2) - (startRect.left + startRect.width/2);
        const dy = (endRect.top + endRect.height/2) - (startRect.top + startRect.height/2);

        // Calculate duration based on distance, latency, bandwidth, and new packetSpeedFactor
        const distance = Math.hypot(dx, dy);
        let duration = (distance / (networkParams.packetSpeedFactor * 10)) + networkParams.latencyBase; // Base duration
        duration = duration / networkParams.bandwidth; // Apply bandwidth multiplier

        // Add latency variation
        duration += Math.random() * networkParams.latencyVariation;

        // Increase duration for congested nodes
        if(networkParams.congestionPoints.has(startNode.id)) {
            duration *= 2; // Double duration for congested links
        }

        // Simulate packet loss
        if(Math.random() * 100 < networkParams.packetLossRate) {
            packet.classList.add('packet-lost'); // Trigger loss animation
            await new Promise(resolve => setTimeout(resolve, 500)); // Wait for animation
            packet.remove();
            packetsInTransit.delete(packetId);
            resetPathHighlight();

            const protocol = networkParams.protocol;
            const retryAllowed = protocols[protocol].handlePacketLoss(packetId, startNode, path, currentPathIndex);

            if(retryAllowed) {
                return; // The retry function will re-initiate animation
            } else {
                return; // No retry, animation ends
            }
        }

        // Normal packet animation
        await new Promise(resolve => {
            const animation = packet.animate([
                { transform: 'translate(0, 0)' },
                { transform: `translate(${dx}px, ${dy}px)` }
            ], {
                duration: duration,
                easing: 'linear'
            });
            animation.onfinish = resolve;
        });

        currentPathIndex++;
    }

    // Packet reached destination
    if(path[path.length - 1].classList.contains('receiver')) {
        packet.classList.add('packet-received'); // Trigger receive animation
        await new Promise(resolve => setTimeout(resolve, 300)); // Wait for animation

        const protocol = networkParams.protocol;
        protocols[protocol].completeTransfer(packetId, path[path.length - 1]);
    }

    packet.remove();
    packetsInTransit.delete(packetId);
    resetPathHighlight();
}

function startDataTransmission() {
    if(trafficInterval) return;

    updateNetworkGraph();
    stats.activeConnections = receivers.length;
    document.getElementById('protocolLog').innerHTML = ''; // Clear log on start

    // Introduce congestion randomly
    networkParams.congestionPoints.clear();
    let congestedCount = 0;
    routers.forEach(router => {
        if(Math.random() < 0.25) { // 25% chance to be congested
            networkParams.congestionPoints.add(router.id);
            router.classList.add('congestion');
            showNotification(`Congestion at ${router.id}!`, router, 'error');
            congestedCount++;
        }
    });
    updateStatusPanel(); // Update congested router count

    trafficInterval = setInterval(() => {
        const sender = document.getElementById('sender');
        if (receivers.length === 0) {
            logProtocol("[System] No receivers to send packets to. Add receivers to start.");
            stopDataTransmission();
            return;
        }

        receivers.forEach(receiver => {
            const path = findOptimalPath(sender, receiver);
            if(path && path.length > 1) {
                // Calculate unique color for this path
                const hue = (packetIdCounter * 30) % 360; // Cycle through hues
                const color = `hsl(${hue}, 100%, 60%)`;
                sender.dataset.packetColor = color; // Store color for retransmission

                const protocol = networkParams.protocol;
                protocols[protocol].sendPacket(path, color);
                stats.packetsSent++;
                updateStatusPanel();
            } else {
                logProtocol(`[System] No path found from Sender to ${receiver.id}.`);
                showNotification(`No path to ${receiver.id}`, receiver, 'warning');
            }
        });
    }, 1500); // Send packets every 1.5 seconds
}

function stopDataTransmission() {
    if(trafficInterval) {
        clearInterval(trafficInterval);
        trafficInterval = null;

        // Clear congestion indicators
        routers.forEach(router => {
            router.classList.remove('congestion');
        });
        networkParams.congestionPoints.clear();

        // Clear any active packets
        packetsInTransit.forEach(packetId => {
            const packetElement = document.querySelector(`.packet[data-packet-id="${packetId}"]`);
            if (packetElement) packetElement.remove();
        });
        packetsInTransit.clear();

        // Reset active path lines
        document.querySelectorAll('.path-line.active-path').forEach(line => {
            line.classList.remove('active-path');
            line.style.background = 'rgba(0, 150, 255, 0.2)';
        });

        stats.activeConnections = 0;
        updateStatusPanel();
        logProtocol("[System] Data transmission stopped.");
    }
}

function clearNetwork() {
    stopDataTransmission();

    receivers.forEach(receiver => receiver.remove());
    receivers = [];
    stats = {
        packetsSent: 0,
        packetsReceived: 0,
        packetsLost: 0,
        activeConnections: 0
    };

    generateSmartRouters(); // Regenerate initial set of routers
    updateStatusPanel();
    document.getElementById('protocolLog').innerHTML = '';
    logProtocol("[System] Network cleared and reset.");
}

function resetView() {
    // Reset sender position
    const sender = document.getElementById('sender');
    sender.style.left = '50px';
    sender.style.top = `${window.innerHeight / 2 - 30}px`; // Center vertically

    clearNetwork(); // This will regenerate routers and update graph
    logProtocol("[System] View reset to default configuration.");
}

// --- UI Interactions: Dragging, Tooltips, Notifications ---
let mapDragging = false;
let mapPanStartX, mapPanStartY;
let mapOffsetX = 0, mapOffsetY = 0;

function startMapDragging(e) {
    if (e.target.closest('.node')) return; // Don't drag map if clicking a node

    mapDragging = true;
    map.classList.add('dragging');
    mapPanStartX = e.clientX;
    mapPanStartY = e.clientY;

    document.addEventListener('mousemove', dragMap);
    document.addEventListener('mouseup', stopMapDragging);
}

function dragMap(e) {
    if (!mapDragging) return;

    const dx = e.clientX - mapPanStartX;
    const dy = e.clientY - mapPanStartY;

    mapOffsetX += dx;
    mapOffsetY += dy;

    // Apply transform to map for panning
    map.style.transform = `translate(${mapOffsetX}px, ${mapOffsetY}px)`;

    mapPanStartX = e.clientX;
    mapPanStartY = e.clientY;

    // Update positions of nodes based on map pan
    // This is tricky. Better to store node positions relative to map and update on pan
    // For simplicity, we'll just allow nodes to be manually dragged.
    // If map pan is desired, node positions should be relative to map's transformed origin.
    // For now, nodes remain fixed relative to viewport, and map background moves.
}

function stopMapDragging() {
    mapDragging = false;
    map.classList.remove('dragging');
    document.removeEventListener('mousemove', dragMap);
    document.removeEventListener('mouseup', stopMapDragging);
}

function makeDraggable(element) {
    element.addEventListener('mousedown', startDraggingNode);

    // Add tooltip behavior
    element.addEventListener('mouseenter', () => {
        const tooltip = document.getElementById('tooltip');
        tooltip.textContent = element.querySelector('.node-label').textContent + ` (${element.id})`;
        const rect = element.getBoundingClientRect();
        tooltip.style.left = `${rect.left + rect.width / 2}px`;
        tooltip.style.top = `${rect.top - 40}px`;
        tooltip.classList.add('show');
    });

    element.addEventListener('mouseleave', () => {
        document.getElementById('tooltip').classList.remove('show');
    });
}

function startDraggingNode(e) {
    e.stopPropagation(); // Prevent map dragging when clicking a node
    isDraggingNode = true;
    currentDragger = e.target.closest('.node');
    const rect = currentDragger.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    // Add 'active' class for visual feedback
    currentDragger.classList.add('active');

    document.addEventListener('mousemove', dragElement);
    document.addEventListener('mouseup', stopDraggingNode);
}

function dragElement(e) {
    if(!isDraggingNode) return;

    const x = e.clientX - offsetX;
    const y = e.clientY - offsetY;

    // Keep within map boundaries
    const mapRect = map.getBoundingClientRect();
    const nodeSize = currentDragger.offsetWidth; // Assuming width == height
    currentDragger.style.left = `${Math.max(mapRect.left, Math.min(x, mapRect.right - nodeSize))}px`;
    currentDragger.style.top = `${Math.max(mapRect.top, Math.min(y, mapRect.bottom - nodeSize))}px`;

    // Update tooltip position
    const tooltip = document.getElementById('tooltip');
    const rect = currentDragger.getBoundingClientRect();
    tooltip.style.left = `${rect.left + rect.width / 2}px`;
    tooltip.style.top = `${rect.top - 40}px`;

    updateNetworkGraph(); // Update connections dynamically while dragging
}

function stopDraggingNode() {
    isDraggingNode = false;
    // Remove 'active' class
    if (currentDragger) {
        currentDragger.classList.remove('active');
    }
    document.removeEventListener('mousemove', dragElement);
    document.removeEventListener('mouseup', stopDraggingNode);
    currentDragger = null;
    updateNetworkGraph(); // Final update after drag
}

// --- Helper Functions ---
function calculateDistance(rect1, rect2) {
    const center1X = rect1.left + rect1.width / 2;
    const center1Y = rect1.top + rect1.height / 2;
    const center2X = rect2.left + rect2.width / 2;
    const center2Y = rect2.top + rect2.height / 2;
    return Math.hypot(center2X - center1X, center2Y - center1Y);
}

function handleResize() {
    // Re-generate routers to fit new screen size
    generateSmartRouters();

    // Adjust receiver positions to stay within bounds
    receivers.forEach(receiver => {
        const currentLeft = parseFloat(receiver.style.left);
        const currentTop = parseFloat(receiver.style.top);
        receiver.style.left = `${Math.min(currentLeft, window.innerWidth - receiver.offsetWidth)}px`;
        receiver.style.top = `${Math.min(currentTop, window.innerHeight - receiver.offsetHeight)}px`;
    });
    updateNetworkGraph();
}

// --- UI Update Functions ---
function updatePacketLossRate() {
    const slider = document.getElementById('packetLossRate');
    networkParams.packetLossRate = parseInt(slider.value);
    document.getElementById('packetLossValue').textContent = `${networkParams.packetLossRate}%`;
}

function updateNetworkLatency() {
    const slider = document.getElementById('networkLatency');
    networkParams.latencyBase = parseInt(slider.value);
    document.getElementById('latencyValue').textContent = `${networkParams.latencyBase}ms`;
}

function updateBandwidth() {
    const slider = document.getElementById('bandwidth');
    networkParams.bandwidth = parseInt(slider.value) / 10; // Scale to 0.1-1.0
    document.getElementById('bandwidthValue').textContent = networkParams.bandwidth.toFixed(1);
}

function updatePacketSpeed() {
    const slider = document.getElementById('packetSpeed');
    networkParams.packetSpeedFactor = parseInt(slider.value);
    document.getElementById('packetSpeedValue').textContent = networkParams.packetSpeedFactor;
}

function updateProtocol() {
    networkParams.protocol = document.getElementById('protocolSelect').value;
    logProtocol(`[System] Protocol switched to ${networkParams.protocol.toUpperCase()}.`);
}

function updateStatusPanel() {
    document.getElementById('packetsSent').textContent = stats.packetsSent;
    document.getElementById('packetsReceived').textContent = stats.packetsReceived;
    document.getElementById('packetsLost').textContent = stats.packetsLost;

    const successRate = stats.packetsSent > 0 ?
        Math.round((stats.packetsReceived / stats.packetsSent) * 100) : 0;
    document.getElementById('successRate').textContent = `${successRate}%`;

    document.getElementById('activeConnections').textContent = stats.activeConnections;
    document.getElementById('congestedRouters').textContent = networkParams.congestionPoints.size;
}

function logProtocol(message) {
    const log = document.getElementById('protocolLog');
    const newItem = document.createElement('div');
    newItem.innerHTML = message; // Use innerHTML to allow for potential HTML tags in future
    newItem.style.color = '#0f0'; // Default green
    if (message.includes('LOST') || message.includes('Congestion')) {
        newItem.style.color = '#ff4444'; // Red for errors/losses
    } else if (message.includes('Established') || message.includes('Received')) {
        newItem.style.color = '#00e6e6'; // Cyan for success
    }
    log.prepend(newItem); // Add to the top

    // Limit log size
    while(log.children.length > 25) { // Keep max 25 lines
        log.removeChild(log.lastChild);
    }
}

function showNotification(message, element, type = 'info') {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;

    if (type === 'error') {
        notification.style.backgroundColor = 'rgba(255, 0, 0, 0.9)';
        notification.style.boxShadow = '0 0 20px rgba(255, 0, 0, 0.6)';
    } else if (type === 'warning') {
        notification.style.backgroundColor = 'rgba(255, 165, 0, 0.9)';
        notification.style.boxShadow = '0 0 20px rgba(255, 165, 0, 0.6)';
    } else if (type === 'success') {
        notification.style.backgroundColor = 'rgba(0, 255, 0, 0.9)';
        notification.style.boxShadow = '0 0 20px rgba(0, 255, 0, 0.6)';
    }

    const rect = element.getBoundingClientRect();
    notification.style.left = `${rect.left + rect.width/2 - notification.offsetWidth/2}px`; // Center horizontally
    notification.style.top = `${rect.top - 60}px`; // Above the element

    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    // Hide and remove notification
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 500); // Wait for fade-out
    }, 3000); // Display for 3 seconds
}

initialize();