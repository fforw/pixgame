import Heap from "heap"
import { BLOCKED, isPointInTriangle, thingWalkability } from "./WorldMap";


const tmpBBox = {
    x: -1,
    y: -1,
    w: 2,
    h: 2
};

/**
 * Threshold below which paths will be ignored when passing it back. Square of the actual minimal sub-path length
 * @type {number}
 */
const MIN_MESH_PATH_SEGMENT_LENGTH = 64;

function findNavMeshTriangle(map, px, py)
{
    const { rTree, triangles, vertices } = map.navMesh;

    tmpBBox.x = px;
    tmpBBox.y = py;

    const matches = rTree.search(tmpBBox);

    for (let j = 0; j < matches.length; j++)
    {
        const triangleOffset = matches[j];

        const offsetA = triangles[triangleOffset];
        const offsetB = triangles[triangleOffset + 1];
        const offsetC = triangles[triangleOffset + 2];

        if (
            isPointInTriangle(
                vertices[offsetA], vertices[offsetA + 1],
                vertices[offsetB], vertices[offsetB + 1],
                vertices[offsetC], vertices[offsetC + 1],
                px, py
            )
        )
        {
            return triangleOffset;
        }
    }

    return -1;
}

function compareNodes(a,b)
{
    return a.f - b.f;
}

export function pointDistance(x0,y0,x1,y1)
{
    x0 -= x1;
    y0 -= y1;

    return Math.sqrt(x0*x0+y0*y0);
}



function addPointToTriangle(navMesh, triangle, newNode, x, y)
{
    const { nodes, triangles } = navMesh;

    const nodeA = triangles[triangle] >> 1;
    const nodeB = triangles[triangle + 1] >> 1;
    const nodeC = triangles[triangle + 2] >> 1;

    nodes[newNode] = {
        x,
        y,
        to: [
            nodeA,
            nodeB,
            nodeC,
        ],
        cost: [
            100,
            100,
            100
        ]
    };

    nodes[nodeA].to.push(newNode);
    nodes[nodeB].to.push(newNode);
    nodes[nodeC].to.push(newNode);

    nodes[nodeA].cost.push(100);
    nodes[nodeB].cost.push(100);
    nodes[nodeC].cost.push(100);
}


function insertTempNodes(navMesh, sx, sy, ex, ey, startTriangle, endTriangle)
{

    const { nodes } = navMesh;

    const startNode = nodes.length + 1;
    const endNode = nodes.length + 2;

    addPointToTriangle(navMesh, startTriangle, startNode, sx, sy);
    addPointToTriangle(navMesh, endTriangle, endNode, ex, ey);

}





function removeTempNodes(navMesh, startTriangle, endTriangle)
{
    const { nodes } = navMesh;

    const startNode = nodes.length - 2;
    const endNode = nodes.length - 1;

    removeLastPointFromTriangleNodes(navMesh, startTriangle, startNode);
    removeLastPointFromTriangleNodes(navMesh, endTriangle, endNode);

    navMesh.nodes = nodes.slice(0, -2);
}

function removeLastPointFromTriangleNodes(navMesh, triangle, tmpNode)
{
    const { nodes, triangles } = navMesh;

    const nodeA = triangles[triangle] >> 1;
    const nodeB = triangles[triangle + 1] >> 1;
    const nodeC = triangles[triangle + 2] >> 1;

    nodes[nodeA].to = nodes[nodeA].to.slice(-1);
    nodes[nodeB].to = nodes[nodeB].to.slice(-1);
    nodes[nodeC].to = nodes[nodeC].to.slice(-1);

    nodes[nodeA].cost = nodes[nodeA].cost.slice(-1);
    nodes[nodeB].cost = nodes[nodeB].cost.slice(-1);
    nodes[nodeC].cost = nodes[nodeC].cost.slice(-1);
}


/**
 * Does macro/word-level a-* path planning based on the prepared navigation mesh.
 *
 * This method is *very* expensive for longer paths. Use macroPath() to plan paths.
 *
 *
 * @param {WorldMap} map    world map
 * @param {Number} sx       start x-coordinate
 * @param {Number} sy       start y-coordinate
 * @param {Number} ex       end x-coordinate
 * @param {Number} ey       end y-coordinate
 *
 * @returns {null|Array<Number>}    local path or null
 */
