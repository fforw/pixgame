// noinspection ES6UnusedImports
import "./pixi-tilemap"
// noinspection ES6UnusedImports
import STYLES from "./style-height.css"

import { isPointInTriangle} from "./WorldMap";
import Services from "./workers/Services";
import Prando from "prando";
import now from "performance-now";
import macroPath, { localPath, localPathStep, pointDistance, searchWalkable } from "./navigation";

import raf from "raf"
import { BLOCKED, thingWalkability } from "./tilemap-config";

let drawMask = false;

let pathContext;


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
const END_X = 1079;
const END_Y = 819;

let posStart, posEnd;

let path, pathSegment, sx, sy, ex, ey, segmentPos = 0;


function pos(map, startPos)
{
    const {sizeMask, sizeBits} = map;

    return {
        x: (startPos & sizeMask),
        y: ((startPos >>> sizeBits) & sizeMask)
    };
}


function getAABB(sx, sy, ex, ey, padding)
{
    const x = Math.min(sx - padding, ex - padding)|0;
    const y = Math.min(sy - padding, ey - padding)|0;

    const maxX = Math.max(sx + padding, ex + padding)|0;
    const maxY = Math.max(sy + padding, ey + padding)|0;

    return {
        x,
        y,
        w: maxX - x,
        h: maxY - y
    };
}


