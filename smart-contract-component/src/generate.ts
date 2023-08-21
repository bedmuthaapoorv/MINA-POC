import { PrivateKey } from "snarkyjs";

// const privateKey=PrivateKey.random();
// const publicKey=privateKey.toPublicKey();

// console.log({
//     privateKey: privateKey.toBase58(),
//     publicKey: publicKey.toBase58()
// })
async function generateRandomNumber(){
    
    let token=-1
    await fetch("https://www.random.org/integers/?num=1&min=1&max=2000&col=1&base=10&format=plain&rnd=new").then(
        async (response)=>{
        await response.json().then((resp)=>{
            token=resp;
        })
    });
    // console.log(token)
    return token;
}

export default generateRandomNumber;

