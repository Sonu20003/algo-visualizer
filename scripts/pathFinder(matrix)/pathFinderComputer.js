
const container = document.getElementById('container');
const pixels = window.innerWidth;
const block_count = Math.floor((pixels-10)/24);
document.documentElement.style.setProperty('--block-count', `${block_count}`);

let draggingImg = null;
let startNode = [13, 8];
let endNode = [13, block_count-8];

let start_img = document.createElement("img");
let dest_img = document.createElement("img");
start_img.src = '/assets/start.png';
dest_img.src = '/assets/dest.png';

function create_cells(x,y){
    let cell = document.createElement('span');
    cell.classList.add('cell');
    cell.id = `${x},${y}`;
    container.appendChild(cell);
}


// setup grid
for(let i=0; i<30; i++) {
    for (let j = 0; j < block_count; j++) {
        create_cells(i, j);
    }
}

//depth first search

let visited = new Set();
const dfs_path = [];

document.getElementById(`${startNode[0]},${startNode[1]}`).appendChild(start_img);
document.getElementById(`${endNode[0]},${endNode[1]}`).appendChild(dest_img);

async function create_delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function depthFirstSearch(start, end) {
    return new Promise(async (resolve) => {
        if (start < 0 || start >= 30 || end < 0 || end >= block_count || visited.has(`${start}-${end}`) ||
            document.getElementById(`${start},${end}`).classList.contains('wall')) {
            resolve(false);
            return;
        }

        if (start === endNode[0] && end === endNode[1]) {
            document.getElementById(`${start},${end}`).classList.add('path');
            resolve(true);
            return;
        }

        visited.add(`${start}-${end}`);
        await create_delay(10);

        const cell = document.getElementById(`${start},${end}`);
        cell.classList.add('visited');

        if (await depthFirstSearch(start, end + 1)) {
            await create_delay(5);
            cell.classList.add('path');
            resolve(true);
            return;
        }
        if (await depthFirstSearch(start, end - 1)) {
            await create_delay(5);
            cell.classList.add('path');
            resolve(true);
            return;
        }
        if (await depthFirstSearch(start + 1, end)) {
            await create_delay(5);
            cell.classList.add('path');
            resolve(true);
            return;
        }
        if (await depthFirstSearch(start - 1, end)) {
            await create_delay(5);
            cell.classList.add('path');
            resolve(true);
            return;
        }
        resolve(false);
    });
}
function call_DFS(){
    depthFirstSearch(startNode[0], startNode[1]);
}

// End of DFS



// Breadth-first-search
async function breadthFirstSearch(start, end) {
    return new Promise(async (resolve) => {
        const queue = [[start, end]];
        const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
        const visited = new Set();
        visited.add(`${start}-${end}`);

        while (queue.length > 0) {
            let [currentStart, currentEnd] = queue.shift();

            currentStart = +currentStart;
            currentEnd = +currentEnd;

            if (currentStart < 0 || currentStart >= 30 || currentEnd < 0 || currentEnd >= block_count ) {
                continue;
            }

            if (+currentStart === +endNode[0] && +currentEnd === +endNode[1]) {
                document.getElementById(`${currentStart},${currentEnd}`).classList.add('path');
                resolve(true);
                return;
            }

            await create_delay(5);

            const cell = document.getElementById(`${currentStart},${currentEnd}`);
            cell.classList.add('visited');

            for (let [dx, dy] of directions) {
                const newStart = currentStart + dx;
                const newEnd = currentEnd + dy;
                if (+newStart >= 0 && +newStart < 30 && +newEnd >= 0 && +newEnd < +block_count && !visited.has(`${newStart}-${newEnd}`)) {
                    queue.push([newStart, newEnd]);
                    visited.add(`${newStart}-${newEnd}`);
                }
            }

        }
        await returnShortestPath(startNode, endNode);
        resolve(false);
    });
}