export default function macroPath(map, sx, sy, ex, ey) {

    const { nodes, vertices } = map.navMesh;

    const openList = new Heap(compareNodes);
    const closedList = new Set();

    const startTriangle = findNavMeshTriangle(map, sx, sy, ex, ey);
    const endTriangle = findNavMeshTriangle(map, ex, ey, sx, sy);

    // if we did not find both triangles
    if (startTriangle < 0 || endTriangle < 0)
    {
        // no path
        return null;
    }

    // are start and end triangle the same?
    if (startTriangle === endTriangle)
    {
        // yes -> macro path goes directly from start to end
        return [
            sx,sy,
            ex,ey
        ];
    }

    const startNode = nodes.length + 1;
    const endNode = nodes.length + 2;

    insertTempNodes(map.navMesh, sx, sy, ex, ey, startTriangle, endTriangle);

    try
    {
        // console.log("START at #" + startNode + "=", nodes[startNode].x, nodes[startNode].y)
        // console.log("END at #" + endNode, "=", nodes[endNode].x, nodes[endNode].y)

        openList.push({
            g: 1,
            f: distanceEstimate(map, startNode, ex, ey),
            node: startNode
        });

        while (!openList.empty())
        {

            const currentNode = openList.pop();
            if (currentNode.node === endNode)
            {
                let node = currentNode;

                let prevX = -1;
                let prevY = 0;
                const path = [];

                let maxSegmentLength = 0;
                while(node)
                {
                    const nodeOff = node.node;
                    const x = nodes[nodeOff].x;
                    const y = nodes[nodeOff].y;

                    const nextNode = node.predecessor;

                    const dx = x - prevX;
                    const dy = y - prevY;

                    const len = dx * dx + dy * dy;
                    if (prevX < 0 || len >= MIN_MESH_PATH_SEGMENT_LENGTH || !nextNode)
                    {
                        path.unshift(
                            x,
                            y
                        );
                    }

                    if (len > maxSegmentLength)
                    {
                        maxSegmentLength = len;
                    }

                    node = nextNode;
                    prevX = x;
                    prevY = y;
                }

                //console.log("Max segment len =" , Math.sqrt(maxSegmentLength));
                return path;
            }

            closedList.add(currentNode.node);

            const { to, cost} = nodes[currentNode.node];

            for (let i = 0; i < to.length; i++)
            {
                const neighborId = to[i];

                if (closedList.has(neighborId))
                {
                    continue;
                }

                let neighbor = getHeapNode(openList, neighborId);
                const tentative_g = currentNode.g + cost[i];

                if (neighbor && tentative_g >= neighbor.g)
                    continue;

                if (!neighbor)
                {
                    neighbor = {
                        predecessor: currentNode,
                        g: tentative_g,
                        f: tentative_g + distanceEstimate(map, neighborId, ex, ey),
                        node: neighborId
                    };

                    openList.insert(neighbor);
                }
                else if (tentative_g < neighbor.g)
                {
                    neighbor.predecessor = currentNode;
                    neighbor.g = tentative_g;
                    neighbor.f = tentative_g + distanceEstimate(map, neighborId, ex, ey);

                    openList.updateItem(neighbor)
                }
            }
        }
        return null;
    }
    finally
    {
        removeTempNodes(map.navMesh, startTriangle, endTriangle);
    }

}

function getHeapNode(heap, id)
{
    const array = heap.toArray();
    for (let i = 0; i < array.length; i++)
    {
        const heapNode = array[i];
        if (heapNode.node === id)
        {
            return heapNode;
        }
    }
    return null;
}

function distanceEstimate(map, id, ex, ey)
{
    const { nodes } = map.navMesh;

    // manhattan distance
    const node = nodes[id];
    const dx = ex - node.x;
    const dy = ey - node.y;
    return Math.abs(dx) + Math.abs(dy);
}


function gridDistanceEstimate(map, offset, ex, ey)
{
    const { sizeMask, invSizeFactor } = map;

    const x = offset & sizeMask;
    const y = (offset * invSizeFactor) & sizeMask;

    const dx = ex -x ;
    const dy = ey -y ;

    return Math.sqrt(dx*dx+dy*dy);
}


/**
 * Finds the first walkable tile in a spiral pattern around a center tile
 * @param {WorldMap} map        world map
 * @param {Number} x            center x-coordinate
 * @param {Number} y            center y-coordinate
 * @param {Number} maxSteps     maximum number of steps to walk the spiral (default: 1000)
 * 
 * @returns {number} tile offset or -1 for none found
 */
