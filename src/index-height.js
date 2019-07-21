// noinspection ES6UnusedImports
import "./pixi-tilemap"
// noinspection ES6UnusedImports
import STYLES from "./style-height.css"

import WorldMap, { isPointInPolygon } from "./WorldMap";


let posX = 0, posY = 0, timerId;

window.onload = () => {

    const loading = document.querySelector("div.loading");
    loading.parentNode.removeChild(loading);

    const size = 2048;

    const canvasElement = document.createElement("canvas");
    canvasElement.width = size;
    canvasElement.height = size;

    document.getElementById("root").appendChild(canvasElement);

    const ctx = canvasElement.getContext("2d");


    const map = WorldMap.generate(size, "floppy-disk");
    const imageData = map.render(ctx);
    ctx.putImageData(imageData, 0, 0);


    function drawPolygon(polygon)
    {
        ctx.beginPath();
        ctx.moveTo(polygon[0], polygon[1]);
        for (let i = 2; i < polygon.length; i += 2)
        {
            ctx.lineTo(polygon[i], polygon[i + 1]);
        }
        ctx.stroke();
    }


    function draw()
    {
        //console.log("DRAW")

        const { polygons } = map;

        const selected = [];
        const nonSelected = [];

        for (let i = 0; i < polygons.length; i++)
        {
            const polygon = polygons[i];

            if (isPointInPolygon(posX, posY, polygon))
            {
                selected.push(polygon)
            }
            else
            {
                nonSelected.push(polygon)
            }
        }


        const { length: selectedLength } = selected;
        const { length: nonSelectedLength } = nonSelected;

        ctx.strokeStyle="#000";
        for (let i = 0; i < nonSelectedLength; i++)
        {
            drawPolygon(nonSelected[i]);
        }
        ctx.strokeStyle="#f0f";
        for (let i = 0; i < selectedLength; i++)
        {
            drawPolygon(selected[i]);
        }

        // const {vertices, triangles} = map;
        // ctx.strokeStyle = "#f44";
        //
        // for (let i = 0; i < triangles.length; i += 3)
        // {
        //     const offsetA = triangles[i];
        //     const offsetB = triangles[i + 1];
        //     const offsetC = triangles[i + 2];
        //
        //     ctx.beginPath();
        //     ctx.moveTo(vertices[offsetA], vertices[offsetA + 1]);
        //     ctx.lineTo(vertices[offsetB], vertices[offsetB + 1]);
        //     ctx.lineTo(vertices[offsetC], vertices[offsetC + 1]);
        //     ctx.stroke();
        // }
    }


    draw();

    canvasElement.addEventListener("mousemove", ev => {

        posX = ev.clientX;
        posY = ev.clientY;

        if (timerId)
        {
            clearTimeout(timerId);
        }

        timerId = setTimeout(update, 10);

    }, true);


    function update()
    {
        timerId = null;
        draw();
    }

    console.log("ready");
};
