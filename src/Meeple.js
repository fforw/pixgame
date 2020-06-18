import { BLOCKED, ITEM_SWORD, ITEM_TEXTURES, RIVER, SAND } from "./config";
import { createStats } from "./stats.js"
import SkillTree, {
    BLESSED_BY_ARES,
    BLESSED_BY_ATHENA,
    BLESSED_BY_DEMETER,
    GUILD_OF_ARES,
    GUILD_OF_ATHENA, GUILD_OF_DEMETER
} from "./skill-tree";
import { evaluateRule } from "./rule/diceRule";
import generate from "./util/name-generator";
import wait from "./util/wait";
import { tmpVacated } from "./scenes/WorldScene";
import { MOVING, STATIC } from "./Collision";


const BODY_TYPES = [
    "meeple-body-blue.png",
    "meeple-body-green.png",
    "meeple-body-red.png",
    "meeple-body-yellow.png",
    "meeple-body-teal.png",
    "meeple-body-purple.png",
    "meeple-body-gray.png",
    "meeple-body-black.png",
    "meeple-body-white.png",
];

export const BUZZCUT = "meeple-hair-buzz.png";
const MOHAWK = "meeple-hair-mohawk.png";

const HAIR_STYLES = [
    null,
    BUZZCUT,
    "meeple-hair-black.png",
    "meeple-hair-blond.png",
    "meeple-hair-brown.png",
    "meeple-hair-red.png",
    "meeple-hair-purple.png",
    MOHAWK
];

const HEAD_TYPES = [
    "meeple-head-dark.png",
    "meeple-head-dark2.png",
    "meeple-head-pale.png",
    "meeple-head-tan2.png",
    "meeple-head-tan.png",
];

const OUTLINE = "meeple-outline.png";

const MIN_ACCELERATION = 0.5;
const MAX_ACCELERATION = 1.5;
const SPEED_LIMIT = 15;

const MEEPLE_WORKER = "meeple-worker.png";

function collectSkills(meeple, skills, name)
{
    const existing = skills.get(name);
    if (existing !== undefined)
    {
        return existing !== false;
    }

    //console.log("CHECK", meeple, name);

    const skill = SkillTree.get(name);
    if (!skill)
    {
        throw new Error("Invalid skill: " + name);
    }

    const {condition, prerequisite, innate} = skill;

    if (!innate || (condition && !evaluateRule(meeple.random, condition, meeple)))
    {
        //console.log("FAILED", condition, meeple)

        skills.set(skill.name, false);
        return false;
    }

    if (prerequisite)
    {
        for (let i = 0; i < prerequisite.length; i++)
        {
            const preReq = prerequisite[i];
            const hasPreReq = collectSkills(meeple, skills, preReq);
            if (!hasPreReq)
            {
                // console.log("FAILED PREREQ", preReq, meeple)
                skills.set(skill.name, false);
                return false;
            }
        }

    }

    skills.set(skill.name, skill);
    return true;
}

export const SECONDARY_STAT = new Map();

SECONDARY_STAT.set("str", "int");
SECONDARY_STAT.set("dex", "str");
SECONDARY_STAT.set("int", "dex");

export const GUILDS = new Map();
GUILDS.set(GUILD_OF_ARES, "str");
GUILDS.set(GUILD_OF_DEMETER, "dex");
GUILDS.set(GUILD_OF_ATHENA, "int");

export const GUILD_UNIFORMS = new Map();
GUILD_UNIFORMS.set(GUILD_OF_ARES, "meeple-ares.png");
GUILD_UNIFORMS.set(GUILD_OF_DEMETER, "meeple-demeter.png");
GUILD_UNIFORMS.set(GUILD_OF_ATHENA, "meeple-athena.png");
GUILD_UNIFORMS.set(null, "meeple-worker.png");


