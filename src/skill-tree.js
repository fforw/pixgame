import { buildSkillTree,  Outcome, OutcomeType, SkillTarget, OutcomeStats, Material  } from "./skills"
import { ITEM_AXE, ITEM_WOOD, LARGE_TREE, LARGE_TREE_2, SMALL_TREE, SMALL_TREE_2, SMALL_TREE_3 } from "./config";


export const GUILD_OF_ATHENA = "Guild of Athena";
export const GUILD_OF_DEMETER = "Guild of Demeter";
export const GUILD_OF_ARES = "Guild of Ares";
const skillTree = buildSkillTree([
    /* MEDICINE*/
    {
        name: "First Aid",
        condition: "DEX > 7 && INT > 7",
        outcome: [Outcome(OutcomeType.STATS, OutcomeStats.HP, "1d6 + DEX")],
        target: SkillTarget.MEEPLE
    }, {
        name: "Heal",
        condition: "INT > 12",
        outcome: [Outcome(OutcomeType.STATS, OutcomeStats.HP, "2d6 + INT")],
        target: SkillTarget.MEEPLE,
        innate: false
    }, {
        name: "Heal 2",
        condition: "INT > 12",
        outcome: [Outcome(OutcomeType.STATS, OutcomeStats.HP, "3d6 + INT")],
        target: SkillTarget.MEEPLE,
        innate: false,
        prerequisite: ["Heal"]
    }, {
        name: "Heal 3",
        condition: "INT > 13",
        outcome: [Outcome(OutcomeType.STATS, OutcomeStats.HP, "4d6 + INT")],
        target: SkillTarget.MEEPLE,
        innate: false,
        prerequisite: ["Heal 2"]
    }, {
        name: "Chop Tree",
        condition: "STR > 7",
        thing: [SMALL_TREE, SMALL_TREE_2, SMALL_TREE_3],
        equipment: [ITEM_AXE],
        outcome: [Outcome(OutcomeType.ITEM, ITEM_WOOD, "1d4 + DEX")],
        target: SkillTarget.MEEPLE
    },
    {
        name: "Chop Large Tree",
        condition: "STR > 9",
        thing: [LARGE_TREE, LARGE_TREE_2],
        equipment: [ITEM_AXE],
        outcome: [Outcome(OutcomeType.ITEM, ITEM_WOOD, "2d6 + DEX")],
        target: SkillTarget.MEEPLE
    },
    {
        name: GUILD_OF_ATHENA,
        innate: false,
        condition: "INT >= 13 && DEX >= 9",
        outcome: [Outcome(OutcomeType.SKILL)],
        target: SkillTarget.MEEPLE
    },
    {
        name: GUILD_OF_DEMETER,
        innate: false,
        condition: "DEX >= 12 && STR >= 7",
        outcome: [Outcome(OutcomeType.SKILL)],
        target: SkillTarget.MEEPLE
    },
    {
        name: GUILD_OF_ARES,
        innate: false,
        condition: "STR >= 15 && INT >= 12",
        outcome: [Outcome(OutcomeType.SKILL)],
        target: SkillTarget.MEEPLE
    }

]);
export default skillTree;

//console.log("SKILL-TREE",skillTree);
