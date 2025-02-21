import {create_random_maze, create_vertical_maze,  create_horizontal_maze} from "./maze.js";
import {call_DFS, call_BFS, call_dijkstra, call_aStar} from "./pathFinderComputer.js";

let algo = null;
const DFS = document.getElementById('dfs');
const BFS = document.getElementById('bfs');
const Djk = document.getElementById('dijkstra');
const Astar = document.getElementById('a-star');


const rd = document.getElementById('random');
const hs = document.getElementById('horizontal');
const vs = document.getElementById('vertical');

const visualise = document.getElementById('visualise');
const dd = document.getElementById("dropdown-content");
const ddm = document.getElementById("maze-content");
const ddT = document.getElementById("dropdown-toggle");
const ddTm = document.getElementById("maze-toggle");
const msg = document.getElementById('message-box');

document.getElementById('back').addEventListener('click', () => {
    window.history.back();
});

function toggleDropdown() {
    if (getComputedStyle(dd).display === "none") {
        dd.style.display = "block";
        ddT.innerHTML = "Algorithms ▲";
    } else {
        dd.style.display = "none";
        ddT.innerHTML = "Algorithms ▼";
    }
}
function toggleDropdownMaze() {
    if (getComputedStyle(ddm).display === "none") {
        ddm.style.display = "block";
        ddTm.innerHTML = "Mazes ▲";
    } else {
        ddm.style.display = "none";
        ddTm.innerHTML = "Mazes ▼";
    }
}

function hideDropdown() {
    dd.style.display = "none";
    ddT.innerHTML = "Algorithms ▼";
}

ddT.addEventListener("click", toggleDropdown);
ddTm.addEventListener("click", toggleDropdownMaze);

DFS.onclick = () => {
    algo = 'DFS';
    hideDropdown();
    ddT.innerHTML = "DFS Algorithm ▼";
};

BFS.onclick = () => {
    algo = 'BFS';
    hideDropdown();
    ddT.innerHTML = "BFS Algorithm ▼";
};
Djk.onclick = () => {
    algo = 'Dijkstra';
    hideDropdown();
    ddT.innerHTML = "Dijkstra's Algorithm ▼";
};
Astar.onclick = () => {
    algo = 'a-star';
    hideDropdown();
    ddT.innerHTML = "A* Algorithm ▼";
};

rd.onclick = () => {
    ddm.style.display = "none";
    ddTm.innerHTML = "Mazes ▼";
    create_random_maze();
};

hs.onclick = () => {
    ddm.style.display = "none";
    ddTm.innerHTML = "Mazes ▼";
    create_horizontal_maze();
};
vs.onclick = () => {
    ddm.style.display = "none";
    ddTm.innerHTML = "Mazes ▼";
    create_vertical_maze();
};


if(algo === null)
    msg.innerHTML = "Please select a Path Finding Algorithm !"

visualise.onclick= function visualiser(){
    console.log(algo);
    if(algo === 'DFS'){
        msg.innerHTML = "Depth First Search";
        call_DFS();
    }
    else if(algo === 'BFS'){
        msg.innerHTML = "Breadth First Search";
        call_BFS();
    }
    else if(algo === 'Dijkstra'){
        msg.innerHTML = "Dijkstra,s Algorithm";
        call_dijkstra();
    }
    else if(algo === 'a-star'){
        msg.innerHTML = "A* Algorithm";
        call_aStar();
    }
    else {
        msg.innerHTML = "Please select a Path Finding Algorithm !"
    }

}

