import "./pixi-tilemap"
import React from "react"
import ReactDOM from "react-dom"
import { Modal, ModalBody, ModalHeader } from "reactstrap"
import key from "keymaster"

// noinspection ES6UnusedImports
import STYLES from "./style.css"

import SceneGraph from "./SceneGraph";
import WorldScene from "./scenes/WorldScene"
import StartScene from "./scenes/StartScene"
import logger from "./util/logger";
import { getCurrentLayerMask } from "./drawTiles"
import CanvasWrapper from "./CanvasWrapper"
import MapWidget from "./MapWidget"

import Home from "./scenes/Home";
import City from "./scenes/City";
import InfoBox from "./InfoBox";
import Services from "./workers/Services";
import { DARK } from "./config";
import { findMultipleWalkable } from "./Meeple";

function mod(n, m)
{
    return ((n % m) + m) % m;
}

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
    selectedMob: new Set(),

    services: Services,
    collision: null
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


export function lastEntry(selectedMob)
{
    let value = null;
    for (let curr of selectedMob)
    {
        value = curr;
    }
    return value;
}


export function renderReact()
{
    return new Promise((resolve, reject) => {
        try
        {
            const selectedMob = ctx.selectedMob;
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
                    <InfoBox mob={ selectedMob.size && ctx.mobiles[lastEntry(selectedMob)] }/>
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


function selectMob(delta, addToSelection = false)
{
    if (ctx.selectedMob.size)
    {
        const lastValue = lastEntry(ctx.selectedMob);

        !addToSelection && ctx.selectedMob.clear();
        ctx.selectedMob.add(mod(lastValue + delta, ctx.mobiles.length));
    }
    else
    {
        ctx.selectedMob.add(mod(delta, ctx.mobiles.length));
    }
}


function updateControls()
{
    if (key.isPressed("w") || key.isPressed("up"))
    {
        ctx.controls.moveUpDown = -1;
    }
    else if (key.isPressed("s") || key.isPressed("down"))
    {
        ctx.controls.moveUpDown = 1;
    }
    else
    {
        ctx.controls.moveUpDown = 0;
    }

    if (key.isPressed("a") || key.isPressed("left"))
    {
        ctx.controls.moveLeftRight = -1;
    }
    else if (key.isPressed("d") || key.isPressed("right"))
    {
        ctx.controls.moveLeftRight = 1;
    }
    else
    {
        ctx.controls.moveLeftRight = 0;
    }
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
            updateControls();

            handleMovement(delta);
            sceneGraph.ticker(delta);
        }
    });

    key(",", () => {
        selectMob(-1);

        const lastSelected = lastEntry(ctx.selectedMob);
        const mob = ctx.mobiles[lastSelected];
        console.log("selectedMob", ctx.selectedMob, "lastSelected", mob);
        ctx.posX = mob.x;
        ctx.posY = mob.y;

        renderReact();
    });
    key("shift+,", () => {
        selectMob(-1, true);


        const lastSelected = lastEntry(ctx.selectedMob);
        const mob = ctx.mobiles[lastSelected];
        console.log("selectedMob", ctx.selectedMob, "lastSelected", mob);
        ctx.posX = mob.x;
        ctx.posY = mob.y;

        renderReact();
    });

    key(".", () => {

        selectMob(1);

        const lastSelected = lastEntry(ctx.selectedMob);
        const mob = ctx.mobiles[lastSelected];
        console.log("selectedMob", ctx.selectedMob, "lastSelected", mob);

        ctx.posX = mob.x;
        ctx.posY = mob.y;
        renderReact();
    });
    key("shift+.", () => {

        selectMob(1, true);

        const lastSelected = lastEntry(ctx.selectedMob);
        const mob = ctx.mobiles[lastSelected];
        console.log("selectedMob", ctx.selectedMob, "lastSelected", mob);

        ctx.posX = mob.x;
        ctx.posY = mob.y;
        renderReact();
    });

    key("m", () => {
        if (!paused || showMap)
        {
            toggleShowMap();
        }
    });

    key("p", () => {
        console.log("POS", (ctx.posX >> 4)|0, (ctx.posY >> 4)|0, ", fine = ", ctx.posX, ctx.posY, ", layerMask = ", getCurrentLayerMask())

        if (ctx.selectedMob.size)
        {
            ctx.selectedMob.clear();
            renderReact();
        }
        else
        {
            togglePause();
        }
    });

    key("home", () => {
        ctx.posX = POS_X;
        ctx.posY = POS_Y;
    });

    key("end", () => {
        ctx.posX = 0;
        ctx.posY = 0;
    });


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

        if (ev.shiftKey)
        {
            console.log("SHIFT-CLICK", x, y)
            return;
        }

        // console.log("x: " + mapX + " y: " + mapY, "ev =", x, y);
        // ctx.map.write(mapX, mapY, DARK);
        //

        // // if (interactionSensor)
        // // {
        // //     interactionSensor.action(interactionSensorX, interactionSensorY);
        // // }
        //

        const { collision } = ctx;
        const { size } = ctx.selectedMob;
        const { sizeMask, sizeBits } = collision;

        if (size)
        {
            const offsets = findMultipleWalkable(ctx.collision, x, y, size);

            let pos = 0;
            for (let index of ctx.selectedMob)
            {
                const offset = offsets[pos++];
                const mobile = ctx.mobiles[index];
                const px = offset & sizeMask;
                const py = y >> sizeBits;
                console.log("Move ", mobile.name, " from", mobile.x >> 4, mobile.y >> 4, " to ", px , py , "obj = ", mobile);
                mobile.moveTo(px, py);
            }
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
