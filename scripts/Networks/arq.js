const ANIMATION_DURATION = 1000; // Base animation duration in ms
const PACKET_HEIGHT = 20;
const PACKET_WIDTH = 30;

// Current state
let currentProtocol = 'stop-wait';
let isRunning = false;
let isPaused = false;
let animationSpeed = 1;
let simulationTimeouts = [];
let packetQueue = [];
let currentSequenceNumber = 0;
let base = 0; // First sequence number in window
let nextSeqNum = 0; // Next sequence number to be sent
let windowSize = 1;
let totalPackets = 10;
let timeoutDuration = 2000;
let simulatePacketLoss = false;
let simulateAckLoss = false;
let sequenceDiagramEvents = [];
let receiverBuffer = {};
let receiverExpectedSeqNum = 0;
let selectiveRepeatBuffer = {};

// DOM Elements
const protocolButtons = document.querySelectorAll('.protocol-btn');
const protocolTitle = document.querySelector('.protocol-title');
const protocolDescription = document.querySelector('.protocol-description');
const startButton = document.getElementById('start-btn');
const pauseButton = document.getElementById('pause-btn');
const resetButton = document.getElementById('reset-btn');
const windowSizeSelect = document.getElementById('window-size');
const timeoutInput = document.getElementById('timeout');
const packetsInput = document.getElementById('packets');
const packetLossCheckbox = document.getElementById('packet-loss');
const ackLossCheckbox = document.getElementById('ack-loss');
const animationSpeedInput = document.getElementById('animation-speed');
const speedValueDisplay = document.getElementById('speed-value');
const sendWindowElement = document.getElementById('send-window');
const receiveWindowElement = document.getElementById('receive-window');
const sendBufferElement = document.getElementById('send-buffer');
const receiveBufferElement = document.getElementById('receive-buffer');
const logContainer = document.getElementById('log');
const visualizationContainer = document.querySelector('.visualization-container');
const sequenceDiagram = document.querySelector('.sequence-diagram');

// Protocol descriptions
const protocolDescriptions = {
    'stop-wait': 'Stop-and-Wait is the simplest ARQ protocol. The sender sends one packet at a time and waits for its acknowledgment before sending the next packet. If the acknowledgment is not received within a timeout period, the sender retransmits the same packet.',
    'go-back-n': 'Go-Back-N is a sliding window protocol where multiple packets can be sent without waiting for acknowledgments. If a packet is lost, the sender goes back to the sequence number of the lost packet and retransmits all subsequent packets.',
    'selective-repeat': 'Selective Repeat is a sliding window protocol that only retransmits the packets that are actually lost. The receiver keeps track of all correctly received packets and only requests retransmission of the missing ones.'
};

// Event Listeners
protocolButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (isRunning && !isPaused) return;

        protocolButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        currentProtocol = button.dataset.protocol;

        updateProtocolInfo();
        resetSimulation();
        updateWindowSizeOptions();
    });
});

startButton.addEventListener('click', startSimulation);
pauseButton.addEventListener('click', togglePause);
resetButton.addEventListener('click', resetSimulation);

windowSizeSelect.addEventListener('change', () => {
    windowSize = parseInt(windowSizeSelect.value);
    resetSimulation();
});

timeoutInput.addEventListener('change', () => {
    timeoutDuration = parseInt(timeoutInput.value);
});

packetsInput.addEventListener('change', () => {
    totalPackets = parseInt(packetsInput.value);
    resetSimulation();
});

packetLossCheckbox.addEventListener('change', () => {
    simulatePacketLoss = packetLossCheckbox.checked;
});

ackLossCheckbox.addEventListener('change', () => {
    simulateAckLoss = ackLossCheckbox.checked;
});

animationSpeedInput.addEventListener('input', () => {
    animationSpeed = parseFloat(animationSpeedInput.value);
    speedValueDisplay.textContent = animationSpeed.toFixed(1) + 'x';
});

