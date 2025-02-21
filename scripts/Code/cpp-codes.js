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

const bfsCpp = `// BFS implementation using adjacency matrix
#include <iostream>
#include <vector>
#include <queue>
using namespace std;

void bfs(int start, vector<vector<int>>& adjMatrix, vector<bool>& visited) {
    queue<int> q;
    q.push(start);
    visited[start] = true;
    
    while (!q.empty()) {
        int node = q.front();
        q.pop();
        cout << node << " ";
        
        for (int i = 0; i < adjMatrix[node].size(); i++) {
            if (adjMatrix[node][i] && !visited[i]) {
                visited[i] = true;
                q.push(i);
            }
        }
    }
}`;

const dfsCpp = `// DFS implementation using adjacency matrix
#include <iostream>
#include <vector>
using namespace std;

void dfs(int node, vector<vector<int>>& adjMatrix, vector<bool>& visited) {
    visited[node] = true;
    cout << node << " ";
    
    for (int i = 0; i < adjMatrix[node].size(); i++) {
        if (adjMatrix[node][i] && !visited[i]) {
            dfs(i, adjMatrix, visited);
        }
    }
}`;

const dijkstraCpp = `// Dijkstra's Algorithm using adjacency matrix
#include <iostream>
#include <vector>
#include <queue>
using namespace std;

typedef pair<int, int> pii;

vector<int> dijkstra(int start, vector<vector<int>>& adjMatrix, int n) {
    priority_queue<pii, vector<pii>, greater<pii>> pq;
    vector<int> dist(n, INT_MAX);
    
    pq.push({0, start});
    dist[start] = 0;
    
    while (!pq.empty()) {
        int d = pq.top().first, node = pq.top().second;
        pq.pop();
        
        if (d > dist[node]) continue;
        
        for (int i = 0; i < n; i++) {
            if (adjMatrix[node][i] && dist[node] + adjMatrix[node][i] < dist[i]) {
                dist[i] = dist[node] + adjMatrix[node][i];
                pq.push({dist[i], i});
            }
        }
    }
    return dist;
}`;

const aStarCpp = `// A* Algorithm using adjacency matrix
#include <iostream>
#include <vector>
#include <queue>
using namespace std;

typedef pair<int, int> pii;

struct Node {
    int id, g, h;
    bool operator>(const Node& other) const {
        return (g + h) > (other.g + other.h);
    }
};

int aStar(int start, int goal, vector<vector<int>>& adjMatrix, vector<int>& heuristic) {
    priority_queue<Node, vector<Node>, greater<Node>> pq;
    vector<int> gScore(adjMatrix.size(), INT_MAX);
    
    pq.push({start, 0, heuristic[start]});
    gScore[start] = 0;
    
    while (!pq.empty()) {
        Node current = pq.top(); pq.pop();
        
        if (current.id == goal) return gScore[goal];
        
        for (int i = 0; i < adjMatrix[current.id].size(); i++) {
            if (adjMatrix[current.id][i]) {
                int tentative_g = gScore[current.id] + adjMatrix[current.id][i];
                if (tentative_g < gScore[i]) {
                    gScore[i] = tentative_g;
                    pq.push({i, tentative_g, heuristic[i]});
                }
            }
        }
    }
    return -1;
}`;

const bfsCppList = `// BFS implementation using adjacency list
#include <iostream>
#include <vector>
#include <queue>
using namespace std;

void bfs(int start, vector<vector<int>>& adjList, vector<bool>& visited) {
    queue<int> q;
    q.push(start);
    visited[start] = true;
    
    while (!q.empty()) {
        int node = q.front();
        q.pop();
        cout << node << " ";
        
        for (int neighbor : adjList[node]) {
            if (!visited[neighbor]) {
                visited[neighbor] = true;
                q.push(neighbor);
            }
        }
    }
}`;

const dfsCppList = `// DFS implementation using adjacency list
#include <iostream>
#include <vector>
using namespace std;

void dfs(int node, vector<vector<int>>& adjList, vector<bool>& visited) {
    visited[node] = true;
    cout << node << " ";
    
    for (int neighbor : adjList[node]) {
        if (!visited[neighbor]) {
            dfs(neighbor, adjList, visited);
        }
    }
}`;

const naiveCpp = `// Naive String Matching Algorithm in C++
#include <iostream>
#include <string>
using namespace std;

void naiveSearch(string text, string pattern) {
    int n = text.size();
    int m = pattern.size();
    
    for (int i = 0; i <= n - m; i++) {
        int j;
        for (j = 0; j < m; j++) {
            if (text[i + j] != pattern[j]) {
                break;
            }
        }
        if (j == m) {
            cout << "Pattern found at index " << i << endl;
        }
    }
}`;

const kmpCpp = `// KMP Algorithm in C++
#include <iostream>
#include <vector>
using namespace std;

void computeLPS(string pattern, vector<int>& lps) {
    int len = 0, i = 1;
    lps[0] = 0;
    while (i < pattern.size()) {
        if (pattern[i] == pattern[len]) {
            lps[i++] = ++len;
        } else if (len) {
            len = lps[len - 1];
        } else {
            lps[i++] = 0;
        }
    }
}

void KMPSearch(string text, string pattern) {
    int n = text.size(), m = pattern.size();
    vector<int> lps(m);
    computeLPS(pattern, lps);
    int i = 0, j = 0;
    while (i < n) {
        if (text[i] == pattern[j]) {
            i++, j++;
        }
        if (j == m) {
            cout << "Pattern found at index " << i - j << endl;
            j = lps[j - 1];
        } else if (i < n && text[i] != pattern[j]) {
            j ? j = lps[j - 1] : i++;
        }
    }
}`;

const rabinKarpCpp = `// Rabin-Karp Algorithm in C++
#include <iostream>
using namespace std;

#define d 256
#define q 101

void rabinKarp(string text, string pattern) {
    int n = text.size(), m = pattern.size();
    int h = 1, p = 0, t = 0;
    for (int i = 0; i < m - 1; i++) h = (h * d) % q;
    for (int i = 0; i < m; i++) {
        p = (d * p + pattern[i]) % q;
        t = (d * t + text[i]) % q;
    }
    for (int i = 0; i <= n - m; i++) {
        if (p == t) {
            bool match = true;
            for (int j = 0; j < m; j++) {
                if (text[i + j] != pattern[j]) {
                    match = false;
                    break;
                }
            }
            if (match) cout << "Pattern found at index " << i << endl;
        }
        if (i < n - m) {
            t = (d * (t - text[i] * h) + text[i + m]) % q;
            if (t < 0) t += q;
        }
    }
}`;

export {
    binarySearchCpp,
    linearSearchCpp,
    bubbleSortCpp,
    insertionSortCpp,
    selectionSortCpp,
    mergeSortCpp,
    bfsCpp,
    dfsCpp,
    dijkstraCpp,
    aStarCpp,
    bfsCppList,
    dfsCppList,
    naiveCpp,
    kmpCpp,
    rabinKarpCpp,
};
