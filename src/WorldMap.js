import "./pixi-tilemap"

import SimplexNoise from "simplex-noise"
import Prando from "prando"
import now from "performance-now"
import flood from "./flood";

const TAU = Math.PI * 2;

const N1 = 0.4;
const N2 = 1.4;
const N3 = 20;
const N4 = 5;

function clamp(v)
{
    return v < -1 ? -1 : v > 1 ? 1 : v;
}

const WATER_LINE = 0.05;
const BEACH_LINE = 0.07;
const WOODS_LINE = 0.09;
const MOUNTAIN_LINE = 0.5;

// tiles
export const WATER = 0;
export const WATER2 = 1;
export const WATER3 = 2;
export const SAND = 3;
export const SAND2 = 4;
export const SAND3 = 5;
export const GRASS = 6;
export const GRASS2 = 7;
export const GRASS3 = 8;
export const DIRT = 9;
export const DIRT2 = 10;
export const DIRT3 = 11;
export const ROCK = 12;
export const ROCK2 = 13;
export const ROCK3 = 14;
export const WOODS = 15;
export const WOODS2 = 16;
export const WOODS3 = 17;
export const WOODS4 = 18;
export const RIVER = 19;
export const RIVER2 = 20;
export const RIVER3 = 21;
export const MARKER = 22;
export const MARKER2 = 23;
export const MARKER3 = 24;

// things
export const BLOCKED = 1;
export const LARGE_TREE = 2;
export const LARGE_TREE_2 = 3;
export const SMALL_TREE = 4;
export const SMALL_TREE_2 = 5;
export const SMALL_TREE_3 = 6;
export const PLANT = 7;
export const PLANT_2 = 8;
export const PLANT_3 = 9;
export const BOULDER = 10;
export const BOULDER_2 = 11;
export const BLOCKED_MARKER = 12;

function calcWeightSum(array)
{
    if (!array)
    {
        return 0;
    }

    let sum = 0;
    for (let i = 1; i < array.length; i += 2)
    {
        sum += array[i];
    }
    return sum;
}

const tileNames = [
    "WATER",
    "WATER2",
    "WATER3",
    "SAND",
    "SAND2",
    "SAND3",
    "GRASS",
    "GRASS2",
    "GRASS3",
    "DIRT",
    "DIRT2",
    "DIRT3",
    "ROCK",
    "ROCK2",
    "ROCK3",
    "WOODS",
    "WOODS2",
    "WOODS3",
    "WOODS4",
    "RIVER",
    "RIVER2",
    "RIVER3",
    "MARKER",
    "MARKER2",
    "MARKER3"
];

const variants = {
    [WATER] : [WATER, WATER2, WATER3],
    [SAND] :  [SAND, SAND2, SAND3],
    [GRASS] : [GRASS, GRASS2, GRASS3],
    [DIRT] :  [DIRT, DIRT2, DIRT3],
    [ROCK] :  [ROCK, ROCK2, ROCK3],
    [WOODS] : [WOODS, WOODS3],
    [WOODS2] :[WOODS2, WOODS4],
    [RIVER] : [RIVER, RIVER2, RIVER3]
};

/**
 * Map to look up base tiles for tile codes.s
 *
 * @type {Array<Number>}
 */
export const TILE_TO_BASE_TILE = (() => {

    const array = new Array(tileNames.length);

    for (let sTile in variants)
    {
        if (variants.hasOwnProperty(sTile))
        {
            const baseTile = +sTile;
            array[baseTile] = baseTile;

            const variantArray = variants[sTile];
            for (let i = 0; i < variantArray.length; i++)
            {
                const tile = variantArray[i];
                array[tile] = baseTile;
            }
        }
    }

    //console.log("TILE2BASE", array);

    return array;

})();


function normalizeSpawnTable(table)
{
    for (let sTile in table)
    {
        if (table.hasOwnProperty(sTile))
        {
            const array = table[sTile];

            if (array)
            {
                const sum = calcWeightSum(array);
                for (let i = 1; i < array.length; i += 2)
                {
                    array[i] /= sum
                }
            }
        }
    }

    return table;
}

