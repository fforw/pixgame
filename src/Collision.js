import { isPow2, log2 } from "bit-twiddle";
import { BLOCKED } from "./config";

export const STATIC = 1;
export const MOVING = 2;
export const FUTURE = 3;

export default class Collision {
    constructor(map, uint32 = false)
    {
        const { size } = map;

        if (!isPow2(size))
        {
            throw new Error("Size must be power of two: " + size);
        }

        this.sizeBits = log2(size);
        this.sizeMask = size - 1;
        
        this.dataBits = uint32 ? 30 : 14;
        this.dataMask = uint32 ? 0x3fffffff : 0x3fff;
        this.statusMask = uint32 ? 0xc0000000 : 0xc000;

        console.log(`Collision mask ( max = ${this.dataMask} )`);

        const length = 1 << (this.sizeBits << 1);
        this.data = uint32 ? new Uint32Array(length) : new Uint16Array(length);

        this.updateFromMap(map);

    }

    updateFromMap(map)
    {
        const {things} = map;
        for (let i = 0; i < things.length; i++)
        {
            this.data[i] = things[i] >= BLOCKED ? STATIC << this.dataBits : 0;
        }
    }


    register(id, x, y, status = STATIC)
    {
        const { sizeMask, sizeBits } = this;

        //console.log("Register #", id, " at ", x, y);

        this.data[((y & sizeMask) << sizeBits) + (x & sizeMask)] =  (status << this.dataBits) + id;
    }


    clear(x, y)
    {
        const { sizeMask, sizeBits } = this;
        this.data[((y & sizeMask) << sizeBits) + (x & sizeMask)] = 0;
    }


    lookup(x, y)
    {
        const { sizeMask, sizeBits } = this;
        return this.data[((y & sizeMask) << sizeBits) + (x & sizeMask)];
    }


    getId(value)
    {
        return value & this.dataMask;
    }


    getStatus(value)
    {
        return value >>> this.dataBits;
    }
}
