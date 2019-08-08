import { Scene } from "../SceneGraph";
import drawTiles from "../drawTiles";
import { CASTLE_GATE, CASTLE_WALL, thingNames } from "../config";
import WorldMap from "../WorldMap";
import drawCityWalls from "../util/drawCityWalls";


function scaleUp(wall, size)
{
    //console.log("scaleUp in ", wall.map( th => thingNames[th]));

    const origLast = wall.length - 1;
    const last = size - 1;

    const newWall = new Array(size);
    newWall[0] = wall[0];
    newWall[last] = wall[origLast];

    let haveGate = false;

    let step = (wall.length - 2) / (size-2);

    let pos = 1;
    for (let i=1; i < last; i++)
    {
        const thing = wall[pos|0];
        pos += step;

        const isGate = thing === CASTLE_GATE;
        newWall[i] = isGate && haveGate ? CASTLE_WALL : thing;
        if (isGate)
        {
            haveGate = true;
        }
    }

    //console.log("scaleUp", newWall.map( th => thingNames[th]));

    return newWall;
}


function scaleTiles(map, citySize, srcMap, cx, cy, origSize)
{
    const scale = origSize / citySize;

    const { tiles : srcTiles, sizeBits } = srcMap;

    const { tiles,size } = map;

    const halfSize = size >> 1;

    let offset = 0;
    for (let y = 0 ; y < size; y++)
    {
        for (let x = 0 ; x < size; x++)
        {
            const srcOff = ((cy + (y - halfSize) * scale) << sizeBits) + ((cx + (x - halfSize) * scale)|0);

            tiles[offset++] = srcTiles[srcOff];
        }
    }
}


class City extends Scene {

    constructor(ctx, input, parent)
    {
        super(ctx, input, parent);
    }

    onEnter()
    {
        const { ctx, input } = this;

        const { x, y, city } = input;

        const { centerX: origCenterX, centerY: origCenterY, size: origSize, topWall: origTopWall, bottomWall: origBottomWall } = city;


        const width = origSize;
        const height = origSize & ~1;


        this.initialMap = ctx.map;
        this.initialX = x;
        this.initialY = y;


        const map = new WorldMap(256, "city:" + origCenterX + "/" + origCenterY + "/" + origSize);
        ctx.map = map;

        const size = 80;



        const topWall = scaleUp(origTopWall, size/5 + 1);
        const bottomWall = scaleUp(origBottomWall, size/5 + 1);

        const px = (map.size >> 1) - (size >> 1);
        const py = (map.size >> 1) - (size >> 1);


        scaleTiles(map, size, this.initialMap, origCenterX, origCenterY, origSize);

        drawCityWalls(map, px, py, topWall, bottomWall, size);


        if (y < origCenterY)
        {
            const index = topWall.indexOf(CASTLE_GATE);
            if (index <= 0)
            {
                throw new Error("No north gate");
            }

            ctx.posX = ((px + index * 5 - 2) << 4) + (x & 15);
            ctx.posY = ((py + 1) << 4) + (y & 15);
        }
        else
        {
            const index = bottomWall.indexOf(CASTLE_GATE);
            if (index <= 0)
            {
                throw new Error("No south gate");
            }

            ctx.posX = ((px + index * 5 - 2) << 4) + (x & 15);
            ctx.posY = ((py + size - 4) << 4) + (y & 15);
        }

        //ctx.map.tiles.fill(SAND)

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

export default City