export function searchWalkable(map, x, y, maxSteps = 1000)
{
    const { size, sizeMask, things } = map;

    const offset = (y & sizeMask) * size + (x & sizeMask);
    let thing= things[offset];
    if (thing < BLOCKED)
    {
        return offset;
    }

    let dx = 1;
    let dy = 0;
    let steps = 1;

    do
    {
        for (let i=0; i < 2; i++)
        {
            for (let j =0; j < steps; j++)
            {
                x += dx;
                y += dy;

                const offset = (y & sizeMask) * size + (x & sizeMask);
                thing = things[offset];
                if (thing < BLOCKED)
                {
                    return offset;
                }
            }

            // rotate 90 degrees clockwise
            let tmp = dx;
            dx = -dy;
            dy = tmp;

            if (--maxSteps === 0)
            {
                return -1;
            }
        }
        steps++;

    } while (thing >= BLOCKED);

}


export function localPathStep(ctx)
{
    const { map, openList, closedList, endOffset, ex, ey } = ctx;

    const { size, sizeMask, invSizeFactor, things } = map;

    const currentNode = openList.pop();
    if (currentNode.node === endOffset)
    {
        let node = currentNode;

        const path = [];

        while (node)
        {
            const nodeOff = node.node;
            const x = nodeOff & sizeMask;
            const y = (nodeOff * invSizeFactor) & sizeMask;

            path.unshift(
                x,
                y
            );
            node = node.predecessor;
        }

        return path;
    }

    closedList.add(currentNode.node);

    let dx = 1;
    let dy = 0;

    for (let i = 0; i < 4; i++)
    {
        const neighborOffset =
            ((currentNode.node + dx) & sizeMask) +
            ((currentNode.node * invSizeFactor + dy) & sizeMask) * size;

        if (things[neighborOffset] < BLOCKED)
        {
            if (!closedList.has(neighborOffset))
            {
                let neighbor = getHeapNode(openList, neighborOffset);
                const tentative_g = currentNode.g + thingWalkability[things[currentNode.node]] * 0.5;

                if (!neighbor || tentative_g < neighbor.g)
                {
                    if (!neighbor)
                    {
                        neighbor = {
                            predecessor: currentNode,
                            g: tentative_g,
                            f: tentative_g + gridDistanceEstimate(map, neighborOffset, ex, ey),
                            node: neighborOffset
                        };

                        openList.insert(neighbor);
                    }
                    else if (tentative_g < neighbor.g)
                    {
                        neighbor.predecessor = currentNode;
                        neighbor.g = tentative_g;
                        neighbor.f = tentative_g + gridDistanceEstimate(map, neighborOffset, ex, ey);

                        openList.updateItem(neighbor)
                    }
                }
            }
        }
        // rotate 90 degrees
        let tmp;
        tmp = dx;
        dx = -dy;
        dy = tmp;
    }

    return null;
}


/**
 * Does local-level a-* path planning based on the map grid.
 *
 * @param {WorldMap} map    world map
 * @param {Number} sx       start x-coordinate
 * @param {Number} sy       start y-coordinate
 * @param {Number} ex       end x-coordinate
 * @param {Number} ey       end y-coordinate
 *
 * @returns {{openList: *, endOffset: *, ex: *, ey: *, closedList: *, map: *}}    macro path or null
 */

//  * @returns {null|Array<Number>}    macro path or null
export function localPath(map, sx, sy, ex, ey)
{

    const {size, sizeMask, invSizeFactor, things} = map;

    const openList = new Heap(compareNodes);
    const closedList = new Set();

    const startOffset = (sy & sizeMask) * size + (sx & sizeMask);
    const endOffset = (ey & sizeMask) * size + (ex & sizeMask);

    const startTile = things[startOffset];
    const endTile = things[endOffset];

    console.log({startTile, endTile, limit: BLOCKED})

    if (startTile >= BLOCKED || endTile >= BLOCKED)
    {
        return null;
    }

    // console.log("START at #" + startNode + "=", nodes[startNode].x, nodes[startNode].y)
    // console.log("END at #" + endNode, "=", nodes[endNode].x, nodes[endNode].y)

    openList.push({
        g: 1,
        f: gridDistanceEstimate(map, startOffset, ex, ey),
        node: startOffset
    });

    // while (!openList.empty())
    // {
    //     const path = localPathStep(ctx);
    //     if (path != null)
    //     {
    //         return path;
    //     }
    //
    // }
    // return null;

    return {map, openList, closedList, endOffset, ex, ey};
}



