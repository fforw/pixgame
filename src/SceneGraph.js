

export class Scene {
    constructor(ctx, input, parent = null)
    {
        this.ctx = ctx;
        this.parent = parent;
        this.input = input;
    }
}


const effectResolve = Symbol("effectResolve");

const secret = Symbol("SceneGraph secret");

function setCurrent(graph, SceneClass, input, parent)
{
    const { ctx, classes } = graph[secret];

    if (classes.indexOf(SceneClass) < 0)
    {
        throw new Error(SceneClass + " is not a registered class in this scene graph")
    }


    const current = new SceneClass(ctx, input, parent);
    graph[secret].current = current;

    graph[secret].hasOnEnter = typeof current.onEnter === "function";
    graph[secret].hasOnExit = typeof current.onExit === "function";
    graph[secret].hasTicker = typeof current.ticker === "function";
    graph[secret].hasRender = typeof current.render === "function";

}

class SceneGraph {
    constructor(classes, ctx, input)
    {
        ctx.graph = this;

        this[secret] = {
            classes,
            ctx,
            
            effectQueue: [],
            time: 0,
            hasOnEnter: false,
            hasOnExit: false,
            hasTicker: false,
            hasRender: false
        };

        console.log("SCENE-GRAPH", this);

        setCurrent(this, classes[0], input, null);
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
        const { effectQueue, time } = this[secret];
        if (start === null)
        {
            start = time;
        }

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

        this[secret].time += delta;

        const { effectQueue, time } = this[secret];

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
        const { hasOnEnter, current } = this[secret];

        console.log({hasOnEnter, current})

        if (hasOnEnter)
        {
            //console.log("Invoking onEnter on ", current)
            current.onEnter();
        }
    }


    onExit()
    {
        const { hasOnExit, current } = this[secret];
        if (hasOnExit)
        {
            current.onExit();
        }
    }


    ticker(delta)
    {
        const { hasTicker, current } = this[secret];
        this.runEffects(delta);
        if (hasTicker)
        {
            current.ticker(delta);
        }

        this.render();
    }

    render()
    {
        const { hasRender, current } = this[secret];
        if (hasRender)
        {
            current.render();
        }
    }

    push(SceneClass, input)
    {
        setCurrent(this, SceneClass, input, this[secret].current);
        this.onEnter();
    }

    pop()
    {
        const { parent } = this[secret].current;
        if (!parent)
        {
            throw new Error("Cannot pop without parent");
        }

        this.onExit();

        this[secret].current = parent;
    }



    goto(SceneClass, input)
    {
        setCurrent(this, SceneClass, input, null);
        this.onEnter();
    }
}


export default SceneGraph
