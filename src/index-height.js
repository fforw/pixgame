// noinspection ES6UnusedImports
import STYLES from "./style.css"
import "./pixi-tilemap"

import Map from "./Map";


window.onload = () => {

    const loading = document.querySelector("div.loading");
    loading.parentNode.removeChild(loading);

    const size = 1024;

    const canvasElement = document.createElement("canvas");
    canvasElement.width = size;
    canvasElement.height = size;

    document.getElementById("root").appendChild(canvasElement);

    const ctx = canvasElement.getContext("2d");


    const map = Map.generate(size, "floppy-disk");
    const imageData = map.render(ctx);
    ctx.putImageData(imageData, 0, 0);

    console.log("ready");
};
