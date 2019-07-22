import { Scene } from "../SceneGraph";
import WorldMap from "../WorldMap";
import generateAsync from "../generateAsync";
import WorldScene from "./WorldScene";
import { drawDigit } from "../util/drawDigit";
import drawTiles from "../drawTiles";


class StartScene extends Scene
{
    constructor(ctx, input, parent)
    {
        super(ctx, input, parent);
    }

    onEnter()
    {
        this.map = new WorldMap(128, "start");

        generateAsync("floppy-disk", percent => {

            const text = String(Math.round(percent * 100));

            const off = Math.round(((text.length + 1) * 4)/2);

            for (let i = 0; i < text.length; i++)
            {
                const digit = text.charCodeAt(i) - 48;

                drawDigit(this.map, -off + i * 4,-3, digit)
            }

            drawDigit(this.map, -off + text.length * 4,-3, 10)

        }).then(
            newMap => this.ctx.graph.goto(WorldScene, { map: newMap })
        );
    }

    render()
    {
        drawTiles(
            this.ctx,
            this.map,
            0,
            0,
            false
        );

    }

}

export default StartScene;