// Initialize the visualization
function init() {
    updateProtocolInfo();
    resetSimulation();
    updateWindowSizeOptions();
}

function updateWindowSizeOptions() {
    const options = windowSizeSelect.options;

    // Clear existing options
    while (options.length > 0) {
        options.remove(0);
    }

    // Add appropriate options based on protocol
    if (currentProtocol === 'stop-wait') {
        options.add(new Option('1 (Stop-and-Wait)', '1'));
        windowSizeSelect.value = '1';
        windowSizeSelect.disabled = true;
    } else {
        options.add(new Option('1', '1'));
        options.add(new Option('4', '4'));
        options.add(new Option('8', '8'));
        windowSizeSelect.value = currentProtocol === 'go-back-n' ? '4' : '4';
        windowSizeSelect.disabled = false;
    }

    windowSize = parseInt(windowSizeSelect.value);
}

function updateProtocolInfo() {
    protocolTitle.textContent = getProtocolFullName(currentProtocol) + ' ARQ Protocol';
    protocolDescription.textContent = protocolDescriptions[currentProtocol];
}

function getProtocolFullName(protocol) {
    switch(protocol) {
        case 'stop-wait': return 'Stop-and-Wait';
        case 'go-back-n': return 'Go-Back-N';
        case 'selective-repeat': return 'Selective Repeat';
        default: return protocol;
    }
}

function startSimulation() {
    if (isRunning && !isPaused) return;

    if (!isRunning) {
        // First time starting
        isRunning = true;
        clearLog();
        addLogEntry('Starting ' + getProtocolFullName(currentProtocol) + ' protocol simulation...', 'info');
        addLogEntry(`Window Size: ${windowSize}, Total Packets: ${totalPackets}`, 'info');

        // Initialize state
        currentSequenceNumber = 0;
        base = 0;
        nextSeqNum = 0;
        receiverExpectedSeqNum = 0;
        receiverBuffer = {};
        selectiveRepeatBuffer = {};

        // Draw initial UI
        updateSenderWindow();
        updateReceiverWindow();
        drawBuffers();
    }

    isPaused = false;
    startButton.disabled = true;
    pauseButton.disabled = false;
    pauseButton.textContent = 'Pause';

    // Start sending packets
    processNextPacket();
}

function togglePause() {
    isPaused = !isPaused;

    if (isPaused) {
        pauseButton.textContent = 'Resume';
        addLogEntry('Simulation paused', 'info');

        // Clear all pending timeouts
        simulationTimeouts.forEach(timeout => clearTimeout(timeout));
        simulationTimeouts = [];
    } else {
        pauseButton.textContent = 'Pause';
        addLogEntry('Simulation resumed', 'info');
        processNextPacket();
    }
}

function resetSimulation() {
    // Stop any running animation
    isRunning = false;
    isPaused = false;

    // Clear timeouts
    simulationTimeouts.forEach(timeout => clearTimeout(timeout));
    simulationTimeouts = [];

    // Reset UI and state
    startButton.disabled = false;
    pauseButton.disabled = true;
    pauseButton.textContent = 'Pause';

    // Reset sequence numbers and buffers
    currentSequenceNumber = 0;
    base = 0;
    nextSeqNum = 0;
    receiverExpectedSeqNum = 0;
    packetQueue = [];
    sequenceDiagramEvents = [];
    receiverBuffer = {};
    selectiveRepeatBuffer = {};

    // Clear display
    clearPackets();
    clearSequenceDiagram();
    updateSenderWindow();
    updateReceiverWindow();
    drawBuffers();

    addLogEntry('Simulation reset', 'info');
}

