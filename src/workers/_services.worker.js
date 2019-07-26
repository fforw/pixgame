import WorldMap from "../WorldMap";
import macroPath, { localPath } from "../navigation";
import uuid from "uuid";
import {
    QUERY_GENERATE,
    QUERY_PATH,
    RESPONSE_MAP,
    RESPONSE_PROGRESS,
    RESPONSE_ERROR,
    RESPONSE_SEGMENT, RESPONSE_PATH
} from "./services-constants";


function reply(ticket, message)
{
    postMessage(
        {
            ticket,
            message
        }
    );
}

function error(ticket, error)
{
    reply(
        ticket,
        {
            type: RESPONSE_ERROR,
            error,
            ticket
        }
    );
}
const maps = [];
const paths = new Map();

let iterator;

function doSubPathRoundRobin()
{

    let entry;
    if (!iterator || !(entry = iterator.next()))
    {
        if (paths.size === 0)
        {
            // End path round robin
            return;
        }
        iterator = paths.entries();
        entry = iterator.next();
    }

    const { map, ticket, macroPath, pos, reportSegments }  = entry;

    const sx = macroPath[pos];
    const sy = macroPath[pos + 1];
    const ex = macroPath[pos + 2];
    const ey = macroPath[pos + 3];

    console.log("Calculate next Path Segment for ticket #" + ticket, sx, sy, ex, ey);

    const path = localPath(
        map,
        sx,
        sy,
        ex,
        ey,
    );

    console.log("Path Segment for ticket #" + ticket, path);

    // XXX: Do not give up, try next
    if (!path)
    {
        reply(
            ticket,
            {
                type: RESPONSE_PATH,
                path: null
            }
        );
        return;
    }

    entry.path = entry.path.concat(path);
    if (++entry.pos === path.length - 1)
    {
        reply(
            ticket,
            {
                type: RESPONSE_PATH,
                path: entry.path
            }
        );

        paths.delete(ticket)

        if (paths.size === 0)
        {
            // End path round robin
            return;
        }
    }
    else if (reportSegments)
    {
        reply(
            ticket,
            {
                type: RESPONSE_SEGMENT,
                path
            }
        );
    }

    // yield and continue later
    setTimeout(doSubPathRoundRobin, 1)
}


function handleIncomingMessage(ev)
{
    const {message, ticket} = ev.data;
    const {type} = message;

    //console.log("handleIncomingMessage", ticket, message);


    switch (type)
    {
        case QUERY_GENERATE:
        {
            const {seed, size, reportProgress} = message;

            console.log("Generating world '" + seed + "'");

            const map = WorldMap.generate(
                size,
                seed,
                reportProgress &&
                (percent => reply(
                    ticket,
                    {
                        type: RESPONSE_PROGRESS,
                        percent,
                    }
                ))
            );

            const id = uuid.v4();
            map.worldId = id;

            maps[id] = map;

            reply(
                ticket,
                {
                    type: RESPONSE_MAP,
                    payload: map.serialize()
                });
            break;

        }

        case QUERY_PATH:
        {
            const {worldId, sx, sy, ex, ey, reportSegments} = message;

            //console.log("QUERY_PATH", {worldId, sx, sy, ex, ey, reportSegments})

            const map = maps[worldId];

            if (!map)
            {
                error(
                    ticket,
                    "Could not find map '" + worldId + "'"
                );
                return;
            }

            const macroPath = macroPath(
                map,
                sx, sy,
                ex, ey
            );

            if (macroPath == null)
            {
                reply(
                    ticket,
                    {
                        type: RESPONSE_PATH,
                        path: null
                    }
                );
            }
            else
            {
                paths.set(
                    ticket,
                    {
                        map,
                        macroPath,
                        pos: 0,
                        ticket,
                        reportSegments
                    }
                );

                setTimeout(doSubPathRoundRobin, 1);
            }

            break;
        }

        default:
            error(
                ticket,
                "Unhandled action: " + type
            );
            break;
    }

}


onmessage = ev => {

    try
    {
        return handleIncomingMessage(ev);
    }
    catch(e)
    {
        console.error("Error handling incoming message", e);
    }
};
