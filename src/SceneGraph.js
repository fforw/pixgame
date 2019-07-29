

export class Scene {
    constructor(ctx, input, parent = null)
    {
        this.ctx = ctx;
        this.parent = parent;
        this.input = input;
    }
}


function checkClass({classes}, cls)
{

    for (let i = 0; i < classes.length; i++)
    {
        const c = classes[i];
        if (c === cls)
        {
            return;
        }
    }

    throw new Error(cls + " is not a registered class in this scene graph")

}

const effectResolve = Symbol("effectResolve");

class SceneGraph {
    constructor(classes, ctx, input)
    {
        this.classes = classes;
        this.ctx = ctx;

        this.ctx.graph = this;

        this.current = new classes[0](this.ctx, input);

        console.log("SCENE-GRAPH", this);

        this.effectQueue = [];

        this.time = 0;
    }


    /**
     * Adds the given effect function to the running effects
     *
     * @param effect        effect function
     * @param [start]       start time. if not given, the current scene graph time is used
     * @param [duration]    how long to play the effect (default: 1 second)
     */
    addEffect(effect, start = null, duration = 1000)
    {
        if (start === null)
        {
            start = this.time;
        }

        const { effectQueue } = this;
        const end = start + duration;

        return new Promise(resolve => {

            const ctx = {
                start,
                duration,
                [effectResolve] : resolve
            };

            for (let i = 0; i < effectQueue.length; i += 2)
            {
                const currEnd = effectQueue[i] + effectQueue[i + 1];
                if (end < currEnd)
                {
                    effectQueue.splice(i, 0, ctx, effect);
                    return;
                }
            }
            effectQueue.push(ctx, effect);
        })
    }


    runEffects(delta)
    {
        const { effectQueue } = this;

        this.time += delta;

        const { time } = this;

        let doneLimit = -1;

        for (let i = 0; i < effectQueue.length; i += 2)
        {
            const ctx = effectQueue[i];
            const { start, duration } = ctx;
            const effect = effectQueue[i + 1];

            // is the end point still in the future?
            if ( start <= time && start + duration > time)
            {
                let limitBefore = doneLimit;
                // if this is the first not-done entry, mark it
                if (doneLimit < 0)
                {
                    doneLimit = i;
                }
                if (effect.run(ctx, (time - start) / duration) === false)
                {
                    // cancel effect
                    ctx.duration = 0;
                    // revert limit marking if it happened
                    doneLimit = limitBefore;
                }
            }
        }

        if (doneLimit > 0)
        {
            const removed = effectQueue.splice( 0, doneLimit);
            for (let i = 0; i < removed.length; i += 2)
            {
                const ctx = effectQueue[i];
                ctx[effectResolve]();
            }
        }
    }

    start()
    {
        this.onEnter();
    }


    onEnter()
    {
        if (typeof this.current.onEnter === "function")
        {
            //console.log("Invoking onEnter on ", this.current)
            this.current.onEnter();
        }
    }


    onExit()
    {
        if (typeof this.current.onExit === "function")
        {
            this.current.onExit();
        }
    }


    ticker(delta)
    {
        this.runEffects(delta);


        if (typeof this.current.ticker === "function")
        {
            this.current.ticker(delta);
        }

        this.render();
    }

    render()
    {
        if (typeof this.current.render === "function")
        {
            this.current.render();
        }
    }





    push(SceneClass, input)
    {
        checkClass(this, SceneClass);
        this.current = new SceneClass(this.ctx, input, this.current);
        this.onEnter();
    }

    pop()
    {
        const { parent } = this.current;
        if (!parent)
        {
            throw new Error("Cannot pop without parent");
        }

        this.onExit();
        this.current = parent;
    }



    goto(SceneClass, input)
    {
        checkClass(this, SceneClass);
        this.current = new SceneClass(this.ctx, input, null);
        this.onEnter();
    }

}


export default SceneGraph
