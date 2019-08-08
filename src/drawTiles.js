import {
    ITEM_TEXTURES,
    MARCHING_SQUARE_TEXTURES,
    TEXTURES,
    THING_SHADOW_TEXTURES,
    THING_TEXTURES,
    WOOD
} from "./config";
import logger from "./util/logger";


let layerMask;

export function getCurrentLayerMask()
{
    return layerMask;
}

// const mobileLogger = logger("MOBILES");
// const inViewLogger = logger("IN-VIEW");

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
                            screenY + (y << 4) - ((pivot.y * frame.h) | 0) - (i === WOOD ? 2: 0)
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

const DIGITS = [
    "digit-0.png",
    "digit-1.png",
    "digit-2.png",
    "digit-3.png",
    "digit-4.png",
    "digit-5.png",
    "digit-6.png",
    "digit-7.png",
    "digit-8.png",
    "digit-9.png"
];

const DIGIT_WIDTH = [
    6,
    3,
    5,
    5,
    5,
    6,
    6,
    5,
    6,
    6
];


function drawNumber(tileLayer, x, y, n)
{
    const str = String(n);
    const length =  str.length;

    let width = 0;
    for (let i=0; i < length; i++)
    {
        const idx = str.charCodeAt(i) - 48;
        width += DIGIT_WIDTH[idx] - 1;
    }

    let off = -(width >> 1);
    for (let i=0; i < length; i++)
    {
        const idx = str.charCodeAt(i) - 48;
        tileLayer.addFrame(
            DIGITS[idx],
            x + off,
            y
        );

        off += DIGIT_WIDTH[idx] - 1;
    }
}


function drawItems(ctx, map, vars)
{
    const { tileLayer, atlas } = ctx;

    const { widthInTiles, heightInTiles, screenX, screenY, mapX, mapY } = vars;

    const { sizeMask } = map;

    for (let y = 0; y < heightInTiles; y++)
    {
        for (let x = 0; x < widthInTiles; x++)
        {
            const item = map.getItems((mapX + x) & sizeMask, (mapY + y) & sizeMask);
            const amount = item & 255;
            const texture = ITEM_TEXTURES[item >> 8];
            if (texture && amount > 0)
            {
                const {pivot, frame} = atlas.frames[texture];

                tileLayer.addFrame(
                    texture,
                    (screenX + (x << 4) - (pivot.x * frame.w) - 9 | 0),
                    (screenY + (y << 4) - (pivot.y * frame.h) - 10 | 0)
                );
            }
        }
    }

    for (let y = 0; y < heightInTiles; y++)
    {
        for (let x = 0; x < widthInTiles; x++)
        {
            const item = map.getItems((mapX + x) & sizeMask, (mapY + y) & sizeMask);
            const amount = item & 255;
            if (item > 256 && amount > 1)
            {
                drawNumber(
                    tileLayer,
                    screenX + (x << 4) - 10,
                    screenY + (y << 4) - 7,
                    amount
                );
            }
        }
    }

}
function drawThings(ctx, map, vars, posX, posY, mobiles, selectedMob)
{
    const { tileLayer, atlas } = ctx;

    const { widthInTiles, heightInTiles, screenX, screenY, mapX, mapY, xOffset, yOffset, halfWidth, halfHeight } = vars;

    const { sizeMask, fineMask } = map;

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

    let count = 0;

    for (let y = 0; y <= heightInTiles; y++)
    {
        if (mobiles)
        {
            for (let i = 0; i < mobiles.length; i++)
            {
                const { y : my } = mobiles[i];

                if (((mapY + y) & sizeMask) === (((my >> 4) + 1) & sizeMask) && (my & 15) < 14)
                {
                    mobiles[i].draw(
                        (mapX << 4) + (xOffset & 15) + 40,
                        (mapY << 4) + (yOffset & 15) + 38,
                        mobiles[i] === selectedMob
                    );

                    count++;
                }

            }
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

        if (mobiles)
        {
            for (let i = 0; i < mobiles.length; i++)
            {
                const { y : my } = mobiles[i];

                if (((mapY + y) & sizeMask) === (((my >> 4) + 1) & sizeMask) && (my & 15) >= 14)
                {
                    mobiles[i].draw(
                        (mapX << 4) + (xOffset & 15) + 40,
                        (mapY << 4) + (yOffset & 15) + 38,
                        mobiles[i] === selectedMob
                    );
                    count++;
                }
            }
        }
    }

    //mobileLogger(count);
}


export function isInView(x, y, sx, sy, w, h, sizeMask)
{
    x &= sizeMask;
    y &= sizeMask;

    if (sx + w > sizeMask)
    {
        return isInView(
                x, y,
                sx, sy,
                sizeMask - sx, h,
                sizeMask
               ) || isInView(
                   x, y,
                   0, sy,
                   (sx + w) & sizeMask, h,
                   sizeMask
               );
    }
    else if (sy + h > sizeMask)
    {
        return isInView(
                x, y,
                sx, sy,
                w,sizeMask - sy,
                sizeMask
            ) || isInView(
               x, y,
               sx, 0,
               w, (sy + h) & sizeMask,
               sizeMask
           );
        }

    return x >= sx && x < sx + w && y >= sy && y < sy + h;
}


function sortByY(a,b)
{
    return a.y - b.y;
}


export default function drawTiles(ctx, map, posX, posY, mobiles)
{
    const { tileLayer, width, height, maxFrameWidth, maxFrameHeight } = ctx;

    const halfWidth = width / 2;
    const halfHeight = height / 2;

    const widthInTiles = Math.ceil(width / 16) + maxFrameWidth;
    const heightInTiles = Math.ceil(height / 16) + maxFrameHeight;

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
        xOffset,
        yOffset,
        screenX, screenY,
        mapX, mapY,
        halfWidth, halfHeight
    };

    const mobilesInView = mobiles && mobiles.filter(
        mob => isInView(
            (mob.x) >> 4,
            (mob.y) >> 4,
            mapX, mapY,
            widthInTiles, heightInTiles,
            sizeMask
        )
    );

    const selectedMob = mobiles[ctx.selectedMob];

    mobilesInView.sort(sortByY);

    //console.log("mobilesInView", mobilesInView && mobilesInView.length, mobiles.length);
    drawMarchingSquaresTiles(ctx, map, vars);
    drawNormalTiles(ctx, map, vars);
    drawItems(ctx, map, vars);
    drawThings(ctx, map, vars, posX, posY, mobilesInView, selectedMob);

    //inViewLogger(mobilesInView.length)

}


