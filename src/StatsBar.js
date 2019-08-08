
import React from "react"
import cx from "classnames"

const StatsBar = ({ value, min = 0, max = 20, className }) => {
    return (
        <div
            className="stats-bar"
        >
            <p
                className={ cx("stats m-1", className) }
                title={ value }
                style={{
                width : (98 * (value - min)/(max - min)|0) + "%"
            }}>
                &nbsp;
            </p>
        </div>
    )
};

export default StatsBar
