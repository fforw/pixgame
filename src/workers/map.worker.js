import WorldMap from "../WorldMap";

onmessage = function (ev) {

    const {type, ticket} = ev.data;

    if (type === "GENERATE")
    {
        const { seed } = ev.data;

        console.log("Generating world '" + seed + "'");

        const map = WorldMap.generate(
            2048,
            seed,

            percent => postMessage({
                type: "PROGRESS",
                percent,
                ticket
            }));

        postMessage({
            type: "MAPRESULT",
            ticket,
            payload: map.serialize()
        });
    }
    else
    {
        postMessage({
            type: "ERROR_UNHANDLED",
            ticket
        })
    }

};




