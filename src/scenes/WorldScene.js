import { Scene } from "../SceneGraph";
import drawTiles from "../drawTiles";
import Services from "../workers/Services";
import { easeInCubic, easeInOutQuint, easeInQuint } from "../util/easing";
import Sensor, { SensorMode } from "../sensor";
import { BLOCKED, DIRT, EMPTY, HOUSE, IGLOO, SAND, SMALL_TREE, SOIL, SOIL_2 } from "../tilemap-config";
import Home from "./Home";

export const HOUSE_X = 1276;
export const HOUSE_Y = 960;
export const IGLOO_X = -2;
export const IGLOO_Y = -4;


const START_X = 1280;
const START_Y = 964;
const END_X = 1438;
const END_Y = 1690;

class WorldScene extends Scene {

    constructor(ctx, input, parent)
    {
        super(ctx, input, parent);
    }

    onEnter()
    {
        const { ctx } = this;
        const { worldMap } = ctx;

        ctx.map = worldMap;

        const houseSensor = new Sensor(
            SensorMode.MOTION,
            () => ctx.graph.goto(
                Home,
                {
                    door: true
                }),
            ctx
        );

        worldMap.registerSensor(HOUSE_X, HOUSE_Y, houseSensor);
        worldMap.registerSensor(HOUSE_X + 1, HOUSE_Y, houseSensor);

        worldMap.putThing(HOUSE_X, HOUSE_Y, HOUSE);
        worldMap.putThing(HOUSE_X + 2, HOUSE_Y, BLOCKED);
        worldMap.putThing(HOUSE_X + 3, HOUSE_Y, BLOCKED);
        worldMap.putThing(HOUSE_X - 1, HOUSE_Y, BLOCKED);
        worldMap.putThing(HOUSE_X - 2, HOUSE_Y, BLOCKED);
        worldMap.putThing(HOUSE_X - 3, HOUSE_Y, BLOCKED);
        worldMap.putThing(HOUSE_X - 4, HOUSE_Y, BLOCKED);
        worldMap.putThing(HOUSE_X - 5, HOUSE_Y, BLOCKED);
        worldMap.putThing(HOUSE_X + 1, HOUSE_Y - 1, BLOCKED);
        worldMap.putThing(HOUSE_X + 2, HOUSE_Y - 1, BLOCKED);
        worldMap.putThing(HOUSE_X + 3, HOUSE_Y - 1, BLOCKED);
        worldMap.putThing(HOUSE_X - 1, HOUSE_Y - 1, BLOCKED);
        worldMap.putThing(   HOUSE_X    , HOUSE_Y - 1, BLOCKED);
        worldMap.putThing(HOUSE_X - 2, HOUSE_Y - 1, BLOCKED);
        worldMap.putThing(HOUSE_X - 3, HOUSE_Y - 1, BLOCKED);
        worldMap.putThing(HOUSE_X - 4, HOUSE_Y - 1, BLOCKED);
        worldMap.putThing(HOUSE_X - 5, HOUSE_Y - 1, BLOCKED);

        worldMap.putThing(HOUSE_X - 1, HOUSE_Y + 1, EMPTY);
        worldMap.putThing(HOUSE_X        , HOUSE_Y + 1, EMPTY);
        worldMap.putThing(HOUSE_X + 1, HOUSE_Y + 1, EMPTY);
        worldMap.putThing(HOUSE_X - 1, HOUSE_Y + 2, EMPTY);
        worldMap.putThing(HOUSE_X        , HOUSE_Y + 2, EMPTY);
        worldMap.putThing(HOUSE_X + 1, HOUSE_Y + 2, EMPTY);


        worldMap.putThing(IGLOO_X - 3, IGLOO_Y - 1, BLOCKED);
        worldMap.putThing(IGLOO_X - 2, IGLOO_Y - 1, BLOCKED);
        worldMap.putThing(IGLOO_X - 1, IGLOO_Y - 2, BLOCKED);
        worldMap.putThing(IGLOO_X + 0, IGLOO_Y - 2, BLOCKED);
        worldMap.putThing(IGLOO_X + 1, IGLOO_Y - 1, BLOCKED);
        worldMap.putThing(IGLOO_X + 2, IGLOO_Y - 1, BLOCKED);
        worldMap.putThing(IGLOO_X + 0, IGLOO_Y + 0, IGLOO);
        worldMap.putThing(IGLOO_X - 2, IGLOO_Y + 0, BLOCKED);
        worldMap.putThing(IGLOO_X - 1, IGLOO_Y + 0, BLOCKED);
        worldMap.putThing(IGLOO_X + 1, IGLOO_Y + 0, BLOCKED);
        worldMap.putThing(IGLOO_X + 2, IGLOO_Y + 0, BLOCKED);


        const fieldX = HOUSE_X + 8;
        const fieldY = HOUSE_Y + 2;

        for (let y = 0; y < 3; y++)
        {

            for (let x = 0; x < 3; x++)
            {
                worldMap.write(fieldX + x, fieldY + y, SOIL_2);
            }
        }

        worldMap.write(fieldX + 1, fieldY + 1, SOIL);



        const sensor = new Sensor(
            SensorMode.MOTION,
            () => {
                ctx.dx = 0;
                ctx.dy = 0;
                ctx.controls.moveUpDown && (this.ctx.blocked = true);
                ctx.graph.goto(
                    Home,
                    {
                        door: false
                    }
                )
            },
            ctx
        );
        worldMap.registerSensor(IGLOO_X - 1, IGLOO_Y - 1, sensor);
        worldMap.registerSensor(IGLOO_X + 0, IGLOO_Y - 1, sensor);

        this.pos = -2;
        this.finePos = 1;

        // Services.planPath(
        //         ctx.map.worldId,
        //         START_X, START_Y,
        //         END_X, END_Y
        //     )
        //     .then(
        //         path => {
        //             this.path = path
        //         }
        //     )

    }


    ticker(delta)
    {

        const { path, ctx } = this;
        if(path)
        {
            let { pos, finePos, x, y, dx, dy } = this;

            if (finePos >= 1)
            {
                pos = this.pos += 2;
                if (pos === path.length - 2)
                {
                    this.path = null;
                    return;
                }

                console.log(pos);
                finePos = 0;
                this.finePos = finePos;

                const x0 = path[pos] * 16;
                const y0 = path[pos + 1] * 16;
                const x1 = path[pos + 2] * 16;
                const y1 = path[pos + 3] * 16;

                dx = x1 - x0;
                dy = y1 - y0;

                const d = Math.sqrt(dx * dx + dy * dy);

                const factor = 1/d;

                this.speed =  4 * factor;

                x = this.x = x0;
                y = this.y = y0;
                dx = this.dx = dx;
                dy = this.dy = dy;
            }

            const eased = easeInQuint(finePos);
            ctx.posX = x + dx * eased;
            ctx.posY = y + dy * eased;

            this.finePos += this.speed * delta;
        }
    }

    render()
    {
        const { ctx } = this;

        drawTiles(
            ctx,
            ctx.worldMap,
            ctx.posX,
            ctx.posY
        );
    }
}

export default WorldScene
