import { polyMinMax, xOrFillPolygon } from "./WorldMap";


const TAU = Math.PI * 2;

window.onload = () => {

    const size = 1024;

    const canvasElement = document.createElement("canvas");
    canvasElement.width = size;
    canvasElement.height = size;

    document.body.appendChild(canvasElement);

    const half = size/2;
    const largerSize = half * 0.41;
    const smallerSize= largerSize * 0.61;

    const step = TAU / 10;

    let outer = true;
    let off = 0;
    let angle = 0;

    const mask = new Uint8Array(size * size);

    const ctx = canvasElement.getContext("2d");

    const pts = new Array(20);
    for (let i=0; i < 10; i++)
    {
        const r = outer ? largerSize : smallerSize;

        pts[off++] = half + Math.cos(angle) * r;
        pts[off++] = half + Math.sin(angle) * r;

        angle += step;
        outer = !outer;
    }

    const minMax = polyMinMax([pts]);
    xOrFillPolygon(mask, pts, size, minMax, 2);

    const imageData = ctx.createImageData(size, size);
    const { data } = imageData;
    off = 0;
    for (let i = 0; i < mask.length; i++)
    {
        const maskElement = mask[i];

        data[off++] = maskElement ? 255 : 0;
        data[off++] = maskElement ? 255 : 0;
        data[off++] = maskElement ? 255 : 0;
        data[off++] = 255;
    }

    ctx.putImageData(imageData, 0, 0);

    // ctx.fillStyle = "#0f0";
    // ctx.beginPath();
    // ctx.moveTo(pts[pts.length - 2],pts[pts.length - 1]);
    //
    // for (let i = 0; i < pts.length; i+=2)
    // {
    //     ctx.lineTo(pts[i],pts[i + 1]);
    // }
    //
    // ctx.fill();
}
