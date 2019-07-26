// Given three colinear points p, q, r, the function checks if 
// point q lies on line segment 'pr' 
function onSegment(px, py, qx, qy, rx, ry)
{
    return qx < Math.max(px, rx) && qx > Math.min(px, rx) &&
           qy < Math.max(py, ry) && qy > Math.min(py, ry);

}


// To find orientation of ordered triplet (p, q, r).
// The function returns following values 
// 0 --> p, q and r are colinear 
// 1 --> Clockwise 
// 2 --> Counterclockwise 
function orientation(px, py, qx, qy, rx, ry)
{
    // See https://www.geeksforgeeks.org/orientation-3-ordered-points/ 
    // for details of below formula. 
    const val = (qy - py) * (rx - qx) -
                (qx - px) * (ry - qy);

    return Math.sign(val);
}


/**
 * Returns true if the given line-segments x1,y1 -> x2,y2 and x3,y3 -> x4,y4 intersect, but *not* when the lines
 * share an start or end point.
 *
 * @param {Number} x1   x-coordinate 1
 * @param {Number} y1   y-coordinate 1
 * @param {Number} x2   x-coordinate 2
 * @param {Number} y2   y-coordinate 2
 * @param {Number} x3   x-coordinate 3
 * @param {Number} y3   y-coordinate 3
 * @param {Number} x4   x-coordinate 4
 * @param {Number} y4   y-coordinate 4
 * @return {boolean}
 */
export function linesCross(x1, y1, x2, y2, x3, y3, x4, y4)
{

    if (
        (x1 === x2 && y1 === y2) ||
        (x1 === x3 && y1 === y3) ||
        (x1 === x4 && y1 === y4) ||
        (x2 === x3 && y2 === y3) ||
        (x2 === x4 && y2 === y4) ||
        (x3 === x4 && y3 === y4)
    )
    {
        return false;
    }

    // Find the four orientations needed for general and
    // special cases 
    const o1 = orientation(x1, y1, x2, y2, x3, y3);
    const o2 = orientation(x1, y1, x2, y2, x4, y4);
    const o3 = orientation(x3, y3, x4, y4, x1, y1);
    const o4 = orientation(x3, y3, x4, y4, x2, y2);

    // General case
    if (o1 !== o2 && o3 !== o4)
    {
        return true;
    }

    // Special Cases
    if (o1 === 0 && onSegment(x1, y1, x3, y3, x2, y2))
    {
        return true;
    }
    if (o2 === 0 && onSegment(x1, y1, x4, y4, x2, y2))
    {
        return true;
    }
    if (o3 === 0 && onSegment(x3, y3, x1, y1, x4, y4))
    {
        return true;
    }
    if (o4 === 0 && onSegment(x3, y3, x2, y2, x4, y4))
    {
        return true;
    }

    return false; // Doesn't fall in any of the above cases 
}


export function isClockwise(vertices, offsetA, offsetB, offsetC)
{
    let sum = 0;

    let prevX = vertices[offsetC];
    let prevY = vertices[offsetC + 1];

    let currX = vertices[offsetA];
    let currY = vertices[offsetA + 1];

    sum += (currX - prevX) * (currY + prevY);

    prevX = currX;
    prevY = currY;

    currX = vertices[offsetB];
    currY = vertices[offsetB + 1];

    sum += (currX - prevX) * (currY + prevY);

    prevX = currX;
    prevY = currY;

    currX = vertices[offsetC];
    currY = vertices[offsetC + 1];

    sum += (currX - prevX) * (currY + prevY);

    return sum > 0
}


// console.log(linesCross(
//     0,0,100,100,
//     0,100, 100,0
// ))
// console.log(linesCross(
//     0,0,100,100,
//     10,0,110,100,
// ))
// console.log(linesCross(
//     0,0,100,100,
//     100,100,200,200,
// ))
// console.log(linesCross(
//     0,0,100,100,
//     0,0,200,300,
// ))
