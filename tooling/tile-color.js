const path = require("path");
const util = require("util");
const fs = require("fs");

const Jimp = require("jimp");
const pack = require('bin-pack');





function determineColor(paths)
{
    const promises = [];
    for (let i = 0; i < paths.length; i++)
    {
        promises.push(
            Jimp.read(paths[i])
        );
    }

    Promise.all(promises).then(images => {

        for (let i = 0; i < images.length; i++)
        {
            const image = images[i];

            image.resize(1,1, Jimp.RESIZE_HERMITE)

            const pixelColor = image.getPixelColor(0, 0);

            const r = (pixelColor >> 24) & 0xff;
            const g = (pixelColor >> 16) & 0xff;
            const b = (pixelColor >> 8) & 0xff;

            console.log(`
            
    // ${paths[i]}
            
    data[dataOffset++] = ${r};
    data[dataOffset++] = ${g};
    data[dataOffset++] = ${b};
    data[dataOffset++] = 255;
            `);



        }

    })
    .catch(e => console.error("Error reading images", e))
}


const argv = require("minimist")(process.argv.slice(2));
console.dir(argv);

const positional = argv._;
determineColor(positional);


