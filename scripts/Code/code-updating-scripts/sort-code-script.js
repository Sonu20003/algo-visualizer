import {bubbleSortPython, insertionSortPython, selectionSortPython, mergeSortPython} from "../python-codes.js";
import {bubbleSortCpp, insertionSortCpp, selectionSortCpp, mergeSortCpp} from "../cpp-codes.js";
import {bubbleSortJava, insertionSortJava, selectionSortJava, mergeSortJava} from "../java-codes.js";

document.addEventListener("DOMContentLoaded", function() {
    const cppWindow = document.getElementById('cpp-code');
    const pythonWindow = document.getElementById('python-code');
    const javaWindow = document.getElementById('java-code');

    function displayBubbleCode() {
        cppWindow.textContent = bubbleSortCpp;
        pythonWindow.textContent = bubbleSortPython;
        javaWindow.textContent = bubbleSortJava;
    }

    function displaySelectionCode() {
        cppWindow.textContent = selectionSortCpp;
        pythonWindow.textContent = selectionSortPython;
        javaWindow.textContent = selectionSortJava;
    }

    function displayInsertionCode() {
        cppWindow.textContent = insertionSortCpp;
        pythonWindow.textContent = insertionSortPython;
        javaWindow.textContent = insertionSortJava;
    }

    function displayMergeCode() {
        cppWindow.textContent = mergeSortCpp;
        pythonWindow.textContent = mergeSortPython;
        javaWindow.textContent = mergeSortJava;
    }


    document.getElementById('bubble_sort').addEventListener('click', displayBubbleCode);
    document.getElementById('selection_sort').addEventListener('click', displaySelectionCode);
    document.getElementById('insertion_sort').addEventListener('click', displayInsertionCode);
    document.getElementById('merge_sort').addEventListener('click', displayMergeCode);
});