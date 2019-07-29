import WorldMap from "../WorldMap";
import macroPath, { localPath, searchWalkable } from "../navigation";
import uuid from "uuid";
import {
    QUERY_GENERATE,
    QUERY_PATH,
    RESPONSE_MAP,
    RESPONSE_PROGRESS,
    RESPONSE_ERROR,
    RESPONSE_SEGMENT, RESPONSE_PATH
} from "./services-constants";
import simplify from "../util/simplify";


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

    let current;
    if (!iterator || !(current = iterator.next().value))
    {
        if (paths.size === 0)
        {
            // End path round robin
            return;
        }
        iterator = paths.entries();
        current = iterator.next().value;
    }


    const [ticket, entry]  = current;
    const { map, worldPath, pos, reportSegments } = entry;

    const { sizeMask, sizeBits} = map;

    let offset = searchWalkable(map,  worldPath[pos],  worldPath[pos + 1]);
    const sx = offset & sizeMask;
    const sy = (offset >>> sizeBits) & sizeMask ;
    offset = searchWalkable(map,  worldPath[pos + 2],  worldPath[pos + 3]);
    const ex = offset & sizeMask;
    const ey = (offset >>> sizeBits) & sizeMask ;

    //console.log("Calculate next Path Segment #" + pos + " for ticket #" + ticket, sx, sy, ex, ey);

    let path = localPath(
        map,
        sx,
        sy,
        ex,
        ey,
    );

    //console.log("Path Segment for ticket #" + ticket, path);

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

    path = simplify(path, 0.7);
    entry.path = entry.path.concat(path);


    //console.log(entry.path);

    entry.pos += 2;
    if (entry.pos >= worldPath.length - 4)
    {
        //console.log("Done with ticket #" + ticket);
        reply(
            ticket,
            {
                type: RESPONSE_PATH,
                path: entry.path
            }
        );

        paths.delete(ticket);

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

            const worldPath = macroPath(
                map,
                sx, sy,
                ex, ey
            );
            //console.log("World path for ticket #" + ticket, worldPath);

            if (worldPath == null)
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
                        worldPath,
                        pos: 0,
                        path: [],
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
