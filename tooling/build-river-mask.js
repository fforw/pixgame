const path = require("path");
const fs = require("fs");

const Jimp = require("jimp");
const ShelfPack = require('@mapbox/shelf-pack');


Jimp.read(path.join(__dirname, "../src/assets/river-mask.png")).then(img => {


    const { data, width, height} = img.bitmap;

    //console.log({width, height})

    for (let size = 0; size < 8; size++)
    {
        let s = "case " + (size + 1)+ ":\n";
        let offset = size * 64;
        for (let y=0; y < height; y++)
        {
            for (let x=0; x < 16; x++)
            {
                if (data[ offset + 3])
                {

                    const mx = x - 8;
                    const my = y - 8;

                    const xNegative = my < 0;
                    const yNegative = my < 0;
                    const yNotNull = my !== 0;
                    const xNotNull = mx !== 0;
                    const offsetExpression =
                        (yNotNull ? "( y " + (yNegative ? "-" : "+") + " " + Math.abs(my) + ")" : "y") + " * size + " +
                         (xNotNull ? (Math.sign(mx) > 0 ? " x + " : "x - ") + Math.abs(mx) : "x") ;
                    if (data[offset])
                    {
                        s += "    things[" + offsetExpression + "] = _RIVER;\n";
                    }
                    else
                    {
                        s += "    off = " + offsetExpression + "; if (tiles[off] !== WATER) {  tiles[off] = RIVER; things[off] = _RIVER; }\n";
                    }

                }

                offset += 4;
            }
            offset += -(16 * 4) + width * 4;
        }
        s+="    break;"
        console.log(s);
    }
}).catch(err => {

    console.error("ERROR", err);
})

