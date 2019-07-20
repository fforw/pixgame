import * as PIXI from "pixi.js"
import "./pixi-tilemap"
// noinspection ES6UnusedImports
import STYLES from "./style.css"
import WorldMap, { MARKER, BLOCKED, HOUSE } from "./WorldMap";


const textures = [
    "water.png",
    "water2.png",
    "water3.png",
    "sand.png",
    "sand2.png",
    "sand3.png",
    "grass.png",
    "grass2.png",
    "grass3.png",
    "dirt.png",
    "dirt2.png",
    "dirt3.png",
    "rock.png",
    "rock2.png",
    "rock3.png",
    "woods.png",
    "woods2.png",
    "woods.png",
    "woods2.png",
    "river.png",
    "river2.png",
    "river3.png",
    "marker.png",
    "marker2.png",
    "marker3.png",
    "dirt.png"
];
const thingTextures = [
    null,
    null,
    null,
    null,
    null,
    null,
    "large-tree.png",
    "large-tree2.png",
    "small-tree.png",
    "small-tree2.png",
    "small-tree3.png",
    "plant.png",
    "plant2.png",
    "plant3.png",
    "boulder.png",
    "boulder2.png",
    "boulder3.png",
    "house.png",
    "dot.png"
];


function determineScale(width)
{
    let scale = 1;

    let curr = width;
    while (curr > 1024)
    {
        curr /= 2;
        scale *= 2;
    }

    console.log("Set scale to", scale);

    return scale;
}


let loading;

window.onload = () => {

    loading = document.querySelector("div.loading");

    PIXI.Loader.shared
        .add("atlas/atlas-0.json")
        .load(setup);
};

// PIXI.Loader.shared.onProgress.add(function (ev) {
//     console.log(ev.progress);
// });

let groundTiles;

let map;

const START_X = 1025 * 16;
const START_Y = 1197 * 16;

let posX = START_X;
let posY = START_Y;
let dx = 0;
let dy = 0;
let keyX = 0;
let keyY = 0;

const ACCELERATION = 0.5;
const SPEED_LIMIT = 12;

