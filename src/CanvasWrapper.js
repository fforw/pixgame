import React from "react"


/**
 * Adhoc wrapper to include a PIXI app into react without going the full react-pixi route.
 *
 * We handle the pixi state outside of react. React does some UI etc.
 */
class CanvasWrapper extends React.Component {

    shouldComponentUpdate(nextProps, nextState, nextContext)
    {
        return false;
    }

    componentDidMount()
    {
        this._elem.appendChild(this.props.canvasElem)
    }

    componentWillUnmount()
    {
        this._elem.removeChild(this.props.canvasElem)
    }


    render()
    {

        return (
            <div
                ref={ elem => this._elem = elem }
                className="canvas-wrapper"
            >
            </div>
        )
    }
}


export default CanvasWrapper
