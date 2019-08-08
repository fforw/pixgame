import * as PIXI from "pixi.js"
import "./pixi-tilemap"
import React from "react"
import ReactDOM from "react-dom"
// noinspection ES6UnusedImports
import STYLES from "./style.css"
import SceneGraph from "./SceneGraph";
import WorldScene from "./scenes/WorldScene"
import StartScene from "./scenes/StartScene"
import logger from "./util/logger";
import { getCurrentLayerMask } from "./drawTiles"
import CanvasWrapper from "./CanvasWrapper"
import MapWidget from "./MapWidget"

import { Modal, ModalBody, ModalHeader } from "reactstrap"
import Home from "./scenes/Home";
import City from "./scenes/City";
import InfoBox from "./InfoBox";
import Services from "./workers/Services";
import { DARK } from "./config";


function determineScale(width)
{
    console.log("determineScale", width);

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

// export const POS_X = START_X * 16;
// export const POS_Y = START_Y * 16;
// export const POS_X = 1561 * 16;
// export const POS_Y = 365 * 16;
// export const POS_X = 1184 * 16;
// export const POS_Y = 1090 * 16;
// export const POS_X = 1151 * 16;
// export const POS_Y = 856 * 16;
// export const POS_X = 0;
// export const POS_Y = 0;


export const POS_X = 1225 * 16;
export const POS_Y = 955 * 16;

const ACCELERATION = 0.9;
const SPEED_LIMIT = 15;
const ZOOM_SPEED = 10;
const INV_ZOOM_SPEED = 1/ZOOM_SPEED;
/**
 * Global context object for the scene graph.
 *
 * @type {{app: PIXI.Application, atlas: object, container: PIXI.Container, posX: number, posY: number, controls: {moveUpDown: number, moveLeftRight: number}, tileLayer: PIXI.tilemap.CompositeRectTileLayer, width: number, height: number, scale: number, blocked; boolean, dx: number, dy: number, map: WorldMap, worldMap: WorldMap}}
 */

const ctx = {
    app: null,
    /** atlas.json data **/
    atlas : null,
    /**
     * Container around our tilemap
     */
    container: null,
    /** Current map*/
    map : null,
    /**
     * The world map,
     */
    worldMap: null,
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
    posX: POS_X,
    posY: POS_Y,
    blocked: false,
    dx: 0,
    dy: 0,
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
    },

    maxFrameWidth: 0,
    maxFrameHeight: 0,

    mobiles: [],
    selectedMob: -1,

    services: Services

};

let interactionSensor;
let interactionSensorX;
let interactionSensorY;

