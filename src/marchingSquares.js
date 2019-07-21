import now from "performance-now"

function createPolygon(id, data, cells, x, y, startX, startY, ctx)
{
    let fromLeft = true;
    let fromAbove = false;

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

        // if (cells[line + x] !== 0)
        // {
        //     if (cellCase === 10 ||cellCase === 5)
        //     {
        //         console.log("double visit on ambiguous")
        //     }
        //     else
        //     {
        //         throw new Error("Illegal State at length = " + points.length + ", id = " + cells[line + x] + ": " + JSON.stringify({
        //             x,
        //             y,
        //             startX,
        //             startY,
        //             cellCase
        //         }));
        //     }
        // }

        cells[line + x] = id;

        //console.log(x, y, "case = ", cellCase, "check = ", x, y, " <-> ", x2, y2);
        switch (cellCase)
        {
            case 1:
                points.push(
                    x + 0.5, y2
                );
                y = y2;
                fromLeft = false;
                fromAbove = true;
                break;
            case 2:
                points.push(
                    x2, y + 0.5
                );
                x = x2;
                fromLeft = true;
                fromAbove = false;
                break;
            case 3:
                points.push(
                    x2, y + 0.5
                );
                x = x2;
                fromLeft = true;
                fromAbove = false;
                break;
            case 4:
                points.push(
                    x + 0.5, y
                );
                y = y0;
                fromLeft = false;
                fromAbove = false;
                break;
            case 5:
                if (fromLeft)
                {
                    points.push(
                        x + 0.5, y
                    );
                    y = y0;
                    fromAbove = false;
                }
                else
                {
                    points.push(
                        x + 0.5, y2
                    );
                    y = y2;
                    fromAbove = true;
                }
                fromLeft = false;
                break;
            case 6:
                points.push(
                    x + 0.5, y
                );
                y = y0;
                fromLeft = false;
                fromAbove = false;
                break;
            case 7:
                points.push(
                    x + 0.5, y
                );
                y = y0;
                fromLeft = false;
                fromAbove = false;
                break;
            case 8:
                points.push(
                    x, y + 0.5
                );
                x = x0;
                fromLeft = false;
                fromAbove = false;
                break;
            case 9:
                points.push(
                    x + 0.5, y2
                );
                y = y2;
                fromLeft = false;
                fromAbove = true;
                break;
            case 10:
                if (fromAbove)
                {
                    points.push(
                        x2, y + 0.5
                    );
                    x = x2;
                    fromLeft = true;
                }
                else
                {
                    points.push(
                        x, y + 0.5
                    );
                    x = x0;
                    fromLeft = false;
                }
                fromAbove = false;
                break;
            case 11:
                points.push(
                    x2, y + 0.5
                );
                x = x2;
                fromLeft = true;
                fromAbove = false;
                break;
            case 12:
                points.push(
                    x, y + 0.5
                );
                x = x0;
                fromLeft = false;
                fromAbove = false;
                break;
            case 13:
                points.push(
                    x + 0.5, y2
                );
                y = y2;
                fromLeft = false;
                fromAbove = true;
                break;
            case 14:
                points.push(
                    x, y + 0.5
                );
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
    const polygons = [];
    const ctx = {
        width,
        height,
        condition,
        outside
    };

    for (let y=0; y < height; y ++)
    {
        const line = y * width;
        for (let x=0; x < width; x ++)
        {
            const id = polygons.length + 1;
            const polygon = createPolygon(id, data, cells, x, y, x, y, ctx);
            // we ignore the little diamond 4 point shapes
            if (polygon)
            {
                if (polygon.length > 8)
                {
                    //console.log("Polygon #", + id, ": length = ", polygon.length);
                    polygons.push(polygon)
                }
            }
        }
    }

    console.log("Marching squares done in "  + (now() - start) + "ms");

    return polygons;
}
