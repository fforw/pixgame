import WorldMap from "../WorldMap";
import pathPlanning from "../navigation";
import uuid from "uuid";
import {
    QUERY_GENERATE,
    QUERY_PATH,
    RESPONSE_MAP,
    RESPONSE_PROGRESS,
    RESPONSE_ERROR,
    RESPONSE_SUB_PATH
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
            const {worldId, sx, sy, ex, ey, reportSegment} = message;

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

            const path = pathPlanning(
                map,
                sx, sy,
                ex, ey,
                reportSegment && (
                    path => reply(
                      ticket,
                      {
                          type: RESPONSE_SUB_PATH,
                          path
                      }
                    )
                )
            );

            

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