const spawnTable = normalizeSpawnTable({
    [WATER] : false,
    [SAND] :  [0, 500, BOULDER, 1, BOULDER_2, 1],
    [GRASS] : [0, 1000, LARGE_TREE, 2, LARGE_TREE_2, 2, SMALL_TREE, 3, SMALL_TREE_3, 3, BOULDER, 1, BOULDER_2, 2],
    [DIRT] :  [0, 1000, LARGE_TREE, 2, LARGE_TREE_2, 2, SMALL_TREE, 3, SMALL_TREE_3, 3, BOULDER, 1, BOULDER_2, 2],
    [ROCK] :  [0, 4, BOULDER, 1, BOULDER_2, 1],
    [WOODS] : [0, 150, LARGE_TREE, 2, LARGE_TREE_2, 2, SMALL_TREE, 5, SMALL_TREE_2, 5, SMALL_TREE_3, 5, PLANT, 1, PLANT_2, 1, PLANT_3, 1, BOULDER, 1, BOULDER_2, 2],
    [WOODS2]: [0, 40, LARGE_TREE, 2, LARGE_TREE_2, 2, SMALL_TREE, 5, SMALL_TREE_2, 5, SMALL_TREE_3, 5, PLANT, 1, PLANT_2, 1, PLANT_3, 1, BOULDER, 1, BOULDER_2, 2],
    [RIVER] : false
});


//console.log("VARIANTS", JSON.stringify(variants, null, 4));

export function pickVariant(map, base)
{
    const values = variants[base];

    let num;
    let result;
    if (!values)
    {
        result = base;
    }
    else
    {
        const last = values.length - 1;

        if (last === 0)
        {
            result = values[0];
        }
        else
        {
            num = map.random.nextInt(0, last);
            //console.log(`Pick from 0 to ${last}: ${num}`)
            result = values[num];
        }
    }

    //console.log("Variant of ", base, "=>", result);

    return result;
}

export function isVariant(tile, base)
{
    return TILE_TO_BASE_TILE[tile] === base;
}


function spawn(map, spawns)
{
    let value = map.random.next();
    let pos = 1;
    do
    {
        value -= spawns[pos];
        pos += 2
    } while (value > 0 && pos < spawns.length);

    return spawns[pos - 3];
}


function spawnForBlock(map, mapOffset, baseTile)
{
    const { things, sizeMask } = map;

    if (things[mapOffset] !== 0)
    {
        console.log("Skip spawning on ", things[mapOffset])
        return;
    }

    const spawns = spawnTable[baseTile];
    if (spawns)
    {
        const thing = spawn(map, spawns);
        if (thing)
        {
            //console.log("THING", thing);

            if (thing === LARGE_TREE || thing === LARGE_TREE_2)
            {

                const prev3Offset = (mapOffset - 3) & sizeMask;
                const prev2Offset = (mapOffset - 2) & sizeMask;
                const prevOffset = (mapOffset - 1) & sizeMask;
                const nextOffset = (mapOffset + 1) & sizeMask;
                const next2Offset = (mapOffset + 2) & sizeMask;
                const next3Offset = (mapOffset + 3) & sizeMask;

                if (
                    things[prev3Offset] !== BLOCKED &&
                    things[prev2Offset] !== BLOCKED &&
                    things[prevOffset] !== BLOCKED
                )
                {

                    things[mapOffset] = thing;
                    things[nextOffset] = BLOCKED;
                    things[next2Offset] = BLOCKED;
                    things[next3Offset] = BLOCKED;

                    //console.log("Block for large tree", mapOffset)
                }
            }
            else if (thing === BOULDER)
            {
                const prevOffset = (mapOffset - 1) & sizeMask;
                const nextOffset = (mapOffset + 1) & sizeMask;

                //baseTile === ROCK && console.log("isLargeBoulder", things[prevOffset], things[mapOffset], things[nextOffset])

                if (
                    things[prevOffset] !== BLOCKED
                )
                {

                    things[mapOffset] = thing;
                    things[nextOffset] = BLOCKED;
                    //console.log("Block for large boulder", mapOffset)
                }
            }
            else
            {
                things[mapOffset] = thing;
            }
        }
    }
}


function determineBaseTile(map, x, y)
{
    const coords = map.heightCoords(x, y);
    const n = map.heightFn(x, y, coords);

    if (n < WATER_LINE)
    {
        return WATER;
    }
    else if (n < BEACH_LINE)
    {
        return SAND;
    }
    else if (n < MOUNTAIN_LINE)
    {
        const {nx, ny, nz, nw} = coords;

        const n3 = n > WOODS_LINE ? map.noise4D(nx * N4, nw * N4, ny * N4, nz * N4) : 1;
        const n4 = map.noise4D(nx * N3, nw * N3, ny * N3, nz * N3);
        if (n3 < 0)
        {
            if (n4 < 0)
            {
                return WOODS;
            }
            else
            {
                return WOODS2;
            }

        }
        else
        {
            if (n4 < 0)
            {
                return GRASS;
            }
            else
            {
                return DIRT;
            }
        }
    }
    else
    {
        return ROCK;
    }
}


