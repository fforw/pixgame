// Delaunay code adapted from https://github.com/ironwallaby/delaunay

const EPSILON = 1.0 / 1048576.0;

function supertriangle(vertices)
{
    let xmin = Number.POSITIVE_INFINITY,
        ymin = Number.POSITIVE_INFINITY,
        xmax = Number.NEGATIVE_INFINITY,
        ymax = Number.NEGATIVE_INFINITY,
        i, dx, dy, dmax, xmid, ymid;

    for (i = vertices.length; i--;)
    {
        if (vertices[i * 2] < xmin)
        {
            xmin = vertices[i * 2];
        }
        if (vertices[i * 2] > xmax)
        {
            xmax = vertices[i * 2];
        }
        if (vertices[i * 2 + 1] < ymin)
        {
            ymin = vertices[i * 2 + 1];
        }
        if (vertices[i * 2 + 1] > ymax)
        {
            ymax = vertices[i * 2 + 1];
        }
    }

    dx = xmax - xmin;
    dy = ymax - ymin;
    dmax = Math.max(dx, dy);
    xmid = xmin + dx * 0.5;
    ymid = ymin + dy * 0.5;

    return [
        xmid - 20 * dmax, ymid - dmax,
        xmid, ymid + 20 * dmax,
        xmid + 20 * dmax, ymid - dmax
    ];
}


function circumcircle(vertices, i, j, k)
{
    const x1 = vertices[i * 2],
        y1 = vertices[i * 2 + 1],
        x2 = vertices[j * 2],
        y2 = vertices[j * 2 + 1],
        x3 = vertices[k * 2],
        y3 = vertices[k * 2 + 1],
        fabsy1y2 = Math.abs(y1 - y2),
        fabsy2y3 = Math.abs(y2 - y3);
    let xc, yc, m1, m2, mx1, mx2, my1, my2, dx, dy;

    /* Check for coincident points */
    if (fabsy1y2 < EPSILON && fabsy2y3 < EPSILON)
    {
        throw new Error("Eek! Coincident points!");
    }

    if (fabsy1y2 < EPSILON)
    {
        m2 = -((x3 - x2) / (y3 - y2));
        mx2 = (x2 + x3) / 2.0;
        my2 = (y2 + y3) / 2.0;
        xc = (x2 + x1) / 2.0;
        yc = m2 * (xc - mx2) + my2;
    }

    else if (fabsy2y3 < EPSILON)
    {
        m1 = -((x2 - x1) / (y2 - y1));
        mx1 = (x1 + x2) / 2.0;
        my1 = (y1 + y2) / 2.0;
        xc = (x3 + x2) / 2.0;
        yc = m1 * (xc - mx1) + my1;
    }

    else
    {
        m1 = -((x2 - x1) / (y2 - y1));
        m2 = -((x3 - x2) / (y3 - y2));
        mx1 = (x1 + x2) / 2.0;
        mx2 = (x2 + x3) / 2.0;
        my1 = (y1 + y2) / 2.0;
        my2 = (y2 + y3) / 2.0;
        xc = (m1 * mx1 - m2 * mx2 + my2 - my1) / (m1 - m2);
        yc = (fabsy1y2 > fabsy2y3) ?
            m1 * (xc - mx1) + my1 :
            m2 * (xc - mx2) + my2;
    }

    dx = x2 - xc;
    dy = y2 - yc;
    return {i: i, j: j, k: k, x: xc, y: yc, r: dx * dx + dy * dy};
}


function dedup(edges)
{
    let i, j, a, b, m, n;

    for (j = edges.length; j;)
    {
        b = edges[--j];
        a = edges[--j];

        for (i = j; i;)
        {
            n = edges[--i];
            m = edges[--i];

            if ((a === m && b === n) || (a === n && b === m))
            {
                edges.splice(j, 2);
                edges.splice(i, 2);
                break;
            }
        }
    }
}


