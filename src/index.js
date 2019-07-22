import * as PIXI from "pixi.js"
import "./pixi-tilemap"
// noinspection ES6UnusedImports
import STYLES from "./style.css"
import SceneGraph from "./SceneGraph";
import WorldScene from "./scenes/WorldScene";
import StartScene from "./scenes/StartScene";


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



window.onload = () => {

    PIXI.Loader.shared
        .add("atlas/atlas-0.json")
        .load(setup);
};

// PIXI.Loader.shared.onProgress.add(function (ev) {
//     console.log(ev.progress);
// });

let tileLayer;

const START_X = 1025 * 16;
const START_Y = 1197 * 16;

let posX = START_X;
let posY = START_Y;
let dx = 0;
let dy = 0;

const ACCELERATION = 0.5;
const SPEED_LIMIT = 12;

/**
 * Global context object for the scene graph.
 *
 * @type {{app: PIXI.Application, atlas: object, container: PIXI.Container, posX: number, posY: number, controls: {moveUpDown: number, moveLeftRight: number}, tileLayer: PIXI.tilemap.CompositeRectTileLayer, width: number, height: number, scale: number}}
 */

const ctx = {
    app: null,
    /** atlas.json data **/
    atlas : null,
    /**
     * Container around our tilemap
     */
    container: null,
    /** Current WorldMap */
    map : null,
    /**
     * Current width
     */
    width: -1,
    /**
     * Current height
     */
    height: -1,
    /**
     * CompositeRectTileLayer
     */
    tileLayer : null,
    /**
     * Current scale
     */
    scale: 2,
    /**
     * Current scale
     */
    posX: START_X,
    posY: START_Y,

    /**
     * Current user input
     */
    controls: {
        moveLeftRight: 0,
        moveUpDown: 0,
        action: false,
        meta: false
    }
};


function handleMovement(delta)
{
    const {moveLeftRight, moveUpDown} = ctx.controls;

    if (moveLeftRight)
    {
        dx += moveLeftRight * ACCELERATION;
        if (Math.abs(dx) > SPEED_LIMIT)
        {
            dx = Math.sign(dx) * SPEED_LIMIT;
        }
    }
    else
    {
        dx = Math.abs(dx) > 0.1 ? dx * 0.8 : 0;
    }
    if (moveUpDown)
    {
        dy += moveUpDown * ACCELERATION;
        if (Math.abs(dy) > SPEED_LIMIT)
        {
            dy = Math.sign(dy) * SPEED_LIMIT;
        }
    }
    else
    {
        dy = Math.abs(dy) > 0.1 ? dy * 0.8 : 0;
    }

    if (ctx.map)
    {
        posX = (posX + dx * delta) & ctx.map.fineMask;
        posY = (posY + dy * delta) & ctx.map.fineMask;

        ctx.posX = posX;
        ctx.posY = posY;
    }
}


function setup(loader, resources)
{
    const atlas = resources["atlas/atlas-0.json"].data;

    //console.log("setup", resources);

    const scale = determineScale(window.innerWidth);

    const width = (window.innerWidth / scale)|0;
    const height = (window.innerHeight / scale)|0;

    console.log({width, height})

    const halfWidth = width/2;
    const halfHeight = height/2;


    const app = new PIXI.Application({
        width: width,
        height: height,
        backgroundColor: 0x111111,
        resolution: (window.devicePixelRatio || 1) * scale,
    });
    document.body.appendChild(app.view);


    //PIXI.tilemap.Constant.use32bitIndex = true;
    tileLayer = new PIXI.tilemap.CompositeRectTileLayer(0, PIXI.utils.TextureCache["atlas/atlas-0.json_image"]);

    const container = new PIXI.Container();
    container.addChild(tileLayer);
    app.stage.addChild(container);

    container.x = app.screen.width / 2;
    container.y = app.screen.height / 2;
    container.pivot.x = halfWidth;
    container.pivot.y = halfHeight;

    // initialize context fields
    Object.assign(ctx ,{
        tileLayer,
        atlas,
        width,
        height,
        app,
        container,
        scale,
        posX,
        posY
    });

    const sceneGraph = new SceneGraph([
        StartScene,
        WorldScene
    ], ctx);

    app.ticker.add((delta) => {

        handleMovement(delta);
        sceneGraph.ticker(delta);
    });

    window.addEventListener("keydown", ev => {
        const keyCode = ev.keyCode;


        switch(keyCode)
        {
            case 80:
                console.log("POS", (posX >> 4)|0, (posY >> 4)|0, ", fine = ", posX, posY, ", layerMask = ", getCurrentLayerMask())
                break;
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
                ctx.controls.moveUpDown = -1;
                break;
            case 37:
            case 65:
                ctx.controls.moveLeftRight = -1;
                break;
            case 40:
            case 83:
                ctx.controls.moveUpDown = 1;
                break;
            case 39:
            case 68:
                ctx.controls.moveLeftRight = 1;
                break;
            default:
                console.log("keyCode = ", keyCode);
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
                ctx.controls.moveUpDown = 0;
                break;
            case 37:
            case 65:
            case 39:
            case 68:
                ctx.controls.moveLeftRight = 0;
                break;
        }
    }, true);

    window.addEventListener("resize", ev => {

        ctx.width = (window.innerWidth / ctx.scale)|0;
        ctx.height = (window.innerHeight / ctx.scale)|0;

        app.renderer.resize(ctx.width,ctx.height)

        //console.log("Window resized to " + ctx.width + " x " + ctx.height)

    }, true);

    sceneGraph.start();
}
