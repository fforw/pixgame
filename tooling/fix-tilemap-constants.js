
const path = require("path");
const fs = require("fs");

const configFile = path.join(__dirname, "../src/tilemap-config.js");
const source = fs.readFileSync(configFile, "UTF-8");

let prevValue = 0;

fs.writeFileSync(configFile, source.replace(/const ([A-Z0-9_]+) = ([0-9]+);/g, (m,name,sValue) => {

    let value = +sValue;

    if (value !== 0 && value !== 1)
    {
        value = prevValue + 1;
    }

    console.log(name,value);
    prevValue = value;



    return `const ${name} = ${value};`

}), "UTF-8");
