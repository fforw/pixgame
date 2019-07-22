import SimplexNoise from "simplex-noise"
import Prando from "prando"
import now from "performance-now"
import flood from "./flood";
import marchingSquares from "./util/marchingSquares";
import simplify, { perpendicularDistance } from "./util/simplify";
import Delaunay from "./Delaunay";


const TAU = Math.PI * 2;

const N1 = 0.4;
const N2 = 1.4;
const N3 = 20;
const N4 = 5;

const RELATIVE_CITY_RADIUS = 0.034;
const MIN_CITY_RATING = 2000;


function clamp(v)
{
    return v < -1 ? -1 : v > 1 ? 1 : v;
}


const WATER_LINE = 0.05;
const BEACH_LINE = 0.07;
const WOODS_LINE = 0.09;
const MOUNTAIN_LINE = 0.5;

// tiles
export const DARK = 0;
export const WATER = 1;
export const SAND = 2;
export const GRASS = 3;
export const DIRT = 4;
export const ROCK = 5;
export const WOODS = 6;
export const WOODS2 = 7;
export const RIVER = 8;
export const ICE = 9;
export const ICE2 = 10;

// things
export const EMPTY = 1;
export const PLANT = 2;
export const PLANT_2 = 3;
export const PLANT_3 = 4;
export const DOT = 5;
export const _RIVER = 6;
export const _WOODS = 7;
export const BLOCKED = 8;   // non-walkable from here on
export const _WATER = 9;
export const LARGE_TREE = 10;
export const LARGE_TREE_2 = 11;
export const SMALL_TREE = 12;
export const SMALL_TREE_2 = 13;
export const SMALL_TREE_3 = 14;
export const BOULDER = 15;
export const BOULDER_2 = 16;
export const BOULDER_3 = 17;
export const HOUSE = 18;


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
    "DARK",
    "WATER",
    "SAND",
    "GRASS",
    "DIRT",
    "ROCK",
    "WOODS",
    "WOODS2",
    "RIVER"
];


const tileVillageRating = [
    0,  // DARK
    0,  // WATER
    0.5,  // SAND
    1,  // GRASS
    1,  // DIRT
    -2,  // ROCK
    1,  // WOODS
    1,  // WOODS2
    0,  // RIVER
];


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
    [WATER]: [_WATER, 1],
    [SAND]: [0, 500, BOULDER, 1, BOULDER_3, 1, BOULDER_2, 1],
    [GRASS]: [
        0,
        1000,
        LARGE_TREE,
        2,
        LARGE_TREE_2,
        2,
        SMALL_TREE,
        3,
        SMALL_TREE_3,
        3,
        BOULDER,
        1,
        BOULDER_3,
        1,
        BOULDER_2,
        2
    ],
    [DIRT]: [
        0,
        1000,
        LARGE_TREE,
        2,
        LARGE_TREE_2,
        2,
        SMALL_TREE,
        3,
        SMALL_TREE_3,
        3,
        BOULDER,
        1,
        BOULDER_3,
        1,
        BOULDER_2,
        2
    ],
    [ROCK]: [BLOCKED, 4, BOULDER, 1, BOULDER_3, 1, BOULDER_2, 1],
    [WOODS]: [
        _WOODS,
        150,
        LARGE_TREE,
        2,
        LARGE_TREE_2,
        2,
        SMALL_TREE,
        5,
        SMALL_TREE_2,
        5,
        SMALL_TREE_3,
        5,
        PLANT,
        1,
        PLANT_2,
        1,
        PLANT_3,
        1,
        BOULDER,
        1,
        BOULDER_3,
        1,
        BOULDER_2,
        2
    ],
    [WOODS2]: [
        _WOODS,
        40,
        LARGE_TREE,
        2,
        LARGE_TREE_2,
        2,
        SMALL_TREE,
        5,
        SMALL_TREE_2,
        5,
        SMALL_TREE_3,
        5,
        PLANT,
        1,
        PLANT_2,
        1,
        PLANT_3,
        1,
        BOULDER,
        1,
        BOULDER_3,
        1,
        BOULDER_2,
        2
    ],
    [RIVER]: [_RIVER, 1]
});

