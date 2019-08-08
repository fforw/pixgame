import React, { useState } from "react"
import cx from "classnames"
import Meeple from "./Meeple";
import StatsBar from "./StatsBar";
import ListGroup from "reactstrap/es/ListGroup";
import ListGroupItem from "reactstrap/es/ListGroupItem";
import SkillTree from "./SkillTree";

const TabSet = ({children}) => {

    const [selected, selectTab ] = useState(0);


    return(
        <React.Fragment>
            <div className="row">
                <div className="col">
                    {
                        React.Children.toArray(children)[selected].props.children
                    }
                </div>
            </div>
            <div className="row">
                {
                    React.Children.map(children, (kid, index) => (
                        <div className="col">
                            {
                                React.cloneElement(
                                    kid,
                                    {
                                        selected,
                                        selectTab,
                                        index
                                    }
                                )
                            }
                        </div>

                    ))
                }
            </div>

        </React.Fragment>

    );
};

const Tab = ({index, name, selected, selectTab}) => (
    <button
        type="button"
        className={cx("btn btn-link", index === selected && "btn-active disabled")}
        onClick={
            () => selectTab(index)
        }>
        {
            name
        }
    </button>
);

const MeepleInfo = props => {

    const {meeple} = props;
    const {skills} = meeple;

    const [ filterSkills, setFilterSkills ] = useState(true);

    console.log("MEEPLE", meeple);
    return (
        <React.Fragment>
            <div className="row">
                <div className="col">
                    <h5>
                        {meeple.name}
                    </h5>
                </div>
            </div>
            <TabSet>
                <Tab name="Stats">
                    <div className="row">
                        <div className="col-2 align-middle">
                    <span className="form-control-plaintext">
                    Strength
                    </span>
                        </div>
                        <div className="col-10">
                            <StatsBar value={meeple.stats.str} min={ 4 }/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-2 align-middle">
                    <span className="form-control-plaintext">
                        Dexterity
                    </span>
                        </div>
                        <div className="col-10">
                            <StatsBar value={meeple.stats.dex} min={ 4 }/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-2 align-middle">
                    <span className="form-control-plaintext">
                        Intelligence
                    </span>
                        </div>
                        <div className="col-10">
                            <StatsBar value={meeple.stats.int} min={ 4 }/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-2 align-middle">
                    <span className="form-control-plaintext">
                        Charisma
                    </span>
                        </div>
                        <div className="col-10">
                            <StatsBar value={meeple.stats.cha} min={ 4 }/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-2 align-middle">
                    <span className="form-control-plaintext">
                        Health
                    </span>
                        </div>
                        <div className="col-10">
                            <StatsBar className="health" value={meeple.hp} max={200}/>
                        </div>
                    </div>

                </Tab>
                <Tab name="Skills">
                    <SkillTree
                        meeple={ meeple }
                        skills={ skills }
                        filterSkills={ filterSkills}
                        setFilterSkills={ setFilterSkills }
                    />
                </Tab>
            </TabSet>
        </React.Fragment>
    );
};

export default MeepleInfo