function processNextPacket() {
    if (!isRunning || isPaused) return;

    // Stop condition
    if (base >= totalPackets) {
        addLogEntry('All packets successfully transmitted and acknowledged', 'success');
        isRunning = false;
        startButton.disabled = false;
        pauseButton.disabled = true;
        return;
    }

    let canSendMore = false;

    // Determine if we can send more packets based on protocol and window constraints
    switch(currentProtocol) {
        case 'stop-wait':
            canSendMore = nextSeqNum === base;
            break;

        case 'go-back-n':
        case 'selective-repeat':
            canSendMore = nextSeqNum < base + windowSize && nextSeqNum < totalPackets;
            break;
    }

    if (canSendMore) {
        sendPacket(nextSeqNum);
        nextSeqNum++;

        // Schedule next packet
        const nextProcessDelay = getAnimationDuration() * 0.3;
        const timeoutId = setTimeout(processNextPacket, nextProcessDelay);
        simulationTimeouts.push(timeoutId);
    }
}

function sendPacket(seqNum) {
    if (seqNum >= totalPackets) return;

    // Update UI
    updateSenderWindow();

    const packetWillBeLost = simulatePacketLoss && Math.random() < 0.2;

    addLogEntry(`Sending packet ${seqNum}`, 'info');

    // Create and animate packet
    const packet = createPacket('data-packet', seqNum);
    visualizationContainer.appendChild(packet);

    // Start position (from sender)
    const senderRect = document.querySelector('.sender').getBoundingClientRect();
    const containerRect = visualizationContainer.getBoundingClientRect();
    const startX = senderRect.left - containerRect.left + senderRect.width;
    const startY = senderRect.top - containerRect.top + senderRect.height / 2;

    // End position (to receiver)
    const receiverRect = document.querySelector('.receiver').getBoundingClientRect();
    const endX = receiverRect.left - containerRect.left;
    const endY = receiverRect.top - containerRect.top + receiverRect.height / 2;

    // Set initial position
    packet.style.left = `${startX}px`;
    packet.style.top = `${startY}px`;

    // Add sequence diagram event
    addSequenceEvent(startX, endX, startY, getAnimationDuration() * 0.8, `Packet ${seqNum}`, packetWillBeLost);

    // Animate packet
    setTimeout(() => {
        // Start the animation
        packet.style.transition = `left ${getAnimationDuration()}ms linear, top ${getAnimationDuration()}ms linear`;

        if (packetWillBeLost) {
            // Calculate halfway point
            const halfwayX = startX + (endX - startX) * 0.6;
            const halfwayY = startY + (endY - startY) * 0.6;

            // Move to halfway and then "lose" the packet
            packet.style.left = `${halfwayX}px`;
            packet.style.top = `${halfwayY}px`;

            // After reaching halfway, trigger loss animation
            setTimeout(() => {
                packet.classList.add('lost-animation');
                addLogEntry(`Packet ${seqNum} lost during transmission`, 'error');

                // Set a timeout for the packet if needed
                if (shouldSetTimeout(seqNum)) {
                    setPacketTimeout(seqNum);
                }
            }, getAnimationDuration() * 0.6);
        } else {
            // Successful transmission
            packet.style.left = `${endX}px`;
            packet.style.top = `${endY}px`;

            // When packet arrives at receiver
            setTimeout(() => {
                receivePacket(seqNum);
                visualizationContainer.removeChild(packet);
            }, getAnimationDuration());
        }
    }, 10);

    // Mark as sent in sender buffer
    const bufferSlot = document.querySelector(`#send-buffer .buffer-slot[data-seq="${seqNum}"]`);
    if (bufferSlot) {
        bufferSlot.classList.add('sent');
    }
}

