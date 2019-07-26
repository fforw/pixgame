import * as PIXI from "pixi.js"
import "./pixi-tilemap"
import React from "react"
import ReactDOM from "react-dom"
// noinspection ES6UnusedImports
import STYLES from "./style.css"
import SceneGraph from "./SceneGraph";
import WorldScene from "./scenes/WorldScene"
import StartScene from "./scenes/StartScene"
import { _RIVER, BLOCKED, HOUSE, IGLOO, RIVER, SAND, SENSOR, thingNames, tileNames } from "./WorldMap"
import logger from "./util/logger";
import { getCurrentLayerMask } from "./drawTiles"
import CanvasWrapper from "./CanvasWrapper"
import MapWidget from "./MapWidget"

import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap"

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
let paused = false;
let showMap = false;

export const START_X = 1280 * 16;
export const START_Y = 964 * 16;

let dx = 0;
let dy = 0;
let blocked = false;

const ACCELERATION = 0.6;
const SPEED_LIMIT = 15;
const ZOOM_SPEED = 10;
const INV_ZOOM_SPEED = 1/ZOOM_SPEED;
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
    // posX: -3 * 16 - 8, ,
    // posY: -3 * 16, ,

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

    const { map, posX, posY } = ctx;


    if (map)
    {
        const {moveLeftRight, moveUpDown} = ctx.controls;

        const tx = ((posX + 33) >> 4) & map.sizeMask;
        const ty = ((posY + 28) >> 4) & map.sizeMask;

        const tile = map.read(tx,ty);

        const speedLimit = SPEED_LIMIT * (tile === RIVER ? 0.15 : tile === SAND ? 0.4: 1);
        if (moveLeftRight)
        {
            dx += moveLeftRight *  ACCELERATION;
        }
        else
        {

            dx = Math.abs(dx) > 0.1 ? dx * 0.7 : 0;
        }

        if (moveUpDown)
        {
            dy += moveUpDown * ACCELERATION ;
        }
        else
        {
            dy = Math.abs(dy) > 0.1 ? dy * 0.7 : 0;
        }

        const speed = Math.sqrt(dx * dx + dy * dy);
        if (speed > speedLimit)
        {
            const f = speedLimit / speed;
            dx *= f;
            dy *= f;
        }

        if (Math.abs(dx) > speedLimit)
        {
            dx = Math.sign(dx) * speedLimit;
        }
        if (Math.abs(dy) > speedLimit)
        {
            dy = Math.sign(dy) * speedLimit;
        }


        let canMove;
        let thing;
        let attempts = 0;
        let x,y;
        do
        {
            x = (posX + dx * delta) & map.fineMask;
            y = (posY + dy * delta) & map.fineMask;

            const tx = ((x + 33) >> 4) & map.sizeMask;
            const ty = ((y + 28) >> 4) & map.sizeMask;

            thing = map.getThing(tx,ty);

            canMove = thing < BLOCKED || thing === HOUSE || thing === IGLOO;
            attempts++;

            if(!canMove)
            {
                dx *= 0.5;
                dy *= 0.5;
            }

        }  while (!canMove && attempts < 5);

        if (canMove)
        {
            if (thing === SENSOR)
            {
                const sensor = map.lookupSensor(tx,ty);
                enterSensor(ctx, sensor);
            }
            else
            {
                ctx.posX = x;
                ctx.posY = y;
                //movementLogger("FREE ON " + tileNames[tile] + "/" + thingNames[thing] + ": " + tx + ", " + ty);
            }
        }
        else
        {
            //movementLogger("BLOCKED BY " + tileNames[tile] + "/" + thingNames[thing] + ": " + tx + ", " + ty);
            
            dx = 0;
            dy = 0;
            blocked = true;
            //console.log(tx + " x " + ty + ": " + );
        }
    }
}

const movementLogger = logger("movementLogger");


function updateSize(scale)
{
    const { app } = ctx;

    scale = typeof scale === "number" ? scale : determineScale(window.innerWidth);

    ctx.width = (window.innerWidth / scale) | 0;
    ctx.height = (window.innerHeight / scale) | 0;

    app.renderer.resize(ctx.width, ctx.height)
}


function togglePause()
{
    paused = showMap ? true : !paused;
    renderReact()
}

function toggleShowMap()
{
    showMap = !showMap;
    togglePause();
}


function renderReact()
{
    return new Promise((resolve, reject) => {
        try
        {
            ReactDOM.render(
                <React.Fragment>
                    <CanvasWrapper
                        canvasElem={ctx.app.view}
                    />
                    <Modal
                        isOpen={ paused && !showMap }
                        toggle={togglePause}
                        centered={ true }
                        keyboard={ false }
                    >
                        <ModalHeader toggle={ togglePause }>
                            PAUSED
                        </ModalHeader>
                        <ModalBody>
                            Game paused
                        </ModalBody>
                    </Modal>
                    <Modal
                        isOpen={ showMap }
                        toggle={toggleShowMap}
                        centered={ true }
                        size="lg"
                    >
                        <ModalHeader toggle={ toggleShowMap }>
                            <button
                                type="button"
                                className="btn btn-secondary mr-1"
                                onClick={ ev => alert("Teleport")}

                            >
                                Travel
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary mr-1"
                                onClick={ ev => alert("Teleport")}

                            >
                                Teleport
                            </button>
                        </ModalHeader>
                        <ModalBody>
                            <MapWidget
                                map={ ctx.map }
                                size={
                                    (Math.min(window.innerWidth, window.innerHeight) - 200) | 0
                                }
                            />
                        </ModalBody>
                    </Modal>
                </React.Fragment>,
                document.getElementById("root"),
                resolve
            )
        } catch (e)
        {
            reject(e);
        }

    })
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
        antialias: false,
    });


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
        scale
    });

    const sceneGraph = new SceneGraph([
        StartScene,
        WorldScene
    ], ctx);

    app.ticker.add((delta) => {

        if (!paused && !showMap)
        {
            handleMovement(delta);
            sceneGraph.ticker(delta);
        }
    });

    window.addEventListener("keydown", ev => {
        const keyCode = ev.keyCode;

        switch(keyCode)
        {

            case 49:
                ctx.scale = determineScale(window.innerWidth)
                break;
            // map
            case 77:
                if (!paused || showMap)
                {
                    toggleShowMap();
                }
                break;
            // P
            case 27:
            case 80:
                console.log("POS", (ctx.posX >> 4)|0, (ctx.posY >> 4)|0, ", fine = ", ctx.posX, ctx.posY, ", layerMask = ", getCurrentLayerMask())
                togglePause();
                break;
            case 36:
                ctx.posX = START_X;
                ctx.posY = START_Y;
                break;
            case 35:
                ctx.posX = 0;
                ctx.posY = 0;
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
                blocked = false;
                break;
            case 37:
            case 65:
            case 39:
            case 68:
                ctx.controls.moveLeftRight = 0;
                blocked = false;
                break;
        }
    }, true);

    window.addEventListener("resize", ev => {

        updateSize();

        //console.log("Window resized to " + ctx.width + " x " + ctx.height)

    }, true);


    let zoomDelta = 0;

    window.addEventListener("wheel", event => {

        const deltaY = Math.sign(event.deltaY);
        zoomDelta += deltaY * INV_ZOOM_SPEED;
    });

    sceneGraph.start();
    sceneGraph.render();

    renderReact()
}
