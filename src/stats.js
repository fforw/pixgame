import Prando from "prando";


export function createStats(random)
{

    const array = [
        random.nextInt(6, 15),
        random.nextInt(6, 15),
        random.nextInt(6, 15),
        random.nextInt(5, 20)
    ];

    const order = [0,1,2].sort((a,b) => {
        return array[b] - array[a];
    });

    // add 3 to the best stat
    array[order[0]] += 5;
    array[order[1]] += 1;
    // decrease the two lowest stats by one
    array[order[2]]--;

    const [ str, dex , int, cha] = array;

    return {
        str,
        dex,
        int,
        cha
    }
}
