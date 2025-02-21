const COLORS = {
    BFS: { node: '#5af63b', edge: '#04d309' },
    DFS: { node: '#f59e0b', edge: '#fbbf24' },
    DEFAULT: '#6366f1'
};

class Graph {
    constructor() {
        this.nodes = new Map();
        this.edges = [];
        this.nodeCount = 0;
    }

    addNode(x, y) {
        const id = `node-${++this.nodeCount}`;
        const node = document.createElement('div');
        node.className = 'node';
        node.textContent = this.nodeCount;
        node.style.left = `${x}px`;
        node.style.top = `${y}px`;
        node.style.backgroundColor = COLORS.DEFAULT;
        node.dataset.id = id;

        this.nodes.set(id, {
            id,
            x,
            y,
            element: node,
            connections: new Set()
        });

        document.getElementById('canvas').appendChild(node);
        return id;
    }

    removeNode(nodeId) {
        const node = this.nodes.get(nodeId);
        if (!node) return;

        node.connections.forEach(neighborId => {
            this.removeEdge(nodeId, neighborId);
        });

        node.element.remove();
        this.nodes.delete(nodeId);
    }

    addEdge(sourceId, targetId) {
        const source = this.nodes.get(sourceId);
        const target = this.nodes.get(targetId);
        if (!source || !target) return;

        const edge = document.createElement('div');
        edge.className = 'edge';
        this.positionEdge(edge, source, target);
        document.getElementById('canvas').appendChild(edge);

        this.edges.push({ source: sourceId, target: targetId, element: edge });
        source.connections.add(targetId);
        target.connections.add(sourceId);
    }

    removeEdge(sourceId, targetId) {
        const edgeIndex = this.edges.findIndex(e =>
            (e.source === sourceId && e.target === targetId) ||
            (e.source === targetId && e.target === sourceId)
        );

        if (edgeIndex > -1) {
            this.edges[edgeIndex].element.remove();
            this.edges.splice(edgeIndex, 1);
        }

        const source = this.nodes.get(sourceId);
        const target = this.nodes.get(targetId);
        if (source) source.connections.delete(targetId);
        if (target) target.connections.delete(sourceId);
    }

    positionEdge(edge, source, target) {
        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);

        edge.style.width = `${length}px`;
        edge.style.left = `${source.x}px`;
        edge.style.top = `${source.y}px`;
        edge.style.transform = `rotate(${angle}rad)`;
    }

    *bfs(startId) {
        const visited = new Set();
        const queue = [startId];
        visited.add(startId);
        yield { type: 'enqueue', nodes: [startId] };

        while (queue.length > 0) {
            const current = queue.shift();
            yield { type: 'visit', current };

            for (const neighbor of this.nodes.get(current).connections) {
                if (!visited.has(neighbor)) {
                    visited.add(neighbor);
                    queue.push(neighbor);
                    yield { type: 'enqueue', nodes: queue };
                    this.highlightEdge(current, neighbor, COLORS.BFS.edge);
                }
            }
            yield { type: 'dequeue', node: current };
        }
    }

    *dfs(startId) {
        const visited = new Set();
        const stack = [startId];
        visited.add(startId);
        yield { type: 'push', nodes: [startId] };

        while (stack.length > 0) {
            const current = stack.pop();
            yield { type: 'visit', current };

            const neighbors = Array.from(this.nodes.get(current).connections);
            for (let i = neighbors.length - 1; i >= 0; i--) {
                const neighbor = neighbors[i];
                if (!visited.has(neighbor)) {
                    visited.add(neighbor);
                    stack.push(neighbor);
                    yield { type: 'push', nodes: stack };
                    this.highlightEdge(current, neighbor, COLORS.DFS.edge);
                }
            }
            yield { type: 'pop', node: current };
        }
    }

    highlightEdge(sourceId, targetId, color) {
        const edge = this.edges.find(e =>
            (e.source === sourceId && e.target === targetId) ||
            (e.source === targetId && e.target === sourceId)
        );
        if (edge) {
            edge.element.style.backgroundColor = color;
        }
    }
}

let graph = new Graph();
let currentMode = 'addNode';
let selectedNode = null;
let currentAlgorithm = null;

