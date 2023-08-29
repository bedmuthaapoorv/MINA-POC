import generateRandomNumber from "./generate.js";
import updateMapping, { getNextUUID, getCredFromMapping } from "./updateMapping.js";
import { Mina, PublicKey, fetchAccount } from "snarkyjs";
import { Add } from "./Add.js";

async function register(data: Object){
    // console.log(JSON.stringify(data));
    // user2privateKey=data["publicKey"]
    
    // <--validation code--> -> check if the publickey, zkAppPublicKey already exists in mapping
    // once data is received it is validated
    // create a certificate
    let cert=await createCertificate(data);
    let dataJSON=JSON.parse(JSON.stringify(data))
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

async function authenticate(data: Object) {
    // <-- decrypt the signed token -->

    let dataJSON=JSON.parse(JSON.stringify(data))
    // extract the UUID from cert
    let uuid=dataJSON["cert"]["UUID"];
    let mappingData=getCredFromMapping(uuid);
    let zkAppPublicKey=mappingData["appPublicKey"];

    console.log("fetching details from blockchain...");
    // set the active network to be used
    const network=Mina.Network("https://proxy.berkeley.minaexplorer.com/graphql");
    Mina.setActiveInstance(network);
    let appKey=PublicKey.fromBase58(zkAppPublicKey);
    const zkApp=new Add(appKey);
    // The fetchAccount function in Mina is used to fetch the account information for a given address. 
    // The account information includes the account's balance, nonce, and state root, etc
    // The fetchAccount function in Mina is needed before accessing smart contract's fields 
    // because the state of a smart contract is stored on the blockchain. 
    // The fetchAccount function fetches the state of the smart contract from the blockchain 
    // and updates the state of the smart contract in the local environment.
    await fetchAccount({publicKey: appKey});
    let resp=zkApp.hashToken.get();
    // console.log(dataJSON["cert"]["token"]==resp);
    // console.log(resp.toString());
    console.log("response sent: "+(dataJSON["cert"]["token"]==resp));
    if(dataJSON["cert"]["token"]==resp){
        return true;
    }else{
        return false;
    }
}
export {authenticate};
export default register;