function getSkills(meeple)
{
    const skills = new Map();
    for (let name of SkillTree.keys())
    {
        collectSkills(meeple, skills, name);
    }

    const set = new Set();

    for (let skill of skills.values())
    {
        if (skill !== false)
        {
            set.add(skill.name);
        }
    }

    const order = ["str","dex","int"];
    order.sort((a,b) => {
        return meeple.stats[b] - meeple.stats[a];
    });

    let guild;
    let max = 0;

    for (let [name,stat] of GUILDS.entries())
    {
        const skill = SkillTree.get(name);
        if (evaluateRule(meeple.random, skill.condition, meeple, false) && meeple.stats[stat] > max )
        {

            guild = name;
            max = meeple.stats[stat];
        }
    }

    if (guild === GUILD_OF_ATHENA)
    {
        meeple.hair = BUZZCUT;
        meeple.hairOffset = meeple.headOffset - 15;
    }
    else if (guild === GUILD_OF_ARES)
    {
        meeple.item = ITEM_SWORD;
    }

    set.add(guild);
    return set;
}


let movementCounter = 1;


let selectedPath;
let selectedPathX;
let selectedPathY;

function getSelectedPathGraphics(ctx)
{
    if (!selectedPath)
    {
        // Create a new Graphics object and add it to the scene
        selectedPath = new PIXI.Graphics();
        ctx.app.stage.addChild(selectedPath);
    }
    return selectedPath;
}

function calculateAcceleration(stats)
{
    // small penalty for being very strong, quadratic distribution, interval [0, 5]
    const penalty = (stats.str * stats.str) / 80;

    // normalized speed, interval [0, 1]
    const speed = (stats.dex - penalty) / 20;


    return MIN_ACCELERATION + speed * (MAX_ACCELERATION - MIN_ACCELERATION);
}

function findWalkable(collision, x, y, maxSteps = 1000)
{
    const { sizeMask, sizeBits } = collision;

    let status = collision.lookup(x,y);
    if (!status)
    {
        return (y << sizeBits) + x;
    }

    let dx = 1;
    let dy = 0;
    let steps = 1;

    while (true)
    {
        for (let i=0; i < 2; i++)
        {
            for (let j =0; j < steps; j++)
            {
                x += dx;
                y += dy;

                //console.log("CHECK", x, y);

                status = collision.lookup(x,y);
                if (!status)
                {
                    return (y << sizeBits) + x;
                }
            }

            // rotate 90 degrees clockwise
            let tmp = dx;
            dx = -dy;
            dy = tmp;

            if (--maxSteps === 0)
            {
                return -1;
            }
        }
        steps++;
    }
}

export function findMultipleWalkable(collision, x, y, count = 1, maxSteps = 1000)
{

    const offsets = [];
    const { sizeMask, sizeBits } = collision;

    let status = collision.lookup(x,y);
    if (!status)
    {
        offsets.push((y << sizeBits) + x);
        if (offsets.length === count)
        {
            return offsets;
        }
    }

    let dx = 1;
    let dy = 0;
    let steps = 1;

    while (true)
    {
        for (let i=0; i < 2; i++)
        {
            for (let j =0; j < steps; j++)
            {
                x += dx;
                y += dy;

                //console.log("CHECK", x, y);

                status = collision.lookup(x,y);
                if (!status)
                {
                    offsets.push((y << sizeBits) + x);
                    if (offsets.length === count)
                    {
                        return offsets;
                    }
                }
            }

            // rotate 90 degrees clockwise
            let tmp = dx;
            dx = -dy;
            dy = tmp;

            if (--maxSteps === 0)
            {
                throw new Error("Haven't found " + count + " walkable tiles");
            }
        }
        steps++;
    }
}


function startMoving(meeple)
{
    const { collision } = meeple.ctx;
    collision.clear(meeple.x >> 4, meeple.y >> 4);
    meeple.moving = true;
}

function stopMoving(meeple)
{
    const { collision } = meeple.ctx;

    collision.register(meeple.id, meeple.x >> 4, meeple.y >> 4, false);
    meeple.moving = false;
}





