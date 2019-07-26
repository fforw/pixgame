// noinspection ES6UnusedImports
import "./pixi-tilemap"
// noinspection ES6UnusedImports
import STYLES from "./style-height.css"

import { BLOCKED, isPointInTriangle } from "./WorldMap";
import Services from "./workers/Services";
import Prando from "prando";
import now from "performance-now";
import macroPath, { localPath, pointDistance, searchWalkable } from "./navigation";

// const START_X = 887;
// const START_Y = 606;
// const END_X = 1674;
// const END_Y = 640;

const START_X = 1438;
const START_Y = 1690;
const END_X = 1079;
const END_Y = 819;

let drawMask = false;
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
//                const distances = new Array(length >> 1);
                ctx.strokeStyle = "#f00";

                ctx.beginPath();
                for (let i = 0; i < length; i += 2)
                {
                    // if (i > 0)
                    // {
                    //     distances[i>>1] = pointDistance(path[i - 2], path[i - 1],path[i], path[i +1]);
                    // }

                    ctx.lineTo(
                        path[i],
                        path[i + 1]
                    );
                }
                ctx.stroke();

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

        }


        console.log(`Path from ${START_X}, ${START_Y} to ${END_X}, ${END_Y}`);
        const start = now();
        path = macroPath(
            map,
            START_X, START_Y,
            END_X, END_Y
        );

        console.log("Macro path:", path, (now() - start) + "ms")

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
    });

};