//shortest path return for bfs
async function returnShortestPath(start, end) {
    return new Promise(async (resolve) => {
        let source = [...start];
        let destination = [...end];

        console.log(typeof(source[0]));
        console.log(typeof(destination[0]));

        if (source[0] < destination[0]) {
            while (source[0] < destination[0]) {
                await create_delay(100);
                document.getElementById(`${source[0]},${source[1]}`).classList.add('path');
                source[0]++;
            }
        } else if (source[0] > destination[0]) {
            while (source[0] > destination[0]) {
                await create_delay(100);
                document.getElementById(`${source[0]},${source[1]}`).classList.add('path');
                source[0]--;
            }
        }

        if (source[1] < destination[1]) {
            while (source[1] < destination[1]) {
                await create_delay(100);
                document.getElementById(`${source[0]},${source[1]}`).classList.add('path');
                source[1]++;
            }
        } else if (source[1] > destination[1]) {
            while (source[1] > destination[1]) {
                await create_delay(100);
                document.getElementById(`${source[0]},${source[1]}`).classList.add('path');
                source[1]--;
            }
        }

        document.getElementById(`${destination[0]},${destination[1]}`).classList.add('path');
        resolve();
    });
}

async function call_BFS(){
    await call_dijkstra();
}
// end of BFS





// dijkstra's Algorithm:
async function Dijkstra(start, end) {
    return new Promise(async (resolve) => {
        await create_delay(100);

        const queue = [[start, end]];
        const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
        const visited = new Set();
        const parentMap = new Map();

        visited.add(`${start},${end}`);
        parentMap.set(`${start},${end}`, null);

        while (queue.length > 0) {
            let [currentStart, currentEnd] = queue.shift();

            currentStart = +currentStart;
            currentEnd = +currentEnd;

            if (currentStart < 0 || currentStart >= 30 || currentEnd < 0 || currentEnd >= block_count ||
                document.getElementById(`${currentStart},${currentEnd}`).classList.contains('wall')) {
                continue;
            }

            if (+currentStart === +endNode[0] && +currentEnd === +endNode[1]) {
                document.getElementById(`${currentStart},${currentEnd}`).classList.add('path');

                const path = [];
                let currentCell = `${currentStart},${currentEnd}`;

                while (currentCell && parentMap.has(currentCell)) {
                    path.push(currentCell);
                    currentCell = parentMap.get(currentCell);
                }

                path.reverse();
                resolve(path);
                return;
            }

            await create_delay(5);

            const cell = document.getElementById(`${currentStart},${currentEnd}`);
            cell.classList.add('visited');

            for (let [dx, dy] of directions) {
                const newStart = currentStart + dx;
                const newEnd = currentEnd + dy;
                const newCellId = `${newStart},${newEnd}`;

                if (+newStart >= 0 && +newStart < 30 && +newEnd >= 0 && +newEnd < block_count && !visited.has(newCellId)) {
                    queue.push([newStart, newEnd]);
                    visited.add(newCellId);
                    parentMap.set(newCellId, `${currentStart},${currentEnd}`);
                }
            }
        }
        resolve(false);
    });
}

async function call_dijkstra() {
    const path = await Dijkstra(startNode[0], startNode[1]);
    for (let id of path) {
        await create_delay(80);
        document.getElementById(id).classList.add('path');
    }
}
// end of dijkstra's algorithm

// A STAR ALGORITHM


function create2DArray(rows, cols) {
    return Array.from({ length: rows }, () => Array(cols).fill(+99999999));
}

async function computeWeights(point, grid) {
    const queue = [];
    queue.push(point);
    grid[point[0]][point[1]] = 0;
    const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];

    while (queue.length > 0) {
        let size = queue.length;

        while (size > 0) {
            const cell = queue.shift();
            let weight = grid[cell[0]][cell[1]] + 1;

            for (let dir of directions) {
                // Calculate the neighbor's position
                let neighbour = [cell[0] + dir[0], cell[1] + dir[1]];

                if (
                    neighbour[0] >= 0 && neighbour[0] < grid.length &&
                    neighbour[1] >= 0 && neighbour[1] < grid[0].length &&
                    !document.getElementById(`${neighbour[0]},${neighbour[1]}`).classList.contains('wall') &&
                    grid[neighbour[0]][neighbour[1]] > weight
                ) {
                    grid[neighbour[0]][neighbour[1]] = weight;
                    queue.push(neighbour);
                    let flash = document.getElementById(`${neighbour[0]},${neighbour[1]}`);
                }
            }
            size--;
        }
    }
}

