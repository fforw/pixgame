import SimplexNoise from "simplex-noise"
import Prando from "prando"
import now from "performance-now"
import flood from "./flood";
import marchingSquares from "./util/marchingSquares";
import simplify from "./util/simplify";
import Delaunay from "./util/Delaunay";
import { linesCross } from "./util/intersection";

import RTree from "rtree"
import {
    _ICE,
    _RIVER,
    _SAND,
    _WATER,
    _WOODS,
    BLOCKED,
    BOULDER,
    BOULDER_2,
    BOULDER_3,
    CASTLE_CORNER,
    CASTLE_CORNER2,
    CASTLE_GATE,
    CASTLE_RIVER, CASTLE_VERTICAL,
    CASTLE_WALL,
    DARK,
    DIRT,
    EMPTY,
    GRASS, HOUSE1, HOUSE3,
    ICE,
    ICE2,
    LARGE_TREE,
    LARGE_TREE_2,
    PLANT,
    PLANT_2,
    PLANT_3,
    RIVER,
    ROCK,
    SAND,
    SMALL_TREE,
    SMALL_TREE_2,
    SMALL_TREE_3,
    thingWalkability,
    tileNames,
    tileVillageRating,
    WATER,
    WOOD,
    WOODS,
    WOODS2
} from "./tilemap-config";
import Sensor, { SensorMode, SensorPlaceholder } from "./sensor";
import drawCityWalls from "./util/drawCityWalls";


export const TAU = Math.PI * 2;

const N1 = 0.4;
const N2 = 1.7;
const N3 = 20;
const N4 = 5;

const RELATIVE_CITY_SIZE = 0.2;
const MIN_CITY_RATING = 700;


function clamp(v)
{
    return v < -1 ? -1 : v > 1 ? 1 : v;
}

const SERIALIZED_MAP = "Map serialization";

