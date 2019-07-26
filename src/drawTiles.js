
let layerMask;

export const TEXTURES = [
    "ms-dark.png",
    "ms-water.png",
    "ms-sand.png",
    "ms-grass.png",
    "ms-dirt.png",
    "ms-rock.png",
    "ms-woods.png",
    "ms-woods2.png",
    "ms-river.png",
    "ms-ice.png",
    "ms-ice2.png"
];
export const THING_TEXTURES = [
    null,
    null, //"marker3.png",
    "plant.png",
    "plant2.png",
    "plant3.png",
    "dot.png",
    null,
    null,
    null, //"marker.png",
    null, //"marker2.png",
    null,
    null,
    null,
    "large-tree.png",
    "large-tree2.png",
    "small-tree.png",
    "small-tree2.png",
    "small-tree3.png",
    "boulder.png",
    "boulder2.png",
    "boulder3.png",
    "house.png",
    "igloo.png",
];

export function getCurrentLayerMask()
{
    return layerMask;
}

export default function drawTiles(ctx, map, posX, posY, drawPlayer = true)
{
    const { tileLayer, atlas, width, height } = ctx;

    const halfWidth = width / 2;
    const halfHeight = height / 2;

    const widthInTiles = Math.ceil(width / 16) + 7;
    const heightInTiles = Math.ceil(height / 16) + 11;

    tileLayer.clear();

    const { sizeMask, fineMask, size } = map;

    let xOffset = (posX - halfWidth ) & fineMask;
    let yOffset = (posY - halfHeight - 4) & fineMask;
    let screenX = -32 + -(xOffset & 15);
    let screenY = -32 + -(yOffset & 15);

    const mapX = ( -2 + (xOffset >> 4)) & sizeMask;
    const mapY = ( -2 + (yOffset >> 4)) & sizeMask;

    //console.log("Map pos", mapX, mapY, sizeMask);
    //console.log({screenX, screenY, txSteps, tySteps, mapX, mapY})

    const yPosInTiles = (posY >> 4)|0;

    const { length : numTextures } = TEXTURES;

    layerMask = 0;

    let tileMask = 1;

    for (let i=0; i < numTextures; i++)
    {

        if (i === 0 || (layerMask & tileMask))
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

                    if (i === 0)
                    {
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

                        const tex = atlas.frames[texture];
                        if (tex === null)
                        {
                            throw new Error("No texture '" + texture + "'")
                        }
                        const {pivot, frame} = tex;

                        tileLayer.addFrame(
                            texture,
                            screenX + (x << 4) - ((pivot.x * frame.w) | 0),
                            screenY + (y << 4) - ((pivot.y * frame.h) | 0)
                        );
                    }
                }
            }
        }
        tileMask *= 2;
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
                    (screenX + (x << 4) - (pivot.x * frame.w) - 9) | 0,
                    (screenY + (y << 4) - (pivot.y * frame.h) - 10) | 0
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