function receivePacket(seqNum) {
    addLogEntry(`Receiver got packet ${seqNum}`, 'info');

    // Different handling based on protocol
    switch (currentProtocol) {
        case 'stop-wait':
            if (seqNum === receiverExpectedSeqNum) {
                receiverExpectedSeqNum++;
                sendAck(seqNum);
            } else {
                addLogEntry(`Receiver expected ${receiverExpectedSeqNum}, got ${seqNum}, discarding`, 'error');
                // In Stop-and-Wait, we still ACK the last correctly received packet
                sendAck(receiverExpectedSeqNum - 1);
            }
            break;

        case 'go-back-n':
            if (seqNum === receiverExpectedSeqNum) {
                // Mark as received in receiver buffer
                markAsReceived(seqNum);

                // Update expected sequence number
                receiverExpectedSeqNum++;

                // Send ACK for the latest in-order packet
                sendAck(seqNum);
            } else {
                addLogEntry(`Receiver expected ${receiverExpectedSeqNum}, got ${seqNum}, discarding`, 'error');
                // In Go-Back-N, we ACK the last correctly received in-order packet
                if (receiverExpectedSeqNum > 0) {
                    sendAck(receiverExpectedSeqNum - 1);
                }
            }
            break;

        case 'selective-repeat':
            // Mark this packet as received
            markAsReceived(seqNum);

            // In Selective Repeat, we buffer out-of-order packets
            if (seqNum >= receiverExpectedSeqNum) {
                // Store in selective repeat buffer
                selectiveRepeatBuffer[seqNum] = true;

                // Send ACK for this specific packet
                sendAck(seqNum);

                // Check if we can advance the receiver window
                while (selectiveRepeatBuffer[receiverExpectedSeqNum]) {
                    delete selectiveRepeatBuffer[receiverExpectedSeqNum];
                    receiverExpectedSeqNum++;
                }
            } else {
                // This is a duplicate packet, but we still ACK it
                sendAck(seqNum);
            }
            break;
    }
    updateReceiverWindow();
}
function markAsReceived(seqNum) {
    // Update buffer display to show packet as received
    const bufferSlot = document.querySelector(`#receive-buffer .buffer-slot[data-seq="${seqNum}"]`);
    if (bufferSlot) {
        bufferSlot.classList.add('sent');
    }

    // Store in receiver buffer
    receiverBuffer[seqNum] = true;
}

function sendAck(seqNum) {
    const ackWillBeLost = simulateAckLoss && Math.random() < 0.2;

    addLogEntry(`Sending ACK for packet ${seqNum}`, 'info');

    // Create and animate ACK packet
    const ackPacket = createPacket('ack-packet', `ACK${seqNum}`);
    visualizationContainer.appendChild(ackPacket);

    // Get positions
    const receiverRect = document.querySelector('.receiver').getBoundingClientRect();
    const containerRect = visualizationContainer.getBoundingClientRect();
    const startX = receiverRect.left - containerRect.left;
    const startY = receiverRect.top - containerRect.top + receiverRect.height / 2;

    const senderRect = document.querySelector('.sender').getBoundingClientRect();
    const endX = senderRect.left - containerRect.left + senderRect.width;
    const endY = senderRect.top - containerRect.top + senderRect.height / 2;

    // Set initial position
    ackPacket.style.left = `${startX}px`;
    ackPacket.style.top = `${startY}px`;

    // Add sequence diagram event for ACK
    addSequenceEvent(startX, endX, startY, getAnimationDuration() * 0.8, `ACK ${seqNum}`, ackWillBeLost, true);

    // Animate ACK packet
    setTimeout(() => {
        ackPacket.style.transition = `left ${getAnimationDuration()}ms linear, top ${getAnimationDuration()}ms linear`;

        if (ackWillBeLost) {
            // Calculate halfway point
            const halfwayX = startX + (endX - startX) * 0.6;
            const halfwayY = startY + (endY - startY) * 0.6;

            // Move to halfway and then "lose" the packet
            ackPacket.style.left = `${halfwayX}px`;
            ackPacket.style.top = `${halfwayY}px`;

            // After reaching halfway, trigger loss animation
            setTimeout(() => {
                ackPacket.classList.add('lost-animation');
                addLogEntry(`ACK ${seqNum} lost during transmission`, 'error');
            }, getAnimationDuration() * 0.6);
        } else {
            // Successful transmission
            ackPacket.style.left = `${endX}px`;
            ackPacket.style.top = `${endY}px`;

            // When ACK arrives at sender
            setTimeout(() => {
                receiveAck(seqNum);
                visualizationContainer.removeChild(ackPacket);
            }, getAnimationDuration());
        }
    }, 10);
}