const Delaunay = {
    triangulate: function (vertices) {
        const n = vertices.length / 2;
        let i, j, indices, superTri, open, closed, edges, dx, dy, a, b, c;

        /* Bail if there aren't enough vertices to form any triangles. */
        if (n < 3)
        {
            return [];
        }

        /* Slice out the actual vertices from the passed objects. (Duplicate the
         * array even if we don't, though, since we need to make a supertriangle
         * later on!) */
        vertices = vertices.slice(0);

        /* Make an array of indices into the vertex array, sorted by the
         * vertices' x-position. Force stable sorting by comparing indices if
         * the x-positions are equal. */
        indices = new Array(n);

        for (i = n; i--;)
        {
            indices[i] = i;
        }

        indices.sort(function (i, j) {
            const diff = vertices[j * 2] - vertices[i * 2];
            return diff !== 0 ? diff : i - j;
        });

        /* Next, find the vertices of the supertriangle (which contains all other
         * triangles), and append them onto the end of a (copy of) the vertex
         * array. */
        superTri = supertriangle(vertices);
        vertices = vertices.concat(superTri);

        /* Initialize the open list (containing the supertriangle and nothing
         * else) and the closed list (which is empty since we havn't processed
         * any triangles yet). */
        open = [circumcircle(vertices, n + 0, n + 1, n + 2)];
        closed = [];
        edges = [];

        /* Incrementally add each vertex to the mesh. */
        for (i = indices.length; i--; edges.length = 0)
        {
            c = indices[i];

            /* For each open triangle, check to see if the current point is
             * inside it's circumcircle. If it is, remove the triangle and add
             * it's edges to an edge list. */
            for (j = open.length; j--;)
            {
                /* If this point is to the right of this triangle's circumcircle,
                 * then this triangle should never get checked again. Remove it
                 * from the open list, add it to the closed list, and skip. */
                dx = vertices[c * 2] - open[j].x;
                if (dx > 0.0 && dx * dx > open[j].r)
                {
                    closed.push(open[j]);
                    open.splice(j, 1);
                    continue;
                }

                /* If we're outside the circumcircle, skip this triangle. */
                dy = vertices[c * 2 + 1] - open[j].y;
                if (dx * dx + dy * dy - open[j].r > EPSILON)
                {
                    continue;
                }

                /* Remove the triangle and add it's edges to the edge list. */
                edges.push(
                    open[j].i, open[j].j,
                    open[j].j, open[j].k,
                    open[j].k, open[j].i
                );
                open.splice(j, 1);
            }

            /* Remove any doubled edges. */
            dedup(edges);

            /* Add a new triangle for each edge. */
            for (j = edges.length; j;)
            {
                b = edges[--j];
                a = edges[--j];
                open.push(circumcircle(vertices, a, b, c));
            }
        }

        /* Copy any remaining open triangles to the closed list, and then
         * remove any triangles that share a vertex with the supertriangle,
         * building a list of triplets that represent triangles. */
        for (i = open.length; i--;)
        {
            closed.push(open[i]);
        }
        open.length = 0;

        for (i = closed.length; i--;)
        {
            if (closed[i].i < n && closed[i].j < n && closed[i].k < n)
            {
                open.push(closed[i].i, closed[i].j, closed[i].k);
            }
        }

        // we double all offsets so that they match our linear input buffer. Positions returned are 0,2,4,... sparing
        // the consumer of doing the multiplication
        for (let k = 0; k < open.length; k++)
        {
            open[k] *= 2;
        }

        /* Yay, we're done! */
        return open;
    },

    contains: function (vertices, offsetA, offsetB, offsetC, px, py, uvOut) {
        /* Bounding box test first, for quick rejections. */
        if ((px < vertices[offsetA] && px < vertices[offsetB] && px < vertices[offsetC]) ||
            (px > vertices[offsetA] && px > vertices[offsetB] && px > vertices[offsetC]) ||
            (py < vertices[offsetA + 1] && py < vertices[offsetB + 1] && py < vertices[offsetC + 1]) ||
            (py > vertices[offsetA + 1] && py > vertices[offsetB + 1] && py > vertices[offsetC + 1]))
        {
            uvOut.isNull = true;
        }
        else
        {

            const a = vertices[offsetB] - vertices[offsetA],
                b = vertices[offsetC] - vertices[offsetA],
                c = vertices[offsetB + 1] - vertices[offsetA + 1],
                d = vertices[offsetC + 1] - vertices[offsetA + 1],
                i = a * d - b * c;

            /* Degenerate tri. */
            if (i === 0.0)
            {
                return null;
            }

            const u = (d * (px - vertices[offsetA]) - b * (py - vertices[offsetA + 1])) / i,
                v = (a * (py - vertices[offsetA + 1]) - c * (px - vertices[offsetA])) / i;

            /* If we're outside the tri, fail. */
            if (u < 0.0 || v < 0.0 || (u + v) > 1.0)
            {
                uvOut.isNull = true;
            }
            else
            {
                uvOut.u = u;
                uvOut.v = v;
                uvOut.isNull = false;
            }
        }
    }
};

export default Delaunay