class Meeple {
    constructor(random, ctx, id)
    {
        this.ctx = ctx;
        this.random = random;
        this.id = id;

        const stats = createStats(random);
        this.updateStats(stats);

        this.name = generate(random, random.nextInt(3, 6));

        this.hpMax = random.nextInt(40, 60) + ((stats.str + stats.dex) >> 1) * 5;
        this.hp = this.hpMax;
        this.gold = random.nextInt(900, 1200);

        this.x = 0;
        this.y = 0;
        this.dx = 0;
        this.dy = 0;
        this.moveX = 0;
        this.moveY = 0;
        //this.name = generate(random, random.nextInt(4, 9, CITIES));

        this.body = random.nextArrayItem(BODY_TYPES);
        this.head = random.nextArrayItem(HEAD_TYPES);
        this.hair = random.nextArrayItem(HAIR_STYLES);
        this.item = null;

        this.headOffset = -20 - ((this.stats.str - 5) / 3 | 0)  //random.nextInt(-25, -20);
        this.hairOffset =
            this.headOffset + (this.hair === BUZZCUT || this.hair === MOHAWK ? -15 : random.nextInt(-14, -11));

        this.currentMovement = 0;
        this.currentPath = [];
        this.currentPathPos = 0;
        this.targetX = 0;
        this.targetY = 0;
        this.distanceToTarget = 0;
        this.delay = 0;
        this.uniform = null;
        this.notFound = 0;

        this.skills = getSkills(this);
    }

    place(x,y)
    {
        const { collision } = this.ctx;

        if (this.placed)
        {
            collision.clear(this.x >> 4, this.y >> 4);
        }

        this.x = x;
        this.y = y;

        collision.register(this.id, this.x >> 4, this.y >> 4, STATIC);
        this.placed = true;
    }

    draw(posX, posY, highlight = false)
    {

        const {ctx} = this;

        const {tileLayer, atlas, map} = ctx;

        const {x, y, body, head, hair, headOffset, hairOffset, item, uniform} = this;

        let pivot, frame;

        ({pivot, frame} = atlas.frames[body]);

        tileLayer.addFrame(
            body,
            x - posX - pivot.x * frame.w | 0,
            y - posY - pivot.y * frame.h | 0
        );

        if (uniform && uniform !== MEEPLE_WORKER)
        {
            ({pivot, frame} = atlas.frames[uniform]);
            tileLayer.addFrame(
                uniform,
                x - posX - pivot.x * frame.w | 0,
                y - posY - pivot.y * frame.h | 0
            );
        }

        if (highlight)
        {
            ({pivot, frame} = atlas.frames[OUTLINE]);
            tileLayer.addFrame(
                OUTLINE,
                x - posX - pivot.x * frame.w | 0,
                y - posY - 10 - pivot.y * frame.h | 0
            );
        }

        ({pivot, frame} = atlas.frames[head]);
        tileLayer.addFrame(
            head,
            x - posX - pivot.x * frame.w | 0,
            y - posY + headOffset - pivot.y * frame.h | 0
        );

        if (hair)
        {
            ({pivot, frame} = atlas.frames[hair]);
            tileLayer.addFrame(
                hair,
                x - posX - pivot.x * frame.w | 0,
                y - posY + hairOffset - pivot.y * frame.h | 0
            );
        }

        if (uniform === MEEPLE_WORKER)
        {
            ({pivot, frame} = atlas.frames[uniform]);
            tileLayer.addFrame(
                uniform,
                x - posX - pivot.x * frame.w | 0,
                y - posY + hairOffset + (this.hair === BUZZCUT || this.hair === MOHAWK ? 4 : -1) - pivot.y * frame.h | 0
            );
        }

        if (item)
        {
            const itemTex = ITEM_TEXTURES[item];
            ({pivot, frame} = atlas.frames[itemTex]);
            tileLayer.addFrame(
                itemTex,
                x - posX - pivot.x * frame.w | 0,
                y - posY - 10 - pivot.y * frame.h | 0
            );
        }

    }


