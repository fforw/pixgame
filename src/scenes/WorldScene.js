import { Scene } from "../SceneGraph";
import drawTiles from "../drawTiles";
import { easeInQuint } from "../util/easing";
import Sensor, { SensorMode } from "../sensor";
import { BLOCKED, EMPTY, HOUSE, IGLOO, SOIL, SOIL_2 } from "../config";
import Home from "./Home";

export const tmpVacated = {
    offsets: new Array(100),
    count: 0
};


export const HOUSE_X = 1276;
export const HOUSE_Y = 955;
export const IGLOO_X = -2;
export const IGLOO_Y = -4;

export const START_X = 1280;
export const START_Y = 959;
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


        const fieldX = HOUSE_X - 5;
        const fieldY = HOUSE_Y + 6;

        for (let y = 0; y < 5; y++)
        {

            for (let x = 0; x < 3; x++)
            {
                worldMap.write(fieldX + x, fieldY + y, SOIL_2);
            }
        }

        worldMap.write(fieldX + 1, fieldY + 1, SOIL);
        worldMap.write(fieldX + 1, fieldY + 2, SOIL);
        worldMap.write(fieldX + 1, fieldY + 3, SOIL);



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
        const { mobiles, collision } = ctx;
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

        const numberOfMobiles = mobiles.length;

        if (tmpVacated.offsets.length < numberOfMobiles)
        {
            tmpVacated.offsets = new Array(numberOfMobiles * 1.5);
        }

        tmpVacated.count = 0;
        for (let i = 0; i < numberOfMobiles; i++)
        {
            const mobile = mobiles[i];

            if (typeof mobile.ticker === "function")
            {
                mobile.ticker(delta);
            }
        }

        // set back vacated things after all mobs have moved.
        for (let i = 0; i < tmpVacated.count; i += 2)
        {
            const x = tmpVacated.offsets[i];
            const y = tmpVacated.offsets[i + 1];
            collision.clear(x, y)
        }
    }

    render()
    {
        const { ctx } = this;

        drawTiles(
            ctx,
            ctx.map,
            ctx.posX,
            ctx.posY,
            ctx.mobiles
        );
    }
}


export default WorldScene
