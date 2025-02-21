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

const bfsJava = `// BFS implementation using adjacency matrix in Java
import java.util.*;

class Graph {
    public static void bfs(int start, int[][] adjMatrix) {
        boolean[] visited = new boolean[adjMatrix.length];
        Queue<Integer> queue = new LinkedList<>();
        
        queue.add(start);
        visited[start] = true;
        
        while (!queue.isEmpty()) {
            int node = queue.poll();
            System.out.print(node + " ");
            
            for (int i = 0; i < adjMatrix[node].length; i++) {
                if (adjMatrix[node][i] > 0 && !visited[i]) {
                    visited[i] = true;
                    queue.add(i);
                }
            }
        }
    }
}`;

const dfsJava = `// DFS implementation using adjacency matrix in Java
import java.util.*;

class Graph {
    public static void dfs(int node, int[][] adjMatrix, boolean[] visited) {
        visited[node] = true;
        System.out.print(node + " ");
        
        for (int i = 0; i < adjMatrix[node].length; i++) {
            if (adjMatrix[node][i] > 0 && !visited[i]) {
                dfs(i, adjMatrix, visited);
            }
        }
    }
}`;

const dijkstraJava = `// Dijkstra's Algorithm using adjacency matrix in Java
import java.util.*;

class Graph {
    public static int[] dijkstra(int start, int[][] adjMatrix) {
        int n = adjMatrix.length;
        int[] dist = new int[n];
        Arrays.fill(dist, Integer.MAX_VALUE);
        dist[start] = 0;
        PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[0]));
        pq.add(new int[]{0, start});
        
        while (!pq.isEmpty()) {
            int[] top = pq.poll();
            int d = top[0], node = top[1];
            
            if (d > dist[node]) continue;
            
            for (int i = 0; i < n; i++) {
                if (adjMatrix[node][i] > 0 && dist[node] + adjMatrix[node][i] < dist[i]) {
                    dist[i] = dist[node] + adjMatrix[node][i];
                    pq.add(new int[]{dist[i], i});
                }
            }
        }
        return dist;
    }
}`;

const aStarJava = `// A* Algorithm using adjacency matrix in Java
import java.util.*;

class Graph {
    public static int aStar(int start, int goal, int[][] adjMatrix, int[] heuristic) {
        PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[0]));
        int[] gScore = new int[adjMatrix.length];
        Arrays.fill(gScore, Integer.MAX_VALUE);
        gScore[start] = 0;
        
        pq.add(new int[]{heuristic[start], 0, start});
        
        while (!pq.isEmpty()) {
            int[] top = pq.poll();
            int _, g, node;
            _ = top[0]; g = top[1]; node = top[2];
            
            if (node == goal) return gScore[goal];
            
            for (int i = 0; i < adjMatrix[node].length; i++) {
                if (adjMatrix[node][i] > 0) {
                    int tentative_g = gScore[node] + adjMatrix[node][i];
                    if (tentative_g < gScore[i]) {
                        gScore[i] = tentative_g;
                        pq.add(new int[]{tentative_g + heuristic[i], tentative_g, i});
                    }
                }
            }
        }
        return -1;
    }
}`;

const bfsJavaList = `// BFS implementation using adjacency list in Java
import java.util.*;

class Graph {
    public static void bfs(int start, List<List<Integer>> adjList) {
        boolean[] visited = new boolean[adjList.size()];
        Queue<Integer> queue = new LinkedList<>();
        
        queue.add(start);
        visited[start] = true;
        
        while (!queue.isEmpty()) {
            int node = queue.poll();
            System.out.print(node + " ");
            
            for (int neighbor : adjList.get(node)) {
                if (!visited[neighbor]) {
                    visited[neighbor] = true;
                    queue.add(neighbor);
                }
            }
        }
    }
}`;

const dfsJavaList = `// DFS implementation using adjacency list in Java
import java.util.*;

class Graph {
    public static void dfs(int node, List<List<Integer>> adjList, boolean[] visited) {
        visited[node] = true;
        System.out.print(node + " ");
        
        for (int neighbor : adjList.get(node)) {
            if (!visited[neighbor]) {
                dfs(neighbor, adjList, visited);
            }
        }
    }
}`;


export {
    binarySearchJava,
    linearSearchJava,
    bubbleSortJava,
    insertionSortJava,
    selectionSortJava,
    mergeSortJava,
    dfsJava,
    bfsJava,
    dijkstraJava,
    aStarJava,
    bfsJavaList,
    dfsJavaList
};