function spawn(map, spawns)
{
    if (spawns.length < 4)
    {
        return spawns[0];
    }

    let value = map.random.next();
    let pos = 1;
    do
    {
        value -= spawns[pos];
        pos += 2
    } while (value > 0 && pos < spawns.length);

    return spawns[pos - 3];
}


function spawnForBlock(map, mapOffset, tile)
{
    const {things, size, sizeMask} = map;

    if (things[mapOffset] !== 0)
    {
        //console.log("Skip spawning on ", things[mapOffset]);
        return;
    }

    const spawns = spawnTable[tile];
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
            else if (thing === BOULDER || thing === BOULDER_3)
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


const nCoords = [0,0]
function determineTile(map, x, y, climate)
{
    const coords = map.heightCoords(x, y);
    const n = map.heightFn(x, y, coords, nCoords);

    climate = clamp(climate - n * 0.96 + nCoords[1] * 0.2);


    let result;
    if (n < WATER_LINE)
    {
        result = WATER;
    }
    else if (n < BEACH_LINE)
    {
        result = SAND;
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
                result = WOODS;
            }
            else
            {
                result = WOODS2;
            }

        }
        else
        {
            if (n4 < 0)
            {
                result = GRASS;
            }
            else
            {
                result = DIRT;
            }
        }
    }
    else
    {
        result = ROCK;
    }

    if (climate < 0.4)
    {
        if (result === WATER)
        {
            return ICE2;
        }
        else if (result === WOODS2|| result === GRASS || result === DIRT || result === SAND )
        {
            return ICE;
        }

        if (result === WOODS )
        {
            return ROCK;
        }
    }
    else if (climate > 0.95)
    {
        if (result === WOODS || result === WOODS2 || result === GRASS || result === DIRT )
        {
            return SAND;
        }
    }

    return result
}


function createBase(size, seed, updateProgress, percent)
{
    const map = new WorldMap(size, seed);

    const {tiles} = map;

    let mapOffset = 0;

    const report = (size / 20)|0


    const climateStep = TAU / 2 / size;
    let ca = 0;
    for (let y = 0; y < size; y++)
    {
        const climate = Math.sin(ca);

        ca += climateStep;

        for (let x = 0; x < size; x++)
        {
            const tile = determineTile(map, x, y, climate);
            tiles[mapOffset] = tile;
            spawnForBlock(map, mapOffset, tile);

            mapOffset++;
        }

        if (updateProgress && (y % report) === 0)
        {
            updateProgress(percent * y / size);
        }
    }
    return map;
}


