import { Scene } from "../SceneGraph";
import { HOUSE } from "../WorldMap";
import drawTiles from "../drawTiles";

const HOUSE_X = 1023;
const HOUSE_Y = 1193;


class WorldScene extends Scene {

    constructor(ctx, input, parent)
    {
        super(ctx, input, parent);

        const { map } = input;

        map.putThing(HOUSE_X, HOUSE_Y, HOUSE);

        this.ctx.map = map;

    }


    ticker(delta)
    {
    }

    render()
    {
        drawTiles(
            this.ctx,
            this.input.map,
            this.ctx.posX,
            this.ctx.posY
        );
    }
}

export default WorldScene
