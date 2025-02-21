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

const naiveJava = `// Naive String Matching Algorithm in Java
class NaiveStringMatching {
    static void naiveSearch(String text, String pattern) {
        int n = text.length(), m = pattern.length();
        for (int i = 0; i <= n - m; i++) {
            int j;
            for (j = 0; j < m; j++) {
                if (text.charAt(i + j) != pattern.charAt(j)) {
                    break;
                }
            }
            if (j == m) {
                System.out.println("Pattern found at index " + i);
            }
        }
    }
    public static void main(String[] args) {
        String text = "ABABABABABAB";
        String pattern = "ABA";
        naiveSearch(text, pattern);
    }
}`;

const kmpJava = `// KMP Algorithm in Java
class KMPStringMatching {
    static void computeLPS(String pattern, int[] lps) {
        int len = 0, i = 1;
        lps[0] = 0;
        while (i < pattern.length()) {
            if (pattern.charAt(i) == pattern.charAt(len)) {
                lps[i++] = ++len;
            } else if (len > 0) {
                len = lps[len - 1];
            } else {
                lps[i++] = 0;
            }
        }
    }
    static void KMPSearch(String text, String pattern) {
        int n = text.length(), m = pattern.length();
        int[] lps = new int[m];
        computeLPS(pattern, lps);
        int i = 0, j = 0;
        while (i < n) {
            if (text.charAt(i) == pattern.charAt(j)) {
                i++; j++;
            }
            if (j == m) {
                System.out.println("Pattern found at index " + (i - j));
                j = lps[j - 1];
            } else if (i < n && text.charAt(i) != pattern.charAt(j)) {
                j = (j > 0) ? lps[j - 1] : i + 1;
            }
        }
    }
    public static void main(String[] args) {
        String text = "ABABDABACDABABCABAB";
        String pattern = "ABABCABAB";
        KMPSearch(text, pattern);
    }
}`;

const rabinKarpJava = `// Rabin-Karp Algorithm in Java
class RabinKarpStringMatching {
    static final int d = 256;
    static final int q = 101;
    static void rabinKarp(String text, String pattern) {
        int n = text.length(), m = pattern.length();
        int h = 1, p = 0, t = 0;
        for (int i = 0; i < m - 1; i++) h = (h * d) % q;
        for (int i = 0; i < m; i++) {
            p = (d * p + pattern.charAt(i)) % q;
            t = (d * t + text.charAt(i)) % q;
        }
        for (int i = 0; i <= n - m; i++) {
            if (p == t) {
                boolean match = true;
                for (int j = 0; j < m; j++) {
                    if (text.charAt(i + j) != pattern.charAt(j)) {
                        match = false;
                        break;
                    }
                }
                if (match) System.out.println("Pattern found at index " + i);
            }
            if (i < n - m) {
                t = (d * (t - text.charAt(i) * h) + text.charAt(i + m)) % q;
                if (t < 0) t += q;
            }
        }
    }
    public static void main(String[] args) {
        String text = "GEEKS FOR GEEKS";
        String pattern = "GEEK";
        rabinKarp(text, pattern);
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
    dfsJavaList,
    naiveJava,
    kmpJava,
    rabinKarpJava,
};

