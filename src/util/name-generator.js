const startLetters = ["m","e","h","h","s","s","a","l","e","m","l","l","e","e","l","a","s","s","l","l","l","l","j","l","n","n","l","m","m","c","c","k","l","s","s","p","m","a","l","l","i","j","g","m","m","m","z","z","f","f","l","l","l","p","m","e","e","e","j","v","v","j","f","f","i","i","i","h","i","e","a","m","m","m","k","j","y","s","l","l","l","l","a","a","f","p","n","e","j","m","l","m","c","k","m","n","t","t","m","f","b","l","l","p","j","f","f","l","l","l","l","m","f","n","e","j","m","t","m","h","h","n","n","p","j","j","t","j","e","a","d","o","o","f","a","e","e","r","r","m","l","m","m","s","j","y","y","y","l","l","l","l","h","m","v","a","j","t","n","n","t","b","f","m","j","n","s","n","n","j","j","j","c","k","d","l","a","m","m","m","o","l","c","k","s","j","j","y","c","c","j","t","l","m","j","j","d","d","m","m","j"];
const letterStats = {"M":["i","a","a","a","i","a","a","e","a","a","a","i","a","e","a","e","a","a","o","a","a","a","i","a","a","a","a","i","a","a"],"i":["a","a","a","l","a","e","e","l","l","e","n","e","e","e","l","l","s","s","a","l","n","s","a","l","l","n","e","d","a","a","e","c","a","k","a","n","n","n","s","r","n","n","n","e","s","s","a","k","o","n","a","n","s","s","n","s","s","m","l","a","x","a","a","m","t","k","c","l","p","l","d","a","k","c","m","k","k","c","c","a","n","k","n","a","c","k","l","n","a","u","c","l","e","e","s","s","s","n","n","a","s","s","s","n","n","a","l","n","c","n","k","m","m"],"E":["m","m","m","m","l","m","m","l","v","l","m","r","r"],"m":["m","a","i","i","i","e","e","e","y","i","i","i","i","o","i","u","i","i"],"H":["a","a","e","e","e","a"],"a":["n","h","n","r","n","u","r","j","y","r","r","r","r","h","r","t","t","h","u","r","n","b","b","b","b","r","r","h","t","r","s","s","u","g","l","r","r","r","n","u","s","s","x","n","h","s","n","x","s","s","k","c","n","n","v","r","r","b","n","f","e","p","e","t","t","d","n","n","n","n","r","r","m","n","n","t","n","m","n","r","m","n","h","r","r","n","r","t","t","t","r","n","n","s","n","n","n","n","s","n","n","x","k"],"n":["n","a","n","a","n","a","a","i","a","n","a","i","a","a","e","a","e","j","n","j","a","a","t","i","n","i","a","e","a","a","a","z","a","n","n","r","r","d","t","n","i","n","i","n","i","n","i","n","a","n","a","u","n","e","c","t","a","j","n","e","a","a","i","n","o","a","s","t","s","t","n","i","i","n","i","n","y","n","i","i"],"S":["o","o","o","o","a","a","t","i","a","e"],"o":["f","p","n","p","f","u","h","t","t","e","e","r","r","s","u","n","n","r","n","n","u","a","r","b","b","m","n","n","n","r","n","h","n","n","x","n","n","n","n","l","l","e","b","h","s","m","m","h"],"f":["i","i","i","a"],"p":["h","h","p","h"],"h":["i","i","a","a","i","a","e","i","a","a","e","a","i","i","a","u","n"],"A":["n","m","l","m","n","n","l","n","d","a"],"L":["e","e","e","i","i","i","u","o","a","a","e","i","o","i","i","y","u","u","u","o","u","u","u","e","u","o","u","e","e","e","i","i","e","e","e"],"e":["a","n","o","l","l","e","l","n","t","l","d","n","l","l","f","l","l","l","l","n","l","l","n","r","r","s","r","s","l","n","o","l","n","n","x","r","l","l","o","o","n","n","s","n","o","n","l","l","s","l","n","o","b","l","n"],"l":["i","y","i","i","l","y","l","i","e","e","o","a","a","a","i","i","d","d","i","a","e","l","a","y","i","l","l","e","e","l","a","i","l","a","i","e","e","e","a","a","i","i","i","i","i","a","a","i","e","l","o","o","i","s","s","e","i","l","i","a"],"r":["i","a","a","l","a","a","a","a","e","i","i","l","i","i","a","a","a","i","a","l","l","l","i","e","e","a","i","y","i","i","i","d","t","i","i","l","l","l","o","d"],"u":["i","i","r","l","l","c","c","i","i","l","l","n","c","k","l","i","i","k","l","s","l","s","e","a"],"s":["a","a","a","e","a","a","a","a","a","m","m","e","e","a","a","s","a","k","k","c","t","t","t","h","i"],"J":["o","u","a","o","a","u","o","u","a","a","a","a","o","u","o","o","o","a","a","o","o","o","o"],"N":["e","e","o","i","o","i","i","i","i","i","i","i"],"j":["a","a","a","a"],"y":["a","a","n"],"C":["h","l","a","a","o","o","o"],"t":["t","e","t","a","a","h","i","o","o","h","e","o","z","o","t","e","s","h","t","i","h","t","h","a","i","a","i","i"],"K":["l","a","a","a","o"],"P":["i","a","a","a","h"],"I":["d","s","s","s","s"],"d":["a","a","a","a","a","a","e","s","r"],"G":["r"],"Z":["o","o"],"F":["r","r","i","i","i","r","i","y","e","a","l"],"V":["i","i","i"],"c":["t","y","i","a","l","o","a","k","e","o","k"],"k":["t","a","a","a","a","l","o","a","a","o","s"],"b":["e","e","e","e","i","a","i"],"Y":["a","a","a","a","a"],"v":["a","i"],"g":["d"],"T":["h","e","i","o","h","i","o"],"z":["i"],"B":["e","e"],"x":["i","a","i"],"D":["a","a","o","o"],"O":["s","s","l"],"R":["a","a"]};
const terminals = {"a":true,"h":true,"e":true,"y":true,"i":true,"l":true,"n":true,"s":true,"x":true,"m":true,"z":true,"p":true,"b":true,"r":true,"d":true,"k":true,"c":true,"o":true,"t":true};

function choice(random, a)
{
    return a[random.nextInt( 0, a.length - 1)];
}

export default function generate(random, min_length)
{
    let word = choice(random, startLetters);
    const title = [word.toUpperCase()];
    while (letterStats.hasOwnProperty(word))
    {
        const next_words = letterStats[word];
        word = choice(random, next_words);

        const c = title[title.length - 1];
        if ( c  === " " || c === "'")
        {
            title.push(word.toUpperCase());
        }
        else
        {
            title.push(word);
        }

        if (title.length > min_length && terminals.hasOwnProperty(word))
        {
            break;
        }
    }
    if (title.length < min_length)
    {
        return this.generate(min_length);
    }
    return title.join("");
};
