import {naivePython, kmpPython, rabinKarpPython} from "../python-codes.js";
import {naiveCpp, kmpCpp, rabinKarpCpp} from "../cpp-codes.js";
import {naiveJava, kmpJava, rabinKarpJava} from "../java-codes.js";

document.addEventListener("DOMContentLoaded", function() {
    const cppWindow = document.getElementById('cpp-code');
    const pythonWindow = document.getElementById('python-code');
    const javaWindow = document.getElementById('java-code');

    function naiveCode() {
        cppWindow.textContent = naiveCpp;
        pythonWindow.textContent = naivePython;
        javaWindow.textContent = naiveJava;
    }

    function kmpCode() {
        cppWindow.textContent = kmpCpp;
        pythonWindow.textContent = kmpPython;
        javaWindow.textContent = kmpJava;
    }

    function rabinKarpCode() {
        cppWindow.textContent = rabinKarpCpp;
        pythonWindow.textContent = rabinKarpPython;
        javaWindow.textContent = rabinKarpJava;
    }

    document.getElementById('naive').addEventListener('click', naiveCode);
    document.getElementById('kmp').addEventListener('click', kmpCode);
    document.getElementById('rabin-karp').addEventListener('click', rabinKarpCode);
});