function setup(loader, resources)
{
    const atlasJSON = resources["atlas/atlas-0.json"].data;

    //console.log("setup", resources);

    map = WorldMap.generate(2048, "floppy-disk");

    map.tiles[0] = MARKER;

    map.things[1193 * 2048 + 1023] = HOUSE;

    loading.parentNode.removeChild(loading);

    //console.log({loader,resources});

    const scale = determineScale(window.innerWidth);

    const width = (window.innerWidth / scale)|0;
    const height = (window.innerHeight / scale)|0;

    console.log({width, height})

    const halfWidth = width/2;
    const halfHeight = height/2;

    const widthInTiles = Math.ceil(width / 16) + 5;
    const heightInTiles = Math.ceil(height / 16) + 9;

    const app = new PIXI.Application({
        width: width,
        height: height,
        backgroundColor: 0x111111,
        resolution: (window.devicePixelRatio || 1) * scale,
    });
    document.body.appendChild(app.view);


    function drawTiles(map)
    {
        groundTiles.clear();

        const { sizeMask, fineMask } = map;

        let xOffset = (posX - halfWidth) & fineMask;
        let yOffset = (posY - halfHeight)& fineMask;

        let screenX = -32 + -(xOffset & 15);
        let screenY = -32 + -(yOffset & 15);

        const mapX = ( -2 + (xOffset >> 4)) & sizeMask;
        const mapY = ( -2 + (yOffset >> 4)) & sizeMask;

        //console.log("Map pos", mapX, mapY, sizeMask);
        //console.log({screenX, screenY, txSteps, tySteps, mapX, mapY})

        const yPosInTiles = (posY >> 4)|0;

        // DRAW TILES
        for (let y = 0 ; y < heightInTiles; y++)
        {
            for (let x = 0; x < widthInTiles; x++)
            {
                const tile = map.read((mapX + x) & sizeMask, (mapY + y) & sizeMask);
                const texture = textures[tile];
                const { pivot, frame } = atlasJSON.frames[texture];

                groundTiles.addFrame(
                    texture,
                    screenX + (x << 4) - ((pivot.x * frame.w)|0),
                    screenY + (y << 4) - ((pivot.y * frame.h)|0)
                );

            }
        }

        for (let y = 0 ; y < heightInTiles; y++)
        {
            if (((mapY + y) & sizeMask) === ((yPosInTiles + 1) & sizeMask) && (posY & 15) < 8)
            {
                groundTiles.addFrame(
                    "bunny.png",
                    halfWidth,
                    halfHeight - 20
                );
            }

            for (let x = 0; x < widthInTiles; x++)
            {
                const thing = map.getThing((mapX + x) & sizeMask, (mapY + y) & sizeMask);

                //if (thing > BLOCKED)
                {
                    const texture = thingTextures[thing];
                    if (texture)
                    {
                        const { pivot, frame } = atlasJSON.frames[texture];
                        groundTiles.addFrame(
                            texture,
                            screenX + (x << 4) - (pivot.x * frame.w)|0,
                            screenY + (y << 4) - (pivot.y * frame.h)|0
                        );
                    }
                    else
                    {
//                        throw new Error("No texture for " + thing)
                    }
                    //console.log({texture, x: screenX + x * 16, y:screenY + y * 16})

                }
            }


            if (((mapY + y) & sizeMask) === ((yPosInTiles + 1) & sizeMask) && (posY & 15) >= 8)
            {
                groundTiles.addFrame(
                    "bunny.png",
                    halfWidth,
                    halfHeight - 20
                );
            }
        }

        groundTiles.addFrame(
            "bunny-outline.png",
            halfWidth,
            halfHeight - 20
        );
    }

    //PIXI.tilemap.Constant.use32bitIndex = true;
    groundTiles = new PIXI.tilemap.CompositeRectTileLayer(0, PIXI.utils.TextureCache["atlas/atlas-0.json_image"]);
    drawTiles(map);

    app.stage.addChild(groundTiles);



    app.ticker.add((delta) => {
        // rotate the container!
        // use delta to create frame-independent transform
        //container.rotation -= 0.01 * delta;

        if (keyX)
        {
            dx += keyX * ACCELERATION;
            if (Math.abs(dx) > SPEED_LIMIT)
            {
                dx = Math.sign(dx) * SPEED_LIMIT;
            }
        }
        else
        {
            dx *= 0.5;
        }
        if (keyY)
        {
            dy += keyY * ACCELERATION;
            if (Math.abs(dy) > SPEED_LIMIT)
            {
                dy = Math.sign(dy) * SPEED_LIMIT;
            }
        }
        else
        {
            dy *= 0.5;
        }

        posX = (posX + dx * delta) & map.fineMask;
        posY = (posY + dy * delta) & map.fineMask;
        
        drawTiles(map);

        //console.log(posX);
    });


    window.addEventListener("keydown", ev => {
        const keyCode = ev.keyCode;

        //console.log("keyCode = ", keyCode);

        switch(keyCode)
        {
            case 36:
                posX = START_X;
                posY = START_Y;
                break;
            case 35:
                posX = 0;
                posY = 0;
                break;
            case 38:
            case 87:
                keyY = -1;
                break;
            case 37:
            case 65:
                keyX = -1;
                break;
            case 40:
            case 83:
                keyY = 1;
                break;
            case 39:
            case 68:
                keyX = 1;
                break;
        }
    }, true);
    window.addEventListener("keyup", ev => {
        const keyCode = ev.keyCode;

        //console.log("keyCode = ", keyCode);

        switch(keyCode)
        {
            case 38:
            case 87:
            case 40:
            case 83:
                keyY = 0;
                break;
            case 37:
            case 65:
            case 39:
            case 68:
                keyX = 0;
                break;
        }
    }, true);
}
