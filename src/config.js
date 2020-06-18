
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
export const WOOD = 13;
export const TILE_FLOOR = 14;

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
export const CASTLE_GATE = 11;
export const BLOCKED = 12;      // blocking from here on
export const OCCUPIED = 13;      
export const OCCUPIED_MOVING = 14;
export const _WATER = 15;
export const LARGE_TREE = 16;
export const LARGE_TREE_2 = 17;
export const SMALL_TREE = 18;
export const SMALL_TREE_2 = 19;
export const SMALL_TREE_3 = 20;
export const BOULDER = 21;
export const BOULDER_2 = 22;
export const BOULDER_3 = 23;
export const HOUSE = 24;
export const IGLOO = 25;
export const WALL = 26;
export const WALL_TOP = 27;
export const WALL_FRONT = 28;
export const FRIDGE = 29;
export const CASTLE_CORNER = 30;
export const CASTLE_CORNER2 = 31;
export const CASTLE_VERTICAL_SHADOW = 32;
export const CASTLE_VERTICAL = 33;
export const CASTLE_WALL = 34;
export const CASTLE_RIVER = 35;
export const HOUSE1 = 36;
export const HOUSE2 = 37;
export const HOUSE3 = 38;
export const HOUSE4 = 39;
export const CITY_HOUSE1 = 40;
export const CITY_HOUSE2 = 41;
export const CITY_HOUSE3 = 42;
export const CITY_HOUSE4 = 43;

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
    "_ICE",
    "WALL_END",
    "CASTLE_GATE",
    "BLOCKED",
    "OCCUPIED",
    "OCCUPIED_MOVING",
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
    "CASTLE_CORNER",
    "CASTLE_CORNER2",
    "CASTLE_VERTICAL_SHADOW",
    "CASTLE_VERTICAL",
    "CASTLE_WALL",
    "CASTLE_RIVER",
    "HOUSE1",
    "HOUSE2",
    "HOUSE3",
    "HOUSE4",
    "CITY_HOUSE1",
    "CITY_HOUSE2",
    "CITY_HOUSE3",
    "CITY_HOUSE4",
];
export const thingWalkability = [
    1,
    1,      // EMPTY
    1,      // PLANT
    1,      // PLANT_2
    1,      // PLANT_3
    1,      // DOT
    3,      // _RIVER
    1,      // _WOODS
    1,      // _SAND
    1.5,    // _ICE
    1,      // WALL_END
    1,      // CASTLE_GATE
    4,      // BLOCKED
    4,      // OCCUPIED
    4,      // OCCUPIED_MOVING
    4,      // _WATER
    4,      // LARGE_TREE
    4,      // LARGE_TREE_2
    3,      // SMALL_TREE
    3,      // SMALL_TREE_2
    4,      // SMALL_TREE_3
    4,      // BOULDER
    4,      // BOULDER_2
    3,      // BOULDER_3
    1,      // HOUSE
    1,      // IGLOO
    4,      // WALL
    4,      // WALL_TOP
    4,      // WALL_FRONT
    4,      // FRIDGE
    4,      // CASTLE_CORNER
    4,      // CASTLE_CORNER2
    4,      // CASTLE_VERTICAL_SHADOW
    4,      // CASTLE_VERTICAL
    4,      // CASTLE_WALL
    4,      // CASTLE_RIVER
    4,      // HOUSE1
    4,      // HOUSE2
    4,      // HOUSE3
    4,      // HOUSE4
    4,      // CITY_HOUSE1
    4,      // CITY_HOUSE2
    4,      // CITY_HOUSE3
    4,      // CITY_HOUSE4
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
    1,      // SOIL
    1,      // SOIL_2
    1,      // WOOD
    1       // TILE_FLOOR
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
    "ms-wood.png",
    "tile.png",
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
    null,
    null,
    "wall-end.png",
    "castle-gate.png",
    null,
    "marker.png",
    "marker3.png",
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
    "castle-corner.png",
    "castle-corner2.png",
    "castle-vertical-shadow.png",
    "castle-vertical.png",
    "castle-wall.png",
    "castle-river.png",
    "house1.png",
    "house2.png",
    "house3.png",
    "house4.png",
    "city-house1.png",
    "city-house2.png",
    "city-house3.png",
    "city-house4.png",
    "meeple-body-blue.png",
    "meeple-body-green.png",
    "meeple-body-red.png",
    "meeple-hair-black.png",
    "meeple-hair-blond.png",
    "meeple-hair-brown.png",
    "meeple-hair-red.png",
    "meeple-head-dark.png",
    "meeple-head-pale.png",
    "meeple-head-tan.png",
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
    null,                   // CASTLE_GATE
    null,                   // BLOCKED
    null,                   // OCCUPIED
    null,                   // OCCUPIED_MOVING
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
    "wall-shadow.png",      // WALL
    null,                   // WALL_TOP
    null,                   // WALL_FRONT
    null,                   // FRIDGE
    null,                   // CASTLE_CORNER
    null,                   // CASTLE_CORNER2
    null,                   // CASTLE_VERTICAL_SHADOW
    null,                   // CASTLE_VERTICAL
    null,                   // CASTLE_WALL
    null,                   // CASTLE_RIVER
    null,                   // HOUSE1
    null,                   // HOUSE2
    null                    // HOUSE3
];
export const tileNames = [
    "DARK",
    "WATER",
    "SAND",
    "GRASS",
    "DIRT",
    "ROCK",
    "WOODS",
    "WOODS2",
    "RIVER",
    "ICE",
    "ICE2",
    "SOIL",
    "SOIL_2",
    "TILE_FLOOR",
    "WOOD"
];

export const ITEM_AXE = 1;
export const ITEM_PICKAXE = 2;
export const ITEM_HOE = 3;
export const ITEM_SHOVEL = 4;
export const ITEM_SWORD = 5;
export const ITEM_WOOD = 6;

export const ITEM_TEXTURES = [
    null,
    "tool-axe.png",
    "tool-pickaxe.png",
    "tool-hoe.png",
    "tool-shovel.png",
    "weapon-sword.png",
    "wood-logs.png"
];

