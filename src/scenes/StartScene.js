import { Scene } from "../SceneGraph";
import WorldMap, { fillThings, fillTiles, TAU } from "../WorldMap";
import Services from "../workers/Services";
import WorldScene from "./WorldScene";
import { drawDigit } from "../util/drawDigit";
import drawTiles from "../drawTiles";
import {
    BLOCKED,
    CASTLE_GATE,
    EMPTY,
    GRASS,
    ITEM_AXE,
    ITEM_HOE,
    ITEM_PICKAXE,
    ITEM_SHOVEL,
    ITEM_SWORD,
    ITEM_WOOD
} from "../config";
import Sensor, { SensorMode } from "../sensor";
import City from "./City";
import Meeple, { GUILD_UNIFORMS, GUILDS, SECONDARY_STAT } from "../Meeple";
import Prando from "prando";
import { renderReact } from "../index";
import { GUILD_OF_ARES, GUILD_OF_ATHENA, GUILD_OF_DEMETER } from "../skill-tree";
import Collision from "../Collision";


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

        const { centerX, centerY, size } = city;

        const px = centerX - (size >> 1);
        const py = centerY - (size >> 1);

        const width = size;
        const height = size & ~1;

        const citySensor = new Sensor(
            SensorMode.MOTION,
            (x,y) => ctx.graph.goto(
                City,
                {
                    x,
                    y,
                    city
                }
            ),
            ctx,
        );

        for (let i = 0; i < city.topWall.length; i++)
        {
            const thing = city.topWall[i];
            if (thing === CASTLE_GATE)
            {
                //console.log("North gate at index ", i);

                map.registerSensor(px + i * 5 - 1, py - 1, citySensor);
                map.registerSensor(px + i * 5    , py - 1, citySensor);
                map.registerSensor(px + i * 5 + 1, py - 1, citySensor);

                map.putThing(px + i * 5 - 3, py - 1, BLOCKED);
                map.putThing(px + i * 5 - 2, py - 1, BLOCKED);
                map.putThing(px + i * 5 - 1, py - 1, EMPTY);
                map.putThing(px + i * 5    , py - 1, EMPTY);
                map.putThing(px + i * 5 + 1, py - 1, EMPTY);
                map.putThing(px + i * 5 + 2, py - 1, BLOCKED);
                map.putThing(px + i * 5 + 3, py - 1, BLOCKED);


                break;
            }
        }

        for (let i = 0; i < city.bottomWall.length; i++)
        {
            const thing = city.bottomWall[i];
            if (thing === CASTLE_GATE)
            {
                //console.log("South gate at index ", i);

                map.registerSensor(px + i * 5 - 1, py + height - 2, citySensor);
                map.registerSensor(px + i * 5    , py + height - 2, citySensor);
                map.registerSensor(px + i * 5 + 1, py + height - 2, citySensor);
                map.putThing(px + i * 5 - 3, py + height - 2, BLOCKED);
                map.putThing(px + i * 5 - 2, py + height - 2, BLOCKED);
                map.putThing(px + i * 5 - 1, py + height - 2, EMPTY);
                map.putThing(px + i * 5    , py + height - 2, EMPTY);
                map.putThing(px + i * 5 + 1, py + height - 2, EMPTY);
                map.putThing(px + i * 5 + 2, py + height - 2, BLOCKED);
                map.putThing(px + i * 5 + 3, py + height - 2, BLOCKED);
                break;
            }
        }

    }



}