function createBase(size, seed)
{
    const map = new WorldMap(size, seed);

    const { tiles } = map;

    let mapOffset = 0;
    for (let y = 0; y < size; y++)
    {
        for (let x = 0; x < size; x++)
        {
            const baseTile = determineBaseTile(map, x, y);
            tiles[mapOffset] = pickVariant(map, baseTile);

            spawnForBlock(map, mapOffset, baseTile);

            mapOffset++;
        }
    }
    return map;
}

function randomProbes(map)
{
    const probes = [];

    const { size } = map;

    const probeCount = size * size / 1000;

    console.log("Probe count =", probeCount);

    for (let i = 0; i < probeCount; i++)
    {
        const x = (map.random.next() * size) | 0;
        const y = (map.random.next() * size) | 0;

        const value = map.heightFn(x, y);

        if (value > WATER_LINE)
        {
            probes.push({
                x,
                y,
                value,
                points: [],
                tile: 0
            })
        }
    }
    return probes;
}


const directions = [
    0, -1,
    -1, 0,
    1, 0,
    0, 1
];


function climbUp(map, probe)
{
    let currentHigh = probe.value;
    let currentX = probe.x;
    let currentY = probe.y;

    const { size } = map;

    let improved = false;
    for (let i = 0; i < directions.length; i += 2)
    {
        const x = probe.x + directions[i];
        const y = probe.y + directions[i + 1];

        if (x > 0 && y > 0 && x < size && y < size)
        {
            const value = map.heightFn(x, y);
            if (value > currentHigh)
            {
                currentHigh = value;
                currentX = x;
                currentY = y;
                improved = true;
            }
        }
    }

    if (!improved)
    {
        return false;
    }
    else
    {
        return {
            x: currentX,
            y: currentY,
            value: currentHigh,
            points: []
        };
    }
}


function removeDuplicates(probes)
{
    const length = probes.length;

    const uniqueProbes = [];

    for (let i = 0; i < length; i++)
    {
        const probe = probes[i];
        let unique = true;
        for (let j = length - 1; j > i; j--)
        {
            const other = probes[j];
            if (probe.x === other.x && probe.y === other.y)
            {
                unique = false;
                break;
            }
        }

        if (unique)
        {
            uniqueProbes.push(probe);
        }
    }

    return uniqueProbes;
}


function jitter(map, filtered, amount = 8)
{
    const twice = amount * 2;

    const multis = [];
    for (let i = 0; i < filtered.length; i++)
    {
        const probe = filtered[i];
        const xOff = map.random.nextInt(-amount, amount);
        const yOff = map.random.nextInt(-amount, amount);
        probe.x = probe.x + xOff;
        probe.y = probe.y + yOff;

        const v = map.heightFn(probe.x, probe.y);

        if (v > MOUNTAIN_LINE && map.random.next() < 0.6)
        {
            multis.push(
                {
                    ...probe,
                    x: (probe.x - amount - yOff) | 0,
                    y: (probe.y - amount + xOff) | 0
                }
            );
        }
    }

    return filtered.concat(multis);
}


function createSprings(map)
{
    const probes = randomProbes(map);

    console.log(probes.length, "random probes");

    const { size } = map;

    const length = probes.length;
    let walkingStart = 0, i = 0;
    for (i = 0; i < size / 2 && walkingStart < length; i++)
    {
        //console.log("Walking " + (length - walkingStart))
        for (let j = walkingStart; j < length; j++)
        {
            const probe = probes[j];
            const improved = climbUp(map, probe);
            if (improved)
            {
                probes[j] = improved;
            }
            else
            {
                // swap current with first walker
                const firstWalker = probes[walkingStart];
                probes[walkingStart] = probes[j];
                probes[j] = firstWalker;
                // increase walking start
                walkingStart++;
            }
        }

        //drawSprings(probes, imageData, false);
    }


    const filtered = removeDuplicates(probes);

    //console.log(filtered.length, "springs");
    console.log("Stopped climbing after ", i, " iterations: " + filtered.length + " springs");

    return jitter(map, filtered);
}


