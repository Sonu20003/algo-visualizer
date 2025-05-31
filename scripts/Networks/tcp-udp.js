document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab');
    const contentSections = document.querySelectorAll('.content-section');

    const tcpClient = document.getElementById('tcp-client');
    const tcpServer = document.getElementById('tcp-server');
    const tcpTransmissionArea = document.getElementById('tcp-transmission-area');
    const tcpStatus = document.getElementById('tcp-status');
    const startTcpBtn = document.getElementById('start-tcp');
    const simulateTcpLossBtn = document.getElementById('simulate-tcp-loss');
    const resetTcpBtn = document.getElementById('reset-tcp');

    const udpClient = document.getElementById('udp-client');
    const udpServer = document.getElementById('udp-server');
    const udpTransmissionArea = document.getElementById('udp-transmission-area');
    const udpStatus = document.getElementById('udp-status');
    const startUdpBtn = document.getElementById('start-udp');
    const simulateUdpLossBtn = document.getElementById('simulate-udp-loss');
    const resetUdpBtn = document.getElementById('reset-udp');

    const sideTcpArea = document.getElementById('side-tcp-area');
    const sideTcpStatus = document.getElementById('side-tcp-status');
    const sideUdpArea = document.getElementById('side-udp-area');
    const sideUdpStatus = document.getElementById('side-udp-status');
    const startSideBySideBtn = document.getElementById('start-side-by-side');
    const resetSideBySideBtn = document.getElementById('reset-side-by-side');

    let simulationIntervals = [];
    let packetLossActiveTcp = false;
    let packetLossActiveUdp = false;
    let tcpSequenceNumber = 0;
    let udpSequenceNumber = 0;

    // --- Tab Switching Logic ---
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            contentSections.forEach(section => section.classList.remove('active'));
            const targetContentId = tab.id.replace('-tab', '-content');
            document.getElementById(targetContentId).classList.add('active');

            // Reset all simulations when switching tabs
            resetAllSimulations();
        });
    });

    // --- Helper Functions for Animations and Elements ---

    /**
     * Creates a packet element.
     * @param {string} type - 'tcp', 'udp', 'ack'.
     * @param {number} sequence - Sequence number for TCP.
     * @param {string} text - Text to display on the packet.
     */
    function createPacketElement(type, text) {
        const packet = document.createElement('div');
        packet.classList.add('packet', type);
        packet.textContent = text;
        return packet;
    }

    /**
     * Simulates sending a packet from client to server.
     * @param {HTMLElement} packetElement - The packet DOM element.
     * @param {HTMLElement} transmissionArea - The area for packet movement.
     * @param {HTMLElement} clientEndpoint - The client endpoint for visual feedback.
     * @param {number} delay - Animation duration in ms.
     * @returns {Promise<void>}
     */
    function sendPacket(packetElement, transmissionArea, clientEndpoint, delay) {
        return new Promise(resolve => {
            transmissionArea.appendChild(packetElement);
            clientEndpoint.classList.add('endpoint-pulse');
            setTimeout(() => clientEndpoint.classList.remove('endpoint-pulse'), 600);

            packetElement.style.setProperty('--animation-duration', `${delay / 1000}s`);
            packetElement.classList.add('move-to-server');

            packetElement.onanimationend = () => {
                packetElement.classList.remove('move-to-server');
                resolve();
            };
        });
    }

    /**
     * Simulates sending an ACK packet from server to client.
     * @param {HTMLElement} packetElement - The packet DOM element.
     * @param {HTMLElement} transmissionArea - The area for packet movement.
     * @param {HTMLElement} serverEndpoint - The server endpoint for visual feedback.
     * @param {number} delay - Animation duration in ms.
     * @returns {Promise<void>}
     */
    function sendAck(packetElement, transmissionArea, serverEndpoint, delay) {
        return new Promise(resolve => {
            // Position ACK at the server side initially
            packetElement.style.left = `calc(100% - var(--packet-size))`;
            transmissionArea.appendChild(packetElement);
            serverEndpoint.classList.add('endpoint-pulse');
            setTimeout(() => serverEndpoint.classList.remove('endpoint-pulse'), 600);

            packetElement.style.setProperty('--animation-duration', `${delay / 1000}s`);
            packetElement.classList.add('move-to-client');

            packetElement.onanimationend = () => {
                packetElement.classList.remove('move-to-client');
                resolve();
            };
        });
    }

    /**
     * Simulates packet loss.
     * @param {HTMLElement} packetElement - The packet DOM element.
     * @param {HTMLElement} statusArea - The status area for messages.
     * @param {string} protocolName - 'TCP' or 'UDP'.
     * @returns {Promise<void>}
     */
    function losePacket(packetElement, statusArea, protocolName) {
        return new Promise(resolve => {
            packetElement.classList.add('fade-out');
            statusArea.textContent = `${protocolName}: Packet ${packetElement.textContent} lost!`;
            setTimeout(() => {
                packetElement.remove();
                resolve();
            }, 800); // Duration of the packetLost animation
        });
    }

    /**
     * Updates the status message.
     * @param {HTMLElement} statusArea - The status area DOM element.
     * @param {string} message - The message to display.
     */
    function updateStatus(statusArea, message) {
        statusArea.textContent = message;
    }

    function getLatency() {
        return 800 + Math.random() * 400; // 0.8s to 1.2s
    }

    // --- TCP Simulation Logic ---
    async function simulateTcpTransfer(transmissionArea, statusArea, clientEndpoint, serverEndpoint, lossActive) {
        let currentSequence = 1;
        let acknowledgedSequence = 0;
        let maxRetransmissions = 3;
        let activeTransfers = 0; // To handle multiple packets in flight

        updateStatus(statusArea, 'TCP: Establishing connection (SYN, SYN-ACK, ACK)...');
        // Simulate handshake (simplified)
        await new Promise(r => setTimeout(r, 1000));
        updateStatus(statusArea, 'TCP: Connection established. Starting data transfer.');

        const sendNextPacket = async () => {
            if (currentSequence > 5 && activeTransfers === 0) { // Send 5 packets for demo, then finish when all received
                updateStatus(statusArea, 'TCP: All packets sent and acknowledged. Connection closing.');
                return;
            }
            if (currentSequence > 5 && activeTransfers > 0) {
                // Wait for existing packets to be acknowledged
                return;
            }

            const packetText = `Data ${currentSequence}`;
            let packet = createPacketElement('tcp', packetText);
            let retransmissionCount = 0;
            let packetSentSuccessfully = false;

            while (!packetSentSuccessfully && retransmissionCount <= maxRetransmissions) {
                const isRetransmission = retransmissionCount > 0;
                if (isRetransmission) {
                    packet = createPacketElement('tcp retransmit', `Retry ${packetText}`); // Create new packet for retransmission
                    packet.classList.add('retransmit-flash');
                }

                updateStatus(statusArea, `TCP: Sending ${isRetransmission ? 'retransmitted ' : ''}packet ${packetText}...`);
                const latency = getLatency();
                activeTransfers++;
                await sendPacket(packet, transmissionArea, clientEndpoint, latency);

                if (lossActive && Math.random() < 0.4 && !isRetransmission) { // 40% chance of initial loss, less for retries
                    await losePacket(packet, statusArea, 'TCP');
                    retransmissionCount++;
                    activeTransfers--;
                    updateStatus(statusArea, `TCP: Packet ${packetText} lost. Retrying... (${retransmissionCount}/${maxRetransmissions})`);
                    if (retransmissionCount > maxRetransmissions) {
                        updateStatus(statusArea, `TCP: Max retransmissions for ${packetText} reached. Connection failed.`);
                        return;
                    }
                    continue; // Try sending again
                }

                updateStatus(statusArea, `TCP: Packet ${packetText} reached server. Waiting for ACK.`);
                activeTransfers--;
                // Simulate ACK
                const ackPacket = createPacketElement('ack', `ACK ${currentSequence}`);
                const ackLatency = getLatency();
                await sendAck(ackPacket, transmissionArea, serverEndpoint, ackLatency);
                ackPacket.remove(); // Remove ACK after it reaches client

                acknowledgedSequence = currentSequence;
                updateStatus(statusArea, `TCP: ACK for ${packetText} received. Next expected: ${currentSequence + 1}`);
                packetSentSuccessfully = true;
                currentSequence++; // Move to next sequence if successful
            }

            // Schedule the next packet send, allowing for multiple in flight
            setTimeout(sendNextPacket, 500); // Small delay before sending next packet
        };

        // Start initial packets
        sendNextPacket();
        setTimeout(sendNextPacket, 500); // Send another quickly
    }


    // --- UDP Simulation Logic ---
    async function simulateUdpTransfer(transmissionArea, statusArea, clientEndpoint, serverEndpoint, lossActive) {
        let currentPacket = 1;
        const totalPackets = 5;

        updateStatus(statusArea, 'UDP: Starting data transfer (connectionless).');

        const sendNextPacket = async () => {
            if (currentPacket > totalPackets) {
                updateStatus(statusArea, 'UDP: All packets sent. Transfer complete.');
                return;
            }

            const packetText = `Msg ${currentPacket}`;
            const packet = createPacketElement('udp', packetText);

            updateStatus(statusArea, `UDP: Sending packet ${packetText}...`);
            const latency = getLatency();
            await sendPacket(packet, transmissionArea, clientEndpoint, latency);

            if (lossActive && Math.random() < 0.5) { // 50% chance of loss
                await losePacket(packet, statusArea, 'UDP');
                updateStatus(statusArea, `UDP: Packet ${packetText} lost. No retransmission.`);
            } else {
                updateStatus(statusArea, `UDP: Packet ${packetText} received by server.`);
                packet.remove(); // Remove packet after reception
            }

            currentPacket++;
            // Schedule the next packet send without waiting for confirmation
            setTimeout(sendNextPacket, 700); // Send next packet quickly
        };

        sendNextPacket();
    }

    // --- Control Event Listeners ---
    let tcpSimRunning = false;
    let udpSimRunning = false;

    startTcpBtn.addEventListener('click', () => {
        if (!tcpSimRunning) {
            tcpSimRunning = true;
            resetTcp(); // Ensure clean state
            simulateTcpTransfer(tcpTransmissionArea, tcpStatus, tcpClient, tcpServer, packetLossActiveTcp);
            startTcpBtn.disabled = true;
            simulateTcpLossBtn.disabled = true;
        }
    });

    simulateTcpLossBtn.addEventListener('click', () => {
        packetLossActiveTcp = !packetLossActiveTcp;
        simulateTcpLossBtn.textContent = packetLossActiveTcp ? 'Loss: ON' : 'Loss: OFF';
        simulateTcpLossBtn.classList.toggle('active-loss', packetLossActiveTcp);
    });

    resetTcpBtn.addEventListener('click', resetTcp);

    function resetTcp() {
        simulationIntervals.forEach(clearInterval);
        simulationIntervals = [];
        tcpTransmissionArea.innerHTML = '';
        tcpStatus.textContent = 'TCP: Ready to start transfer.';
        tcpClient.classList.remove('endpoint-pulse');
        tcpServer.classList.remove('endpoint-pulse');
        tcpSimRunning = false;
        packetLossActiveTcp = false;
        simulateTcpLossBtn.textContent = 'Simulate Packet Loss';
        simulateTcpLossBtn.classList.remove('active-loss');
        startTcpBtn.disabled = false;
        simulateTcpLossBtn.disabled = false;
        tcpSequenceNumber = 0; // Reset sequence number
    }


    startUdpBtn.addEventListener('click', () => {
        if (!udpSimRunning) {
            udpSimRunning = true;
            resetUdp(); // Ensure clean state
            simulateUdpTransfer(udpTransmissionArea, udpStatus, udpClient, udpServer, packetLossActiveUdp);
            startUdpBtn.disabled = true;
            simulateUdpLossBtn.disabled = true;
        }
    });

    simulateUdpLossBtn.addEventListener('click', () => {
        packetLossActiveUdp = !packetLossActiveUdp;
        simulateUdpLossBtn.textContent = packetLossActiveUdp ? 'Loss: ON' : 'Loss: OFF';
        simulateUdpLossBtn.classList.toggle('active-loss', packetLossActiveUdp);
    });

    resetUdpBtn.addEventListener('click', resetUdp);

    function resetUdp() {
        simulationIntervals.forEach(clearInterval);
        simulationIntervals = [];
        udpTransmissionArea.innerHTML = '';
        udpStatus.textContent = 'UDP: Ready to start transfer.';
        udpClient.classList.remove('endpoint-pulse');
        udpServer.classList.remove('endpoint-pulse');
        udpSimRunning = false;
        packetLossActiveUdp = false;
        simulateUdpLossBtn.textContent = 'Simulate Packet Loss';
        simulateUdpLossBtn.classList.remove('active-loss');
        startUdpBtn.disabled = false;
        simulateUdpLossBtn.disabled = false;
        udpSequenceNumber = 0; // Reset sequence number
    }

    // --- Side-by-Side Comparison Logic ---
    let sideBySideRunning = false;
    startSideBySideBtn.addEventListener('click', () => {
        if (!sideBySideRunning) {
            sideBySideRunning = true;
            resetSideBySide(); // Ensure clean state
            // TCP side
            simulateTcpTransfer(sideTcpArea, sideTcpStatus,
                document.querySelector('#side-by-side-content .protocol-column:first-child .endpoint:first-child'),
                document.querySelector('#side-by-side-content .protocol-column:first-child .endpoint:last-child'),
                true // Always simulate loss for TCP in comparison to show retransmission
            );
            // UDP side
            simulateUdpTransfer(sideUdpArea, sideUdpStatus,
                document.querySelector('#side-by-side-content .protocol-column:last-child .endpoint:first-child'),
                document.querySelector('#side-by-side-content .protocol-column:last-child .endpoint:last-child'),
                true // Always simulate loss for UDP in comparison to show no retransmission
            );
            startSideBySideBtn.disabled = true;
        }
    });

    resetSideBySideBtn.addEventListener('click', resetSideBySide);

    function resetSideBySide() {
        simulationIntervals.forEach(clearInterval);
        simulationIntervals = [];
        sideTcpArea.innerHTML = '';
        sideUdpArea.innerHTML = '';
        sideTcpStatus.textContent = 'TCP: Ready.';
        sideUdpStatus.textContent = 'UDP: Ready.';
        document.querySelectorAll('#side-by-side-content .endpoint').forEach(ep => ep.classList.remove('endpoint-pulse'));
        sideBySideRunning = false;
        startSideBySideBtn.disabled = false;
        tcpSequenceNumber = 0; // Reset sequence numbers for side-by-side
        udpSequenceNumber = 0;
    }

    function resetAllSimulations() {
        resetTcp();
        resetUdp();
        resetSideBySide();
    }

    // Initial state setup
    resetAllSimulations();
    tabs[0].click(); // Activate TCP tab on load
});