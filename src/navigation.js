import Heap from "heap"
// import clone from "clone"
// import jiff from "jiff"
import { isPointInTriangle } from "./WorldMap";
import { BLOCKED, thingWalkability } from "./config";


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

function findNavMeshTriangles(map, sx, sy, ex, ey)
{
    const { rTree, triangles, vertices } = map.navMesh;

    tmpBBox.x = sx;
    tmpBBox.y = sy;

    let matches = rTree.search(tmpBBox);

    let startA;
    let startB;
    let startC;
    let startTriangle = -1;
    let endTriangle = -1;
    for (let i = 0; i < matches.length; i++)
    {
        const triangleOffset = matches[i];

        startA = triangles[triangleOffset];
        startB = triangles[triangleOffset + 1];
        startC = triangles[triangleOffset + 2];

        if (
            isPointInTriangle(
                vertices[startA], vertices[startA + 1],
                vertices[startB], vertices[startB + 1],
                vertices[startC], vertices[startC + 1],
                sx, sy
            )
        )
        {
            startTriangle = triangleOffset;
            break;
        }
    }

    tmpBBox.x = ex;
    tmpBBox.y = ey;
    matches = rTree.search(tmpBBox);

    let endA;
    let endB;
    let endC;
    for (let i = 0; i < matches.length; i++)
    {
        const triangleOffset = matches[i];

        endA = triangles[triangleOffset];
        endB = triangles[triangleOffset + 1];
        endC = triangles[triangleOffset + 2];

        if (
            isPointInTriangle(
                vertices[endA], vertices[endA + 1],
                vertices[endB], vertices[endB + 1],
                vertices[endC], vertices[endC + 1],
                ex, ey
            )
        )
        {
            endTriangle = triangleOffset;
            break;
        }
    }

    // if we haven't found either of the triangles, there is no path
    if (startTriangle < 0 && endTriangle < 0)
    {
        return null;
    }
    else
    {
        // if the triangles are either identical or share at least one point
        if ((
            startTriangle === endTriangle ||
            startA === endA ||
            startA === endB ||
            startA === endC ||
            startB === endA ||
            startB === endB ||
            startB === endC ||
            startC === endA ||
            startC === endB ||
            startC === endC
        ))
        {
            // ... we better go directly
            return [0,0];
        }
        return [ startTriangle , endTriangle ];
    }


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



function addPointToTriangle(navMesh, triangle, x, y)
{
    const { nodes, triangles } = navMesh;

    const nodeA = triangles[triangle] >> 1;
    const nodeB = triangles[triangle + 1] >> 1;
    const nodeC = triangles[triangle + 2] >> 1;

    const newNode = nodes.length;
    nodes.push({
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
    });

    nodes[nodeA].to.push(newNode);
    nodes[nodeB].to.push(newNode);
    nodes[nodeC].to.push(newNode);

    nodes[nodeA].cost.push(100);
    nodes[nodeB].cost.push(100);
    nodes[nodeC].cost.push(100);
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

    nodes[nodeA].to = nodes[nodeA].to.slice(0, -1);
    nodes[nodeB].to = nodes[nodeB].to.slice(0, -1);
    nodes[nodeC].to = nodes[nodeC].to.slice(0, -1);

    nodes[nodeA].cost = nodes[nodeA].cost.slice(0, -1);
    nodes[nodeB].cost = nodes[nodeB].cost.slice(0, -1);
    nodes[nodeC].cost = nodes[nodeC].cost.slice(0, -1);
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

    const { nodes } = map.navMesh;

    const openList = new Heap(compareNodes);
    const closedList = new Set();

    //console.log("macroPath", sx, sy, " to ", ex, ey);

    const result = findNavMeshTriangles(map, sx, sy, ex, ey);

    if (!result)
    {
        // no path found
        return null;
    }

    const [startTriangle, endTriangle] = result;

    // are start and end triangle the same (or share a point)?
    if (startTriangle === endTriangle)
    {
        // yes -> macro path goes directly from start to end
        return [
            sx,sy,
            ex,ey
        ];
    }

    const startNode = nodes.length;
    const endNode = nodes.length + 1;

    //console.log("TMP nodes:" , startNode, endNode);

    //const safety = clone(map.navMesh);

    // add temporary points for the start and end point
    addPointToTriangle(map.navMesh, startTriangle, sx, sy);
    addPointToTriangle(map.navMesh, endTriangle, ex, ey);

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

        //console.log("DIFF", jiff.diff(safety, map.navMesh));

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
    try
    {
        const { nodes } = map.navMesh;

        // manhattan distance
        const node = nodes[id];
        const dx = ex - node.x;
        const dy = ey - node.y;
        return Math.abs(dx) + Math.abs(dy);

    }
    catch(e)
    {
        console.error("distanceEstimate", {id, ex, ey}, e)
    }
}



function gridDistanceEstimate(map, offset, ex, ey)
{
    const { sizeMask, sizeBits } = map;

    const x = offset & sizeMask;
    const y = (offset >>> sizeBits) & sizeMask;

    const dx = ex -x ;
    const dy = ey -y ;

    return Math.sqrt(dx*dx+dy*dy);
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
 * @returns {null|Array<Number>}    macro path or null
 */

export function localPath(map, sx, sy, ex, ey)
{
    //console.log("local path", sx, sy, " to ", ex, ey);

    const { sizeMask, sizeBits, things} = map;

    const openList = new Heap(compareNodes);
    const closedList = new Set();

    const startOffset = ((sy & sizeMask) << sizeBits) + (sx & sizeMask);
    const endOffset = ((ey & sizeMask) << sizeBits) + (ex & sizeMask);

    const startTile = things[startOffset];
    const endTile = things[endOffset];

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

    while (!openList.empty())
    {

        const currentNode = openList.pop();
        if (currentNode.node === endOffset)
        {
            let node = currentNode;

            const path = [];

            while (node)
            {
                const nodeOff = node.node;
                const x = nodeOff & sizeMask;
                const y = (nodeOff >>> sizeBits) & sizeMask;

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
                ((((currentNode.node >>> sizeBits) + dy) & sizeMask) << sizeBits);

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
    }
    return null;
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
    const { sizeMask, things, sizeBits } = map;

    const offset = ((y & sizeMask) << sizeBits) + (x & sizeMask);
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

                //console.log("CHECK", x, y);

                const offset = ((y & sizeMask) << sizeBits) + (x & sizeMask);
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
