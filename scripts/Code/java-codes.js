const linearSearchJava =
`// Linear Search in Java
public static int linearSearch(int[] arr, int target) {
    for (int i = 0; i < arr.length; i++) {
        if (arr[i] == target) return i;
    }
    return -1;
}
`;

const binarySearchJava =
`// Binary Search in Java
public static int binarySearch(int[] arr, int target) {
    int left = 0, right = arr.length - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}
`;

const bubbleSortJava =
`// Bubble Sort in Java
public static void bubbleSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}
`;

const insertionSortJava =
`// Insertion Sort in Java
public static void insertionSort(int[] arr) {
    for (int i = 1; i < arr.length; i++) {
        int key = arr[i], j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}
`;

const selectionSortJava =
`// Selection Sort in Java
public static void selectionSort(int[] arr) {
    for (int i = 0; i < arr.length; i++) {
        int minIdx = i;
        for (int j = i + 1; j < arr.length; j++) {
            if (arr[j] < arr[minIdx]) minIdx = j;
        }
        int temp = arr[i];
        arr[i] = arr[minIdx];
        arr[minIdx] = temp;
    }
}
`;

const mergeSortJava =
`// Merge Sort in Java
public static void mergeSort(int[] arr, int left, int right) {
    if (left < right) {
        int mid = left + (right - left) / 2;
        mergeSort(arr, left, mid);
        mergeSort(arr, mid + 1, right);
        merge(arr, left, mid, right);
    }
}

private static void merge(int[] arr, int left, int mid, int right) {
    int[] leftHalf = Arrays.copyOfRange(arr, left, mid + 1);
    int[] rightHalf = Arrays.copyOfRange(arr, mid + 1, right + 1);

    int i = 0, j = 0, k = left;
    while (i < leftHalf.length && j < rightHalf.length) {
        if (leftHalf[i] < rightHalf[j]) arr[k++] = leftHalf[i++];
        else arr[k++] = rightHalf[j++];
    }
    while (i < leftHalf.length) arr[k++] = leftHalf[i++];
    while (j < rightHalf.length) arr[k++] = rightHalf[j++];
}
`;

export {
    binarySearchJava,
    linearSearchJava,
    bubbleSortJava,
    insertionSortJava,
    selectionSortJava,
    mergeSortJava
};