function receiveAck(seqNum) {
    addLogEntry(`Sender received ACK for packet ${seqNum}`, 'info');

    switch(currentProtocol) {
        case 'stop-wait':
            // Mark packet as acknowledged
            if (base === seqNum) {
                markAsAcknowledged(seqNum);
                base++;
                processNextPacket();
            }
            break;

        case 'go-back-n':
            // In Go-Back-N, an ACK acknowledges all packets up to and including seqNum
            for (let i = base; i <= seqNum; i++) {
                markAsAcknowledged(i);
            }

            // Advance the base
            base = seqNum + 1;
            processNextPacket();
            break;

        case 'selective-repeat':
            // In Selective Repeat, an ACK acknowledges a specific packet
            markAsAcknowledged(seqNum);

            // Check if we can advance the send window
            while (document.querySelector(`#send-buffer .buffer-slot[data-seq="${base}"].acked`)) {
                base++;
            }

            processNextPacket();
            break;
    }

    updateSenderWindow();
}

function markAsAcknowledged(seqNum) {
    const bufferSlot = document.querySelector(`#send-buffer .buffer-slot[data-seq="${seqNum}"]`);
    if (bufferSlot) {
        bufferSlot.classList.add('acked');
    }

    // Clear any timeout for this packet
    clearTimeoutForPacket(seqNum);
}

function createPacket(type, content) {
    const packet = document.createElement('div');
    packet.className = `packet ${type}`;
    packet.textContent = content;
    return packet;
}

function shouldSetTimeout(seqNum) {
    switch(currentProtocol) {
        case 'stop-wait':
            return seqNum === base;

        case 'go-back-n':
            return seqNum === base;

        case 'selective-repeat':
            return true;

        default:
            return false;
    }
}

function setPacketTimeout(seqNum) {
    addLogEntry(`Setting timeout for packet ${seqNum}`, 'info');

    const timeoutId = setTimeout(() => {
        if (!isRunning || isPaused) return;

        addLogEntry(`Timeout for packet ${seqNum}`, 'error');

        switch(currentProtocol) {
            case 'stop-wait':
                // Resend the timed out packet
                sendPacket(seqNum);
                break;

            case 'go-back-n':
                // Resend all packets from base to nextSeqNum
                addLogEntry(`Go-Back-N: Resending packets ${base} to ${nextSeqNum-1}`, 'error');

                // Reset nextSeqNum to start resending from base
                nextSeqNum = base;
                processNextPacket();
                break;

            case 'selective-repeat':
                // Only resend this specific packet
                sendPacket(seqNum);
                break;
        }
    }, timeoutDuration / animationSpeed);

    // Store timeout ID with the sequence number for later cancellation
    simulationTimeouts.push(timeoutId);
}

function clearTimeoutForPacket(seqNum) {
    // This is a simplified approach; in a real implementation,
    // we would have a map of sequence numbers to timeout IDs
    // For visualization purposes, this simplified version is sufficient
}

function updateSenderWindow() {
    // Clear existing window
    sendWindowElement.innerHTML = '';

    // Create slots based on window size
    for (let i = 0; i < windowSize; i++) {
        const slot = document.createElement('div');
        slot.className = 'window-slot';

        // Calculate sequence number for this slot
        const seqNum = base + i;

        if (seqNum < nextSeqNum && seqNum < totalPackets) {
            slot.classList.add('active');
            slot.textContent = seqNum;
        }

        sendWindowElement.appendChild(slot);
    }

    drawBuffers();
}

