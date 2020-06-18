
import raf from "raf";
import { BLOCKED } from "./config";
import { TAU } from "./WorldMap";

window.onload = () => {

    const size = 800;
    const canvas = document.createElement("canvas");

    canvas.width = size;
    canvas.height = size;

    document.getElementById("root").appendChild(canvas);

    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#fff";

    let dx = 2;
    let dy = 0;
    let steps = 1;
    let stepCount = 0;
    let increaseSteps = false;
    let maxSteps = 160000;
    let gun = 1;
    let d = 1;

    let x = size >> 1;
    let y = size >> 1;


    function advance()
    {
        if (stepCount++ < steps)
        {
            x += dx;
            y += dy;

            //console.log("CHECK", x, y);

            const r = gun & 1 ? Math.min(d|0, 255) : 0;
            const g = gun & 2 ? Math.min(d|0, 255) : 0;
            const b = gun & 4 ? Math.min(d|0, 255) : 0;


            ctx.fillStyle = `rgb(${r},${g},${b})`;
            ctx.fillRect(x, y, 2, 2);

            if (maxSteps-- <= 0)
            {
                return false;
            }
        }
        else
        {
            stepCount = 0;
            // rotate 90 degrees clockwise
            let tmp = dx;
            dx = -dy;
            dy = tmp;

            if (increaseSteps)
            {
                gun++;
                if (gun === 8)
                {
                    gun = 1;
                    d = d * 1.2;
                }
                steps++;
            }
            increaseSteps = !increaseSteps;
        }
        return true;
    }


    const main = () => {

        for (let i=0; i < 100 ; i++)
        {
            if (!advance())
            {
                return;
            }
        }

        raf(main);
    };

    raf(main);
};
