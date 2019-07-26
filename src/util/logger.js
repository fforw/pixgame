
let lastMessage;
export default function logger(name)
{
    return msg => {

        if (msg !== lastMessage)
        {
            console.log(name, msg);
            lastMessage = msg;
        }
    }
}
