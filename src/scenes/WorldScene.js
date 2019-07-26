import { Scene } from "../SceneGraph";
import { BLOCKED, EMPTY, HOUSE, IGLOO, SENSOR, SAND, SMALL_TREE } from "../WorldMap";
import drawTiles from "../drawTiles";

const HOUSE_X = 1280 - 4;
const HOUSE_Y = 964 - 4;

class WorldScene extends Scene {

    constructor(ctx, input, parent)
    {
        super(ctx, input, parent);

        const { map } = input;

        map.putThing(HOUSE_X, HOUSE_Y, HOUSE);
        map.putThing(HOUSE_X + 2, HOUSE_Y, BLOCKED);
        map.putThing(HOUSE_X + 3, HOUSE_Y, BLOCKED);
        map.putThing(HOUSE_X - 1, HOUSE_Y, BLOCKED);
        map.putThing(HOUSE_X - 2, HOUSE_Y, BLOCKED);
        map.putThing(HOUSE_X - 3, HOUSE_Y, BLOCKED);
        map.putThing(HOUSE_X - 4, HOUSE_Y, BLOCKED);
        map.putThing(HOUSE_X - 5, HOUSE_Y, BLOCKED);
        map.putThing(HOUSE_X + 1, HOUSE_Y - 1, BLOCKED);
        map.putThing(HOUSE_X + 2, HOUSE_Y - 1, BLOCKED);
        map.putThing(HOUSE_X + 3, HOUSE_Y - 1, BLOCKED);
        map.putThing(HOUSE_X - 1, HOUSE_Y - 1, BLOCKED);
        map.putThing(   HOUSE_X    , HOUSE_Y - 1, BLOCKED);
        map.putThing(HOUSE_X - 2, HOUSE_Y - 1, BLOCKED);
        map.putThing(HOUSE_X - 3, HOUSE_Y - 1, BLOCKED);
        map.putThing(HOUSE_X - 4, HOUSE_Y - 1, BLOCKED);
        map.putThing(HOUSE_X - 5, HOUSE_Y - 1, BLOCKED);


        map.putThing(-2 - 3, -5, BLOCKED);
        map.putThing(-2 - 2, -5, BLOCKED);
        map.putThing(-2 - 1, -6, BLOCKED);
        map.putThing(-2    , -6, BLOCKED);
        const sensor = { _ : "Sensor A"};
        map.registerSensor(-2 - 1, -5, sensor);
        map.registerSensor(-2    , -5, sensor);
        map.putThing(-2 + 1, -5, BLOCKED);
        map.putThing(-2 + 2, -5, BLOCKED);
        map.putThing(-2, -4, IGLOO );
        map.putThing(-2 - 2, -4, BLOCKED);
        map.putThing(-2 - 1, -4, BLOCKED);
        map.putThing(-2 + 1, -4, BLOCKED);
        map.putThing(-2 + 2, -4, BLOCKED);

        map.write(0, 0, SAND);
        map.putThing(-1, -1, 0);
        map.putThing( 1, -1, 0);
        map.putThing(-1, 1, 0);
        map.putThing( 1, 1, 0);
        map.putThing(0, 0, SMALL_TREE);
        map.putThing(1, 0, BLOCKED);

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
