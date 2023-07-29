import { Mina, PrivateKey, PublicKey, fetchAccount } from "snarkyjs";
import { Add } from "./Add.js";
// use the public key of testnet.json
// public key of SC->B62qrb3kjyBDocHy82c8S5JP15pdFUDfZ55o21eZoPAyBZkZBswVjxS
// public key of fee payer / me -> B62qjDesYoeySKnN4BmPKREXDMxXWaJ7WTGqAsRiSDhhQZCgu35Mmev

const network=Mina.Network("https://proxy.berkeley.minaexplorer.com/graphql");
Mina.setActiveInstance(network);

const appKey=PublicKey.fromBase58("B62qrb3kjyBDocHy82c8S5JP15pdFUDfZ55o21eZoPAyBZkZBswVjxS");
const zkApp=new Add(appKey);
await fetchAccount({publicKey: appKey});
console.log(zkApp.num.get().toString());

// creating user2apoorv
const user2privateKey=PrivateKey.fromBase58("EKDhgFpgBU3xR6VVz91Cb4MjZzexBoan3nrEgPytgXoWTM3ZyEyR");
const user2publicKey=PublicKey.fromBase58("B62qkk4AF8Wcq4zzUoCtzTVByj3iKJBMMpLqxJtFAUE7jVFQWvARsaE");

console.log("compiling...");
await Add.compile();

const tx=await Mina.transaction({sender: user2publicKey, fee: 0.1e9},()=>{
  zkApp.update();
});

console.log("proving...");
await tx.prove();

const sentTx=await tx.sign([user2privateKey]).send();

console.log("https://berkeley.minaexplorer.com/transaction/"+sentTx.hash());