function handleMovement(delta)
{

    const { map, posX, posY } = ctx;


    if (map)
    {
        const {moveLeftRight, moveUpDown} = ctx.controls;

        const tx = ((posX + 33) >> 4) & map.sizeMask;
        const ty = ((posY + 28) >> 4) & map.sizeMask;

        const tile = map.read(tx,ty);

        //const speedLimit = SPEED_LIMIT * (tile === RIVER ? 0.15 : tile === SAND ? 0.4: 1);
        const speedLimit = SPEED_LIMIT;
        if (moveLeftRight)
        {
            ctx.dx += moveLeftRight *  ACCELERATION;
        }
        else
        {

            ctx.dx = Math.abs(ctx.dx) > 0.1 ? ctx.dx * 0.7 : 0;
        }

        if (moveUpDown)
        {
            ctx.dy += moveUpDown * ACCELERATION ;
        }
        else
        {
            ctx.dy = Math.abs(ctx.dy) > 0.1 ? ctx.dy * 0.7 : 0;
        }

        const speed = Math.sqrt(ctx.dx * ctx.dx + ctx.dy * ctx.dy);
        if (speed > speedLimit)
        {
            const f = speedLimit / speed;
            ctx.dx *= f;
            ctx.dy *= f;
        }

        const sdx = Math.sign(ctx.dx);
        if (Math.abs(ctx.dx) > speedLimit)
        {
            ctx.dx = sdx * speedLimit;
        }
        const sdy = Math.sign(ctx.dy);
        if (Math.abs(ctx.dy) > speedLimit)
        {
            ctx.dy = sdy * speedLimit;
        }


        let canMove = true;
        let x,y;
        // let thing;
        // let attempts = 0;
        // do
        // {
            x = (posX + ctx.dx * delta) & map.fineMask;
            y = (posY + ctx.dy * delta) & map.fineMask;

            // const tx = ((x + 33) >> 4) & map.sizeMask;
            // const ty = ((y + 28) >> 4) & map.sizeMask;
        //
        //     thing = map.getThing(tx,ty);
        //
        //     canMove = thing < BLOCKED || thing === HOUSE || thing === IGLOO;
        //     attempts++;
        //
        //     if(!canMove)
        //     {
        //         ctx.dx *= 0.5;
        //         ctx.dy *= 0.5;
        //     }
        //
        // }  while (!ctx.blocked && !canMove && attempts < 5);

        if (canMove && !ctx.blocked)
        {
            const { sizeBits } = map;

            // const sensor = map.lookupSensor(tx,ty);
            // //sensorLogger(tx + ", " + ty + ", offset = " + ((ty << sizeBits) + tx) + ": " + sensor);
            // if (sensor)
            // {
            //     const { fromDirections } = sensor.options;
            //
            //     const direction = ((sdx > 0) + ((sdy > 0) << 1) + ((sdx < 0) << 2) + ((sdy < 0) << 3));
            //
            //     if ((fromDirections & direction) !== 0)
            //     {
            //         if (sensor.mode === SensorMode.INTERACTION)
            //         {
            //             document.body.className = "interaction";
            //             interactionSensor = sensor;
            //             interactionSensorX = tx;
            //             interactionSensorY = ty;
            //
            //
            //         }
            //         else
            //         {
            //             document.body.className = null;
            //             interactionSensor = null;
            //             interactionSensorX = 0;
            //             interactionSensorY = 0;
            //         }
            //
            //         if (sensor.mode === SensorMode.MOTION)
            //         {
            //             sensor.action(tx,ty);
            //         }
            //     }
            // }
            // else
            // {
                ctx.posX = x;
                ctx.posY = y;
                //movementLogger("FREE ON " + tileNames[tile] + "/" + thingNames[thing] + ": " + tx + ", " + ty);
//            }
        }
        else
        {
            //movementLogger("BLOCKED BY " + tileNames[tile] + "/" + thingNames[thing] + ": " + tx + ", " + ty);

            ctx.dx = 0;
            ctx.dy = 0;
            ctx.blocked = true;
            //console.log(tx + " x " + ty + ": " + );
        }
    }
}

const movementLogger = logger("MOVEMENT");
const sensorLogger = logger("SENSOR");


