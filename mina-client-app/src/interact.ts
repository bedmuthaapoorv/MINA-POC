import { PrivateKey, PublicKey } from "o1js";
import sendCreds from "./sendCredentials.js";
import { storeCert, isRegistered } from "./sendCredentials.js";
import { Mina, fetchAccount } from "o1js";
import {Add} from "./Add.js";
import { Field } from "o1js";
import * as fs from "fs"

const network=Mina.Network("https://proxy.berkeley.minaexplorer.com/graphql");
Mina.setActiveInstance(network);
//const outputLog = fs.createWriteStream('./log.txt');
//const consoler = new console.Console(outputLog);
if(!isRegistered()){
  console.time('registration');
  // generate details and send them to LRA
  console.log("registering");
  //consoler.log("registering");
  // <-- how to generate different public keys for different users -->
  const userPrivateKey=PrivateKey.fromBase58("EKEf3ggiq1z7e4vPhYguR4twEnV9HQTZHKynbUTW9RAHCc2jUY9Y");
  const userPublicKey=PublicKey.fromPrivateKey(userPrivateKey);
  const zkAppPrivateKey=PrivateKey.fromBase58("EKFFyeM2JN8zmc7gwB3YwbEDLpznUarUszMnfHfvsYpcmAbkg9KT");
  const zkAppPublicKey=PublicKey.fromBase58("B62qqatwGPDMAMKMUAvVW2H6mzNcYM9pJRV1jsz8WvhKD4MxCXjEqe1");
  // private and public keys of LRA / apoorv
  const lraPrivateKey=PrivateKey.fromBase58("EKF9GgrYH6qpxspwAE9vbq2RriMDHS4c3jvGqoitd6r9ko24Cx8M")
  const lraPublicKey=PublicKey.fromBase58("B62qj2gEtKpRJuf8H1vSes1cAK4ZTWm9ZzPtCryXTrhsrqYDdb6idbK")

  // console.log(userPublicKey.toBase58());

  // method: 0 -> register
  // method: 1 -> authenticate
  let data={
    "publicKey": userPublicKey.toBase58(),
    "method":0,
    "zkAppPublicKey": zkAppPublicKey.toBase58()
  }
  // send details to LRA for registration
  console.log("sent details to verifier");
  //consoler.log("sent details to verifier");
  
  let cert= await sendCreds(data);
  if(cert!=null){
    //console.log("registration successful");
    console.log("registration successful");
    // store the certificate locally
    storeCert(cert);

    // send the certificate to mina network
    const zkApp=new Add(zkAppPublicKey);
    await fetchAccount({publicKey: zkAppPublicKey});
    // let resp=zkApp.UUID.get();
    // console.log(resp.toString());

    // compiles the smart contract code into a form that can be run on Mina runtime
    console.log("compiling the certificate");
    //consoler.log("compiling the certificate");
    await Add.compile();

    let certObj=JSON.parse(cert);
    console.log("building a storage request for blockchain")
    //consoler.log("building a storage request for blockchain")
    const tx= await Mina.transaction({sender: userPublicKey, fee: 0.1e9},()=>{
      zkApp.update(Field(certObj["UUID"]), Field(certObj["token"]));
    });

    // // The zk.prove function only checks that the computation that was performed on the local machine is correct.
    // // The zk.prove function in Mina is used to generate a zero-knowledge proof.
    // // A zero-knowledge proof is a cryptographic proof that allows one party to prove to another party that they know 
    // // something without revealing any other information about what they know. * still not clear here
    // // the smart contract code is run locally before proving. 
    // // This is because the prover needs to know the output of the computation in order to generate the proof.

    console.log("verifying the storage request for blockchain");
    //consoler.log("verifying the storage request for blockchain");
    
    await tx.prove();

    // every transaction needs to be signed by private keys else it will fail the verification stage
    // console.log("storing the certificate on blockchain");
    //consoler.log("storing the certificate on blockchain");
    
    const sentTx=await tx.sign([userPrivateKey, zkAppPrivateKey]).send();

    console.log("https://berkeley.minaexplorer.com/transaction/"+sentTx.hash());
    //consoler.log("https://berkeley.minaexplorer.com/transaction/"+sentTx.hash());

  }else{
    console.log("registration unsuccessful");
    //consoler.log("registration unsuccessful");
  }
  console.timeEnd('registration');
}else{
  
  console.log("local certificate exists");
  console.log("authenticating begins");
  console.log("sending self signed certificate to verifier");
  //consoler.log("local certificate exists");
  //consoler.log("authenticating begins");
  //consoler.log("sending self signed certificate to verifier");
  
  // <-- sign the certificate -->
  const jsonString = fs.readFileSync('./src/Certificate.json', 'utf-8');
  const cert=JSON.parse(jsonString);
  let data={
    "cert": cert,
    "method":1,
  }
  // send cert to LRA
  //console.time('http request & response');
  let authenticationResponse=await sendCreds(data);
  //console.timeEnd('http request & response');
  // console.log(authenticationResponse);
  if(authenticationResponse=="true"){
    console.log("authentication successfull");
    //consoler.log("authentication successfull");
  }else{
    //console.log("authentication unsuccessfull");
    console.log("authentication unsuccessfull");
  }
}