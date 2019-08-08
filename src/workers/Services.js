import WPWorker from "./_services.worker";
import WorldMap from "../WorldMap";

import {
    MESSAGE_CANCEL_PATH,
    QUERY_GENERATE,
    QUERY_PATH,
    RESPONSE_ERROR,
    RESPONSE_MAP,
    RESPONSE_PATH,
    RESPONSE_PROGRESS,
    RESPONSE_SEGMENT
} from "./services-constants";


let counter = 0;

const storage = new Map();

const webWorker = WPWorker();

const secret = Symbol("Services Secret");

function processWorkerMessage(data)
{
    //console.log("RESPONSE", data);

    const { ticket, message } = data;

    const entry = storage.get(ticket);
    if (!entry)
    {
        console.error("INVALID TICKET: " + JSON.stringify(message));
        return;
    }

    const { resolve, reject } = entry[secret];

    const {type} = message;

    switch (type)
    {
        case RESPONSE_MAP:
            resolve(
                WorldMap.deserialize(message.payload)
            );
            break;
        case RESPONSE_PROGRESS:
        {

            const {onProgress} = entry;
            if (onProgress)
            {
                onProgress(message.percent);
            }
            else
            {
                console.log(Math.round(message.percent * 100) + "%");
            }
            break;
        }
        case RESPONSE_SEGMENT:
        {
            if (entry.onSegment(message.path) === false)
            {
                resolve({
                    path: false
                });
                
                webWorker.postMessage({
                    type: MESSAGE_CANCEL_PATH,
                    ticket: message.ticket
                })
            }
            break;
        }
        case RESPONSE_PATH:
        {
            resolve(
                message
            );
        }
        case RESPONSE_ERROR:
        // intentional fall-through
        default:
            reject(message);
    }

}


const onWorkerMessage = ev => {

    try
    {
        processWorkerMessage(ev.data);
    }
    catch(e)
    {
        console.error("ERROR processing worker message", e)
    }
};

webWorker.addEventListener("message", onWorkerMessage, true);



/**
 *
 * @param {Object} message      message object
 * @param {Object} [ctx]    context for handler
 * @return {Promise<any>}
 */
function postWithReply(message, ctx)
{
    const ticket = ++counter;

    return new Promise(((promiseResolve, promiseReject) => {

        //console.log("POST-W-REPLY", ticket, message);

        webWorker.postMessage({
            ticket,
            message
        });

        // make sure to delete our stored ticket both when resolving and rejecting
        const internal = {
            resolve: result => {
                storage.delete(ticket);
                promiseResolve(result);

            },
            reject: err => {
                storage.delete(ticket);
                promiseReject(err);

            }
        };

        if (ctx)
        {
            ctx[secret] = internal;
        }
        else
        {
            ctx = {
                [secret] : internal,
            };
        }
        storage.set(ticket, ctx);
    }));
}


const Services = {

    /**
     * Generates the world map with the given seed. Returns a promise that resolves
     * with the new map object
     *
     * @param {String|Number}   seed    seed value
     * @param size
     * @param {Function} [onProgress]   optional progress handler
     * @return {Promise<any>}
     */
    generateMap: (seed, size = 2048, onProgress) => {
        return postWithReply({
                type: QUERY_GENERATE,
                seed,
                size,
                reportProgress: !!onProgress
            }, {
                onProgress
            })
            .catch(
                e => {
                    console.error("ERROR in generateMap", e);
                    return Promise.reject(e);
                }
            );
    },

    /**
     * Plans a path starting at sx,sy and ending at ex,ey. The planning works on two levels. It uses a prepared
     * navigation mesh to vastly cut down on computational complexity for very long paths connecting e.g. the next village.
     *
     * One the second level, a grid-based planning controls the path in between nodes of the navigation mesh. For short
     * paths, only the second level might be needed.
     *
     * The promise returned resolves to the complete path
     *
     * @param {Number} worldId          world map id
     * @param {Number} sx               starting point x-coordinate
     * @param {Number} sy               starting point y-coordinate
     * @param {Number} ex               end point x-coordinate
     * @param {Number} ey               end point y-coordinate
     * @param {Function} [onSegment]    optional callback to receive each second level sub path
     * @return {Promise<any>}
     */
    planPath: (worldId, sx, sy, ex, ey, onSegment) => {
        return postWithReply({
                type: QUERY_PATH,
                worldId,
                sx,
                sy,
                ex,
                ey,
                reportSegments: !!onSegment
            }, {
                onSegment
            })
            .catch(
                e => {
                    console.error("ERROR in planPath", e)
                    return Promise.reject(e);
                }
            );
    },

    close: () => {
        webWorker.removeEventListener("message", onWorkerMessage, true);
        webWorker.close();

    }
};

export default Services;

