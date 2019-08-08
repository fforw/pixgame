import React, { useMemo } from "react";
import cx from "classnames";
import { getExpectedValue } from "./diceRule";


/**
 * React component that renders a user-friendly representation of a dice rule RPN. Boolean terms are highlighted for
 * their truthiness, the user can hover over parts of the equation to highlight intermediary values.
 */
export const DiceRuleWidget = ({ rpn, meeple }) => {

    // memoize the rendering of a expected value record
    return useMemo(
        () => renderTerm(

            getExpectedValue(
                rpn,
                meeple,
                true
            )
        ),
        // inputs are the RPN and the meeple stats involved
        [rpn, meeple.stats, meeple.hp]
    );
};


const renderTerm = ({ result, op, operandA, operandB }) => {


    const title = "Result: " + result;
    if (op)
    {
        if (operandA)
        {
            if (operandB)
            {
                return (
                    <span
                        className="dice-op binary"
                        title={ title }

                    >
                        {
                            renderTerm(operandA)
                        }
                        <span
                            className={
                                cx(
                                    result === true && "text-success",
                                    result === false && "text-danger"
                                )
                            }
                        >
                        {
                            "\u00a0" + op + "\u00a0"
                        }
                        </span>
                        {
                            renderTerm(operandB)
                        }
                    </span>
                )
            }
            else
            {
                return (
                    <span className="dice-op unary" title={ title }>
                    {
                        op
                    }
                    {
                        renderTerm(operandA)
                    }
                </span>
                );
            }
        }
        else
        {
            return (
                <span className="dice-stat" title={ result }>
                    {
                        op
                    }
                </span>
            );
        }
    }
    else
    {
        return (
            <span
                className="dice-value"
            >
                {
                    result
                }
            </span>
        );
    }
};
