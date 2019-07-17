// noinspection ES6UnusedImports
import "./pixi-tilemap"

import now from "performance-now"

import WorldMap, {
    isVariant,
    pickVariant,
    WATER,
    WATER2,
    WATER3,
    SAND,
    SAND2,
    SAND3,
    GRASS,
    GRASS2,
    GRASS3,
    DIRT,
    DIRT2,
    DIRT3,
    ROCK,
    ROCK2,
    ROCK3,
    WOODS,
    WOODS2,
    WOODS3,
    WOODS4,
    WOODS5,
    WOODS6,
    RIVER,
    RIVER2,
    RIVER3,
    MARKER,
    MARKER2,
    MARKER3
} from "./WorldMap";


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

    canvasElement.addEventListener("click", ev => {

        console.log(`Click at ${ev.clientX}, ${ev.clientY}`);

    }, true);

    console.log("ready");
};
