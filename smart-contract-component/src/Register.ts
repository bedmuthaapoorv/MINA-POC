import generateRandomNumber from "./generate.js";
import updateMapping, { getNextUUID } from "./updateMapping.js";
import { Mina } from "snarkyjs";


async function register(data: Object){
    // console.log(JSON.stringify(data));
    // user2privateKey=data["publicKey"]
    
    // <--validation code--> -> check if the publickey, zkAppPublicKey already exists in mapping
    // once data is received it is validated
    // create a certificate
    let cert=await createCertificate(data);
    // generate App key
    let dataJSON=JSON.parse(JSON.stringify(data))
    
    // updateMapping(data["publicKey"]);
    updateMapping(dataJSON["publicKey"],dataJSON["zkAppPublicKey"]);
    return cert;
}
async function createCertificate(data: Object){
    let token=await generateRandomNumber();
    let certificate={
        "UUID": getNextUUID(),
        "token": token
    }
    return certificate;
}
export default register;