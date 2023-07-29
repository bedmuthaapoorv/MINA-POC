import { PrivateKey, PublicKey } from "snarkyjs";

const privateKey=PrivateKey.random();
const publicKey=privateKey.toPublicKey();

console.log({
    privateKey: privateKey.toBase58(),
    publicKey: publicKey.toBase58()
})