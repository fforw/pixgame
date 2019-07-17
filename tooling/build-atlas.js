const path = require("path");
const fs = require("fs");

const Jimp = require("jimp");
const ShelfPack = require('@mapbox/shelf-pack');

const ATLASES = [
    "../atlas/src"
];

const OUTPUT_DIR = "../atlas";


function endsWith(file, suffix)
{

    return !suffix || file.lastIndexOf(suffix) === file.length - suffix.length;
}

const EMPTY_ATLAS = { frames: {} };

function readAtlasJSON(path)
{
    if (fs.existsSync(path))
    {
        return JSON.parse(fs.readFileSync(path, "UTF-8"));
    }
    else
    {
        return EMPTY_ATLAS;
    }
}


function reduceMax(a,b)
{
    return Math.max(a,b);
}


/**
 * Allows the use of absolute pixel pivots in the template which are turned into fractional pivots
 * @param frame
 * @return {object} frame with fractional pivot
 */
function pixelPivot(frame, w, h)
{
    if (!frame)
    {
        return null;
    }

    const { x, y } = frame.pivot;

    if (x > 1)
    {

        frame.pivot.x  /= w
    }
    if (y > 1)
    {

        frame.pivot.y  /= h
    }

    return frame;
}


function generateAtlas(atlasPath, index)
{
    const curr = path.join(__dirname, atlasPath);

    console.log("Generate for", curr);

    const predefinedAtlas = readAtlasJSON(path.join(curr, "atlas.json"));

    console.log("Template = ", predefinedAtlas)

    const promises = [];

    const sprite = new ShelfPack(1024, 1024);

    fs.readdirSync(curr).forEach(file => {

        if (endsWith(file, ".png"))
        {
            promises.push(
                Jimp.read(path.join(curr, file)).then(img => {

                    //console.log("READ IMAGE", file, img.getWidth() + "x" + img.getHeight())

                    return ({
                        id: file,
                        width: img.getWidth(),
                        height: img.getHeight(),
                        img
                    });
                })
            );
        }
    });

    Promise.all(promises).then(images => {

        sprite.pack(images, {inPlace: true});

        //console.log("IMAGES", images);

        const width = images.map(img => +img.x + img.width).reduce(reduceMax, 0);
        const height = images.map(img => +img.y + img.height).reduce(reduceMax, 0);

        console.log("Actual atlas dimensions: ", width, height);

        Jimp.create(width, height, 0x00000000).then(atlasImg => {

            const atlas = {frames: {}}

            images.forEach(function (bin) {

                const {x, y, width: w, height: h, img} = bin;

                atlas.frames[bin.id] = {

                    // default values ...
                    rotated: false,
                    trimmed: false,
                    spriteSourceSize: {
                        x: 0,
                        y: 0,
                        w,
                        h
                    },
                    sourceSize: {
                        w,
                        h
                    },
                    pivot: {
                        x: 0.5,
                        y: 0.5
                    },
                    // ... potentially overridden by values from the atlas template
                    ... pixelPivot(predefinedAtlas.frames[bin.id], w, h),

                    // ... but not "frame"
                    frame: {
                        x,
                        y,
                        w,
                        h
                    },

                };

                atlasImg.blit(img, x, y)
            });
            const imageName = "atlas-" + index + ".png";

            atlas.meta = {
                app: "http://ww.github.com/fforw/pixgame",
                version: "0.1",
                image: imageName,
                format: "RGBA8888",
                size: {
                    w: width,
                    h: height
                },
                scale: "1"
            };

            fs.writeFileSync(
                path.join(__dirname, OUTPUT_DIR, "atlas-" + index + ".json"),
                JSON.stringify(atlas, null, 4),
                "UTF-8"
            );

            atlasImg.writeAsync(path.join(__dirname, OUTPUT_DIR, imageName));

        });

    })
    .catch(e => console.error("Error reading images", e))
}


for (let i = 0; i < ATLASES.length; i++)
{
    const atlasPath = ATLASES[i];
    generateAtlas(atlasPath, i);
}

