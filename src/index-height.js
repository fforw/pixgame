// noinspection ES6UnusedImports
import "./pixi-tilemap"
// noinspection ES6UnusedImports
import STYLES from "./style-height.css"

import { isPointInTriangle } from "./WorldMap";
import Services from "./workers/Services";
import Prando from "prando";
import now from "performance-now";
import pathPlanning, { pointDistance } from "./navigation";


let posX = 0, posY = 0, timerId;

let drawMask = false;


function cmp(arrayA, arrayB)
{
    const {length} = arrayA;
    if (length !== arrayB.length)
    {
        return false
    }

    for (let i = 0; i < length; i++)
    {
        if (arrayA[i] !== arrayB[i])
        {
            return false;
        }
    }

    return true;
}


function isInside(x, y, minMax, offset)
{
    return minMax[offset] <= x && x <= minMax[offset + 1] && minMax[offset + 2] <= y && y <= minMax[offset + 3];
}

// const START_X = 887;
// const START_Y = 606;
// const END_X = 1674;
// const END_Y = 640;

const START_X = 1438;
const START_Y = 1690;
const END_X = 1076;
const END_Y = 819;



function triMinMax(triangles, vertices)
{
    const minMax = new Array(((triangles / 3) | 0) * 4);

    let minMaxOff = 0;
    for (let i = 0; i < triangles.length; i += 3)
    {
        const offsetA = triangles[i];
        const offsetB = triangles[i + 1];
        const offsetC = triangles[i + 2];

        const x0 = vertices[offsetA];
        const y0 = vertices[offsetA + 1];
        const x1 = vertices[offsetB];
        const y1 = vertices[offsetB + 1];
        const x2 = vertices[offsetC];
        const y2 = vertices[offsetC + 1];

        let minX = x0;
        let minY = y0;
        let maxX = x0;
        let maxY = y0;

        if (x1 < minX)
        {
            minX = x1;
        }
        if (x1 > maxX)
        {
            maxX = x1;
        }
        if (y1 < minY)
        {
            minY = y1;
        }
        if (y1 > maxY)
        {
            maxY = y1;
        }

        if (x2 < minX)
        {
            minX = x2;
        }
        if (x2 > maxX)
        {
            maxX = x2;
        }
        if (y2 < minY)
        {
            minY = y2;
        }
        if (y2 > maxY)
        {
            maxY = y2;
        }

        minMax[minMaxOff++] = minX;
        minMax[minMaxOff++] = maxX;
        minMax[minMaxOff++] = minY;
        minMax[minMaxOff++] = maxY;
    }

    return minMax;
}


// noinspection JSUnusedLocalSymbols
function doLocationSearchBenchmark(map)
{
    const {size} = map;
    const {vertices, triangles, rTree} = map.navMesh;

    const minMax = triMinMax(triangles, vertices);

    const rnd = new Prando(12345678);

    const repeat = 3000;

    let c1 = 0;
    let c2 = 0;
    let cMatch = 0;
    const r1 = [];
    const r2 = [];

    const bbox = {x: 0, y: 0, w: 2, h: 2};

    for (let i = 0; i < repeat; i++)
    {

        const px = rnd.nextInt(0, size - 1);
        const py = rnd.nextInt(0, size - 1);

        const s1 = now();

        bbox.x = px;
        bbox.y = py;

        const matches = rTree.search(bbox);

        cMatch += matches.length;

        for (let j = 0; j < matches.length; j++)
        {
            const offset = matches[j];

            const offsetA = triangles[offset];
            const offsetB = triangles[offset + 1];
            const offsetC = triangles[offset + 2];

            const x0 = vertices[offsetA];
            const y0 = vertices[offsetA + 1];
            const x1 = vertices[offsetB];
            const y1 = vertices[offsetB + 1];
            const x2 = vertices[offsetC];
            const y2 = vertices[offsetC + 1];

            if (isPointInTriangle(x0, y0, x1, y1, x2, y2, px, py))
            {
                r2.push(offset)
            }
        }
        const s2 = now();
        c1 += s2 - s1;
        let minMaxOffset = 0;
        for (let j = 0; j < triangles.length; j += 3)
        {
            const offsetA = triangles[j];
            const offsetB = triangles[j + 1];
            const offsetC = triangles[j + 2];

            const x0 = vertices[offsetA];
            const y0 = vertices[offsetA + 1];
            const x1 = vertices[offsetB];
            const y1 = vertices[offsetB + 1];
            const x2 = vertices[offsetC];
            const y2 = vertices[offsetC + 1];

            if (
                (
                    isInside(x0, y0, minMax, minMaxOffset) ||
                    isInside(x1, y1, minMax, minMaxOffset) ||
                    isInside(x2, y2, minMax, minMaxOffset)

                ) &&

                isPointInTriangle(x0, y0, x1, y1, x2, y2, px, py)
            )
            {
                r1.push(j)
            }

            minMaxOffset += 4;
        }

        c2 += now() - s2;
    }

    r1.sort();
    r2.sort();

    console.log("Brute Force:", Math.round((repeat / c2) * 1000) + " op/s");
    console.log("RTree:", Math.round((repeat / c1) * 1000) + " op/s, ", cMatch / repeat, "matches per op");
    console.log({r1, r2});
    console.log("results match:", cmp(r1, r2));
}

