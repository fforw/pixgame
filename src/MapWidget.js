import React, { useRef, useEffect } from "react"

const MapWidget = props => {

    const { size, map } = props;

    const canvasElem = useRef(null);

    useEffect(
        () => {

            const size = (Math.min(window.innerWidth, window.innerHeight) - 150) | 0;

            const tmpCanvas = document.createElement("canvas");
            tmpCanvas.width = map.size;
            tmpCanvas.height = map.size;

            const tmpCtx = tmpCanvas.getContext("2d");
            const imageData = map.render(tmpCtx);
            tmpCtx.putImageData(imageData, 0, 0);

            const ctx = canvasElem.current.getContext("2d");
            ctx.drawImage(tmpCanvas, 0, 0, size, size);
        },
        []
    );

    return (
        <canvas
            ref={canvasElem}
            width={size}
            height={size}
        >
        </canvas>
    )

};

export default MapWidget;