const memory_set = create2DArray(30, block_count);

// add features of walls and weight and a quick animation of blink ok

async function A_star(start, end) {
    return new Promise(async resolve => {
        //await triggerBlink();
        //await create_delay(100)
        await computeWeights(endNode, memory_set);
        await create_delay(100);
        const queue = [];
        queue.push(start);
        const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];

        while (queue.length > 0) {
            const cell = queue.shift();

            // Check if we've reached the destination
            if (memory_set[cell[0]][cell[1]] === 0) {
                return;
            }
            let min_no = 1000000;
            let min;
            let id;

            for (let [dx, dy] of directions) {
                let nb = [cell[0] + dx, cell[1] + dy];

                if (+nb[0] >= 0 && +nb[0] < 30 && +nb[1] >= 0 && +nb[1] < block_count
                    && +memory_set[nb[0]][nb[1]] < min_no) {

                    min = [nb[0],nb[1]];
                    min_no = +memory_set[nb[0]][nb[1]];
                    id = `${nb[0]},${nb[1]}`;

                }
            }
            queue.push(min);
            await create_delay(100);
            document.getElementById(id).classList.add('path');
        }
    });
}


async function call_aStar(){
    return new Promise(async resolve => {
        await create_delay(100);
        await A_star(startNode, endNode);
    })
}

async function triggerBlink() {
    const spans = document.querySelectorAll('#container span');

    await Promise.all(Array.from(spans).map(span => {
        return new Promise(resolve => {
            // Force reflow and reset animation
            void span.offsetHeight;

            span.classList.add('blink');

            // Resolve promise when animation ends
            const animationEnd = () => {
                span.classList.remove('blink');
                resolve();
            };
            span.addEventListener('animationend', animationEnd, {once: true});
        });
    }));
}


// exports
export {call_BFS, call_DFS, call_dijkstra, call_aStar};











// curious code: of enhanced bfs
// async function A_star(start, end) {
//     return new Promise(async resolve => {
//         create_delay(100);
//         computeWeights(endNode, memory_set);
//
//         // Priority Queue for A* (holds cells with their current cost/weight)
//         const queue = [];
//         queue.push({point: start, weight: 0}); // Start point with weight 0
//         const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
//         const visited = new Set(); // To track visited nodes
//         const parentMap = new Map(); // To track the parent of each node for path reconstruction
//
//         visited.add(`${start[0]},${start[1]}`); // Mark the start as visited
//         parentMap.set(`${start[0]},${start[1]}`, null); // No parent for the start node
//
//         while (queue.length > 0) {
//             // Sort queue by weight (priority queue behavior)
//             queue.sort((a, b) => a.weight - b.weight);
//             const {point: current, weight: currentWeight} = queue.shift();
//
//             const [currentStart, currentEnd] = current;
//
//             if (currentStart === end[0] && currentEnd === end[1]) {
//                 // If we reached the end node, reconstruct the path
//                 document.getElementById(`${currentStart},${currentEnd}`).classList.add('path');
//                 const path = [];
//                 let currentCell = `${currentStart},${currentEnd}`;
//
//                 while (currentCell && parentMap.has(currentCell)) {
//                     path.push(currentCell);
//                     currentCell = parentMap.get(currentCell);
//                 }
//
//                 path.reverse();
//                 resolve(path); // Return the path
//                 return;
//             }
//
//             // Delay for animation/visualization purposes
//             await create_delay(5);
//
//             // Mark the current cell as visited
//             document.getElementById(`${currentStart},${currentEnd}`).classList.add('visited');
//
//             // Explore neighbors
//             for (let [dx, dy] of directions) {
//                 const newStart = currentStart + dx;
//                 const newEnd = currentEnd + dy;
//                 const newCellId = `${newStart},${newEnd}`;
//
//                 // Check if the neighbor is within bounds and not a wall, and not visited
//                 if (newStart >= 0 && newStart < 30 && newEnd >= 0 && newEnd < block_count &&
//                     !visited.has(newCellId) && !document.getElementById(newCellId).classList.contains('wall')) {
//
//                     // Add the neighbor to the queue with its updated weight (cost)
//                     const newWeight = currentWeight + memory_set[newStart][newEnd]; // Update weight based on grid
//                     queue.push({point: [newStart, newEnd], weight: newWeight});
//
//                     // Mark it as visited and track the parent
//                     visited.add(newCellId);
//                     parentMap.set(newCellId, `${currentStart},${currentEnd}`);
//                 }
//             }
//         }
//     });
// }




