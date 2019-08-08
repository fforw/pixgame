// noinspection ES6UnusedImports
import "./pixi-tilemap"
// noinspection ES6UnusedImports
import STYLES from "./style-height.css"

import { flatten, isPointInTriangle, TAU } from "./WorldMap";
import Services from "./workers/Services";
import Prando from "prando";
import now from "performance-now";
import macroPath, { localPath, pointDistance, searchWalkable } from "./navigation";
import simplify from "./util/simplify";
import { BLOCKED } from "./config";

// const START_X = 887;
// const START_Y = 606;
// const END_X = 1674;
// const END_Y = 640;

const START_X = 1438;
const START_Y = 1690;
const END_X = 1079;
const END_Y = 819;

// const START_X = 1424;
// const START_Y = 1596;
// const END_X = 1367;
// const END_Y = 1603;

// const START_X = 1424;
// const START_Y = 1596;
// const END_X = 1412;
// const END_Y = 1674;

let drawMask = false;
let path, segments;

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
            const {mask, sizeMask, sizeBits } = map;
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

//                 const length = path.length;
// //                const distances = new Array(length >> 1);
//                 ctx.strokeStyle = "#f00";
//
//                 ctx.beginPath();
//                 for (let i = 0; i < length; i += 2)
//                 {
//                     // if (i > 0)
//                     // {
//                     //     distances[i>>1] = pointDistance(path[i - 2], path[i - 1],path[i], path[i +1]);
//                     // }
//
//                     ctx.lineTo(
//                         path[i],
//                         path[i + 1]
//                     );
//                 }
//                 ctx.stroke();

                //console.log({distances});


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


            if (segments)
            {
                ctx.strokeStyle = "#f00";
                ctx.fillStyle = "#fff";
                ctx.beginPath();

                ctx.moveTo(path[0],path[1]);
                for (let i = 2; i < segments.length; i += 2)
                {
                    ctx.lineTo(
                        segments[i],
                        segments[i + 1]
                    );
                }
                ctx.stroke();

                for (let i = 0; i < segments.length; i += 2)
                {
                    ctx.fillRect(
                        segments[i] - 1,
                        segments[i + 1] - 1,
                        2,
                        2
                    );
                }
            }

            for (let i = 0; i < map.cities.length; i++)
            {
                const city = map.cities[i];

                const { centerX, centerY, radius } = city;

                //console.log("CITIES", { centerX, centerY, radius });

                ctx.fillStyle = "rgba(255,255,255,0.5)";
                ctx.beginPath();
                ctx.arc(centerX, centerY, radius, 0, TAU);
                ctx.fill();

            }


        }
        // DRAW END

        console.log(`Path from ${START_X}, ${START_Y} to ${END_X}, ${END_Y}`);
        const start = now();
        path = macroPath(
            map,
            START_X, START_Y,
            END_X, END_Y
        );

        console.log("Macro path=", path, (now() - start) + "ms")

        draw(drawMask);

        const { sizeMask, sizeBits } = map;

        const offset = searchWalkable(map, path[0], path[1], 20);

        let segs;

        let prevX = offset & sizeMask;
        let prevY = (offset >>> sizeBits) & sizeMask;
        for (let i = 2; i < path.length; i += 2)
        {
            const offset = searchWalkable(map, path[i], path[i + 1], 20);
            let x = offset & sizeMask;
            let y = (offset >>> sizeBits) & sizeMask;

            const sStart = now();
            const segment = localPath(map, prevX, prevY, x, y);
            if (segment === null)
            {
                throw new Error("No segment path for index "  + i + "( x1 = " + prevX + ", y1 =" + prevY +", x2 =" + x +", y2 = " + y);
            }
            console.log(" + segment in ", (now() - sStart) + "ms");
            segs = segs ? segs.concat(segment) : segment;

            prevX = x;
            prevY = y;
        }


        console.log("before simplify: " + segs.length + "points");

        segments = simplify(segs, 0.7);

        draw(drawMask);
            console.log(" = Segments =", segments, (now() - start) + "ms");


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
    });

};

