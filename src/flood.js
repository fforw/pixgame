
import { _RIVER, EMPTY, RIVER, WATER } from "./tilemap-config";

export default function flood(map, x, y, width)
{
    const { size, tiles, things, sizeBits } = map;

    let off;
    //console.log("FLOOD", width)

    switch(width)
    {
        case 0:
        case 1:
            things[(( y - 1) << sizeBits) + x - 1] = EMPTY;
            things[(( y - 1) << sizeBits) + x] = EMPTY;
            things[(( y - 1) << sizeBits) +  x + 1] = EMPTY;
            things[(y << sizeBits) + x - 1] = EMPTY;
            off = (y << sizeBits) + x; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            things[(y << sizeBits) +  x + 1] = EMPTY;
            things[(( y + 1) << sizeBits) + x - 1] = EMPTY;
            things[(( y + 1) << sizeBits) + x] = EMPTY;
            things[(( y + 1) << sizeBits) +  x + 1] = EMPTY;
            break;
        case 2:
            things[(( y - 1) << sizeBits) + x - 1] = EMPTY;
            things[(( y - 1) << sizeBits) + x] = EMPTY;
            things[(( y - 1) << sizeBits) +  x + 1] = EMPTY;
            things[(( y - 1) << sizeBits) +  x + 2] = EMPTY;
            things[(y << sizeBits) + x - 1] = EMPTY;
            off = (y << sizeBits) + x; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (y << sizeBits) +  x + 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            things[(y << sizeBits) +  x + 2] = EMPTY;
            things[(( y + 1) << sizeBits) + x - 1] = EMPTY;
            things[(( y + 1) << sizeBits) + x] = EMPTY;
            things[(( y + 1) << sizeBits) +  x + 1] = EMPTY;
            things[(( y + 1) << sizeBits) +  x + 2] = EMPTY;
            break;
        case 3:
            things[(( y - 3) << sizeBits) + x] = EMPTY;
            things[(( y - 3) << sizeBits) +  x + 1] = EMPTY;
            things[(( y - 2) << sizeBits) + x - 1] = EMPTY;
            things[(( y - 2) << sizeBits) + x] = EMPTY;
            things[(( y - 2) << sizeBits) +  x + 1] = EMPTY;
            things[(( y - 2) << sizeBits) +  x + 2] = EMPTY;
            things[(( y - 1) << sizeBits) + x - 2] = EMPTY;
            things[(( y - 1) << sizeBits) + x - 1] = EMPTY;
            off = (( y - 1) << sizeBits) + x; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (( y - 1) << sizeBits) +  x + 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            things[(( y - 1) << sizeBits) +  x + 2] = EMPTY;
            things[(( y - 1) << sizeBits) +  x + 3] = EMPTY;
            things[(y << sizeBits) + x - 2] = EMPTY;
            things[(y << sizeBits) + x - 1] = EMPTY;
            off = (y << sizeBits) + x; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (y << sizeBits) +  x + 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            things[(y << sizeBits) +  x + 2] = EMPTY;
            things[(y << sizeBits) +  x + 3] = EMPTY;
            things[(( y + 1) << sizeBits) + x - 1] = EMPTY;
            things[(( y + 1) << sizeBits) + x] = EMPTY;
            things[(( y + 1) << sizeBits) +  x + 1] = EMPTY;
            things[(( y + 1) << sizeBits) +  x + 2] = EMPTY;
            things[(( y + 2) << sizeBits) + x] = EMPTY;
            things[(( y + 2) << sizeBits) +  x + 1] = EMPTY;
            break;
        case 4:
            things[(( y - 3) << sizeBits) + x - 1] = EMPTY;
            things[(( y - 3) << sizeBits) + x] = EMPTY;
            things[(( y - 3) << sizeBits) +  x + 1] = EMPTY;
            things[(( y - 2) << sizeBits) + x - 2] = EMPTY;
            things[(( y - 2) << sizeBits) + x - 1] = EMPTY;
            things[(( y - 2) << sizeBits) + x] = EMPTY;
            things[(( y - 2) << sizeBits) +  x + 1] = EMPTY;
            things[(( y - 2) << sizeBits) +  x + 2] = EMPTY;
            things[(( y - 1) << sizeBits) + x - 3] = EMPTY;
            things[(( y - 1) << sizeBits) + x - 2] = EMPTY;
            off = (( y - 1) << sizeBits) + x - 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (( y - 1) << sizeBits) + x; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (( y - 1) << sizeBits) +  x + 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            things[(( y - 1) << sizeBits) +  x + 2] = EMPTY;
            things[(( y - 1) << sizeBits) +  x + 3] = EMPTY;
            things[(y << sizeBits) + x - 3] = EMPTY;
            things[(y << sizeBits) + x - 2] = EMPTY;
            off = (y << sizeBits) + x - 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (y << sizeBits) + x; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (y << sizeBits) +  x + 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            things[(y << sizeBits) +  x + 2] = EMPTY;
            things[(y << sizeBits) +  x + 3] = EMPTY;
            things[(( y + 1) << sizeBits) + x - 2] = EMPTY;
            things[(( y + 1) << sizeBits) + x - 1] = EMPTY;
            things[(( y + 1) << sizeBits) + x] = EMPTY;
            things[(( y + 1) << sizeBits) +  x + 1] = EMPTY;
            things[(( y + 1) << sizeBits) +  x + 2] = EMPTY;
            things[(( y + 2) << sizeBits) + x - 1] = EMPTY;
            things[(( y + 2) << sizeBits) + x] = EMPTY;
            things[(( y + 2) << sizeBits) +  x + 1] = EMPTY;
            break;
        case 5:
            things[(( y - 3) << sizeBits) + x - 1] = EMPTY;
            things[(( y - 3) << sizeBits) + x] = EMPTY;
            things[(( y - 3) << sizeBits) +  x + 1] = EMPTY;
            things[(( y - 2) << sizeBits) + x - 2] = EMPTY;
            things[(( y - 2) << sizeBits) + x - 1] = EMPTY;
            things[(( y - 2) << sizeBits) + x] = EMPTY;
            things[(( y - 2) << sizeBits) +  x + 1] = EMPTY;
            things[(( y - 2) << sizeBits) +  x + 2] = EMPTY;
            things[(( y - 1) << sizeBits) + x - 3] = EMPTY;
            things[(( y - 1) << sizeBits) + x - 2] = EMPTY;
            off = (( y - 1) << sizeBits) + x - 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (( y - 1) << sizeBits) + x; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (( y - 1) << sizeBits) +  x + 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            things[(( y - 1) << sizeBits) +  x + 2] = EMPTY;
            things[(( y - 1) << sizeBits) +  x + 3] = EMPTY;
            things[(y << sizeBits) + x - 3] = EMPTY;
            things[(y << sizeBits) + x - 2] = EMPTY;
            off = (y << sizeBits) + x - 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (y << sizeBits) + x; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (y << sizeBits) +  x + 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            things[(y << sizeBits) +  x + 2] = EMPTY;
            things[(y << sizeBits) +  x + 3] = EMPTY;
            things[(( y + 1) << sizeBits) + x - 3] = EMPTY;
            things[(( y + 1) << sizeBits) + x - 2] = EMPTY;
            off = (( y + 1) << sizeBits) + x - 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (( y + 1) << sizeBits) + x; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (( y + 1) << sizeBits) +  x + 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            things[(( y + 1) << sizeBits) +  x + 2] = EMPTY;
            things[(( y + 1) << sizeBits) +  x + 3] = EMPTY;
            things[(( y + 2) << sizeBits) + x - 2] = EMPTY;
            things[(( y + 2) << sizeBits) + x - 1] = EMPTY;
            things[(( y + 2) << sizeBits) + x] = EMPTY;
            things[(( y + 2) << sizeBits) +  x + 1] = EMPTY;
            things[(( y + 2) << sizeBits) +  x + 2] = EMPTY;
            things[(( y + 3) << sizeBits) + x - 1] = EMPTY;
            things[(( y + 3) << sizeBits) + x] = EMPTY;
            things[(( y + 3) << sizeBits) +  x + 1] = EMPTY;
            break;
        case 6:
            things[(( y - 4) << sizeBits) + x - 1] = EMPTY;
            things[(( y - 4) << sizeBits) + x] = EMPTY;
            things[(( y - 4) << sizeBits) +  x + 1] = EMPTY;
            things[(( y - 3) << sizeBits) + x - 2] = EMPTY;
            things[(( y - 3) << sizeBits) + x - 1] = EMPTY;
            things[(( y - 3) << sizeBits) + x] = EMPTY;
            things[(( y - 3) << sizeBits) +  x + 1] = EMPTY;
            things[(( y - 3) << sizeBits) +  x + 2] = EMPTY;
            things[(( y - 2) << sizeBits) + x - 3] = EMPTY;
            things[(( y - 2) << sizeBits) + x - 2] = EMPTY;
            off = (( y - 2) << sizeBits) + x - 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (( y - 2) << sizeBits) + x; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (( y - 2) << sizeBits) +  x + 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            things[(( y - 2) << sizeBits) +  x + 2] = EMPTY;
            things[(( y - 2) << sizeBits) +  x + 3] = EMPTY;
            things[(( y - 1) << sizeBits) + x - 4] = EMPTY;
            things[(( y - 1) << sizeBits) + x - 3] = EMPTY;
            off = (( y - 1) << sizeBits) + x - 2; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (( y - 1) << sizeBits) + x - 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (( y - 1) << sizeBits) + x; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (( y - 1) << sizeBits) +  x + 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (( y - 1) << sizeBits) +  x + 2; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            things[(( y - 1) << sizeBits) +  x + 3] = EMPTY;
            things[(( y - 1) << sizeBits) +  x + 4] = EMPTY;
            things[(y << sizeBits) + x - 4] = EMPTY;
            things[(y << sizeBits) + x - 3] = EMPTY;
            off = (y << sizeBits) + x - 2; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (y << sizeBits) + x - 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (y << sizeBits) + x; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (y << sizeBits) +  x + 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (y << sizeBits) +  x + 2; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            things[(y << sizeBits) +  x + 3] = EMPTY;
            things[(y << sizeBits) +  x + 4] = EMPTY;
            things[(( y + 1) << sizeBits) + x - 4] = EMPTY;
            things[(( y + 1) << sizeBits) + x - 3] = EMPTY;
            off = (( y + 1) << sizeBits) + x - 2; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (( y + 1) << sizeBits) + x - 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (( y + 1) << sizeBits) + x; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (( y + 1) << sizeBits) +  x + 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (( y + 1) << sizeBits) +  x + 2; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            things[(( y + 1) << sizeBits) +  x + 3] = EMPTY;
            things[(( y + 1) << sizeBits) +  x + 4] = EMPTY;
            things[(( y + 2) << sizeBits) + x - 3] = EMPTY;
            things[(( y + 2) << sizeBits) + x - 2] = EMPTY;
            off = (( y + 2) << sizeBits) + x - 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (( y + 2) << sizeBits) + x; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (( y + 2) << sizeBits) +  x + 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            things[(( y + 2) << sizeBits) +  x + 2] = EMPTY;
            things[(( y + 2) << sizeBits) +  x + 3] = EMPTY;
            things[(( y + 3) << sizeBits) + x - 2] = EMPTY;
            things[(( y + 3) << sizeBits) + x - 1] = EMPTY;
            things[(( y + 3) << sizeBits) + x] = EMPTY;
            things[(( y + 3) << sizeBits) +  x + 1] = EMPTY;
            things[(( y + 3) << sizeBits) +  x + 2] = EMPTY;
            things[(( y + 4) << sizeBits) + x - 1] = EMPTY;
            things[(( y + 4) << sizeBits) + x] = EMPTY;
            things[(( y + 4) << sizeBits) +  x + 1] = EMPTY;
            break;
        case 7:
            things[(( y - 5) << sizeBits) + x - 1] = EMPTY;
            things[(( y - 5) << sizeBits) + x] = EMPTY;
            things[(( y - 5) << sizeBits) +  x + 1] = EMPTY;
            things[(( y - 4) << sizeBits) + x - 2] = EMPTY;
            things[(( y - 4) << sizeBits) + x - 1] = EMPTY;
            things[(( y - 4) << sizeBits) + x] = EMPTY;
            things[(( y - 4) << sizeBits) +  x + 1] = EMPTY;
            things[(( y - 4) << sizeBits) +  x + 2] = EMPTY;
            things[(( y - 3) << sizeBits) + x - 3] = EMPTY;
            things[(( y - 3) << sizeBits) + x - 2] = EMPTY;
            off = (( y - 3) << sizeBits) + x - 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (( y - 3) << sizeBits) + x; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (( y - 3) << sizeBits) +  x + 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            things[(( y - 3) << sizeBits) +  x + 2] = EMPTY;
            things[(( y - 3) << sizeBits) +  x + 3] = EMPTY;
            things[(( y - 2) << sizeBits) + x - 4] = EMPTY;
            things[(( y - 2) << sizeBits) + x - 3] = EMPTY;
            off = (( y - 2) << sizeBits) + x - 2; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (( y - 2) << sizeBits) + x - 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (( y - 2) << sizeBits) + x; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (( y - 2) << sizeBits) +  x + 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (( y - 2) << sizeBits) +  x + 2; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            things[(( y - 2) << sizeBits) +  x + 3] = EMPTY;
            things[(( y - 2) << sizeBits) +  x + 4] = EMPTY;
            things[(( y - 1) << sizeBits) + x - 5] = EMPTY;
            things[(( y - 1) << sizeBits) + x - 4] = EMPTY;
            off = (( y - 1) << sizeBits) + x - 3; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (( y - 1) << sizeBits) + x - 2; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (( y - 1) << sizeBits) + x - 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (( y - 1) << sizeBits) + x; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (( y - 1) << sizeBits) +  x + 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (( y - 1) << sizeBits) +  x + 2; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (( y - 1) << sizeBits) +  x + 3; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            things[(( y - 1) << sizeBits) +  x + 4] = EMPTY;
            things[(( y - 1) << sizeBits) +  x + 5] = EMPTY;
            things[(y << sizeBits) + x - 5] = EMPTY;
            things[(y << sizeBits) + x - 4] = EMPTY;
            off = (y << sizeBits) + x - 3; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (y << sizeBits) + x - 2; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (y << sizeBits) + x - 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (y << sizeBits) + x; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (y << sizeBits) +  x + 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (y << sizeBits) +  x + 2; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (y << sizeBits) +  x + 3; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            things[(y << sizeBits) +  x + 4] = EMPTY;
            things[(y << sizeBits) +  x + 5] = EMPTY;
            things[(( y + 1) << sizeBits) + x - 5] = EMPTY;
            things[(( y + 1) << sizeBits) + x - 4] = EMPTY;
            off = (( y + 1) << sizeBits) + x - 3; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (( y + 1) << sizeBits) + x - 2; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (( y + 1) << sizeBits) + x - 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (( y + 1) << sizeBits) + x; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (( y + 1) << sizeBits) +  x + 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (( y + 1) << sizeBits) +  x + 2; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (( y + 1) << sizeBits) +  x + 3; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            things[(( y + 1) << sizeBits) +  x + 4] = EMPTY;
            things[(( y + 1) << sizeBits) +  x + 5] = EMPTY;
            things[(( y + 2) << sizeBits) + x - 4] = EMPTY;
            things[(( y + 2) << sizeBits) + x - 3] = EMPTY;
            off = (( y + 2) << sizeBits) + x - 2; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (( y + 2) << sizeBits) + x - 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (( y + 2) << sizeBits) + x; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (( y + 2) << sizeBits) +  x + 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (( y + 2) << sizeBits) +  x + 2; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            things[(( y + 2) << sizeBits) +  x + 3] = EMPTY;
            things[(( y + 2) << sizeBits) +  x + 4] = EMPTY;
            things[(( y + 3) << sizeBits) + x - 3] = EMPTY;
            things[(( y + 3) << sizeBits) + x - 2] = EMPTY;
            off = (( y + 3) << sizeBits) + x - 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (( y + 3) << sizeBits) + x; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (( y + 3) << sizeBits) +  x + 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            things[(( y + 3) << sizeBits) +  x + 2] = EMPTY;
            things[(( y + 3) << sizeBits) +  x + 3] = EMPTY;
            things[(( y + 4) << sizeBits) + x - 2] = EMPTY;
            things[(( y + 4) << sizeBits) + x - 1] = EMPTY;
            things[(( y + 4) << sizeBits) + x] = EMPTY;
            things[(( y + 4) << sizeBits) +  x + 1] = EMPTY;
            things[(( y + 4) << sizeBits) +  x + 2] = EMPTY;
            things[(( y + 5) << sizeBits) + x - 1] = EMPTY;
            things[(( y + 5) << sizeBits) + x] = EMPTY;
            things[(( y + 5) << sizeBits) +  x + 1] = EMPTY;
            break;
        case 8:
            things[(( y - 6) << sizeBits) + x - 1] = EMPTY;
            things[(( y - 6) << sizeBits) + x] = EMPTY;
            things[(( y - 6) << sizeBits) +  x + 1] = EMPTY;
            things[(( y - 5) << sizeBits) + x - 3] = EMPTY;
            things[(( y - 5) << sizeBits) + x - 2] = EMPTY;
            things[(( y - 5) << sizeBits) + x - 1] = EMPTY;
            things[(( y - 5) << sizeBits) + x] = EMPTY;
            things[(( y - 5) << sizeBits) +  x + 1] = EMPTY;
            things[(( y - 5) << sizeBits) +  x + 2] = EMPTY;
            things[(( y - 5) << sizeBits) +  x + 3] = EMPTY;
            things[(( y - 4) << sizeBits) + x - 4] = EMPTY;
            things[(( y - 4) << sizeBits) + x - 3] = EMPTY;
            things[(( y - 4) << sizeBits) + x - 2] = EMPTY;
            off = (( y - 4) << sizeBits) + x - 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (( y - 4) << sizeBits) + x; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (( y - 4) << sizeBits) +  x + 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            things[(( y - 4) << sizeBits) +  x + 2] = EMPTY;
            things[(( y - 4) << sizeBits) +  x + 3] = EMPTY;
            things[(( y - 4) << sizeBits) +  x + 4] = EMPTY;
            things[(( y - 3) << sizeBits) + x - 5] = EMPTY;
            things[(( y - 3) << sizeBits) + x - 4] = EMPTY;
            things[(( y - 3) << sizeBits) + x - 3] = EMPTY;
            off = (( y - 3) << sizeBits) + x - 2; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (( y - 3) << sizeBits) + x - 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (( y - 3) << sizeBits) + x; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (( y - 3) << sizeBits) +  x + 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (( y - 3) << sizeBits) +  x + 2; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            things[(( y - 3) << sizeBits) +  x + 3] = EMPTY;
            things[(( y - 3) << sizeBits) +  x + 4] = EMPTY;
            things[(( y - 3) << sizeBits) +  x + 5] = EMPTY;
            things[(( y - 2) << sizeBits) + x - 5] = EMPTY;
            things[(( y - 2) << sizeBits) + x - 4] = EMPTY;
            off = (( y - 2) << sizeBits) + x - 3; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (( y - 2) << sizeBits) + x - 2; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (( y - 2) << sizeBits) + x - 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (( y - 2) << sizeBits) + x; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (( y - 2) << sizeBits) +  x + 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (( y - 2) << sizeBits) +  x + 2; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (( y - 2) << sizeBits) +  x + 3; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            things[(( y - 2) << sizeBits) +  x + 4] = EMPTY;
            things[(( y - 2) << sizeBits) +  x + 5] = EMPTY;
            things[(( y - 1) << sizeBits) + x - 6] = EMPTY;
            things[(( y - 1) << sizeBits) + x - 5] = EMPTY;
            off = (( y - 1) << sizeBits) + x - 4; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (( y - 1) << sizeBits) + x - 3; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (( y - 1) << sizeBits) + x - 2; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (( y - 1) << sizeBits) + x - 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (( y - 1) << sizeBits) + x; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (( y - 1) << sizeBits) +  x + 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (( y - 1) << sizeBits) +  x + 2; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (( y - 1) << sizeBits) +  x + 3; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (( y - 1) << sizeBits) +  x + 4; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            things[(( y - 1) << sizeBits) +  x + 5] = EMPTY;
            things[(( y - 1) << sizeBits) +  x + 6] = EMPTY;
            things[(y << sizeBits) + x - 6] = EMPTY;
            things[(y << sizeBits) + x - 5] = EMPTY;
            off = (y << sizeBits) + x - 4; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (y << sizeBits) + x - 3; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (y << sizeBits) + x - 2; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (y << sizeBits) + x - 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (y << sizeBits) + x; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (y << sizeBits) +  x + 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (y << sizeBits) +  x + 2; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (y << sizeBits) +  x + 3; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (y << sizeBits) +  x + 4; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            things[(y << sizeBits) +  x + 5] = EMPTY;
            things[(y << sizeBits) +  x + 6] = EMPTY;
            things[(( y + 1) << sizeBits) + x - 6] = EMPTY;
            things[(( y + 1) << sizeBits) + x - 5] = EMPTY;
            off = (( y + 1) << sizeBits) + x - 4; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (( y + 1) << sizeBits) + x - 3; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (( y + 1) << sizeBits) + x - 2; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (( y + 1) << sizeBits) + x - 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (( y + 1) << sizeBits) + x; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (( y + 1) << sizeBits) +  x + 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (( y + 1) << sizeBits) +  x + 2; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (( y + 1) << sizeBits) +  x + 3; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (( y + 1) << sizeBits) +  x + 4; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            things[(( y + 1) << sizeBits) +  x + 5] = EMPTY;
            things[(( y + 1) << sizeBits) +  x + 6] = EMPTY;
            things[(( y + 2) << sizeBits) + x - 5] = EMPTY;
            things[(( y + 2) << sizeBits) + x - 4] = EMPTY;
            off = (( y + 2) << sizeBits) + x - 3; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (( y + 2) << sizeBits) + x - 2; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (( y + 2) << sizeBits) + x - 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (( y + 2) << sizeBits) + x; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (( y + 2) << sizeBits) +  x + 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (( y + 2) << sizeBits) +  x + 2; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (( y + 2) << sizeBits) +  x + 3; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            things[(( y + 2) << sizeBits) +  x + 4] = EMPTY;
            things[(( y + 2) << sizeBits) +  x + 5] = EMPTY;
            things[(( y + 3) << sizeBits) + x - 5] = EMPTY;
            things[(( y + 3) << sizeBits) + x - 4] = EMPTY;
            things[(( y + 3) << sizeBits) + x - 3] = EMPTY;
            off = (( y + 3) << sizeBits) + x - 2; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (( y + 3) << sizeBits) + x - 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (( y + 3) << sizeBits) + x; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (( y + 3) << sizeBits) +  x + 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (( y + 3) << sizeBits) +  x + 2; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            things[(( y + 3) << sizeBits) +  x + 3] = EMPTY;
            things[(( y + 3) << sizeBits) +  x + 4] = EMPTY;
            things[(( y + 3) << sizeBits) +  x + 5] = EMPTY;
            things[(( y + 4) << sizeBits) + x - 4] = EMPTY;
            things[(( y + 4) << sizeBits) + x - 3] = EMPTY;
            things[(( y + 4) << sizeBits) + x - 2] = EMPTY;
            off = (( y + 4) << sizeBits) + x - 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (( y + 4) << sizeBits) + x; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            off = (( y + 4) << sizeBits) +  x + 1; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }
            things[(( y + 4) << sizeBits) +  x + 2] = EMPTY;
            things[(( y + 4) << sizeBits) +  x + 3] = EMPTY;
            things[(( y + 4) << sizeBits) +  x + 4] = EMPTY;
            things[(( y + 5) << sizeBits) + x - 3] = EMPTY;
            things[(( y + 5) << sizeBits) + x - 2] = EMPTY;
            things[(( y + 5) << sizeBits) + x - 1] = EMPTY;
            things[(( y + 5) << sizeBits) + x] = EMPTY;
            things[(( y + 5) << sizeBits) +  x + 1] = EMPTY;
            things[(( y + 5) << sizeBits) +  x + 2] = EMPTY;
            things[(( y + 5) << sizeBits) +  x + 3] = EMPTY;
            things[(( y + 6) << sizeBits) + x - 1] = EMPTY;
            things[(( y + 6) << sizeBits) + x] = EMPTY;
            things[(( y + 6) << sizeBits) +  x + 1] = EMPTY;
            break;

        default:
            throw new Error("Unhandled width: " + width)

    }
}
