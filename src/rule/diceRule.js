const operators = {
    "&&": {
        precedence: 0
    },
    "||": {
        precedence: 0
    },
    "<": {
        precedence: 1
    },
    ">": {
        precedence: 1
    },
    "<=": {
        precedence: 1
    },
    ">=": {
        precedence: 1
    },
    "==": {
        precedence: 1
    },
    "!=": {
        precedence: 1
    },
    "+": {
        precedence: 2
    },
    "-": {
        precedence: 2
    },
    "*": {
        precedence: 3
    },
    "/": {
        precedence: 3
    },
    // internal representation of unary minus
    "_": {
        precedence: 3
    },
    "d": {
        precedence: 4
    }
};

const KEYWORDS = new Set([
    "str",
    "dex",
    "int",
    "cha",
    "hp"
]);

/**
 * Contains operator to convert to a more user-friendly format in record mode.
 */
const USER_OPS = new Map();
USER_OPS.set("&&", "AND");
USER_OPS.set("||", "OR");
USER_OPS.set("_", "-");

/**
 * Encapsulates the value of RPN notated values and operators produced by parseRule.
 */
export class RPN {
    constructor(rule)
    {
        this.rule = rule;
    }
}


/**
 * Uses Dijkstra's shunting yard algorithm to parse a dice rule (e.b. "INT + CHA > 1d6") into an array containing an RPN
 * notation of the expression.
 *
 * @param {String} input        dice rule
 * @param input
 * @returns {RPN}
 */
export function parseRule(input)
{
    if (typeof input === "number")
    {
        return new RPN([input]);
    }

    if (!input)
    {
        throw new Error("Invalid dice rule: " + input);
    }

    let prevToken;
    let token;
    const length = input.length,
        rule = [],
        stack = [];
    let index = 0;

    while (index < length)
    {
        token = input[index++];

        switch (token)
        {
            case " ":
                continue;
            case "S":
            {

                const keyword = input.substr(index - 1, 3);
                if (keyword !== "STR")
                {
                    throw new Error("Invalid token: " + keyword);
                }
                token = "str";
                rule.push(token);
                index += 2;
                break;
            }
            case "D":
            {

                const keyword = input.substr(index - 1, 3);
                if (keyword !== "DEX")
                {
                    throw new Error("Invalid token: " + keyword);
                }
                token = "dex";
                rule.push(token);
                index += 2;
                break;
            }
            case "I":
            {

                const keyword = input.substr(index - 1, 3);
                if (keyword !== "INT")
                {
                    throw new Error("Invalid token: " + keyword);
                }
                token = "int";
                rule.push(token);
                index += 2;
                break;
            }
            case "C":
            {

                const keyword = input.substr(index - 1, 3);
                if (keyword !== "CHA")
                {
                    throw new Error("Invalid token: " + keyword);
                }
                token = "cha";
                rule.push(token);
                index += 2;
                break;
            }
            case "H":
            {

                const keyword = input.substr(index - 1, 2);
                if (keyword !== "HP")
                {
                    throw new Error("Invalid token: " + keyword);
                }
                token = "hp";
                rule.push(token);
                index += 1;
                break;
            }
            case "(":
                stack.unshift(token);
                break;
            case ")":
                while (stack.length)
                {
                    token = stack.shift();
                    if (token === "(")
                    {
                        break;
                    }
                    else
                    {
                        rule.push(token);
                    }
                }

                if (token !== "(")
                {
                    throw new Error("Mismatched parentheses.");
                }
                break;
            case "-":
                if (index === 1 || (typeof prevToken !== "number" && !KEYWORDS.has(prevToken)) || prevToken === "(")
                {
                    stack.unshift("_");
                    break;
                }
            // intentional fallthrough
            default:
                if ((token === "<" || token === ">" || token === "!" || token === "=") && input[index] === "=")
                {
                    token = token + "=";
                    index++;
                }

                if ((token === "&" || token === "|") && input[index] === token)
                {
                    token = token + token;
                    index++;
                }

                if (operators.hasOwnProperty(token))
                {
                    while (stack.length)
                    {
                        const punctuator = stack[0];

                        if (punctuator === "(")
                        {
                            break;
                        }

                        const operator = operators[token],
                            precedence = operator.precedence,
                            antecedence = operators[punctuator].precedence;

                        if (precedence > antecedence ||
                            precedence === antecedence &&
                            operator.associativity === "right")
                        {
                            break;
                        }
                        else
                        {
                            rule.push(stack.shift());
                        }
                    }

                    stack.unshift(token);
                }
                else if (token >= "0" && token <= "9")
                {
                    let c = token;
                    let s = "";
                    do
                    {
                        s += c;
                        c = input[index++];
                    }
                    while ((c >= "0" && c <= "9") || c === ".");

                    index--;

                    const n = +s;
                    if (isNaN(n))
                    {
                        throw new Error("Invalid number: " + s);
                    }

                    token = n;
                    rule.push(n);
                }
                else
                {
                    throw new Error("Invalid token:" + token)
                }
        }

        prevToken = token;
    }

    while (stack.length)
    {
        token = stack.shift();
        if (token !== "(")
        {
            rule.push(token);
        }
        else
        {
            throw new Error("Mismatched parentheses.");
        }
    }

    return new RPN(rule);
}


