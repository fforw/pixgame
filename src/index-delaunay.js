import Prando from "prando"
import Delaunay from "./util/Delaunay"
import now from "performance-now"

console.log("delaunay")

window.onload = () => {

    const size = 800;

    const canvasElement = document.createElement("canvas");
    canvasElement.width = size;
    canvasElement.height = size;

    document.getElementById("root").appendChild(canvasElement);

    const ctx = canvasElement.getContext("2d");
    ctx.fillStyle = "#222";
    ctx.strokeStyle = "#e8f0f8";
    ctx.fillRect(0,0,size,size);
    ctx.fillStyle = "#f44";

    const random = new Prando("happy-koala");


    const vertices = new Array(400 * 2);
    for (let i=0; i < 800; i += 2)
    {
        const x = random.nextInt(0, size);
        const y = random.nextInt(0, size);

        vertices[i] = x;
        vertices[i + 1] = y;
    }

    // const start = now();
    // // const result = Delaunator.from(vertices);
    // // console.log("Delaunator in " + (now() - start) + "ms");
    //

    const start2 = now();
    const triangles = Delaunay.triangulate(vertices);
    console.log("./Delaunay in " + (now() - start2) + "ms");
    console.log(triangles);

    for (let i = 0; i < triangles.length; i+=3)
    {
        const offsetA = triangles[i];
        const offsetB = triangles[i+1];
        const offsetC = triangles[i+2];

        ctx.beginPath();
        ctx.moveTo(vertices[offsetA],vertices[offsetA + 1]);
        ctx.lineTo(vertices[offsetB],vertices[offsetB + 1]);
        ctx.lineTo(vertices[offsetC],vertices[offsetC + 1]);
        ctx.closePath();
        ctx.stroke();

    }


    for (let i=0; i < 400; i += 2)
    {

        ctx.fillRect(vertices[i],vertices[i + 1],1,1);
    }

}
