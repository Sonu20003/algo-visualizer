const linearSearchPython =
    `# Linear Search in Python
def linear_search(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:
            return i  # Return the index if found
    return -1  # Return -1 if not found
`;

const binarySearchPython =
    `# Binary Search in Python
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1
`;

const bubbleSortPython =
    `# Bubble Sort in Python
def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr
`;

const insertionSortPython =
    `# Insertion Sort in Python
def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr
`;

const selectionSortPython =
    `# Selection Sort in Python
def selection_sort(arr):
    n = len(arr)
    for i in range(n):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr
`;

const mergeSortPython =
    `# Merge Sort in Python
def merge_sort(arr):
    if len(arr) > 1:
        mid = len(arr) // 2
        left_half = arr[:mid]
        right_half = arr[mid:]

        merge_sort(left_half)
        merge_sort(right_half)

        i = j = k = 0
        while i < len(left_half) and j < len(right_half):
            if left_half[i] < right_half[j]:
                arr[k] = left_half[i]
                i += 1
            else:
                arr[k] = right_half[j]
                j += 1
            k += 1

        while i < len(left_half):
            arr[k] = left_half[i]
            i += 1
            k += 1

        while j < len(right_half):
            arr[k] = right_half[j]
            j += 1
            k += 1
    return arr
`;

const bfsPython = `# BFS implementation using adjacency matrix
def bfs(start, adj_matrix):
    visited = [False] * len(adj_matrix)
    queue = [start]
    visited[start] = True
    
    while queue:
        node = queue.pop(0)
        print(node, end=" ")
        
        for i in range(len(adj_matrix[node])):
            if adj_matrix[node][i] and not visited[i]:
                visited[i] = True
                queue.append(i)
`;

const dfsPython = `# DFS implementation using adjacency matrix
def dfs(node, adj_matrix, visited):
    visited[node] = True
    print(node, end=" ")
    
    for i in range(len(adj_matrix[node])):
        if adj_matrix[node][i] and not visited[i]:
            dfs(i, adj_matrix, visited)
`;

const dijkstraPython = `# Dijkstra's Algorithm using adjacency matrix
import heapq

def dijkstra(start, adj_matrix):
    n = len(adj_matrix)
    dist = [float('inf')] * n
    dist[start] = 0
    pq = [(0, start)]
    
    while pq:
        d, node = heapq.heappop(pq)
        if d > dist[node]:
            continue
        
        for i in range(n):
            if adj_matrix[node][i] and dist[node] + adj_matrix[node][i] < dist[i]:
                dist[i] = dist[node] + adj_matrix[node][i]
                heapq.heappush(pq, (dist[i], i))
    return dist
`;

const aStarPython = `# A* Algorithm using adjacency matrix
import heapq

def a_star(start, goal, adj_matrix, heuristic):
    pq = [(0 + heuristic[start], 0, start)]
    g_score = {i: float('inf') for i in range(len(adj_matrix))}
    g_score[start] = 0
    
    while pq:
        _, g, node = heapq.heappop(pq)
        if node == goal:
            return g_score[goal]
        
        for i in range(len(adj_matrix[node])):
            if adj_matrix[node][i]:
                tentative_g = g_score[node] + adj_matrix[node][i]
                if tentative_g < g_score[i]:
                    g_score[i] = tentative_g
                    heapq.heappush(pq, (tentative_g + heuristic[i], tentative_g, i))
    return -1
`;

const bfsPythonList = `# BFS implementation using adjacency list
def bfs(start, adj_list):
    visited = [False] * len(adj_list)
    queue = [start]
    visited[start] = True
    
    while queue:
        node = queue.pop(0)
        print(node, end=" ")
        
        for neighbor in adj_list[node]:
            if not visited[neighbor]:
                visited[neighbor] = True
                queue.append(neighbor)
`;

const dfsPythonList = `# DFS implementation using adjacency list
def dfs(node, adj_list, visited):
    visited[node] = True
    print(node, end=" ")
    
    for neighbor in adj_list[node]:
        if not visited[neighbor]:
            dfs(neighbor, adj_list, visited)
`;

const naivePython = `# Naive String Matching Algorithm in Python
def naive_search(text, pattern):
    n, m = len(text), len(pattern)
    for i in range(n - m + 1):
        if text[i:i+m] == pattern:
            print(f"Pattern found at index {i}")
`;

const kmpPython = `# KMP Algorithm in Python
def compute_lps(pattern):
    lps = [0] * len(pattern)
    length, i = 0, 1
    while i < len(pattern):
        if pattern[i] == pattern[length]:
            length += 1
            lps[i] = length
            i += 1
        elif length:
            length = lps[length - 1]
        else:
            lps[i] = 0
            i += 1
    return lps

def kmp_search(text, pattern):
    n, m = len(text), len(pattern)
    lps = compute_lps(pattern)
    i, j = 0, 0
    while i < n:
        if text[i] == pattern[j]:
            i += 1
            j += 1
        if j == m:
            print(f"Pattern found at index {i - j}")
            j = lps[j - 1]
        elif i < n and text[i] != pattern[j]:
            j = lps[j - 1] if j else i + 1
`;

const rabinKarpPython = `# Rabin-Karp Algorithm in Python
d = 256
q = 101

def rabin_karp(text, pattern):
    n, m = len(text), len(pattern)
    h = pow(d, m-1) % q
    p, t = 0, 0
    for i in range(m):
        p = (d * p + ord(pattern[i])) % q
        t = (d * t + ord(text[i])) % q
    for i in range(n - m + 1):
        if p == t and text[i:i+m] == pattern:
            print(f"Pattern found at index {i}")
        if i < n - m:
            t = (d * (t - ord(text[i]) * h) + ord(text[i + m])) % q
            if t < 0:
                t += q
`;

export {
    binarySearchPython,
    linearSearchPython,
    bubbleSortPython,
    insertionSortPython,
    selectionSortPython,
    mergeSortPython,
    bfsPython,
    dfsPython,
    dijkstraPython,
    aStarPython,
    bfsPythonList,
    dfsPythonList,
    naivePython,
    kmpPython,
    rabinKarpPython,
};