/**
 * Recursive graph structure describing a dice rule evaluation.
 *
 * @typedef  {object} DiceRuleRecord
 *
 * @property {string} [op]                  user-friendly operator (see USER_OPS)
 * @property {DiceRuleRecord} [operandA]    operand A
 * @property {DiceRuleRecord} [operandB]    operand B
 * @property {number} result                source line in file
 */

/**
 * Returns the expected value of a dice rule. Dice are not rolled, but replaced with the expected long-term average (e.g. 1d6 + 1 = 4.5)
 *
 * @param {RPN} rpn             rpn expression
 * @param {Meeple} meeple       meeple to evaluate against
 * @param {boolean} [record]    if true, record all immediate steps and returns a hierarchical object structure
 *                              instead of just the result
 *
 * @returns {number|boolean|DiceRuleRecord} simple value or dice rule record graph
 */
export function getExpectedValue(rpn, meeple, record)
{
    return processInternal(null, rpn, meeple, record);
}


/**
 * Actually evaluates a dice rule, rolling all dice for the expressions
 *
 * @param random                prando random
 * @param {RPN} rpn             rpn expression
 * @param {Meeple} meeple       meeple to evaluate against
 * @param {boolean} [record]    if true, record all immediate steps and returns a hierarchical object structure
 *                              instead of just the result
 *
 * @returns {number|boolean|DiceRuleRecord} simple value or dice rule record graph
 */
export function evaluateRule(random, rpn, meeple, record)
{
    if (!random)
    {
        throw new Error("Need random");
    }

    return processInternal(random, rpn, meeple, record);
}


const stack = new Array(16);

function getOperandItself(operand)
{
    return operand;
}


function getOperandFromRecord(record)
{
    return record.result;
}


/**
 * Evaluates or returns the expected value of the given RPN expression.
 *
 * @param {Prando} [random]     prando random to evaluate the RPN or falsy to return the expected value.
 * @param {RPN} rpn             RPN expression
 * @param {Meeple} meeple       Meeple to evaluate the rule for
 * @param {boolean} record      if true, a complete history of the evaluation will be returned as object graph, otherwise
 *                              a simple value is returned.
 *
 * @returns {number|boolean|DiceRuleRecord} simple value or dice rule record graph
 */
