
const nodeStates = {'unexplored': 'darkgray',
                    'visited'   : 'firebrick',
                    'active'    : 'darkorange',
                    'completed' : 'gray'};

const edgeStates = {'unexplored': 'lightgray',
                    'visited'   : 'firebrick',
                    'unused'    : '#E8E8E8',
                    'completed' : 'darkgray'};

function BFS(g, startNodeId){
    let startNode = g.getNodeById(startNodeId);
    let Q = [startNode];

    let k = 0
    g.fillEdgeProperty('stateColor', edgeStates.unexplored);
    g.fillNodeProperty('stateColor', nodeStates.unexplored);
    startNode.stateColor = nodeStates.visited;
    colorGraph(k++);

    while(Q.length > 0){
        let currentNode = Q.shift();
        currentNode.stateColor = nodeStates.active;
        colorGraph(k++);
        for(let e of g.incidentTo(currentNode)){
            let n = g.otherEnd(currentNode, e);
            if(n.stateColor == nodeStates.unexplored){
                Q.push(n);
                n.stateColor = nodeStates.visited;
                e.stateColor = edgeStates.visited;
            }else if(e.stateColor == edgeStates.visited 
                        && n.stateColor == nodeStates.completed){
                e.stateColor = edgeStates.completed;
            }else{
                e.stateColor = edgeStates.unused;
            }
            colorGraph(k++);
        }
        currentNode.stateColor = nodeStates.completed;
        colorGraph(k++);
    }
}
