import React from "react"
import cx from "classnames"
import Meeple from "./Meeple";
import MeepleInfo from "./MeepleInfo";



const InfoBox = props => {

    const { mob } = props;

    return (
        <div className={
            cx(
                "info-container",
                "container-fluid",
                !mob && "d-none"
            )
        }>
            <div className="row">
                <div className="col-3">
                    <div className="info-box p-2 small ui-elem">
                        {
                            mob instanceof Meeple ? <MeepleInfo meeple={ mob }/> : JSON.stringify(mob)
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InfoBox