function flow(map, probe)
{
    let currentLow = Infinity;
    let currentX = probe.x;
    let currentY = probe.y;
    let currentTile = -1;
    let currentDirection = -1;

    let improved = false;

    const { size } = map;

    for (let i = 0; i < directions.length; i += 2)
    {
        const x = probe.x + directions[i];
        const y = probe.y + directions[i + 1];

        if (x > 0 && y > 0 && x < size && y < size)
        {
            let tile = map.read(x, y);
            if (!isVariant(tile ,RIVER))
            {
                if (isVariant(tile,ROCK))
                {
                    const {nx, ny, nz, nw} = map.heightCoords(x, y);
                    const n3 = map.noise4D(nx * N3, nw * N3, ny * N3, nz * N3);
                    if (n3 < 0)
                    {
                        tile = GRASS;
                    }
                    else
                    {
                        tile = DIRT;
                    }
                }

                const value = map.heightFn(x, y) - (!isVariant(tile, SAND) && isVariant(tile, probe.tile) ? 0.001 : 0);
                if (value < currentLow)
                {
                    currentLow = value;
                    currentX = x;
                    currentY = y;
                    currentTile = tile;
                    currentDirection = i;
                    improved = true;
                }
            }
        }
    }

    if (!improved)
    {
        const dir = map.random.nextInt(0,3) * 2;
        probe.x += directions[dir];
        probe.y += directions[dir + 1];
        probe.tile = TILE_TO_BASE_TILE[map.read(probe.x, probe.y)];
    }
    else
    {
        const n = map.random.next();
        if (n < 0.25)
        {
            const dir = ((currentDirection/2 + (n < 0.125 ? -1 : 1)) & 3)* 2;

            probe.x += directions[dir];
            probe.y += directions[dir + 1];

            probe.points.push(probe.x, probe.y);

            probe.x += directions[dir];
            probe.y += directions[dir + 1];
            probe.value = 1;
            probe.tile = TILE_TO_BASE_TILE[map.read(probe.x, probe.y)];
        }
        else
        {
            probe.x = currentX;
            probe.y = currentY;
            probe.value = currentLow;
            probe.tile = TILE_TO_BASE_TILE[currentTile];

        }
    }
}



function drawRivers(map)
{
    const springs = createSprings(map);

    const { size } = map;

    const length = springs.length;
    let flowingStart = 0, i = 0;
    for (i = 0; i < size && flowingStart < length; i++)
    {
        //console.log("Flowing " + (length - flowingStart))
        for (let j = flowingStart; j < length; j++)
        {
            const probe = springs[j];

            const {x, y} = probe;
            probe.points.push(x,y);

            const currentTile = map.read(probe.x, probe.y);
            if (isVariant(currentTile, WATER))
            {
                // swap current with first flower
                const firstFlower = springs[flowingStart];
                springs[flowingStart] = springs[j];
                springs[j] = firstFlower;
                // increase walking start
                flowingStart++;
                continue;
            }
            flow(map, probe);

        }

        //drawSprings(springs, imageData, false);
    }
    console.log("Stopped flowing after ", i, " iterations");

    for (let i = 0; i < springs.length; i++)
    {
        const { points } = springs[i];

        for (let j = 0; j < points.length; j += 2)
        {

            const width = Math.min(8, j * 0.004)|0;
            flood(map, points[j], points[j + 1], width);
        }
    }


    for (let i = 0; i < springs.length; i++)
    {
        console.log("Spring length", springs[i].points.length)
    }
}



export default  class WorldMap {
    constructor(size = 800, seed)
    {
        const lg = Math.log(size) / Math.log(2);
        if ( (lg % 1) !== 0)
        {
            throw new Error("Size must be power of two: " + size);
        }

        console.log("New map " + size + " x " + size + ", seed = " + seed)

        this.random = new Prando(seed);
        this.noise = new SimplexNoise(() => this.random.next());
        this.size = size;

        this.sizeMask = size - 1;
        this.fineMask = (size << 4) - 1;

        this.factor = 1 / size;
        this.tiles = new Uint8Array(size * size);
        this.things = new Uint8Array(size * size);
    }


    read(x, y)
    {
        return this.tiles[y * this.size + x];
    }

    getThing(x, y)
    {
        return this.things[y * this.size + x];
    }

    write(x, y, tile)
    {
        this.tiles[y * this.size + x] = tile;
    }

    putThing(x, y, thing)
    {
        this.things[y * this.size + x] = thing;
    }