let path;

window.onload = () => {

    const size = 2048;

    const canvasElement = document.createElement("canvas");
    canvasElement.width = size;
    canvasElement.height = size;

    document.getElementById("root").appendChild(canvasElement);

    const ctx = canvasElement.getContext("2d");

    Services.generateMap("floppy-disk", size).then( map => {

        draw(drawMask);


        function draw(drawMask = false)
        {
            const {mask} = map;
            if (drawMask)
            {
                const imageData = ctx.createImageData(size, size);
                const {data} = imageData;
                let off = 0;
                for (let i = 0; i < mask.length; i++)
                {
                    const maskElement = mask[i];

                    data[off++] = maskElement !== 0 ? 255 : 0;
                    data[off++] = maskElement !== 0 ? 255 : 0;
                    data[off++] = maskElement !== 0 ? 255 : 0;
                    data[off++] = 255;
                }
                ctx.putImageData(imageData, 0, 0);

                const {vertices, triangles, rTree} = map.navMesh;
                ctx.strokeStyle = "#0d0";

                for (let i = 0; i < triangles.length; i += 3)
                {
                    const offsetA = triangles[i];
                    const offsetB = triangles[i + 1];
                    const offsetC = triangles[i + 2];

                    ctx.beginPath();
                    ctx.moveTo(vertices[offsetA], vertices[offsetA + 1]);
                    ctx.lineTo(vertices[offsetB], vertices[offsetB + 1]);
                    ctx.lineTo(vertices[offsetC], vertices[offsetC + 1]);
                    ctx.lineTo(vertices[offsetA], vertices[offsetA + 1]);
                    ctx.stroke();
                }
            }
            else
            {
                const imageData = map.render(ctx);
                ctx.putImageData(imageData, 0, 0);
            }

            if (path)
            {

                const length = path.length;
                const distances = new Array(length >> 1);
                ctx.strokeStyle = "#f00";

                ctx.beginPath();
                for (let i = 0; i < length; i += 2)
                {
                    if (i > 0)
                    {
                        distances[i>>1] = pointDistance(path[i - 2], path[i - 1],path[i], path[i +1]);
                    }

                    ctx.lineTo(
                        path[i],
                        path[i + 1]
                    );
                }
                ctx.stroke();

                console.log({distances});




                ctx.fillStyle = "#eee";
                ctx.beginPath();
                for (let i = 0; i < length; i += 2)
                {
                    const sx = (path[i ] - 2) | 0;
                    const sy = path[i + 1] - 2;
                    ctx.fillRect(sx, sy, 4, 4);
                }

                ctx.fillStyle = "#f0f";
                ctx.fillRect(START_X - 2, START_Y -2, 4, 4);
                ctx.fillRect(END_X - 2, END_Y - 2, 4, 4);

                ctx.stroke();
            }


            //const { polygons } = map;
            // ctx.strokeStyle="#f11";
            // for (let i = 0; i < polygons.length; i++)
            // {
            //     const polygon = polygons[i];
            //     ctx.beginPath();
            //
            //     const { length } = polygon;
            //
            //     ctx.moveTo(polygon[length - 2], polygon[length - 1]);
            //
            //     for (let i = 0; i < polygon.length; i += 2)
            //     {
            //         ctx.lineTo(polygon[i], polygon[i + 1]);
            //     }
            //     ctx.stroke();
            // }

            //doLocationSearchBenchmark(map)

        }

        const start = now();
        path = pathPlanning(
            map,
            START_X, START_Y,
            END_X, END_Y,
            null
        );
        console.log("PATH", path, "time =", (now() - start) + "ms");

        draw(drawMask);


        canvasElement.addEventListener(
            "click",
            ev => {

                const rect = canvasElement.getBoundingClientRect();
                const x = ev.clientX - rect.left;
                const y = ev.clientY - rect.top;
                console.log("x: " + x + " y: " + y);

                drawMask = !drawMask;
                draw(drawMask);

            },
            true
        );
        console.log("ready");
    })


};

function getCursorPosition(canvas, event) {
}