function arrangeInSquare(meeples, cx, cy)
{
    const size = Math.ceil(Math.sqrt(meeples.length));

    cx -= size * 24;
    cy -= size * 24;

    let off = 0;
    for (let y = 0; y < size ; y++)
    {
        for (let x = 0; x < size; x++)
        {
            if (off < meeples.length)
            {
                meeples[off].place(
                    ((cx + x * 48) & ~15),
                    ((cy + y * 48) & ~15)
                );
                off++;
            }
            else
            {
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

                this.ctx.worldMap = generatedMap;
                this.ctx.map = generatedMap;
                this.ctx.collision = new Collision(generatedMap);

                registerTileSensors(generatedMap, this.ctx);

                const posX = 1225;
                const posY = 955;

                const random = new Prando();

                const groupSize = 8 * 3;

                fillTiles(generatedMap, posX - 4, posY - 4, groupSize + 8, groupSize + 8, GRASS);
                fillThings(generatedMap, posX - 40, posY - 40, groupSize + 80, groupSize + 80, 0);
                this.ctx.collision.updateFromMap(generatedMap);


                const cx = (posX + (groupSize >> 1)) << 4;
                const cy = (posY + (groupSize >> 1)) << 4;

                const radius = 20 * 16;

                const targets = {
                    [GUILD_OF_ARES] : [
                        cx + Math.sin(0) * radius|0,
                        cy + Math.cos(0) * radius|0,
                    ],
                    [GUILD_OF_DEMETER] : [
                        cx + Math.sin(TAU / 3) * radius|0,
                        cy + Math.cos(TAU / 3) * radius|0,
                    ],
                    [GUILD_OF_ATHENA] : [
                        cx + Math.sin(-TAU / 3) * radius|0,
                        cy + Math.cos(-TAU / 3) * radius|0,
                    ],
                    none : [
                        cx,
                        cy
                    ],

                };

                const { mobiles } = this.ctx;

                let count = 0;
                for (let y = 0; y < 8; y++)
                {
                    for (let x = 0; x < 8; x++)
                    {
                        mobiles.push(
                            new Meeple(
                                random,
                                this.ctx,
                                ++count
                            )
                        );

                        // generatedMap.write(
                        //     posX + x * 3,
                        //     posY + y * 3,
                        //     SAND
                        // );
                    }
                }

                const council = [];

                let t = 0;
                for (let [name , stat] of GUILDS.entries())
                {
                    const meeplesInGuild = mobiles.filter(m => m.skills.has(name));

                    meeplesInGuild.sort((a,b) => {

                        const { stats : statsA } = a;
                        const { stats : statsB } = b;

                        const vA = statsA[stat] * 3 + statsA[SECONDARY_STAT.get(stat)] + (statsA.cha >> 1);
                        const vB = statsB[stat] * 3 + statsB[SECONDARY_STAT.get(stat)] + (statsB.cha >> 1);

                        return vB - vA;
                    });

                    meeplesInGuild[0].uniform = GUILD_UNIFORMS.get(name);
                    if (name === GUILD_OF_ARES)
                    {
                        meeplesInGuild[0].item = ITEM_SWORD;
                    }

                    council.push(meeplesInGuild[0]);

                    arrangeInSquare(meeplesInGuild, targets[name][0], targets[name][1])

                    console.log(name, ": ", meeplesInGuild.length, ", leader: ", meeplesInGuild[0].name);
                }

                const meeplesWithoutGuild = mobiles.filter(m => !m.skills.has(GUILD_OF_ATHENA) && !m.skills.has(GUILD_OF_DEMETER) && !m.skills.has(GUILD_OF_ARES));
                meeplesWithoutGuild.sort((a,b) => {

                    const { stats : statsA } = a;
                    const { stats : statsB } = b;

                    const vA = Math.max(statsA.str, statsA.dex, statsA.int) * 2 + (statsA.cha >> 1);
                    const vB = Math.max(statsB.str, statsB.dex, statsB.int) * 2 + (statsB.cha >> 1);
                    return vB - vA;
                });

                arrangeInSquare(meeplesWithoutGuild, targets.none[0], targets.none[1])
                t++;

                console.log("No guild: ", meeplesWithoutGuild.length, "leader: ", meeplesWithoutGuild[0].name);

                meeplesWithoutGuild[0].uniform = GUILD_UNIFORMS.get(null);
                council.push(meeplesWithoutGuild[0]);

                council.sort((a,b) => {
                    return b.stats.cha - a.stats.cha;
                });

                console.log("Council: " + council.map(m => m.name));


                mobiles[0].item = ITEM_AXE;
                mobiles[1].item = ITEM_PICKAXE;
                mobiles[2].item = ITEM_SHOVEL;
                mobiles[3].item = ITEM_HOE;

                generatedMap.putItems(posX - 3, posY - 3, ITEM_WOOD, 200);
                generatedMap.putItems(posX - 3, posY - 1, ITEM_PICKAXE, 10);

                //console.log("NAMES",mobiles.map(mob => mob.name).join(", "));




                //generatedMap.tiles[0] = DARK;


                generatedMap.update();

                renderReact();

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
            []
        );

    }

}

export default StartScene;