function randomProbes(map)
{
    const probes = [];

    const {size} = map;

    const probeCount = size * size / 1000;

    //console.log("Probe count =", probeCount);

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

    const {size} = map;

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
                    points: [],
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

    //console.log(probes.length, "random probes");

    const {size} = map;

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
    //console.log("Stopped climbing after ", i, " iterations: " + filtered.length + " springs");

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

    const {size} = map;

    for (let i = 0; i < directions.length; i += 2)
    {
        const x = probe.x + directions[i];
        const y = probe.y + directions[i + 1];

        if (x > 0 && y > 0 && x < size && y < size)
        {
            let tile = map.read(x, y);
            if (tile !== RIVER)
            {
                if (tile === ROCK)
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

                const value = map.heightFn(x, y) - (tile !== SAND && tile === probe.tile ? 0.001 : 0);
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
        const dir = map.random.nextInt(0, 3) * 2;
        probe.x += directions[dir];
        probe.y += directions[dir + 1];
        probe.tile = map.read(probe.x, probe.y);
    }
    else
    {
        const n = map.random.next();
        if (n < 0.25)
        {
            const dir = ((currentDirection / 2 + (n < 0.125 ? -1 : 1)) & 3) * 2;

            probe.x += directions[dir];
            probe.y += directions[dir + 1];

            probe.points.push(probe.x, probe.y);

            probe.x += directions[dir];
            probe.y += directions[dir + 1];
            probe.value = 1;
            probe.tile = map.read(probe.x, probe.y);
        }
        else
        {
            probe.x = currentX;
            probe.y = currentY;
            probe.value = currentLow;
            probe.tile = currentTile;

        }
    }
}


function findMean(springs)
{
    const last = springs.length - 1;
    const mid = last / 2;
    if (mid % 1)
    {
        return springs[(mid | 0)].points.length + springs[(mid | 0) + 1].points.length / 2;
    }
    else
    {
        return springs[(mid | 0)].points.length;
    }
}


/**
 * Filters only the springs that are at least twice the spring mean length.
 *
 * @param springs   springs
 * @return {*}
 */
function findLongRivers(map, springs)
{
    // we are roughly sorted, but not perfectly
    springs.sort((a, b) => a.points.length - b.points.length);

    const last = springs.length - 1;

    const mean = findMean(springs);
    const longRivers = springs.filter(s => s.points.length > mean * 2);

    //console.log("Min spring length", springs[0].points.length);
    //console.log("Mean spring length", mean);
    //console.log("Max spring length", springs[last].points.length);

    //console.log(longRivers);

    return longRivers

}


function getRiverWidth(index)
{
    return Math.min(8, index * 0.008) | 0;
}


function drawRivers(map)
{
    const springs = createSprings(map);

    const {size} = map;

    const length = springs.length;
    let flowingStart = 0, i = 0;
    for (i = 0; i < size && flowingStart < length; i++)
    {
        //console.log("Flowing " + (length - flowingStart))
        for (let j = flowingStart; j < length; j++)
        {
            const probe = springs[j];

            const {x, y} = probe;
            probe.points.push(x, y);

            const currentTile = map.read(probe.x, probe.y);
            if (currentTile === WATER || currentTile === ICE || currentTile === ICE2)
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
    //console.log("Stopped flowing after ", i, " iterations");

    for (let i = 0; i < springs.length; i++)
    {
        const {points} = springs[i];

        for (let j = 0; j < points.length; j += 2)
        {
            const width = getRiverWidth(j);
            flood(map, points[j], points[j + 1], width);
        }
    }

    return springs;
}


function findNonRiverTile(map, x, y)
{
    let minDistance = Infinity;
    let px, py, mdx, mdy;
    for (let i = 0; i < directions.length; i += 2)
    {
        const dx = directions[i];
        const dy = directions[i + 1];

        // if (map.read(x, y) !== RIVER)
        // {
        //     throw new Error("coord not in river")
        // }

        let distance = 1;
        let currX = x + dx;
        let currY = y + dy;
        while (map.read(currX, currY) === RIVER)
        {
            distance++;
            currX += dx;
            currY += dy;
        }

        if (distance < minDistance)
        {
            minDistance = distance;
            px = currX;
            py = currY;
            mdx = dx;
            mdy = dy;

        }
    }

    //console.log("findNonRiverTile: min = ", minDistance, ", direction = ", mdx, mdy)

    return {
        px,
        py
    }
}


function planCities(map, rivers)
{
    const longRivers = findLongRivers(map, rivers)
        .filter(
            (spring, idx) => {
                const {points} = spring;

                const len = points.length;
                const radius = (len * RELATIVE_CITY_RADIUS) | 0;

                const mouthX = points[len - 2];
                const mouthY = points[len - 1];

                let i;
                for (i = len - 4; i > 0; i -= 2)
                {
                    let x = points[i] - mouthX;
                    let y = points[i + 1] - mouthY;

                    const dist = Math.sqrt(x * x + y * y);

                    if (dist > radius)
                    {
                        //console.log("reached radius");
                        break;
                    }
                }

                const {px, py} = findNonRiverTile(map, points[i], points[i + 1]);

                const radiusSquared = radius * radius;
                let sum = 0;
                for (let y = -radius; y < radius; y++)
                {
                    const xDelta = (Math.sqrt(radiusSquared - y * y)) | 0;

                    for (let x = -xDelta; x < xDelta; x++)
                    {
                        sum += tileVillageRating[map.read(px + x, py + y)];
                    }
                }

                spring.centerX = (px & map.sizeMask);
                spring.centerY = (py & map.sizeMask);
                spring.radius = radius;

                const isLong = sum > MIN_CITY_RATING;

                //console.log("RATING" + idx, sum);

                return isLong;

            });

    for (let j = 0; j < longRivers.length; j++)
    {
        const {centerX, centerY, radius} = longRivers[j];

        const radiusSquared = radius * radius;
        for (let y = -radius; y <= radius; y++)
        {
            const xDelta = Math.round(Math.sqrt(radiusSquared - y * y));

            map.putThing(centerX + xDelta, centerY + y, DOT);
            map.putThing(centerX - xDelta, centerY + y, DOT);
        }

        //map.write(centerX, centerY, MARKER)
    }

    return longRivers;
}


function flatten(arrayOfArrays)
{
    let out = [];
    for (let i = 0; i < arrayOfArrays.length; i++)
    {
        out = out.concat(arrayOfArrays[i]);
    }
    return out;
}

/**
 * Returns true if the given point x,y is inside the potentially convex polygon given as array of points.
 *
 * @param {Number} x    x-coordinate of point
 * @param {Number} y    y-coordinate of point
 * @param {Array<Number>} poly      Array of polygon points in pairs ( [x0,y0,x1,y1,...,xN,yN] )
 * @return {boolean} true if point is in polygon
 */
export function isPointInPolygon(x, y, poly)
{
    const { length } = poly;

    let prevX = poly[ length - 2];
    let prevY = poly[ length - 1];
    let inPolygon = false;
    for (let i = 0; i < length; i += 2)
    {
        const currX = poly[i];
        const currY = poly[i + 1];
        if (
            currY > y !== prevY > y &&
            x < currX + (prevX - currX) * (y - currY) / (prevY - currY)
        )
        {
            inPolygon = !inPolygon
        }
        prevX = currX;
        prevY = currY;
    }
    return inPolygon;
}


/**
 * Filters the given triangles so only triangles where the majority of rasterized map point are walkable remain.
 *
 * @param {WorldMap} map    map
 * @param {Array<number>} vertices
 * @param {Array<number>} triangles
 * @return {Array<number>} walkable triangles
 */
function filterWalkable(map, vertices, triangles)
{
    return triangles;
}


const SIMPLIFICATION_EPSILON = 2.5;


function planRoads(map, cities)
{
    const polygons = marchingSquares(map.things, map.size, map.size, t => t >= BLOCKED, true);

    console.log("MARCHING-CUBE: polygons = ", polygons.length, ", vertexes = ", polygons.reduce((count, array) => count + array.length, 0));

    const simplified = polygons.map(p => simplify(p, SIMPLIFICATION_EPSILON, true)).filter(p => p.length > 6);

    console.log("SIMPLIFIED: polygons = ", simplified.length, ", vertexes = ", simplified.reduce((count, array) => count + array.length, 0));

    const vertices = flatten(simplified);
    const triangles = Delaunay.triangulate(vertices);

    console.log("DELAUNAY: triangles", triangles.length / 3, ", vertexes = ", triangles.length);

    const walkable = filterWalkable(map, vertices, triangles);

    console.log("WALKABLE: triangles", walkable.length / 3, ", vertexes = ", walkable.length);

    map.vertices = vertices;
    map.polygons = simplified;
    map.triangles = walkable;
}


export default class WorldMap {
    constructor(size = 800, seed, tiles, things)
    {
        const lg = Math.log(size) / Math.log(2);
        if ((lg % 1) !== 0)
        {
            throw new Error("Size must be power of two: " + size);
        }

        //console.log("New map " + size + " x " + size + ", seed = " + seed);

        this.random = new Prando(seed);
        this.noise = new SimplexNoise(() => this.random.next());
        this.size = size;

        this.sizeMask = size - 1;
        this.fineMask = (size << 4) - 1;

        this.factor = 1 / size;
        this.tiles = tiles || new Uint8Array(size * size);
        this.things = things || new Uint8Array(size * size);
    }


    read(x, y)
    {
        return this.tiles[(y & this.sizeMask) * this.size + (x & this.sizeMask)];
    }


    getThing(x, y)
    {
        return this.things[(y & this.sizeMask) * this.size + (x & this.sizeMask)];
    }


    write(x, y, tile)
    {
        this.tiles[(y & this.sizeMask) * this.size + (x & this.sizeMask)] = tile;
    }


    putThing(x, y, thing)
    {
        this.things[(y & this.sizeMask) * this.size + (x & this.sizeMask)] = thing;
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
     * @param nCoords               array receiving n0 and n1
     *
     * @return {number} height between -1 and 1 inclusive
     */
    heightFn(x, y, coords, nCoords = null)
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

        if (nCoords)
        {
            nCoords[0] = n0;
            nCoords[1] = n1;
        }

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
        const {size} = this;

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
                        data[dataOffset++] = 128;
                        data[dataOffset++] = 128;
                        data[dataOffset++] = 255;
                        data[dataOffset++] = 255;
                        break;
                    case WATER:
                        data[dataOffset++] = 0;
                        data[dataOffset++] = 32;
                        data[dataOffset++] = 128;
                        data[dataOffset++] = 255;
                        break;
                    case SAND:
                        data[dataOffset++] = 192;
                        data[dataOffset++] = 160;
                        data[dataOffset++] = 0;
                        data[dataOffset++] = 255;
                        break;
                    case GRASS:
                        data[dataOffset++] = 0;
                        data[dataOffset++] = 128;
                        data[dataOffset++] = 0;
                        data[dataOffset++] = 255;
                        break;
                    case WOODS:
                        data[dataOffset++] = 0;
                        data[dataOffset++] = 108;
                        data[dataOffset++] = 16;
                        data[dataOffset++] = 255;
                        break;
                    case WOODS2:
                        data[dataOffset++] = 0;
                        data[dataOffset++] = 64;
                        data[dataOffset++] = 32;
                        data[dataOffset++] = 255;
                        break;
                    case DIRT:
                        data[dataOffset++] = 64;
                        data[dataOffset++] = 64;
                        data[dataOffset++] = 0;
                        data[dataOffset++] = 255;
                        break;
                    case ROCK:
                        data[dataOffset++] = 100;
                        data[dataOffset++] = 100;
                        data[dataOffset++] = 100;
                        data[dataOffset++] = 255;
                        break;
                    case ICE:
                        data[dataOffset++] = 248;
                        data[dataOffset++] = 248;
                        data[dataOffset++] = 255;
                        data[dataOffset++] = 255;
                        break;
                    case ICE2:
                        data[dataOffset++] = 220;
                        data[dataOffset++] = 220;
                        data[dataOffset++] = 255;
                        data[dataOffset++] = 255;
                        break;
                }
            }
        }

        return imageData;

    }


    noise4D(x, y, z, w)
    {
        return this.noise.noise4D(x, y, z, w);

    }

    serialize()
    {
        return {
            "_": "Map serialization",

            size: this.size,
            seed: this.random._seed,
            tiles: this.tiles,
            things: this.things
        }
    }

    static deserialize(obj)
    {
        //console.log("DESERIALIZE", obj);
        const {size, seed, things, tiles} = obj;


        return new WorldMap(
            size,
            seed,
            tiles,
            things
        );
    }

    static generate(size, seed = new Date().getTime(), updateProgress)
    {

        const start = now();
        const map = createBase(size, seed, updateProgress, 0.75);
        const afterBase = now();
        const rivers = drawRivers(map);
        const afterRivers = now();
        updateProgress && updateProgress(0.87);
        const cities = planCities(map, rivers);
        const afterCities = now();

        planRoads(map, cities);
        updateProgress && updateProgress(1);

        const end = now();
        console.log(`Base in ${afterBase - start}ms`);
        console.log(`Rivers in ${afterRivers - start}ms`);
        console.log(`Cities in ${afterCities - start}ms`);
        console.log(`Roads in ${end - start}ms`);

        //console.log({ thingStats : map.things.reduce((a,b) =>(a[b] = a[b] === undefined ? 1: a[b] + 1,a), [])});

        return map;
    };

}