const WATER_LINE = 0.05;
const BEACH_LINE = 0.07;
const WOODS_LINE = 0.09;
const MOUNTAIN_LINE = 0.5;


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
    [SAND]: [_SAND, 750, BOULDER, 1, BOULDER_3, 1, BOULDER_2, 1],
    [GRASS]: [
        0,
        2000,
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
        200,
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
        70,
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
    [RIVER]: [_RIVER, 1],
    [ICE]: [_ICE, 1],
    [ICE2]: [_ICE, 1]
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
    const {things, sizeBits } = map;

    const worldMask = (1 << (sizeBits + sizeBits)) - 1;

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

                const prev3Offset = (mapOffset - 3) & worldMask;
                const prev2Offset = (mapOffset - 2) & worldMask;
                const prevOffset = (mapOffset - 1) & worldMask;
                const nextOffset = (mapOffset + 1) & worldMask;
                const next2Offset = (mapOffset + 2) & worldMask;
                const next3Offset = (mapOffset + 3) & worldMask;

                if (
                    things[prev3Offset] !== BLOCKED && things[prev3Offset] !== EMPTY &&
                    things[prev2Offset] !== BLOCKED && things[prev2Offset] !== EMPTY &&
                    things[prevOffset] !== BLOCKED  && things[prevOffset] !== EMPTY
                )
                {

                    things[mapOffset] = thing;
                    things[prevOffset] = BLOCKED;
                    things[nextOffset] = BLOCKED;
                    things[next2Offset] = EMPTY;
                    things[next3Offset] = EMPTY;

                    //console.log("Block for large tree", mapOffset)
                }
            }
            else if (thing === BOULDER || thing === BOULDER_3)
            {
                const prevOffset = (mapOffset - 1) & worldMask;
                const nextOffset = (mapOffset + 1) & worldMask;

                //baseTile === ROCK && console.log("isLargeBoulder", things[prevOffset], things[mapOffset], things[nextOffset])

                if (
                    things[prevOffset] !== BLOCKED && things[prevOffset] !== EMPTY
                )
                {

                    things[mapOffset] = thing;
                    things[nextOffset] = BLOCKED;
                    //console.log("Block for large boulder", mapOffset)
                }
            }
            else if (thing === SMALL_TREE || thing === SMALL_TREE_2 || thing === SMALL_TREE_3)
            {
                const nextOffset = (mapOffset + 1) & worldMask;

                things[mapOffset] = thing;
                things[nextOffset] = EMPTY;
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

    climate = clamp(climate - n * 0.96 + nCoords[1] * 0.2 + map.random.next() * 0.004 );


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

    const report = (size / 20)|0;


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

    const {size, sizeBits} = map;

    const probeCount = (1 << (sizeBits + sizeBits)) / 1000;

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
    -1, 0,
    0, -1,
    1, 0,
    0, 1,
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


function jitter(map, filtered, amount = 7)
{
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
                    x: (probe.x - xOff) | 0,
                    y: (probe.y - yOff) | 0
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


function mergeOverlapping(longRivers)
{
    let length = longRivers.length;
    for (let i = 0; i < length; i++)
    {
        const {centerX, centerY, points, radius} = longRivers[i];

        for (let j = length - 1; j > i; j--)
        {
            const {centerX : centerX2, centerY: centerY2, radius : radius2} = longRivers[j];

            const r = Math.max(radius, radius2);

            const dx = centerX2 - centerX;
            const dy = centerY2 - centerY;

            if (dx * dx + dy * dy < r * r)
            {
                const newRadius = Math.sqrt(radius * radius + radius2 * radius2);
                longRivers[i].radius = newRadius;

                const index = findPosition(points, newRadius);

                longRivers[i].centerX = points[index];
                longRivers[i].centerY = points[index + 1];


                for (let k= j + 1; k < length; k++)
                {
                    longRivers[k - 1] = longRivers[k];
                }
                length--;
                j++;
            }
        }

    }

    return longRivers.slice(0, length);
}


function findPosition(points, radius)
{
    const length = points.length;

    const mouthX = points[length - 2];
    const mouthY = points[length - 1];

    let i;
    for (i = length - 4; i > 0; i -= 2)
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
    return i;
}

// outer circle radius factor
const  SIZE_TO_RADIUS = 0.5 * Math.sqrt(2);


function fillThings(map, sx, sy, w, h, thing)
{
    for ( let y = 0; y < h; y++)
    {
        for ( let x = 0; x < w; x++)
        {
            map.putThing(sx + x, sy + y, thing);
        }
    }
}

function fillTilesFn(map, sx, sy, w, h, tileFn)
{
    const { size, sizeBits } = map;

    //console.log("fillTilesFn", {sx, sy, w, h});

    let line = sy << sizeBits;
    for ( let y = 0; y < h; y++)
    {
        for ( let x = 0; x < w; x++)
        {
            const off = line + sx + x;
            const result = tileFn( map.tiles[off] );

            //console.log("tileFn(" , tileNames[map.tiles[off]] , ") => " + tileNames[result]);

            map.tiles[off] = result;
        }
        line +=  size;
    }
}

function getWallThings(map, sx, sy, size)
{

    const elementSize = size / 5 + 1;

    //console.log("getWallThings", sx, sy, size, "elementSize = ", elementSize);

    const things = new Array(elementSize);

    const gateIndex = map.random.nextInt(1, elementSize - 2);

    //console.log({gateIndex});

    things[0] = map.random.next() < 0.5 ? CASTLE_CORNER : CASTLE_CORNER2;
    things[elementSize - 1] = map.random.next() < 0.5 ? CASTLE_CORNER : CASTLE_CORNER2;
    things.fill(CASTLE_WALL, 1, elementSize - 1);

    things[gateIndex] = CASTLE_GATE;


    for (let x = 1; x < elementSize - 1; x++)
    {
        if (x !== gateIndex)
        {
            for (let i = 0; i < 5; i++)
            {
                if (map.read(sx + x * 5 + i, sy) === RIVER)
                {
                    console.log("Set ", x, "TO CASTLE_RIVER")
                    things[x] = CASTLE_RIVER;
                    break;
                }
            }
        }
    }

    const coverRiver = t => (t === RIVER ? WOOD : (t === GRASS || t === WOODS || t === WOODS2) ? DIRT : t);

    fillTilesFn(map, sx, sy - 4, size, 8, coverRiver);

    //console.log( things.map( t => thingNames[t]));

    return things;
}




function setupCityTiles(map, city)
{
    const { centerX, centerY, size } = city;

    const px = centerX - (size >> 1);
    const py = centerY - (size >> 1);

    fillThings(map,px - 8, py - 8, size + 16, size + 16, 0);

    const width = size;
    const height = size & ~1;

    const topWall = getWallThings(map, px, py, width);
    const bottomWall = getWallThings(map, px, py + height - 1, width);

    city.topWall = topWall;
    city.bottomWall = bottomWall;

    drawCityWalls(map, px, py, topWall, bottomWall, size);

    fillThings(map, px + 1, py + 1, width - 2, height - 2, BLOCKED)

    let flag = false;
    for (let y = 8 ; y < height - 4; y += 3)
    {
        const house = map.random.nextInt(HOUSE1, HOUSE3);

        let x;
        if (flag)
        {
            x = 10;
            do
            {
                map.putThing(px + x, py + y, house);
                x += 15;
            } while (x  < width - 6);
        }
        else
        {
            x = width - 6;
            do
            {
                map.putThing(px + x, py + y, house);
                x -= 15;
            } while (x  > 10);
        }
        flag = !flag;
    }

}


function planCities(map, rivers)
{
    let cities = findLongRivers(map, rivers)
        .filter(
            (spring, idx) => {
                const {points} = spring;

                const length = points.length;

                const mouthX = points[length - 2];
                const mouthY = points[length - 1];
                const dx = points[0] - mouthX;
                const dy = points[1] - mouthY;

                const len = Math.sqrt(dx*dx+dy*dy);

                const size = Math.round((len * RELATIVE_CITY_SIZE) / 5) * 5;
                const radius = (SIZE_TO_RADIUS * size)|0;

                const index = findPosition(points, radius * 3);

                const px = points[index];
                const py = points[index + 1];

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
                spring.size = size;

                const limit = MIN_CITY_RATING ;
                const isLong = sum > limit;

                console.log("RATING" + idx, sum);

                return isLong;

            });


    cities = mergeOverlapping(cities);

    for (let j = 0; j < cities.length; j++)
    {
        setupCityTiles(map, cities[j]);
    }

    return cities;
}


export function flatten(arrayOfArrays)
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
 * @param {Uint8Array} mask
 * @return {Array<number>} walkable triangles
 */
function filterWalkable(map, vertices, triangles, mask)
{
    const walkable = [];

    const { sizeBits } = map;

    for (let i = 0; i < triangles.length; i += 3)
    {
        const offsetA = triangles[i];
        const offsetB = triangles[i + 1];
        const offsetC = triangles[i + 2];

        const x0 = vertices[offsetA];
        const y0 = vertices[offsetA + 1];
        const x1 = vertices[offsetB];
        const y1 = vertices[offsetB + 1];
        const x2 = vertices[offsetC];
        const y2 = vertices[offsetC + 1];

        const cx = ((x0 + x1 + x2) / 3)|0;
        const cy = ((y0 + y1 + y2) / 3)|0;

        if (mask[(cy  << sizeBits) + cx])
        {
            walkable.push(offsetA, offsetB, offsetC);
        }
    }

    return walkable;
}


const SIMPLIFICATION_EPSILON = 2.5;


/**
 * Creates a flat array containing minX,maxX,minY,maxY of all our simplified polygons.
 * 
 * @param {Array<Array<Number>>} polygons   array of point arrays
 * @return {Array<Number>} min/max values in groups of four
 */
export function polyMinMax(polygons)
{
    const minMax = new Array(polygons.length * 4);

    let off = 0;
    for (let i = 0; i < polygons.length; i++)
    {
        const polygon = polygons[i];

        let minX = polygon[0];
        let maxX = minX;
        let minY = polygon[1];
        let maxY = minY;

        for (let i = 2; i < polygon.length; i += 2 )
        {
            const x = polygon[i];
            const y = polygon[i + 1];

            if (x < minX)
            {
                minX = x;
            }
            else if (x > maxX)
            {
                maxX = x;
            }
            
            if (y < minY)
            {
                minY = y;
            }
            else if (y > maxY)
            {
                maxY = y;
            }
        }

        minMax[off++] = minX;
        minMax[off++] = maxX;
        minMax[off++] = minY;
        minMax[off++] = maxY;
    }

    return minMax;
}

const xCoords = new Array(256);

export function xOrFillPolygon(mask, polygon, sizeBits, minMax, minMaxOff)
{
    const minY = minMax[minMaxOff];
    const maxY = minMax[minMaxOff + 1];

    const size = 1 << sizeBits;
    let line = ((minY)|0) << sizeBits;
    for( let y = minY; y <= maxY; y++)
    {
        const { length } = polygon;

        let prevX = polygon[ length - 2];
        let prevY = polygon[ length - 1];

        let count = 0;
        for (let i = 0; i < length; i += 2)
        {
            const currX = polygon[i];
            const currY = polygon[i + 1];
            if (currY > y !== prevY > y)
            {
                const x = currX + (prevX - currX) * (y - currY) / (prevY - currY);

                // Insert sort intersection X into sorted points
                let inserted = false;
                for (let j = 0; j < count; j++)
                {
                    if (x < xCoords[j])
                    {
                        for (let k = count; k > j; k--)
                        {
                            xCoords[k] = xCoords[k - 1];
                        }
                        count++;
                        xCoords[j] = x;
                        inserted = true;
                        break;
                    }
                }
                if (!inserted)
                {
                    xCoords[count++] = x;
                }

            }
            prevX = currX;
            prevY = currY;
        }

        //console.log("SORTED", xCoords.slice(0, count))

        if (count > 0)
        {
            let inPolygon = true;
            prevX = xCoords[0] | 0;
            for (let i = 1; i < count; i++)
            {
                const currX = xCoords[i] | 0;
                if (inPolygon)
                {
                    for (let x = prevX; x <= currX; x++)
                    {
                        mask[line + x ] ^= 1;
                    }
                }
                prevX = currX;
                inPolygon = !inPolygon;
            }
        }

        line += size;
    }
}


/**
 * Creates a binary mask for the given array of n-sided polygons.
 *
 * @param polygons
 * @param sizeBits
 * @param minMax
 * @return {Uint8Array}
 */
function createMask(polygons, sizeBits, minMax)
{
    const mask = new Uint8Array(1 << (sizeBits + sizeBits));


    for (let i = 0; i < polygons.length; i++)
    {
        const polygon = polygons[i];
        xOrFillPolygon(mask, polygon, sizeBits, minMax, i * 4 + 2);
    }
    return mask;
}




const otherTriResult = [0,0]

/**
 * "Flips" all triangles for which an edge crosses the original n-sided polygon edge.
 *
 * Flipping takes the two triangles with that edge and creates two new triangles eliminating
 * the erroneous edge and replacing it with the crossing edge.
 *
 * @param vertices      flat vertices
 * @param triangles     triangles
 * @param polygons      array of original polygons
 * @param minMax        minMax for polygons (minX,maxX,minY,maxY, ...)
 */
function flipWronglyTriangulated(vertices, triangles, polygons, minMax)
{
    for (let i = 0; i < triangles.length; i += 3)
    {
        const offsetA = triangles[i];
        const offsetB = triangles[i + 1];
        const offsetC = triangles[i + 2];

        const x0 = vertices[offsetA];
        const y0 = vertices[offsetA + 1];
        const x1 = vertices[offsetB];
        const y1 = vertices[offsetB + 1];
        const x2 = vertices[offsetC];
        const y2 = vertices[offsetC + 1];

        let minMaxOff = 0;
        for (let j = 0; j < polygons.length; j++)
        {
            const polygon = polygons[j];

            const minX = minMax[minMaxOff];
            const maxX = minMax[minMaxOff + 1];
            const minY = minMax[minMaxOff + 2];
            const maxY = minMax[minMaxOff + 3];


            // check collision n-gon bounding box
            const inBoundingBox = (x0 >= minX && x0 <= maxX && y0 >= minY && y0 <= maxY) ||
                      (x1 >= minX && x1 <= maxX && y1 >= minY && y1 <= maxY) ||
                      (x2 >= minX && x2 <= maxX && y2 >= minY && y2 <= maxY);
            if (
                inBoundingBox
            )
            {
                let prevX = polygon[polygon.length - 2];
                let prevY = polygon[polygon.length - 1];

                for (let k = 0; k < polygon.length; k += 2)
                {
                    const currX = polygon[k];
                    const currY = polygon[k + 1];

                    let flipAOffset = -1;
                    let flipBOffset = -1;
                    let nonFlipOffset = -1;

                    if (linesCross(prevX, prevY, currX, currY, x0, y0, x1, y1))
                    {
                        flipAOffset = offsetA;
                        flipBOffset = offsetB;
                        nonFlipOffset = offsetC;
                    }
                    else if (linesCross(prevX, prevY, currX, currY, x0, y0, x2, y2))
                    {
                        flipAOffset = offsetA;
                        flipBOffset = offsetC;
                        nonFlipOffset = offsetB;

                    }
                    else if (linesCross(prevX, prevY, currX, currY, x1, y1, x2, y2))
                    {
                        flipAOffset = offsetB;
                        flipBOffset = offsetC;
                        nonFlipOffset = offsetA;
                    }

                    if (flipAOffset >= 0)
                    {
                        let triOff = -1, otherNonFlipOffset;
                        for (let l = 0; l < triangles.length; l += 3)
                        {
                            if (i !== l)
                            {
                                const offsetA = triangles[l];
                                const offsetB = triangles[l + 1];
                                const offsetC = triangles[l + 2];

                                const fAA = flipAOffset === offsetA;
                                const fAB = flipAOffset === offsetB;
                                const fAC = flipAOffset === offsetC;

                                const fBA = flipBOffset === offsetA;
                                const fBB = flipBOffset === offsetB;
                                const fBC = flipBOffset === offsetC;

                                if (fAA && fBB || fBA && fAB)
                                {
                                    triOff = l;
                                    otherNonFlipOffset = offsetC;
                                    break;
                                }
                                else if (fAA && fBC || fBA && fAC)
                                {
                                    triOff = l;
                                    otherNonFlipOffset = offsetB;
                                    break;
                                }
                                else if (fAB && fBC || fBB && fAC)
                                {
                                    triOff = l;
                                    otherNonFlipOffset = offsetA;
                                    break;
                                }
                            }
                        }

                        if (triOff >= 0)
                        {
                            triangles[i] = nonFlipOffset;
                            triangles[i + 1] = otherNonFlipOffset;
                            triangles[i + 2] = flipAOffset;

                            triangles[triOff] = nonFlipOffset;
                            triangles[triOff + 1] = otherNonFlipOffset;
                            triangles[triOff + 2] = flipBOffset;
                        }
                    }

                    prevX = currX;
                    prevY = currY;
                }
                    
            }

            minMaxOff += 4;
        }
    }
}


/**
 * Returns true if the given point is wihtin the given triangle.
 *
 * @param {Number} ax   x-coordinate A
 * @param {Number} ay   y-coordinate A
 * @param {Number} bx   x-coordinate B
 * @param {Number} by   y-coordinate B
 * @param {Number} cx   x-coordinate C
 * @param {Number} cy   y-coordinate C
 * @param {Number} px   x-coordinate of point
 * @param {Number} py   y-coordinate of point
 *
 * @return {boolean} true if point in triangle
 */
export function isPointInTriangle(ax, ay, bx, by, cx, cy, px, py)
{
    const v0x = cx - ax;
    const v0y = cy - ay;
    const v1x = bx - ax;
    const v1y = by - ay;
    const v2x = px - ax;
    const v2y = py - ay;

    const dot00 = v0x * v0x + v0y * v0y;
    const dot01 = v0x * v1x + v0y * v1y;
    const dot02 = v0x * v2x + v0y * v2y;
    const dot11 = v1x * v1x + v1y * v1y;
    const dot12 = v1x * v2x + v1y * v2y;

    const denom = (dot00 * dot11 - dot01 * dot01);

    // collinear or singular triangle
    if ( denom === 0 ) {
        return false;
    }

    const invDenom = 1 / denom;
    const u = (dot11 * dot02 - dot01 * dot12) * invDenom;
    const v = (dot00 * dot12 - dot01 * dot02) * invDenom;

    return (u >= 0) && (v >= 0) && (u + v < 1);
}


/**
 * Checks the things on the edge line and scores their walkability.
 *
 * Uses a modified "manhattan" Bresenham line algorithm that does not move diagonally.
 *
 * @param {WorldMap} map            world map
 * @param {array} vertices          vertices array
 * @param {Number} startOffset      offset for starting point
 * @param {Number} endOffset        offset for end point
 * 
 * @returns {Number}
 */
function calculateEdgeCost(map, vertices, startOffset, endOffset)
{
    let x0 = vertices[startOffset]|0;
    let y0 = vertices[startOffset + 1]|0;
    let x1 = vertices[endOffset]|0;
    let y1 = vertices[endOffset + 1]|0;


    const xDist = Math.abs(x1 - x0);
    const yDist = -Math.abs(y1 - y0);
    const xStep = (x0 < x1 ? +1 : -1);
    const yStep = (y0 < y1 ? +1 : -1);
    let error = xDist + yDist;

    const scorePosition = (x,y) => {
        const t0 = thingWalkability[map.getThing(x, y)];

        const te = thingWalkability[map.getThing(x + 1, y)];
        const ts = thingWalkability[map.getThing(x, y + 1)];
        const tn = thingWalkability[map.getThing(x - 1, y)];
        const tw = thingWalkability[map.getThing(x, y - 1)];

        if (
            (te === LARGE_TREE || te === LARGE_TREE_2 ) ||
            (ts === LARGE_TREE || ts === LARGE_TREE_2 ) ||
            (tn === LARGE_TREE || tn === LARGE_TREE_2 ) ||
            (tw === LARGE_TREE || tw === LARGE_TREE_2 )
        )
        {
            return LARGE_TREE;
        }

        if (
            ( te === SMALL_TREE || te === SMALL_TREE_2 || te === SMALL_TREE_3) ||
            ( ts === SMALL_TREE || ts === SMALL_TREE_2 || ts === SMALL_TREE_3) ||
            ( tn === SMALL_TREE || tn === SMALL_TREE_2 || tn === SMALL_TREE_3) ||
            ( tw === SMALL_TREE || tw === SMALL_TREE_2 || tw === SMALL_TREE_3)
        )
        {
            return SMALL_TREE;
        }

        return t0;
    };


    let score = scorePosition(x0,y0);
    while (x0 !== x1 || y0 !== y1)
    {
        if (2 * error - yDist > xDist - 2 * error)
        {
            // horizontal step
            error += yDist;
            x0 += xStep;
        }
        else
        {
            // vertical step
            error += xDist;
            y0 += yStep;
        }

        score += scorePosition(x0, y0);
    }

    return score;
}


function insert(nodes, map, vertices, id, x, y, connectedA, connectedB)
{
    let entry = nodes[id];
    const costA = calculateEdgeCost(map, vertices, id << 1, connectedA << 1);
    const costB = calculateEdgeCost(map, vertices, id << 1, connectedB << 1);
    if (!entry)
    {
        nodes[id] = {
            x,
            y,
            to: [
                connectedA,
                connectedB
            ],
            cost: [
                costA,
                costB
            ]
        }
    }
    else
    {
        if (entry.to.indexOf(connectedA) < 0)
        {
            entry.to.push(connectedA);
            entry.cost.push(costA);
        }
        if (entry.to.indexOf(connectedB) < 0)
        {
            entry.to.push(connectedB);
            entry.cost.push(costB);
        }
    }
}


function buildNavigationMesh(map, vertices, triangles)
{
    const nodes = new Array(vertices.length >> 1);

    const rTree = new RTree(10);

    for (let i = 0; i < triangles.length; i += 3)
    {
        const offsetA = triangles[i];
        const offsetB = triangles[i + 1];
        const offsetC = triangles[i + 2];

        const nodeA = offsetA >> 1;
        const nodeB = offsetB >> 1;
        const nodeC = offsetC >> 1;

        const x0 = vertices[offsetA];
        const y0 = vertices[offsetA + 1];
        const x1 = vertices[offsetB];
        const y1 = vertices[offsetB + 1];
        const x2 = vertices[offsetC];
        const y2 = vertices[offsetC + 1];


        insert(nodes, map, vertices, nodeA, x0, y0, nodeB, nodeC);
        insert(nodes, map, vertices, nodeB, x1, y1, nodeA, nodeC);
        insert(nodes, map, vertices, nodeC, x2, y2, nodeA, nodeB);


        let minX = x0;
        let minY = y0;
        let maxX = x0;
        let maxY = y0;

        if (x1 < minX)
        {
            minX = x1;
        }
        if (x1 > maxX)
        {
            maxX = x1;
        }
        if (y1 < minY)
        {
            minY = y1;
        }
        if (y1 > maxY)
        {
            maxY = y1;
        }

        if (x2 < minX)
        {
            minX = x2;
        }
        if (x2 > maxX)
        {
            maxX = x2;
        }
        if (y2 < minY)
        {
            minY = y2;
        }
        if (y2 > maxY)
        {
            maxY = y2;
        }

        const bb = {
            x: minX,
            y: minY,
            w: maxX - minX,
            h: maxY - minY
        };
        //console.log("INSERT", bb, i);

        rTree.insert(bb, i);
    }

    const navMesh = {
        nodes,
        rTree,
        triangles,
        vertices,
    };

    return navMesh;
}


function planRoads(map, cities, updateProgress, percent, start)
{
    const remaining = 100 - percent;

    const polygons = marchingSquares(map.things, map.size, map.size, t => t >= BLOCKED, true);

    updateProgress && updateProgress(0.8);

    console.log("MARCHING-CUBE: polygons = ", polygons.length, ", vertexes = ", polygons.reduce((count, array) => count + array.length, 0), (now() - start ) + "ms");

    const simplified = polygons.map(p => simplify(p, SIMPLIFICATION_EPSILON, true)).filter(p => p.length > 6);

    console.log("SIMPLIFIED: polygons = ", simplified.length, ", vertexes = ", simplified.reduce((count, array) => count + array.length, 0), (now() - start ) + "ms");

    const minMax = polyMinMax(simplified);
    const mask = createMask(simplified, map.sizeBits, minMax);

    const vertices = flatten(simplified);
    const triangles = Delaunay.triangulate(vertices);

    flipWronglyTriangulated(vertices, triangles, simplified, minMax)

    updateProgress && updateProgress(0.98);
    console.log("DELAUNAY: triangles", triangles.length / 3, ", vertexes = ", triangles.length, (now() - start ) + "ms");

    const walkable = filterWalkable(map, vertices, triangles, mask);

    console.log("WALKABLE: triangles", walkable.length / 3, ", vertexes = ", walkable.length, (now() - start ) + "ms");

    const navMesh = buildNavigationMesh(map, vertices, walkable);
    console.log("NAV-MESH: ", (now() - start ) + "ms");

    map.mask = mask;
    map.navMesh = navMesh;
    map.cities = cities;
}




export default class WorldMap {
    constructor(size = 800, seed, tiles, things, navMesh, mask, worldId)
    {
        this.worldId = worldId;
        const sizeBits = Math.log(size) / Math.log(2);
        if ((sizeBits % 1) !== 0)
        {
            throw new Error("Size must be power of two: " + size);
        }

        //console.log("New map " + size + " x " + size + ", seed = " + seed);

        this.random = new Prando(seed);
        this.noise = new SimplexNoise(() => this.random.next());
        this.size = size;

        this.sizeMask = size - 1;
        this.fineMask = (size << 4) - 1;

        this.invSizeFactor = 1 / size;
        this.sizeBits = sizeBits;

        const arrayLen = 1 << (sizeBits + sizeBits);

        this.tiles = tiles || new Uint8Array(arrayLen);
        this.things = things || new Uint8Array(arrayLen);
        this.sensors = new Map();

        this.navMesh = navMesh || null;
        this.mask = mask || null;
        this.worldId = worldId;
    }


    read(x, y)
    {
        const { sizeMask, sizeBits } = this;

        return this.tiles[((y & sizeMask) << sizeBits) + (x & sizeMask)];
    }


    getThing(x, y)
    {
        const { sizeMask, sizeBits } = this;
        return this.things[((y & sizeMask) << sizeBits) + (x & sizeMask)];
    }



    write(x, y, tile)
    {
        const { sizeMask, sizeBits } = this;
        this.tiles[((y & sizeMask) << sizeBits) + (x & sizeMask)] = tile;
    }


    putThing(x, y, thing)
    {
        const { sizeMask, sizeBits } = this;
        this.things[((y & sizeMask) << sizeBits) + (x & sizeMask)] = thing;
    }


    registerSensor(x, y, sensor)
    {
        const { sizeMask, sizeBits } = this;
        const off = ((y & sizeMask) << sizeBits) + (x & sizeMask);

        console.log("Register sensor", sensor, " for ", off);
        this.sensors.set(off, sensor);
    }

    lookupSensor(x,y, dx, dy)
    {
        const { sizeMask, sizeBits } = this;
        const off = ((y & sizeMask) << sizeBits) + (x & sizeMask);
        const sensor = this.sensors.get(off);
        return sensor;
    }

    unregisterSensor(x, y, sensor)
    {
        const { sizeMask, sizeBits } = this;
        const off = ((y & sizeMask) << sizeBits) + (x & sizeMask);
        this.sensors.delete(off);
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
        const s = x * this.invSizeFactor;
        const t = y * this.invSizeFactor;

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

        const s = x * this.invSizeFactor;
        const t = y * this.invSizeFactor;

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
                        data[dataOffset++] = 51;
                        data[dataOffset++] = 152;
                        data[dataOffset++] = 208;
                        data[dataOffset++] = 255;
                        break;
                    case WATER:
                        data[dataOffset++] = 28;
                        data[dataOffset++] = 142;
                        data[dataOffset++] = 203;
                        data[dataOffset++] = 255;
                        break;
                    case SAND:
                        data[dataOffset++] = 240;
                        data[dataOffset++] = 224;
                        data[dataOffset++] = 93;
                        data[dataOffset++] = 255;
                        break;
                    case GRASS:
                        data[dataOffset++] = 28;
                        data[dataOffset++] = 184;
                        data[dataOffset++] = 79;
                        data[dataOffset++] = 255;
                        break;
                    case WOODS:
                        data[dataOffset++] = 29;
                        data[dataOffset++] = 149;
                        data[dataOffset++] = 75;
                        data[dataOffset++] = 255;
                        break;
                    case WOODS2:
                        data[dataOffset++] = 25;
                        data[dataOffset++] = 124;
                        data[dataOffset++] = 66;
                        data[dataOffset++] = 255;
                        break;
                    case DIRT:
                        data[dataOffset++] = 170;
                        data[dataOffset++] = 126;
                        data[dataOffset++] = 73;
                        data[dataOffset++] = 255;
                        break;
                    case ROCK:
                        data[dataOffset++] = 170;
                        data[dataOffset++] = 170;
                        data[dataOffset++] = 170;
                        data[dataOffset++] = 255;
                        break;
                    case ICE:
                        data[dataOffset++] = 236;
                        data[dataOffset++] = 254;
                        data[dataOffset++] = 255;
                        data[dataOffset++] = 255;
                        break;
                    case ICE2:
                        data[dataOffset++] = 214;
                        data[dataOffset++] = 245;
                        data[dataOffset++] = 255;
                        data[dataOffset++] = 255;
                        break;
                    case DARK:
                        data[dataOffset++] = 17;
                        data[dataOffset++] = 17;
                        data[dataOffset++] = 17;
                        data[dataOffset++] = 255;

                        break;
                }




                // atlas/src/ms-river.png




                // atlas/src/ms-rock.png




                // atlas/src/ms-sand.png




                // atlas/src/ms-water.png




                // atlas/src/ms-woods2.png




                // atlas/src/ms-woods.png




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
        const { vertices, triangles } = this.navMesh;

        return {
            "_": SERIALIZED_MAP,

            worldId: this.worldId,
            size: this.size,
            seed: this.random._seed,
            tiles: this.tiles,
            things: this.things,
            meshData: {
                vertices,
                triangles
            },
            mask: this.mask,
            cities: this.cities
        }
    }

    static deserialize(obj)
    {
        const { worldId, size, seed, things, tiles, mask, meshData, cities } = obj;

        const map = new WorldMap(
            size,
            seed,
            tiles,
            things,
            null,
            mask,
            worldId,
        );

        map.navMesh = buildNavigationMesh(map, meshData.vertices, meshData.triangles);
        map.cities = cities;

        return map;
    }

    static generate(size, seed = new Date().getTime(), updateProgress)
    {

        const start = now();
        const map = createBase(size, seed, updateProgress, 0.64);
        const afterBase = now();
        const rivers = drawRivers(map);
        const afterRivers = now();
        updateProgress && updateProgress(0.72);
        const cities = planCities(map, rivers);
        const afterCities = now();

        planRoads(map, cities, updateProgress, 0.72, start);
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