function updateSize(scale)
{
    const { app } = ctx;

    scale = typeof scale === "number" ? scale : determineScale(Math.max(window.innerWidth, window.innerHeight) * window.devicePixelRatio);

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


export function renderReact()
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
                    <InfoBox mob={ ctx.selectedMob >= 0 && ctx.mobiles[ctx.selectedMob] }/>
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


function findFrameMaximum(atlas)
{
    const { frames } = atlas;

    let maxW = 0;
    let maxH = 0;

    for (let name in frames)
    {
        if (frames.hasOwnProperty(name))
        {
            const { frame } = frames[name];

            if (frame.w > maxW)
            {
                maxW = frame.w;
            }
            if (frame.h > maxH)
            {
                maxH = frame.h;
            }
        }
    }

    maxW = Math.ceil(maxW / 16);
    maxH = Math.ceil(maxH / 16);

    console.log("Frame maximums:", maxW, maxH);

    return [ maxW, maxH  ];
}


function isInUI(ev)
{
    let elem = ev.target;

    while (elem.id !== "root")
    {
        //console.log("isInUI", elem);
        
        if (elem.className.indexOf("ui-elem") >= 0)
        {
            return true;
        }
        elem = elem.parentNode;
    }
    return false;
}


function setup(loader, resources)
{
    const atlas = resources["atlas/atlas-0.json"].data;

    const [ maxFrameWidth, maxFrameHeight ] = findFrameMaximum(atlas);

    //console.log("setup", resources);

    const scale = determineScale(Math.max(window.innerWidth, window.innerHeight));

    const width = (window.innerWidth / scale)|0;
    const height = (window.innerHeight / scale)|0;

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
        scale,
        maxFrameWidth,
        maxFrameHeight
    });

    const sceneGraph = new SceneGraph([
        StartScene,
        WorldScene,
        Home,
        City
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
            case 188:
                ctx.selectedMob--;
                if (ctx.selectedMob < 0)
                {
                    ctx.selectedMob = ctx.mobiles.length - 1;
                }

                console.log("selectedMob", ctx.selectedMob);
                
                ctx.posX = ctx.mobiles[ctx.selectedMob].x;
                ctx.posY = ctx.mobiles[ctx.selectedMob].y;

                renderReact();
                break;
            case 190:
                ctx.selectedMob++;
                if (ctx.selectedMob >= ctx.mobiles.length || ctx.selectedMob < 0)
                {
                    ctx.selectedMob = 0;
                }

                console.log("selectedMob", ctx.selectedMob);

                ctx.posX = ctx.mobiles[ctx.selectedMob].x;
                ctx.posY = ctx.mobiles[ctx.selectedMob].y;
                renderReact();
                break;

            case 13:
                // if (interactionSensor)
                // {
                //     interactionSensor.action(interactionSensorX, interactionSensorY);
                // }
                break;
            case 49:
                ctx.scale = determineScale(Math.max(window.innerWidth, window.innerHeight));

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

                if (ctx.selectedMob >= 0)
                {
                    ctx.selectedMob = -1;
                    renderReact();
                }
                else
                {
                    togglePause();
                }
                break;
            case 36:
                ctx.posX = POS_X;
                ctx.posY = POS_Y;
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
                ctx.blocked = false;
                break;
            case 37:
            case 65:
            case 39:
            case 68:
                ctx.controls.moveLeftRight = 0;
                ctx.blocked = false;
                break;
        }
    }, true);

    window.addEventListener("resize", ev => {

        updateSize();

        //console.log("Window resized to " + ctx.width + " x " + ctx.height)

    }, true);


    let zoomDelta = 0;

    window.addEventListener("click", ev => {

        if (!ctx.map || isInUI(ev))
        {
            return;
        }

        const rect = ctx.app.view.getBoundingClientRect();
        const halfWidth = ctx.width >> 1;
        const halfHeight = ctx.height >> 1;
        const x = ctx.posX - halfWidth  + (ev.clientX - rect.left)/ctx.scale;
        const y = ctx.posY - halfHeight + (ev.clientY - rect.top)/ctx.scale;

        // console.log("x: " + mapX + " y: " + mapY, "ev =", x, y);
        // ctx.map.write(mapX, mapY, DARK);
        //

        // // if (interactionSensor)
        // // {
        // //     interactionSensor.action(interactionSensorX, interactionSensorY);
        // // }
        //
        if (ctx.selectedMob >= 0)
        {
            const mobile = ctx.mobiles[ctx.selectedMob];
            console.log("Move ", mobile.name, " from", mobile.x >> 4, mobile.y >> 4, " to ", x >> 4, y >> 4, "obj = ", mobile);
            mobile.moveTo(x, y);
            // ctx.mobiles[ctx.selectedMob + 1].moveTo(x,y);
            // ctx.mobiles[ctx.selectedMob + 2].moveTo(x,y);
        }

    }, true);
    
    window.addEventListener("wheel", event => {

        const deltaY = Math.sign(event.deltaY);
        zoomDelta += deltaY * INV_ZOOM_SPEED;
    }, true);

    sceneGraph.start();
    sceneGraph.render();

    renderReact()

}