window.onload = () => {

    const size = Math.min(window.innerWidth, window.innerHeight);

    const canvasElement = document.createElement("canvas");
    canvasElement.width = size;
    canvasElement.height = size;

    document.getElementById("root").appendChild(canvasElement);

    const ctx = canvasElement.getContext("2d");

    Services.generateMap("floppy-disk", 2048).then(map => {

        function draw()
        {

            drawLocalTiles(map, sx, sy, ex, ey, 5);
        }


        const start = now();
        path = macroPath(
            map,
            START_X, START_Y,
            END_X, END_Y
        );

        const segStart = now();
        console.log("PATH", path, "time =", (segStart - start) + "ms");

        sx = path[0];
        sy = path[1];
        ex = path[2];
        ey = path[3];


        const startPos = searchWalkable(map, sx, sy, 100);
        const endPos = searchWalkable(map, ex, ey, 100);

        posStart = pos(map, startPos);
        posEnd = pos(map, endPos);

        console.log("Improved start", sx, sy, "=>", posStart);
        console.log("Improved end", ex, ey, "=>", posEnd);

        if (startPos < 0)
        {
            console.log("start not walkable")
        }
        else if (endPos < 0)
        {
            console.log("start not walkable")
        }
        else
        {
            const {sizeMask, sizeBits} = map;

            pathContext = localPath(
                map,
                startPos & sizeMask, (startPos >>> sizeBits) & sizeMask,
                endPos & sizeMask, (endPos >>> sizeBits) & sizeMask,
            );

            localPathStep(pathContext);

        }

        draw();

        canvasElement.addEventListener(
            "click",
            ev => {

                const rect = canvasElement.getBoundingClientRect();
                const x = ev.clientX - rect.left;
                const y = ev.clientY - rect.top;
                console.log("x: " + x + " y: " + y);

                //drawMask = !drawMask;
                //draw(drawMask);

                if (segmentPos < path.length - 2)
                {
                    sx = path[segmentPos];
                    sy = path[segmentPos + 1];
                    ex = path[segmentPos + 2];
                    ey = path[segmentPos + 3];

                    const startPos = searchWalkable(map, sx, sy, 100);
                    const endPos = searchWalkable(map, ex, ey, 100);

                    posStart = pos(map, startPos);
                    posEnd = pos(map, endPos);

                    console.log("Improved start", sx, sy, "=>", posStart);
                    console.log("Improved end", ex, ey, "=>", posEnd);

                    if (startPos < 0)
                    {
                        console.log("start not walkable")
                    }
                    else if (endPos < 0)
                    {
                        console.log("start not walkable")
                    }
                    else
                    {
                        const {sizeMask, sizeBits} = map;

                        pathContext = localPath(
                            map,
                            startPos & sizeMask, (startPos >>> sizeBits) & sizeMask,
                            endPos & sizeMask, (endPos >>> sizeBits) & sizeMask,
                        );

                        ctx.clearRect(0,0, size, size);

                        raf(animate);
                    }
                }
            },
            true
        );

        const animate = () => {

            let stop = false;
            for (let i=0; i < 10; i++)
            {
                pathSegment = localPathStep(pathContext);

                if (pathSegment != null || pathContext.openList.empty())
                {
                    console.log("FOUND PATH", pathSegment);

                    segmentPos += 2;
                    stop = true;
                    break;
                }
            }
            drawLocalTiles(map, sx, sy,ex, ey, 5);

            if (pathSegment)
            {
                const aabb = getAABB(sx, sy, ex, ey, 5);
                const scale = (size / Math.max(aabb.w,aabb.h))|0;

                const hs = scale >> 1;

                ctx.strokeStyle = "#0f0";
                ctx.beginPath();

                let x = hs + (pathSegment[0] - aabb.x) * scale;
                let y = hs +(pathSegment[1] - aabb.y) * scale;
                ctx.moveTo(x, y);
                for (let j = 2; j < pathSegment.length; j+=2)
                {
                    x =  hs + (pathSegment[j] - aabb.x ) * scale;
                    y =  hs + (pathSegment[j + 1] - aabb.y ) * scale;
                    ctx.lineTo(x, y);
                }
                ctx.stroke();

            }

            if (!stop)
            {
                raf(animate);
            }
        };

        raf(animate);

        console.log("ready");
    });


    function drawLocalTiles(map, sx, sy, ex, ey, padding)
    {
        sx |= 0;
        sy |= 0;
        ex |= 0;
        ey |= 0;

        const aabb = getAABB(sx, sy, ex, ey, padding);

        const scale = (size / Math.max(aabb.w,aabb.h))|0;

        for (let y = 0; y < aabb.h; y++)
        {
            for (let x = 0; x < aabb.w; x++)
            {
                let thing = map.getThing(aabb.x + x, aabb.y + y);
                const walkable = thing < BLOCKED;

                if (aabb.x + x === sx && aabb.y + y === sy)
                {
                    ctx.fillStyle = walkable ? "#f00" : "#800";

                }
                else if (aabb.x + x === ex && aabb.y + y === ey)
                {
                    ctx.fillStyle = walkable ? "#0e0" : "#070";

                }
                else
                {
                    const v = (128 + (4 - thingWalkability[thing]) * 128 / 4)|0;
                    ctx.fillStyle = walkable ? `rgb(${v},${v},${v})` : "#000";
                }

                ctx.fillRect(x * scale, y * scale, scale, scale)
            }
        }

        const { openList, closedList } = pathContext;
        const array = openList.toArray();

        let minF = Infinity;
        let maxF = -Infinity;

        for (let i = 0; i < array.length; i++)
        {
            const node = array[i];

            if (node.f < minF)
            {
                minF = node.f;
            }
            if (node.f > maxF)
            {
                maxF = node.f;
            }
        }

        const { sizeMask, sizeBits } = map;

        for (let i = 0; i < array.length; i++)
        {
            const { node, f } = array[i];

            const px = node & sizeMask;
            const py = (node >>> sizeBits) & sizeMask;

            const value = ((f-minF) * 255 / maxF)|0;

            ctx.fillStyle = i === 0 ? "#ff0" : `rgb(0, 64, ${value})`;
            ctx.fillRect((px - aabb.x) * scale, ( py - aabb.y) * scale, scale, scale)
        }

        const iterator = closedList.entries();

        ctx.strokeStyle = "#444";
        for (let offset of iterator) {

            const px = offset[0] & sizeMask;
            const py = (offset[0] >>> sizeBits) & sizeMask;

            const x = (px - aabb.x) * scale;
            const y = (py - aabb.y) * scale;

            ctx.fillRect(x * scale, y * scale, scale, scale);
            ctx.beginPath();
            ctx.moveTo(x,y);
            ctx.lineTo(x + scale ,y + scale);
            ctx.moveTo(x + scale, y);
            ctx.lineTo(   x ,y + scale);
            ctx.stroke();
        }



        ctx.strokeStyle = "#00f";

        for (let y = 0; y < aabb.h; y++)
        {
            ctx.beginPath();
            ctx.moveTo(0, y * scale)
            ctx.lineTo(aabb.w * scale, y * scale)
            ctx.stroke();
        }



        for (let x = 0; x < aabb.w; x++)
        {
            ctx.beginPath();
            ctx.moveTo(x * scale, 0);
            ctx.lineTo(x * scale, aabb.h * scale);
            ctx.stroke();
        }
    }
};

