import React from "react"
import cx from "classnames"

import skillTree from "./skill-tree"
import { DiceRuleWidget } from "./rule/DiceRuleWidget";

const SkillTree = ({ meeple, skills, filterSkills, setFilterSkills }) => {

    const skillRows = [];

    for (let skill of skillTree.values())
    {
        const meepleHasSkill = skills.has(skill.name);

        if (meepleHasSkill || !filterSkills)
        {
            const missingPrerequisites = skill.prerequisite.filter( pre => !skills.has(pre));

            skillRows.push(
                <div key={skill.name} className="row">
                    <div className="col-3 align-middle">
                    <p
                        className={
                            cx(
                                "form-control-plaintext",
                                !meepleHasSkill && "text-muted"
                            )
                        }
                    >
                    {
                        skill.name
                    }
                    </p>
                    </div>
                    <div className="col-9">
                        <p className="form-control-plaintext">

                            <DiceRuleWidget rpn={ skill.condition } meeple={ meeple }/>
                            
                            {
                                missingPrerequisites.length > 0 && (
                                        <span
                                            className="ml-2"
                                        >
                                        Missing:
                                        {
                                            missingPrerequisites.map(
                                                pre => (
                                                    <span
                                                        key={ pre }
                                                        className="text-danger ml-2"
                                                    >
                                                        {
                                                            pre
                                                        }
                                                    </span>
                                                )
                                            )
                                        }
                                        </span>
                                )
                            }
                        </p>
                    </div>
                </div>
            )
        }
    }


    return (
        <React.Fragment>
            <div className="form">
                <div className="form-row">
                    <div className="form-check m-1">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id="filterField"
                            name="filter-skills"
                            checked={ filterSkills }
                            onChange={ () => setFilterSkills(!filterSkills) }
                        />
                        <label className="form-check-label" htmlFor="filterField">Show only acquired skills</label>
                    </div>
                </div>
            </div>
            {
                skillRows.length ? skillRows : (
                    <p>No skills</p>
                )
            }
        </React.Fragment>
    )
};

export default SkillTree
