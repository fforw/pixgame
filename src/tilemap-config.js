
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
export const SOIL = 11;
export const SOIL_2 = 12;
export const TILE_FLOOR = 13;

// things
export const EMPTY = 1;
export const PLANT = 2;
export const PLANT_2 = 3;
export const PLANT_3 = 4;
export const DOT = 5;
export const _RIVER = 6;
export const _WOODS = 7;
export const _SAND = 8;
export const _ICE = 9;
export const WALL_END = 10;
export const BLOCKED = 11;      // blocking from here on
export const _WATER = 12;
export const LARGE_TREE = 13;
export const LARGE_TREE_2 = 14;
export const SMALL_TREE = 15;
export const SMALL_TREE_2 = 16;
export const SMALL_TREE_3 = 17;
export const BOULDER = 18;
export const BOULDER_2 = 19;
export const BOULDER_3 = 20;
export const HOUSE = 21;
export const IGLOO = 22;
export const WALL = 23;
export const WALL_TOP = 24;
export const WALL_FRONT = 25;
export const FRIDGE = 26;

export const thingNames = [
    "-",
    "EMPTY",
    "PLANT",
    "PLANT_2",
    "PLANT_3",
    "DOT",
    "_RIVER",
    "_WOODS",
    "_SAND",
    "WALL_END",
    "BLOCKED",
    "_WATER",
    "LARGE_TREE",
    "LARGE_TREE_2",
    "SMALL_TREE",
    "SMALL_TREE_2",
    "SMALL_TREE_3",
    "BOULDER",
    "BOULDER_2",
    "BOULDER_3",
    "HOUSE",
    "IGLOO",
    "WALL",
    "WALL_TOP",
    "WALL_FRONT",
    "FRIDGE",
];
export const thingWalkability = [
    1,
    1, // EMPTY
    1, // PLANT
    1, // PLANT_2
    1, // PLANT_3
    1, // DOT
    3, // _RIVER
    1, // _WOODS
    1, // _SAND
    1.5, // _ICE
    1, // WALL_END
    4, // BLOCKED
    4, // _WATER
    4, // LARGE_TREE
    4, // LARGE_TREE_2
    3, // SMALL_TREE
    3, // SMALL_TREE_2
    3, // SMALL_TREE_3
    4, // BOULDER
    3, // BOULDER_2
    4, // BOULDER_3
    4, // HOUSE
    4, // IGLOO
    4, // WALL
    4, // WALL_TOP
];
export const tileVillageRating = [
    0,      // DARK
    0,      // WATER
    0.5,    // SAND
    1,      // GRASS
    1,      // DIRT
    -1,     // ROCK
    1,      // WOODS
    1,      // WOODS2
    0,      // RIVER
    0.5,    // ICE
    0,      // ICE2
];
export const TEXTURES = [
    "ms-dark.png",
    "ms-water.png",
    "ms-sand.png",
    "ms-grass.png",
    "ms-dirt.png",
    "ms-rock.png",
    "ms-woods.png",
    "ms-woods2.png",
    "ms-river.png",
    "ms-ice.png",
    "ms-ice2.png",
    "ms-soil.png",
    "ms-soil2.png",
    "tile.png"
];

export const MARCHING_SQUARE_TEXTURES = (() => {

    let i;
    for (i = 0; i < TEXTURES.length; i++)
    {
        const texture = TEXTURES[i];
        if (texture.indexOf("ms-") !== 0)
        {
            break;
        }
    }
    //console.log("MARCHING_SQUARE_TEXTURES", i);
    return i;
    
})();

export const THING_TEXTURES = [
    null,
    null, //"marker3.png",
    "plant.png",
    "plant2.png",
    "plant3.png",
    "dot.png",
    null,
    null,
    null, //"marker.png",
    null, //"marker2.png",
    "wall-end.png",
    null,
    null,
    "large-tree.png",
    "large-tree2.png",
    "small-tree.png",
    "small-tree2.png",
    "small-tree3.png",
    "boulder.png",
    "boulder2.png",
    "boulder3.png",
    "house.png",
    "igloo.png",
    "wall.png",
    "wall-top.png",
    "wall-front.png",
    "fridge.png",
];

export const THING_SHADOW_TEXTURES = [
    null,
    null,                   // EMPTY
    null,                   // PLANT
    null,                   // PLANT_2
    null,                   // PLANT_3
    null,                   // DOT
    null,                   // _RIVER
    null,                   // _WOODS
    null,                   // _SAND
    null,                   // _ICE
    "wall-shadow-end.png",  // WALL_END
    null,                   // BLOCKED
    null,                   // _WATER
    "large-shadow.png",     // LARGE_TREE
    "large-shadow.png",     // LARGE_TREE_2
    null,                   // SMALL_TREE
    null,                   // SMALL_TREE_2
    null,                   // SMALL_TREE_3
    null,                   // BOULDER
    null,                   // BOULDER_2
    null,                   // BOULDER_3
    null,                   // HOUSE
    null,                   // IGLOO
    null,                   // WALL
    "wall-shadow.png",      // WALL_TOP
    null                    // FRIDGE
];
