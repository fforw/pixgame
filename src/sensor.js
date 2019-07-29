export const SensorMode =
    {
        MOTION: "MOTION",
        INTERACTION: "INTERACTION"
    };

const DEFAULT_OPTIONS = {

    fromDirections : 15
};

export default function Sensor(mode, action, ctx = {}, options)
{
    options = {
        ... DEFAULT_OPTIONS,
        ... options
    };

    if (__DEV)
    {
        if (!mode || !SensorMode.hasOwnProperty(mode))
        {
            throw new Error("Invalid mode: " + mode)
        }

        if (typeof action !== "function")
        {
            throw new Error("Need sensor action: got " + action)
        }
    }

    this.mode = mode;
    this.action = action;
    this.ctx = ctx;
    this.options = options;
}
