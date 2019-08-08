import { parseRule, RPN } from "./rule/diceRule";
import { thingNames } from "./config";

const NONE = [];

export const SkillTarget = {
    MOB: "MOB",
    MEEPLE: "MEEPLE",
    THING: "THING",
    ITEM: "ITEM"
};

export const OutcomeType = {
    MEEPLE: "MEEPLE",
    THING: "THING",
    ITEM: "ITEM",
    STATS: "STATS",
    SKILL: "SKILL"
};


export function Outcome(type, value = 0, amount = 1)
{
    ensureValidEnum(OutcomeType, type);
    if (type === OutcomeType.STATS)
    {
        ensureValidEnum(OutcomeStats, value);
    }

    return {
        type,
        value,
        amount: parseRule(amount)
    }
}

export const OutcomeStats = {
    STR: "STR",
    DEX: "DEX",
    INT: "INT",
    CHA: "CHA",
    HP: "HP"
};

const DEFAULT_OPTIONS = {
    /**
     * Target the skill is applied to
     */
    target: SkillTarget.THING,
    /**
     * Equipment items needed to perform the action
     */
    equipment: NONE,
    /**
     * Array of Outcome of a skill execution
     */
    outcome: NONE,
    /**
     * Array of material items used up by the action
     */
    materials: NONE,
    /**
     * Prequisite skills to learn this skill
     */
    prerequisite: NONE,

    /**
     * Main attribute for the skill if there's any.
     */
    mainAttribute: null,

    /**
     * Array of things, each fulfilling a location requirement of the skill.
     *
     */
    thing: NONE,

    /**
     * innate skills are usable as soon as the limits are met. non-innate skills need to be taught.
     */
    innate: true,
    /**
     * Time rule
     */
    time: 1000
};




function ensureValidEnum(EnumMap, target)
{
    if (!EnumMap.hasOwnProperty(target))
    {
        throw new Error("Invalid target: " + target + ", must be one of " + Object.keys(EnumMap).join(", "));
    }
}


export function buildSkillTree(entries)
{
    const map = new Map();

    for (let i = 0; i < entries.length; i++)
    {
        const entry = {
            ... DEFAULT_OPTIONS,
            ... entries[i],

        };

        entry.innate = !!entry.innate;
        entry.condition = entry.condition && parseRule(entry.condition);
        entry.time = parseRule(entry.time);


        const { prerequisite, target, equipment, outcome, materials, thing, time } = entry;

        for (let i = 0; i < prerequisite.length; i++)
        {
            const name = prerequisite[i];
            if (!map.has(name))
            {
                throw new Error("Prerequisite '" + name + "' is not a valid skill in skill tree");
            }
        }

        // for (let j = 0; j < equipment.length; j++)
        // {
        //     const item = equipment[j];
        //     if (!ITEMS.has(item))
        //     {
        //         throw new Error("Invalid item: " + item);
        //     }
        // }

        ensureValidEnum(SkillTarget, target);

        for (let j = 0; j < outcome.length; j++)
        {
            const out = outcome[j];
            if (!out)
            {
                throw new Error("Invalid outcome: " + out);
            }
            ensureValidEnum(OutcomeType, out.type);
            if (out.type === OutcomeType.STATS)
            {
                ensureValidEnum(OutcomeStats, out.value);
            }

            if (!(out.amount instanceof RPN))
            {
                throw new Error("Invalid RPN rule:" + out.amount);
            }
        }

        for (let j = 0; j < materials.length; j++)
        {
            const material = materials[j];

            // if (!ITEMS.has(material.item))
            // {
            //     throw new Error("Invalid material item: " + material.item);
            // }
            if (!Array.isArray(material.amount))
            {
                throw new Error("Invalid material RPN rule: " + material.amount);
            }
        }

        for (let j = 0; j < thing.length; j++)
        {
            const th = thing[j];

            if (th && !thingNames.hasOwnProperty(th))
            {
                throw new Error("Invalid skill location: " + th);
            }
        }


        if (!(time instanceof RPN))
        {
            throw new Error("Invalid time rule: " + time);
        }

        map.set(entry.name, entry);
    }

    return map;
}

export function Material(item, amount = 1)
{
    return {
        item,
        amount: parseRule(amount)
    }
}