// real-time-position-change
const containsImage = (element) => {
    return element.contains(start_img) || element.contains(dest_img);
};

let isMouseDown = false;
document.addEventListener("mousedown", (e) => {
    isMouseDown = true;
    if (e.target && (e.target === start_img || e.target === dest_img)) {
        draggingImg = e.target;
        const container = e.target.parentElement;
        console.log(`Image dragged from container: ${container.id}`);

        const [x, y] = container.id.split(",").map(Number);
        if (draggingImg === start_img) {
            startNode = [x, y];
        } else if (draggingImg === dest_img) {
            endNode = [x, y];
        }

        draggingImg.style.position = "absolute";
        draggingImg.style.zIndex = 1000;
        document.body.appendChild(draggingImg);
    }
});

document.addEventListener("mousemove", (e) => {
    if (draggingImg) {
        draggingImg.style.left = e.pageX - draggingImg.offsetWidth / 2 + "px";
        draggingImg.style.top = e.pageY - draggingImg.offsetHeight / 2 + "px";
    }
    else if(e.target && isMouseDown && e.target.classList.contains('cell') &&
        !(e.target === start_img || e.target === dest_img) &&
        !(e.target.id === `${startNode[0]},${startNode[1]}`) &&
        !(e.target.id === `${endNode[0]},${endNode[1]}`) ) {

        e.target.classList.add('wall');
    }
});

document.addEventListener("mouseup", (e) => {
    isMouseDown = false;
    if (draggingImg) {
        const cells = document.querySelectorAll(".cell");
        let dropped = false;

        for (let cell of cells) {
            const rect = cell.getBoundingClientRect();
            if (
                e.clientX >= rect.left &&
                e.clientX <= rect.right &&
                e.clientY >= rect.top &&
                e.clientY <= rect.bottom
            ) {
                cell.appendChild(draggingImg);
                draggingImg.style.position = "static";
                draggingImg.style.zIndex = 1;

                const [x, y] = cell.id.split(",").map(Number);
                if (draggingImg === start_img) {
                    startNode = [x, y];
                } else if (draggingImg === dest_img) {
                    endNode = [x, y];
                }
                dropped = true;
                break;
            }
        }
        if (!dropped) {
            const container = draggingImg.parentElement;
            container.appendChild(draggingImg);
            draggingImg.style.position = "static";
        }
        draggingImg = null;
    }
});



// speed controls:

const dds = document.getElementById("dropdown-content-speed");
const dropdownToggle = document.getElementById("dropdown-toggle-speed");
const sl = document.getElementById("slow");
const av = document.getElementById("average");
const fs = document.getElementById("fast");

let speed = [];

function toggleDropdown() {
    if (getComputedStyle(dds).display === "none") {
        dds.style.display = "block";
        dropdownToggle.innerHTML = "Speed ▲";
    } else {
        dds.style.display = "none";
        dropdownToggle.innerHTML = "Speed ▼";
    }
}

dropdownToggle.addEventListener("click", toggleDropdown);

sl.onclick = () => {
    dds.style.display = "none";
    dropdownToggle.innerHTML = "Slow ▼";
}
av.onclick = () => {
    dds.style.display = "none";
    dropdownToggle.innerHTML = "Average ▼";
}
fs.onclick = () => {
    dds.style.display = "none";
    dropdownToggle.innerHTML = "Fast ▼";
}

// clear button:
document.getElementById('clear').onclick = function clear_current(){
    clear_up();
}

async function clear_up(){
    for(let i=0; i<30; i++){
        for(let j=0; j<63; j++){
            document.getElementById(`${i},${j}`).className = 'cell';
        }
        await create_delay(50);
    }
}
