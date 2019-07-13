// noinspection ES6UnusedImports
import STYLES from "./style.css"
// noinspection ES6UnusedImports

import * as PIXI from "pixi.js"
import "./pixi-tilemap"

import SimplexNoise from "simplex-noise"

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

const noise = new SimplexNoise();

let loading;

const NOISE_SCALE = 0.03;
const NOISE_SCALE2 = 0.2;

const WATER_LINE = 0;
const SAND_LINE = WATER_LINE + (1 - WATER_LINE) * 0.2;

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

const GRASS = [
    "grass.png",
    "grass2.png",
    "grass3.png"
];
const DIRT = [
    "dirt.png",
    "dirt2.png",
    "dirt3.png"
];
const SAND = [
    "sand.png",
    "sand2.png",
    "sand3.png"
];

const WATER = [
    "water.png",
    "water2.png",
    "water3.png"
];


function setup(loader, resources)
{

    loading.parentNode.removeChild(loading);

    //console.log({loader,resources});

    const scale = determineScale(window.innerWidth);

    const width = window.innerWidth / scale;
    const height = window.innerHeight / scale;

    const app = new PIXI.Application({
        width: width,
        height: height,
        backgroundColor: 0x1099bb,
        resolution: (window.devicePixelRatio || 1) * scale,
    });
    document.body.appendChild(app.view);


    function drawTiles()
    {
        // The +5 gives us a buffer around the current player
        const widthInTiles = (width / 16) | 0;
        const heightInTiles = (height / 16) | 0;

        for (let y = 0; y < heightInTiles; y++)
        {
            for (let x = 0; x < widthInTiles; x++)
            {

                const v = noise.noise2D(x * NOISE_SCALE,  y * NOISE_SCALE);
                const v2 = noise.noise2D(y * NOISE_SCALE2,  x * NOISE_SCALE2);

                let texture;
                if (v < WATER_LINE)
                {
                    texture = WATER[(Math.random() * WATER.length) | 0];
                }
                else if (v < SAND_LINE)
                {
                    texture = SAND[(Math.random() * SAND.length) | 0];
                }
                else
                {
                    if (v2 > -0.4)
                    {
                        texture = GRASS[(Math.random() * GRASS.length) | 0];
                    }
                    else
                    {
                        texture = DIRT[(Math.random() * DIRT.length) | 0];
                    }
                }

                groundTiles.addFrame(texture, x * 16, y * 16);
            }
        }
    }


    // const container = new PIXI.Container();
    //
    // app.stage.addChild(container);
    //
    // // Create a new texture
    // const texture = resources[ATLAS].texture;
    //
    // // Create a 5x5 grid of bunnies
    // for (let i = 0; i < 25; i++)
    // {
    //     const bunny = new PIXI.Sprite(texture);
    //     bunny.anchor.set(0.5);
    //     bunny.x = (i % 5) * 40;
    //     bunny.y = Math.floor(i / 5) * 40;
    //     container.addChild(bunny);
    // }
    //
    // // Move container to the center
    // container.x = app.screen.width / 2;
    // container.y = app.screen.height / 2;
    //
    // // Center bunny sprite in local container coordinates
    // container.pivot.x = container.width / 2;
    // container.pivot.y = container.height / 2;

    // Create our tile map based on the ground texture

    groundTiles = new PIXI.tilemap.CompositeRectTileLayer(0, PIXI.utils.TextureCache["atlas/atlas-0.json_image"]);
    drawTiles();

    app.stage.addChild(groundTiles);

    // // Listen for animate update
    // app.ticker.add((delta) => {
    //     // rotate the container!
    //     // use delta to create frame-independent transform
    //     container.rotation -= 0.01 * delta;
    // });
}
