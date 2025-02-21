import {linearSearchPython, binarySearchPython} from "../python-codes.js";
import {linearSearchCpp, binarySearchCpp} from "../cpp-codes.js";
import {linearSearchJava, binarySearchJava} from "../java-codes.js";

document.addEventListener("DOMContentLoaded", function() {
    const cppWindow = document.getElementById('cpp-code');
    const pythonWindow = document.getElementById('python-code');
    const javaWindow = document.getElementById('java-code');

    function displayLinearCode() {
        cppWindow.textContent = linearSearchCpp;
        pythonWindow.textContent = linearSearchPython;
        javaWindow.textContent = linearSearchJava;
    }

    function displayBinaryCode() {
        cppWindow.textContent = binarySearchCpp;
        pythonWindow.textContent = binarySearchPython;
        javaWindow.textContent = binarySearchJava;
    }

    document.getElementById('Linear_search').addEventListener('click', displayLinearCode);
    document.getElementById('Binary_search').addEventListener('click', displayBinaryCode);
});