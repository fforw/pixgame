

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


class SceneGraph {
    constructor(classes, ctx, input)
    {
        this.classes = classes;
        this.ctx = ctx;

        this.ctx.graph = this;

        this.current = new classes[0](this.ctx, input);

        console.log("SCENE-GRAPH", this);
    }


    start()
    {
        this.onEnter();
    }


    onEnter()
    {
        if (typeof this.current.onEnter === "function")
        {
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
        if (typeof this.current.ticker === "function")
        {
            this.current.ticker(delta);
        }

        if (typeof this.current.render === "function")
        {
            this.current.render();
        }
    }

    push(SceneClass, input)
    {
        checkClass(this, SceneClass);
        this.current = new SceneClass(this.ctx, input, this.current)
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
        this.current = new SceneClass(this.ctx, input, null)
    }

}


export default SceneGraph
