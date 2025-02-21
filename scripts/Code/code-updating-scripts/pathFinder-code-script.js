import {dfsPython, bfsPython, dijkstraPython, aStarPython} from "../python-codes.js";
import {dfsCpp, bfsCpp, dijkstraCpp, aStarCpp} from "../cpp-codes.js";
import {dfsJava, bfsJava, dijkstraJava, aStarJava} from "../java-codes.js";

document.addEventListener("DOMContentLoaded", function() {
    const cppWindow = document.getElementById('cpp-code');
    const pythonWindow = document.getElementById('python-code');
    const javaWindow = document.getElementById('java-code');

    function dfsCode() {
        cppWindow.textContent = dfsCpp;
        pythonWindow.textContent = dfsPython;
        javaWindow.textContent = dfsJava;
    }

    function bfsCode() {
        cppWindow.textContent = bfsCpp;
        pythonWindow.textContent = bfsPython;
        javaWindow.textContent = bfsJava;
    }

    function dijkstraCode() {
        cppWindow.textContent = dijkstraCpp;
        pythonWindow.textContent = dijkstraPython;
        javaWindow.textContent = dijkstraJava;
    }

    function aStarCode() {
        cppWindow.textContent = aStarCpp;
        pythonWindow.textContent = aStarPython;
        javaWindow.textContent = aStarJava;
    }


    document.getElementById('dfs').addEventListener('click', dfsCode);
    document.getElementById('bfs').addEventListener('click', bfsCode);
    document.getElementById('dijkstra').addEventListener('click', dijkstraCode);
    document.getElementById('a-star').addEventListener('click', aStarCode);
});