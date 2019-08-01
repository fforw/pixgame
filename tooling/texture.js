const path = require("path");
const util = require("util");
const fs = require("fs");

const Jimp = require("jimp");
const SimplexNoise = require("simplex-noise");
const Prando = require("prando");
const pack = require('bin-pack');


const random = new Prando("gimme-some-good-stones");
const noise = new SimplexNoise(() => random.next());


const size = 2048;

Jimp.create(size, size).then(img => {

    const { data } = img.bitmap;

    let offset = 0;
    for (let y =0 ; y < size; y++)
    {
        for (let x = 0; x < size; x++)
        {

            let v = noise.noise2D(x * 0.002,y * 0.002);

            v = 1 / v * 255;


            data[offset++] = v;
            data[offset++] = v;
            data[offset++] = v;
            data[offset++] = 255;

        }
    }


    img.writeAsync(path.join(__dirname, "../output.png"))
})
