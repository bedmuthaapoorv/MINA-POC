import { Mina, PrivateKey, PublicKey, fetchAccount } from "snarkyjs";
import {Add} from "./Add.js";
import { Field } from "snarkyjs";
import generateRandomNumber from "./generate.js";
import updateMapping from "./updateMapping.js";
import { getNextUUID } from "./updateMapping.js";

console.log("initializing...");
// set the active network to be used
const network=Mina.Network("https://proxy.berkeley.minaexplorer.com/graphql");
Mina.setActiveInstance(network);
// public key of testnet i.e. account on which the smart contract is hosted
const appPrivateKey=PrivateKey.fromBase58("EKFHWjLs6fJ5hZPxiZBE7syr4XUL4CR7cYsMnorFDGXWZ7UKxE7h");
const appKey=PublicKey.fromBase58("B62qoU3sGZayG5Xgh2zr3iXrkjgj7zcu3FS3pfM7E6A6tUed2283c7w");

// private and public keys of LRA / apoorv
const lraPrivateKey=PrivateKey.fromBase58("EKF9GgrYH6qpxspwAE9vbq2RriMDHS4c3jvGqoitd6r9ko24Cx8M")
const lraPublicKey=PublicKey.fromBase58("B62qj2gEtKpRJuf8H1vSes1cAK4ZTWm9ZzPtCryXTrhsrqYDdb6idbK")

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
let resp=zkApp.UUID.get();
// console.log(resp.toString());

// we deploy a smart contract which is essentially our certificate
// once deployed LRA will update the smart contract with actual details of the device

// second users cred / device's public key
const user2privateKey=PrivateKey.fromBase58("EKEPq8s8smnFkAhtoXETkDdb3m4jhugqzx82eYo5RNcJ3fiLryPF");
const user2publicKey=PublicKey.fromBase58("B62qp4eRL3DABErEKrNt4wWWx8G17TuG1Q941qKsvMQVfXpA5fJQB4C");

// compiles the smart contract code into a form that can be run on Mina runtime
console.log("compiling...");
await Add.compile();

let token=await generateRandomNumber();
// transaction is created for updating the certificate with actual credentials
const tx= await Mina.transaction({sender: user2publicKey, fee: 0.1e9},()=>{
   zkApp.update(Field(getNextUUID()), Field(token));
});

// // The zk.prove function only checks that the computation that was performed on the local machine is correct.
// // The zk.prove function in Mina is used to generate a zero-knowledge proof.
// // A zero-knowledge proof is a cryptographic proof that allows one party to prove to another party that they know 
// // something without revealing any other information about what they know. * still not clear here
// // the smart contract code is run locally before proving. 
// // This is because the prover needs to know the output of the computation in order to generate the proof.

console.log("proving...");
await tx.prove();

// every transaction needs to be signed by private keys else it will fail the verification stage
const sentTx=await tx.sign([user2privateKey, appPrivateKey]).send();

console.log("https://berkeley.minaexplorer.com/transaction/"+sentTx.hash());

console.log("updating LRA mapping...");
// after successfull registration, update mapping
updateMapping(user2publicKey.toBase58(), appKey.toBase58());

