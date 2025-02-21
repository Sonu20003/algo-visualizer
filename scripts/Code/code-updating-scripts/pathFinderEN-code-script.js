import {dfsPythonList, bfsPythonList} from "../python-codes.js";
import {dfsCppList, bfsCppList} from "../cpp-codes.js";
import {dfsJavaList, bfsJavaList} from "../java-codes.js";

document.addEventListener("DOMContentLoaded", function() {
    const cppWindow = document.getElementById('cpp-code');
    const pythonWindow = document.getElementById('python-code');
    const javaWindow = document.getElementById('java-code');

    function dfsCode() {
        cppWindow.textContent = dfsCppList;
        pythonWindow.textContent = dfsPythonList;
        javaWindow.textContent = dfsJavaList;
    }

    function bfsCode() {
        cppWindow.textContent = bfsCppList;
        pythonWindow.textContent = bfsPythonList;
        javaWindow.textContent = bfsJavaList;
    }

    document.getElementById('dfs').addEventListener('click', dfsCode);
    document.getElementById('bfs').addEventListener('click', bfsCode);
});