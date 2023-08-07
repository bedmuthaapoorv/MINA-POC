import { Mina, PrivateKey, PublicKey, fetchAccount } from "snarkyjs";
import {Add} from "./Add.js";
import { Field } from "snarkyjs";

// set the active network to be used
const network=Mina.Network("https://proxy.berkeley.minaexplorer.com/graphql");
Mina.setActiveInstance(network);
// public ket of testnet i.e. account on which the smart contract is hosted
const appKey=PublicKey.fromBase58("B62qqFoduSvQeMK5EdR3qezKWR2SMQ2C2DxK9wSVzdLe4fkwCCcJ47U");

// A zkApp, or zero-knowledge application, is a type of application that runs on the Mina blockchain.
// Add here is the smart contract which accepts the public key of smart contract account as parameter
// zkApp is basically an object / running instance of a Smart contract
const zkApp=new Add(appKey);

// The fetchAccount function in Mina is used to fetch the account information for a given address. 
// The account information includes the account's balance, nonce, and state root, etc
// The fetchAccount function in Mina is needed before accessing smart contract's fields 
// because the state of a smart contract is stored on the blockchain. 
// The fetchAccount function fetches the state of the smart contract from the blockchain 
// and updates the state of the smart contract in the local environment.
await fetchAccount({publicKey: appKey});
let resp=zkApp.device.get();
console.log(resp.UUID.toString());

// // second users cred
// const user2privateKey=PrivateKey.fromBase58("EKEPq8s8smnFkAhtoXETkDdb3m4jhugqzx82eYo5RNcJ3fiLryPF");
// const user2publicKey=PublicKey.fromBase58("B62qp4eRL3DABErEKrNt4wWWx8G17TuG1Q941qKsvMQVfXpA5fJQB4C");

// // compiles the smart contract code into a form that can be run on Mina runtime
// console.log("compiling...");
// await Add.compile();

// // transaction is created
// const tx= await Mina.transaction({sender: user2publicKey, fee: 0.1e9},()=>{
//   zkApp.update();
// });

// // The zk.prove function only checks that the computation that was performed on the local machine is correct.
// // The zk.prove function in Mina is used to generate a zero-knowledge proof.
// // A zero-knowledge proof is a cryptographic proof that allows one party to prove to another party that they know 
// // something without revealing any other information about what they know. * still not clear here
// // the smart contract code is run locally before proving. 
// // This is because the prover needs to know the output of the computation in order to generate the proof.

// console.log("proving...");
// await tx.prove();

// const sentTx=await tx.sign([user2privateKey]).send();

// console.log("https://berkeley.minaexplorer.com/transaction/"+sentTx.hash());



