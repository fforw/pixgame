import key from "keymaster"

key("p, shift+p", () => {
     try
     {
         console.log( "p", key.shift);
     }
     catch(e)
     {
         console.error(e);
     }
});

