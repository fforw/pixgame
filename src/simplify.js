
export function perpendicularDistance(px, py, lineStartX, lineStartY, lineEndX, lineEndY) {

    let dx = lineEndX - lineStartX;
    let dy = lineEndY - lineStartY;

    // Normalize
    const mag = Math.sqrt(dx * dx + dy * dy);
    if (mag > 0.0) {
        dx /= mag;
        dy /= mag;
    }
    const pvx = px - lineStartX;
    const pvy = py - lineStartY;

    // Get dot product (project pv onto normalized direction)
    const pvDot = dx * pvx + dy * pvy;

    // Scale line direction vector and subtract it from pv
    const ax = pvx - pvDot * dx;
    const ay = pvy - pvDot * dy;

    return Math.sqrt(ax * ax + ay * ay);
}

function simplifyRec(points, start, end, epsilon, out) {

    let dMax = 0;
    let index = 0;

    const startX = points[start];
    const startY = points[start + 1];
    const endX = points[end];
    const endY = points[end + 1];

    for(let i = start + 2; i < end; i+= 2)
    {
        const d = perpendicularDistance(
            points[i], points[i+1],
            startX, startY,
            endX, endY
        );

        if (d > dMax)
        {
            index = i;
            dMax = d;
        }
    }

    if (dMax > epsilon)
    {
        simplifyRec(points, start, index, epsilon, out);
        simplifyRec(points, index, end, epsilon, out);
    }
    else
    {
        out.push(
            endX,
            endY
        )
    }
}


/**
 * Performs a recursive Ramer–Douglas–Peucker simplification of the given points array.
 *
 * @param {Array<Number>} points    Array with coordinates in pairs ( [x0,y0,x1,y1, ... xN, yN] )
 * @param {Number} epsilon          Acceptable error value. The higher, the more simplified the points will be.
 * @param {boolean} [repeatFirst]   whether to repeat the first point inline in the input array
 * @return {Array<Number>} array with simplified points in pairs
 */
export default function simplify(points, epsilon, repeatFirst = false) {

    if (repeatFirst)
    {
        // repeat first point for simplification
        points.push(
            points[0],
            points[1],
        );
    }

    const out = [points[0], points[1]];
    simplifyRec(points, 0, points.length - 2, epsilon, out);
    if (repeatFirst)
    {
        return out.slice(0,out.length - 2);
    }
    return out;
}
