
import assert from "power-assert";
import Prando from "prando";
import simplify, { perpendicularDistance } from "../src/util/simplify";
import generate from "../src/util/name-generator";
import Meeple from "../src/Meeple";
import { isInView } from "../src/drawTiles";

describe("simplify", function(){
    describe("perpendicularDistance()", function(){
        it("works with zero length lines", function()
        {
            assert(perpendicularDistance(100,0,100,100,100,100) === 100)
            assert(perpendicularDistance(100,50,100,100,100,100) === 50)

        });
    });

	it("simplifies point arrays", function()
	{

	    assert.deepEqual(
            simplify(
                [
                    0,0,
                    51,50,
                    100,100,
                ],
                1,
            ),
            [
                0,0,
                100,100
            ]
        );
	    assert.deepEqual(
            simplify(
                [
                    0,0,
                    60,50,
                    100,100,
                ],
                1,
            ),
            [
                0,0,
                60,50,
                100,100
            ]
        );

	    assert.deepEqual(
            simplify(
                [
                    0,0,
                    36, 25,
                    70,50,
                    85,76,
                    100,100,
                ],
                1,
            ),
            [
                0,0,
                70,50,
                100,100
            ]
        );

	    assert.deepEqual(
            simplify(
                [
                    0,0,
                    100, 0,
                    0,100,
                    0,0
                ],
                1,
            ),
            [
                0,0,
                100, 0,
                0,100,
                0,0
            ]
        );

	    assert.deepEqual(
            simplify(
                [
                    0,0,
                    50,1,
                    100, 0,
                    51,50,
                    0,100,
                    1,50,
                    0,0
                ],
                1,
            ),
            [
                0,0,
                100, 0,
                0,100,
                0,0
            ]
        );


	    assert.deepEqual(
            simplify(
                [
                    0,0,
                    100, 0,
                    0,0
                ],
                1,
            ),
            [
                0,0,
                100, 0,
                0,0
            ]
        );
	    assert.deepEqual(
            simplify(
                [
                    0,0,
                    1, 0,
                    0,0
                ],
                1,
            ),
            [
                0,0,
                0,0
            ]
        );


	});

	it("directions", () => {

        const direction = (sdx, sdy) => (
            (sdx > 0) +
            ((sdy > 0) << 1) +
            ((sdx < 0) << 2) +
            ((sdy < 0) << 3)
        );

        console.log(direction(0,0));
        console.log(direction(1,0));
        console.log(direction(0,1));
        console.log(direction(-1,0));
        console.log(direction(0,-1));
        console.log(direction(-1,-1));
    })

	it("names", () => {

	    const random = new Prando("test-test");

	    for (let i=0; i < 49; i++)
        {
            const meeple = new Meeple(random, 0, 0);
            console.log(meeple);
        }
    })

	it("isInView", () => {

	    const sizeMask = 2047;

	    const checkBox = (x,y,w,h) => {

            assert( isInView( x + 50, y + 50,  x, y, w, h, sizeMask))
            assert(!isInView( x + 150,y + 50,  x, y, w, h, sizeMask))
            assert(!isInView( x + 50, y + 150, x, y, w, h, sizeMask))
            assert(!isInView( x + -50,y + 50,  x, y, w, h, sizeMask))
            assert(!isInView( x + 50, y + -50, x, y, w, h, sizeMask))
        }

        checkBox(0,0,100, 100);
        checkBox(-50 & sizeMask, 0, 100, 100);
        checkBox(0, -50 & sizeMask, 100, 100);
        checkBox(-50 & sizeMask, -50 & sizeMask, 100, 100);


    })
});
