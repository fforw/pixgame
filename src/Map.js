// noinspection ES6UnusedImports
import STYLES from "./style.css"
import "./pixi-tilemap"

import SimplexNoise from "simplex-noise"
import Prando from "prando"
// noinspection ES6UnusedImports

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

const WATER = 0;
const SAND = 1;
const GRASS = 2;
const DIRT = 3;
const ROCK = 4;
const WOODS = 5;
const WOODS2 = 6;
const RIVER = 7;


function createBase(size, seed)
{
    const map = new Map(size, seed);

    let mapOffset = 0;

    const data = map.data;

    for (let y = 0; y < size; y++)
    {
        for (let x = 0; x < size; x++)
        {
            const coords = map.heightCoords(x,y);
            const n = map.heightFn(x, y, coords);

            if (n < WATER_LINE)
            {
                data[mapOffset++] = WATER;
            }
            else if (n < BEACH_LINE)
            {
                data[mapOffset++] = SAND;
            }
            else if (n < MOUNTAIN_LINE)
            {
                const v = (n - WATER_LINE) * (MOUNTAIN_LINE - WATER_LINE) * 255;

                const {nx, ny, nz, nw} = coords;

                const n3 = n > WOODS_LINE ? map.noise4D(nx * N4, nw * N4, ny * N4, nz * N4) : 1;
                const n4 = map.noise4D(nx * N3, nw * N3, ny * N3, nz * N3);
                if (n3 < 0.12)
                {
                    if (n4 < 0)
                    {
                        data[mapOffset++] = WOODS;
                    }
                    else
                    {
                        data[mapOffset++] = WOODS2;
                    }
                }
                else
                {
                    if (n4 < 0)
                    {
                        data[mapOffset++] = GRASS;
                    }
                    else
                    {
                        data[mapOffset++] = DIRT;
                    }
                }

            }
            else
            {
                data[mapOffset++] = ROCK;
            }
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
                length: 0,
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
            length: 0
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


function jitter(map, filtered, amount = 4)
{
    const twice = amount * 2;

    const multis = [];
    for (let i = 0; i < filtered.length; i++)
    {
        const probe = filtered[i];
        probe.x = (probe.x - amount + map.random.next() * twice) | 0;
        probe.y = (probe.y - amount + map.random.next() * twice) | 0;

        const v = map.heightFn(probe.x, probe.y);

        if (v > MOUNTAIN_LINE && map.random.next() < 0.6)
        {
            multis.push(
                {
                    ...probe,
                    x: (probe.x - amount + map.random.next() * twice) | 0,
                    y: (probe.y - amount + map.random.next() * twice) | 0
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

    console.log("Stopped climbing after ", i, " iterations");

    const filtered = removeDuplicates(probes);

    console.log(filtered.length, "springs");

    return jitter(map, filtered);
}


function flow(map, probe)
{
    let currentLow = Infinity;
    let currentX = probe.x;
    let currentY = probe.y;
    let currentIndex = -1;
    let currentTile = -1;

    let improved = false;

    const { size } = map;

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

                const value = map.heightFn(x, y) - (tile !== SAND && probe.tile === tile ? 0.01 : 0);
                if (value < currentLow)
                {
                    currentLow = value;
                    currentX = x;
                    currentY = y;
                    currentIndex = i;
                    currentTile = tile;
                    improved = true;
                }
            }
        }
    }

    probe.length++;
    if (!improved)
    {
        const dir = ((map.random.next() * 4)|0) * 2;
        probe.x += directions[dir];
        probe.y += directions[dir + 1];
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


function flood(map, x, y)
{
    const tile = map.read(x, y);
    if (tile !== WATER && tile !== RIVER)
    {
        map.write(x, y, RIVER);
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

            flood(map, x, y);

            flow(map, probe);

            const width = Math.min(5, probe.length * 0.05)|0;

            if (width > 1)
            {
                flood(map, x - 1, y);
            }
            if (width > 2)
            {
                flood(map, x + 1, y);
            }
            if (width > 3)
            {
                flood(map, x, y - 1);
            }
            if (width > 4)
            {
                flood(map, x, y + 1);
            }

            if (map.read(probe.x, probe.y) === WATER)
            {
                // swap current with first flower
                const firstFlower = springs[flowingStart];
                springs[flowingStart] = springs[j];
                springs[j] = firstFlower;
                // increase walking start
                flowingStart++;
            }
        }

        //drawSprings(springs, imageData, false);
    }
    console.log("Stopped flowing after ", i, " iterations");
}



export default  class Map {
    constructor(size = 800, seed)
    {
        console.log("New map " + size + " x " + size + ", seed = " + seed)

        this.random = new Prando(seed);
        this.noise = new SimplexNoise(() => this.random.next());
        this.size = size;
        this.factor = 1 / size;
        this.data = new Uint8Array(size * size);
    }


    read(x, y)
    {
        return this.data[y * this.size + x];
    }


    write(x, y, tile)
    {
        this.data[y * a + x] = tile;
    }

    heightFn(x, y, coords = null)
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

        let off = 0;
        const data = imageData.data;
        for (let y = 0; y < size; y++)
        {
            for (let x = 0; x < size; x++)
            {
                const tile = this.read(x, y);

                switch (tile)
                {
                    case RIVER :
                    case WATER :
                        data[off++] = 0;
                        data[off++] = 32;
                        data[off++] = 128;
                        data[off++] = 255;
                        break;
                    case SAND :
                        data[off++] = 192;
                        data[off++] = 160;
                        data[off++] = 0;
                        data[off++] = 255;
                        break;
                    case GRASS :
                        data[off++] = 0;
                        data[off++] = 128;
                        data[off++] = 0;
                        data[off++] = 255;
                        break;
                    case WOODS:
                        data[off++] = 0;
                        data[off++] = 96;
                        data[off++] = 0;
                        data[off++] = 128;
                        break;
                    case WOODS2:
                        data[off++] = 0;
                        data[off++] = 64;
                        data[off++] = 0;
                        data[off++] = 144;
                        break;
                    case DIRT :
                        data[off++] = 64;
                        data[off++] = 64;
                        data[off++] = 0;
                        data[off++] = 255;
                        break;
                    case ROCK :
                        data[off++] = 160;
                        data[off++] = 160;
                        data[off++] = 160;
                        data[off++] = 255;
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
        const map = createBase(size, seed);
         drawRivers(map);
        return map;
    };

}
