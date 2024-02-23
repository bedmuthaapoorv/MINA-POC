import { PrivateKey, PublicKey } from "o1js";
const obj={
    'privateKey':'',
    'publicKey':''
};
const privateKey=PrivateKey.random();
obj['privateKey']=privateKey.toBase58()
obj['publicKey']=PublicKey.fromPrivateKey(privateKey).toBase58();
console.log(obj)