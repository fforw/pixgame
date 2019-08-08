import assert from "power-assert";
import { evaluateRule, getExpectedValue, parseRule } from "../src/rule/diceRule";
import Meeple from "../src/Meeple";
import Prando from "prando";


describe("Dice Rule Engine", function () {
    it("parses dice rules expressions to RPN rules", function () {

        assert.deepEqual(
            parseRule(123),
            {
                rule: [
                    123
                ]
            }
        );

        assert.deepEqual(
            parseRule("123"),
            {
                rule: [
                    123
                ]
            }
        );

        assert.deepEqual(
            parseRule("1 + 2 * 3"),
            {
                rule: [
                    1, 2, 3, "*", "+"
                ]
            }
        );
        assert.deepEqual(
            parseRule("1 + 2 + 3"),
            {
                rule: [1, 2, "+", 3, "+"]
            }
        );

        assert.deepEqual(
            parseRule("1d6 + 12"),
            {
                rule: [1, 6, "d", 12, "+"]
            }
        );

        assert.deepEqual(
            parseRule("1d6 + STR"),
            {
                rule: [1, 6, "d", "str", "+"]
            }
        );

        assert.deepEqual(
            parseRule("(1 + INT)d6 + 2"),
            {
                rule: [1, "int", "+", 6, "d", 2, "+"]
            }
        );

        assert.deepEqual(
            parseRule("(STR + INT)/2 > 10"),
            {
                rule: ["str", "int", "+", 2, "/", 10, ">"]
            }
        );

        assert.deepEqual(
            parseRule("2 + 2 > 1 + 2"),
            {
                rule: [2, 2, "+", 1, 2, "+", ">"]
            }
        );
        assert.deepEqual(
            parseRule("5 + (-DEX) + 1"),
            {
                rule: [5, "dex", "_", "+", 1, "+"]
            }
        );
        assert.deepEqual(
            parseRule("-12"),
            {
                rule: [12, "_"]
            }
        );

        assert.deepEqual(
            parseRule("5 * -4"),
            {
                rule: [5, 4, "_", "*"]
            }
        );

        assert.deepEqual(
            parseRule("1 != 2"),
            {
                rule: [1, 2, "!="]
            }
        );

        assert.deepEqual(
            parseRule("STR == 20"),
            {
                rule: ["str", 20, "=="]
            }
        );

        assert.deepEqual(
            parseRule("STR <= 15"),
            {
                rule: ["str", 15, "<="]
            }
        );
        assert.deepEqual(
            parseRule("INT >= 12"),
            {
                rule: ["int", 12, ">="]
            }
        );

        assert.deepEqual(
            parseRule("INT == 11 && STR == 12"),
            {
                rule: ["int", 11, "==", "str", 12, "==", "&&"]
            }
        );

        assert.throws(
            () => parseRule("(1 + "),
            /Mismatched parentheses/
        );
        assert.throws(
            () => parseRule("ITN + 1"),
            /Invalid token: ITN/
        );
        assert.throws(
            () => parseRule("1.2.3"),
            /Invalid number: 1.2.3/
        )
    });

    it("calculates expected values of RPN dice rules", function () {

        const random = new Prando("test-test");
        const meeple = new Meeple(random, 0, 0);

        //console.log("STATS", meeple.stats)

        assert(getExpectedValue(parseRule("1d6"), meeple) === 3.5);
        assert(getExpectedValue(parseRule("3d6 + 1"), meeple) === 11.5);
        assert(getExpectedValue(parseRule("1d6 + STR"), meeple) === 19.5);
        assert(getExpectedValue(parseRule("CHA + INT"), meeple) === 22);
        assert(getExpectedValue(parseRule("-DEX + 1"), meeple) === -9);
        assert(getExpectedValue(parseRule("500"), meeple) === 500);
    });

    it("evaluates RPN dice rules", function () {

        const random = new Prando("test-test");
        const meeple = new Meeple(random, 0, 0);

        //console.log("STATS", meeple.stats)

        assert(evaluateRule(random, parseRule("1d6"), meeple) === 5);
        assert(evaluateRule(random, parseRule("3d6"), meeple) === 9);
        assert(evaluateRule(random, parseRule("(1d6 + STR) * 1.5"), meeple) === 33);
        assert(evaluateRule(random, parseRule("CHA + INT"), meeple) === 22);
        assert(evaluateRule(random, parseRule("500"), meeple) === 500);
        assert(evaluateRule(random, parseRule(250), meeple) === 250);
        assert(evaluateRule(random, parseRule("DEX / 10"), meeple) === 1);

        assert(evaluateRule(random, parseRule("INT < 10"), meeple) === true);
        assert(evaluateRule(random, parseRule("CHA <= 14"), meeple) === true);
        assert(evaluateRule(random, parseRule("STR >= 16"), meeple) === true);
        assert(evaluateRule(random, parseRule("CHA == 14"), meeple) === true);
        assert(evaluateRule(random, parseRule("INT != 8"), meeple) === false);

    });

    it("records rule evaluation in a recursive object structure", function () {

        const random = new Prando("test-test");
        const meeple = new Meeple(random, 0, 0);

        //console.log("STATS", meeple.stats)

        assert.deepEqual(
            getExpectedValue(parseRule("(STR + INT)/2 > 10"), meeple, true),
            {
                "op": ">",
                "result": true,
                "operandA": {
                    "op": "/",
                    "result": 12,
                    "operandA": {
                        "op": "+",
                        "result": 24,
                        "operandA": {
                            "op": "STR",
                            "result": 16
                        },
                        "operandB": {
                            "op": "INT",
                            "result": 8
                        }
                    },
                    "operandB": {
                        "result": 2
                    }
                },
                "operandB": {
                    "result": 10
                }
            }
        );

        const data = getExpectedValue(parseRule("1d6 + 2d4 + INT"), meeple, true);
        //console.log(JSON.stringify(data, null, 4))
        assert.deepEqual(
            data,
            {
                "op": "+",
                "result": 16.5,
                "operandA": {
                    "op": "+",
                    "result": 8.5,
                    "operandA": {
                        "op": "d",
                        "result": 3.5,
                        "operandA": {
                            "result": 1
                        },
                        "operandB": {
                            "result": 6
                        }
                    },
                    "operandB": {
                        "op": "d",
                        "result": 5,
                        "operandA": {
                            "result": 2
                        },
                        "operandB": {
                            "result": 4
                        }
                    }
                },
                "operandB": {
                    "op": "INT",
                    "result": 8
                }
            }
        );
    });

});