function processInternal(random, rpn, meeple, record = false)
{

    const {rule} = rpn;

    let pos = 0;
    const pop = () => {
        if (process.env.NODE_ENV !== "production")
        {
            if (pos === 0)
            {
                throw new Error("Stack empty");
            }
        }
        return stack[--pos];
    };

    const getOperand = record ? getOperandFromRecord : getOperandItself;

    for (let i = 0; i < rule.length; i++)
    {
        let value = rule[i];
        let result, nodeA, nodeB, operandA, operandB;
        switch (value)
        {
            case "str":
            case "int":
            case "dex":
            case "cha":
                nodeB = null;
                nodeA = null;
                operandA = null;
                operandB = null;
                result = meeple.stats[value];
                break;
            case "hp":
                nodeB = null;
                nodeA = null;
                operandA = null;
                operandB = null;
                result = meeple.hp;
                break;
            case "+":
                nodeB = pop();
                nodeA = pop();
                operandA = getOperand(nodeA);
                operandB = getOperand(nodeB);
                result = (operandA + operandB);
                break;
            case "-":
                nodeB = pop();
                nodeA = pop();
                operandA = getOperand(nodeA);
                operandB = getOperand(nodeB);
                result = (operandA - operandB);
                break;
            case "*":
                nodeB = pop();
                nodeA = pop();
                operandA = getOperand(nodeA);
                operandB = getOperand(nodeB);
                result = (operandA * operandB);
                break;
            case "/":
                nodeB = pop();
                nodeA = pop();
                operandA = getOperand(nodeA);
                operandB = getOperand(nodeB);
                result = (operandA / operandB);
                break;
            case "<":
                nodeB = pop();
                nodeA = pop();
                operandA = getOperand(nodeA);
                operandB = getOperand(nodeB);
                result = (operandA < operandB);
                break;
            case ">":
                nodeB = pop();
                nodeA = pop();
                operandA = getOperand(nodeA);
                operandB = getOperand(nodeB);
                result = (operandA > operandB);
                break;
            case "<=":
                nodeB = pop();
                nodeA = pop();
                operandA = getOperand(nodeA);
                operandB = getOperand(nodeB);
                result = (operandA <= operandB);
                break;
            case ">=":
                nodeB = pop();
                nodeA = pop();
                operandA = getOperand(nodeA);
                operandB = getOperand(nodeB);
                result = (operandA >= operandB);
                break;
            case "==":
                nodeB = pop();
                nodeA = pop();
                operandA = getOperand(nodeA);
                operandB = getOperand(nodeB);
                result = (operandA === operandB);
                break;
            case "!=":
                nodeB = pop();
                nodeA = pop();
                operandA = getOperand(nodeA);
                operandB = getOperand(nodeB);
                result = (operandA !== operandB);
                break;
            case "&&":
                nodeB = pop();
                nodeA = pop();
                operandA = getOperand(nodeA);
                operandB = getOperand(nodeB);
                result = (operandA && operandB);
                break;
            case "||":
                nodeB = pop();
                nodeA = pop();
                operandA = getOperand(nodeA);
                operandB = getOperand(nodeB);
                result = (operandA || operandB);
                break;
            case "d":
                nodeB = pop();
                nodeA = pop();
                operandA = getOperand(nodeA);
                operandB = getOperand(nodeB);
                if (random === null)
                {
                    result = ((1 + operandB) / 2) * operandA;
                }
                else
                {
                    result = 0;
                    for (let i = 0; i < operandA; i++)
                    {
                        result += random.nextInt(1, operandB);
                    }
                }
                break;
            // unary minus
            case "_":
                nodeA = pop();
                nodeB = null;
                operandA = getOperand(nodeA);
                operandB = null;
                result = -operandA;
                break;
            default:
                if (typeof value === "number")
                {
                    nodeA = null;
                    nodeB = null;
                    operandA = null;
                    operandB = null;
                    result = value;
                    value = null;
                }
                else
                {
                    throw new Error("Unexpected value: " + value);
                }
        }

        if (record)
        {

            if (value)
            {
                if (typeof value === "string" && value !== "d")
                {
                    value = USER_OPS.get(value) || value.toUpperCase();
                    result = {
                        op: value,
                        result
                    };
                }
                else
                {
                    result = {
                        op: value,
                        result
                    };
                }

                if (nodeA)
                {
                    result.operandA = nodeA;
                }
                if (nodeB)
                {
                    result.operandB = nodeB;
                }
            }
            else
            {
                result = {result};
            }

            //console.log("RECORD", JSON.stringify(result, null, 4))
        }

        stack[pos++] = result;
    }

    const result = pop();

    if (process.env.NODE_ENV !== "production" && pos !== 0)
    {
        throw new Error("Stack not empty after eval:" + JSON.stringify(rule));
    }

    return result;
}
