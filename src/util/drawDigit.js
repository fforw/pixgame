const digits = [
    [
        0, 2, 0, 0,
        2, 0, 2, 0,
        2, 0, 2, 0,
        2, 0, 2, 0,
        0, 2, 0, 0
    ],
    [
        2, 2, 0, 0,
        0, 2, 0, 0,
        0, 2, 0, 0,
        0, 2, 0, 0,
        0, 2, 0, 0
    ],
    [
        2, 2, 2, 0,
        0, 0, 2, 0,
        0, 2, 2, 0,
        2, 0, 0, 0,
        2, 2, 2, 0
    ],
    [
        2, 2, 0, 0,
        0, 0, 2, 0,
        0, 2, 0, 0,
        0, 0, 2, 0,
        2, 2, 0, 0
    ],
    [
        2, 0, 2, 0,
        2, 0, 2, 0,
        2, 2, 2, 0,
        0, 0, 2, 0,
        0, 0, 2, 0
    ],
    [
        2, 2, 2, 0,
        2, 0, 0, 0,
        2, 2, 0, 0,
        0, 0, 2, 0,
        2, 2, 0, 0
    ],
    [
        0, 2, 2, 0,
        2, 0, 0, 0,
        2, 2, 0, 0,
        2, 0, 2, 0,
        0, 2, 0, 0
    ],
    [
        2, 2, 2, 0,
        0, 0, 2, 0,
        0, 0, 2, 0,
        0, 0, 2, 0,
        0, 0, 2, 0
    ],
    [
        0, 2, 0, 0,
        2, 0, 2, 0,
        0, 2, 0, 0,
        2, 0, 2, 0,
        0, 2, 0, 0
    ],
    [
        0, 2, 0, 0,
        2, 0, 2, 0,
        0, 2, 2, 0,
        0, 0, 2, 0,
        2, 2, 2, 0
    ],
    [
        1, 0, 0, 1,
        0, 0, 1, 0,
        0, 1, 1, 0,
        0, 1, 0, 0,
        1, 0, 0, 1
    ]

];


export function drawDigit(map, sx, sy, digit)
{
    let off = 0;

    const array = digits[digit];
    if (!array)
    {
        throw new Error("No array for " + digit);
    }


    for (let y = 0 ; y < 5; y++)
    {
        for (let x = 0; x < 4; x++)
        {
            map.write(
                sx + x,
                sy + y,
                array[off]
            );
            off++;
        }
    }
}
