import { RIVER, _RIVER, WATER } from "./WorldMap";

export default function flood(map, x, y, width)
{
    const { size, tiles, things} = map;

    let off;
    //console.log("FLOOD", width)

    switch(width)
    {
        case 0:
        case 1:
            things[( y - 1) * size + x - 1] = _RIVER;
            things[( y - 1) * size + x] = _RIVER;
            things[( y - 1) * size +  x + 1] = _RIVER;
            things[y * size + x - 1] = _RIVER;
            off = y * size + x; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            things[y * size +  x + 1] = _RIVER;
            things[( y + 1) * size + x - 1] = _RIVER;
            things[( y + 1) * size + x] = _RIVER;
            things[( y + 1) * size +  x + 1] = _RIVER;
            break;
        case 2:
            things[( y - 1) * size + x - 1] = _RIVER;
            things[( y - 1) * size + x] = _RIVER;
            things[( y - 1) * size +  x + 1] = _RIVER;
            things[( y - 1) * size +  x + 2] = _RIVER;
            things[y * size + x - 1] = _RIVER;
            off = y * size + x; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = y * size +  x + 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            things[y * size +  x + 2] = _RIVER;
            things[( y + 1) * size + x - 1] = _RIVER;
            things[( y + 1) * size + x] = _RIVER;
            things[( y + 1) * size +  x + 1] = _RIVER;
            things[( y + 1) * size +  x + 2] = _RIVER;
            break;
        case 3:
            things[( y - 3) * size + x] = _RIVER;
            things[( y - 3) * size +  x + 1] = _RIVER;
            things[( y - 2) * size + x - 1] = _RIVER;
            things[( y - 2) * size + x] = _RIVER;
            things[( y - 2) * size +  x + 1] = _RIVER;
            things[( y - 2) * size +  x + 2] = _RIVER;
            things[( y - 1) * size + x - 2] = _RIVER;
            things[( y - 1) * size + x - 1] = _RIVER;
            off = ( y - 1) * size + x; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = ( y - 1) * size +  x + 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            things[( y - 1) * size +  x + 2] = _RIVER;
            things[( y - 1) * size +  x + 3] = _RIVER;
            things[y * size + x - 2] = _RIVER;
            things[y * size + x - 1] = _RIVER;
            off = y * size + x; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = y * size +  x + 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            things[y * size +  x + 2] = _RIVER;
            things[y * size +  x + 3] = _RIVER;
            things[( y + 1) * size + x - 1] = _RIVER;
            things[( y + 1) * size + x] = _RIVER;
            things[( y + 1) * size +  x + 1] = _RIVER;
            things[( y + 1) * size +  x + 2] = _RIVER;
            things[( y + 2) * size + x] = _RIVER;
            things[( y + 2) * size +  x + 1] = _RIVER;
            break;
        case 4:
            things[( y - 3) * size + x - 1] = _RIVER;
            things[( y - 3) * size + x] = _RIVER;
            things[( y - 3) * size +  x + 1] = _RIVER;
            things[( y - 2) * size + x - 2] = _RIVER;
            things[( y - 2) * size + x - 1] = _RIVER;
            things[( y - 2) * size + x] = _RIVER;
            things[( y - 2) * size +  x + 1] = _RIVER;
            things[( y - 2) * size +  x + 2] = _RIVER;
            things[( y - 1) * size + x - 3] = _RIVER;
            things[( y - 1) * size + x - 2] = _RIVER;
            off = ( y - 1) * size + x - 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = ( y - 1) * size + x; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = ( y - 1) * size +  x + 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            things[( y - 1) * size +  x + 2] = _RIVER;
            things[( y - 1) * size +  x + 3] = _RIVER;
            things[y * size + x - 3] = _RIVER;
            things[y * size + x - 2] = _RIVER;
            off = y * size + x - 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = y * size + x; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = y * size +  x + 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            things[y * size +  x + 2] = _RIVER;
            things[y * size +  x + 3] = _RIVER;
            things[( y + 1) * size + x - 2] = _RIVER;
            things[( y + 1) * size + x - 1] = _RIVER;
            things[( y + 1) * size + x] = _RIVER;
            things[( y + 1) * size +  x + 1] = _RIVER;
            things[( y + 1) * size +  x + 2] = _RIVER;
            things[( y + 2) * size + x - 1] = _RIVER;
            things[( y + 2) * size + x] = _RIVER;
            things[( y + 2) * size +  x + 1] = _RIVER;
            break;
        case 5:
            things[( y - 3) * size + x - 1] = _RIVER;
            things[( y - 3) * size + x] = _RIVER;
            things[( y - 3) * size +  x + 1] = _RIVER;
            things[( y - 2) * size + x - 2] = _RIVER;
            things[( y - 2) * size + x - 1] = _RIVER;
            things[( y - 2) * size + x] = _RIVER;
            things[( y - 2) * size +  x + 1] = _RIVER;
            things[( y - 2) * size +  x + 2] = _RIVER;
            things[( y - 1) * size + x - 3] = _RIVER;
            things[( y - 1) * size + x - 2] = _RIVER;
            off = ( y - 1) * size + x - 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = ( y - 1) * size + x; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = ( y - 1) * size +  x + 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            things[( y - 1) * size +  x + 2] = _RIVER;
            things[( y - 1) * size +  x + 3] = _RIVER;
            things[y * size + x - 3] = _RIVER;
            things[y * size + x - 2] = _RIVER;
            off = y * size + x - 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = y * size + x; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = y * size +  x + 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            things[y * size +  x + 2] = _RIVER;
            things[y * size +  x + 3] = _RIVER;
            things[( y + 1) * size + x - 3] = _RIVER;
            things[( y + 1) * size + x - 2] = _RIVER;
            off = ( y + 1) * size + x - 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = ( y + 1) * size + x; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = ( y + 1) * size +  x + 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            things[( y + 1) * size +  x + 2] = _RIVER;
            things[( y + 1) * size +  x + 3] = _RIVER;
            things[( y + 2) * size + x - 2] = _RIVER;
            things[( y + 2) * size + x - 1] = _RIVER;
            things[( y + 2) * size + x] = _RIVER;
            things[( y + 2) * size +  x + 1] = _RIVER;
            things[( y + 2) * size +  x + 2] = _RIVER;
            things[( y + 3) * size + x - 1] = _RIVER;
            things[( y + 3) * size + x] = _RIVER;
            things[( y + 3) * size +  x + 1] = _RIVER;
            break;
        case 6:
            things[( y - 4) * size + x - 1] = _RIVER;
            things[( y - 4) * size + x] = _RIVER;
            things[( y - 4) * size +  x + 1] = _RIVER;
            things[( y - 3) * size + x - 2] = _RIVER;
            things[( y - 3) * size + x - 1] = _RIVER;
            things[( y - 3) * size + x] = _RIVER;
            things[( y - 3) * size +  x + 1] = _RIVER;
            things[( y - 3) * size +  x + 2] = _RIVER;
            things[( y - 2) * size + x - 3] = _RIVER;
            things[( y - 2) * size + x - 2] = _RIVER;
            off = ( y - 2) * size + x - 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = ( y - 2) * size + x; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = ( y - 2) * size +  x + 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            things[( y - 2) * size +  x + 2] = _RIVER;
            things[( y - 2) * size +  x + 3] = _RIVER;
            things[( y - 1) * size + x - 4] = _RIVER;
            things[( y - 1) * size + x - 3] = _RIVER;
            off = ( y - 1) * size + x - 2; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = ( y - 1) * size + x - 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = ( y - 1) * size + x; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = ( y - 1) * size +  x + 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = ( y - 1) * size +  x + 2; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            things[( y - 1) * size +  x + 3] = _RIVER;
            things[( y - 1) * size +  x + 4] = _RIVER;
            things[y * size + x - 4] = _RIVER;
            things[y * size + x - 3] = _RIVER;
            off = y * size + x - 2; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = y * size + x - 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = y * size + x; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = y * size +  x + 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = y * size +  x + 2; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            things[y * size +  x + 3] = _RIVER;
            things[y * size +  x + 4] = _RIVER;
            things[( y + 1) * size + x - 4] = _RIVER;
            things[( y + 1) * size + x - 3] = _RIVER;
            off = ( y + 1) * size + x - 2; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = ( y + 1) * size + x - 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = ( y + 1) * size + x; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = ( y + 1) * size +  x + 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = ( y + 1) * size +  x + 2; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            things[( y + 1) * size +  x + 3] = _RIVER;
            things[( y + 1) * size +  x + 4] = _RIVER;
            things[( y + 2) * size + x - 3] = _RIVER;
            things[( y + 2) * size + x - 2] = _RIVER;
            off = ( y + 2) * size + x - 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = ( y + 2) * size + x; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = ( y + 2) * size +  x + 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            things[( y + 2) * size +  x + 2] = _RIVER;
            things[( y + 2) * size +  x + 3] = _RIVER;
            things[( y + 3) * size + x - 2] = _RIVER;
            things[( y + 3) * size + x - 1] = _RIVER;
            things[( y + 3) * size + x] = _RIVER;
            things[( y + 3) * size +  x + 1] = _RIVER;
            things[( y + 3) * size +  x + 2] = _RIVER;
            things[( y + 4) * size + x - 1] = _RIVER;
            things[( y + 4) * size + x] = _RIVER;
            things[( y + 4) * size +  x + 1] = _RIVER;
            break;
        case 7:
            things[( y - 5) * size + x - 1] = _RIVER;
            things[( y - 5) * size + x] = _RIVER;
            things[( y - 5) * size +  x + 1] = _RIVER;
            things[( y - 4) * size + x - 2] = _RIVER;
            things[( y - 4) * size + x - 1] = _RIVER;
            things[( y - 4) * size + x] = _RIVER;
            things[( y - 4) * size +  x + 1] = _RIVER;
            things[( y - 4) * size +  x + 2] = _RIVER;
            things[( y - 3) * size + x - 3] = _RIVER;
            things[( y - 3) * size + x - 2] = _RIVER;
            off = ( y - 3) * size + x - 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = ( y - 3) * size + x; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = ( y - 3) * size +  x + 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            things[( y - 3) * size +  x + 2] = _RIVER;
            things[( y - 3) * size +  x + 3] = _RIVER;
            things[( y - 2) * size + x - 4] = _RIVER;
            things[( y - 2) * size + x - 3] = _RIVER;
            off = ( y - 2) * size + x - 2; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = ( y - 2) * size + x - 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = ( y - 2) * size + x; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = ( y - 2) * size +  x + 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = ( y - 2) * size +  x + 2; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            things[( y - 2) * size +  x + 3] = _RIVER;
            things[( y - 2) * size +  x + 4] = _RIVER;
            things[( y - 1) * size + x - 5] = _RIVER;
            things[( y - 1) * size + x - 4] = _RIVER;
            off = ( y - 1) * size + x - 3; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = ( y - 1) * size + x - 2; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = ( y - 1) * size + x - 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = ( y - 1) * size + x; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = ( y - 1) * size +  x + 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = ( y - 1) * size +  x + 2; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = ( y - 1) * size +  x + 3; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            things[( y - 1) * size +  x + 4] = _RIVER;
            things[( y - 1) * size +  x + 5] = _RIVER;
            things[y * size + x - 5] = _RIVER;
            things[y * size + x - 4] = _RIVER;
            off = y * size + x - 3; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = y * size + x - 2; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = y * size + x - 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = y * size + x; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = y * size +  x + 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = y * size +  x + 2; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = y * size +  x + 3; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            things[y * size +  x + 4] = _RIVER;
            things[y * size +  x + 5] = _RIVER;
            things[( y + 1) * size + x - 5] = _RIVER;
            things[( y + 1) * size + x - 4] = _RIVER;
            off = ( y + 1) * size + x - 3; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = ( y + 1) * size + x - 2; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = ( y + 1) * size + x - 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = ( y + 1) * size + x; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = ( y + 1) * size +  x + 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = ( y + 1) * size +  x + 2; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = ( y + 1) * size +  x + 3; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            things[( y + 1) * size +  x + 4] = _RIVER;
            things[( y + 1) * size +  x + 5] = _RIVER;
            things[( y + 2) * size + x - 4] = _RIVER;
            things[( y + 2) * size + x - 3] = _RIVER;
            off = ( y + 2) * size + x - 2; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = ( y + 2) * size + x - 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = ( y + 2) * size + x; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = ( y + 2) * size +  x + 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = ( y + 2) * size +  x + 2; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            things[( y + 2) * size +  x + 3] = _RIVER;
            things[( y + 2) * size +  x + 4] = _RIVER;
            things[( y + 3) * size + x - 3] = _RIVER;
            things[( y + 3) * size + x - 2] = _RIVER;
            off = ( y + 3) * size + x - 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = ( y + 3) * size + x; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = ( y + 3) * size +  x + 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            things[( y + 3) * size +  x + 2] = _RIVER;
            things[( y + 3) * size +  x + 3] = _RIVER;
            things[( y + 4) * size + x - 2] = _RIVER;
            things[( y + 4) * size + x - 1] = _RIVER;
            things[( y + 4) * size + x] = _RIVER;
            things[( y + 4) * size +  x + 1] = _RIVER;
            things[( y + 4) * size +  x + 2] = _RIVER;
            things[( y + 5) * size + x - 1] = _RIVER;
            things[( y + 5) * size + x] = _RIVER;
            things[( y + 5) * size +  x + 1] = _RIVER;
            break;
        case 8:
            things[( y - 6) * size + x - 1] = _RIVER;
            things[( y - 6) * size + x] = _RIVER;
            things[( y - 6) * size +  x + 1] = _RIVER;
            things[( y - 5) * size + x - 3] = _RIVER;
            things[( y - 5) * size + x - 2] = _RIVER;
            things[( y - 5) * size + x - 1] = _RIVER;
            things[( y - 5) * size + x] = _RIVER;
            things[( y - 5) * size +  x + 1] = _RIVER;
            things[( y - 5) * size +  x + 2] = _RIVER;
            things[( y - 5) * size +  x + 3] = _RIVER;
            things[( y - 4) * size + x - 4] = _RIVER;
            things[( y - 4) * size + x - 3] = _RIVER;
            things[( y - 4) * size + x - 2] = _RIVER;
            off = ( y - 4) * size + x - 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = ( y - 4) * size + x; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = ( y - 4) * size +  x + 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            things[( y - 4) * size +  x + 2] = _RIVER;
            things[( y - 4) * size +  x + 3] = _RIVER;
            things[( y - 4) * size +  x + 4] = _RIVER;
            things[( y - 3) * size + x - 5] = _RIVER;
            things[( y - 3) * size + x - 4] = _RIVER;
            things[( y - 3) * size + x - 3] = _RIVER;
            off = ( y - 3) * size + x - 2; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = ( y - 3) * size + x - 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = ( y - 3) * size + x; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = ( y - 3) * size +  x + 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = ( y - 3) * size +  x + 2; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            things[( y - 3) * size +  x + 3] = _RIVER;
            things[( y - 3) * size +  x + 4] = _RIVER;
            things[( y - 3) * size +  x + 5] = _RIVER;
            things[( y - 2) * size + x - 5] = _RIVER;
            things[( y - 2) * size + x - 4] = _RIVER;
            off = ( y - 2) * size + x - 3; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = ( y - 2) * size + x - 2; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = ( y - 2) * size + x - 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = ( y - 2) * size + x; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = ( y - 2) * size +  x + 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = ( y - 2) * size +  x + 2; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = ( y - 2) * size +  x + 3; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            things[( y - 2) * size +  x + 4] = _RIVER;
            things[( y - 2) * size +  x + 5] = _RIVER;
            things[( y - 1) * size + x - 6] = _RIVER;
            things[( y - 1) * size + x - 5] = _RIVER;
            off = ( y - 1) * size + x - 4; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = ( y - 1) * size + x - 3; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = ( y - 1) * size + x - 2; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = ( y - 1) * size + x - 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = ( y - 1) * size + x; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = ( y - 1) * size +  x + 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = ( y - 1) * size +  x + 2; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = ( y - 1) * size +  x + 3; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = ( y - 1) * size +  x + 4; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            things[( y - 1) * size +  x + 5] = _RIVER;
            things[( y - 1) * size +  x + 6] = _RIVER;
            things[y * size + x - 6] = _RIVER;
            things[y * size + x - 5] = _RIVER;
            off = y * size + x - 4; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = y * size + x - 3; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = y * size + x - 2; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = y * size + x - 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = y * size + x; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = y * size +  x + 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = y * size +  x + 2; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = y * size +  x + 3; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = y * size +  x + 4; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            things[y * size +  x + 5] = _RIVER;
            things[y * size +  x + 6] = _RIVER;
            things[( y + 1) * size + x - 6] = _RIVER;
            things[( y + 1) * size + x - 5] = _RIVER;
            off = ( y + 1) * size + x - 4; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = ( y + 1) * size + x - 3; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = ( y + 1) * size + x - 2; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = ( y + 1) * size + x - 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = ( y + 1) * size + x; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = ( y + 1) * size +  x + 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = ( y + 1) * size +  x + 2; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = ( y + 1) * size +  x + 3; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = ( y + 1) * size +  x + 4; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            things[( y + 1) * size +  x + 5] = _RIVER;
            things[( y + 1) * size +  x + 6] = _RIVER;
            things[( y + 2) * size + x - 5] = _RIVER;
            things[( y + 2) * size + x - 4] = _RIVER;
            off = ( y + 2) * size + x - 3; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = ( y + 2) * size + x - 2; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = ( y + 2) * size + x - 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = ( y + 2) * size + x; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = ( y + 2) * size +  x + 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = ( y + 2) * size +  x + 2; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = ( y + 2) * size +  x + 3; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            things[( y + 2) * size +  x + 4] = _RIVER;
            things[( y + 2) * size +  x + 5] = _RIVER;
            things[( y + 3) * size + x - 5] = _RIVER;
            things[( y + 3) * size + x - 4] = _RIVER;
            things[( y + 3) * size + x - 3] = _RIVER;
            off = ( y + 3) * size + x - 2; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = ( y + 3) * size + x - 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = ( y + 3) * size + x; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = ( y + 3) * size +  x + 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = ( y + 3) * size +  x + 2; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            things[( y + 3) * size +  x + 3] = _RIVER;
            things[( y + 3) * size +  x + 4] = _RIVER;
            things[( y + 3) * size +  x + 5] = _RIVER;
            things[( y + 4) * size + x - 4] = _RIVER;
            things[( y + 4) * size + x - 3] = _RIVER;
            things[( y + 4) * size + x - 2] = _RIVER;
            off = ( y + 4) * size + x - 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = ( y + 4) * size + x; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = ( y + 4) * size +  x + 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            things[( y + 4) * size +  x + 2] = _RIVER;
            things[( y + 4) * size +  x + 3] = _RIVER;
            things[( y + 4) * size +  x + 4] = _RIVER;
            things[( y + 5) * size + x - 3] = _RIVER;
            things[( y + 5) * size + x - 2] = _RIVER;
            things[( y + 5) * size + x - 1] = _RIVER;
            things[( y + 5) * size + x] = _RIVER;
            things[( y + 5) * size +  x + 1] = _RIVER;
            things[( y + 5) * size +  x + 2] = _RIVER;
            things[( y + 5) * size +  x + 3] = _RIVER;
            things[( y + 6) * size + x - 1] = _RIVER;
            things[( y + 6) * size + x] = _RIVER;
            things[( y + 6) * size +  x + 1] = _RIVER;
            break;

        default:
            throw new Error("Unhandled width: " + width)

    }
}