function toggleMode(mode) {
    currentMode = mode;
    document.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`${mode}Btn`).classList.add('active');
    selectedNode = null;
}

function handleCanvasClick(event) {
    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    switch(currentMode) {
        case 'addNode':
            graph.addNode(x, y);
            break;

        case 'addEdge':
            const target = event.target.closest('.node');
            if (target) {
                const nodeId = target.dataset.id;
                if (!selectedNode) {
                    selectedNode = nodeId;
                    target.style.backgroundColor = COLORS.DEFAULT + 'aa';
                } else {
                    if (selectedNode !== nodeId) {
                        graph.addEdge(selectedNode, nodeId);
                    }
                    graph.nodes.get(selectedNode).element.style.backgroundColor = COLORS.DEFAULT;
                    selectedNode = null;
                }
            }
            break;

        case 'remove':
            const nodeToRemove = event.target.closest('.node');
            if (nodeToRemove) {
                graph.removeNode(nodeToRemove.dataset.id);
            }
            break;
    }
}

function startAlgorithm(type) {
    if (graph.nodes.size === 0) return;
    currentAlgorithm = {
        type,
        generator: null,
        startId: null
    };
    updateStatus(`Click a node to start ${type.toUpperCase()}`);
    document.getElementById('canvas').style.cursor = 'pointer';
}

async function processAlgorithm() {
    while (true) {
        const { value, done } = currentAlgorithm.generator.next();
        if (done) break;

        switch(value.type) {
            case 'enqueue':
            case 'push':
                updateBuffer(value.nodes);
                break;

            case 'visit':
                animateNode(value.current);
                addToVisited(value.current);
                break;

            case 'dequeue':
            case 'pop':
                removeFromBuffer(value.node);
                break;
        }
        await new Promise(resolve => setTimeout(resolve, 800));
    }
    currentAlgorithm = null;
    document.getElementById('canvas').style.cursor = 'crosshair';
    updateStatus('Ready');
}

function animateNode(nodeId) {
    const node = graph.nodes.get(nodeId).element;
    const color = currentAlgorithm.type === 'bfs' ? COLORS.BFS.node : COLORS.DFS.node;
    node.style.backgroundColor = color;
}

function updateBuffer(nodes) {
    const bufferContent = document.getElementById('bufferContent');
    bufferContent.innerHTML = '';

    nodes.forEach(nodeId => {
        const div = document.createElement('div');
        div.className = 'buffer-item';
        div.innerHTML = `
                    <span>Node</span>
                    <span style="font-weight: 600">${nodeId.split('-')[1]}</span>
                `;
        bufferContent.appendChild(div);
    });
}

function addToVisited(nodeId) {
    const visitedBuffer = document.getElementById('visitedBuffer');
    const div = document.createElement('div');
    div.className = 'buffer-item';
    div.innerHTML = `
                <span>Node</span>
                <span style="font-weight: 600">${nodeId.split('-')[1]}</span>
            `;
    visitedBuffer.appendChild(div);
}

function removeFromBuffer(nodeId) {
    const bufferContent = document.getElementById('bufferContent');
    const items = Array.from(bufferContent.children);
    const itemToRemove = items.find(item =>
        item.textContent.includes(nodeId.split('-')[1])
    );
    if (itemToRemove) itemToRemove.remove();
}

function clearGraph() {
    document.getElementById('canvas').innerHTML = '';
    document.getElementById('bufferContent').innerHTML = '';
    document.getElementById('visitedBuffer').innerHTML = '';
    graph = new Graph();
    updateStatus('Ready');
}

function updateStatus(message) {
    document.getElementById('status').textContent = `Status: ${message}`;
}

document.getElementById('canvas').addEventListener('click', (event) => {
    if (currentAlgorithm?.startId === null) {
        const node = event.target.closest('.node');
        if (node) {
            currentAlgorithm.startId = node.dataset.id;
            currentAlgorithm.generator =
                currentAlgorithm.type === 'bfs'
                    ? graph.bfs(node.dataset.id)
                    : graph.dfs(node.dataset.id);
            updateStatus(`Running ${currentAlgorithm.type.toUpperCase()}...`);
            processAlgorithm();
        }
    }
});