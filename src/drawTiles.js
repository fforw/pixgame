import { MARCHING_SQUARE_TEXTURES, TEXTURES, THING_SHADOW_TEXTURES, THING_TEXTURES } from "./tilemap-config";


let layerMask;

export function getCurrentLayerMask()
{
    return layerMask;
}


function drawMarchingSquaresTiles(ctx, map, vars)
{
    const { tileLayer, atlas } = ctx;

    const { widthInTiles, heightInTiles, screenX, screenY, mapX, mapY} = vars;

    // current known marching square tiles mask
    layerMask = 1;

    // currently drawn tile mask, initialize with 1 to always draw tile 0.
    let tileMask = 1;
    for (let i=0; i < MARCHING_SQUARE_TEXTURES; i++)
    {

        if (layerMask & tileMask)
        {

            // DRAW TILES
            for (let y = 0; y < heightInTiles; y++)
            {
                for (let x = 0; x < widthInTiles; x++)
                {
                    const t8 = map.read(mapX + x, mapY + y);
                    const t4 = map.read(mapX + x + 1, mapY + y);
                    const t1 = map.read(mapX + x, mapY + y + 1);
                    const t2 = map.read(mapX + x + 1, mapY + y + 1);
                    let cellCase =
                        (t8 === i ? 8 : 0) +
                        (t4 === i ? 4 : 0) +
                        (t1 === i ? 1 : 0) +
                        (t2 === i ? 2 : 0);

                    // if this is the first loop
                    if (i === 0)
                    {
                        // collect layerMask bits
                        layerMask |= 1 << t8;
                    }

                    if (cellCase !== 0)
                    {
                        // fix multi-color gaps
                        if (cellCase === 1 && t2 !== t8)
                        {
                            cellCase = 16;
                        }
                        else if (cellCase === 2 && t4 !== t1)
                        {
                            cellCase = 17;
                        }
                        else if (cellCase === 4 && t8 !== t2)
                        {
                            cellCase = 18;
                        }
                        else if (cellCase === 8 && t1 !== t4)
                        {
                            cellCase = 19;
                        }

                        let texture = TEXTURES[i];

                        texture += "-" + cellCase;

                        const entry = atlas.frames[texture];
                        if (!entry)
                        {
                            throw new Error("No texture '" + texture + "'")
                        }
                        const {pivot, frame} = entry;

                        tileLayer.addFrame(
                            texture,
                            screenX + (x << 4) - ((pivot.x * frame.w) | 0),
                            screenY + (y << 4) - ((pivot.y * frame.h) | 0)
                        );
                    }
                }
            }
        }
        tileMask <<= 1;
    }

}
function drawNormalTiles(ctx, map, vars)
{
    const {tileLayer, atlas} = ctx;

    const {widthInTiles, heightInTiles, screenX, screenY, mapX, mapY} = vars;

    for (let y = 0; y < heightInTiles; y++)
    {
        for (let x = 0; x < widthInTiles; x++)
        {
            const tile = map.read(mapX + x, mapY + y);

            if (tile >= MARCHING_SQUARE_TEXTURES)
            {
                let texture = TEXTURES[tile];

                const entry = atlas.frames[texture];
                if (!entry)
                {
                    throw new Error("No texture '" + texture + "'")
                }
                const {pivot, frame} = entry;

                tileLayer.addFrame(
                    texture,
                    screenX + (x << 4) - ((pivot.x * frame.w) | 0) - 9,
                    screenY + (y << 4) - ((pivot.y * frame.h) | 0) - 9
                );
            }
        }
    }
}



function drawThings(ctx, map, vars, drawPlayer)
{
    const { tileLayer, atlas, posY } = ctx;

    const { widthInTiles, heightInTiles, screenX, screenY, mapX, mapY, halfWidth, halfHeight } = vars;

    const { sizeMask, fineMask } = map;

    const yPosInTiles = (posY >> 4)|0;

    for (let y = 0; y < heightInTiles; y++)
    {
        for (let x = 0; x < widthInTiles; x++)
        {
            const thing = map.getThing((mapX + x) & sizeMask, (mapY + y) & sizeMask);
            const shadow = THING_SHADOW_TEXTURES[thing];
            if (shadow)
            {
                const {pivot, frame} = atlas.frames[shadow];

                tileLayer.addFrame(
                    shadow,
                    (screenX + (x << 4) - (pivot.x * frame.w) - 9 | 0),
                    (screenY + (y << 4) - (pivot.y * frame.h) - 10 | 0)
                );
            }

        }
    }

    for (let y = 0; y < heightInTiles; y++)
    {
        if (drawPlayer && ((mapY + y) & sizeMask) === ((yPosInTiles + 2) & sizeMask) && (posY & 15) < 15)
        {
            tileLayer.addFrame(
                "bunny.png",
                halfWidth,
                halfHeight - 20
            );
        }

        for (let x = 0; x < widthInTiles; x++)
        {
            const thing = map.getThing((mapX + x) & sizeMask, (mapY + y) & sizeMask);

            const texture = THING_TEXTURES[thing];
            if (texture)
            {
                const {pivot, frame} = atlas.frames[texture];

                tileLayer.addFrame(
                    texture,
                    (screenX + (x << 4) - (pivot.x * frame.w) - 9 | 0),
                    (screenY + (y << 4) - (pivot.y * frame.h) - 10 | 0)
                );
            }
        }

        if (drawPlayer &&((mapY + y) & sizeMask) === ((yPosInTiles + 2) & sizeMask) && (posY & 15) >= 15)
        {
            tileLayer.addFrame(
                "bunny.png",
                halfWidth,
                halfHeight - 20
            );
        }
    }

    if (drawPlayer)
    {
        tileLayer.addFrame(
            "bunny-outline.png",
            halfWidth,
            halfHeight - 20
        );
    }

}


export default function drawTiles(ctx, map, posX, posY, drawPlayer = true)
{
    const { tileLayer, width, height } = ctx;

    const halfWidth = width / 2;
    const halfHeight = height / 2;

    const widthInTiles = Math.ceil(width / 16) + 7;
    const heightInTiles = Math.ceil(height / 16) + 11;

    tileLayer.clear();

    const { sizeMask, fineMask } = map;

    const xOffset = (posX - halfWidth ) & fineMask;
    const yOffset = (posY - halfHeight - 4) & fineMask;
    const screenX = -32 + -(xOffset & 15);
    const screenY = -32 + -(yOffset & 15);

    const mapX = ( -2 + (xOffset >> 4)) & sizeMask;
    const mapY = ( -2 + (yOffset >> 4)) & sizeMask;

    //console.log("Map pos", mapX, mapY, sizeMask);
    //console.log({screenX, screenY, txSteps, tySteps, mapX, mapY})


    const vars = {
        widthInTiles,
        heightInTiles,
        screenX, screenY,
        mapX, mapY,
        halfWidth, halfHeight
    };
    
    drawMarchingSquaresTiles(ctx, map, vars);
    drawNormalTiles(ctx, map, vars);
    drawThings(ctx, map, vars, drawPlayer);

}
