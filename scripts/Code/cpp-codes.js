const linearSearchCpp =
    `// Linear Search in C++
#include <vector>
using namespace std;

int linearSearch(vector<int>& arr, int target) {
    for (int i = 0; i < arr.size(); i++) {
        if (arr[i] == target) return i;
    }
    return -1;
}
`;

const binarySearchCpp =
    `// Binary Search in C++
#include <vector>
using namespace std;

int binarySearch(vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}
`;

const bubbleSortCpp =
    `// Bubble Sort in C++
#include <vector>
using namespace std;

void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) swap(arr[j], arr[j + 1]);
        }
    }
}`;

const insertionSortCpp =
    `// Insertion Sort in C++
#include <vector>
using namespace std;

void insertionSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 1; i < n; i++) {
        int key = arr[i], j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}
`;

const selectionSortCpp =
    `// Selection Sort in C++
#include <vector>
using namespace std;

void selectionSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) minIdx = j;
        }
        swap(arr[i], arr[minIdx]);
    }
}
`;

const mergeSortCpp =
    `// Merge Sort in C++
#include <vector>
using namespace std;

void merge(vector<int>& arr, int left, int mid, int right) {
    vector<int> leftHalf(arr.begin() + left, arr.begin() + mid + 1);
    vector<int> rightHalf(arr.begin() + mid + 1, arr.begin() + right + 1);

    int i = 0, j = 0, k = left;
    while (i < leftHalf.size() && j < rightHalf.size()) {
        if (leftHalf[i] < rightHalf[j]) arr[k++] = leftHalf[i++];
        else arr[k++] = rightHalf[j++];
    }
    while (i < leftHalf.size()) arr[k++] = leftHalf[i++];
    while (j < rightHalf.size()) arr[k++] = rightHalf[j++];
}

void mergeSort(vector<int>& arr, int left, int right) {
    if (left < right) {
        int mid = left + (right - left) / 2;
        mergeSort(arr, left, mid);
        mergeSort(arr, mid + 1, right);
        merge(arr, left, mid, right);
    }
}
`;

export {
    binarySearchCpp,
    linearSearchCpp,
    bubbleSortCpp,
    insertionSortCpp,
    selectionSortCpp,
    mergeSortCpp
};
