import { PrivateKey, PublicKey } from "snarkyjs";
import sendCreds from "./generate.js";
// generate details and send them to LRA
const userPrivateKey=PrivateKey.random();
const userPublicKey=PublicKey.fromPrivateKey(userPrivateKey);

// console.log(userPublicKey.toBase58());
let data={
  "publicKey":userPublicKey.toBase58(),
  "method":"register"
}
// send details to LRA for registration
sendCreds(data);