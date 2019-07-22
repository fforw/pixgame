import MapWorker from "./workers/map.worker";
import WorldMap from "./WorldMap";


let counter = 0;

const storage = {};

const worker = new MapWorker();
worker.addEventListener("message", event => {

    const { data } = event;

    const { type, ticket } = data;
    const entry = storage[ticket];

    if (!entry)
    {
        console.log("INVALID TICKET: " + JSON.stringify(data));
        return;
    }
    
    const { resolve, onProgress } = entry;

    switch (type)
    {
        case "MAPRESULT":
            resolve(
                WorldMap.deserialize(data.payload)
            );

            storage[ticket] = null;
            break;
        case "PROGRESS":
            if (onProgress)
            {
                onProgress(data.percent);
            }
            else
            {
                console.log(Math.round(data.percent * 100) + "%");
            }
            break;
    }

}, true);

export default function generateAsync(seed, onProgress)
{
    const ticket = ++counter;

    return new Promise((resolve => {

        worker.postMessage({
            type: "GENERATE",
            seed,
            ticket
        });

        storage[ticket] = {resolve, onProgress};
    }));

}
