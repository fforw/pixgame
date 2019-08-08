import { Scene } from "../SceneGraph";
import drawTiles from "../drawTiles";
import { BLOCKED, BOULDER_3, FRIDGE, SAND, TILE_FLOOR, WALL, WALL_END, WALL_FRONT, WALL_TOP } from "../config";
import WorldMap from "../WorldMap";
import Sensor, { SensorMode } from "../sensor";
import WorldScene, { HOUSE_X, HOUSE_Y, IGLOO_X, IGLOO_Y } from "./WorldScene";

class Home extends Scene {

    constructor(ctx, input, parent)
    {
        super(ctx, input, parent);
    }

    onEnter()
    {
        const { ctx, input } = this;

        this.initialX = ctx.posX;
        this.initialY = ctx.posY;
        this.initialMap = ctx.map;

        const map = new WorldMap(128, "home-sweet-home");
        ctx.map = map;
        //ctx.map.tiles.fill(SAND)

        const w = 21;
        const h = 13;

        const topX = 64 - w / 2;
        const topY = 64 - h / 2;


        for(let y = 0; y < h; y++)
        {
            for (let x = 0; x < w; x++)
            {
                map.write(
                    topX + x ,
                    topY + y,
                    TILE_FLOOR
                )
            }
        }

        // draw wall top of room
        for (let x = 1; x < w; x++)
        {
            const bx = topX + x;
            map.putThing(
                bx,
                topY - 1,
                WALL_FRONT
            );
        }

        const lastX = w - 1;
        const lastY = h;
        for( let y = -1; y < lastY; y++)
        {
                map.putThing(
                    topX,
                    topY + y,
                    WALL_TOP
                );
                map.putThing(
                    topX + w,
                    topY + y,
                    WALL_TOP
                )
        }

        map.putThing(
            topX,
            topY + lastY,
            WALL
        );

        map.putThing(
            topX + w,
            topY + lastY,
            WALL
        );

        const fridgeX = topX + w - 2;
        const fridgeY = topY;
        map.putThing(
            fridgeX - 1,
            fridgeY,
            FRIDGE
        );


        map.putThing(
            fridgeX + 1,
            fridgeY,
            BLOCKED
        );

        const doorX = topX + w - 5;
        const doorY = topY + h;

        // draw invisible blocking wall, except for where the door is
        for (let x = 1; x < w - 1; x++)
        {
            const bx = topX + x;
            if (bx === doorX || bx === doorX + 1)
            {
                map.write(
                    bx,
                    doorY,
                    TILE_FLOOR
                );
            }
            else
            {
                map.putThing(
                    bx,
                    doorY,
                    BLOCKED
                );
            }
        }

        const doorSensor = new Sensor(SensorMode.MOTION, () => {
            this.ctx.graph.goto(WorldScene);

            this.ctx.posX = (HOUSE_X - 1) * 16;
            this.ctx.posY = HOUSE_Y * 16 + 4;
        }, ctx);

        map.registerSensor(   doorX     , doorY + 2, doorSensor);
        map.registerSensor(doorX + 1, doorY + 2, doorSensor);

        const fridgeSensor = new Sensor(
            SensorMode.MOTION,
            () => {

                ctx.posX = (IGLOO_X - 1) * 16 - 5;
                ctx.posY = (IGLOO_Y) * 16 + 4;
                ctx.dx = 0;
                ctx.dy = 0;
                ctx.controls.moveUpDown && (this.ctx.blocked = true);
                ctx.graph.goto(WorldScene);
            },
            ctx
        );

        map.registerSensor(fridgeX, fridgeY, fridgeSensor);

        if (input.door)
        {
            ctx.posX = (doorX-1) * 16 - 5;
            ctx.posY = (doorY-1) * 16;
        }
        else
        {
            ctx.posX = (fridgeX - 2) * 16;
            ctx.posY = (fridgeY) * 16 - 4;
        }

        console.log("Home initialized", ctx);
    }

    onExit()
    {
        const { ctx } = this;
        ctx.posX = this.initialX;
        ctx.posY = this.initialY + 16;
        ctx.map = this.initialMap;
    }


    // ticker(delta)
    // {
    //
    // }

    render()
    {
        drawTiles(
            this.ctx,
            this.ctx.map,
            this.ctx.posX,
            this.ctx.posY,
            this.ctx.mobiles
        );
    }
}

export default Home
