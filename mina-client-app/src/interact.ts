import { PrivateKey, PublicKey } from "snarkyjs";
import sendCreds from "./sendCredentials.js";
import { storeCert, isRegistered } from "./sendCredentials.js";
import { Mina, fetchAccount } from "snarkyjs";
import {Add} from "./Add.js";
import { Field } from "snarkyjs";
import * as fs from "fs"

const network=Mina.Network("https://proxy.berkeley.minaexplorer.com/graphql");
Mina.setActiveInstance(network);

if(!isRegistered()){
  // generate details and send them to LRA

  // <-- how to generate different public keys for different users -->
  const userPrivateKey=PrivateKey.fromBase58("EKEPq8s8smnFkAhtoXETkDdb3m4jhugqzx82eYo5RNcJ3fiLryPF");
  const userPublicKey=PublicKey.fromPrivateKey(userPrivateKey);
  const zkAppPrivateKey=PrivateKey.fromBase58("EKES1CPccEhxTr1JFkT3VXSSvvmbJC7Tsm18ZYEdYZeVgSY3xCfA");
  const zkAppPublicKey=PublicKey.fromBase58("B62qkHM2YKkgtLb6T66rTaxSFHvZ4ynKEtS29sTKCdBzPnPuGRaNPHJ");
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
  let cert= await sendCreds(data);
  if(cert!=null){
    console.log("registration successful");
    // store the certificate locally
    storeCert(cert);

    // send the certificate to mina network
    const zkApp=new Add(zkAppPublicKey);
    await fetchAccount({publicKey: zkAppPublicKey});
    // let resp=zkApp.UUID.get();
    // console.log(resp.toString());

    // compiles the smart contract code into a form that can be run on Mina runtime
    console.log("compiling...");
    await Add.compile();

    let certObj=JSON.parse(cert);
    const tx= await Mina.transaction({sender: userPublicKey, fee: 0.1e9},()=>{
      zkApp.update(Field(certObj["UUID"]), Field(certObj["token"]));
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
    const sentTx=await tx.sign([userPrivateKey, zkAppPrivateKey]).send();

    console.log("https://berkeley.minaexplorer.com/transaction/"+sentTx.hash());

  }else{
    console.log("registration unsuccessful");
  }
}else{
  console.log("local certificate exists");
  console.log("authenticating begins");
  console.log("sending self signed certificate to verifier");
  // <-- sign the certificate -->
  const jsonString = fs.readFileSync('./src/Certificate.json', 'utf-8');
  const cert=JSON.parse(jsonString);
  let data={
    "cert": cert,
    "method":"1",
  }
  // send cert to LRA
  let authenticationResponse=await sendCreds(data);
  // console.log(authenticationResponse);
  if(authenticationResponse=="true"){
    console.log("authentication successfull");
  }else{
    console.log("authentication unsuccessfull");
  }

}