    /**
     * Returns the terrain height at the given tile coordinates
     *
     * @param {Number} x            tile x-coordinate
     * @param {Number} y            tile y-coordinate
     * @param {Object} [coords]     predetermined 4D coordinates
     * @param {number} coords.nx    predetermined 4D x-coordinate
     * @param {number} coords.ny    predetermined 4D y-coordinate
     * @param {number} coords.nz    predetermined 4D z-coordinate
     * @param {number} coords.nw    predetermined 4D w-coordinate
     * 
     * @return {number} height between -1 and 1 inclusive
     */
    heightFn(x, y, coords)
    {
        const s = x * this.factor;
        const t = y * this.factor;

        let nx;
        let ny;
        let nz;
        let nw;
        if (coords)
        {
            nx = coords.nx;
            ny = coords.ny;
            nz = coords.nz;
            nw = coords.nw;
        }
        else
        {
            nx = Math.cos(s * TAU);
            ny = Math.cos(t * TAU);
            nz = Math.sin(s * TAU);
            nw = Math.sin(t * TAU);
        }

        const n0 = this.noise4D(nx * N1, ny * N1, nz * N1, nw * N1);
        const n1 = this.noise4D(nx * N2, nw * N2, ny * N2, nz * N2);
        return clamp(n0 < 0 ? -n0 * n0 : n0 * n0) + n1 * 0.3;
    }


    /**
     * Returns the 4D coordinates for the given tile coordinates
     *
     * @param {Number} x    tile x-coordinate
     * @param {Number} y    tile y-coordinate
     * @return {{nw: number, nx: number, ny: number, nz: number}} 4D coordinates of 2 circles in 4D space
     */
    heightCoords(x, y)
    {

        const s = x * this.factor;
        const t = y * this.factor;

        const nx = Math.cos(s * TAU);
        const ny = Math.cos(t * TAU);
        const nz = Math.sin(s * TAU);
        const nw = Math.sin(t * TAU);

        return {
            nx,
            ny,
            nz,
            nw
        };
    }

    render(ctx)
    {
        const { size } = this;

        const imageData = ctx.createImageData(size, size);

        const data = imageData.data;

        let tileOffset = 0;
        let dataOffset = 0;
        for (let y = 0; y < size; y++)
        {
            for (let x = 0; x < size; x++)
            {
                const tile = this.tiles[tileOffset++];

                switch (tile)
                {
                    case RIVER:
                    case RIVER2:
                    case RIVER3:
                        data[dataOffset++] = 255;
                        data[dataOffset++] = 0;
                        data[dataOffset++] = 128;
                        data[dataOffset++] = 255;
                        break;
                    case WATER:
                    case WATER2:
                    case WATER3:
                        data[dataOffset++] = 0;
                        data[dataOffset++] = 32;
                        data[dataOffset++] = 128;
                        data[dataOffset++] = 255;
                        break;
                    case SAND:
                    case SAND2:
                    case SAND3:
                        data[dataOffset++] = 192;
                        data[dataOffset++] = 160;
                        data[dataOffset++] = 0;
                        data[dataOffset++] = 255;
                        break;
                    case GRASS:
                    case GRASS2:
                    case GRASS3:
                        data[dataOffset++] = 0;
                        data[dataOffset++] = 128;
                        data[dataOffset++] = 0;
                        data[dataOffset++] = 255;
                        break;
                    case WOODS:
                    case WOODS2:
                    case WOODS3:
                        data[dataOffset++] = 0;
                        data[dataOffset++] = 108;
                        data[dataOffset++] = 16;
                        data[dataOffset++] = 255;
                        break;
                    case WOODS4:
                        data[dataOffset++] = 0;
                        data[dataOffset++] = 64;
                        data[dataOffset++] = 32;
                        data[dataOffset++] = 255;
                        break;
                    case DIRT:
                    case DIRT2:
                    case DIRT3:
                        data[dataOffset++] = 64;
                        data[dataOffset++] = 64;
                        data[dataOffset++] = 0;
                        data[dataOffset++] = 255;
                        break;
                    case ROCK:
                    case ROCK2:
                    case ROCK3:
                        data[dataOffset++] = 100;
                        data[dataOffset++] = 100;
                        data[dataOffset++] = 100;
                        data[dataOffset++] = 255;
                        break;
                    case MARKER:
                    case MARKER2:
                    case MARKER3:
                        data[dataOffset++] = 255;
                        data[dataOffset++] = 0;
                        data[dataOffset++] = 255;
                        data[dataOffset++] = 255;
                        break;
                }
            }
        }

        return imageData;

    }

    noise4D(x,y,z,w)
    {
        return this.noise.noise4D(x,y,z,w);

    }

    static generate(size, seed = new Date().getTime()) {

        const start = now();
        const map = createBase(size, seed);
        const afterBase = now();
        drawRivers(map);
        const end = now();
        console.log(`Base in ${afterBase - start}ms`)
        console.log(`Rivers in ${end - start}ms`)

        console.log({ thingStats : map.things.reduce((a,b) =>(a[b] = a[b] === undefined ? 1: a[b] + 1,a), [])});

        return map;
    };

}