    ticker(delta)
    {
        if (this.delay > 0)
        {
            this.delay--;
            return;
        }

        const { x, y, ctx, currentPath, stats, moving} = this;
        const { map, posX, posY, collision } = ctx;
        let { currentPathPos } = this;

        getSelectedPathGraphics(ctx).position.set(
            selectedPathX - (posX),
            selectedPathY - (posY)
        );


        const isMovementBlocked = (x, y, nextX, nextY, ignoreMinorCollision) =>
        {
            const fx = x & 15;
            const fy = y & 15;

            const currentMapX = x >> 4;
            const currentMapY = y >> 4;
            const nextMapX = nextX >> 4;
            const nextMapY = nextY >> 4;

            const status = collision.lookup(nextMapX, nextMapY);
            if (status)
            {
                if (collision.getStatus(status) === MOVING)
                {
                    // just do nothing and wait for the other guy to move
                    console.log(this.name + ": wait for", nextMapX, nextMapY);

                    collision.register(this.id, currentMapX, currentMapY, STATIC);
                    this.dx = 0;
                    this.dy = 0;
                    this.delay = 25;
                    return true;
                }

                // disregard  collision if just brushing the border region
                if (ignoreMinorCollision && (fx < 4 || fx >= 12) && (fy < 4 || fy >= 12))
                {
                    return false;
                }

                console.log(this.name + ": blocked at", this.x >> 4, this.y >> 4);

                this.x -= this.dx * delta * 2;
                this.y -= this.dy * delta * 2;
                this.dx = 0;
                this.dy = 0;

                const offset = findWalkable(collision, this.endMapX, this.endMapY);

                const endX = (offset & map.sizeMask);
                const endY = (offset >> map.sizeBits);

                console.log(this.name + ": revised end position from ", this.endMapX, this.endMapY, " to ", endX, endY);

                this.endMapX = endX;
                this.endMapY = endY;

                stopMoving(this);
                this.moveTo(endX << 4, endY << 4);
                return true;
            }
            return false;
        };


        if (moving)
        {

            const sdx = this.startX - this.x;
            const sdy = this.startY - this.y;
            const distanceToStart = Math.sqrt(sdx * sdx + sdy * sdy);

            const tile = map.read(x >> 4, y >> 4);
            const speedLimit = SPEED_LIMIT * (tile === RIVER ? 0.15 : tile === SAND ? 0.4 : 1);

            if (distanceToStart + speedLimit > this.distanceToTarget )
            {
                // if (this.wasBlocked)
                // {
                //     stopMoving(this);
                //     this.wasBlocked = false;
                //     this.moveTo(this.endMapX, this.endMapY);
                // }
                //
                if (currentPathPos >= currentPath.length)
                {
                    const dx = this.targetX - x;
                    const dy = this.targetY - y;

                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 3)
                    {
                        const result = isMovementBlocked(this.x, this.y, this.targetX, this.targetY, false);
                        //console.log(`isMovementBlocked(${this.x >> 4}, ${this.y >> 4}, ${this.targetX >> 4}, ${this.targetY >> 4}, false) => ${result}`);
                        if (result)
                        {
                            return;
                        }

                        tmpVacated.offsets[tmpVacated.count++] = this.x >> 4;
                        tmpVacated.offsets[tmpVacated.count++] = this.y >> 4;

                        // we're there
                        this.x = this.targetX;
                        this.y = this.targetY;
                        this.dx = 0;
                        this.dy = 0;

                        console.log(this.name + ": stop at", this.x >> 4, this.y >> 4);
                        stopMoving(this);

                        return;
                    }
                    else
                    {
                        //console.log("Closing in to end");
                        this.dx *= 0.2;
                        this.dy *= 0.2;
                    }
                }
                else
                {
                    this.targetX = (currentPath[currentPathPos++] << 4);
                    this.targetY = (currentPath[currentPathPos++] << 4);
                }

                //console.log(`Moving from ${this.x >> 4}, ${this.y >> 4}  to  ${this.targetX >> 4}, ${this.targetY >> 4}`, currentPathPos);

                this.startX = x;
                this.startY = y;
                this.currentPathPos = currentPathPos;

                const dx = this.targetX - x;
                const dy = this.targetY - y;

                this.distanceToTarget = Math.sqrt(dx * dx + dy * dy);

                const factor = stats.acceleration / this.distanceToTarget;
                this.moveX = dx * factor;
                this.moveY = dy * factor;


            }

            this.dx = this.dx * 0.85 + this.moveX;
            this.dy = this.dy * 0.85 + this.moveY;

            const speed = Math.sqrt( this.dx * this.dx + this.dy * this.dy );
            if (speed > speedLimit)
            {
                const factor = 1 / speed;
                this.dx *= factor;
                this.dy *= factor;
            }

            const nextX = this.x + this.dx * delta;
            const nextY = this.y + this.dy * delta;


            const currentMapX = this.x >> 4;
            const currentMapY = this.y >> 4;
            const nextMapX = nextX >> 4;
            const nextMapY = nextY >> 4;

            if (currentMapX !== nextMapX || currentMapY !== nextMapY)
            {
                if (isMovementBlocked(x, y, nextX, nextY, true))
                {
                    return;
                }

                tmpVacated.offsets[tmpVacated.count++] = currentMapX;
                tmpVacated.offsets[tmpVacated.count++] = currentMapY;
                collision.register(this.id, nextMapX, nextMapY, MOVING);
            }

            this.x = nextX;
            this.y = nextY;
        }
    }


    moveTo(targetX, targetY)
    {
        const {x, y, ctx, stats} = this;

        const { map } = ctx;
        const { fineMask, sizeMask } = map;

        const id = movementCounter++;
        this.currentMovement = id;
        this.currentPath = [];
        this.currentPathPos = 0;
        this.startX = x;
        this.startY = y;
        stopMoving(this);


        const start = () =>
        {
            // let's get started..
            this.targetX = (this.currentPath[2] << 4);
            this.targetY = (this.currentPath[3] << 4);

            //console.log(`Start moving from ${this.x >> 4}, ${this.y >> 4}  to  ${this.targetX >> 4}, ${this.targetY >> 4}`);

            const dx = this.targetX - x;
            const dy = this.targetY - y;

            this.distanceToTarget = Math.sqrt(dx * dx + dy * dy);

            const factor = stats.acceleration / this.distanceToTarget;
            this.moveX = dx * factor;
            this.moveY = dy * factor;

            this.currentPathPos = 4;
            this.endMapX = this.currentPath[this.currentPath.length - 2];
            this.endMapY = this.currentPath[this.currentPath.length - 1];

            this.morePathsPending = true;


            startMoving(this);

            // const gfx = getSelectedPathGraphics(ctx);
            //
            // selectedPathX = ((this.currentPath[0] << 4) ) << 1;
            // selectedPathY = ((this.currentPath[1] << 4) - 4 ) << 1;
            //
            // gfx.clear();
            // gfx.lineStyle(1, 0xff00ff, 0.6);
            //
            // // Draw the line (endPoint should be relative to selectedPath's position)
            // gfx.moveTo(0, 0);
            // for (let i = 2; i < this.currentPath.length; i += 2 )
            // {
            //     gfx.lineTo(
            //         (((this.currentPath[i    ] << 4)  ) << 1) - selectedPathX,
            //         (((this.currentPath[i + 1] << 4) - 4 ) << 1) - selectedPathY
            //     );
            // }
        };

        let startX = x;
        let startY = y;

        ctx.services.planPath(
            ctx.map.worldId,
            startX >> 4,
            startY >> 4,
            ((targetX & fineMask) >> 4) + 1 & sizeMask,
            ((targetY - 4 & fineMask) >> 4) + 1 & sizeMask,
            segment => {
                const wasEmpty = !this.currentPath.length;

                this.currentPath = this.currentPath.concat(segment);

                if (wasEmpty)
                {
                    start();
                }
                else
                {
                    //console.log("Adding segment", segment);
                }

                // abort sub-path finding if the meeple got a new move target while we were moving
                return this.currentMovement === id;
            }
        ).then(msg => {

            if (msg.path === null)
            {
                console.log(this.name + ": No path found");
                stopMoving(this);

                this.notFound++;
                if (this.notFound < 3)
                {
                    wait(300).then(() => {

                        console.log(this.name + ": Retrying...");
                        return moveTo(targetX, targetY);
                    });
                }

                return;
            }
            else if (msg.path === false)
            {
                console.log(this.name + ": aborted");
                stopMoving(this);
                return;
            }

            this.notFound = 0;

            const wasEmpty = !this.currentPath.length;
            const lastSegmentStart = msg.lastSegmentStart;

            this.currentPath = this.currentPath.concat(msg.path.slice(lastSegmentStart));
            this.morePathsPending = false;
            //console.log("Final segment", this.currentPath);

            if (wasEmpty)
            {
                start();
            }
        })

    }

    updateStats(stats)
    {
        stats.acceleration = calculateAcceleration(stats);

        this.stats = stats;
    }
}

export default Meeple
