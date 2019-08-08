
export default function logger(name)
{
    let lastMessage;
    return msg => {

        if (msg !== lastMessage)
        {
            console.log(name, msg);
            lastMessage = msg;
        }
    }
}
