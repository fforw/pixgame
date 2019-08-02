import { BLOCKED, CASTLE_GATE, CASTLE_VERTICAL, EMPTY } from "../tilemap-config";


export default function drawCityWalls(map, px, py, topWall, bottomWall, size)
{
    const height = size & ~1;

    for (let i = 0; i < topWall.length; i++)
    {
        const thing = topWall[i];
        const restTile = thing === CASTLE_GATE ? EMPTY : BLOCKED;
        for (let j = 0; j < 5; j++)
        {
            map.putThing(px + i * 5 + j - 2, py, j === 2 ? thing : restTile);
        }
    }

    for (let i = 0; i < bottomWall.length; i++)
    {
        const thing = bottomWall[i];
        const restTile = thing === CASTLE_GATE ? EMPTY : BLOCKED;
        for (let j = 0; j < 5; j++)
        {
            map.putThing(px + i * 5 + j - 2, py + height - 1, j === 2 ? thing : restTile);
        }
    }

    for (let y = 1; y < height - 1; y += 2)
    {
        map.putThing(px, py + y, CASTLE_VERTICAL);
        map.putThing(px, py + y + 1, BLOCKED);

        map.putThing(px + size - 1, py + y, CASTLE_VERTICAL);
        map.putThing(px + size - 1, py + y + 1, BLOCKED);
    }
}