function updateReceiverWindow() {
    // Clear existing window
    receiveWindowElement.innerHTML = '';

    // Create slots based on window size
    for (let i = 0; i < windowSize; i++) {
        const slot = document.createElement('div');
        slot.className = 'window-slot';

        // Calculate sequence number for this slot
        const seqNum = receiverExpectedSeqNum + i;

        if (seqNum < totalPackets && receiverBuffer[seqNum]) {
            slot.classList.add('active');
            slot.textContent = seqNum;
        }

        receiveWindowElement.appendChild(slot);
    }

    drawBuffers();
}

function drawBuffers() {
    // Clear existing buffers
    sendBufferElement.innerHTML = '';
    receiveBufferElement.innerHTML = '';

    // Create buffer slots
    for (let i = 0; i < totalPackets; i++) {
        // Sender buffer
        const senderSlot = document.createElement('div');
        senderSlot.className = 'buffer-slot';
        senderSlot.dataset.seq = i;
        senderSlot.textContent = i;
        sendBufferElement.appendChild(senderSlot);

        // Receiver buffer
        const receiverSlot = document.createElement('div');
        receiverSlot.className = 'buffer-slot';
        receiverSlot.dataset.seq = i;
        receiverSlot.textContent = i;
        receiveBufferElement.appendChild(receiverSlot);
    }
}

function clearPackets() {
    // Remove all packet elements
    const packets = document.querySelectorAll('.packet');
    packets.forEach(packet => packet.remove());
}

function addSequenceEvent(startX, endX, startY, duration, label, isLost = false, isAck = false) {
    const eventId = `event-${sequenceDiagramEvents.length}`;
    const event = document.createElement('div');
    event.className = `sequence-event ${isLost ? 'lost' : ''} ${isAck ? 'ack' : ''}`;
    event.id = eventId;

    // Calculate appropriate Y position in sequence diagram
    const diagramY = 20 + (sequenceDiagramEvents.length * 15) % 120;

    // Set position and style
    event.style.top = `${diagramY}px`;
    event.style.left = isAck ? `${endX}px` : `${startX}px`;
    event.style.width = '0';

    // Add arrow direction
    if (isAck) {
        event.style.backgroundColor = 'var(--ack-color)';
    } else {
        event.style.backgroundColor = 'var(--packet-color)';
    }

    if (isLost) {
        event.style.backgroundColor = 'var(--lost-color)';
        event.style.opacity = '0.7';
    }

    // Add label
    const eventLabel = document.createElement('div');
    eventLabel.className = 'event-label';
    eventLabel.textContent = label;

    if (isAck) {
        eventLabel.style.right = '5px';
        eventLabel.style.color = 'var(--ack-color)';
    } else {
        eventLabel.style.left = '5px';
        eventLabel.style.color = 'var(--packet-color)';
    }

    eventLabel.style.top = `-15px`;

    event.appendChild(eventLabel);
    sequenceDiagram.appendChild(event);

    // Animate the event line
    setTimeout(() => {
        event.style.transition = `width ${duration}ms linear`;
        event.style.width = `${Math.abs(endX - startX)}px`;

        if (isLost) {
            setTimeout(() => {
                event.style.transition = 'opacity 0.3s';
                event.style.opacity = '0.2';
            }, duration * 0.6);
        }
    }, 10);

    sequenceDiagramEvents.push(eventId);
}

function clearSequenceDiagram() {
    sequenceDiagramEvents.forEach(id => {
        const element = document.getElementById(id);
        if (element) element.remove();
    });
    sequenceDiagramEvents = [];
}

function addLogEntry(message, type = 'info') {
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;

    logContainer.appendChild(entry);
    logContainer.scrollTop = logContainer.scrollHeight;
}

function clearLog() {
    logContainer.innerHTML = '';
}

function getAnimationDuration() {
    return ANIMATION_DURATION / animationSpeed;
}
init();