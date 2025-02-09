import now from "performance-now"

function createPolygon(id, data, cells, x, y, ctx)
{
    let fromLeft = true;
    let fromAbove = false;

    const startX = x;
    const startY = y;

    const { width, height, condition, outside } = ctx;

    let line = y * width;
    if (cells[line + x] !== 0)
    {
        // cell already visited
        return null;
    }

    let x0, x2, y0, y2, cellCase;

    y0 = y - 1;
    y2 = y + 1;
    x0 = x - 1;
    x2 = x + 1;

    cellCase = 0;

    if (x > 0)
    {
        if (y > 0)
        {
            cellCase |= (condition(data[line + x]) << 3);
        }
        else
        {
            cellCase |= (outside << 3);
        }

        if (y2 < height)
        {
            cellCase |= (condition(data[line + width + x]) << 0);
        }
        else
        {
            cellCase |= (outside << 0);
        }
    }
    else
    {
        cellCase |= (outside << 3);
        cellCase |= (outside << 0);
    }

    if (x2 < width)
    {
        if (y > 0)
        {
            cellCase |= (condition(data[line + x2]) << 2);
        }
        else
        {
            cellCase |= (outside << 2);
        }
        if (y2 < height)
        {
            cellCase |= (condition(data[line + width + x2]) << 1);
        }
        else
        {
            cellCase |= (outside << 1);
        }
    }
    else
    {
        cellCase |= (outside << 2);
        cellCase |= (outside << 1);
    }

    // empty cells and cells within an obstacle don't start polygons
    if (cellCase === 0 || cellCase === 15)
    {
        return null;
    }

    //console.log("start polygon", x, y);


    let points;

    // // if we
    // if (points != null && x === startX && y === startY)
    // {
    //
    // }

    switch(cellCase)
    {
        case 1:
            points = [
                x, y + 0.5
            ];
            break;

        case 2:
            points = [
                x + 0.5, y2
            ];
            break;
        case 3:
            points = [
                x, y + 0.5
            ];
            break;
        case 4:
            points = [
                x2, y + 0.5,
            ];
            break;
        case 5:
            if (fromLeft)
            {
                points = [
                    x, y + 0.5
                ];
            }
            else
            {
                points = [
                    x2, y + 0.5,
                ];
            }
            break;
        case 6:
            points = [
                x+0.5, y2
            ];
            break;

        case 7:
            points = [
                x, y + 0.5
            ];
            break;
        case 8:
            points = [
                x+0.5, y
            ];
            break;

        case 9:
            points = [
                x+0.5, y
            ];
            break;

        case 10:
            if (fromAbove)
            {
                points = [
                    x + 0.5, y
                ];
            }
            else
            {
                points = [
                    x + 0.5, y2
                ];
            }
            break;
        case 11:
            points = [
                x+0.5, y
            ];
            break;
        case 12:
            points = [
                x2, y + 0.5
            ];
            break;
        case 13:
            points = [
                x2, y + 0.5
            ];
            break;
        case 14:
            points = [
                x + 0.5, y2
            ];
            break;

        default:
            throw new Error("Invalid cell value");
    }

    do
    {
        cells[line + x] = id;

        //console.log(x, y, "case = ", cellCase, "check = ", x, y, " <-> ", x2, y2);
        let px, py;
        switch (cellCase)
        {
            case 1:
                px = x + 0.5;
                py = y2;
                y = y2;
                fromLeft = false;
                fromAbove = true;
                break;
            case 2:
                px = x2;
                py = y + 0.5;
                x = x2;
                fromLeft = true;
                fromAbove = false;
                break;
            case 3:
                px = x2;
                py = y + 0.5;
                x = x2;
                fromLeft = true;
                fromAbove = false;
                break;
            case 4:
                px = x + 0.5;
                py = y;
                y = y0;
                fromLeft = false;
                fromAbove = false;
                break;
            case 5:
                if (fromLeft)
                {
                    px = x + 0.5;
                    py = y;
                    y = y0;
                    fromAbove = false;
                }
                else
                {
                    px = x + 0.5;
                    py = y2;
                    y = y2;
                    fromAbove = true;
                }
                fromLeft = false;
                break;
            case 6:
                px = x + 0.5;
                py = y;
                y = y0;
                fromLeft = false;
                fromAbove = false;
                break;
            case 7:
                px = x + 0.5;
                py = y;
                y = y0;
                fromLeft = false;
                fromAbove = false;
                break;
            case 8:
                px = x;
                py = y + 0.5;
                x = x0;
                fromLeft = false;
                fromAbove = false;
                break;
            case 9:
                px = x + 0.5;
                py = y2;
                y = y2;
                fromLeft = false;
                fromAbove = true;
                break;
            case 10:
                if (fromAbove)
                {
                    px = x2;
                    py = y + 0.5;
                    x = x2;
                    fromLeft = true;
                }
                else
                {
                    px = x;
                    py = y + 0.5;
                    x = x0;
                    fromLeft = false;
                }
                fromAbove = false;
                break;
            case 11:
                px = x2;
                py = y + 0.5;
                x = x2;
                fromLeft = true;
                fromAbove = false;
                break;
            case 12:
                px = x;
                py = y + 0.5;
                x = x0;
                fromLeft = false;
                fromAbove = false;
                break;
            case 13:
                px = x + 0.5;
                py = y2;
                y = y2;
                fromLeft = false;
                fromAbove = true;
                break;
            case 14:
                px = x;
                py = y + 0.5;
                x = x0;
                fromLeft = false;
                fromAbove = false;
                break;
            default:
                throw new Error("Unhandled cell value: " + JSON.stringify({
                    cellCase,
                    x,
                    y
                }, null, 4));
        }

        points.push(px, py);

        line = y * width;

        y0 = y - 1;
        y2 = y + 1;
        x0 = x - 1;
        x2 = x + 1;

        cellCase = 0;

        if (x > 0)
        {
            if (y > 0)
            {
                cellCase |= (condition(data[line + x]) << 3);
            }
            else
            {
                cellCase |= (outside << 3);
            }

            if (y2 < height)
            {
                cellCase |= (condition(data[line + width + x]) << 0);
            }
            else
            {
                cellCase |= (outside << 0);
            }
        }
        else
        {
            cellCase |= (outside << 3);
            cellCase |= (outside << 0);
        }

        if (x2 < width)
        {
            if (y > 0)
            {
                cellCase |= (condition(data[line + x2]) << 2);
            }
            else
            {
                cellCase |= (outside << 2);
            }
            if (y2 < height)
            {
                cellCase |= (condition(data[line + width + x2]) << 1);
            }
            else
            {
                cellCase |= (outside << 1);
            }
        }
        else
        {
            cellCase |= (outside << 2);
            cellCase |= (outside << 1);
        }

    } while (x !== startX || y !== startY);

    return points;
}


export default function marchingSquares(data, width, height, condition, outside)
{
    if (data.length !== width * height)
    {
        throw new Error("array size does not match width*height: " + JSON.stringify({array: data.length, width, height}))
    }

    const start = now();

    const cells = new Uint8Array(width * height);
    const mask = new Uint8Array(width * height);

    const polygons = [];
    const ctx = {
        width,
        height,
        condition,
        outside
    };

    let limit = {
        minY: 0,
        maxY : 0
    };

    for (let y=0; y < height; y ++)
    {
        for (let x=0; x < width; x ++)
        {
            const id = polygons.length + 1;
            const polygon = createPolygon(id, data, cells, x, y, ctx);
            // we ignore the little diamond 4 point shapes
            if (polygon)
            {
                if (polygon.length > 6)
                {
                    //console.log("Polygon #", + id, ": length = ", polygon.length);
                    polygons.push(polygon);
                }
            }


        }
    }

    console.log("Marching squares done in "  + (now() - start) + "ms");

    return polygons;
}
