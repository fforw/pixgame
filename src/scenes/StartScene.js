import { Scene } from "../SceneGraph";
import WorldMap from "../WorldMap";
import Services from "../workers/Services";
import WorldScene from "./WorldScene";
import { drawDigit } from "../util/drawDigit";
import drawTiles from "../drawTiles";
import { CASTLE_GATE, DOT, EMPTY } from "../tilemap-config";
import Sensor, { SensorMode, SensorPlaceholder } from "../sensor";


function enterCastle(ctx, x, y)
{
    const { px, py, width, height } = ctx;
}


function registerTileSensors(map, ctx)
{
    const { cities } = map;

    for (let i = 0; i < cities.length; i++)
    {
        const city = cities[i];

        const { centerX, centerY, size, topWall, bottomWall } = city;

        const px = centerX - (size >> 1);
        const py = centerY - (size >> 1);

        const width = size;
        const height = size & ~1;

        const citySensor = new Sensor(
            SensorMode.MOTION,
            (x,y) => console.log("CITY", x, y),
            ctx,
        );

        for (let i = 0; i < topWall.length; i++)
        {
            const thing = topWall[i];
            if (thing === CASTLE_GATE)
            {
                console.log("North gate at index ", i);
                map.registerSensor(px + i * 5 - 1, py + height - 2, citySensor);
                map.registerSensor(px + i * 5    , py + height - 2, citySensor);
                map.registerSensor(px + i * 5 + 1, py + height - 2, citySensor);
                map.putThing(px + i * 5 - 1, py + height - 2, DOT);
                map.putThing(px + i * 5    , py + height - 2, DOT);
                map.putThing(px + i * 5 + 1, py + height - 2, DOT);
                break;
            }
        }

        for (let i = 0; i < bottomWall.length; i++)
        {
            const thing = bottomWall[i];
            if (thing === CASTLE_GATE)
            {
                console.log("South gate at index ", i);

                map.registerSensor(px + i * 5 - 1, py - 1, citySensor);
                map.registerSensor(px + i * 5    , py - 1, citySensor);
                map.registerSensor(px + i * 5 + 1, py - 1, citySensor);

                map.putThing(px + i * 5 - 1, py - 1, DOT);
                map.putThing(px + i * 5    , py - 1, DOT);
                map.putThing(px + i * 5 + 1, py - 1, DOT);


                break;
            }
        }

    }



}


class StartScene extends Scene
{
    constructor(ctx, input, parent)
    {
        super(ctx, input, parent);
    }

    onEnter()
    {
        this.map = new WorldMap(128, "start");

        Services.generateMap("floppy-disk", 2048, percent => {

            const text = String(Math.round(percent * 100));

            const off = Math.round(((text.length + 1) * 4)/2);

            for (let i = 0; i < text.length; i++)
            {
                const digit = text.charCodeAt(i) - 48;

                drawDigit(this.map, -off + i * 4,-3, digit)
            }

            drawDigit(this.map, -off + text.length * 4,-3, 10)

        }).then(
            generatedMap => {

                registerTileSensors(generatedMap, this.ctx);

                this.ctx.worldMap = generatedMap;
                this.ctx.graph.goto(WorldScene);
            }
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
